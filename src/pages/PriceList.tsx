import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Card } from '../components/Card';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
}

export const PriceList: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*');

        if (error) throw error;
        setServices(data || []);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) return <div className="text-neon-cyan p-10 text-center">Loading services...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-neon-cyan">{service.name}</h2>
            <p className="text-gray-300">{service.description}</p>
            <div className="text-lg font-bold text-white mt-auto">${service.price}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};
