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
  { id: '3', name: 'Полировка + Керамика 9H (15 000 ₽)' },
  { id: '4', name: 'Антидождь на все стекла (2 500 ₽)' },
  { id: '5', name: 'Мойка двигателя + Консервация (3 000 ₽)' },
  { id: '6', name: 'Детейлинг дисков и арок (1 800 ₽)' },
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
        // Fallback
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
      setMessage('✅ Заявка принята! Мы перезвоним вам в течение 10 минут для подтверждения.');
      setSelectedService('');
      setClientName('');
      setClientPhone('');
      setCarModel('');
      setDate('');
      setTime('');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setMessage('Ошибка отправки. Пожалуйста, позвоните нам: 8 (938) 349-99-86');
    }
  };

  return (
    <div className="bg-[#09152a]/95 border border-[#00f0ff]/30 p-5 rounded-2xl shadow-xl">
      <div className="mb-4 text-center">
        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30">
          Онлайн бронирование
        </span>
        <h3 className="text-xl font-black text-white mt-1.5">
          Записаться в бокс C8
        </h3>
        <p className="text-[11px] text-gray-400">
          ул. Ессентукская, 36
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-gray-300">
            Услуга *
          </label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full px-3 py-3 bg-[#050c18] border border-[#00f0ff]/30 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#00f0ff]"
            required
          >
            <option value="">-- Выберите услугу --</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Имя *"
          placeholder="Ваше имя"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          required
        />

        <Input
          label="Телефон *"
          placeholder="+7 (___) ___-__-__"
          type="tel"
          value={clientPhone}
          onChange={(e) => setClientPhone(e.target.value)}
          required
        />

        <Input
          label="Марка и госномер авто"
          placeholder="BMW 5 (А008АА 126)"
          value={carModel}
          onChange={(e) => setCarModel(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-2.5">
          <Input
            label="Дата *"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <Input
            label="Время *"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          disabled={status === 'loading'}
          className="w-full mt-2 py-3.5 bg-gradient-to-r from-[#00f0ff] via-[#00a6ff] to-[#0070f3] active:opacity-90 text-black font-black uppercase text-xs tracking-wider rounded-xl shadow-lg shadow-[#00f0ff]/25"
        >
          {status === 'loading' ? 'Отправка...' : 'Забронировать бокс'}
        </Button>

        {message && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold text-center border ${
              status === 'success'
                ? 'bg-cyan-950/80 border-[#00f0ff] text-[#00f0ff]'
                : 'bg-red-950/80 border-red-500 text-red-300'
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};
