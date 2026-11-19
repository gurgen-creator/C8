import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

interface Booking {
  id: string;
  client_name?: string;
  client_phone?: string;
  car_model?: string;
  service_name?: string;
  booking_date?: string;
  booking_time?: string;
  status: string;
  created_at: string;
}

interface Service {
  id: string;
  name: string;
  price: number;
  duration_minutes?: number;
}

export const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const [tab, setTab] = useState<'bookings' | 'services'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  // New Service state
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceDuration] = useState('60');

  const ADMIN_PIN = '8888';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setIsAuthenticated(true);
      setError('');
      loadData();
    } else {
      setError('Неверный PIN-код администратора');
    }
  };

  const loadData = async () => {
    setLoading(true);
    let allBookings: Booking[] = [];

    // 1. Загрузка из Supabase
    try {
      const [bookingsRes, servicesRes] = await Promise.all([
        supabase.from('bookings').select('*').order('created_at', { ascending: false }),
        supabase.from('services').select('*').order('name'),
      ]);

      if (bookingsRes.data) {
        allBookings = bookingsRes.data;
      }
      if (servicesRes.data) {
        setServices(servicesRes.data);
      }
    } catch (err) {
      console.warn('Supabase fetch failed, relying on local backup:', err);
    }

    // 2. Загрузка из локального хранилища (гарантия отображения, даже если сеть сбоила)
    try {
      const local = JSON.parse(localStorage.getItem('c8_offline_bookings') || '[]');
      if (local.length > 0) {
        // Объединяем без дубликатов по id
        const ids = new Set(allBookings.map((b) => b.id));
        for (const b of local) {
          if (!ids.has(b.id)) {
            allBookings.push(b);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }

    setBookings(allBookings);
    setLoading(false);
  };

  const updateBookingStatus = async (id: string, newStatus: string) => {
    // Обновляем локально сразу
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );

    // Пытаемся обновить в Supabase
    try {
      await supabase.from('bookings').update({ status: newStatus }).eq('id', id);
    } catch (err) {
      console.error('Failed to update status in Supabase:', err);
    }

    // Обновляем в локальном хранилище
    try {
      const local = JSON.parse(localStorage.getItem('c8_offline_bookings') || '[]');
      const updated = local.map((b: Booking) => (b.id === id ? { ...b, status: newStatus } : b));
      localStorage.setItem('c8_offline_bookings', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName || !newServicePrice) return;

    try {
      const { data, error } = await supabase.from('services').insert([
        {
          name: newServiceName,
          price: parseFloat(newServicePrice),
          duration_minutes: parseInt(newServiceDuration) || 60,
        },
      ]).select();

      if (error) throw error;
      if (data) {
        setServices((prev) => [...prev, ...data]);
        setNewServiceName('');
        setNewServicePrice('');
      }
    } catch (err) {
      console.error('Failed to add service:', err);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!window.confirm('Удалить эту услугу?')) return;
    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Failed to delete service:', err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-6 p-6 bg-[#09152a] border border-[#00f0ff]/30 rounded-2xl shadow-2xl text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-[#00f0ff] text-black flex items-center justify-center font-black text-xl shadow-lg shadow-[#00f0ff]/20">
          🔒
        </div>
        <h2 className="text-xl font-bold text-white mb-1">Панель управления C8</h2>
        <p className="text-xs text-gray-400 mb-5">Введите PIN-код для входа</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-3.5">
          <Input
            label="PIN-код"
            type="password"
            placeholder="8888"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
            className="text-center tracking-widest text-lg"
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <Button type="submit" className="w-full py-3 bg-[#00f0ff] text-black font-black uppercase text-xs rounded-xl">
            Войти в систему
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto my-2">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#00f0ff]/15">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-1.5">
            ⚙️ Админка <span className="text-[#00f0ff]">C8 Мойка</span>
          </h2>
          <p className="text-[10px] text-gray-400">Управление заявками</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab('bookings')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              tab === 'bookings'
                ? 'bg-[#00f0ff] text-black'
                : 'bg-[#09152a] text-gray-300'
            }`}
          >
            📋 Заявки ({bookings.length})
          </button>
          <button
            onClick={() => setTab('services')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              tab === 'services'
                ? 'bg-[#00f0ff] text-black'
                : 'bg-[#09152a] text-gray-300'
            }`}
          >
            💰 Прайс
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="p-1.5 bg-red-950/40 text-red-400 border border-red-500/30 rounded-xl text-xs"
            title="Выход"
          >
            ✕
          </button>
        </div>
      </div>

      {loading && <div className="text-center py-6 text-[#00f0ff] text-xs">Загрузка...</div>}

      {/* Tab: Bookings */}
      {tab === 'bookings' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Все заявки</h3>
            <button
              onClick={loadData}
              className="text-[11px] text-[#00f0ff] hover:underline"
            >
              🔄 Обновить
            </button>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-10 bg-[#09152a]/60 rounded-2xl border border-[#00f0ff]/15 text-gray-400 text-xs">
              Заявок пока нет. Заполните форму онлайн-записи на сайте для проверки.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {bookings.map((b) => (
                <Card
                  key={b.id}
                  className="bg-[#09152a] border border-[#00f0ff]/25 p-4 rounded-2xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-gray-400 font-mono">
                        {b.created_at ? new Date(b.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
                          b.status === 'completed'
                            ? 'bg-green-500/20 text-green-300'
                            : b.status === 'confirmed'
                            ? 'bg-cyan-500/20 text-cyan-300'
                            : b.status === 'cancelled'
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}
                      >
                        {b.status === 'completed'
                          ? 'Готово'
                          : b.status === 'confirmed'
                          ? 'Подтверждено'
                          : b.status === 'cancelled'
                          ? 'Отмена'
                          : 'В ожидании'}
                      </span>
                    </div>

                    <h4 className="text-base font-black text-white">
                      {b.client_name || 'Клиент'}
                    </h4>
                    <a 
                      href={`tel:${b.client_phone}`}
                      className="text-[#00f0ff] text-xs font-bold mb-1.5 inline-block"
                    >
                      📞 {b.client_phone || 'Номер не указан'}
                    </a>

                    <div className="text-[11px] text-gray-300 space-y-0.5 bg-[#050c18] p-2.5 rounded-xl border border-white/5 mb-3">
                      {b.service_name && <p>✨ Услуга: <span className="text-white font-medium">{b.service_name}</span></p>}
                      {b.car_model && <p>🚗 Авто: <span className="text-white font-medium">{b.car_model}</span></p>}
                      <p>📅 Дата: <span className="text-white font-medium">{b.booking_date || '—'}</span> в <span className="text-white font-medium">{b.booking_time || '—'}</span></p>
                    </div>
                  </div>

                  {/* Quick Action buttons */}
                  <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-white/5 text-[11px]">
                    <button
                      onClick={() => updateBookingStatus(b.id, 'confirmed')}
                      className="py-1 bg-cyan-600/30 text-cyan-200 rounded-lg font-bold"
                    >
                      Принять
                    </button>
                    <button
                      onClick={() => updateBookingStatus(b.id, 'completed')}
                      className="py-1 bg-green-600/30 text-green-200 rounded-lg font-bold"
                    >
                      Готово
                    </button>
                    <button
                      onClick={() => updateBookingStatus(b.id, 'cancelled')}
                      className="py-1 bg-red-600/30 text-red-200 rounded-lg font-bold"
                    >
                      Отмена
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Services */}
      {tab === 'services' && (
        <div className="space-y-4">
          <div className="bg-[#09152a] border border-[#00f0ff]/20 p-4 rounded-2xl">
            <h3 className="text-xs font-bold text-white mb-3 uppercase tracking-wider">Добавить услугу</h3>
            <form onSubmit={handleAddService} className="flex flex-col gap-2.5">
              <Input
                label="Название"
                placeholder="Мойка"
                value={newServiceName}
                onChange={(e) => setNewServiceName(e.target.value)}
                required
              />
              <Input
                label="Цена (₽)"
                type="number"
                placeholder="1500"
                value={newServicePrice}
                onChange={(e) => setNewServicePrice(e.target.value)}
                required
              />
              <Button type="submit" className="w-full mt-1 py-2 text-xs">
                Сохранить в прайс
              </Button>
            </form>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Текущий прайс</h3>
            {services.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 bg-[#09152a] border border-[#00f0ff]/15 rounded-xl text-xs"
              >
                <div>
                  <h4 className="font-bold text-white">{s.name}</h4>
                  <p className="text-[10px] text-gray-400">{s.duration_minutes || 60} мин.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-[#00f0ff]">{s.price} ₽</span>
                  <button
                    onClick={() => handleDeleteService(s.id)}
                    className="text-red-400 p-1"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
