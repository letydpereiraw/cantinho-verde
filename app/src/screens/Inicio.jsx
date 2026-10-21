import { motion } from 'framer-motion';
import { Leaf, MapPin, Gauge, Sprout, Bug, Heart, ChevronRight } from 'lucide-react';
import { LEVELS, fmt } from '../lib.js';
import { Reveal, Stagger, itemV, Num, Chip, Bar, Footer } from '../ui.jsx';

const TILES = [
  { id: 'risco', title: 'Risco na minha casa', sub: '3 perguntas rápidas', icon: Gauge, tone: 'peach' },
  { id: 'plantar', title: 'Monte seu cantinho', sub: 'Laje, muro, janela, quintal', icon: Sprout, tone: 'mint' },
  { id: 'plantas', title: 'Plantas do sol', sub: '8 que aguentam BH', icon: Leaf, tone: 'green' },
  { id: 'dengue', title: 'Sem dengue', sub: 'Checklist de 6 itens', icon: Bug, tone: 'sun' },
];

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
}

function hora(t) {
  const d = new Date(t);
  return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
}

export default function Inicio({ clima, go }) {
  const hoje = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  const lv = clima.nivel != null ? LEVELS[clima.nivel] : null;

  return (
    <div className="stack">
      <Reveal className="brand-row">
        <span className="brand">
          <motion.span className="round sm" initial={{ rotate: -40, scale: 0.6 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }}>
            <Leaf size={20} aria-hidden="true" />
          </motion.span>
          Cantinho Verde
        </span>
        <span className="place"><MapPin size={14} aria-hidden="true" />Morro do Papagaio</span>
      </Reveal>

      <Reveal className="hello" delay={0.05}>
        <p className="muted cap">{hoje}</p>
        <h1 className="display">{greeting()},<br />vizinhança</h1>
      </Reveal>

      <Reveal delay={0.1}>
        <motion.button type="button" className="card weather" onClick={() => go('clima')} whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
          <div className="row-between">
            <span className="strong">Calor em BH {clima.mode === 'manual' ? '(valores à mão)' : 'agora'}</span>
            <span className="small muted">
              {clima.mode === 'auto' && `Atualizado às ${hora(clima.at)}`}
              {clima.mode === 'loading' && 'Buscando...'}
              {clima.mode === 'manual' && 'Sem conexão'}
            </span>
          </div>
          <div className="row-between end">
            <span className="big-temp">
              {clima.mode === 'auto' ? <><Num value={clima.now} d={0} />°</> : clima.mode === 'manual' ? <><Num value={clima.tmax} d={0} />°</> : '--'}
            </span>
            {clima.tmax != null && (
              <div className="small muted right">
                <div>Máxima hoje <b className="ink">{fmt(clima.tmax)}°</b></div>
                <div>Umidade mínima <b className="ink">{fmt(clima.rh, 0)}%</b></div>
              </div>
            )}
          </div>
          {lv && (
            <>
              <div className="stack-xs">
                <Bar pct={((clima.nivel + 1) / 6) * 100} />
                <span className="small muted">Nível {clima.nivel} de 5 no Protocolo de Calor de BH</span>
              </div>
              <div className="grid2">
                <div className="tile tone-sun">
                  <span className="small">Alerta de BH</span>
                  <span className="tile-val">{lv.n}</span>
                </div>
                <div className="tile tone-peach">
                  <span className="small">Sensação térmica</span>
                  <span className="tile-val"><Num value={clima.hi} />°</span>
                </div>
              </div>
            </>
          )}
          <span className="small muted">O calor que pega é dentro de casa. Toque para ver os 3 dias.</span>
        </motion.button>
      </Reveal>

      <Reveal className="panel" delay={0.15}>
        <span className="strong pad-x">O que você quer fazer hoje?</span>
        <Stagger className="grid2">
          {TILES.map((t) => (
            <motion.button key={t.id} type="button" className="card tile-link" variants={itemV} onClick={() => go(t.id)} whileHover={{ y: -4 }} whileTap={{ scale: 0.96 }}>
              <Chip icon={t.icon} tone={t.tone} />
              <span className="strong">{t.title}</span>
              <span className="small muted">{t.sub}</span>
            </motion.button>
          ))}
        </Stagger>
        <motion.button type="button" className="card row-link" onClick={() => go('cuidados')} whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
          <Chip icon={Heart} tone="peach" />
          <span className="grow">
            <span className="strong block">Cuidados no calor</span>
            <span className="small muted">Pessoas, bichos, ambiente e fontes</span>
          </span>
          <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity }}><ChevronRight size={20} className="muted" aria-hidden="true" /></motion.span>
        </motion.button>
      </Reveal>

      <Footer />
    </div>
  );
}
