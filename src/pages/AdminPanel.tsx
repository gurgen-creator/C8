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
  booking_date?: string;
  booking_time?: string;
  service_id?: string;
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
  const [newServiceDuration, setNewServiceDuration] = useState('60');

  const ADMIN_PIN = '8888'; // Простой защитный пин-код для входа

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
    try {
      const [bookingsRes, servicesRes] = await Promise.all([
        supabase.from('bookings').select('*').order('created_at', { ascending: false }),
        supabase.from('services').select('*').order('name'),
      ]);

      if (bookingsRes.data) setBookings(bookingsRes.data);
      if (servicesRes.data) setServices(servicesRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      console.error('Failed to update status:', err);
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
      <div className="max-w-md mx-auto my-12 p-8 bg-[#0a192f] border border-cyan-500/30 rounded-3xl shadow-2xl text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-cyan-400 text-black flex items-center justify-center font-black text-2xl shadow-lg shadow-cyan-400/20">
          🔒
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Панель управления C8</h2>
        <p className="text-xs text-gray-400 mb-6">Введите PIN-код администратора для доступа</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <Input
            label="PIN-код администратора"
            type="password"
            placeholder="По умолчанию 8888"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
            className="text-center tracking-widest text-xl"
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <Button type="submit" className="w-full">
            Войти в систему
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto my-6 p-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between pb-6 mb-6 border-b border-cyan-500/20 gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            ⚙️ Админ-панель <span className="text-cyan-400">C8 Мойка</span>
          </h2>
          <p className="text-xs text-gray-400">Управление заявками и тарифами в реальном времени</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab('bookings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              tab === 'bookings'
                ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-500/30'
                : 'bg-[#0a192f] text-gray-300 hover:text-white'
            }`}
          >
            📋 Заявки ({bookings.length})
          </button>
          <button
            onClick={() => setTab('services')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              tab === 'services'
                ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-500/30'
                : 'bg-[#0a192f] text-gray-300 hover:text-white'
            }`}
          >
            💰 Прайс-лист ({services.length})
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-3 py-2 bg-red-950/40 text-red-400 border border-red-500/30 hover:bg-red-900/60 rounded-xl text-xs font-semibold transition"
          >
            Выйти
          </button>
        </div>
      </div>

      {loading && <div className="text-center py-10 text-cyan-400">Загрузка данных...</div>}

      {/* Tab: Bookings */}
      {tab === 'bookings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-white">Список записей клиентов</h3>
            <button
              onClick={loadData}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
            >
              🔄 Обновить данные
            </button>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-12 bg-[#0a192f]/50 rounded-2xl border border-cyan-500/10 text-gray-400 text-sm">
              Пока нет новых заявок на мойку. Они появятся здесь сразу после заполнения формы на сайте.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookings.map((b) => (
                <Card
                  key={b.id}
                  className="bg-[#0b172a] border border-cyan-500/20 p-5 rounded-2xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-gray-400">
                        {new Date(b.created_at).toLocaleDateString('ru-RU')} {new Date(b.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                          b.status === 'completed'
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                            : b.status === 'confirmed'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : b.status === 'cancelled'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        }`}
                      >
                        {b.status === 'completed'
                          ? 'Завершена'
                          : b.status === 'confirmed'
                          ? 'Подтверждена'
                          : b.status === 'cancelled'
                          ? 'Отменена'
                          : 'В ожидании'}
                      </span>
                    </div>

                    <h4 className="text-lg font-extrabold text-white mb-1">
                      {b.client_name || 'Гость'}
                    </h4>
                    <p className="text-cyan-400 text-sm font-semibold mb-2">
                      📞 {b.client_phone || 'Телефон не указан'}
                    </p>

                    <div className="text-xs text-gray-300 space-y-1 bg-[#060e1c] p-3 rounded-xl border border-cyan-500/10 mb-4">
                      {b.car_model && <p>🚗 Авто: <span className="text-white font-medium">{b.car_model}</span></p>}
                      <p>📅 Дата: <span className="text-white font-medium">{b.booking_date || 'Не указана'}</span></p>
                      <p>⏰ Время: <span className="text-white font-medium">{b.booking_time || 'Не указано'}</span></p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-cyan-500/10 text-xs">
                    <button
                      onClick={() => updateBookingStatus(b.id, 'confirmed')}
                      className="py-1.5 bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 rounded-lg transition font-medium"
                    >
                      Подтвердить
                    </button>
                    <button
                      onClick={() => updateBookingStatus(b.id, 'completed')}
                      className="py-1.5 bg-green-600/30 hover:bg-green-600/50 text-green-200 rounded-lg transition font-medium"
                    >
                      Готово
                    </button>
                    <button
                      onClick={() => updateBookingStatus(b.id, 'cancelled')}
                      className="py-1.5 bg-red-600/30 hover:bg-red-600/50 text-red-200 rounded-lg transition font-medium"
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Service Form */}
          <div className="bg-[#0b172a] border border-cyan-500/20 p-6 rounded-2xl h-fit">
            <h3 className="text-lg font-bold text-white mb-4">Добавить новую услугу</h3>
            <form onSubmit={handleAddService} className="flex flex-col gap-4">
              <Input
                label="Название услуги"
                placeholder="Например: Мойка кузова"
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
              <Input
                label="Длительность (минут)"
                type="number"
                placeholder="60"
                value={newServiceDuration}
                onChange={(e) => setNewServiceDuration(e.target.value)}
              />
              <Button type="submit" className="w-full mt-2">
                Добавить в прайс
              </Button>
            </form>
          </div>

          {/* Existing Services List */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-lg font-bold text-white mb-4">Текущий прайс в базе</h3>
            {services.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-4 bg-[#0a192f] border border-cyan-500/20 rounded-xl"
              >
                <div>
                  <h4 className="font-bold text-white">{s.name}</h4>
                  <p className="text-xs text-gray-400">{s.duration_minutes || 60} мин.</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-black text-cyan-400">{s.price} ₽</span>
                  <button
                    onClick={() => handleDeleteService(s.id)}
                    className="text-red-400 hover:text-red-300 text-sm p-1.5 hover:bg-red-950/40 rounded-lg transition"
                    title="Удалить"
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
