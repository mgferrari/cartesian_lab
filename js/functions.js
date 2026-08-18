export const TOPICS = {
  line: {
    key: "line",
    title: "Straight line",
    kicker: "LINEAR FUNCTION",
    description: "A straight line is the simplest case for seeing how parameters change a graph immediately.",
    xRange: [-10, 10], yRange: [-7, 7],
    params: [
      { key: "m", label: "m — slope", min: -4, max: 4, step: 0.5, default: 1 },
      { key: "q", label: "q — y-intercept", min: -5, max: 5, step: 0.5, default: 0 }
    ],
    formula: p => `y = ${signedTerm(p.m, "x", true)} ${signedConstant(p.q)}`.replace(/\s+/g, " ").trim(),
    evaluate: (x, p) => p.m * x + p.q,
    points: p => [{ x: 0, y: p.q, label: `Q(0, ${fmt(p.q)})` }],
    observations: p => {
      const slope = p.m > 0 ? "increasing" : p.m < 0 ? "decreasing" : "horizontal";
      const qText = p.q === 0 ? "passes through the origin" : `crosses the y-axis at (0, ${fmt(p.q)})`;
      return [`The line is <strong>${slope}</strong>.`, `Its slope is <strong>m = ${fmt(p.m)}</strong>.`, `The line ${qText}.`];
    },
    theory: [
      ["m", "controls the slope. If m > 0, the line is increasing; if m < 0, it is decreasing; if m = 0, it is horizontal."],
      ["q", "is the y-intercept. The line always meets the y-axis at the point (0, q)."]
    ],
    caption: "Change m and q and observe how the position of the line changes.",
    challengeValues: { m: [-3, -2, -1, -0.5, 0.5, 1, 2, 3], q: [-4, -3, -2, -1, 0, 1, 2, 3, 4] }
  },
  parabola: {
    key: "parabola", title: "Parabola", kicker: "QUADRATIC FUNCTION",
    description: "We use vertex form because it makes the geometric meaning of the parameters immediately visible.",
    xRange: [-10, 10], yRange: [-7, 7],
    params: [
      { key: "a", label: "a — direction and width", min: -3, max: 3, step: 0.25, default: 1, disallowZero: true },
      { key: "h", label: "h — horizontal shift", min: -5, max: 5, step: 0.5, default: 0 },
      { key: "k", label: "k — vertical shift", min: -5, max: 5, step: 0.5, default: 0 }
    ],
    formula: p => `y = ${coef(p.a)}(${shifted("x", p.h)})² ${signedConstant(p.k)}`.replace(/\s+/g, " ").trim(),
    evaluate: (x, p) => p.a * (x - p.h) ** 2 + p.k,
    points: p => [{ x: p.h, y: p.k, label: `V(${fmt(p.h)}, ${fmt(p.k)})` }],
    observations: p => {
      const direction = p.a > 0 ? "upwards" : "downwards";
      const width = Math.abs(p.a) > 1 ? "narrower than y = x²" : Math.abs(p.a) < 1 ? "wider than y = x²" : "the same width as y = x²";
      return [`The vertex is <strong>V(${fmt(p.h)}, ${fmt(p.k)})</strong>.`, `The parabola opens <strong>${direction}</strong>.`, `It is <strong>${width}</strong>.`];
    },
    theory: [
      ["a", "controls the direction and width. Its sign tells us whether the parabola opens upwards or downwards."],
      ["h", "moves the vertex left or right. The x-coordinate of the vertex is h."],
      ["k", "moves the parabola up or down. The y-coordinate of the vertex is k."]
    ],
    caption: "The highlighted point is the vertex V(h, k).",
    challengeValues: { a: [-2, -1, -0.5, 0.5, 1, 2], h: [-4, -3, -2, -1, 0, 1, 2, 3, 4], k: [-4, -3, -2, -1, 0, 1, 2, 3, 4] }
  },
  circle: {
    key: "circle", title: "Circle", kicker: "CURVE IN THE CARTESIAN PLANE",
    description: "The circle takes us beyond y = f(x): now x and y appear together in the same equation.",
    xRange: [-10, 10], yRange: [-7, 7],
    params: [
      { key: "h", label: "h — x-coordinate of the centre", min: -5, max: 5, step: 0.5, default: 0 },
      { key: "k", label: "k — y-coordinate of the centre", min: -4, max: 4, step: 0.5, default: 0 },
      { key: "r", label: "r — radius", min: 0.5, max: 6, step: 0.5, default: 3 }
    ],
    formula: p => `(${shifted("x", p.h)})² + (${shifted("y", p.k)})² = ${fmt(p.r)}²`,
    curveType: "circle",
    points: p => [{ x: p.h, y: p.k, label: `C(${fmt(p.h)}, ${fmt(p.k)})` }, { x: p.h + p.r, y: p.k, label: `r = ${fmt(p.r)}`, secondary: true }],
    observations: p => [`The centre is <strong>C(${fmt(p.h)}, ${fmt(p.k)})</strong>.`, `The radius is <strong>r = ${fmt(p.r)}</strong>.`, `The diameter is <strong>${fmt(2 * p.r)}</strong>.`],
    theory: [["h", "is the x-coordinate of the centre C(h, k)."], ["k", "is the y-coordinate of the centre C(h, k)."], ["r", "is the radius: the distance from the centre to every point on the circle."]],
    caption: "The centre C(h, k) and the radius r determine the circle completely.",
    challengeValues: { h: [-4, -3, -2, -1, 0, 1, 2, 3, 4], k: [-3, -2, -1, 0, 1, 2, 3], r: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5] }
  }
};
export const TOPIC_ALIASES = { linea: "line", circonferenza: "circle" };
export function initialParams(topic) { return Object.fromEntries(topic.params.map(param => [param.key, param.default])); }
export function randomChallenge(topic) { const result = {}; for (const param of topic.params) { const values = topic.challengeValues[param.key]; result[param.key] = values[Math.floor(Math.random() * values.length)]; } return result; }
export function fmt(value) { const rounded = Math.round(value * 100) / 100; return String(rounded); }
function coef(value) { if (value === 1) return ""; if (value === -1) return "−"; return fmt(value); }
function shifted(variable, value) { if (value === 0) return variable; return value > 0 ? `${variable} − ${fmt(value)}` : `${variable} + ${fmt(Math.abs(value))}`; }
function signedConstant(value) { if (value === 0) return ""; return value > 0 ? `+ ${fmt(value)}` : `− ${fmt(Math.abs(value))}`; }
function signedTerm(value, variable, omitOne = false) { if (value === 0) return "0"; if (omitOne && value === 1) return variable; if (omitOne && value === -1) return `−${variable}`; return `${fmt(value)}${variable}`; }
