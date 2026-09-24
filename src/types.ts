// Mirrors backend/db.go's SensorStatus/WindowSample JSON shape exactly --
// no translation layer, same reasoning as the gRPC contract on the Python
// side (see pipeline docs/V1_PLAN.md).
export interface SensorStatus {
  sensor_id: string
  window_start: string // RFC3339, from Go's time.Time JSON encoding
  label: 'yes' | 'no' | 'uncertain'
  ellipse_index: number
  kano_verdict: boolean
  rf_label: 'yes' | 'no' | null
  rf_probability: number | null
}

export interface WindowSample {
  window_start: string
  label: 'yes' | 'no' | 'uncertain'
  pv: number[]
  op: number[]
}

// WS is the dashboard's only data source (no REST fetching anywhere in
// the frontend) -- both the snapshot sent on connect and every
// subsequent "update" carry the full status plus the window that
// produced it (pv/op), never just the scalar fields.
export interface SensorUpdate extends SensorStatus {
  pv?: number[]
  op?: number[]
}

export type WSMessage =
  | { type: 'snapshot'; sensors: SensorUpdate[] }
  | { type: 'update'; sensor: SensorUpdate }
