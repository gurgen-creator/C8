import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Button } from './Button';
import { Input } from './Input';

interface Service {
  id: string;
  name: string;
}

export const BookingForm: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase.from('services').select('id, name');
      setServices(data || []);
    };
    fetchServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    const { error } = await supabase.from('bookings').insert([
      { service_id: selectedService, booking_date: date, booking_time: time }
    ]);

    if (error) {
      setStatus('error');
      setMessage('Failed to book. Please try again.');
    } else {
      setStatus('success');
      setMessage('Booking successful!');
      setSelectedService('');
      setDate('');
      setTime('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg border border-neon-cyan/20 flex flex-col gap-4">
      <h2 className="text-xl font-bold text-neon-cyan">Book a Service</h2>
      
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-white">Select Service</label>
        <select 
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="px-3 py-2 bg-deep-blue border border-neon-cyan/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan"
          required
        >
          <option value="">Select a service</option>
          {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <Input label="Time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />

      <Button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Booking...' : 'Confirm Booking'}
      </Button>

      {message && (
        <p className={`text-sm ${status === 'success' ? 'text-neon-cyan' : 'text-red-400'}`}>
          {message}
        </p>
      )}
    </form>
  );
};
