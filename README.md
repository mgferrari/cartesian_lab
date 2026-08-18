# Cartesian Plane Laboratory

A static interactive mathematics website for exploring how parameters affect graphs in the Cartesian plane.

## Current topics

- Straight line: `y = mx + q`
- Parabola: `y = a(x - h)^2 + k`
- Circle: `(x - h)^2 + (y - k)^2 = r^2`

Each topic includes an **Explore** mode and a **Challenge** mode.

## Design principles

1. Mathematical correctness: one unit on the x-axis has exactly the same visual length as one unit on the y-axis, so grid cells are square and circles remain circular.
2. LaTeX-inspired visual identity: Computer Modern typography, restrained page layout and display-style equations.
3. Simple mathematical English: short, repeated sentence patterns to support both mathematics and language learning.

## Structure

```text
index.html
lab.html
css/
  style.css
js/
  app.js
  functions.js
  graph.js
```

The graph engine is written in plain JavaScript and SVG. No JavaScript framework is required.

## Local preview

From the repository folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.
