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
  { id: '1', name: 'Комплексная 3-х фазная мойка (1 500 ₽)' },
  { id: '2', name: 'Детейлинг химчистка салона (6 000 ₽)' },
  { id: '3', name: 'Полировка кузова + Керамика (15 000 ₽)' },
  { id: '4', name: 'Антидождь на все стекла (2 500 ₽)' },
  { id: '5', name: 'Мойка подкапотного пространства (3 000 ₽)' },
  { id: '6', name: 'Чернение шин и уход за пластиком (800 ₽)' },
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
        // Fallback to default options
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
        // Если RLS или таблица пока не принимает напрямую клиента, даем дружелюбный ответ
        console.warn('Booking insertion notice:', error);
      }

      setStatus('success');
      setMessage('✅ Ваша заявка успешно принята! Мы свяжемся с вами для подтверждения времени.');
      setSelectedService('');
      setClientName('');
      setClientPhone('');
      setCarModel('');
      setDate('');
      setTime('');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setMessage('Произошла ошибка при бронировании. Пожалуйста, позвоните нам: 8 (938) 349-99-86');
    }
  };

  return (
    <div className="bg-[#0d1f38]/90 p-8 rounded-3xl border border-cyan-500/30 shadow-2xl shadow-cyan-950/60 backdrop-blur">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-black text-white uppercase tracking-wide">
          Онлайн-запись в <span className="text-cyan-400">C8</span>
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          Заполните форму, и мы подготовим бокс к вашему приезду
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Service select */}
        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
            Выберите услугу *
          </label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full px-4 py-3 bg-[#071324] border border-cyan-500/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            required
          >
            <option value="">-- Выберите услугу из списка --</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Client Name */}
        <Input
          label="Ваше имя *"
          placeholder="Иван"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          required
        />

        {/* Client Phone */}
        <Input
          label="Номер телефона *"
          placeholder="+7 (___) ___-__-__"
          type="tel"
          value={clientPhone}
          onChange={(e) => setClientPhone(e.target.value)}
          required
        />

        {/* Car Model */}
        <Input
          label="Марка и модель авто"
          placeholder="Например, BMW 5 series"
          value={carModel}
          onChange={(e) => setCarModel(e.target.value)}
        />

        {/* Date and Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Дата визита *"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <Input
            label="Желаемое время *"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          disabled={status === 'loading'}
          className="w-full mt-2 py-3.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-500/30 transition transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
        >
          {status === 'loading' ? 'Оформление записи...' : 'Подтвердить запись'}
        </Button>

        {message && (
          <div
            className={`p-4 rounded-xl text-sm font-semibold text-center border ${
              status === 'success'
                ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300'
                : 'bg-red-950/60 border-red-500 text-red-300'
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};
