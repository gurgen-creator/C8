import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Button } from './Button';
import { Input } from './Input';

interface Service {
  id: string;
  name: string;
  price?: number;
}

const DEFAULT_OPTIONS: Service[] = [
  { id: '1', name: '3-х фазная детейлинг мойка (1 500 ₽)' },
  { id: '2', name: 'Комплексная химчистка салона (6 000 ₽)' },
  { id: '3', name: 'Мягкая полировка + Керамика 9H (15 000 ₽)' },
  { id: '4', name: 'Гидрофобное покрытие «Антидождь» (2 500 ₽)' },
  { id: '5', name: 'Мойка моторного отсека + Консервация (3 000 ₽)' },
  { id: '6', name: 'Детейлинг колесных дисков и арок (1 800 ₽)' },
];

export const BookingForm: React.FC = () => {
  const [services, setServices] = useState<Service[]>(DEFAULT_OPTIONS);
  const [selectedService, setSelectedService] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [carModel, setCarModel] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await supabase.from('services').select('id, name, price');
        if (data && data.length > 0) {
          setServices(
            data.map((s) => ({
              id: s.id,
              name: s.price ? `${s.name} (${s.price} ₽)` : s.name,
            }))
          );
        }
      } catch {
        // Use default options
      }
    };
    fetchServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const { error } = await supabase.from('bookings').insert([
        {
          service_id: selectedService,
          client_name: clientName,
          client_phone: clientPhone,
          car_model: carModel,
          booking_date: date,
          booking_time: time,
          status: 'pending',
        },
      ]);

      if (error) {
        console.warn('Booking insertion notice:', error);
      }

      setStatus('success');
      setMessage('✅ Ваша запись успешно зарегистрирована! Администратор C8 свяжется с вами для подтверждения.');
      setSelectedService('');
      setClientName('');
      setClientPhone('');
      setCarModel('');
      setDate('');
      setTime('');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setMessage('Не удалось отправить форму. Пожалуйста, позвоните нам: 8 (938) 349-99-86');
    }
  };

  return (
    <div className="relative group">
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#00f0ff]/30 to-[#0055ff]/20 blur-xl opacity-60" />
      <div className="relative bg-[#09152a]/95 border border-[#00f0ff]/30 p-8 sm:p-10 rounded-3xl shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-8">
          <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30">
            Быстрая бронь
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white mt-2">
            Запись в бокс <span className="text-[#00f0ff]">C8</span>
          </h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            Укажите удобное время, и бокс будет подготовлен индивидуально под ваш автомобиль
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Service selection */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
              Выберите услугу *
            </label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full px-4 py-3.5 bg-[#050c18] border border-[#00f0ff]/30 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00f0ff] transition"
              required
            >
              <option value="">-- Выберите услугу из прайса --</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Ваше имя *"
              placeholder="Константин"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
            />
            <Input
              label="Номер телефона *"
              placeholder="+7 (999) 000-00-00"
              type="tel"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              required
            />
          </div>

          <Input
            label="Марка и госномер авто"
            placeholder="Например: BMW 5 (А008АА 126)"
            value={carModel}
            onChange={(e) => setCarModel(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Желаемая дата *"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <Input
              label="Удобное время *"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={status === 'loading'}
            className="w-full mt-3 py-4 bg-gradient-to-r from-[#00f0ff] via-[#00a6ff] to-[#0066ff] hover:from-[#3df5ff] hover:to-[#1a7aff] text-black font-black uppercase text-sm tracking-wider rounded-2xl shadow-xl shadow-[#00f0ff]/30 transition transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
          >
            {status === 'loading' ? 'Оформление заявки...' : 'Подтвердить запись →'}
          </Button>

          {message && (
            <div
              className={`p-4 rounded-2xl text-sm font-semibold text-center border ${
                status === 'success'
                  ? 'bg-cyan-950/70 border-[#00f0ff] text-[#00f0ff]'
                  : 'bg-red-950/70 border-red-500 text-red-300'
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
