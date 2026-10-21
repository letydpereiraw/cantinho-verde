import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Thermometer } from 'lucide-react';
import { CHECKS } from '../data.js';
import { store } from '../lib.js';
import { Reveal, Stagger, itemV, Bar, Num, TopBar, Footer, Chip } from '../ui.jsx';

const KEY = 'cv-dengue';

export default function Dengue({ go }) {
  const [done, setDone] = useState(() => {
    const s = store(KEY);
    return Array.isArray(s) && s.length === CHECKS.length ? s : CHECKS.map(() => false);
  });
  const n = done.filter(Boolean).length;
  const toggle = (i) => {
    const next = done.slice();
    next[i] = !next[i];
    setDone(next);
    store(KEY, next);
  };

  return (
    <div className="stack">
      <TopBar title="Cantinho verde sem dengue" go={go} />

      <Reveal className="card stack-sm">
        <span className="strong">Vistoria desta semana</span>
        <Bar pct={(n / 6) * 100} height={12} />
        <span className="small muted">{n} de 6 feitos</span>
        <div className="grid2">
          <div className="tile tone-green"><span className="small">Feitos</span><span className="tile-val lg"><Num value={n} d={0} /></span></div>
          <div className="tile tone-peach"><span className="small">Faltam</span><span className="tile-val lg"><Num value={6 - n} d={0} /></span></div>
        </div>
        <AnimatePresence>
          {n === 6 && (
            <motion.span className="small strong accent" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              Tudo certo nesta semana. Volte daqui a 7 dias.
            </motion.span>
          )}
        </AnimatePresence>
        <span className="small muted">Suas marcações ficam guardadas só neste celular.</span>
      </Reveal>

      <Reveal className="note tone-sun">
        <Chip icon={Thermometer} tone="white" size={36} />
        <p>O mosquito se reproduz melhor entre <b>26 e 29 °C</b>. Nos dias quentes, olhe com mais cuidado.</p>
      </Reveal>

      <Stagger className="stack-sm">
        {CHECKS.map((c, i) => (
          <motion.button key={c} type="button" role="checkbox" aria-checked={done[i]} variants={itemV} className={`option${done[i] ? ' on' : ''}`} onClick={() => toggle(i)} whileTap={{ scale: 0.97 }}>
            <motion.span className="check" animate={{ backgroundColor: done[i] ? 'var(--check)' : 'var(--card)', borderColor: done[i] ? 'var(--check)' : 'var(--line-strong)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <motion.path d="M20 6 9 17l-5-5" initial={false} animate={{ pathLength: done[i] ? 1 : 0 }} transition={{ duration: 0.3 }} />
              </svg>
            </motion.span>
            <span className={`grow left${done[i] ? ' done' : ''}`}>{c}</span>
          </motion.button>
        ))}
      </Stagger>

      <Footer />
    </div>
  );
}
