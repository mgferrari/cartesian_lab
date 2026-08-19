const NS = "http://www.w3.org/2000/svg";

export class CartesianGraph {
  constructor(svg, options = {}) {
    this.svg = svg;
    this.width = 840;
    this.height = 560;
    this.padding = { left: 52, right: 24, top: 24, bottom: 42 };
    this.xRange = options.xRange || [-10, 10];
    this.yRange = options.yRange || [-7, 7];
    this.showGrid = true;
    this.showPoints = true;
    this.showGuides = true;
  }

  setRange(xRange, yRange) {
    this.xRange = xRange;
    this.yRange = yRange;
  }

  setOptions({ showGrid, showPoints, showGuides }) {
    if (typeof showGrid === "boolean") this.showGrid = showGrid;
    if (typeof showPoints === "boolean") this.showPoints = showPoints;
    if (typeof showGuides === "boolean") this.showGuides = showGuides;
  }

  clear() {
    this.svg.innerHTML = "";
  }

  render(topic, params, options = {}) {
    this.clear();
    this.drawBackground();
    if (this.showGrid) this.drawGrid();
    this.drawAxes();

    if (options.targetParams) {
      this.drawCurve(topic, options.targetParams, true);
    }

    this.drawCurve(topic, params, false);

    if (this.showGuides && !options.suppressGuides && topic.guides) {
      this.drawGuides(topic.guides(params));
    }

    if (this.showPoints && topic.points) {
      this.drawPoints(topic.points(params));
    }
  }

  getPlotBox() {
    const availableWidth = this.width - this.padding.left - this.padding.right;
    const availableHeight = this.height - this.padding.top - this.padding.bottom;
    const xSpan = this.xRange[1] - this.xRange[0];
    const ySpan = this.yRange[1] - this.yRange[0];
    const scale = Math.min(availableWidth / xSpan, availableHeight / ySpan);
    const plotWidth = xSpan * scale;
    const plotHeight = ySpan * scale;
    const left = this.padding.left + (availableWidth - plotWidth) / 2;
    const top = this.padding.top + (availableHeight - plotHeight) / 2;
    return { left, top, right: left + plotWidth, bottom: top + plotHeight, width: plotWidth, height: plotHeight, scale };
  }

  drawBackground() {
    this.svg.append(el("rect", { x: 0, y: 0, width: this.width, height: this.height, fill: "var(--paper)" }));
  }

  drawGrid() {
    const group = el("g", { "aria-hidden": "true" });
    const [xmin, xmax] = this.xRange;
    const [ymin, ymax] = this.yRange;
    const box = this.getPlotBox();

    for (let x = Math.ceil(xmin); x <= Math.floor(xmax); x++) {
      const sx = this.toSvgX(x);
      group.append(el("line", {
        x1: sx, y1: box.top, x2: sx, y2: box.bottom,
        stroke: "var(--grid)", "stroke-width": x === 0 ? 0 : 1
      }));
    }

    for (let y = Math.ceil(ymin); y <= Math.floor(ymax); y++) {
      const sy = this.toSvgY(y);
      group.append(el("line", {
        x1: box.left, y1: sy, x2: box.right, y2: sy,
        stroke: "var(--grid)", "stroke-width": y === 0 ? 0 : 1
      }));
    }

    this.svg.append(group);
  }

