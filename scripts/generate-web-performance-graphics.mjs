import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const outDir = path.resolve("public/images/posts/long-running-web-performance-debugging/figures");
mkdirSync(outDir, { recursive: true });

const W = 1600;
const H = 900;
const C = {
  bg0: "#071018",
  bg1: "#0d1b25",
  grid: "#28404f",
  axis: "#d7e0e8",
  text: "#edf4fa",
  muted: "#aab9c6",
  red: "#ff4038",
  orange: "#ffb020",
  green: "#54d85b",
  blue: "#38a2ff",
  cyan: "#47d9d0",
  purple: "#c47cff",
};

function svg(name, body, width = W, height = H) {
  const content = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${C.bg0}"/>
      <stop offset="100%" stop-color="${C.bg1}"/>
    </linearGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="18" flood-color="#000" flood-opacity=".35"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  ${body}
</svg>
`;
  writeFileSync(path.join(outDir, name), content);
}

function esc(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function text(x, y, value, opts = {}) {
  const {
    size = 26,
    fill = C.text,
    weight = 400,
    anchor = "start",
    opacity = 1,
    family = "Inter, Pretendard, Apple SD Gothic Neo, system-ui, sans-serif",
    transform = "",
  } = opts;
  return `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" opacity="${opacity}" font-family="${family}"${transform ? ` transform="${transform}"` : ""}>${esc(value)}</text>`;
}

function line(points, color, width = 4, extra = "") {
  return `<polyline points="${points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
}

function rect(x, y, w, h, opts = {}) {
  const { fill = "none", stroke = C.grid, sw = 2, rx = 10, opacity = 1 } = opts;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" opacity="${opacity}"/>`;
}

function chart({ x, y, w, h, xMax, yMax, yTicks, xTicks, xLabel, yLabel, series, thresholdLines = [], formatX = (v) => v, formatY = (v) => v }) {
  const sx = (v) => x + (v / xMax) * w;
  const sy = (v) => y + h - (v / yMax) * h;
  let out = "";
  for (const t of yTicks) {
    out += `<line x1="${x}" y1="${sy(t)}" x2="${x + w}" y2="${sy(t)}" stroke="${C.grid}" stroke-width="1" stroke-dasharray="8 8" opacity=".75"/>`;
    out += text(x - 18, sy(t) + 9, formatY(t), { size: 22, fill: C.muted, anchor: "end" });
  }
  for (const t of xTicks) {
    out += `<line x1="${sx(t)}" y1="${y}" x2="${sx(t)}" y2="${y + h}" stroke="${C.grid}" stroke-width="1" opacity=".45"/>`;
    out += text(sx(t), y + h + 42, formatX(t), { size: 22, fill: C.muted, anchor: "middle" });
  }
  out += `<line x1="${x}" y1="${y + h}" x2="${x + w}" y2="${y + h}" stroke="${C.axis}" stroke-width="2"/>`;
  out += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + h}" stroke="${C.axis}" stroke-width="2"/>`;
  out += text(x + w / 2, y + h + 84, xLabel, { size: 24, fill: C.axis, anchor: "middle" });
  out += text(x - 74, y + h / 2, yLabel, { size: 24, fill: C.axis, anchor: "middle", transform: `rotate(-90 ${x - 74} ${y + h / 2})` });
  for (const t of thresholdLines) {
    const yy = sy(t.value);
    out += `<line x1="${x}" y1="${yy}" x2="${x + w}" y2="${yy}" stroke="${t.color || C.muted}" stroke-width="${t.width || 2}" stroke-dasharray="${t.dash || "10 8"}" opacity="${t.opacity || .8}"/>`;
    if (t.label) out += text(x + w + 14, yy + 8, t.label, { size: 22, fill: t.color || C.muted });
  }
  for (const s of series) {
    out += line(s.data.map(([a, b]) => [sx(a), sy(b)]), s.color, s.width || 4);
  }
  return out;
}

function legend(items, x, y) {
  return items.map((it, i) => {
    const xx = x + i * 220;
    return `<line x1="${xx}" y1="${y}" x2="${xx + 52}" y2="${y}" stroke="${it.color}" stroke-width="5" stroke-linecap="round"/>${text(xx + 68, y + 8, it.label, { size: 24, fill: C.text })}`;
  }).join("");
}

