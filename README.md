# Laboratorio di matematica

Piccolo sito statico per esplorare graficamente il ruolo dei parametri nel piano cartesiano.

## Prima versione

- Retta: `y = mx + q`
- Parabola: `y = a(x - h)^2 + k`
- Circonferenza: `(x - h)^2 + (y - k)^2 = r^2`
- Modalità **Esplora** con slider e osservazioni dinamiche
- Modalità **Sfida**: sovrapporre la propria curva a una curva bersaglio trovando i parametri corretti
- Grafico SVG costruito in JavaScript puro
- Nessuna dipendenza esterna
- Layout responsive, adatto anche a smartphone

## Avvio locale

Il sito usa moduli JavaScript ES, quindi è meglio aprirlo tramite un piccolo server locale.

Con Python:

```bash
python3 -m http.server 8000
```

Poi aprire:

```text
http://localhost:8000
```

## Pubblicazione con GitHub Pages

1. Caricare tutti i file in un repository GitHub.
2. Aprire **Settings → Pages**.
3. Scegliere **Deploy from a branch**.
4. Selezionare il branch `main` e la cartella `/ (root)`.

## Struttura

```text
laboratorio-matematica/
├── index.html
├── lab.html
├── css/
│   └── style.css
└── js/
    ├── app.js
    ├── functions.js
    └── graph.js
```

La logica delle singole figure è concentrata soprattutto in `js/functions.js`, così sarà facile aggiungere altri argomenti senza duplicare il sito.
