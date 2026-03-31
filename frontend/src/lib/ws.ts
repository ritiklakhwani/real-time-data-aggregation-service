import type { Token } from "../types/token";

export type ConnectionStatus = "connecting" | "connected" | "disconnected";
type StatusCb = (s: ConnectionStatus) => void;
type DataCb = (tokens: Token[]) => void;

let socket: WebSocket | null = null;
let status: ConnectionStatus = "disconnected";
let reconnectAttempt = 0;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let intentionalClose = false;

const statusListeners = new Set<StatusCb>();
const dataListeners = new Set<DataCb>();

function setStatus(s: ConnectionStatus) {
  status = s;
  statusListeners.forEach((cb) => cb(s));
}

function handleMessage(e: MessageEvent) {
  try {
    const msg = JSON.parse(e.data);
    if (msg.type === "initial_data" || msg.type === "price_update") {
      const tokens: Token[] = Array.isArray(msg.data) ? msg.data : [msg.data];
      dataListeners.forEach((cb) => cb(tokens));
    }
  } catch {
    /* ignore */
  }
}

function scheduleReconnect() {
  if (reconnectTimer) return;
  const delay = Math.min(1000 * Math.pow(2, reconnectAttempt), 30000);
  reconnectAttempt++;
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connect();
  }, delay);
}

export function connect() {
  if (socket?.readyState === WebSocket.OPEN || socket?.readyState === WebSocket.CONNECTING) return;
  intentionalClose = false;
  setStatus("connecting");

  socket = new WebSocket("ws://localhost:3002");
  socket.onopen = () => {
    reconnectAttempt = 0;
    setStatus("connected");
  };
  socket.onmessage = handleMessage;
  socket.onclose = () => {
    setStatus("disconnected");
    if (!intentionalClose) scheduleReconnect();
  };
  socket.onerror = () => socket?.close();
}

export function disconnect() {
  intentionalClose = true;
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  reconnectAttempt = 0;
  socket?.close();
  socket = null;
  setStatus("disconnected");
}

export function getStatus(): ConnectionStatus {
  return status;
}

export function onStatusChange(cb: StatusCb): () => void {
  statusListeners.add(cb);
  return () => statusListeners.delete(cb);
}

export function onData(cb: DataCb): () => void {
  dataListeners.add(cb);
  return () => dataListeners.delete(cb);
}
