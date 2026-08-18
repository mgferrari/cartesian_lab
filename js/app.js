import { TOPICS, initialParams, randomChallenge, fmt } from "./functions.js";
import { CartesianGraph } from "./graph.js";

const query = new URLSearchParams(window.location.search);
const type = query.get("type") || "linea";
const topic = TOPICS[type] || TOPICS.linea;

let mode = "explore";
let params = initialParams(topic);
let challengeParams = initialParams(topic);
let targetParams = randomChallenge(topic);

const dom = {
  title: document.getElementById("topic-title"),
  kicker: document.getElementById("topic-kicker"),
  description: document.getElementById("topic-description"),
  formula: document.getElementById("dynamic-formula"),
  sliders: document.getElementById("slider-container"),
  challengeSliders: document.getElementById("challenge-slider-container"),
  observation: document.getElementById("observation-text"),
  theory: document.getElementById("theory-content"),
  caption: document.getElementById("graph-caption"),
  graph: document.getElementById("graph"),
  explorePanel: document.getElementById("explore-panel"),
  challengePanel: document.getElementById("challenge-panel"),
  reset: document.getElementById("reset-button"),
  check: document.getElementById("check-button"),
  newChallenge: document.getElementById("new-challenge-button"),
  feedback: document.getElementById("challenge-feedback"),
  showPoints: document.getElementById("show-points"),
  showGrid: document.getElementById("show-grid")
};

const graph = new CartesianGraph(dom.graph, { xRange: topic.xRange, yRange: topic.yRange });
graph.setRange(topic.xRange, topic.yRange);

init();

function init() {
  document.title = `${topic.title} | Laboratorio di matematica`;
  dom.title.textContent = topic.title;
  dom.kicker.textContent = topic.kicker;
  dom.description.textContent = topic.description;
  dom.caption.textContent = topic.caption;
  renderTheory();
  renderSliders(dom.sliders, params, "explore");
  renderSliders(dom.challengeSliders, challengeParams, "challenge");
  bindEvents();
  render();
}

function renderSliders(container, state, context) {
  container.innerHTML = "";
  topic.params.forEach(param => {
    const row = document.createElement("div");
    row.className = "slider-row";

    const labelLine = document.createElement("div");
    labelLine.className = "slider-label-line";

    const label = document.createElement("label");
    const id = `${context}-${param.key}`;
    label.htmlFor = id;
    label.className = "slider-label";
    label.textContent = param.label;

    const value = document.createElement("span");
    value.className = "slider-value";
    value.dataset.valueFor = id;
    value.textContent = fmt(state[param.key]);

    const input = document.createElement("input");
    input.type = "range";
    input.id = id;
    input.min = param.min;
    input.max = param.max;
    input.step = param.step;
    input.value = state[param.key];
    input.dataset.param = param.key;
    input.dataset.context = context;

    input.addEventListener("input", () => {
      let valueNumber = Number(input.value);
      if (param.disallowZero && valueNumber === 0) {
        valueNumber = Number(input.dataset.lastNonZero || param.step);
        input.value = valueNumber;
      }
      if (param.disallowZero && valueNumber !== 0) input.dataset.lastNonZero = valueNumber;

      state[param.key] = valueNumber;
      value.textContent = fmt(valueNumber);
      if (context === "challenge") clearFeedback();
      render();
    });

    labelLine.append(label, value);
    row.append(labelLine, input);
    container.append(row);
  });
}

function render() {
  graph.setOptions({ showGrid: dom.showGrid.checked, showPoints: dom.showPoints.checked });

  if (mode === "explore") {
    dom.formula.textContent = topic.formula(params);
    dom.observation.innerHTML = `<ul>${topic.observations(params).map(item => `<li>${item}</li>`).join("")}</ul>`;
    graph.render(topic, params);
  } else {
    dom.formula.textContent = topic.formula(challengeParams);
    graph.render(topic, challengeParams, { targetParams });
  }
}

function renderTheory() {
  dom.theory.innerHTML = topic.theory.map(([symbol, text]) => `
    <div class="theory-item">
      <div class="theory-symbol">${symbol}</div>
      <p>${text}</p>
    </div>
  `).join("");
}

function bindEvents() {
  document.querySelectorAll(".mode-button").forEach(button => {
    button.addEventListener("click", () => switchMode(button.dataset.mode));
  });

  dom.reset.addEventListener("click", () => {
    params = initialParams(topic);
    renderSliders(dom.sliders, params, "explore");
    render();
  });

  dom.showPoints.addEventListener("change", render);
  dom.showGrid.addEventListener("change", render);

  dom.check.addEventListener("click", checkChallenge);
  dom.newChallenge.addEventListener("click", newChallenge);
}

function switchMode(nextMode) {
  mode = nextMode;
  document.querySelectorAll(".mode-button").forEach(button => {
    const active = button.dataset.mode === mode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  dom.explorePanel.hidden = mode !== "explore";
  dom.challengePanel.hidden = mode !== "challenge";
  clearFeedback();
  render();
}

function checkChallenge() {
  const differences = topic.params.map(param => Math.abs(challengeParams[param.key] - targetParams[param.key]));
  const exact = differences.every(delta => delta < 1e-9);
  const close = differences.every((delta, index) => delta <= topic.params[index].step * 2);

  if (exact) {
    dom.feedback.className = "feedback success";
    dom.feedback.innerHTML = `Perfetto! Hai trovato tutti i parametri: <strong>${topic.formula(targetParams)}</strong>`;
    return;
  }

  dom.feedback.className = "feedback warning";
  if (close) {
    dom.feedback.textContent = "Ci sei quasi: almeno un parametro è ancora leggermente diverso.";
  } else {
    const hint = buildHint();
    dom.feedback.textContent = `Non ancora. ${hint}`;
  }
}

function buildHint() {
  if (topic.key === "linea") {
    if (challengeParams.q !== targetParams.q) return "Guarda prima dove la retta incontra l'asse y.";
    return "Ora confronta la pendenza delle due rette.";
  }
  if (topic.key === "parabola") {
    if (challengeParams.h !== targetParams.h || challengeParams.k !== targetParams.k) return "Trova prima il vertice della parabola bersaglio.";
    return "Il vertice è corretto: ora osserva apertura e verso.";
  }
  if (topic.key === "circonferenza") {
    if (challengeParams.h !== targetParams.h || challengeParams.k !== targetParams.k) return "Trova prima il centro della circonferenza bersaglio.";
    return "Il centro è corretto: ora confronta il raggio.";
  }
  return "Confronta con attenzione le due curve.";
}

function newChallenge() {
  targetParams = randomChallenge(topic);
  challengeParams = initialParams(topic);
  renderSliders(dom.challengeSliders, challengeParams, "challenge");
  clearFeedback();
  render();
}

function clearFeedback() {
  dom.feedback.className = "feedback";
  dom.feedback.textContent = "";
}