  drawAxes() {
    const [xmin, xmax] = this.xRange;
    const [ymin, ymax] = this.yRange;
    const box = this.getPlotBox();
    const group = el("g", { "aria-hidden": "true" });
    const xAxisY = this.toSvgY(0);
    const yAxisX = this.toSvgX(0);

    if (0 >= ymin && 0 <= ymax) {
      group.append(el("line", { x1: box.left, y1: xAxisY, x2: box.right, y2: xAxisY, stroke: "var(--axis)", "stroke-width": 1.55 }));
      for (let x = Math.ceil(xmin); x <= Math.floor(xmax); x++) {
        if (x === 0) continue;
        const sx = this.toSvgX(x);
        group.append(el("line", { x1: sx, y1: xAxisY - 4, x2: sx, y2: xAxisY + 4, stroke: "var(--axis)" }));
        if (x % 2 === 0) group.append(textNode(String(x), sx, xAxisY + 19, "middle"));
      }
      group.append(textNode("x", box.right - 4, xAxisY - 9, "end", true, true));
    }

    if (0 >= xmin && 0 <= xmax) {
      group.append(el("line", { x1: yAxisX, y1: box.top, x2: yAxisX, y2: box.bottom, stroke: "var(--axis)", "stroke-width": 1.55 }));
      for (let y = Math.ceil(ymin); y <= Math.floor(ymax); y++) {
        if (y === 0) continue;
        const sy = this.toSvgY(y);
        group.append(el("line", { x1: yAxisX - 4, y1: sy, x2: yAxisX + 4, y2: sy, stroke: "var(--axis)" }));
        if (y % 2 === 0) group.append(textNode(String(y), yAxisX - 10, sy + 4, "end"));
      }
      group.append(textNode("y", yAxisX + 10, box.top + 13, "start", true, true));
    }

    this.svg.append(group);
  }

  drawCurve(topic, params, target = false) {
    if (topic.curveType === "circle") this.drawCircle(params, target);
    else if (topic.curveType === "ellipse") this.drawEllipse(params, target);
    else this.drawFunction(topic, params, target);
  }

  drawFunction(topic, params, target = false) {
    const [xmin, xmax] = this.xRange;
    const step = (xmax - xmin) / 900;
    let d = "";
    let drawing = false;

    for (let x = xmin; x <= xmax + step / 2; x += step) {
      const y = topic.evaluate(x, params);
      const visible = Number.isFinite(y) && y >= this.yRange[0] - 0.5 && y <= this.yRange[1] + 0.5;
      if (!visible) {
        drawing = false;
        continue;
      }
      const sx = this.toSvgX(x);
      const sy = this.toSvgY(y);
      d += `${drawing ? "L" : "M"}${sx.toFixed(2)},${sy.toFixed(2)} `;
      drawing = true;
    }

    const path = el("path", {
      d,
      fill: "none",
      stroke: target ? "var(--target)" : "var(--curve)",
      "stroke-width": target ? 2.4 : 3,
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    });
    if (target) path.setAttribute("stroke-dasharray", "8 7");
    this.svg.append(path);
  }

  drawCircle(params, target = false) {
    this.drawParametricCurve(t => ({
      x: params.h + params.r * Math.cos(t),
      y: params.k + params.r * Math.sin(t)
    }), target);
  }

  drawEllipse(params, target = false) {
    this.drawParametricCurve(t => ({
      x: params.h + params.a * Math.cos(t),
      y: params.k + params.b * Math.sin(t)
    }), target);
  }

  drawParametricCurve(pointAt, target = false) {
    let d = "";
    const points = 420;
    for (let i = 0; i <= points; i++) {
      const t = 2 * Math.PI * (i / points);
      const point = pointAt(t);
      const sx = this.toSvgX(point.x);
      const sy = this.toSvgY(point.y);
      d += `${i === 0 ? "M" : "L"}${sx.toFixed(2)},${sy.toFixed(2)} `;
    }
    const path = el("path", {
      d,
      fill: "none",
      stroke: target ? "var(--target)" : "var(--curve)",
      "stroke-width": target ? 2.4 : 3,
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    });
    if (target) path.setAttribute("stroke-dasharray", "8 7");
    this.svg.append(path);
  }

