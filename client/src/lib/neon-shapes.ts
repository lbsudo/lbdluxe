export type NeonShape =
  | "cube"
  | "octahedron"
  | "tetrahedron"
  | "pyramid"
  | "prism"
  | "globe"

export interface NeonEdge {
  mtx: string
  length: number
  hue: number
}

const sub = (a: number[], b: number[]) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const add = (a: number[], b: number[]) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: number[], s: number) => [a[0] * s, a[1] * s, a[2] * s]
const cross = (a: number[], b: number[]) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const len = (a: number[]) => Math.hypot(...a)
const norm = (a: number[]) => mul(a, 1 / len(a))
const dot = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

const SCALE = 26

function edgeMatrix(a: number[], b: number[]) {
  const d = norm(sub(b, a))
  const L = len(sub(b, a)) * SCALE
  const m = mul(add(a, b), 0.5 * SCALE)
  const up = Math.abs(d[1]) > 0.9 ? [1, 0, 0] : [0, 1, 0]
  const p = norm(cross(d, up))
  const n = norm(cross(d, p))
  const t = sub(sub(m, mul(d, L / 2)), p)
  const c = [...d, ...p, ...n]
  // matrix3d() takes 16 values in COLUMN-major order: three basis vectors
  // (each followed by 0) plus the translation column (followed by 1).
  const mtx = [c[0], c[1], c[2], 0, c[3], c[4], c[5], 0, c[6], c[7], c[8], 0, t[0], t[1], t[2], 1]
  return {
    mtx: mtx.map((v) => Number(v).toFixed(5)).join(","),
    length: Number(L.toFixed(3)),
  }
}

function build(verts: number[][], pairs: number[][]) {
  return pairs.map(([i, j]) => edgeMatrix(verts[i], verts[j]))
}

function cubeEdges() {
  const v: number[][] = []
  for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) v.push([x, y, z])
  const pairs: number[][] = []
  for (let a = 0; a < 8; a++)
    for (let b = a + 1; b < 8; b++) {
      const diff = v[a].reduce((s, x, i) => s + Math.abs(x - v[b][i]), 0)
      if (diff === 2) pairs.push([a, b])
    }
  return build(v, pairs)
}

function octahedronEdges() {
  const v = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]
  const pairs: number[][] = []
  for (let a = 0; a < 6; a++)
    for (let b = a + 1; b < 6; b++) if (dot(v[a], v[b]) !== -1) pairs.push([a, b])
  return build(v, pairs)
}

function tetrahedronEdges() {
  const v = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]]
  const pairs: number[][] = []
  for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) pairs.push([a, b])
  return build(v, pairs)
}

function pyramidEdges() {
  const v = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [0, 0, 1]]
  const pairs: number[][] = []
  for (let i = 0; i < 4; i++) pairs.push([i, 4])
  for (let a = 0; a < 4; a++) pairs.push([a, (a + 1) % 4])
  return build(v, pairs)
}

function prismEdges() {
  const v: number[][] = []
  for (const z of [-1, 1]) for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2
    v.push([Math.cos(a), Math.sin(a), z])
  }
  const pairs: number[][] = []
  for (let i = 0; i < 6; i++) {
    pairs.push([i, (i + 1) % 6])
    pairs.push([i + 6, (i + 7) % 12])
    pairs.push([i, i + 6])
  }
  return build(v, pairs)
}

function globeEdges() {
  const SEG = 16
  const pts: number[][] = []
  const pairs: number[][] = []
  const push = (p: number[]) => {
    pts.push(p)
    return pts.length - 1
  }
  for (const lat of [-60, -30, 0, 30, 60]) {
    const th = (lat * Math.PI) / 180
    const r = Math.cos(th)
    const y = Math.sin(th)
    const idx: number[] = []
    for (let i = 0; i < SEG; i++) {
      const a = (i / SEG) * Math.PI * 2
      idx.push(push([r * Math.cos(a), y, r * Math.sin(a)]))
    }
    for (let i = 0; i < SEG; i++) pairs.push([idx[i], idx[(i + 1) % SEG]])
  }
  for (const lon of [0, 45, 90, 135]) {
    const ph = (lon * Math.PI) / 180
    const cp = Math.cos(ph)
    const sp = Math.sin(ph)
    const idx: number[] = []
    for (let i = 0; i <= SEG; i++) {
      const th = (-90 + (180 * i) / SEG) * Math.PI / 180
      const r = Math.cos(th)
      const y = Math.sin(th)
      idx.push(push([r * cp, y, r * sp]))
    }
    for (let i = 0; i < SEG; i++) pairs.push([idx[i], idx[i + 1]])
  }
  return build(pts, pairs)
}

const cache = new Map<NeonShape, NeonEdge[]>()

export function getNeonEdges(shape: NeonShape): NeonEdge[] {
  let edges = cache.get(shape)
  if (!edges) {
    const raw =
      shape === "cube"
        ? cubeEdges()
        : shape === "octahedron"
          ? octahedronEdges()
          : shape === "tetrahedron"
            ? tetrahedronEdges()
            : shape === "pyramid"
              ? pyramidEdges()
              : shape === "prism"
                ? prismEdges()
                : globeEdges()
    edges = raw.map((e, i) => ({ mtx: e.mtx, length: e.length, hue: (i * 360) / raw.length }))
    cache.set(shape, edges)
  }
  return edges
}