import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sprout, CircleHelp, RotateCcw } from 'lucide-react';
import { LEVELS, RISKS, calcRisk, careFor, fmt, store } from '../lib.js';
import { QUESTIONS } from '../data.js';
import { Reveal, Stagger, itemV, Bar, Footer, Chip, ThemeToggle } from '../ui.jsx';

const KEY = 'cv-casa';
const slide = {
  enter: (dir) => ({ opacity: 0, x: dir * 60 }),
  center: { opacity: 1, x: 0 },
  exit: (dir) => ({ opacity: 0, x: dir * -60 }),
};

function loadAnswers() {
  const s = store(KEY);
  return s && typeof s === 'object' && s.house && s.people ? s : { roof: null, house: {}, people: {} };
}

export default function Risco({ clima, go }) {
  const [ans, setAns] = useState(loadAnswers);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [calcOpen, setCalcOpen] = useState(false);

  const save = (next) => { setAns(next); store(KEY, next); };
  const move = (to) => { setDir(to > step ? 1 : -1); setStep(to); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const nivel = clima.nivel ?? 0;
  const done = step === 3;
  const q = QUESTIONS[step];
  const ready = !q || !q.single || !!ans.roof;

  const pick = (key) => {
    if (q.single) return save({ ...ans, roof: key });
    save({ ...ans, [q.key]: { ...ans[q.key], [key]: !ans[q.key][key] } });
  };

  const r = done ? calcRisk(nivel, ans.roof, ans.house, ans.people) : null;
  const g = done ? calcRisk(nivel, 'verde', { ...ans.house, sombra: false }, ans.people) : null;
  const R = r ? RISKS[r.r] : null;
  let green = '';
  if (done) {
    if (ans.roof === 'verde' && !ans.house.sombra) green = 'Seu telhado já está protegido. Continue cuidando dele.';
    else if (g.r < r.r) green = `Com cantinho verde na laje: ${R.n} passa para ${RISKS[g.r].n}.`;
    else green = `Com cantinho verde na laje: continua ${R.n}, mas a casa fica mais fresca (de ${fmt(r.soma, 2)} para ${fmt(g.soma, 2)} pontos).`;
  }

  return (
    <div className="stack">
      <div className="row-gap">
        <div className="grow"><Bar pct={done ? 100 : ((step + 0.3) / 3) * 100} /></div>
        <ThemeToggle />
        <motion.button type="button" className="round" aria-label="Fechar e voltar ao início" onClick={() => go('inicio')} whileTap={{ scale: 0.9 }} whileHover={{ rotate: 90 }}>
          <X size={20} aria-hidden="true" />
        </motion.button>
      </div>

      <AnimatePresence mode="wait" custom={dir}>
        {!done ? (
          <motion.section key={step} className="stack" custom={dir} variants={slide} initial="enter" animate="center" exit="exit" transition={{ type: 'spring', stiffness: 320, damping: 30 }}>
            <div className="stack-xs">
              <span className="small strong muted">Pergunta {step + 1} de 3 · Risco dentro de casa</span>
              <h1 className="q-title">{q.title}</h1>
              <span className="muted">{q.hint}</span>
            </div>
            <Stagger className="stack-sm" role="group" aria-label={q.title}>
              {q.opts.map(([key, text], i) => {
                const on = q.single ? ans.roof === key : !!ans[q.key][key];
                return (
                  <motion.button
                    key={key}
                    type="button"
                    variants={itemV}
                    aria-pressed={on}
                    className={`option${on ? ' on' : ''}`}
                    onClick={() => pick(key)}
                    whileTap={{ scale: 0.97 }}
                    animate={on ? { scale: [1, 1.02, 1] } : { scale: 1 }}
                  >
                    <span className="letter">{'ABCD'[i]}.</span>
                    <span className="grow left">{text}</span>
                  </motion.button>
                );
              })}
            </Stagger>
            <div className="row-gap">
              {step > 0 && (
                <motion.button type="button" className="btn-soft" onClick={() => move(step - 1)} whileTap={{ scale: 0.96 }}>Voltar</motion.button>
              )}
              <motion.button type="button" className="cta grow" disabled={!ready} onClick={() => ready && move(step + 1)} whileTap={ready ? { scale: 0.97 } : undefined}>
                {step === 2 ? 'Ver meu risco' : 'Próxima'}
              </motion.button>
            </div>
          </motion.section>
        ) : (
          <motion.section key="result" className="stack" custom={dir} variants={slide} initial="enter" animate="center" exit="exit" transition={{ type: 'spring', stiffness: 320, damping: 30 }}>
            <span className="small strong muted">
              Seu resultado · calor {clima.mode === 'manual' ? 'pelos seus valores' : 'de hoje'}: {clima.nivel != null ? LEVELS[clima.nivel].n : 'ainda carregando'}
            </span>

            <motion.div className="risk-card" style={{ background: R.bg, color: R.fg }} initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.1 }}>
              <span className="small strong op">Risco dentro de casa</span>
              <motion.span className="risk-name" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>{R.n}</motion.span>
              <div className="meter">
                <motion.span className="meter-dot" style={{ borderColor: R.fg }} initial={{ left: '0%' }} animate={{ left: `${Math.min(100, (r.soma / 9.5) * 100)}%` }} transition={{ type: 'spring', stiffness: 90, damping: 14, delay: 0.35 }} />
              </div>
              <div className="meter-labels"><span>Baixo</span><span>Moderado</span><span>Alto</span><span>Muito alto</span></div>
            </motion.div>

            <Reveal className="green-banner" delay={0.45}>
              <Chip icon={Sprout} tone="white" size={36} />
              <span>{green}</span>
            </Reveal>

            <Stagger className="stack-sm">
              {careFor(nivel, r.r, ans.roof, ans.house, ans.people).map((c) => (
                <motion.div key={c.title} variants={itemV} className="card stack-xs">
                  <span className="card-title"><span className={`dot tone-${c.tone}`} />{c.title}</span>
                  <ul className="list">{c.items.map((t) => <li key={t}>{t}</li>)}</ul>
                </motion.div>
              ))}
            </Stagger>

            <Reveal className="card">
              <button type="button" className="disclosure" aria-expanded={calcOpen} onClick={() => setCalcOpen(!calcOpen)}>
                <CircleHelp size={18} className="accent" aria-hidden="true" />
                <span className="grow left">Como a calculadora chega nesse resultado</span>
                <motion.span animate={{ rotate: calcOpen ? 45 : 0 }} className="plus" aria-hidden="true">+</motion.span>
              </button>
              <AnimatePresence initial={false}>
                {calcOpen && (
                  <motion.div key="calc" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>
                    <div className="stack-sm calc-body">
                      <p>O risco é uma <b>estimativa para orientar cuidados</b>. Não é uma medição da temperatura da sua casa e não é um diagnóstico de saúde.</p>
                      <p>A conta soma três coisas: o calor do dia (de 0 a 5, pelo Protocolo de Calor de BH), os pontos da casa vezes 0,6, e as pessoas sensíveis (idoso, criança ou doença valem 1; doença junto com idoso ou criança vale 1,5).</p>
                      <p>Telha sem forro ou laje no sol valem 2 pontos. Telha com forro vale 1. Laje com plantas ou branca vale 0. Último andar, pouca ventilação e falta de sombra valem 1 cada.</p>
                      <div className="soft mono">
                        <div>Calor do dia: {nivel} ({LEVELS[nivel].n})</div>
                        <div>Casa: {r.casa} pontos × 0,6 = {fmt(r.casa * 0.6, 2)}</div>
                        <div>Pessoas sensíveis: {fmt(r.sens)}</div>
                        <b>Total: {fmt(r.soma, 2)} → {R.n}</b>
                      </div>
                      <p className="muted">Menos de 2: Baixo. Menos de 4: Moderado. Menos de 6: Alto. De 6 para cima: Muito alto.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Reveal>

            <motion.button type="button" className="cta" onClick={() => { setCalcOpen(false); move(0); }} whileTap={{ scale: 0.97 }}>
              <RotateCcw size={18} aria-hidden="true" /> Responder de novo
            </motion.button>
          </motion.section>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
