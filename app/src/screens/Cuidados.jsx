import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, BookOpen } from 'lucide-react';
import { CARE, SOURCES } from '../data.js';
import { Reveal, Stagger, itemV, Segmented, TopBar, Footer, Chip } from '../ui.jsx';

export default function Cuidados({ go }) {
  const [tab, setTab] = useState(0);
  const g = CARE[tab];

  return (
    <div className="stack">
      <TopBar title="Cuidados de Saúde Única no calor" go={go} sub="A saúde das pessoas, dos bichos e do ambiente anda junta." />

      <Reveal>
        <Segmented id="cuidados" label="Para quem" value={tab} onChange={setTab} items={CARE.map((c, i) => ({ value: i, label: c.n }))} />
      </Reveal>

      <AnimatePresence mode="wait">
        <motion.div key={tab} className={`panel tone-${g.tone}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
          <span className="card-title pad-x"><span className={`dot tone-${g.tone} strong-dot`} />{g.n}</span>
          <Stagger className="stack-sm">
            {g.items.map((t) => <motion.div key={t} variants={itemV} className="card plain">{t}</motion.div>)}
          </Stagger>
        </motion.div>
      </AnimatePresence>

      <Reveal className="card row-link static">
        <Chip icon={Phone} tone="peach" />
        <span>Emergência: ligue <b className="big-num">192</b> ou procure o posto de saúde.</span>
      </Reveal>

      <Reveal className="card stack-sm">
        <span className="card-title"><BookOpen size={18} className="accent" aria-hidden="true" />Fontes</span>
        <Stagger as="ul" className="list sources">
          {SOURCES.map((s) => <motion.li key={s} variants={itemV}>{s}</motion.li>)}
        </Stagger>
      </Reveal>

      <Footer />
    </div>
  );
}
