# Cartesian Plane Laboratory

A small interactive mathematics laboratory designed to complement classroom theory sheets.

The project uses plain HTML, CSS and JavaScript and can be published directly with GitHub Pages.

## Available topics

- Straight line: `y = mx + q`
- Parabola: `y = a(x - h)^2 + k`
- Circle: `(x - h)^2 + (y - k)^2 = r^2`
- n-th root function: `y = a root_n(x - h) + k`
- Absolute value: `y = a|x - h| + k`
- Exponential function: `y = a^x`
- Ellipse: `(x - h)^2/a^2 + (y - k)^2/b^2 = 1`

Each topic includes:

- a short explanation in simple mathematical English;
- sliders for the parameters;
- a Cartesian plane with a true 1:1 geometric scale;
- optional coloured parameter guides;
- key points;
- an Explore mode;
- a Challenge mode in which students reconstruct a target graph.

## Design principles

1. Mathematical correctness: one unit on the x-axis has exactly the same graphical length as one unit on the y-axis.
2. LaTeX-like visual identity: Computer Modern typography, restrained layout and minimal decoration.
3. Simple mathematical English: short recurring sentence patterns and precise vocabulary.
4. Parameter visibility: coloured geometric guides connect each slider to the feature it controls.

## Run locally

From the project directory:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.