  drawGuides(guides) {
    const box = this.getPlotBox();
    const group = el("g", { "aria-label": "Parameter guides" });

    guides.forEach(guide => {
      const colour = `var(--param-${guide.guide || 1})`;

      if (guide.type === "segment") {
        const x1 = this.toSvgX(guide.x1);
        const y1 = this.toSvgY(guide.y1);
        const x2 = this.toSvgX(guide.x2);
        const y2 = this.toSvgY(guide.y2);
        const line = el("line", {
          x1, y1, x2, y2,
          stroke: colour,
          "stroke-width": 2,
          "stroke-linecap": "round"
        });
        if (guide.dash) line.setAttribute("stroke-dasharray", "6 5");
        group.append(line);
        if (guide.label) {
          const mx = (x1 + x2) / 2 + (guide.labelDx || 0);
          const my = (y1 + y2) / 2 + (guide.labelDy || -8);
          group.append(guideText(guide.label, mx, my, guide.labelAnchor || "middle", colour));
        }
      }

      if (guide.type === "vertical") {
        const x = this.toSvgX(guide.x);
        const line = el("line", { x1: x, y1: box.top, x2: x, y2: box.bottom, stroke: colour, "stroke-width": 1.7 });
        if (guide.dash) line.setAttribute("stroke-dasharray", "6 5");
        group.append(line);
        if (guide.label) group.append(guideText(guide.label, x + 7, box.top + 17, "start", colour));
      }

      if (guide.type === "horizontal") {
        const y = this.toSvgY(guide.y);
        const line = el("line", { x1: box.left, y1: y, x2: box.right, y2: y, stroke: colour, "stroke-width": 1.7 });
        if (guide.dash) line.setAttribute("stroke-dasharray", "6 5");
        group.append(line);
        if (guide.label) group.append(guideText(guide.label, box.right - 7, y - 8, "end", colour));
      }

      if (guide.type === "label") {
        const x = this.toSvgX(guide.x) + (guide.dx || 0);
        const y = this.toSvgY(guide.y) + (guide.dy || 0);
        group.append(guideText(guide.text, x, y, guide.anchor || "start", colour));
      }
    });

    this.svg.append(group);
  }

  drawPoints(points) {
    const group = el("g");
    points.forEach(point => {
      if (!this.inBounds(point.x, point.y)) return;
      const x = this.toSvgX(point.x);
      const y = this.toSvgY(point.y);
      group.append(el("circle", {
        cx: x,
        cy: y,
        r: point.secondary ? 4 : 5.2,
        fill: point.secondary ? "var(--paper)" : "var(--curve)",
        stroke: "var(--curve)",
        "stroke-width": 1.8
      }));
      const label = textNode(point.label, x + 9, y - 9, "start", true);
      label.setAttribute("paint-order", "stroke");
      label.setAttribute("stroke", "var(--paper)");
      label.setAttribute("stroke-width", "5");
      label.setAttribute("stroke-linejoin", "round");
      group.append(label);
    });
    this.svg.append(group);
  }

  inBounds(x, y) {
    return x >= this.xRange[0] && x <= this.xRange[1] && y >= this.yRange[0] && y <= this.yRange[1];
  }

  toSvgX(x) {
    const box = this.getPlotBox();
    return box.left + (x - this.xRange[0]) * box.scale;
  }

  toSvgY(y) {
    const box = this.getPlotBox();
    return box.top + (this.yRange[1] - y) * box.scale;
  }
}

function el(name, attrs = {}) {
  const node = document.createElementNS(NS, name);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
  return node;
}

function textNode(text, x, y, anchor = "start", strong = false, italic = false) {
  const node = el("text", {
    x, y,
    "text-anchor": anchor,
    fill: strong ? "var(--ink)" : "var(--muted)",
    "font-size": strong ? 14 : 12,
    "font-family": '"Computer Modern Serif", "Times New Roman", serif',
    "font-weight": strong ? 700 : 400,
    "font-style": italic ? "italic" : "normal"
  });
  node.textContent = text;
  return node;
}

function guideText(text, x, y, anchor, colour) {
  const node = el("text", {
    x, y,
    "text-anchor": anchor,
    fill: colour,
    "font-size": 13,
    "font-family": '"Computer Modern Serif", "Times New Roman", serif',
    "font-weight": 700,
    "font-style": "italic"
  });
  node.setAttribute("paint-order", "stroke");
  node.setAttribute("stroke", "var(--paper)");
  node.setAttribute("stroke-width", "4");
  node.setAttribute("stroke-linejoin", "round");
  node.textContent = text;
  return node;
}
