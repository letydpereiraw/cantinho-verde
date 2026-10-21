// Gera dist/artifact.html: a mesma página, sem o esqueleto <html>/<head>/<body>,
// no formato que o Claude publica como Artifact.
import { readFileSync, writeFileSync } from 'node:fs';

const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const head = html.match(/<head>([\s\S]*?)<\/head>/)[1]
  .replace(/<meta charset[^>]*>\s*/i, '')
  .replace(/<meta name="viewport"[^>]*>\s*/i, '')
  .replace(/<title>[^<]*<\/title>\s*/i, '');
const body = html.match(/<body>([\s\S]*?)<\/body>/)[1];
const out = '<title>Cantinho Verde</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n' + head.trim() + '\n' + body.trim() + '\n';
writeFileSync(new URL('../dist/artifact.html', import.meta.url), out);
console.log('dist/artifact.html', (out.length / 1024).toFixed(0) + ' KB');
