const NS = "http://www.w3.org/2000/svg";
export class CartesianGraph {
  constructor(svg, options = {}) { this.svg = svg; this.width = 840; this.height = 560; this.padding = { left: 52, right: 24, top: 24, bottom: 42 }; this.xRange = options.xRange || [-10, 10]; this.yRange = options.yRange || [-7, 7]; this.showGrid = true; this.showPoints = true; }
  setRange(xRange, yRange) { this.xRange = xRange; this.yRange = yRange; }
  setOptions({ showGrid, showPoints }) { if (typeof showGrid === "boolean") this.showGrid = showGrid; if (typeof showPoints === "boolean") this.showPoints = showPoints; }
  clear() { this.svg.innerHTML = ""; }
  render(topic, params, options = {}) { this.clear(); this.drawBackground(); if (this.showGrid) this.drawGrid(); this.drawAxes(); if (options.targetParams) this.drawTopic(topic, options.targetParams, { target: true, points: false }); this.drawTopic(topic, params, { target: false, points: this.showPoints }); }
  getPlotBox() {
    const availableWidth = this.width - this.padding.left - this.padding.right; const availableHeight = this.height - this.padding.top - this.padding.bottom; const xSpan = this.xRange[1] - this.xRange[0]; const ySpan = this.yRange[1] - this.yRange[0];
    const scale = Math.min(availableWidth / xSpan, availableHeight / ySpan);
    const plotWidth = xSpan * scale; const plotHeight = ySpan * scale; const left = this.padding.left + (availableWidth - plotWidth) / 2; const top = this.padding.top + (availableHeight - plotHeight) / 2;
    return { left, top, right: left + plotWidth, bottom: top + plotHeight, width: plotWidth, height: plotHeight, scale };
  }
  drawBackground() { this.svg.append(el("rect", { x: 0, y: 0, width: this.width, height: this.height, fill: "var(--paper)" })); }
  drawGrid() {
    const group = el("g", { "aria-hidden": "true" }); const [xmin, xmax] = this.xRange; const [ymin, ymax] = this.yRange; const box = this.getPlotBox();
    for (let x = Math.ceil(xmin); x <= Math.floor(xmax); x++) { const sx = this.toSvgX(x); group.append(el("line", { x1: sx, y1: box.top, x2: sx, y2: box.bottom, stroke: "var(--grid)", "stroke-width": x === 0 ? 0 : 1 })); }
    for (let y = Math.ceil(ymin); y <= Math.floor(ymax); y++) { const sy = this.toSvgY(y); group.append(el("line", { x1: box.left, y1: sy, x2: box.right, y2: sy, stroke: "var(--grid)", "stroke-width": y === 0 ? 0 : 1 })); }
    this.svg.append(group);
  }
  drawAxes() {
    const [xmin, xmax] = this.xRange; const [ymin, ymax] = this.yRange; const box = this.getPlotBox(); const group = el("g", { "aria-hidden": "true" }); const xAxisY = this.toSvgY(0); const yAxisX = this.toSvgX(0);
    if (0 >= ymin && 0 <= ymax) group.append(el("line", { x1: box.left, y1: xAxisY, x2: box.right, y2: xAxisY, stroke: "var(--axis)", "stroke-width": 1.55 }));
    if (0 >= xmin && 0 <= xmax) group.append(el("line", { x1: yAxisX, y1: box.top, x2: yAxisX, y2: box.bottom, stroke: "var(--axis)", "stroke-width": 1.55 }));
    if (0 >= ymin && 0 <= ymax) { for (let x = Math.ceil(xmin); x <= Math.floor(xmax); x++) { if (x === 0) continue; const sx = this.toSvgX(x); group.append(el("line", { x1: sx, y1: xAxisY - 4, x2: sx, y2: xAxisY + 4, stroke: "var(--axis)" })); if (x % 2 === 0) group.append(textNode(String(x), sx, xAxisY + 19, "middle")); } group.append(textNode("x", box.right - 4, xAxisY - 9, "end", true, true)); }
    if (0 >= xmin && 0 <= xmax) { for (let y = Math.ceil(ymin); y <= Math.floor(ymax); y++) { if (y === 0) continue; const sy = this.toSvgY(y); group.append(el("line", { x1: yAxisX - 4, y1: sy, x2: yAxisX + 4, y2: sy, stroke: "var(--axis)" })); if (y % 2 === 0) group.append(textNode(String(y), yAxisX - 10, sy + 4, "end")); } group.append(textNode("y", yAxisX + 10, box.top + 13, "start", true, true)); }
    this.svg.append(group);
  }
  drawTopic(topic, params, { target = false, points = true } = {}) { if (topic.curveType === "circle") this.drawCircle(params, target); else this.drawFunction(topic, params, target); if (points && topic.points) this.drawPoints(topic.points(params)); }
  drawFunction(topic, params, target = false) {
    const [xmin, xmax] = this.xRange; const step = (xmax - xmin) / 700; let d = ""; let drawing = false;
    for (let x = xmin; x <= xmax + step / 2; x += step) { const y = topic.evaluate(x, params); const visible = Number.isFinite(y) && y >= this.yRange[0] - 2 && y <= this.yRange[1] + 2; if (!visible) { drawing = false; continue; } const sx = this.toSvgX(x); const sy = this.toSvgY(y); d += `${drawing ? "L" : "M"}${sx.toFixed(2)},${sy.toFixed(2)} `; drawing = true; }
    const path = el("path", { d, fill: "none", stroke: target ? "var(--target)" : "var(--curve)", "stroke-width": target ? 2.4 : 3, "stroke-linecap": "round", "stroke-linejoin": "round" }); if (target) path.setAttribute("stroke-dasharray", "8 7"); this.svg.append(path);
  }
  drawCircle(params, target = false) {
    let d = ""; const points = 320; for (let i = 0; i <= points; i++) { const t = 2 * Math.PI * (i / points); const x = params.h + params.r * Math.cos(t); const y = params.k + params.r * Math.sin(t); const sx = this.toSvgX(x); const sy = this.toSvgY(y); d += `${i === 0 ? "M" : "L"}${sx.toFixed(2)},${sy.toFixed(2)} `; }
    const path = el("path", { d, fill: "none", stroke: target ? "var(--target)" : "var(--curve)", "stroke-width": target ? 2.4 : 3 }); if (target) path.setAttribute("stroke-dasharray", "8 7"); this.svg.append(path);
  }
  drawPoints(points) {
    const group = el("g"); points.forEach(point => { if (!this.inBounds(point.x, point.y)) return; const x = this.toSvgX(point.x); const y = this.toSvgY(point.y); group.append(el("circle", { cx: x, cy: y, r: point.secondary ? 4 : 5.2, fill: point.secondary ? "var(--paper)" : "var(--curve)", stroke: "var(--curve)", "stroke-width": 1.8 })); const label = textNode(point.label, x + 9, y - 9, "start", true); label.setAttribute("paint-order", "stroke"); label.setAttribute("stroke", "var(--paper)"); label.setAttribute("stroke-width", "5"); label.setAttribute("stroke-linejoin", "round"); group.append(label); }); this.svg.append(group);
  }
  inBounds(x, y) { return x >= this.xRange[0] && x <= this.xRange[1] && y >= this.yRange[0] && y <= this.yRange[1]; }
  toSvgX(x) { const box = this.getPlotBox(); return box.left + (x - this.xRange[0]) * box.scale; }
  toSvgY(y) { const box = this.getPlotBox(); return box.top + (this.yRange[1] - y) * box.scale; }
}
function el(name, attrs = {}) { const node = document.createElementNS(NS, name); for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value)); return node; }
function textNode(text, x, y, anchor = "start", strong = false, italic = false) { const node = el("text", { x, y, "text-anchor": anchor, fill: strong ? "var(--ink)" : "var(--muted)", "font-size": strong ? 14 : 12, "font-family": '"Computer Modern Serif", "Times New Roman", serif', "font-weight": strong ? 700 : 400, "font-style": italic ? "italic" : "normal" }); node.textContent = text; return node; }