function noise(i, amp = 1) {
  const v = Math.sin(i * 12.9898) * 43758.5453;
  return (v - Math.floor(v) - .5) * amp;
}

function series(n, fn) {
  return Array.from({ length: n }, (_, i) => fn(i, i / (n - 1)));
}

function miniChart(x, y, w, h, data, color, yMax) {
  return chart({
    x, y, w, h, xMax: 30, yMax,
    yTicks: [], xTicks: [],
    xLabel: "", yLabel: "",
    series: [{ color, data }],
  });
}

const failure = series(420, (i, p) => {
  const spin = p * 5653;
  return [
    spin,
    20 + 82 * Math.pow(p, 1.45) + Math.max(0, noise(i, 11 + p * 14)),
  ];
});
const p95 = series(420, (i, p) => [p * 5653, 16.8 + 15 * Math.pow(p, 1.9) + Math.max(0, noise(i, 2.8))]);
const med = series(420, (i, p) => [p * 5653, 16.7 + .15 * p + noise(i, .08)]);

svg("01-soak-probe-hud.svg", `
${rect(250, 110, 1100, 650, { fill: "#08131bcc", stroke: "#536776", rx: 18, sw: 2 })}
${text(300, 175, "SOAK PROBE", { size: 38, weight: 700 })}
${text(580, 175, "gc:on", { size: 28, fill: C.green })}
${text(680, 175, "webgpu", { size: 28, fill: C.blue })}
${text(1210, 175, "1:42:07", { size: 28, fill: C.axis })}
<line x1="250" y1="210" x2="1350" y2="210" stroke="${C.grid}" stroke-width="2"/>
${["경과\\n1:42:07", "스핀\\n5,653", "p99\\n17.0 → 100.0ms", "최악\\n33.4 → 210.6ms", "힙\\n180 → 490MB"].map((v, i) => {
  const [a, b] = v.split("\\n");
  const cx = 360 + i * 215;
  return `${text(cx, 270, a, { size: 25, fill: C.muted, anchor: "middle" })}${text(cx, 320, b, { size: 28, fill: i >= 2 ? C.red : C.text, anchor: "middle", weight: i >= 2 ? 700 : 500 })}`;
}).join("")}
<line x1="250" y1="365" x2="1350" y2="365" stroke="${C.grid}" stroke-width="2"/>
${["텍스처\\n24 → 26", "리스너\\n12 → 1,240", "rAF / f\\n6.8 → 7.4", "드로우콜 / f\\n312 → 325"].map((v, i) => {
  const [a, b] = v.split("\\n");
  const cx = 410 + i * 260;
  return `${text(cx, 430, a, { size: 25, fill: C.muted, anchor: "middle" })}${text(cx, 480, b, { size: 28, fill: i === 1 ? C.red : C.text, anchor: "middle", weight: i === 1 ? 700 : 500 })}`;
}).join("")}
${chart({
  x: 350, y: 545, w: 900, h: 135, xMax: 5653, yMax: 120,
  yTicks: [16.7, 60, 100], xTicks: [0, 2000, 4000, 5653],
  xLabel: "run count (spin)", yLabel: "p99 (ms)",
  series: [{ color: C.blue, data: failure, width: 3 }],
  thresholdLines: [{ value: 16.7, label: "16.67ms", color: C.muted }],
  formatX: (v) => v === 5653 ? "5,653" : v === 0 ? "0" : `${v / 1000}K`,
  formatY: (v) => v === 16.7 ? "16.7" : v,
})}
`);

