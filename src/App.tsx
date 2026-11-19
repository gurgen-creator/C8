import { useState } from 'react';
import { PriceList } from './pages/PriceList';
import { BookingForm } from './components/BookingForm';
import { AdminPanel } from './pages/AdminPanel';

export function App() {
  const [activeTab, setActiveTab] = useState<'prices' | 'booking' | 'admin'>('prices');

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-[#00f0ff] selection:text-black relative">
      {/* Dynamic Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-[#00f0ff]/15 via-[#0055ff]/10 to-transparent blur-[140px] rounded-full" />
        <div className="absolute top-[35%] right-[-10%] w-[500px] h-[500px] bg-[#0040aa]/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#00f0ff]/8 blur-[160px] rounded-full" />
      </div>

      {/* Top Navbar */}
      <header className="border-b border-[#00f0ff]/15 bg-[#030712]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo Brand */}
          <div 
            onClick={() => setActiveTab('prices')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0048b3] via-[#00a6ff] to-[#00f0ff] flex items-center justify-center font-black text-2xl text-black shadow-lg shadow-[#00f0ff]/30 group-hover:scale-105 transition-transform duration-300">
                C8
              </div>
              <div className="absolute inset-0 rounded-2xl bg-[#00f0ff] blur-md opacity-30 group-hover:opacity-60 transition-opacity" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-widest text-white uppercase group-hover:text-[#00f0ff] transition-colors">
                  ДЕТЕЙЛИНГ C8
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30">
                  Мойка
                </span>
              </div>
              <p className="text-[11px] text-cyan-400 font-medium tracking-[0.2em] uppercase">
                Блеск • Защита • Чистота
              </p>
            </div>
          </div>

          {/* Quick Info & Action Header Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm">
            <a
              href="tel:89383499986"
              className="flex items-center gap-2 text-cyan-300 hover:text-white font-bold transition px-3.5 py-2 rounded-xl bg-cyan-950/40 border border-[#00f0ff]/25 hover:border-[#00f0ff]/60"
            >
              <span className="text-base">📞</span>
              <span>8 (938) 349-99-86</span>
            </a>
            <a
              href="https://yandex.ru/maps/?text=Ессентуки,+Ессентукская+36"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-gray-300 hover:text-cyan-200 transition px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/40"
              title="Открыть Яндекс Карты"
            >
              <span>📍</span>
              <span>Ессентукская, 36</span>
            </a>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
                activeTab === 'admin'
                  ? 'bg-[#00f0ff] text-black border-[#00f0ff] shadow-md shadow-[#00f0ff]/30'
                  : 'text-gray-400 border-white/10 hover:text-white hover:border-[#00f0ff]/30'
              }`}
            >
              ⚙️ Админка
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {activeTab !== 'admin' && (
        <section className="relative overflow-hidden pt-8 pb-14 px-4 border-b border-cyan-500/10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Offer */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] text-xs font-bold tracking-wider uppercase shadow-sm shadow-[#00f0ff]/20">
                <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
                Премиальный детейлинг в Ессентуках
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                БЕРЕЖЕМ ВАШ АВТОМОБИЛЬ <br />
                <span className="bg-gradient-to-r from-[#00f0ff] via-cyan-200 to-blue-500 bg-clip-text text-transparent neon-glow">
                  КАК СВОЙ!!
                </span>
              </h2>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
                <strong className="text-white">КАЧЕСТВО • НАДЕЖНОСТЬ • БЕЗОПАСНОСТЬ</strong>. 
                Профессиональная трехфазная мойка, полировка кузова, нанесение керамических составов и бережная химчистка салона.
              </p>

              {/* Badges list */}
              <div className="grid grid-cols-3 gap-3 pt-2 max-w-md mx-auto lg:mx-0">
                <div className="p-3 rounded-2xl bg-[#09152a]/70 border border-[#00f0ff]/20 text-center">
                  <div className="text-cyan-400 font-black text-lg">100%</div>
                  <div className="text-[11px] text-gray-400 font-medium">Без голограмм</div>
                </div>
                <div className="p-3 rounded-2xl bg-[#09152a]/70 border border-[#00f0ff]/20 text-center">
                  <div className="text-cyan-400 font-black text-lg">Premium</div>
                  <div className="text-[11px] text-gray-400 font-medium">Химия Koch/CarPro</div>
                </div>
                <div className="p-3 rounded-2xl bg-[#09152a]/70 border border-[#00f0ff]/20 text-center">
                  <div className="text-cyan-400 font-black text-lg">VIP</div>
                  <div className="text-[11px] text-gray-400 font-medium">Турбосушка кузова</div>
                </div>
              </div>

              {/* Call to Actions / Mode Switch */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => setActiveTab('booking')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#00f0ff] to-[#0070f3] hover:from-[#38f8ff] hover:to-[#1a85ff] text-black font-black text-sm uppercase tracking-wider shadow-xl shadow-[#00f0ff]/25 transition transform hover:-translate-y-0.5 cursor-pointer"
                >
                  Записаться онлайн →
                </button>
                <button
                  onClick={() => setActiveTab('prices')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#09152a] hover:bg-[#0c1f3d] text-white border border-[#00f0ff]/30 hover:border-[#00f0ff]/60 font-bold text-sm tracking-wide transition cursor-pointer"
                >
                  Посмотреть цены
                </button>
              </div>
            </div>

            {/* Right Column: Visual Poster Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group max-w-sm w-full">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-[#00f0ff]/40 to-blue-600/30 blur-xl opacity-70 group-hover:opacity-100 transition duration-500" />
                <div className="relative rounded-3xl overflow-hidden border border-[#00f0ff]/40 bg-[#071326] shadow-2xl">
                  <img
                    src="/c8-poster.jpg"
                    alt="Детейлинг C8 Мойка в Ессентуках"
                    className="w-full h-auto object-cover transform group-hover:scale-102 transition duration-500"
                  />
                  <div className="p-4 bg-gradient-to-t from-[#071326] via-[#071326]/90 to-transparent flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white uppercase">г. Ессентуки</p>
                      <p className="text-cyan-400">ул. Ессентукская, 36</p>
                    </div>
                    <span className="px-3 py-1 bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 font-bold rounded-lg">
                      Работаем ежедневно
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-10 flex-1 w-full">
        {activeTab === 'prices' && (
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#00f0ff]">
                Прозрачные тарифы
              </span>
              <h3 className="text-3xl font-black text-white mt-1 mb-3">
                Прайс-лист на услуги
              </h3>
              <p className="text-gray-400 text-sm">
                Выберите комплекс для своего автомобиля. Принимаем легковые авто, кроссоверы и внедорожники.
              </p>
            </div>

            <PriceList />

            <div className="p-8 rounded-3xl bg-gradient-to-r from-[#09152a] via-[#0b1b36] to-[#09152a] border border-[#00f0ff]/20 text-center flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="text-left">
                <h4 className="text-xl font-bold text-white mb-1">Нужен индивидуальный расчет?</h4>
                <p className="text-sm text-gray-400">Позвоните нам или оставьте заявку — мастер проконсультирует бесплатно.</p>
              </div>
              <button
                onClick={() => setActiveTab('booking')}
                className="px-7 py-3 rounded-xl bg-[#00f0ff] hover:bg-[#3bf4ff] text-black font-extrabold text-sm uppercase tracking-wider transition shadow-lg shadow-[#00f0ff]/30 cursor-pointer whitespace-nowrap"
              >
                Оформить заявку →
              </button>
            </div>
          </div>
        )}

        {activeTab === 'booking' && (
          <div className="max-w-xl mx-auto">
            <BookingForm />
          </div>
        )}

        {activeTab === 'admin' && <AdminPanel />}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#00f0ff]/15 bg-[#02050d] py-8 px-4 text-center text-xs text-gray-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <p className="font-extrabold text-white text-sm tracking-wider uppercase">
              C8 Детейлинг Мойка
            </p>
            <p className="text-gray-400 text-xs mt-0.5">Ессентуки, ул. Ессентукская, 36 | +7 (938) 349-99-86</p>
          </div>
          <div className="text-right text-gray-500">
            <p>© {new Date().getFullYear()} C8 Detailing. Премиальный сервис.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
