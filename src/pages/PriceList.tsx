import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Card } from '../components/Card';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
}

const DEFAULT_SERVICES: Service[] = [
  {
    id: '1',
    name: '3-х фазная детейлинг мойка',
    description: 'Бесконтактный состав + ручная мойка pH-нейтральным шампунем + гидрофобный воск и турбосушка.',
    price: 1500,
  },
  {
    id: '2',
    name: 'Комплексная химчистка салона',
    description: 'Глубокая торнадор-очистка кресел, ковролина, потолка и пластика с озонированием.',
    price: 6000,
  },
  {
    id: '3',
    name: 'Полировка + Керамика 9H',
    description: 'Устранение царапин и паутинки, зеркальный блеск и защита кузова твердой керамикой.',
    price: 15000,
  },
  {
    id: '4',
    name: 'Антидождь на все стекла',
    description: 'Стойкое водоотталкивающее покрытие. Вода и грязь сдуваются на скорости от 50 км/ч.',
    price: 2500,
  },
  {
    id: '5',
    name: 'Мойка двигателя + Консервация',
    description: 'Безопасная очистка диэлектриком без залива датчиков с консервацией защитным лаком.',
    price: 3000,
  },
  {
    id: '6',
    name: 'Детейлинг дисков и арок',
    description: 'Удаление битума и нагара колодок, глубокая очистка резины и сатиновое чернение.',
    price: 1800,
  },
];

interface PriceListProps {
  onSelectService?: (serviceName: string) => void;
}

export const PriceList: React.FC<PriceListProps> = ({ onSelectService }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase.from('services').select('*');
        if (error || !data || data.length === 0) {
          setServices(DEFAULT_SERVICES);
        } else {
          setServices(data);
        }
      } catch {
        setServices(DEFAULT_SERVICES);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="text-[#00f0ff] py-12 text-center animate-pulse text-sm font-semibold">
        Загрузка услуг C8...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {services.map((service, index) => (
        <Card
          key={service.id || index}
          className="relative p-4 rounded-2xl bg-[#09152a]/95 border border-[#00f0ff]/20 active:border-[#00f0ff]/60 transition-all active:scale-[0.99] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30">
                Тариф #{index + 1}
              </span>
              <span className="text-base font-black text-[#00f0ff]">
                {service.price ? `${service.price.toLocaleString('ru-RU')} ₽` : 'По запросу'}
              </span>
            </div>

            <h4 className="text-sm font-black text-white mb-1 leading-snug">
              {service.name}
            </h4>
            <p className="text-gray-300 text-xs leading-relaxed mb-3">
              {service.description}
            </p>
          </div>

          <button
            onClick={() => onSelectService && onSelectService(service.name)}
            className="w-full py-2 bg-gradient-to-r from-[#00f0ff]/20 to-[#0070f3]/20 hover:from-[#00f0ff]/30 hover:to-[#0070f3]/30 border border-[#00f0ff]/30 rounded-xl text-xs font-bold text-[#00f0ff] active:bg-[#00f0ff]/30 transition flex items-center justify-center gap-1.5"
          >
            <span>Записаться на этот тариф</span>
            <span>→</span>
          </button>
        </Card>
      ))}
    </div>
  );
};
