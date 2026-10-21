import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TriangleAlert, Leaf, ChevronRight } from 'lucide-react';
import { GUIDE, SAFETY } from '../data.js';
import { store } from '../lib.js';
import { Reveal, Stagger, itemV, Segmented, TopBar, Footer, Chip } from '../ui.jsx';

export default function Guia({ go }) {
  const [tab, setTab] = useState(() => {
    const s = store('cv-aba');
    return GUIDE.some((g) => g.id === s) ? s : 'laje';
  });
  const g = GUIDE.find((x) => x.id === tab);
  const choose = (id) => { setTab(id); store('cv-aba', id); };

  return (
    <div className="stack">
      <TopBar title="Monte seu cantinho verde" go={go} sub="Escolha onde vai plantar. Dá para fazer com material barato ou reaproveitado." />

      <Reveal>
        <Segmented id="guia" label="Onde plantar" wrap value={tab} onChange={choose} items={GUIDE.map((x) => ({ value: x.id, label: x.n }))} />
      </Reveal>

      <AnimatePresence mode="wait">
        <motion.div key={tab} className="stack" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
          <div className="card stack-sm">
            <span className="card-title">Materiais</span>
            <Stagger className="chips" key={'m' + tab}>
              {g.mats.map((m) => <motion.span key={m} variants={itemV} className="mat">{m}</motion.span>)}
            </Stagger>
          </div>

          <div className="panel">
            <span className="card-title pad-x">Passo a passo</span>
            <Stagger as="ol" className="steps" key={'s' + tab}>
              {g.steps.map((s, i) => (
                <motion.li key={s} variants={itemV} className="step">
                  <span className="step-num">{i + 1}</span>
                  <span>{s}</span>
                </motion.li>
              ))}
            </Stagger>
          </div>
        </motion.div>
      </AnimatePresence>

      <Reveal className="note tone-peach">
        <Chip icon={TriangleAlert} tone="white" size={36} />
        <div className="stack-xs">
          <b>Antes de começar</b>
          <ul className="list">{SAFETY.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
      </Reveal>

      <Reveal>
        <motion.button type="button" className="card row-link" onClick={() => go('plantas')} whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
          <Chip icon={Leaf} tone="green" />
          <span className="grow">
            <span className="strong block">Que plantas usar?</span>
            <span className="small muted">8 plantas que aguentam o sol de BH</span>
          </span>
          <ChevronRight size={20} className="muted" aria-hidden="true" />
        </motion.button>
      </Reveal>

      <Footer />
    </div>
  );
}
