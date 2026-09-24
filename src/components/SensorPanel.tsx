import type { SensorStatus, WindowSample } from '../types'
import { PhasePlot } from './PhasePlot'
import { StatusBadge } from './StatusBadge'
import { TimeSeriesChart } from './TimeSeriesChart'
import { ValveAnimation, type ValveState } from './ValveAnimation'

// Combines both detectors into one animation state -- driving the
// animation off status.label alone (classic only) silently resolved
// disagreement with RF, which is exactly what the rest of this dashboard
// deliberately never does (both labels are always shown side by side).
// "sticking"/"healthy" only when classic and RF actually agree;
// otherwise "uncertain", whether that's classic itself being unsure or
// the two detectors pointing different ways.
function combinedValveState(status: SensorStatus): ValveState {
  if (status.label === 'uncertain' || status.rf_label === null) {
    return status.label === 'yes' ? 'sticking' : status.label === 'no' ? 'healthy' : 'uncertain'
  }
  if (status.label === status.rf_label) {
    return status.label === 'yes' ? 'sticking' : 'healthy'
  }
  return 'uncertain' // classic and RF disagree
}

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
          <ValveAnimation state={combinedValveState(status)} />
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
