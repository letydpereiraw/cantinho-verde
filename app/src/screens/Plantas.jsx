import { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Leaf, MapPin } from 'lucide-react';
import { PLANTS, TAGS } from '../data.js';
import { Reveal, Segmented, TopBar, Footer, Chip } from '../ui.jsx';

const TONES = ['green', 'sun', 'mint', 'peach'];

export default function Plantas({ go }) {
  const [filter, setFilter] = useState('Todas');
  const list = PLANTS.filter((p) => filter === 'Todas' || p.t.includes(filter));

  return (
    <div className="stack">
      <TopBar title="Plantas que aguentam o sol de BH" go={go} />

      <Reveal>
        <Segmented id="filtro" label="Filtrar plantas" wrap value={filter} onChange={setFilter}
          items={['Todas', 'Nativa', 'Pouca água', 'Comestível'].map((n) => ({ value: n, label: n }))} />
      </Reveal>

      <motion.span key={list.length} className="small muted" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {list.length} {list.length === 1 ? 'planta' : 'plantas'}
      </motion.span>

      <LayoutGroup>
        <motion.div layout className="stack-sm">
          <AnimatePresence mode="popLayout">
            {list.map((p) => (
              <motion.article
                key={p.n}
                layout
                className="card plant"
                initial={{ opacity: 0, y: 26, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.18 } }}
                transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              >
                <Chip icon={Leaf} tone={TONES[PLANTS.indexOf(p) % 4]} size={44} />
                <div className="stack-xs grow min0">
                  <h2 className="plant-name">{p.n}</h2>
                  <em className="small muted">{p.s}</em>
                  <p>{p.f}</p>
                  <div className="chips">
                    {TAGS.filter((t) => p.t.includes(t)).map((t) => (
                      <span key={t} className={`tag tone-${TONES[TAGS.indexOf(t)]}`}>{t}</span>
                    ))}
                  </div>
                  <span className="small muted row-gap"><MapPin size={14} aria-hidden="true" />Onde usar: {p.w}</span>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      <Footer />
    </div>
  );
}
