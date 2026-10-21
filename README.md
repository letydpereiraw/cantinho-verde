# Cantinho Verde

Protótipo do trabalho de Saúde Única (Arco de Maguerez, etapa 5) sobre ilhas de calor no Morro do Papagaio (Aglomerado Santa Lúcia, Belo Horizonte, MG).

O app mostra o calor do dia em BH, o nível de alerta do Protocolo de Calor de Belo Horizonte, uma estimativa de risco dentro de casa, um guia para montar um cantinho verde, plantas que aguentam o sol, um checklist contra a dengue e cuidados de Saúde Única.

- `index.html`: o site pronto (um arquivo só).
- `app/`: código-fonte em React, com Framer Motion e ícones Lucide.

Para mudar e gerar o site de novo:

```sh
cd app
npm install
npm run build
cp dist/index.html ../index.html
```

Dados do tempo: [Open-Meteo.com](https://open-meteo.com/) (CC BY 4.0).

Estefany Oliveira · Gabriel Fernandes · Letícia Dantas · 2026
