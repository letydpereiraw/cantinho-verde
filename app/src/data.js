export const QUESTIONS = [
  {
    key: 'roof', single: true, title: 'O que tem em cima de você?', hint: 'Escolha uma.',
    opts: [
      ['fibro', 'Telha de fibrocimento ou zinco, sem forro'],
      ['laje', 'Laje no sol, sem nada em cima'],
      ['forro', 'Telha com forro'],
      ['verde', 'Laje com plantas ou pintada de branco'],
    ],
  },
  {
    key: 'house', title: 'Como é a casa?', hint: 'Pode marcar várias. Se nenhuma, siga em frente.',
    opts: [
      ['ultimo', 'Fica no último andar'],
      ['vent', 'Tem pouca ventilação'],
      ['sombra', 'Não tem árvore nem sombra perto'],
    ],
  },
  {
    key: 'people', title: 'Quem mora ou passa o dia aí?', hint: 'Pode marcar várias.',
    opts: [
      ['idoso', 'Pessoa com 65 anos ou mais'],
      ['crianca', 'Criança pequena'],
      ['doenca', 'Alguém com doença do coração, rim, pressão ou diabetes'],
      ['pet', 'Cão ou gato'],
    ],
  },
];

export const GUIDE = [
  {
    id: 'laje', n: 'Laje',
    mats: ['Garrafa PET de 2 litros', 'Caixa de feira', 'Bidim (manta que deixa a água passar)', 'Lona grossa', 'Terra leve (com fibra de coco ou casca de arroz)', 'Grama-amendoim, onze-horas ou kalanchoe'],
    steps: ['Chame um pedreiro ou engenheiro para olhar a laje.', 'Limpe a laje e veja onde fica o ralo.', 'Estenda a lona, sem cobrir o ralo.', 'Coloque as caixas de feira lado a lado, ou garrafas PET cortadas ao meio.', 'Forre por dentro com o bidim.', 'Ponha de 5 a 10 cm de terra leve. Não mais que isso.', 'Plante as mudas perto umas das outras para cobrir rápido.', 'Regue no fim da tarde nas primeiras semanas.'],
  },
  {
    id: 'muro', n: 'Muro',
    mats: ['Garrafa PET', 'Arame ou barbante forte', 'Parafuso e bucha', 'Bidim', 'Terra leve', 'Ora-pro-nóbis ou pimenta', 'Luva grossa'],
    steps: ['Escolha o muro que pega sol da tarde.', 'Corte uma abertura de lado em cada garrafa e fure embaixo.', 'Forre com bidim e encha de terra leve.', 'Prenda as garrafas no muro com arame, em parafuso e bucha.', 'Plante. Use luva com ora-pro-nóbis, ela tem espinhos.', 'Regue a garrafa de cima: a água desce para a de baixo.'],
  },
  {
    id: 'janela', n: 'Janela',
    mats: ['Vaso leve ou PET com furo no fundo', 'Suporte de ferro ou arame forte', 'Bidim', 'Terra leve', 'Babosa, kalanchoe ou pimenta'],
    steps: ['Meça a janela e escolha vasos leves.', 'Fure o fundo de cada vaso.', 'Ponha o bidim no fundo e depois a terra.', 'Prenda o suporte na parede e amarre bem cada vaso.', 'Plante e regue pouco. Essas plantas gostam de pouca água.', 'Confira as amarras uma vez por mês.'],
  },
  {
    id: 'quintal', n: 'Garagem ou quintal',
    mats: ['Balde grande ou lata com furo no fundo', 'Caixa de feira', 'Terra com esterco', 'Folhas secas para cobrir a terra', 'Pitanga ou capim-limão'],
    steps: ['Escolha um canto que pegue sol.', 'Fure o fundo do balde ou da lata para a água sair.', 'Plante a pitanga onde ela possa crescer e fazer sombra.', 'Cubra a terra com folhas secas para guardar umidade.', 'Chame os vizinhos para plantar e cuidar juntos.'],
  },
];

export const SAFETY = [
  'Peça para um pedreiro ou engenheiro olhar a laje antes de começar.',
  'Não cubra o ralo.',
  'Use só 5 a 10 cm de terra leve.',
  'Prenda bem os vasos da janela.',
  'Ora-pro-nóbis tem espinhos. Use luva.',
];

export const TAGS = ['Nativa', 'Sol pleno', 'Pouca água', 'Comestível'];

