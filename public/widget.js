(function () {
  "use strict";

  // ══════════════════════════════════════════════════════════════════════════
  // VENDORED: thinking-orbs@0.3.1 engine — MIT © Jakub Antalik
  // https://github.com/Jakubantalik/thinking-orbs
  // Inlined so the widget stays a single dependency-free file (no build step,
  // no CDN at runtime). DO NOT EDIT BELOW — re-vendor from npm to update.
  // ══════════════════════════════════════════════════════════════════════════
  var OrbEngine = (function () {
function U(n, s, t) {
  return n + (s - n) * t;
}
function nt(n) {
  return n - Math.floor(n);
}
function G(n, s) {
  const t = Math.floor(n), r = Math.floor(s);
  let a = n - t, o = s - r;
  a = a * a * (3 - 2 * a), o = o * o * (3 - 2 * o);
  const c = E(t, r), M = E(t + 1, r), h = E(t, r + 1), m = E(t + 1, r + 1);
  return c + (M - c) * a + (h - c) * o + (c - M - h + m) * a * o;
}
function E(n, s) {
  const t = Math.sin(n * 12.9898 + s * 78.233) * 43758.5453;
  return t - Math.floor(t);
}
function J(n, s) {
  const t = Math.PI * (3 - Math.sqrt(5)), r = 1 - 2 * (n + 0.5) / s, a = Math.sqrt(1 - r * r), o = n * t;
  return [a * Math.cos(o), r, a * Math.sin(o)];
}
function et(n, s) {
  return Math.atan2(Math.sin(n - s), Math.cos(n - s));
}
function _(n, s, t, r, a) {
  const o = Math.sin(s), c = Math.cos(s), M = Math.sin(n), h = Math.cos(n);
  return (m, D, p) => {
    const e = m * h + p * M, l = -m * M + p * h, R = D * c - l * o, w = D * o + l * c;
    return [t + e * a, r - R * a, w];
  };
}
function rt(n, s, t, r = 0.3) {
  for (const a of s) {
    const o = a.a ?? 1, c = Math.min(1, Math.max(0, a.white)), M = Math.round((t ? 1 - c : c) * 255);
    n.fillStyle = `rgba(${M},${M},${M},${o})`, n.beginPath(), n.arc(a.x, a.y, a.r, 0, Math.PI * 2), n.fill();
  }
}
function it(n, s, t) {
  for (const r of s) {
    const a = r.a ?? 1, o = Math.min(1, Math.max(0, r.white)), c = Math.round((t ? 1 - o : o) * 255);
    n.strokeStyle = `rgba(${c},${c},${c},${a})`, n.lineWidth = r.w, n.beginPath(), n.moveTo(r.x1, r.y1), n.lineTo(r.x2, r.y2), n.stroke();
  }
}
function L(n, s, t = 0.3) {
  const r = [];
  for (const a of n)
    (a.a ?? 1) < 0.02 || (a.r = Math.max(t, a.r), r.push(a));
  return r.sort((a, o) => a.z - o.z), { dots: r, lines: s.filter((a) => (a.a ?? 1) >= 0.02) };
}
function ht(n, s, t) {
  s.lines.length && it(n, s.lines, t), rt(n, s.dots, t);
}
function $(n, s) {
  return (n / 300) ** s;
}
const Mt = (n, s, t) => {
  const r = n / 2, a = n / 2, o = n / 2 * 0.76, c = _(s * 0.4, 0.3, r, a, 1), M = $(n, t.rsPow ?? 0.6), h = [], m = t.ghostN ?? 150;
  for (let e = 0; e < m; e++) {
    const l = J(e, m), [R, w, i] = c(l[0] * o, l[1] * o, l[2] * o), u = (i / o + 1) / 2;
    h.push({ x: R, y: w, z: i, r: 0.8 * M, white: 0.78, a: 0.1 + 0.22 * u });
  }
  const D = t.strandN ?? 52, p = t.turns ?? 3;
  for (let e = 0; e < 3; e++) {
    const l = e / 3 * 2 * Math.PI;
    for (let R = 0; R < D; R++) {
      const w = (nt(R / D + s * 0.045) * 2 - 1) * 0.96, i = Math.sqrt(Math.max(0, 1 - w * w)), u = Math.min(1, (1 - Math.abs(w)) / 0.1), y = w * Math.PI * p + l, b = 1 + 0.075 * Math.sin(w * Math.PI * p * 2 + l * 2 + s * 0.8), f = i * o * b, [P, x, g] = c(Math.cos(y) * f, w * o * b, Math.sin(y) * f), d = (g / o + 1) / 2;
      h.push({
        x: P,
        y: x,
        z: g,
        r: ((t.rBase ?? 1.2) + (t.rDepth ?? 1.8) * d) * M,
        white: 0.55 - 0.45 * d,
        a: u * (0.45 + 0.55 * d)
      });
    }
  }
  return L(h, [], t.rMin);
};
function lt(n, s, t, r) {
  const a = 2 * s * t + r, o = n % a, c = new Array(s).fill(0);
  let M = -1;
  if (o < 2 * s * t) {
    const h = Math.floor(o / t), m = (o - h * t) / t, p = 1 - (1 - Math.min(1, m / 0.7)) ** 3;
    if (h < s) {
      for (let e = 0; e < h; e++) c[e] = 1;
      c[h] = p, M = h;
    } else {
      const e = 2 * s - 1 - h;
      for (let l = 0; l < e; l++) c[l] = 1;
      c[e] = 1 - p, M = e;
    }
  }
  return { amount: c, active: M };
}
function pt(n, s, t) {
  let [r, a, o] = n, c = !1;
  for (let M = 0; M < s.length; M++) {
    if (t.amount[M] <= 0) continue;
    const h = s[M], m = h.axis === 0 ? r : h.axis === 1 ? a : o;
    if (m < h.lo || m >= h.hi) continue;
    M === t.active && (c = !0);
    const D = h.ang * t.amount[M], p = Math.cos(D), e = Math.sin(D);
    if (h.axis === 0) {
      const l = a * p - o * e;
      o = a * e + o * p, a = l;
    } else if (h.axis === 1) {
      const l = r * p + o * e;
      o = -r * e + o * p, r = l;
    } else {
      const l = r * p - a * e;
      a = r * e + a * p, r = l;
    }
  }
  return [r, a, o, c];
}
function ut(n) {
  const s = [];
  for (let t = 0; t < n; t++) {
    const r = Math.min(2, Math.floor(E(t, 2.3) * 3)), a = -1 + 0.5 * Math.min(3, Math.floor(E(t, 5.9) * 4)), o = E(t, 7.7) < 0.5 ? 1 : -1;
    s.push({ axis: r, lo: a, hi: a + 0.5, ang: o * Math.PI / 2 });
  }
  return s;
}
const ft = (n, s, t) => {
  const a = n / 2, o = n / 2, c = n / 2 * 0.82, M = 0.4 + 0.06 * Math.sin(s * 0.35), h = _(s * 0.5, M, a, o, c), m = s * (0.5 + (1.7 - 0.5) * (t.scanMul ?? 1)), D = $(n, t.rsPow ?? 0.6), p = t.dimBase ?? 1, e = [], l = t.latRings ?? 17, R = t.lonDensity ?? 44;
  for (let w = 0; w <= l; w++) {
    const i = -Math.PI / 2 + w / l * Math.PI, u = Math.cos(i), y = Math.sin(i), b = Math.max(1, Math.round(Math.abs(u) * R));
    for (let f = 0; f < b; f++) {
      const P = f / b * 2 * Math.PI, [x, g, d] = h(u * Math.cos(P), y, u * Math.sin(P)), v = (d + 1) / 2, k = et(P + s * 0.5, m), N = Math.exp(-(k * k) / 0.18) * Math.max(0, d);
      e.push({
        x,
        y: g,
        z: d,
        r: ((t.rBase ?? 0.6) + (t.rDepth ?? 1.7) * v + (t.rBoost ?? 1) * N) * D,
        white: (t.inkFar ?? 0.62) - (t.inkSpan ?? 0.54) * v,
        // dimBase < 1 fades un-scanned dots so the meridian reads clearly
        a: p + (1 - p) * Math.min(1, N)
      });
    }
  }
  return L(e, [], t.rMin);
}, dt = (n, s, t) => {
  const r = n / 2, a = n / 2, o = n / 2 * 0.82, c = _(s * 0.55, 0.35 + 0.1 * Math.sin(s * 0.9), r, a, o), M = $(n, t.rsPow ?? 0.6), h = t.moveCount ?? 14, m = ut(h), D = lt(s, h, 0.42, 1.2), p = [], e = t.latRings ?? 15, l = t.lonDensity ?? 40;
  for (let R = 0; R <= e; R++) {
    const w = -Math.PI / 2 + R / e * Math.PI, i = Math.cos(w), u = Math.sin(w), y = Math.max(1, Math.round(Math.abs(i) * l));
    for (let b = 0; b < y; b++) {
      const f = b / y * 2 * Math.PI, [P, x, g, d] = pt([i * Math.cos(f), u, i * Math.sin(f)], m, D), [v, k, N] = c(P, x, g), z = (N + 1) / 2;
      p.push({
        x: v,
        y: k,
        z: N,
        r: ((t.rBase ?? 0.6) + (t.rDepth ?? 1.7) * z + (d ? t.rActive ?? 0.3 : 0)) * M,
        white: (t.inkFar ?? 0.62) - (t.inkSpan ?? 0.54) * z - (d ? 0.14 : 0)
      });
    }
  }
  return L(p, [], t.rMin);
}, bt = (n, s, t) => {
  const r = n / 2, a = n / 2, o = n / 2 * 0.874, c = _(s * 0.18, 0.38, r, a, 1), M = $(n, t.rsPow ?? 0.6), h = [], m = t.rings ?? 15, D = t.lonDensity ?? 40;
  for (let p = 0; p <= m; p++) {
    const e = -Math.PI / 2 + p / m * Math.PI, l = Math.cos(e), R = Math.sin(e), w = 0.62 * Math.sin(s * 2.1 - p * 0.52) + 0.38 * Math.sin(s * 1.27 + p * 0.83), i = o * (0.88 + 0.105 * w), u = Math.max(1, Math.round(Math.abs(l) * D));
    for (let y = 0; y < u; y++) {
      const b = y / u * 2 * Math.PI, [f, P, x] = c(l * Math.cos(b) * i, R * i, l * Math.sin(b) * i), g = (x / o + 1) / 2, d = Math.max(0, w);
      h.push({
        x: f,
        y: P,
        z: x,
        r: ((t.rBase ?? 0.6) + (t.rDepth ?? 1.7) * g) * (1 + 0.4 * d) * M,
        white: 0.66 - 0.56 * g - 0.1 * d
      });
    }
  }
  return L(h, [], t.rMin);
};
function xt(n) {
  return n * n * (3 - 2 * n);
}
function st(n) {
  const s = n.length, t = [];
  let r = 0;
  for (let a = 0; a < s; a++) {
    const o = n[a], c = n[(a + 1) % s], M = Math.hypot(c[0] - o[0], c[1] - o[1]);
    t.push(M), r += M;
  }
  return (a) => {
    let o = a * r, c = 0;
    for (; o > t[c] && c < s - 1; )
      o -= t[c], c++;
    const M = n[c], h = n[(c + 1) % s], m = t[c] ? Math.min(1, o / t[c]) : 0;
    return [M[0] + (h[0] - M[0]) * m, M[1] + (h[1] - M[1]) * m];
  };
}
const yt = (n) => {
  const s = -Math.PI / 2 + n * 2 * Math.PI;
  return [Math.cos(s) * 0.24, Math.sin(s) * 0.24];
}, gt = st([
  [0, -0.26],
  [0.24, 0.16],
  [-0.24, 0.16]
]), mt = st([
  [0, -0.2],
  [0.2, -0.2],
  [0.2, 0.2],
  [-0.2, 0.2],
  [-0.2, -0.2]
]), H = [yt, gt, mt];
function wt(n) {
  return Math.max(6, Math.round(34 * n));
}
const V = 1.4, ot = 0.9, Q = V + ot, Pt = (n, s, t) => {
  const r = H.length, a = s % (Q * r), o = Math.floor(a / Q), c = a - o * Q, M = c > V ? xt((c - V) / ot) : 0, h = t.spread ?? 1, m = H[o], D = H[(o + 1) % r], p = 160, e = [];
  for (let x = 0; x < p; x++) {
    const g = x / p, d = m(g), v = D(g);
    e.push([(d[0] + (v[0] - d[0]) * M) * h, (d[1] + (v[1] - d[1]) * M) * h]);
  }
  const l = [];
  let R = 0;
  for (let x = 0; x < p; x++) {
    const g = e[x], d = e[(x + 1) % p], v = Math.hypot(d[0] - g[0], d[1] - g[1]);
    l.push(v), R += v;
  }
  const w = wt(t.iconD ?? 1), i = (t.rDot ?? 0.021) * 1.35 * h, u = 1 + 0.02 * Math.sin(c * 3.1), y = [], b = n / 2;
  let f = 0, P = 0;
  for (let x = 0; x < w; x++) {
    const g = x / w * R;
    for (; P + l[f] < g && f < p - 1; )
      P += l[f], f++;
    const d = e[f], v = e[(f + 1) % p], k = l[f] ? Math.min(1, (g - P) / l[f]) : 0, N = (d[0] + (v[0] - d[0]) * k) * u, z = (d[1] + (v[1] - d[1]) * k) * u;
    y.push({
      x: b + N * n,
      y: b + z * n,
      z: 0,
      r: Math.max(0.35, i * n),
      white: 0.1
    });
  }
  return L(y, [], t.rMin);
}, Rt = (n, s, t) => {
  const r = n / 2, a = n / 2, o = n / 2 * 0.82, c = _(s * 0.12, 0.3, r, a, 1), M = $(n, t.rsPow ?? 0.6), h = [], m = t.orbitN ?? 12, D = t.ghostN ?? 40, p = t.particles ?? 3;
  for (let e = 0; e < m; e++) {
    const l = E(e, 1.7), R = E(e, 5.2), w = E(e, 8.9), i = o * (0.45 + 0.52 * l), u = l * 2 * Math.PI, y = Math.acos(2 * R - 1), b = Math.sin(y) * Math.cos(u), f = Math.cos(y), P = Math.sin(y) * Math.sin(u);
    let x = -f, g = b;
    const d = 0, v = Math.max(1e-6, Math.sqrt(x * x + g * g));
    x /= v, g /= v;
    const k = f * d - P * g, N = P * x - b * d, z = b * g - f * x, O = (0.25 + 0.55 * w) * (w > 0.5 ? 1 : -1);
    for (let B = 0; B < D; B++) {
      const I = B / D * 2 * Math.PI, [S, A, T] = c(
        (x * Math.cos(I) + k * Math.sin(I)) * i,
        (g * Math.cos(I) + N * Math.sin(I)) * i,
        (d * Math.cos(I) + z * Math.sin(I)) * i
      ), C = (T / i + 1) / 2;
      h.push({
        x: S,
        y: A,
        z: T,
        r: (t.ghostR ?? 0.9) * M,
        white: 0.72,
        a: (t.ghostA ?? 0.5) * (0.4 + 0.6 * C)
      });
    }
    for (let B = 0; B < p; B++) {
      const I = s * O + B / p * 2 * Math.PI + R * 6, [S, A, T] = c(
        (x * Math.cos(I) + k * Math.sin(I)) * i,
        (g * Math.cos(I) + N * Math.sin(I)) * i,
        (d * Math.cos(I) + z * Math.sin(I)) * i
      ), C = (T / i + 1) / 2;
      h.push({
        x: S,
        y: A,
        z: T,
        r: ((t.partR ?? 1.2) + (t.partRDepth ?? 1.6) * C) * M,
        white: 0.3 - 0.22 * C
      });
    }
  }
  return L(h, [], t.rMin);
}, Z = (n, s, t) => {
  const r = n / 2, a = n / 2, o = n / 2 * 0.78, c = t.spin ?? 1, M = 0.3, h = _(s * 0.1 * c, M, r, a, 1), m = $(n, t.rsPow ?? 0.6), D = [], p = t.ghostN ?? 150;
  for (let z = 0; z < p; z++) {
    const O = J(z, p), [B, I, S] = h(O[0] * o, O[1] * o, O[2] * o), A = (S / o + 1) / 2;
    D.push({ x: B, y: I, z: S, r: 0.8 * m, white: 0.78, a: 0.1 + 0.22 * A });
  }
  const e = s * 0.24 * c, l = t.faceOn ? -M : 0.55 + 0.3 * Math.sin(s * 0.18) * c, R = Math.cos(e), w = 0, i = Math.sin(e), u = -i * Math.sin(l), y = Math.cos(l), b = R * Math.sin(l), f = w * b - i * y, P = i * u - R * b, x = R * y - w * u, g = 0.23 * (t.wobMul ?? 1), d = t.faceOn ? o / (1 + 0.85 * g) : o, v = t.lanes ?? 5, k = t.segs ?? 88, N = Math.max(1, Math.round(v * (t.bandMul ?? 1)));
  for (let z = 0; z < N; z++) {
    const O = (z - (N - 1) / 2) * 0.075, B = Math.abs(z - (N - 1) / 2) / Math.max(1, (N - 1) / 2);
    for (let I = 0; I < k; I++) {
      const S = I / k * 2 * Math.PI, A = (0.16 * Math.sin(S * 3 - s * 1.7 + z * 0.22) + 0.07 * Math.sin(S * 5 + s * 1.1)) * (t.wobMul ?? 1), T = t.faceOn ? 1 + A : 1, C = t.faceOn ? O : O + A, q = R * Math.cos(S) + u * Math.sin(S) + f * C, F = w * Math.cos(S) + y * Math.sin(S) + P * C, j = i * Math.cos(S) + b * Math.sin(S) + x * C, W = Math.sqrt(q * q + F * F + j * j), Y = d * T, [ct, at, X] = h(q / W * Y, F / W * Y, j / W * Y), K = (X / o + 1) / 2;
      D.push({
        x: ct,
        y: at,
        z: X,
        r: ((t.rBase ?? 1.1) + (t.rDepth ?? 1.7) * K) * (1 - 0.25 * B) * m,
        white: 0.52 - 0.44 * K + 0.18 * B,
        a: 0.4 + 0.6 * K
      });
    }
  }
  return L(D, [], t.rMin);
}, Dt = (n, s, t) => {
  const r = n / 2, a = n / 2, o = n / 2 * 0.8 * (t.spread ?? 1), c = _(s * 0.12, 0.32, r, a, o), M = $(n, t.rsPow ?? 0.6), h = t.nodeN ?? 30, m = t.thr ?? 0.72, D = t.nodeR ?? 1.4, p = t.nodeRDepth ?? 1.8, e = [];
  for (let i = 0; i < h; i++) {
    const u = J(i, h), y = u[0] + 0.3 * (G(i * 0.31 + 9, s * 0.24) - 0.5) * 2, b = u[1] + 0.3 * (G(i * 0.53 + 27, s * 0.21) - 0.5) * 2, f = u[2] + 0.3 * (G(i * 0.77 + 55, s * 0.27) - 0.5) * 2, P = Math.sqrt(y * y + b * b + f * f);
    e.push([y / P, b / P, f / P]);
  }
  const l = [], R = [];
  for (let i = 0; i < h; i++)
    for (let u = i + 1; u < h; u++) {
      const y = e[i][0] - e[u][0], b = e[i][1] - e[u][1], f = e[i][2] - e[u][2], P = Math.sqrt(y * y + b * b + f * f);
      if (P >= m) continue;
      const [x, g, d] = c(e[i][0], e[i][1], e[i][2]), [v, k, N] = c(e[u][0], e[u][1], e[u][2]), z = ((d + N) / 2 + 1) / 2;
      l.push({
        x1: x,
        y1: g,
        x2: v,
        y2: k,
        white: 0.42,
        a: (1 - P / m) * (0.3 + 0.55 * z),
        w: Math.max(0.6, (t.lineW ?? 0.8) * M)
      });
    }
  for (let i = 0; i < h; i++) {
    const [u, y, b] = c(e[i][0], e[i][1], e[i][2]), f = (b + 1) / 2, P = 1 + 0.25 * Math.sin(s * 1.4 + i * 2.7);
    R.push({
      x: u,
      y,
      z: b,
      r: (D + p * f) * P * M,
      white: 0.55 - 0.45 * f
    });
  }
  const w = t.signals ?? 5;
  for (let i = 0; i < w; i++) {
    const u = Math.floor(s * 0.55 + i * 7.31), y = Math.floor(E(u, i * 3.1 + 1.7) * h), b = Math.floor(E(u, i * 5.7 + 4.2) * h);
    if (y === b) continue;
    const f = nt(s * 0.55 + i * 7.31), P = U(e[y][0], e[b][0], f), x = U(e[y][1], e[b][1], f), g = U(e[y][2], e[b][2], f), d = Math.max(1e-6, Math.sqrt(P * P + x * x + g * g)), [v, k, N] = c(P / d, x / d, g / d), z = (N + 1) / 2;
    R.push({
      x: v,
      y: k,
      z: N,
      r: (D * 1.5 + p * z) * M,
      white: 0.05,
      a: 0.5 + 0.5 * z
    });
  }
  return L(R, l, t.rMin);
}, vt = {
  orbits: Rt,
  globe: ft,
  rubik: dt,
  wave: bt,
  web: Dt,
  braid: Mt,
  ribbon: Z,
  // ring shares ribbon's geometry — the `faceOn` profile flag switches it
  ring: Z,
  morph: Pt
}, Ct = Object.fromEntries(
  Object.entries(vt).map(([n, s]) => [
    n,
    (t, r, a, o, c) => ht(t, s(r, a, c), o)
  ])
), zt = [
  ["latRings", "lonDensity"],
  ["rings", "lonDensity"],
  ["lanes", "segs"]
], Nt = ["orbitN", "ghostN", "nodeN", "strandN", "signals"], It = ["iconD"], kt = [
  "rBase",
  "rDepth",
  "rActive",
  "rDot",
  "ghostR",
  "partR",
  "partRDepth",
  "nodeR",
  "nodeRDepth"
];
function St(n, s) {
  const t = { ...n }, r = /* @__PURE__ */ new Set(), a = Math.sqrt(s);
  for (const [o, c] of zt) {
    const M = t[o], h = t[c];
    M != null && h != null && !r.has(o) && !r.has(c) && (t[o] = Math.max(2, Math.round(M * a)), t[c] = Math.max(2, Math.round(h * a)), r.add(o), r.add(c));
  }
  for (const o of Nt) {
    const c = t[o];
    c != null && c !== 0 && !r.has(o) && (t[o] = Math.max(1, Math.round(c * s)));
  }
  for (const o of It) {
    const c = t[o];
    c != null && (t[o] = Math.max(0.02, c * s));
  }
  return t;
}
function Bt(n, s) {
  const t = { ...n };
  for (const r of kt) {
    const a = t[r];
    a != null && (t[r] = a * s);
  }
  return t.rSizeMul = (t.rSizeMul ?? 1) * s, t;
}
const Et = {
  globe: {
    latRings: 17,
    lonDensity: 44,
    rBase: 0.6,
    rDepth: 1.7,
    rBoost: 1,
    inkFar: 0.62,
    inkSpan: 0.54,
    rsPow: 0.6,
    rMin: 0.3
  },
  orbits: {
    orbitN: 12,
    ghostN: 40,
    ghostR: 0.9,
    ghostA: 0.5,
    particles: 3,
    partR: 1.2,
    partRDepth: 1.6,
    rsPow: 0.6,
    rMin: 0.3
  },
  rubik: {
    latRings: 15,
    lonDensity: 40,
    moveCount: 14,
    rBase: 0.6,
    rDepth: 1.7,
    rActive: 0.3,
    inkFar: 0.62,
    inkSpan: 0.54,
    rsPow: 0.6,
    rMin: 0.3
  },
  wave: {
    rings: 15,
    lonDensity: 40,
    rBase: 0.6,
    rDepth: 1.7,
    rsPow: 0.6,
    rMin: 0.3
  },
  web: {
    nodeN: 30,
    thr: 0.72,
    signals: 5,
    nodeR: 1.4,
    nodeRDepth: 1.8,
    lineW: 0.8,
    rsPow: 0.6,
    rMin: 0.3
  },
  braid: {
    strandN: 52,
    turns: 3,
    ghostN: 150,
    rBase: 1.2,
    rDepth: 1.8,
    rsPow: 0.6,
    rMin: 0.3
  },
  ribbon: {
    lanes: 5,
    segs: 88,
    ghostN: 150,
    rBase: 1.1,
    rDepth: 1.7,
    rsPow: 0.6,
    rMin: 0.3
  },
  // ring shares ribbon's painter; faceOn cancels the camera tilt and moves
  // the undulation onto the radius, and there is no ghost sphere behind it
  ring: {
    lanes: 5,
    segs: 88,
    ghostN: 0,
    faceOn: 1,
    rBase: 1.1,
    rDepth: 1.7,
    rsPow: 0.6,
    rMin: 0.3
  },
  morph: {
    rDot: 0.021,
    iconD: 1,
    rMin: 0.25
  }
}, Ot = {
  working: "orbits",
  searching: "globe",
  solving: "rubik",
  listening: "wave",
  connecting: "web",
  weaving: "braid",
  composing: "ribbon",
  breathing: "ring",
  shaping: "morph"
}, At = {
  orbits: {
    64: { speed: 1.885, count: 1, size: 1 },
    20: { speed: 3.9, count: 0.238, size: 2.4 }
  },
  globe: {
    64: { speed: 2.015, count: 0.42, size: 1.15, extra: { scanMul: 4.08, dimBase: 0.45 } },
    20: { speed: 2.665, count: 0.105, size: 1.75, extra: { scanMul: 4.335, dimBase: 0.45 } }
  },
  rubik: {
    64: { speed: 1.82, count: 0.35, size: 1.05 },
    20: { speed: 1.95, count: 0.088, size: 1.9 }
  },
  wave: {
    64: { speed: 4.388, count: 0.341, size: 1 },
    20: { speed: 3.998, count: 0.105, size: 1.6 }
  },
  web: {
    64: { speed: 3.315, count: 1.35, size: 0.95 },
    20: { speed: 6.63, count: 0.25, size: 1.52 }
  },
  braid: {
    64: { speed: 1.625, count: 0.5, size: 1 },
    20: { speed: 2.75, count: 0.1125, size: 1.36 }
  },
  ribbon: {
    64: { speed: 2.34, count: 0.25, size: 0.85, extra: { spin: 0, bandMul: 3.9, wobMul: 1 } },
    20: { speed: 3.12, count: 0.051, size: 1.073, extra: { spin: 0, bandMul: 4.94, wobMul: 1 } }
  },
  ring: {
    64: { speed: 3.24, count: 0.25, size: 0.956, extra: { spin: 0, bandMul: 3.627, wobMul: 0.368 } },
    20: { speed: 3.78, count: 0.028, size: 1.622, extra: { spin: 0, bandMul: 3.968, wobMul: 0.565 } }
  },
  morph: {
    64: { speed: 2.405, count: 0.702, size: 0.395, extra: { spread: 1.45 } },
    20: { speed: 2.08, count: 0.53, size: 1.011, extra: { spread: 1.45 } }
  }
}, tt = /* @__PURE__ */ new Map();
function Lt(n, s) {
  const t = `${n}-${s}`, r = tt.get(t);
  if (r) return r;
  const a = Ot[n], o = At[a][s];
  let c = { ...Et[a] };
  o.count !== 1 && (c = St(c, o.count)), o.size !== 1 && (c = Bt(c, o.size)), o.extra && (c = { ...c, ...o.extra });
  const M = { mode: a, speed: o.speed, opts: c };
  return tt.set(t, M), M;
}
  return { MODE_DRAWS: Ct, STATE_TO_MODE: Ot, resolvePreset: Lt };
  })();
  // ═══════════════════════════ END VENDORED CODE ════════════════════════════

  // ─── Config ────────────────────────────────────────────────────────────────
  var API_URL = "https://felt-studios-faye.vercel.app/api/chat";
  var OPENING_MESSAGE =
    "Hey — you've reached Studio Felt. We design products that people feel. What can I help with?";
  var CALENDAR_TRIGGER = "[SHOW_CALENDAR]";
  var CALENDAR_URL = "https://cal.com/cm-vignesh?embed=true";
  var QUICK_REPLIES = ["See our work", "What you do", "Book a call"];

  // Orb — the library ships tuned presets only at 20 and 64 CSS px, so we pull
  // the 20 preset's dot tuning and hand the draw fn our own render size. Its
  // radii scale sub-linearly, so these stay legible without CSS upscaling.
  var ORB_PRESET_SIZE = 20;
  var ORB_PILL_SIZE = 28;
  var ORB_PANEL_SIZE = 32;
  var ORB_SPEED = 0.75;
  var ORB_STATE = "composing";

  // Motion
  var EXPAND_MS = 600;
  var EXPAND_EASE = "cubic-bezier(0.16,1,0.3,1)";

  // ─── State ─────────────────────────────────────────────────────────────────
  var conversationHistory = [];
  var isOpen = false;
  var isStreaming = false;
  var quickRepliesShown = false;
  var calendarShown = false;

  // ─── Styles ────────────────────────────────────────────────────────────────
  var style = document.createElement("style");
  style.textContent = [
    /* Reset — padding intentionally excluded: ID specificity would override class padding rules */
    "#sf-widget-root *{box-sizing:border-box;margin:0;}",

    /* PANEL */
    ".felt-panel{width:420px;height:100vh;max-height:680px;background:#000000;border:none;",
    "border-radius:20px;position:fixed;bottom:24px;left:24px;display:flex;flex-direction:column;",
    "overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;",
    "box-shadow:0 32px 64px rgba(0,0,0,0.6);z-index:99999;transform-origin:bottom left;",
    "opacity:0;transform:translateY(20px);pointer-events:none;",
    "transition:opacity 0.6s cubic-bezier(0.16,1,0.3,1),transform 0.6s cubic-bezier(0.16,1,0.3,1);}",
    ".felt-panel--visible{opacity:1!important;transform:translateY(0)!important;pointer-events:all!important;}",

    /* TOP BAR */
    ".felt-topbar{position:absolute;top:0;left:0;right:0;padding:20px 20px;",
    "display:flex;align-items:center;justify-content:space-between;z-index:10;}",
    ".felt-topbar-left{display:flex;align-items:center;gap:16px;}",
    ".felt-topbar-btn{width:36px;height:36px;border-radius:50%;",
    "background:rgba(255,255,255,0.12);border:none;cursor:pointer;",
    "display:flex;align-items:center;justify-content:center;",
    "color:#fff;font-size:18px;line-height:1;}",
    ".felt-topbar-btn:hover{background:rgba(255,255,255,0.2);}",

    /* MESSAGES AREA */
    ".felt-messages{flex:1;overflow-y:auto;padding:80px 32px 24px 32px;",
    "display:flex;flex-direction:column;scrollbar-width:none;}",
    ".felt-messages::-webkit-scrollbar{display:none;}",

    /* MESSAGE BLOCK */
    ".felt-message-block{margin-bottom:40px;}",
    ".felt-message-block:last-child{margin-bottom:0;}",

    /* SENDER LABEL ROW */
    ".felt-label-row{display:flex;align-items:center;gap:10px;margin-bottom:6px;}",
    ".felt-sender{font-size:13px;font-weight:500;color:rgba(255,255,255,0.35);}",
    ".felt-timestamp{font-size:13px;color:rgba(255,255,255,0.25);}",

    /* MESSAGE TEXT */
    ".felt-message-text{font-size:17px;padding-bottom:15px;font-weight:500;color:#ffffff;line-height:1.4;",
    "white-space:pre-wrap;letter-spacing:-0.02em;word-break:break-word;}",

    /* CHIPS */
    ".felt-chips{display:flex;flex-direction:column;align-items:flex-start;gap:8px;margin-top:16px;padding-bottom:10px}",
    ".felt-chip{padding:8px 10px;background:rgba(255,255,255,0.1);border:none;border-radius:100px;",
    "font-size:16px;font-weight:400;color:rgba(255,255,255,0.75);cursor:pointer;",
    "transition:background 0.15s,color 0.15s;display:inline-flex;align-items:center;",
    "font-family:inherit;white-space:nowrap;}",
    ".felt-chip:hover{background:rgba(255,255,255,0.18);color:#fff;}",

    /* CALENDAR EMBED */
    ".felt-cal-card{width:100%;height:500px;border-radius:12px;overflow:hidden;",
    "background:#111;margin-top:12px;}",
    ".felt-cal-card iframe{width:100%;height:100%;border:none;display:block;}",

    /* INPUT AREA */
    ".felt-input-area{padding:16px 32px 28px;display:flex;align-items:center;gap:12px;border-top:none;flex-shrink:0;}",
    ".felt-input{flex:1;background:transparent;border:none;outline:none;",
    "font-size:16px;color:rgba(255,255,255,0.5);font-family:inherit;padding:0;}",
    ".felt-input::placeholder{color:rgba(255,255,255,0.25);}",

    /* PILL */
    // Background matches the panel exactly, so the morph never crosses a colour
    ".felt-pill{position:fixed;bottom:24px;left:24px;background:#000000;color:#fff;border:none;",
    "border-radius:100px;padding:20px 24px;font-size:15px;",
    "font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;",
    "cursor:pointer;z-index:100000;user-select:none;",
    "display:flex;align-items:center;gap:10px;white-space:nowrap;",
    // Anchored bottom-left, so hover must grow away from the corner it sits in
    "transform-origin:bottom left;will-change:transform,opacity;",
    "opacity:1;transition:opacity 0.18s ease;}",
    ".felt-pill-label{line-height:1;}",
    ".felt-pill--fading{opacity:0!important;pointer-events:none;}",
    ".felt-pill--hidden{display:none!important;}",

    /* ORB */
    ".felt-orb{display:block;flex-shrink:0;}",

    /* EXPAND CHOREOGRAPHY — panel grows out of the pill's footprint.
       Width/height are animated rather than transform:scale so the 20px
       border-radius stays round and the content never stretches. The orb in
       the input row is deliberately excluded from the fade: it is the one
       element that carries continuity from the pill, so it stays lit. */
    ".felt-panel-fade{transition:opacity 0.3s ease;}",
    ".felt-panel--collapsed .felt-panel-fade{opacity:0;}",

    /* TYPING PULSE */
    ".felt-pulse{display:flex;gap:4px;align-items:center;padding:4px 0;margin-top:4px;}",
    ".felt-pulse span{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.35);",
    "animation:felt-bounce 1.2s ease-in-out infinite;}",
    ".felt-pulse span:nth-child(2){animation-delay:0.2s;}",
    ".felt-pulse span:nth-child(3){animation-delay:0.4s;}",
    "@keyframes felt-bounce{0%,80%,100%{transform:translateY(0);opacity:0.35;}",
    "40%{transform:translateY(-5px);opacity:0.9;}}",
  ].join("");
  document.head.appendChild(style);

  // ─── Orb runtime ────────────────────────────────────────────────────────────
  // Drives a thinking-orbs canvas without React. Mirrors the upstream wrapper's
  // lifecycle: DPR-aware backing store, rAF loop, and pausing when the orb is
  // scrolled out of view or the tab is hidden — an animation nobody can see
  // should not be burning a frame budget on someone's marketing site.
  function createOrb(initialState, renderSize) {
    var canvas = document.createElement("canvas");
    canvas.className = "felt-orb";
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.width = renderSize + "px";
    canvas.style.height = renderSize + "px";

    var dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(renderSize * dpr);
    canvas.height = Math.round(renderSize * dpr);

    var ctx = canvas.getContext("2d");
    var draw = null;
    var opts = null;
    var speed = 1;
    var rafId = 0;
    var running = false;
    var onScreen = true;

    var reduced = false;
    try {
      reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) {}

    function setState(state) {
      // The library ships tuned presets only at 20 and 64; ask for the 20
      // tuning, then render it at our own size. Dot radii scale sub-linearly,
      // so the result is sharp rather than an upscaled 20px canvas.
      var r = OrbEngine.resolvePreset(state, ORB_PRESET_SIZE);
      draw = OrbEngine.MODE_DRAWS[r.mode];
      opts = r.opts;
      speed = r.speed * ORB_SPEED;
      // Repaint now rather than waiting on the loop: if the orb is offscreen
      // or the tab is backgrounded the loop is stopped, and the canvas would
      // otherwise keep showing the previous state until it resumes.
      render(reduced ? 0.6 : (performance.now() / 1000) * speed);
    }

    function render(t) {
      if (!ctx || !draw) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, renderSize, renderSize);
      // dark=true: the widget is black throughout, so the orb inks light.
      draw(ctx, renderSize, t, true, opts);
    }

    function frame() {
      render((performance.now() / 1000) * speed);
      if (running) rafId = requestAnimationFrame(frame);
    }

    function start() {
      if (running || reduced || !onScreen) return;
      running = true;
      rafId = requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(rafId);
    }

    setState(initialState);

    if (reduced) {
      render(0.6); // a single representative frame, held
    } else {
      render(0);
      if (typeof IntersectionObserver !== "undefined") {
        new IntersectionObserver(function (entries) {
          onScreen = entries[0].isIntersecting;
          if (onScreen && document.visibilityState !== "hidden") start();
          else stop();
        }).observe(canvas);
      } else {
        start();
      }
      document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "hidden") stop();
        else if (onScreen) start();
      });
    }

    return { el: canvas, setState: setState, start: start, stop: stop };
  }

  // ─── DOM Construction ───────────────────────────────────────────────────────
  var root = document.createElement("div");
  root.id = "sf-widget-root";

  // Pill — orb leads, label follows
  var pill = document.createElement("button");
  pill.className = "felt-pill";
  pill.setAttribute("aria-label", "Open Studio Felt chat");
  var pillOrb = createOrb(ORB_STATE, ORB_PILL_SIZE);
  var pillLabel = document.createElement("span");
  pillLabel.className = "felt-pill-label";
  pillLabel.textContent = "Ask me anything";
  pill.appendChild(pillOrb.el);
  pill.appendChild(pillLabel);

  // Panel
  var panel = document.createElement("div");
  panel.className = "felt-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Studio Felt chat");

  // Topbar + messages + input
  panel.innerHTML = [
    '<div class="felt-topbar felt-panel-fade">',
    '  <div class="felt-topbar-left">',
    '    <button class="felt-topbar-btn" id="sf-btn-back" aria-label="Go back">&#8249;</button>',
    '  </div>',
    '  <button class="felt-topbar-btn" id="sf-btn-close" aria-label="Close chat">&#215;</button>',
    '</div>',
    '<div class="felt-messages felt-panel-fade"></div>',
    '<div class="felt-input-area">',
    '  <input class="felt-input felt-panel-fade" type="text" placeholder="Ask me anything…" aria-label="Message input" autocomplete="off" />',
    "</div>",
  ].join("");

  // Panel orb — sits at the head of the input row, where the pill's orb lands.
  var panelOrb = createOrb(ORB_STATE, ORB_PANEL_SIZE);
  var inputArea = panel.querySelector(".felt-input-area");
  inputArea.insertBefore(panelOrb.el, inputArea.firstChild);

  root.appendChild(panel);
  root.appendChild(pill);
  document.body.appendChild(root);

  // Grab live refs
  var messagesEl = panel.querySelector(".felt-messages");
  var inputEl = panel.querySelector(".felt-input");
  var btnBack = panel.querySelector("#sf-btn-back");
  var btnClose = panel.querySelector("#sf-btn-close");

  // ─── Helpers ───────────────────────────────────────────────────────────────
  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function currentTime() {
    var d = new Date();
    var h = String(d.getHours()).padStart(2, "0");
    var m = String(d.getMinutes()).padStart(2, "0");
    return h + ":" + m;
  }

  function createMetaRow(label) {
    var meta = document.createElement("div");
    meta.className = "felt-label-row";
    meta.innerHTML =
      '<span class="felt-sender">' + label + '</span>' +
      '<span class="felt-timestamp">' + currentTime() + '</span>';
    return meta;
  }

  function createBotBubble() {
    var msg = document.createElement("div");
    msg.className = "felt-message-block bot";
    msg.appendChild(createMetaRow("Felt"));
    var bubble = document.createElement("div");
    bubble.className = "felt-message-text";
    // Pulse indicator
    bubble.innerHTML =
      '<div class="felt-pulse"><span></span><span></span><span></span></div>';
    msg.appendChild(bubble);
    messagesEl.appendChild(msg);
    scrollToBottom();
    return { msg: msg, bubble: bubble };
  }

  function appendBotMessage(text, showCalendar) {
    var ref = createBotBubble();
    ref.bubble.innerHTML = "";
    var textNode = document.createTextNode(text);
    ref.bubble.appendChild(textNode);

    if (showCalendar) {
      appendCalendar(ref.msg);
    }
    scrollToBottom();
    return ref;
  }

  function appendCalendar(parentEl) {
    var card = document.createElement("div");
    card.className = "felt-cal-card";
    var iframe = document.createElement("iframe");
    iframe.src = CALENDAR_URL;
    iframe.title = "Book a call with Studio Felt";
    iframe.loading = "lazy";
    card.appendChild(iframe);
    parentEl.appendChild(card);
  }

  function appendUserBubble(text) {
    var msg = document.createElement("div");
    msg.className = "felt-message-block user";
    msg.appendChild(createMetaRow("You"));
    var bubble = document.createElement("div");
    bubble.className = "felt-message-text";
    bubble.textContent = text;
    msg.appendChild(bubble);
    messagesEl.appendChild(msg);
    scrollToBottom();
  }

  function showQuickReplies() {
    if (quickRepliesShown) return;
    quickRepliesShown = true;

    // Attach chips to the first bot message
    var firstBot = messagesEl.querySelector(".felt-message-block.bot");
    if (!firstBot) return;

    var chips = document.createElement("div");
    chips.className = "felt-chips";
    chips.id = "sf-chips";

    QUICK_REPLIES.forEach(function (label) {
      var chip = document.createElement("button");
      chip.className = "felt-chip";
      chip.textContent = label;
      chip.addEventListener("click", function () {
        chips.remove();
        sendMessage(label);
      });
      chips.appendChild(chip);
    });

    firstBot.appendChild(chips);
    scrollToBottom();
  }

  function setStreaming(state) {
    isStreaming = state;
    inputEl.disabled = state;
  }

  // ─── API / SSE ─────────────────────────────────────────────────────────────
  function sendMessage(text) {
    if (!text.trim() || isStreaming) return;

    appendUserBubble(text);
    conversationHistory.push({ role: "user", content: text });
    inputEl.value = "";

    setStreaming(true);

    var ref = createBotBubble();
    var accumulated = "";
    var pulseRemoved = false;

    function removePulse() {
      if (pulseRemoved) return;
      pulseRemoved = true;
      ref.bubble.innerHTML = "";
    }

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conversationHistory }),
    })
      .then(function (res) {
        if (!res.ok) {
          return res.json().then(function (j) {
            throw new Error(j.error || "HTTP " + res.status);
          });
        }
        return res.body;
      })
      .then(function (body) {
        var reader = body.getReader();
        var decoder = new TextDecoder();
        var leftover = "";
        var finished = false;

        function pump() {
          reader.read().then(function (result) {
            if (result.done) {
              if (!finished) finish();
              return;
            }

            leftover += decoder.decode(result.value, { stream: true });
            var lines = leftover.split("\n");
            leftover = lines.pop(); // keep incomplete line

            lines.forEach(function (line) {
              line = line.trim();
              if (!line.startsWith("data:")) return;
              var payload = line.slice(5).trim();
              if (payload === "[DONE]") {
                if (!finished) finish();
                return;
              }
              try {
                var parsed = JSON.parse(payload);
                if (parsed.token) {
                  removePulse();
                  accumulated += parsed.token;
                  // Show raw accumulated text while streaming;
                  // [SHOW_CALENDAR] will be stripped in finish()
                  ref.bubble.textContent = accumulated;
                  scrollToBottom();
                }
                if (parsed.error) {
                  removePulse();
                  ref.bubble.textContent = "Something went wrong — try again.";
                  if (!finished) finish();
                }
              } catch (e) {
                // non-JSON line, ignore
              }
            });

            pump();
          });
        }

        pump();

        function finish() {
          finished = true;

          // Post-stream: detect and strip [SHOW_CALENDAR] from the full text
          var shouldShowCalendar = false;
          if (!calendarShown && accumulated.includes(CALENDAR_TRIGGER)) {
            shouldShowCalendar = true;
            accumulated = accumulated.split(CALENDAR_TRIGGER).join("").trim();
          } else if (accumulated.includes(CALENDAR_TRIGGER)) {
            // Already shown — just strip the trigger string silently
            accumulated = accumulated.split(CALENDAR_TRIGGER).join("").trim();
          }

          // Write the clean text into the bubble
          if (!pulseRemoved) removePulse();
          ref.bubble.textContent = accumulated || "Something went wrong — try again.";

          // Append calendar iframe once, guarded by session flag
          if (shouldShowCalendar) {
            calendarShown = true;
            appendCalendar(ref.msg);
          }

          var finalText = accumulated.trim();
          if (finalText) {
            conversationHistory.push({ role: "assistant", content: finalText });
          }
          showQuickReplies();
          setStreaming(false);
          scrollToBottom();
        }
      })
      .catch(function (err) {
        console.error("[sf-widget]", err);
        removePulse();
        ref.bubble.textContent = "Something went wrong — try again.";
        setStreaming(false);
        scrollToBottom();
      });
  }

  // ─── Pill hover ────────────────────────────────────────────────────────────
  // Two-stage on each direction: overshoot past the target, then settle back.
  // A single eased transition reads as inert at this amplitude — the tiny
  // rebound is what makes 3% of scale feel like a response.
  var hoverTimer = null;
  var PILL_TRANSITION_OPACITY = ", opacity 0.18s ease";

  // Scale is uniform, so a pixel delta has to be resolved against one axis —
  // height, since that is what reads as "size" on a capsule. Derived from the
  // live layout box (offsetHeight ignores transforms) so changing the orb size
  // or the padding re-tunes the hover automatically.
  function pillScale(deltaPx) {
    return "scale(" + (1 + deltaPx / (pill.offsetHeight || 64)) + ")";
  }

  function pillHoverIn() {
    if (isOpen) return;
    clearTimeout(hoverTimer);
    pill.style.transition = "transform 280ms cubic-bezier(0.34,1.56,0.64,1)" + PILL_TRANSITION_OPACITY;
    pill.style.transform = pillScale(2); // overshoot +2px
    hoverTimer = setTimeout(function () {
      pill.style.transition = "transform 180ms ease-out" + PILL_TRANSITION_OPACITY;
      pill.style.transform = pillScale(1.8); // settle at +1.8px
    }, 280);
  }

  function pillHoverOut() {
    if (isOpen) return;
    clearTimeout(hoverTimer);
    pill.style.transition = "transform 160ms ease-in" + PILL_TRANSITION_OPACITY;
    pill.style.transform = pillScale(-0.2); // undershoot
    hoverTimer = setTimeout(function () {
      pill.style.transition = "transform 220ms " + EXPAND_EASE + PILL_TRANSITION_OPACITY;
      pill.style.transform = "scale(1)";
    }, 160);
  }

  pill.addEventListener("mouseenter", pillHoverIn);
  pill.addEventListener("mouseleave", pillHoverOut);

  // ─── Open / Close animation ────────────────────────────────────────────────
  // The panel grows out of the pill's exact footprint. Width and height are
  // animated (not transform:scale) so the corner radius stays circular and the
  // content inside never distorts; the radius itself eases from the pill's
  // 29px to the panel's 20px so the two shapes are never visibly different.
  var closeTimer = null;
  var PANEL_RADIUS = "20px";
  // The pill is a 100px-radius capsule, so its true corner is half its height.
  // Derived rather than hardcoded — padding or font changes shouldn't desync it.
  function pillRadius(rect) {
    return rect.height / 2 + "px";
  }

  function expandTransition() {
    return (
      "width " + EXPAND_MS + "ms " + EXPAND_EASE +
      ", height " + EXPAND_MS + "ms " + EXPAND_EASE +
      ", border-radius " + EXPAND_MS + "ms " + EXPAND_EASE
    );
  }

  function openWidget() {
    if (isOpen) return;
    isOpen = true;
    clearTimeout(closeTimer);
    clearTimeout(hoverTimer);

    // Measure the pill before it goes anywhere, hover scale included.
    var rect = pill.getBoundingClientRect();
    var targetH = Math.min(680, window.innerHeight - 48);

    // Seed the panel on the pill's footprint with no transition, so the first
    // painted frame is indistinguishable from the pill it replaces.
    panel.classList.add("felt-panel--collapsed");
    panel.style.transition = "none";
    panel.style.width = rect.width + "px";
    panel.style.height = rect.height + "px";
    panel.style.borderRadius = pillRadius(rect);
    panel.classList.add("felt-panel--visible");

    // Pill sits above the panel (z-index 100000) and fades off the top of it.
    pill.classList.add("felt-pill--fading");

    // Flush the seeded geometry, otherwise the browser coalesces it with the
    // target values below and the expand never animates.
    void panel.offsetHeight;

    panel.style.transition = expandTransition();
    panel.style.width = "420px";
    panel.style.height = targetH + "px";
    panel.style.borderRadius = PANEL_RADIUS;
    panel.classList.remove("felt-panel--collapsed");

    if (messagesEl.children.length === 0) {
      appendBotMessage(OPENING_MESSAGE);
      setTimeout(showQuickReplies, 120);
    }

    setTimeout(function () {
      pill.classList.add("felt-pill--hidden");
      pill.style.transform = "scale(1)";
      inputEl.focus();
    }, EXPAND_MS);
  }

  function closeWidget() {
    if (!isOpen) return;
    isOpen = false;
    clearTimeout(closeTimer);

    // Un-hide the pill to measure it, but keep it transparent — a display:none
    // element has no box to read.
    pill.classList.remove("felt-pill--hidden");
    pill.classList.add("felt-pill--fading");
    pill.style.transform = "scale(1)";
    var rect = pill.getBoundingClientRect();

    panel.classList.add("felt-panel--collapsed");
    panel.style.transition = expandTransition();
    panel.style.width = rect.width + "px";
    panel.style.height = rect.height + "px";
    panel.style.borderRadius = pillRadius(rect);

    // Bring the pill back just before the panel lands, so the two crossfade
    // rather than one popping in after the other has gone.
    setTimeout(function () {
      pill.classList.remove("felt-pill--fading");
    }, Math.max(0, EXPAND_MS - 180));

    closeTimer = setTimeout(function () {
      // Suppress transitions for the reset. Clearing the inline width/height
      // snaps the panel back to its stylesheet 420x680 instantly, while
      // dropping --visible starts the base 0.6s opacity fade — so without this
      // the full-size panel reappears and fades out after the collapse has
      // already finished, which reads as a flash of the window reopening.
      panel.style.transition = "none";
      panel.classList.remove("felt-panel--visible");
      panel.classList.remove("felt-panel--collapsed");
      panel.style.width = "";
      panel.style.height = "";
      panel.style.borderRadius = "";
      panel.style.opacity = "";
      panel.style.transform = "";
      void panel.offsetHeight; // flush the reset before transitions come back
      panel.style.transition = "";
    }, EXPAND_MS);
  }

  // ─── Events ────────────────────────────────────────────────────────────────
  pill.addEventListener("click", function () {
    if (isOpen) {
      closeWidget();
    } else {
      openWidget();
    }
  });

  inputEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage(inputEl.value);
    }
  });

  // Close button
  btnClose.addEventListener("click", function () {
    closeWidget();
  });

  // Back button — remove last user+bot exchange from DOM and history
  btnBack.addEventListener("click", function () {
    // Need at least one user message to go back
    var allMsgs = messagesEl.querySelectorAll(".felt-message-block");
    if (allMsgs.length <= 1) {
      // Only the opening bot message — just close
      closeWidget();
      return;
    }

    // Remove last bot message (and any calendar card inside it)
    var lastBot = null;
    var lastUser = null;
    for (var i = allMsgs.length - 1; i >= 0; i--) {
      if (!lastBot && allMsgs[i].classList.contains("bot")) lastBot = allMsgs[i];
      else if (!lastUser && allMsgs[i].classList.contains("user")) { lastUser = allMsgs[i]; break; }
    }
    if (lastBot) lastBot.remove();
    if (lastUser) lastUser.remove();

    // Pop the last assistant+user pair from conversation history
    if (conversationHistory.length > 0 && conversationHistory[conversationHistory.length - 1].role === "assistant") {
      conversationHistory.pop();
    }
    if (conversationHistory.length > 0 && conversationHistory[conversationHistory.length - 1].role === "user") {
      conversationHistory.pop();
    }

    // If calendar was shown in the removed exchange, allow it again
    if (lastBot && lastBot.querySelector(".felt-cal-card")) {
      calendarShown = false;
    }

    scrollToBottom();
  });

  // Close on Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen) closeWidget();
  });
})();
