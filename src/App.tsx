import { useState } from 'react';
import { PriceList } from './pages/PriceList';
import { BookingForm } from './components/BookingForm';
import { AdminPanel } from './pages/AdminPanel';

export function App() {
  const [activeTab, setActiveTab] = useState<'prices' | 'booking' | 'admin'>('prices');

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-[#00f0ff] selection:text-black relative pb-24 sm:pb-12">
      {/* Background glow accents for mobile */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-sm h-72 bg-gradient-to-b from-[#00f0ff]/20 via-[#0055ff]/10 to-transparent blur-[90px] rounded-full" />
        <div className="absolute bottom-20 right-[-10%] w-60 h-60 bg-[#0040aa]/15 blur-[90px] rounded-full" />
      </div>

      {/* Mobile-optimized Header */}
      <header className="border-b border-[#00f0ff]/15 bg-[#030712]/90 backdrop-blur-xl sticky top-0 z-40 px-3.5 py-2.5">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          {/* Logo brand */}
          <div 
            onClick={() => setActiveTab('prices')}
            className="flex items-center gap-2.5 cursor-pointer active:scale-95 transition-transform"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0048b3] via-[#00a6ff] to-[#00f0ff] flex items-center justify-center font-black text-lg text-black shadow-md shadow-[#00f0ff]/30">
              C8
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-wider text-white uppercase">
                  ДЕТЕЙЛИНГ C8
                </span>
              </div>
              <p className="text-[9px] text-cyan-400 font-semibold tracking-widest uppercase">
                Блеск • Защита • Чистота
              </p>
            </div>
          </div>

          {/* Direct call button for phone */}
          <div className="flex items-center gap-1.5">
            <a
              href="tel:89383499986"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#00f0ff]/20 to-blue-600/20 border border-[#00f0ff]/40 text-[#00f0ff] font-bold text-xs active:bg-[#00f0ff]/40 transition"
            >
              <span>📞</span>
              <span>Позвонить</span>
            </a>
            <button
              onClick={() => setActiveTab('admin')}
              className={`p-1.5 rounded-xl border text-xs transition ${
                activeTab === 'admin'
                  ? 'bg-[#00f0ff] text-black border-[#00f0ff]'
                  : 'text-gray-400 border-white/10 hover:text-white'
              }`}
              title="Админка"
            >
              ⚙️
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section on Mobile */}
      {activeTab !== 'admin' && (
        <section className="px-4 pt-4 pb-6 max-w-xl mx-auto w-full">
          {/* Visual Poster Banner (Mobile Friendly) */}
          <div className="relative rounded-2xl overflow-hidden border border-[#00f0ff]/30 bg-[#071326] shadow-xl mb-4">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden">
              <img
                src="/c8-poster.jpg"
                alt="Детейлинг C8 Мойка в Ессентуках"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/40 to-transparent" />
              
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div>
                  <span className="inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-[#00f0ff] text-black mb-1">
                    Ессентуки
                  </span>
                  <h2 className="text-lg font-black text-white leading-tight drop-shadow-md">
                    БЕРЕЖЕМ АВТО КАК СВОЙ!!
                  </h2>
                </div>
                <a
                  href="https://yandex.ru/maps/?text=Ессентуки,+Ессентукская+36"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur border border-white/20 text-[10px] text-cyan-300 font-semibold flex items-center gap-1 active:scale-95"
                >
                  📍 На карте
                </a>
              </div>
            </div>
          </div>

          {/* Quick Info Badges */}
          <div className="grid grid-cols-3 gap-2 text-center mb-5">
            <div className="p-2.5 rounded-xl bg-[#09152a] border border-[#00f0ff]/15">
              <div className="text-xs font-bold text-white">3 фазы</div>
              <div className="text-[10px] text-gray-400">Бережный уход</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#09152a] border border-[#00f0ff]/15">
              <div className="text-xs font-bold text-[#00f0ff]">Koch / CarPro</div>
              <div className="text-[10px] text-gray-400">Премиум химия</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#09152a] border border-[#00f0ff]/15">
              <div className="text-xs font-bold text-white">Турбосушка</div>
              <div className="text-[10px] text-gray-400">Без разводов</div>
            </div>
          </div>

          {/* Mobile Segmented Switcher */}
          <div className="grid grid-cols-2 p-1 bg-[#09152a] border border-[#00f0ff]/30 rounded-2xl shadow-lg">
            <button
              onClick={() => setActiveTab('prices')}
              className={`py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                activeTab === 'prices'
                  ? 'bg-gradient-to-r from-[#00f0ff] to-[#0070f3] text-black shadow-md shadow-[#00f0ff]/30'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Прайс-лист
            </button>
            <button
              onClick={() => setActiveTab('booking')}
              className={`py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                activeTab === 'booking'
                  ? 'bg-gradient-to-r from-[#00f0ff] to-[#0070f3] text-black shadow-md shadow-[#00f0ff]/30'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Запись онлайн
            </button>
          </div>
        </section>
      )}

      {/* Main Content Area */}
      <main className="max-w-xl mx-auto px-4 flex-1 w-full">
        {activeTab === 'prices' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pt-1">
              <h3 className="text-base font-black text-white uppercase tracking-wider">
                Каталог услуг
              </h3>
              <span className="text-[11px] text-cyan-400 font-medium">Ессентукская, 36</span>
            </div>
            <PriceList onSelectService={() => setActiveTab('booking')} />
          </div>
        )}

        {activeTab === 'booking' && (
          <div className="pt-2">
            <BookingForm />
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="pt-2">
            <AdminPanel />
          </div>
        )}
      </main>

      {/* Mobile Floating Action Bottom Navigation Bar (App-like feel) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#030712]/95 backdrop-blur-2xl border-t border-[#00f0ff]/20 px-4 py-2 sm:hidden">
        <div className="max-w-md mx-auto grid grid-cols-3 gap-2 text-center">
          <button
            onClick={() => setActiveTab('prices')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
              activeTab === 'prices' ? 'text-[#00f0ff]' : 'text-gray-400'
            }`}
          >
            <span className="text-base">📋</span>
            <span className="text-[10px] font-bold mt-0.5">Услуги</span>
          </button>

          <button
            onClick={() => setActiveTab('booking')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
              activeTab === 'booking' ? 'text-[#00f0ff]' : 'text-gray-400'
            }`}
          >
            <span className="text-base">📅</span>
            <span className="text-[10px] font-bold mt-0.5">Запись</span>
          </button>

          <a
            href="tel:89383499986"
            className="flex flex-col items-center justify-center py-1.5 text-cyan-300 active:scale-95 transition"
          >
            <span className="text-base">📞</span>
            <span className="text-[10px] font-bold mt-0.5">Звонок</span>
          </a>
        </div>
      </nav>

      {/* Footer */}
      <footer className="border-t border-[#00f0ff]/10 bg-[#02050d] py-5 px-4 text-center text-xs text-gray-500 mt-8">
        <p className="font-bold text-gray-300 text-xs">ДЕТЕЙЛИНГ МОЙКА C8</p>
        <p className="text-[11px] mt-0.5">Ессентуки, ул. Ессентукская, 36</p>
        <p className="text-[10px] text-gray-600 mt-1">© {new Date().getFullYear()} C8 Detailing</p>
      </footer>
    </div>
  );
}

export default App;
