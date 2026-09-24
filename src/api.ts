// The dashboard's only data source is the WebSocket (see hooks/useSensors.ts)
// -- the snapshot on connect and every update carry full sensor status
// plus pv/op, so there's no REST call to make here. This file just builds
// the WS URL. (The backend's REST endpoints still exist and work; the
// frontend just doesn't use them.)
export function wsURL(): string {
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${proto}//${window.location.host}/ws`
}
