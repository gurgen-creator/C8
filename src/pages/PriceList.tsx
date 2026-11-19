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
    description: 'Бесконтактный первичный состав + ручная мойка шампунем с нейтральным pH пористой губкой + гидрофобный воск и сушка турбосушкой.',
    price: 1500,
  },
  {
    id: '2',
    name: 'Комплексная химчистка салона',
    description: 'Глубокая торнадор-очистка кресел, ковролина, пластика и потолка с озонированием и антибактериальной обработкой.',
    price: 6000,
  },
  {
    id: '3',
    name: 'Мягкая полировка + Керамика 9H',
    description: 'Устранение до 90% царапин и паутинки, возвращение глубокого зеркального блеска и нанесение твердого керамического слоя.',
    price: 15000,
  },
  {
    id: '4',
    name: 'Гидрофобное покрытие «Антидождь»',
    description: 'Нанесение состава премиум-класса на лобовое и боковые стекла. Вода и грязь слетают на скорости от 50 км/ч.',
    price: 2500,
  },
  {
    id: '5',
    name: 'Мойка моторного отсека + Консервация',
    description: 'Деликатная мойка диэлектрическим составом без залива электроники с последующей консервацией термостойким лаком.',
    price: 3000,
  },
  {
    id: '6',
    name: 'Детейлинг колесных дисков и арок',
    description: 'Очистка от битума и колодочной пыли специальным индикаторным составом, чистка резины и сатиновое чернение.',
    price: 1800,
  },
];

export const PriceList: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*');

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
      <div className="text-[#00f0ff] py-16 text-center animate-pulse font-semibold">
        Загрузка тарифов C8...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service, index) => (
        <Card
          key={service.id || index}
          className="relative group flex flex-col justify-between p-7 rounded-3xl bg-gradient-to-b from-[#0a1832]/90 to-[#061022]/90 border border-[#00f0ff]/20 hover:border-[#00f0ff]/70 transition-all duration-300 hover:shadow-2xl hover:shadow-[#00f0ff]/15 hover:-translate-y-1 overflow-hidden"
        >
          {/* Subtle accent line on top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00f0ff]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30">
                Тариф #{index + 1}
              </span>
              <span className="text-xs text-gray-400 font-medium">Гарантия качества</span>
            </div>

            <h4 className="text-xl font-black text-white group-hover:text-[#00f0ff] transition-colors mb-3 leading-snug">
              {service.name}
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed mb-6 font-normal">
              {service.description}
            </p>
          </div>

          <div className="pt-5 border-t border-[#00f0ff]/15 flex items-baseline justify-between mt-auto">
            <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">Стоимость</span>
            <span className="text-2xl font-black text-[#00f0ff] tracking-tight">
              {service.price ? `${service.price.toLocaleString('ru-RU')} ₽` : 'По запросу'}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};
