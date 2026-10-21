import { createContext, useContext, useEffect } from 'react';
import { motion, animate, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sun, Moon } from 'lucide-react';
import { fmt } from './lib.js';

export const ThemeContext = createContext({ theme: 'light', toggle: () => {} });

// Botão de sol e lua para trocar entre claro e escuro
export function ThemeToggle() {
  const { theme, toggle } = useContext(ThemeContext);
  const dark = theme === 'dark';
  return (
    <motion.button type="button" className="round theme-btn" onClick={toggle} whileTap={{ scale: 0.88 }}
      aria-label={dark ? 'Mudar para o modo claro' : 'Mudar para o modo escuro'} title={dark ? 'Modo claro' : 'Modo escuro'}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={theme} className="theme-icon" initial={{ rotate: -90, scale: 0.4, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} exit={{ rotate: 90, scale: 0.4, opacity: 0 }} transition={{ duration: 0.2 }}>
          {dark ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

export const spring = { type: 'spring', stiffness: 260, damping: 26 };

// Aparece ao rolar a tela
export function Reveal({ children, className, delay = 0, as = 'div', ...rest }) {
  const M = motion[as];
  return (
    <M
      className={className}
      inherit={false}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ ...spring, delay }}
      {...rest}
    >
      {children}
    </M>
  );
}

// Lista em que os itens entram um depois do outro ao rolar
const listV = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
export const itemV = {
  hidden: { opacity: 0, y: 22, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: spring },
};

export function Stagger({ children, className, as = 'div', ...rest }) {
  const M = motion[as];
  return (
    <M className={className} inherit={false} variants={listV} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} {...rest}>
      {children}
    </M>
  );
}

// Número que conta até o valor
export function Num({ value, d = 1 }) {
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => fmt(v, d));
  useEffect(() => {
    const c = animate(mv, value, { duration: 0.9, ease: [0.22, 1, 0.36, 1] });
    return c.stop;
  }, [value, mv]);
  return <motion.span>{text}</motion.span>;
}

export function Chip({ icon: Icon, tone = 'green', size = 40 }) {
  return (
    <span className={`chip tone-${tone}`} style={{ width: size, height: size }}>
      <Icon size={Math.round(size / 2)} strokeWidth={2} aria-hidden="true" />
    </span>
  );
}

export function TopBar({ title, go, sub }) {
  return (
    <Reveal className="topbar">
      <div className="topbar-row">
        <motion.button type="button" className="round" aria-label="Voltar para o início" onClick={() => go('inicio')} whileTap={{ scale: 0.9 }} whileHover={{ x: -2 }}>
          <ArrowLeft size={20} aria-hidden="true" />
        </motion.button>
        <h1 className="screen-title grow">{title}</h1>
        <ThemeToggle />
      </div>
      {sub && <p className="muted">{sub}</p>}
    </Reveal>
  );
}

// Controle de abas com a pílula que desliza
export function Segmented({ id, items, value, onChange, label, wrap = false }) {
  return (
    <div className={wrap ? 'pills' : 'segmented'} role="tablist" aria-label={label} style={wrap ? undefined : { gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
      {items.map((it) => {
        const on = it.value === value;
        return (
          <motion.button
            key={it.value}
            type="button"
            role="tab"
            aria-selected={on}
            className={`seg-btn${on ? ' on' : ''}`}
            onClick={() => onChange(it.value)}
            whileTap={{ scale: 0.95 }}
          >
            {on && <motion.span layoutId={`seg-${id}`} className="seg-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <span className="seg-label">
              {it.label}
              {it.sub && <small>{it.sub}</small>}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

export function Bar({ pct, color = 'var(--fill)', height = 10 }) {
  return (
    <div className="bar" style={{ height }}>
      <motion.div className="bar-fill" style={{ background: color }} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
    </div>
  );
}

export function Footer() {
  return (
    <footer className="foot">
      <p>
        Dados do tempo: <a href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo.com</a> (<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>)
      </p>
      <p>Protótipo do trabalho de Saúde Única (Arco de Maguerez, etapa 5). Estefany Oliveira · Gabriel Fernandes · Letícia Dantas · 2026</p>
    </footer>
  );
}
