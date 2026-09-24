import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

// X-axis is position within the current time window (0..WindowSize-1),
// not a running/global index -- each new window replaces the previous
// one wholesale (see SensorPanel), so this axis visually resets every
// push instead of scrolling forward indefinitely. That's the moving-
// window behavior itself: the window's *content* slides forward in real
// time between pushes, the chart just shows one window at a time.
export function TimeSeriesChart({
  values,
  label,
  color,
}: {
  values: number[]
  label: string
  color: string
}) {
  const data = values.map((v, timeInWindow) => ({ timeInWindow, v }))

  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 16, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color)" />
        <XAxis
          dataKey="timeInWindow"
          stroke="var(--axis-color)"
          label={{ value: 'time in window (samples)', position: 'insideBottom', offset: -8, fill: 'var(--axis-color)', fontSize: 11 }}
        />
        <YAxis stroke="var(--axis-color)" width={40} />
        <Tooltip
          formatter={(v) => [typeof v === 'number' ? v.toFixed(2) : v, label]}
          labelFormatter={(t) => `t=${t}`}
        />
        <Line type="monotone" dataKey="v" stroke={color} dot={false} strokeWidth={1.5} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