svg("02-frame-percentiles-long-run.svg", `
${chart({
  x: 150, y: 120, w: 1250, h: 620, xMax: 5653, yMax: 120,
  yTicks: [0, 20, 40, 60, 80, 100, 120], xTicks: [0, 1000, 2000, 3000, 4000, 5000, 5653],
  xLabel: "run count (spin)", yLabel: "frame time (ms)",
  series: [{ label: "median", color: C.green, data: med }, { label: "p95", color: C.orange, data: p95 }, { label: "p99", color: C.red, data: failure }],
  thresholdLines: [{ value: 16.67, label: "16.67ms", color: C.muted }],
  formatX: (v) => v === 5653 ? "5,653" : v === 0 ? "0" : `${v / 1000}K`,
})}
${legend([{ label: "median", color: C.green }, { label: "p95", color: C.orange }, { label: "p99", color: C.red }], 560, 70)}
<line x1="${150 + 1784 / 5653 * 1250}" y1="120" x2="${150 + 1784 / 5653 * 1250}" y2="740" stroke="${C.purple}" stroke-width="3" stroke-dasharray="10 10"/>
${text(150 + 1784 / 5653 * 1250 + 22, 175, "first visible drift", { size: 24, fill: C.purple, weight: 700 })}
`);

const steps = [[0, 16.67], [550, 16.67], [550, 33.33], [1280, 33.33], [1280, 50], [2050, 50], [2050, 66.67], [2860, 66.67], [2860, 83.33], [3820, 83.33], [3820, 100], [5000, 100]];
svg("03-p99-frame-multiples.svg", `
${chart({
  x: 170, y: 130, w: 1100, h: 610, xMax: 5000, yMax: 120,
  yTicks: [16.67, 33.33, 50, 66.67, 83.33, 100], xTicks: [0, 1000, 2000, 3000, 4000, 5000],
  xLabel: "run count (spin)", yLabel: "p99 frame time (ms)",
  series: [{ color: C.red, data: steps, width: 5 }],
  formatX: (v) => v === 0 ? "0" : `${v / 1000}K`,
  formatY: (v) => v.toFixed(2),
})}
${[1, 2, 3, 4, 5, 6].map((n) => {
  const v = n * 16.667;
  return text(1295, 130 + 610 - v / 120 * 610 + 8, `${v.toFixed(2)}ms (${n} frame${n > 1 ? "s" : ""})`, { size: 23, fill: C.axis });
}).join("")}
`);

const heap = series(360, (i, p) => [p * 5653, 190 + 9 * p + noise(i, 4)]);
const tex = series(360, (i, p) => [p * 5653, 24 + 2 * p + noise(i, .6)]);
const raf = series(360, (i, p) => [p * 5653, 6.8 + .55 * p + noise(i, .25)]);
svg("04-resource-flat-p99-rising.svg", `
${chart({
  x: 155, y: 120, w: 1180, h: 620, xMax: 5653, yMax: 125,
  yTicks: [0, 25, 50, 75, 100, 125], xTicks: [0, 1000, 2000, 3000, 4000, 5000, 5653],
  xLabel: "run count (spin)", yLabel: "normalized value",
  series: [
    { color: C.red, data: failure.map(([x, y]) => [x, y]), width: 4 },
    { color: C.blue, data: heap.map(([x, y]) => [x, y / 4]), width: 3 },
    { color: C.green, data: tex.map(([x, y]) => [x, y]), width: 3 },
    { color: C.orange, data: raf.map(([x, y]) => [x, y * 3]), width: 3 },
  ],
  formatX: (v) => v === 5653 ? "5,653" : v === 0 ? "0" : `${v / 1000}K`,
})}
${legend([{ label: "p99", color: C.red }, { label: "JS heap", color: C.blue }, { label: "texture", color: C.green }, { label: "rAF/frame", color: C.orange }], 410, 70)}
`);

const timeoutTotal = series(360, (i, p) => [p * 30, Math.pow(p, 2.75) * 562_000_000]);
const timeoutFrame = series(360, (i, p) => [p * 30, 110 + Math.pow(p, 2.15) * 990 + noise(i, 18)]);
svg("05-timeout-per-frame-explosion.svg", `
${chart({
  x: 155, y: 120, w: 1180, h: 620, xMax: 30, yMax: 1200,
  yTicks: [0, 300, 600, 900, 1200], xTicks: [0, 5, 10, 15, 20, 25, 30],
  xLabel: "elapsed time (min)", yLabel: "setTimeout callbacks / frame",
  series: [{ color: C.red, data: timeoutFrame, width: 5 }],
  formatX: (v) => `${v}`,
})}
${text(1110, 190, "~1,098 / frame", { size: 34, fill: C.red, weight: 800 })}
${miniChart(1030, 510, 330, 170, timeoutTotal.map(([x, y]) => [x, y / 1_000_000]), C.orange, 600)}
${text(1030, 490, "total scheduled timeouts (M)", { size: 22, fill: C.orange })}
`);

