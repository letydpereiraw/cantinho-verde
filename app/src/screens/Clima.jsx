import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Info, TriangleAlert, ArrowRight } from 'lucide-react';
import { LEVELS, fmt } from '../lib.js';
import { Reveal, Stagger, itemV, Num, Segmented, TopBar, Footer, Chip } from '../ui.jsx';

const DAY_NAMES = ['Hoje', 'Amanhã', 'Depois de amanhã'];

function ddmm(iso) {
  if (!iso) return '';
  const p = iso.split('-');
  return p[2] + '/' + p[1];
}

export default function Clima({ clima, day, setDay, manual, setManual, go }) {
  const lv = clima.nivel != null ? LEVELS[clima.nivel] : null;
  const at = clima.at ? new Date(clima.at) : null;

  return (
    <div className="stack">
      <TopBar title="Calor em BH" go={go} />

      {clima.mode === 'auto' && (
        <Reveal>
          <Segmented
            id="dias"
            label="Escolha o dia"
            value={day}
            onChange={setDay}
            items={DAY_NAMES.map((n, i) => ({ value: i, label: n, sub: ddmm(clima.dates[i]) }))}
          />
        </Reveal>
      )}

      {clima.mode === 'loading' && (
        <Reveal className="card center muted">
          <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.4, repeat: Infinity }}>Buscando o clima de BH...</motion.span>
        </Reveal>
      )}

      {clima.mode === 'manual' && (
        <Reveal className="card tone-sun stack-sm">
          <span className="strong row-gap"><TriangleAlert size={18} aria-hidden="true" />Não consegui buscar o clima agora.</span>
          <span className="small">Coloque os valores à mão. A previsão está no rádio, na TV ou no celular.</span>
          <label className="slider" htmlFor="m-temp">
            <span className="row-between"><b>Temperatura máxima</b><output>{fmt(manual.t)} °C</output></span>
            <input id="m-temp" type="range" min="20" max="40" step="0.5" value={manual.t} onChange={(e) => setManual({ ...manual, t: +e.target.value })} />
          </label>
          <label className="slider" htmlFor="m-rh">
            <span className="row-between"><b>Umidade mínima</b><output>{manual.h}%</output></span>
            <input id="m-rh" type="range" min="10" max="90" step="1" value={manual.h} onChange={(e) => setManual({ ...manual, h: +e.target.value })} />
          </label>
        </Reveal>
      )}

      {clima.tmax != null && (
        <Reveal className="card stack-sm" delay={0.05}>
          <div className="grid3">
            <div className="tile tone-sun">
              <span className="small strong">Agora</span>
              <span className="tile-val lg">{clima.now != null ? <><Num value={clima.now} d={0} />°</> : '--'}</span>
            </div>
            <div className="tile tone-peach">
              <span className="small strong">Máxima</span>
              <span className="tile-val lg"><Num value={clima.tmax} />°</span>
            </div>
            <div className="tile tone-mint">
              <span className="small strong">Umidade mín.</span>
              <span className="tile-val lg"><Num value={clima.rh} d={0} />%</span>
            </div>
          </div>
          {at && (
            <span className="small muted row-gap">
              <Clock size={14} aria-hidden="true" />
              Atualizado às {String(at.getHours()).padStart(2, '0')}:{String(at.getMinutes()).padStart(2, '0')} · guardado por 30 minutos
            </span>
          )}
        </Reveal>
      )}

      {lv && (
        <Reveal delay={0.1}>
          <motion.div className="level-card" animate={{ backgroundColor: lv.bg, color: lv.fg }} transition={{ duration: 0.5 }}>
            <span className="small strong op">Nível de alerta de BH · {clima.mode === 'manual' ? 'seus valores' : DAY_NAMES[day].toLowerCase()}</span>
            <AnimatePresence mode="wait">
              <motion.div key={lv.n} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
                <span className="level-name">{lv.n}</span>
                <p className="level-msg">{lv.m}</p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </Reveal>
      )}

      {lv && (
        <Reveal className="card stack-sm" delay={0.05}>
          <span className="strong">As 6 faixas do Protocolo de Calor</span>
          <Stagger className="scale">
            {LEVELS.map((l, i) => {
              const on = i === clima.nivel;
              return (
                <motion.div key={l.n} variants={itemV} className="seg-wrap">
                  <motion.div
                    className={`seg${on ? ' on' : ''}`}
                    style={{ background: l.bg, color: l.fg }}
                    animate={{ opacity: on ? 1 : 0.45, height: on ? 78 : 60 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  >
                    <b>{l.n}</b>
                    <span>{l.r}</span>
                  </motion.div>
                </motion.div>
              );
            })}
          </Stagger>
          <div className="soft row-between base">
            <span>Sensação térmica</span>
            <span className="tile-val lg"><Num value={clima.hi} />°</span>
          </div>
          <span className="small muted">Calculada com a máxima e a umidade mínima do dia, pelo índice de calor da NOAA.</span>
        </Reveal>
      )}

      <Reveal className="note tone-mint">
        <Chip icon={Info} tone="white" size={36} />
        <p>Sensores da UFMG no Morro do Papagaio mostraram que o ar da rua fica perto do resto da cidade, porque o relevo ajuda a ventilar (Machado, 2024). O calor que pega é dentro de casa, debaixo de telha e laje sem proteção.</p>
      </Reveal>

      <Reveal>
        <motion.button type="button" className="cta" onClick={() => go('risco')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
          Ver o risco na minha casa <ArrowRight size={18} aria-hidden="true" />
        </motion.button>
      </Reveal>

      <Footer />
    </div>
  );
}
