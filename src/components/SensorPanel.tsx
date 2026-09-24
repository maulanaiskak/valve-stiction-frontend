import { useEffect, useState } from 'react'
import type { SensorStatus, WindowSample } from '../types'
import { PhasePlot } from './PhasePlot'
import { StatusBadge } from './StatusBadge'
import { TimeSeriesChart } from './TimeSeriesChart'
import { ValveAnimation } from './ValveAnimation'

const MAX_WINDOWS = 10

export function SensorPanel({
  status,
  latestWindow,
}: {
  status: SensorStatus
  latestWindow?: WindowSample
}) {
  const [windows, setWindows] = useState<WindowSample[]>([])

  // WS-only: no REST call here. On sensor switch, seed history with
  // whatever the hook already has for this sensor (from the WS snapshot
  // or an earlier update) -- if nothing's arrived yet, the panel starts
  // empty and fills in as pushes come, same as a fresh connection would.
  useEffect(() => {
    setWindows(latestWindow ? [latestWindow] : [])
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only reset on sensor switch, not on every latestWindow change
  }, [status.sensor_id])

  // Append each WS-pushed window as it arrives.
  useEffect(() => {
    if (!latestWindow) return
    setWindows((prev) => {
      if (prev.length > 0 && prev[prev.length - 1].window_start === latestWindow.window_start) {
        return prev // already have it
      }
      return [...prev, latestWindow].slice(-MAX_WINDOWS)
    })
  }, [latestWindow])

  const pv = windows.flatMap((w) => w.pv)
  const op = windows.flatMap((w) => w.op)
  const latest = windows[windows.length - 1]

  return (
    <section className="sensor-panel">
      <header className="sensor-panel-header">
        <h2>{status.sensor_id}</h2>
        <div className="badges">
          <StatusBadge label={status.label} prefix="classic" />
          {status.rf_label && (
            <StatusBadge label={status.rf_label} prefix={`RF ${(status.rf_probability! * 100).toFixed(0)}%`} />
          )}
        </div>
      </header>

      <div className="sensor-panel-grid">
        <div>
          <h3>Valve</h3>
          <ValveAnimation sticking={status.label === 'yes'} />
          <dl className="metrics">
            <dt>Ellipse index</dt>
            <dd>{status.ellipse_index.toFixed(3)}</dd>
            <dt>Kano verdict</dt>
            <dd>{status.kano_verdict ? 'stick-slip pattern' : 'no pattern'}</dd>
            <dt>Last window</dt>
            <dd>{new Date(status.window_start).toLocaleTimeString()}</dd>
          </dl>
        </div>

        <div>
          <h3>PV vs OP (phase plot)</h3>
          {latest ? <PhasePlot pv={latest.pv} op={latest.op} /> : <p className="empty">No data yet</p>}
        </div>

        <div>
          <h3>PV over time</h3>
          {pv.length > 0 ? <TimeSeriesChart values={pv} label="PV" color="#2563eb" /> : <p className="empty">No data yet</p>}
        </div>

        <div>
          <h3>OP over time</h3>
          {op.length > 0 ? <TimeSeriesChart values={op} label="OP" color="#d97706" /> : <p className="empty">No data yet</p>}
        </div>
      </div>
    </section>
  )
}