export const PLANTS = [
  { n: 'Ora-pro-nóbis', s: 'Pereskia aculeata', f: 'Trepadeira forte. A folha é rica em proteína e vai no feijão e no angu. Tem espinhos.', t: ['Nativa', 'Sol pleno', 'Pouca água', 'Comestível'], w: 'muro e cerca' },
  { n: 'Grama-amendoim', s: 'Arachis repens', f: 'Forma um tapete baixo que cobre a laje e segura a terra.', t: ['Nativa', 'Sol pleno'], w: 'laje' },
  { n: 'Onze-horas', s: 'Portulaca grandiflora', f: 'Flor que abre com o sol e vive bem em terra rasa.', t: ['Nativa', 'Sol pleno', 'Pouca água'], w: 'laje e vaso' },
  { n: 'Kalanchoe', s: 'Kalanchoe spp.', f: 'Guarda água na folha. Já foi usada em telhado verde com garrafa PET.', t: ['Sol pleno', 'Pouca água'], w: 'laje e janela' },
  { n: 'Babosa', s: 'Aloe vera', f: 'Pede pouca rega e aguenta sol forte o dia todo.', t: ['Sol pleno', 'Pouca água'], w: 'janela e vaso' },
  { n: 'Capim-limão', s: 'Cymbopogon citratus', f: 'Cresce rápido em touceira e dá um chá cheiroso.', t: ['Sol pleno', 'Comestível'], w: 'quintal e vaso grande' },
  { n: 'Pimenta', s: 'Capsicum spp.', f: 'Cabe em vaso pequeno e dá fruto quase o ano todo.', t: ['Nativa', 'Sol pleno', 'Comestível'], w: 'janela e vaso' },
  { n: 'Pitanga', s: 'Eugenia uniflora', f: 'Árvore pequena que dá sombra, fruta e chama passarinho.', t: ['Nativa', 'Sol pleno', 'Comestível'], w: 'quintal e garagem' },
];

export const CHECKS = [
  'Nenhum prato embaixo dos vasos, ou prato cheio de areia.',
  'Todo vaso com furo no fundo.',
  'Ralo da laje livre.',
  'Nada de planta que acumula água nas folhas, como bromélia.',
  'Garrafas de boca para baixo e pneus sem água.',
  'Uma vistoria por semana.',
];

export const CARE = [
  {
    n: 'Pessoas', tone: 'peach',
    items: ['Beba água antes de sentir sede.', 'Boca seca é sinal de desidratação.', 'Exercício só cedo ou no fim da tarde.', 'Cuidado com quedas nas escadas. O calor dá tontura.', 'Sinais de alerta (tontura forte, confusão, vômito): procure o posto de saúde ou ligue 192.'],
  },
  {
    n: 'Animais', tone: 'sun',
    items: ['Água e sombra o tempo todo.', 'Teste dos 5 segundos: mão no chão. Se você não aguenta, a pata também não.', 'Asfalto ao sol passa de 50 °C.', 'Passeio só nos horários frescos.', 'Ofegante, babando muito ou cambaleando: é hipertermia. Molhe com água fresca e leve ao veterinário.'],
  },
  {
    n: 'Ambiente', tone: 'mint',
    items: ['Planta faz sombra e esfria a parede e a laje.', 'Telhado verde segura a chuva e solta a água devagar.', 'Flor e fruta trazem de volta aves e abelhas.', 'Chame os vizinhos para um mutirão.'],
  },
];

export const SOURCES = [
  'Prefeitura de Belo Horizonte. Protocolo de Calor de Belo Horizonte, 2026.',
  'Machado, F. L. V. Por uma climatologia das favelas. Tese, UFMG, 2024.',
  'Silva, B. R. Tese, COPPE/UFRJ, 2016. Telhado verde leve na favela do Arará: superfície interna 11 °C mais fria.',
  'Vilarim, M. B. Dissertação, UFPE, 2022. Telhado verde com garrafa PET e Kalanchoe.',
  'EPAMIG. Circular Técnica 177, 2012. Ora-pro-nóbis.',
  'Mordecai, E. A. et al., 2017. Temperatura e transmissão de doenças pelo Aedes.',
  'NOAA. Índice de calor, fórmula de Rothfusz.',
  'Open-Meteo. Previsão do tempo gratuita.',
];