svg("06-heap-retainer-path.svg", `
${rect(90, 90, 650, 700, { fill: "#08131bcc", stroke: "#405867", rx: 14 })}
${rect(860, 90, 650, 700, { fill: "#08131bcc", stroke: "#405867", rx: 14 })}
${text(130, 160, "Heap snapshot delta", { size: 30, weight: 700, fill: C.blue })}
${[
  ["(closure) / Context", "32,247", "281,334", "+249,087"],
  ["(system) / Timeout", "17,842", "267,427", "+249,585"],
].map((r, i) => {
  const y = 255 + i * 95;
  return `${text(140, y, r[0], { size: 24 })}${text(420, y, r[1], { size: 24, fill: C.muted, anchor: "end" })}${text(555, y, r[2], { size: 24, fill: C.red, anchor: "end", weight: 700 })}${text(700, y, r[3], { size: 24, fill: C.red, anchor: "end", weight: 700 })}`;
}).join("")}
<line x1="125" y1="195" x2="705" y2="195" stroke="${C.grid}"/>
${text(140, 525, "audio end listener array", { size: 31, fill: C.red, weight: 800 })}
${text(140, 575, "length 68,848", { size: 30, fill: C.axis })}
${text(140, 625, "retained size ~20MB", { size: 26, fill: C.muted })}
${text(900, 160, "Retainer path", { size: 30, weight: 700, fill: C.blue })}
${["Window / global", "js SoundManager", "audio end listener array", "Closure (onAudioEnd)", "context", "(system) / Timeout"].map((v, i) => {
  const x = 945 + i * 42;
  const y = 680 - i * 85;
  return `${text(x, y, v, { size: 26, fill: i === 2 ? C.red : C.text, weight: i === 2 ? 800 : 500 })}${i < 5 ? `<line x1="${x + 25}" y1="${y - 35}" x2="${x + 45}" y2="${y - 65}" stroke="${C.muted}" stroke-width="3"/>` : ""}`;
}).join("")}
`);

function flowBox(x, y, w, label, color) {
  return `${rect(x, y, w, 105, { fill: "#0b1821", stroke: color, rx: 12 })}${text(x + w / 2, y + 43, label.split("\\n")[0], { size: 25, fill: color, weight: 700, anchor: "middle" })}${label.includes("\\n") ? text(x + w / 2, y + 78, label.split("\\n")[1], { size: 20, fill: C.axis, anchor: "middle" }) : ""}`;
}
svg("07-async-mental-model.svg", `
${rect(80, 120, 670, 600, { fill: "#150c0ccc", stroke: C.red, rx: 18 })}
${rect(850, 120, 670, 600, { fill: "#0b170fcc", stroke: C.green, rx: 18 })}
${text(415, 190, "wrong model", { size: 36, fill: C.red, weight: 800, anchor: "middle" })}
${text(1185, 190, "actual model", { size: 36, fill: C.green, weight: 800, anchor: "middle" })}
${flowBox(135, 315, 170, "setTimeout()", C.purple)}
${flowBox(360, 315, 180, "other thread\\n?", C.green)}
${flowBox(590, 315, 110, "callback", C.purple)}
<path d="M315 368 H350" stroke="${C.axis}" stroke-width="6"/><path d="M550 368 H585" stroke="${C.axis}" stroke-width="6"/>
${flowBox(895, 305, 160, "setTimeout()", C.purple)}
${flowBox(1090, 305, 150, "Timer\\nwait", C.green)}
${flowBox(1275, 305, 150, "Task\\nqueue", C.orange)}
${flowBox(1195, 470, 220, "Main Thread\\ncallback runs", C.blue)}
<path d="M1065 358 H1080" stroke="${C.axis}" stroke-width="6"/><path d="M1250 358 H1265" stroke="${C.axis}" stroke-width="6"/><path d="M1350 415 V460" stroke="${C.axis}" stroke-width="6"/>
${text(135, 615, "async delays execution;", { size: 25, fill: C.axis })}
${text(135, 652, "it does not make JavaScript run in parallel.", { size: 25, fill: C.axis })}
${text(895, 615, "callbacks still return to the main thread", { size: 25, fill: C.axis })}
${text(895, 652, "one by one.", { size: 25, fill: C.axis })}
`);

