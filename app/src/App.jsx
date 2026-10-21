import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { House, Thermometer, Gauge, Sprout, Bug } from 'lucide-react';
import { API, CACHE_KEY, CACHE_TTL, store, nivelDe, heatIndex } from './lib.js';
import { ThemeContext } from './ui.jsx';
import Inicio from './screens/Inicio.jsx';
import Clima from './screens/Clima.jsx';
import Risco from './screens/Risco.jsx';
import Guia from './screens/Guia.jsx';
import Plantas from './screens/Plantas.jsx';
import Dengue from './screens/Dengue.jsx';
import Cuidados from './screens/Cuidados.jsx';

const SCREENS = { inicio: Inicio, clima: Clima, risco: Risco, plantar: Guia, plantas: Plantas, dengue: Dengue, cuidados: Cuidados };
const NAV = [
  { id: 'inicio', label: 'Início', icon: House },
  { id: 'clima', label: 'Clima', icon: Thermometer },
  { id: 'risco', label: 'Risco', icon: Gauge },
  { id: 'plantar', label: 'Plantar', icon: Sprout, also: ['plantas'] },
  { id: 'dengue', label: 'Dengue', icon: Bug },
];

const valid = (d) => d && d.current && d.daily && d.daily.temperature_2m_max?.length >= 3;

function useWeather() {
  const [s, setS] = useState(() => {
    const c = store(CACHE_KEY);
    return c && valid(c.d) && Date.now() - c.t < CACHE_TTL ? { status: 'ok', data: c.d, at: c.t } : { status: 'loading' };
  });
  useEffect(() => {
    if (s.status === 'ok') return;
    let alive = true;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 9000);
    fetch(API, { signal: ctrl.signal })
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((d) => {
        if (!valid(d)) throw new Error('dados');
        const t = Date.now();
        store(CACHE_KEY, { t, d });
        if (alive) setS({ status: 'ok', data: d, at: t });
      })
      .catch(() => { if (alive) setS({ status: 'error' }); })
      .finally(() => clearTimeout(timer));
    return () => { alive = false; clearTimeout(timer); ctrl.abort(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return s;
}

function readHash() {
  const h = window.location.hash.slice(1);
  return SCREENS[h] ? h : 'inicio';
}

export default function App() {
  const wx = useWeather();
  const [day, setDay] = useState(0);
  const [manual, setManual] = useState({ t: 33, h: 35 });
  const [screen, setScreen] = useState(readHash);
  const [theme, setTheme] = useState(() => (store('cv-tema') === 'dark' ? 'dark' : 'light'));

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#111915' : '#F6F4EC');
  }, [theme]);
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    store('cv-tema', next);
  };

  useEffect(() => {
    const onHash = () => setScreen(readHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const go = (id) => {
    if (id === screen) return;
    setScreen(id);
    try { history.replaceState(null, '', '#' + id); } catch { /* sem histórico */ }
  };

  const clima = useMemo(() => {
    if (wx.status === 'ok') {
      const d = wx.data.daily;
      const tmax = d.temperature_2m_max[day];
      const rh = d.relative_humidity_2m_min[day];
      return { mode: 'auto', tmax, rh, now: wx.data.current.temperature_2m, dates: d.time, at: wx.at, nivel: nivelDe(tmax), hi: heatIndex(tmax, rh) };
    }
    if (wx.status === 'error') {
      return { mode: 'manual', tmax: manual.t, rh: manual.h, nivel: nivelDe(manual.t), hi: heatIndex(manual.t, manual.h) };
    }
    return { mode: 'loading' };
  }, [wx, day, manual]);

  const Screen = SCREENS[screen];
  const ctx = { clima, day, setDay, manual, setManual, go };

  return (
    <ThemeContext.Provider value={{ theme, toggle: toggleTheme }}>
    <MotionConfig reducedMotion="user">
      <div className="glow" aria-hidden="true">
        <motion.span className="glow-a" animate={{ x: [0, 30, 0], y: [0, 20, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.span className="glow-b" animate={{ x: [0, -24, 0], y: [0, 28, 0] }} transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }} />
      </div>

      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo({ top: 0 })}>
        <motion.main
          key={screen}
          className="screen"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <Screen {...ctx} />
        </motion.main>
      </AnimatePresence>

      <nav className="tabbar" aria-label="Menu">
        <motion.div className="tabbar-inner" initial={{ y: 90, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 24, delay: 0.2 }}>
          {NAV.map(({ id, label, icon: Icon, also }) => {
            const on = screen === id || (also && also.includes(screen));
            return (
              <motion.button key={id} type="button" className={`tab${on ? ' on' : ''}`} aria-current={on ? 'page' : undefined} onClick={() => go(id)} whileTap={{ scale: 0.88 }}>
                <span className="tab-icon">
                  {on && <motion.span layoutId="tab-pill" className="tab-pill" transition={{ type: 'spring', stiffness: 420, damping: 32 }} />}
                  <Icon size={20} aria-hidden="true" />
                </span>
                {label}
              </motion.button>
            );
          })}
        </motion.div>
      </nav>
    </MotionConfig>
    </ThemeContext.Provider>
  );
}
