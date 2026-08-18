export const TOPICS = {
  linea: {
    key: "linea",
    title: "Retta",
    kicker: "FUNZIONE LINEARE",
    description: "La retta è il caso più semplice per capire come un parametro può cambiare immediatamente un grafico.",
    xRange: [-10, 10],
    yRange: [-7, 7],
    params: [
      { key: "m", label: "m — coefficiente angolare", min: -4, max: 4, step: 0.5, default: 1 },
      { key: "q", label: "q — intercetta sull'asse y", min: -5, max: 5, step: 0.5, default: 0 }
    ],
    formula: p => `y = ${signedTerm(p.m, "x", true)} ${signedConstant(p.q)}`.replace(/\s+/g, " ").trim(),
    evaluate: (x, p) => p.m * x + p.q,
    points: p => [
      { x: 0, y: p.q, label: `Q(0; ${fmt(p.q)})` }
    ],
    observations: p => {
      const slope = p.m > 0 ? "crescente" : p.m < 0 ? "decrescente" : "orizzontale";
      const qText = p.q === 0 ? "passa per l'origine" : `interseca l'asse y nel punto (0; ${fmt(p.q)})`;
      return [
        `La retta è <strong>${slope}</strong>.`,
        `Il coefficiente angolare è <strong>m = ${fmt(p.m)}</strong>.`,
        `La retta ${qText}.`
      ];
    },
    theory: [
      ["m", "determina la pendenza. Se m > 0 la retta cresce; se m < 0 decresce; se m = 0 è orizzontale."],
      ["q", "indica il punto in cui la retta incontra l'asse y: il punto è sempre (0; q)."]
    ],
    caption: "Muovi m e q e osserva come cambia la posizione della retta.",
    challengeValues: {
      m: [-3, -2, -1, -0.5, 0.5, 1, 2, 3],
      q: [-4, -3, -2, -1, 0, 1, 2, 3, 4]
    }
  },

  parabola: {
    key: "parabola",
    title: "Parabola",
    kicker: "FUNZIONE QUADRATICA",
    description: "Usiamo la forma con il vertice per vedere subito il significato geometrico dei parametri.",
    xRange: [-10, 10],
    yRange: [-7, 7],
    params: [
      { key: "a", label: "a — apertura e verso", min: -3, max: 3, step: 0.25, default: 1, disallowZero: true },
      { key: "h", label: "h — spostamento orizzontale", min: -5, max: 5, step: 0.5, default: 0 },
      { key: "k", label: "k — spostamento verticale", min: -5, max: 5, step: 0.5, default: 0 }
    ],
    formula: p => `y = ${coef(p.a)}(${shifted("x", p.h)})² ${signedConstant(p.k)}`.replace(/\s+/g, " ").trim(),
    evaluate: (x, p) => p.a * (x - p.h) ** 2 + p.k,
    points: p => [
      { x: p.h, y: p.k, label: `V(${fmt(p.h)}; ${fmt(p.k)})` }
    ],
    observations: p => {
      const direction = p.a > 0 ? "verso l'alto" : "verso il basso";
      const width = Math.abs(p.a) > 1 ? "più stretta di y = x²" : Math.abs(p.a) < 1 ? "più larga di y = x²" : "con la stessa apertura di y = x²";
      return [
        `Il vertice è <strong>V(${fmt(p.h)}; ${fmt(p.k)})</strong>.`,
        `La parabola è rivolta <strong>${direction}</strong>.`,
        `È <strong>${width}</strong>.`
      ];
    },
    theory: [
      ["a", "controlla il verso e l'apertura. Il segno indica se la parabola è rivolta verso l'alto o verso il basso."],
      ["h", "sposta il vertice a destra o a sinistra. La coordinata x del vertice è h."],
      ["k", "sposta la parabola verso l'alto o verso il basso. La coordinata y del vertice è k."]
    ],
    caption: "Il punto evidenziato è il vertice V(h; k).",
    challengeValues: {
      a: [-2, -1, -0.5, 0.5, 1, 2],
      h: [-4, -3, -2, -1, 0, 1, 2, 3, 4],
      k: [-4, -3, -2, -1, 0, 1, 2, 3, 4]
    }
  },

  circonferenza: {
    key: "circonferenza",
    title: "Circonferenza",
    kicker: "CURVA NEL PIANO CARTESIANO",
    description: "La circonferenza ci permette di uscire dal caso y = f(x): ora x e y compaiono insieme nella stessa equazione.",
    xRange: [-10, 10],
    yRange: [-7, 7],
    params: [
      { key: "h", label: "h — coordinata x del centro", min: -5, max: 5, step: 0.5, default: 0 },
      { key: "k", label: "k — coordinata y del centro", min: -4, max: 4, step: 0.5, default: 0 },
      { key: "r", label: "r — raggio", min: 0.5, max: 6, step: 0.5, default: 3 }
    ],
    formula: p => `(${shifted("x", p.h)})² + (${shifted("y", p.k)})² = ${fmt(p.r)}²`,
    curveType: "circle",
    points: p => [
      { x: p.h, y: p.k, label: `C(${fmt(p.h)}; ${fmt(p.k)})` },
      { x: p.h + p.r, y: p.k, label: `r = ${fmt(p.r)}`, secondary: true }
    ],
    observations: p => [
      `Il centro è <strong>C(${fmt(p.h)}; ${fmt(p.k)})</strong>.`,
      `Il raggio è <strong>r = ${fmt(p.r)}</strong>.`,
      `Il diametro misura <strong>${fmt(2 * p.r)}</strong>.`
    ],
    theory: [
      ["h", "è la coordinata x del centro C(h; k)."],
      ["k", "è la coordinata y del centro C(h; k)."],
      ["r", "è il raggio: la distanza dal centro a ogni punto della circonferenza."]
    ],
    caption: "Il centro C(h; k) e il raggio r determinano completamente la circonferenza.",
    challengeValues: {
      h: [-4, -3, -2, -1, 0, 1, 2, 3, 4],
      k: [-3, -2, -1, 0, 1, 2, 3],
      r: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
    }
  }
};

export function initialParams(topic) {
  return Object.fromEntries(topic.params.map(param => [param.key, param.default]));
}

export function randomChallenge(topic) {
  const result = {};
  for (const param of topic.params) {
    const values = topic.challengeValues[param.key];
    result[param.key] = values[Math.floor(Math.random() * values.length)];
  }
  return result;
}

export function fmt(value) {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded).replace(".", ",");
}

function coef(value) {
  if (value === 1) return "";
  if (value === -1) return "−";
  return fmt(value);
}

function shifted(variable, value) {
  if (value === 0) return variable;
  return value > 0 ? `${variable} − ${fmt(value)}` : `${variable} + ${fmt(Math.abs(value))}`;
}

function signedConstant(value) {
  if (value === 0) return "";
  return value > 0 ? `+ ${fmt(value)}` : `− ${fmt(Math.abs(value))}`;
}

function signedTerm(value, variable, omitOne = false) {
  if (value === 0) return "0";
  if (omitOne && value === 1) return variable;
  if (omitOne && value === -1) return `−${variable}`;
  return `${fmt(value)}${variable}`;
}