const n2 = series(240, (i, p) => [p * 5653, (p * p) * 5_600_000]);
const n1 = series(240, (i, p) => [p * 5653, p * 5653]);
svg("08-on2-to-on.svg", `
${chart({
  x: 140, y: 120, w: 610, h: 570, xMax: 5653, yMax: 6_000_000,
  yTicks: [0, 1_000_000, 3_000_000, 6_000_000], xTicks: [0, 1000, 3000, 5653],
  xLabel: "play count (N)", yLabel: "callback work",
  series: [{ color: C.red, data: n2, width: 5 }],
  formatX: (v) => v === 5653 ? "5,653" : v === 0 ? "0" : `${v / 1000}K`,
  formatY: (v) => v === 0 ? "0" : `${v / 1_000_000}M`,
})}
${chart({
  x: 870, y: 120, w: 610, h: 570, xMax: 5653, yMax: 6_000_000,
  yTicks: [0, 1_000_000, 3_000_000, 6_000_000], xTicks: [0, 1000, 3000, 5653],
  xLabel: "play count (N)", yLabel: "callback work",
  series: [{ color: C.green, data: n1.map(([x, y]) => [x, y * 1000]), width: 5 }],
  formatX: (v) => v === 5653 ? "5,653" : v === 0 ? "0" : `${v / 1000}K`,
  formatY: (v) => v === 0 ? "0" : `${v / 1_000_000}M`,
})}
${text(445, 80, "before: O(N²)", { size: 32, fill: C.red, weight: 800, anchor: "middle" })}
${text(1175, 80, "after: O(N)", { size: 32, fill: C.green, weight: 800, anchor: "middle" })}
`);

const failureSpin = 1784;
const oldRunSpin = 5653;
const beforeValidationP99 = series(260, (i, p) => [p * oldRunSpin, 17 + 83 * Math.pow(p, 1.7) + Math.max(0, noise(i, 13 + p * 18))]);
const afterValidationP99 = series(420, (i, p) => [p * 12000, 17.1 + 3.3 * p + Math.max(0, noise(i, 1.7))]);
svg("09-before-after-final-validation.svg", `
${chart({
  x: 150, y: 120, w: 1250, h: 600, xMax: 12000, yMax: 120,
  yTicks: [0, 16.7, 40, 80, 120], xTicks: [0, failureSpin, oldRunSpin, 8000, 10000, 12000],
  xLabel: "run count (spin)", yLabel: "p99 frame time (ms)",
  series: [
    { color: C.red, data: beforeValidationP99, width: 5 },
    { color: C.green, data: afterValidationP99, width: 5 },
  ],
  thresholdLines: [{ value: 16.67, color: C.muted }],
  formatX: (v) => v === failureSpin ? "first drift" : v === oldRunSpin ? "old run" : v === 0 ? "0" : `${v / 1000}K`,
  formatY: (v) => v === 16.7 ? "16.7" : v,
})}
<line x1="${150 + failureSpin / 12000 * 1250}" y1="120" x2="${150 + failureSpin / 12000 * 1250}" y2="720" stroke="${C.purple}" stroke-width="3" stroke-dasharray="10 10"/>
<line x1="${150 + oldRunSpin / 12000 * 1250}" y1="120" x2="${150 + oldRunSpin / 12000 * 1250}" y2="720" stroke="${C.blue}" stroke-width="3" stroke-dasharray="8 8" opacity=".85"/>
${text(150 + failureSpin / 12000 * 1250 + 18, 165, "drift", { size: 24, fill: C.purple, weight: 700 })}
${text(150 + oldRunSpin / 12000 * 1250 + 18, 205, "old run", { size: 24, fill: C.blue, weight: 700 })}
${legend([{ label: "before", color: C.red }, { label: "after", color: C.green }], 610, 70)}
`);

console.log(`Generated SVG assets in ${outDir}`);
