import { useEffect, useState } from 'react'
import { wsURL } from '../api'
import type { SensorStatus, WindowSample, WSMessage } from '../types'

interface UseSensorsResult {
  sensors: SensorStatus[]
  // Latest window per sensor (pv/op), from the WS snapshot/update --
  // the only data source the dashboard has; there's no REST fallback.
  latestWindows: Record<string, WindowSample>
}

function splitUpdate(sensor: SensorStatus & { pv?: number[]; op?: number[] }) {
  const { pv, op, ...status } = sensor
  const window: WindowSample | undefined =
    pv && op ? { window_start: status.window_start, label: status.label, pv, op } : undefined
  return { status, window }
}

// WS-only: the snapshot sent right after connecting and every subsequent
// "update" message both carry full sensor status plus that sensor's
// latest window (pv/op) -- see backend/delivery/ws/hub.go. No REST calls
// anywhere in this hook; until the WS connects there's simply nothing to
// show yet, which App.tsx renders as "waiting for sensors".
export function useSensors(): UseSensorsResult {
  const [sensors, setSensors] = useState<Record<string, SensorStatus>>({})
  const [latestWindows, setLatestWindows] = useState<Record<string, WindowSample>>({})

  useEffect(() => {
    let ws: WebSocket
    let reconnectTimer: ReturnType<typeof setTimeout>

    function connect() {
      ws = new WebSocket(wsURL())
      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data) as WSMessage
        if (msg.type === 'snapshot') {
          const nextSensors: Record<string, SensorStatus> = {}
          const nextWindows: Record<string, WindowSample> = {}
          for (const sensor of msg.sensors) {
            const { status, window } = splitUpdate(sensor)
            nextSensors[status.sensor_id] = status
            if (window) nextWindows[status.sensor_id] = window
          }
          setSensors(nextSensors)
          setLatestWindows((prev) => ({ ...prev, ...nextWindows }))
        } else if (msg.type === 'update') {
          const { status, window } = splitUpdate(msg.sensor)
          setSensors((prev) => ({ ...prev, [status.sensor_id]: status }))
          if (window) {
            setLatestWindows((prev) => ({ ...prev, [status.sensor_id]: window }))
          }
        }
      }
      ws.onclose = () => {
        reconnectTimer = setTimeout(connect, 2000)
      }
    }
    connect()

    return () => {
      clearTimeout(reconnectTimer)
      ws?.close()
    }
  }, [])

  return {
    sensors: Object.values(sensors).sort((a, b) => a.sensor_id.localeCompare(b.sensor_id)),
    latestWindows,
  }
}
