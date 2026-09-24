import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

// PV vs OP -- the same shape the ellipse-fit detector scores (a healthy
// valve traces a near-diagonal line; stiction opens it into a fat loop).
// See valve-stiction-ml classic.py's ellipse_stiction_index. Line only, no
// point markers -- with 100 samples per window, dots at every point
// clutter the plot and hide the loop/line shape that's actually the
// diagnostic signal here.
export function PhasePlot({ pv, op }: { pv: number[]; op: number[] }) {
  const data = pv.map((v, i) => ({ op: op[i], pv: v }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color)" />
        <XAxis type="number" dataKey="op" name="OP" stroke="var(--axis-color)" />
        <YAxis type="number" dataKey="pv" name="PV" stroke="var(--axis-color)" />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(v) => (typeof v === 'number' ? v.toFixed(2) : v)} />
        <Line
          type="linear"
          dataKey="pv"
          stroke="var(--accent-color)"
          dot={false}
          strokeWidth={1.5}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
