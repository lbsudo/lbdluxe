import type { NeonShape } from "@/lib/neon-shapes"
import { getNeonEdges } from "@/lib/neon-shapes"

interface Props {
  shape: NeonShape
  hueOffset?: number
}

export function NeonWireframe({ shape, hueOffset = 0 }: Props) {
  const edges = getNeonEdges(shape)
  return (
    <div className="neon-wireframe-wrap" aria-hidden>
      <div
        className="neon-wireframe"
        style={{ "--hue-offset": hueOffset } as React.CSSProperties}
      >
        {edges.map((e, i) => (
          <span
            key={i}
            className="neon-edge"
            style={{
              width: e.length,
              transform: `matrix3d(${e.mtx})`,
              "--edge-hue": e.hue,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  )
}
