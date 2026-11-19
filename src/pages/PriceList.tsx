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
    name: 'Комплексная 3-х фазная мойка',
    description: 'Бережная бесконтактная мойка + ручная пористая губка + гидрофобный воск и сушка турбосушкой.',
    price: 1500,
  },
  {
    id: '2',
    name: 'Детейлинг химчистка салона',
    description: 'Глубокая очистка сидений, ковров, торпеды и потолка безопасными биоразлагаемыми составами.',
    price: 6000,
  },
  {
    id: '3',
    name: 'Полировка кузова + Керамика',
    description: 'Восстановительная полировка лака с удалением царапин и нанесением защитного состава 9H.',
    price: 15000,
  },
  {
    id: '4',
    name: 'Антидождь на все стекла',
    description: 'Нанесение стойкого гидрофобного покрытия на лобовое и боковые стекла. Идеальная видимость в ливень.',
    price: 2500,
  },
  {
    id: '5',
    name: 'Мойка подкапотного пространства',
    description: 'Безопасная мойка диэлектрическим гелем с последующей консервацией и сушкой.',
    price: 3000,
  },
  {
    id: '6',
    name: 'Чернение шин и уход за пластиком',
    description: 'Нанесение кондиционера на внешний пластик и матовое благородное чернение резины.',
    price: 800,
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
          // Если база пока пуста или нет ответа, показываем качественные дефолтные тарифы C8
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
      <div className="text-cyan-400 py-16 text-center animate-pulse font-semibold">
        Загрузка списка услуг C8...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <Card
          key={service.id}
          className="flex flex-col justify-between border border-cyan-500/20 bg-[#0d1f38]/80 hover:border-cyan-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-900/30 p-6 rounded-2xl group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
                Детейлинг C8
              </span>
            </div>
            <h4 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
              {service.name}
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {service.description}
            </p>
          </div>
          <div className="pt-4 border-t border-cyan-500/10 flex items-baseline justify-between">
            <span className="text-xs uppercase tracking-wider text-gray-400">Стоимость</span>
            <span className="text-2xl font-black text-cyan-400">
              {service.price ? `${service.price.toLocaleString('ru-RU')} ₽` : 'По запросу'}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};
