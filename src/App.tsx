import { useState } from 'react';
import { PriceList } from './pages/PriceList';
import { BookingForm } from './components/BookingForm';

export function App() {
  const [activeTab, setActiveTab] = useState<'prices' | 'booking'>('prices');

  return (
    <div className="min-h-screen bg-[#060d1a] text-white flex flex-col font-sans selection:bg-[#64ffda] selection:text-black">
      {/* Glow decorative effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-blue-600/15 blur-[120px] pointer-events-none -z-10" />

      {/* Header / Hero */}
      <header className="border-b border-cyan-500/20 bg-[#0a192f]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-black text-xl text-black shadow-lg shadow-cyan-500/30">
              C8
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent uppercase">
                Детейлинг Мойка C8
              </h1>
              <p className="text-xs text-cyan-400/80 tracking-widest uppercase">
                Блеск • Защита • Чистота
              </p>
            </div>
          </div>

          {/* Quick Contacts */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm">
            <a
              href="tel:89383499986"
              className="flex items-center gap-1.5 text-cyan-300 hover:text-white font-semibold transition"
            >
              📞 8 (938) 349-99-86
            </a>
            <span className="text-gray-400 flex items-center gap-1">
              📍 Ессентукская, 36
            </span>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative overflow-hidden py-14 px-4 text-center border-b border-cyan-500/10 bg-gradient-to-b from-[#0a192f]/50 to-transparent">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-4 shadow-sm shadow-cyan-500/20">
            Премиальный уход за вашим авто
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-white">
            БЕРЕЖЕМ ВАШ АВТОМОБИЛЬ <br className="hidden sm:inline" />
            <span className="text-cyan-400">КАК СВОЙ!</span>
          </h2>
          <p className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base mb-8">
            Качество • Надежность • Безопасность. Полный комплекс детейлинг-услуг, мойка премиум-класса и защита кузова в Ессентуках.
          </p>

          {/* Navigation Switcher */}
          <div className="inline-flex p-1.5 bg-[#0a192f] border border-cyan-500/30 rounded-xl shadow-lg shadow-cyan-950/50">
            <button
              onClick={() => setActiveTab('prices')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'prices'
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-md shadow-cyan-500/40'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Прайс-лист
            </button>
            <button
              onClick={() => setActiveTab('booking')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'booking'
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-md shadow-cyan-500/40'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Онлайн-запись
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 py-10 flex-1 w-full">
        {activeTab === 'prices' ? (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Наши Услуги и Тарифы</h3>
              <p className="text-gray-400 text-sm">Выберите подходящую услугу и запишитесь онлайн за минуту</p>
            </div>
            <PriceList />
            <div className="text-center mt-8">
              <button
                onClick={() => setActiveTab('booking')}
                className="px-8 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold shadow-lg shadow-cyan-500/30 transition transform hover:-translate-y-0.5"
              >
                Записаться на мойку →
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-xl mx-auto">
            <BookingForm />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-cyan-500/20 bg-[#081220] py-6 px-4 text-center text-xs text-gray-400">
        <p className="mb-1 font-semibold text-gray-300">ДЕТЕЙЛИНГ МОЙКА С8</p>
        <p>Адрес: г. Ессентуки, ул. Ессентукская, 36 | Тел: +7 (938) 349-99-86</p>
        <p className="mt-2 text-gray-500">© {new Date().getFullYear()} C8 Detailing. Все права защищены.</p>
      </footer>
    </div>
  );
}

export default App;
