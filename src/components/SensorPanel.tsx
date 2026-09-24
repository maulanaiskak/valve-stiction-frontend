import type { SensorStatus, WindowSample } from '../types'
import { PhasePlot } from './PhasePlot'
import { StatusBadge } from './StatusBadge'
import { TimeSeriesChart } from './TimeSeriesChart'
import { ValveAnimation } from './ValveAnimation'

// Moving time window, not an accumulating history: each push replaces the
// displayed window with the next one (same fixed size, WindowSize
// samples), matching the original thesis's subscribe.py (a maxlen=103
// deque -- old samples drop off as new ones arrive, the window slides,
// it never just grows). No local state needed here at all -- this
// component is purely reactive to whatever latestWindow currently is.
export function SensorPanel({
  status,
  latestWindow,
}: {
  status: SensorStatus
  latestWindow?: WindowSample
}) {
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
          {latestWindow ? (
            <PhasePlot pv={latestWindow.pv} op={latestWindow.op} />
          ) : (
            <p className="empty">No data yet</p>
          )}
        </div>

        <div>
          <h3>PV over time window</h3>
          {latestWindow ? (
            <TimeSeriesChart values={latestWindow.pv} label="PV" color="#2563eb" />
          ) : (
            <p className="empty">No data yet</p>
          )}
        </div>

        <div>
          <h3>OP over time window</h3>
          {latestWindow ? (
            <TimeSeriesChart values={latestWindow.op} label="OP" color="#d97706" />
          ) : (
            <p className="empty">No data yet</p>
          )}
        </div>
      </div>
    </section>
  )
}
