export const TOPICS = {
  line: {
    key: "line",
    title: "Straight line",
    kicker: "LINEAR FUNCTION",
    description: "A straight line is the simplest case for seeing how parameters change a graph immediately.",
    xRange: [-10, 10],
    yRange: [-7, 7],
    params: [
      { key: "m", label: "m — slope", min: -4, max: 4, step: 0.5, default: 1, guide: 1 },
      { key: "q", label: "q — y-intercept", min: -5, max: 5, step: 0.5, default: 0, guide: 2 }
    ],
    formula: p => `y = ${signedTerm(p.m, "x", true)} ${signedConstant(p.q)}`.replace(/\s+/g, " ").trim(),
    evaluate: (x, p) => p.m * x + p.q,
    points: p => [{ x: 0, y: p.q, label: `Q(0, ${fmt(p.q)})` }],
    guides: p => {
      const dx = p.q + p.m <= 7 && p.q + p.m >= -7 ? 1 : -1;
      const dy = p.m * dx;
      const guides = [
        { type: "segment", x1: 0, y1: p.q, x2: dx, y2: p.q, guide: 1, dash: true, label: `Δx = ${fmt(dx)}`, labelDy: 18 },
        { type: "segment", x1: dx, y1: p.q, x2: dx, y2: p.q + dy, guide: 1, label: `Δy = ${fmt(dy)}`, labelDx: dx > 0 ? 9 : -9, labelAnchor: dx > 0 ? "start" : "end" },
        { type: "label", x: dx, y: p.q + dy, guide: 1, text: `m = ${fmt(p.m)}`, dx: dx > 0 ? 10 : -10, dy: -10, anchor: dx > 0 ? "start" : "end" }
      ];
      if (p.q !== 0) guides.push({ type: "segment", x1: 0, y1: 0, x2: 0, y2: p.q, guide: 2, dash: true, label: `q = ${fmt(p.q)}`, labelDx: 10, labelAnchor: "start" });
      else guides.push({ type: "label", x: 0, y: 0, guide: 2, text: "q = 0", dx: 10, dy: 17, anchor: "start" });
      return guides;
    },
    observations: p => {
      const slope = p.m > 0 ? "increasing" : p.m < 0 ? "decreasing" : "horizontal";
      const qText = p.q === 0 ? "passes through the origin" : `crosses the y-axis at (0, ${fmt(p.q)})`;
      return [
        `The line is <strong>${slope}</strong>.`,
        `Its slope is <strong>m = ${fmt(p.m)}</strong>.`,
        `The line ${qText}.`
      ];
    },
    theory: [
      ["m", "controls the slope. If m > 0, the line is increasing; if m < 0, it is decreasing; if m = 0, it is horizontal."],
      ["q", "is the y-intercept. The line always meets the y-axis at the point (0, q)."]
    ],
    caption: "The coloured triangle shows the slope: m = Δy / Δx. The second guide marks the y-intercept q.",
    challengeValues: {
      m: [-3, -2, -1, -0.5, 0.5, 1, 2, 3],
      q: [-4, -3, -2, -1, 0, 1, 2, 3, 4]
    }
  },

  parabola: {
    key: "parabola",
    title: "Parabola",
    kicker: "QUADRATIC FUNCTION",
    description: "We use vertex form because it makes the geometric meaning of the parameters immediately visible.",
    xRange: [-10, 10],
    yRange: [-7, 7],
    params: [
      { key: "a", label: "a — direction and width", min: -3, max: 3, step: 0.25, default: 1, disallowZero: true, guide: 1 },
      { key: "h", label: "h — horizontal shift", min: -5, max: 5, step: 0.5, default: 0, guide: 2 },
      { key: "k", label: "k — vertical shift", min: -5, max: 5, step: 0.5, default: 0, guide: 3 }
    ],
    formula: p => `y = ${coef(p.a)}(${shifted("x", p.h)})² ${signedConstant(p.k)}`.replace(/\s+/g, " ").trim(),
    evaluate: (x, p) => p.a * (x - p.h) ** 2 + p.k,
    points: p => [{ x: p.h, y: p.k, label: `V(${fmt(p.h)}, ${fmt(p.k)})` }],
    guides: p => [
      { type: "vertical", x: p.h, guide: 2, dash: true, label: `x = h = ${fmt(p.h)}` },
      { type: "horizontal", y: p.k, guide: 3, dash: true, label: `y = k = ${fmt(p.k)}` },
      { type: "segment", x1: p.h, y1: p.k, x2: p.h + 1, y2: p.k, guide: 1, dash: true, label: "1", labelDy: 17 },
      { type: "segment", x1: p.h + 1, y1: p.k, x2: p.h + 1, y2: p.k + p.a, guide: 1, label: `a = ${fmt(p.a)}`, labelDx: 9, labelAnchor: "start" }
    ],
    observations: p => {
      const direction = p.a > 0 ? "upwards" : "downwards";
      const width = Math.abs(p.a) > 1 ? "narrower than y = x²" : Math.abs(p.a) < 1 ? "wider than y = x²" : "the same width as y = x²";
      return [
        `The vertex is <strong>V(${fmt(p.h)}, ${fmt(p.k)})</strong>.`,
        `The parabola opens <strong>${direction}</strong>.`,
        `It is <strong>${width}</strong>.`
      ];
    },
    theory: [
      ["a", "controls the direction and width. Its sign tells us whether the parabola opens upwards or downwards."],
      ["h", "moves the vertex left or right. The x-coordinate of the vertex is h."],
      ["k", "moves the parabola up or down. The y-coordinate of the vertex is k."]
    ],
    caption: "The coloured guides identify h and k at the vertex. At one unit from the vertex, the vertical change is a.",
    challengeValues: {
      a: [-2, -1, -0.5, 0.5, 1, 2],
      h: [-4, -3, -2, -1, 0, 1, 2, 3, 4],
      k: [-4, -3, -2, -1, 0, 1, 2, 3, 4]
    }
  },

  circle: {
    key: "circle",
    title: "Circle",
    kicker: "CURVE IN THE CARTESIAN PLANE",
    description: "The circle takes us beyond y = f(x): now x and y appear together in the same equation.",
    xRange: [-10, 10],
    yRange: [-7, 7],
    params: [
      { key: "h", label: "h — x-coordinate of the centre", min: -5, max: 5, step: 0.5, default: 0, guide: 1 },
      { key: "k", label: "k — y-coordinate of the centre", min: -4, max: 4, step: 0.5, default: 0, guide: 2 },
      { key: "r", label: "r — radius", min: 0.5, max: 6, step: 0.5, default: 3, guide: 3 }
    ],
    formula: p => `(${shifted("x", p.h)})² + (${shifted("y", p.k)})² = ${fmt(p.r)}²`,
    curveType: "circle",
    points: p => [
      { x: p.h, y: p.k, label: `C(${fmt(p.h)}, ${fmt(p.k)})` },
      { x: p.h + p.r, y: p.k, label: `r = ${fmt(p.r)}`, secondary: true }
    ],
    guides: p => [
      { type: "segment", x1: 0, y1: p.k, x2: p.h, y2: p.k, guide: 1, dash: true, label: `h = ${fmt(p.h)}`, labelDy: 17 },
      { type: "segment", x1: p.h, y1: 0, x2: p.h, y2: p.k, guide: 2, dash: true, label: `k = ${fmt(p.k)}`, labelDx: 9, labelAnchor: "start" },
      { type: "segment", x1: p.h, y1: p.k, x2: p.h + p.r, y2: p.k, guide: 3, label: `r = ${fmt(p.r)}`, labelDy: -10 }
    ],
    observations: p => [
      `The centre is <strong>C(${fmt(p.h)}, ${fmt(p.k)})</strong>.`,
      `The radius is <strong>r = ${fmt(p.r)}</strong>.`,
      `The diameter is <strong>${fmt(2 * p.r)}</strong>.`
    ],
    theory: [
      ["h", "is the x-coordinate of the centre C(h, k)."],
      ["k", "is the y-coordinate of the centre C(h, k)."],
      ["r", "is the radius: the distance from the centre to every point on the circle."]
    ],
    caption: "The guides locate the centre C(h, k) and show the radius r directly on the graph.",
    challengeValues: {
      h: [-4, -3, -2, -1, 0, 1, 2, 3, 4],
      k: [-3, -2, -1, 0, 1, 2, 3],
      r: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
    }
  },

  nthroot: {
    key: "nthroot",
    title: "n-th root function",
    kicker: "RADICAL FUNCTION",
    description: "Change the root index and the transformations to compare even and odd roots on the Cartesian plane.",
    xRange: [-10, 10],
    yRange: [-7, 7],
    params: [
      { key: "n", label: "n — root index", min: 2, max: 7, step: 1, default: 2, guide: 4 },
      { key: "a", label: "a — vertical scale", min: -3, max: 3, step: 0.5, default: 1, disallowZero: true, guide: 1 },
      { key: "h", label: "h — horizontal shift", min: -5, max: 5, step: 0.5, default: 0, guide: 2 },
      { key: "k", label: "k — vertical shift", min: -4, max: 4, step: 0.5, default: 0, guide: 3 }
    ],
    formula: p => `y = ${coef(p.a)}√[${fmt(p.n)}](${shifted("x", p.h)}) ${signedConstant(p.k)}`.replace(/\s+/g, " ").trim(),
    evaluate: (x, p) => {
      const z = x - p.h;
      const root = realNthRoot(z, p.n);
      return Number.isFinite(root) ? p.a * root + p.k : NaN;
    },
    points: p => [{ x: p.h, y: p.k, label: `P(${fmt(p.h)}, ${fmt(p.k)})` }],
    guides: p => [
      { type: "vertical", x: p.h, guide: 2, dash: true, label: p.n % 2 === 0 ? `domain starts at x = h = ${fmt(p.h)}` : `x = h = ${fmt(p.h)}` },
      { type: "horizontal", y: p.k, guide: 3, dash: true, label: `y = k = ${fmt(p.k)}` },
      { type: "segment", x1: p.h + 1, y1: p.k, x2: p.h + 1, y2: p.k + p.a, guide: 1, label: `a = ${fmt(p.a)}`, labelDx: 9, labelAnchor: "start" },
      { type: "label", x: p.h + 2, y: p.a * realNthRoot(2, p.n) + p.k, guide: 4, text: `n = ${fmt(p.n)}`, dx: 10, dy: -10, anchor: "start" }
    ],
    observations: p => {
      const parity = p.n % 2 === 0 ? "even" : "odd";
      const domain = p.n % 2 === 0 ? `x ≥ ${fmt(p.h)}` : "all real numbers";
      const reflection = p.a < 0 ? "reflected across its horizontal reference line" : "not vertically reflected";
      return [
        `The index is <strong>${fmt(p.n)}</strong>, so it is an <strong>${parity}</strong> root.`,
        `The domain is <strong>${domain}</strong>.`,
        `The graph is <strong>${reflection}</strong>.`
      ];
    },
    theory: [
      ["n", "is the root index. Even roots have a boundary in their domain; odd roots are defined for every real x."],
      ["a", "stretches, compresses or reflects the graph vertically."],
      ["h", "moves the characteristic point horizontally to x = h."],
      ["k", "moves the graph vertically to y = k."]
    ],
    caption: "For even n, the line x = h marks the start of the domain. The point P(h, k) anchors every translated root graph.",
    challengeValues: {
      n: [2, 3, 4, 5],
      a: [-2, -1, 1, 2],
      h: [-3, -2, -1, 0, 1, 2, 3],
      k: [-3, -2, -1, 0, 1, 2, 3]
    }
  },

  absolute: {
    key: "absolute",
    title: "Absolute value",
    kicker: "ABSOLUTE VALUE FUNCTION",
    description: "The graph has a vertex and two straight branches. The parameters move the vertex and change the slopes.",
    xRange: [-10, 10],
    yRange: [-7, 7],
    params: [
      { key: "a", label: "a — direction and slope", min: -3, max: 3, step: 0.5, default: 1, disallowZero: true, guide: 1 },
      { key: "h", label: "h — horizontal shift", min: -5, max: 5, step: 0.5, default: 0, guide: 2 },
      { key: "k", label: "k — vertical shift", min: -5, max: 5, step: 0.5, default: 0, guide: 3 }
    ],
    formula: p => `y = ${coef(p.a)}|${shifted("x", p.h)}| ${signedConstant(p.k)}`.replace(/\s+/g, " ").trim(),
    evaluate: (x, p) => p.a * Math.abs(x - p.h) + p.k,
    points: p => [{ x: p.h, y: p.k, label: `V(${fmt(p.h)}, ${fmt(p.k)})` }],
    guides: p => [
      { type: "vertical", x: p.h, guide: 2, dash: true, label: `x = h = ${fmt(p.h)}` },
      { type: "horizontal", y: p.k, guide: 3, dash: true, label: `y = k = ${fmt(p.k)}` },
      { type: "segment", x1: p.h, y1: p.k, x2: p.h + 1, y2: p.k, guide: 1, dash: true, label: "Δx = 1", labelDy: 17 },
      { type: "segment", x1: p.h + 1, y1: p.k, x2: p.h + 1, y2: p.k + p.a, guide: 1, label: `Δy = a = ${fmt(p.a)}`, labelDx: 9, labelAnchor: "start" }
    ],
    observations: p => {
      const direction = p.a > 0 ? "upwards" : "downwards";
      return [
        `The vertex is <strong>V(${fmt(p.h)}, ${fmt(p.k)})</strong>.`,
        `The V opens <strong>${direction}</strong>.`,
        `Each branch has slope magnitude <strong>|a| = ${fmt(Math.abs(p.a))}</strong>.`
      ];
    },
    theory: [
      ["a", "controls the direction and the slope of the two branches."],
      ["h", "moves the vertex left or right. The x-coordinate of the vertex is h."],
      ["k", "moves the vertex up or down. The y-coordinate of the vertex is k."]
    ],
    caption: "The vertex is V(h, k). Moving one unit horizontally changes y by a on the right-hand branch.",
    challengeValues: {
      a: [-2, -1, -0.5, 0.5, 1, 2],
      h: [-4, -3, -2, -1, 0, 1, 2, 3, 4],
      k: [-4, -3, -2, -1, 0, 1, 2, 3, 4]
    }
  },

  exponential: {
    key: "exponential",
    title: "Exponential function",
    kicker: "EXPONENTIAL FUNCTION",
    description: "The base is the parameter. Change it to see the transition from exponential decay to exponential growth.",
    xRange: [-7, 7],
    yRange: [-1, 9],
    params: [
      { key: "a", label: "a — base", min: 0.25, max: 4, step: 0.25, default: 2, guide: 1 }
    ],
    formula: p => `y = ${fmt(p.a)}ˣ`,
    evaluate: (x, p) => p.a ** x,
    points: p => [
      { x: 0, y: 1, label: "P(0, 1)" },
      { x: 1, y: p.a, label: `A(1, ${fmt(p.a)})`, secondary: true }
    ],
    guides: p => [
      { type: "segment", x1: 1, y1: 0, x2: 1, y2: p.a, guide: 1, dash: true, label: `a = ${fmt(p.a)}`, labelDx: 9, labelAnchor: "start" }
    ],
    observations: p => {
      const behaviour = p.a > 1 ? "increasing" : p.a < 1 ? "decreasing" : "constant";
      return [
        `The base is <strong>a = ${fmt(p.a)}</strong>.`,
        `The function is <strong>${behaviour}</strong>.`,
        `It always passes through <strong>(0, 1)</strong> and is positive for every real x.`
      ];
    },
    theory: [
      ["a", "is the base. For a > 1 the function grows; for 0 < a < 1 it decays; for a = 1 the graph is the constant line y = 1."],
      ["(0,1)", "is a fixed point because a⁰ = 1 for every positive base a."],
      ["(1,a)", "shows the base directly on the graph because a¹ = a."]
    ],
    caption: "The point (1, a) makes the role of the base visible. The x-axis is the horizontal asymptote when a ≠ 1.",
    challengeValues: {
      a: [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4]
    }
  },

  ellipse: {
    key: "ellipse",
    title: "Ellipse",
    kicker: "CONIC SECTION",
    description: "An ellipse is determined by its centre and by two semi-axis lengths, one horizontal and one vertical.",
    xRange: [-10, 10],
    yRange: [-7, 7],
    params: [
      { key: "h", label: "h — x-coordinate of the centre", min: -4, max: 4, step: 0.5, default: 0, guide: 1 },
      { key: "k", label: "k — y-coordinate of the centre", min: -2, max: 2, step: 0.5, default: 0, guide: 2 },
      { key: "a", label: "a — horizontal semi-axis", min: 1, max: 6, step: 0.5, default: 4, guide: 3 },
      { key: "b", label: "b — vertical semi-axis", min: 1, max: 4.5, step: 0.5, default: 2.5, guide: 4 }
    ],
    formula: p => `(${shifted("x", p.h)})² / ${fmt(p.a)}² + (${shifted("y", p.k)})² / ${fmt(p.b)}² = 1`,
    curveType: "ellipse",
    points: p => [
      { x: p.h, y: p.k, label: `C(${fmt(p.h)}, ${fmt(p.k)})` },
      { x: p.h + p.a, y: p.k, label: `a = ${fmt(p.a)}`, secondary: true },
      { x: p.h, y: p.k + p.b, label: `b = ${fmt(p.b)}`, secondary: true }
    ],
    guides: p => [
      { type: "segment", x1: 0, y1: p.k, x2: p.h, y2: p.k, guide: 1, dash: true, label: `h = ${fmt(p.h)}`, labelDy: 17 },
      { type: "segment", x1: p.h, y1: 0, x2: p.h, y2: p.k, guide: 2, dash: true, label: `k = ${fmt(p.k)}`, labelDx: 9, labelAnchor: "start" },
      { type: "segment", x1: p.h, y1: p.k, x2: p.h + p.a, y2: p.k, guide: 3, label: `a = ${fmt(p.a)}`, labelDy: -10 },
      { type: "segment", x1: p.h, y1: p.k, x2: p.h, y2: p.k + p.b, guide: 4, label: `b = ${fmt(p.b)}`, labelDx: 9, labelAnchor: "start" }
    ],
    observations: p => {
      const major = p.a > p.b ? "horizontal" : p.a < p.b ? "vertical" : "equal in both directions";
      return [
        `The centre is <strong>C(${fmt(p.h)}, ${fmt(p.k)})</strong>.`,
        `The horizontal semi-axis is <strong>a = ${fmt(p.a)}</strong>; the vertical semi-axis is <strong>b = ${fmt(p.b)}</strong>.`,
        p.a === p.b ? "Because a = b, this ellipse is a <strong>circle</strong>." : `The longer direction is <strong>${major}</strong>.`
      ];
    },
    theory: [
      ["h", "is the x-coordinate of the centre C(h, k)."],
      ["k", "is the y-coordinate of the centre C(h, k)."],
      ["a", "is the horizontal semi-axis: the distance from the centre to the left or right vertex."],
      ["b", "is the vertical semi-axis: the distance from the centre to the top or bottom vertex."]
    ],
    caption: "The two coloured radius-like segments are the semi-axes a and b. When a = b, the ellipse becomes a circle.",
    challengeValues: {
      h: [-3, -2, -1, 0, 1, 2, 3],
      k: [-2, -1, 0, 1, 2],
      a: [2, 3, 4, 5],
      b: [1, 2, 3, 4]
    }
  }
};

export const TOPIC_ALIASES = {
  linea: "line",
  circonferenza: "circle",
  radice: "nthroot",
  valoreassoluto: "absolute",
  esponenziale: "exponential",
  ellisse: "ellipse"
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
  return String(rounded);
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

function realNthRoot(value, n) {
  if (value < 0 && n % 2 === 0) return NaN;
  if (value < 0) return -((-value) ** (1 / n));
  return value ** (1 / n);
}
