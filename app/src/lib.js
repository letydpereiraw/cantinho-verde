// Clima, níveis de alerta e cálculo de risco

export const API =
  'https://api.open-meteo.com/v1/forecast?latitude=-19.95&longitude=-43.94&current=temperature_2m,relative_humidity_2m,apparent_temperature&daily=temperature_2m_max,relative_humidity_2m_min&timezone=America%2FSao_Paulo&forecast_days=3';
export const CACHE_KEY = 'cv-clima';
export const CACHE_TTL = 30 * 60 * 1000;

export function store(key, val) {
  try {
    if (val === undefined) return JSON.parse(localStorage.getItem(key));
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    return null;
  }
}

export const fmt = (n, d = 1) => Number(n).toLocaleString('pt-BR', { maximumFractionDigits: d });

// Protocolo de Calor de Belo Horizonte (2026)
export const LEVELS = [
  { n: 'Sem alerta', r: 'até 29,2', m: 'Dia sem alerta de calor.', bg: '#FFF3B0', fg: '#3D3300' },
  { n: 'Atenção', r: '29,3 a 31,9', m: 'A mortalidade na cidade já começa a subir.', bg: '#FFD166', fg: '#3D2A00' },
  { n: 'Alerta 1', r: '32 a 33,1', m: 'Evite sol forte entre 10h e 16h.', bg: '#F4A259', fg: '#3A1A00' },
  { n: 'Alerta 2', r: '33,2 a 34,6', m: 'Calor perigoso para idosos e crianças.', bg: '#E2603F', fg: '#FFFFFF' },
  { n: 'Alerta 3', r: '34,7 a 35,8', m: 'Risco alto para todo mundo.', bg: '#B8281F', fg: '#FFFFFF' },
  { n: 'Alerta 4', r: 'acima de 35,8', m: 'Nível máximo: em média, cerca de 7 mortes a mais por dia em BH.', bg: '#6E1010', fg: '#FFFFFF' },
];

export function nivelDe(t) {
  t = Math.round(t * 10) / 10;
  if (t <= 29.2) return 0;
  if (t <= 31.9) return 1;
  if (t <= 33.1) return 2;
  if (t <= 34.6) return 3;
  if (t <= 35.8) return 4;
  return 5;
}

// Índice de calor do NOAA (fórmula de Rothfusz), em °C
export function heatIndex(c, rh) {
  const T = (c * 9) / 5 + 32;
  const R = rh;
  let hi = 0.5 * (T + 61 + (T - 68) * 1.2 + R * 0.094);
  if ((hi + T) / 2 >= 80) {
    hi = -42.379 + 2.04901523 * T + 10.14333127 * R - 0.22475541 * T * R - 0.00683783 * T * T
      - 0.05481717 * R * R + 0.00122874 * T * T * R + 0.00085282 * T * R * R - 0.00000199 * T * T * R * R;
    if (R < 13 && T >= 80 && T <= 112) hi -= ((13 - R) / 4) * Math.sqrt((17 - Math.abs(T - 95)) / 17);
    else if (R > 85 && T >= 80 && T <= 87) hi += ((R - 85) / 10) * ((87 - T) / 5);
  }
  return ((hi - 32) * 5) / 9;
}

export const ROOF = { fibro: 2, laje: 2, forro: 1, verde: 0 };

export const RISKS = [
  { n: 'Baixo', bg: '#DCF3E1', fg: '#1D5A32' },
  { n: 'Moderado', bg: '#FCEFC2', fg: '#6E5000' },
  { n: 'Alto', bg: '#FDDCC6', fg: '#8E3A0E' },
  { n: 'Muito alto', bg: '#F8CFCB', fg: '#8F1A12' },
];

export function calcRisk(nivel, roof, house, people) {
  const casa = (ROOF[roof] ?? 0) + (house.ultimo ? 1 : 0) + (house.vent ? 1 : 0) + (house.sombra ? 1 : 0);
  const ic = people.idoso || people.crianca;
  const sens = people.doenca && ic ? 1.5 : people.doenca || ic ? 1 : 0;
  const soma = Math.round((nivel + casa * 0.6 + sens) * 100) / 100;
  return { casa, sens, soma, r: soma < 2 ? 0 : soma < 4 ? 1 : soma < 6 ? 2 : 3 };
}

export function careFor(nivel, risk, roof, house, people) {
  const pessoas = ['Beba água antes de sentir sede.'];
  if (nivel >= 2) pessoas.push('Fique longe do sol forte entre 10h e 16h.');
  if (people.idoso) pessoas.push('Quem tem 65 anos ou mais sente menos sede. Ofereça água de hora em hora.');
  if (people.crianca) pessoas.push('Criança pequena: roupa leve, água sempre e nunca sozinha em cômodo fechado ou carro.');
  if (people.doenca) pessoas.push('Não pare o remédio. Pergunte no posto se precisa mudar algo no calor.');
  if (risk >= 2) pessoas.push('Na hora mais quente, fique no cômodo mais fresco, no andar de baixo se der.');
  pessoas.push('Tontura forte ou confusão: procure o posto ou ligue 192.');

  const animais = people.pet
    ? ['Água fresca e sombra o dia todo.', 'Mão no chão por 5 segundos. Se queimar, queima a pata.',
       nivel >= 2 ? 'Passeio só antes das 9h ou depois das 18h.' : 'Passeio nos horários frescos.',
       'Nunca deixe o bicho preso na laje ao sol.']
    : ['Você não marcou cão ou gato.', 'Uma vasilha de água na sombra ajuda bichos da rua e passarinhos.', 'Troque a água todo dia para não virar criadouro.'];

  const casa = [];
  if (roof === 'fibro') casa.push('Telha sem forro esquenta muito. Um forro simples ou uma manta embaixo já ajuda.');
  if (roof === 'laje') casa.push('Laje no sol guarda calor e solta de noite. Pintar de branco ou plantar em cima ajuda.');
  if (roof === 'forro') casa.push('O forro já ajuda. Deixe uma fresta para o ar quente sair.');
  if (roof === 'verde') casa.push('Seu telhado já protege. Cuide da rega e deixe o ralo livre.');
  if (house.ultimo) casa.push('No último andar o calor do teto pega mais. Nos dias de alerta, durma no cômodo mais baixo.');
  if (house.vent) casa.push('Abra janelas de lados opostos à noite e cedo. Feche no sol forte.');
  if (house.sombra) casa.push('Plante algo que faça sombra na parede que pega sol da tarde.');
  if (!house.vent) casa.push('Pano úmido pendurado na janela refresca o ar que entra.');

  return [
    { title: 'Pessoas', tone: 'peach', items: pessoas },
    { title: 'Animais', tone: 'sun', items: animais },
    { title: 'Casa e ambiente', tone: 'mint', items: casa },
  ];
}
