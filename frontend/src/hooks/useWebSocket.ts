import { useEffect, useRef, useState } from "react";
import { connect, disconnect, onStatusChange, onData, getStatus } from "../lib/ws";
import type { ConnectionStatus } from "../lib/ws";
import type { Token } from "../types/token";

export function useWebSocket(onUpdate: (tokens: Token[]) => void) {
  const [status, setStatus] = useState<ConnectionStatus>(getStatus);
  const ref = useRef(onUpdate);
  ref.current = onUpdate;

  useEffect(() => {
    const unsubStatus = onStatusChange(setStatus);
    const unsubData = onData((tokens) => ref.current(tokens));
    connect();
    return () => {
      unsubStatus();
      unsubData();
      disconnect();
    };
  }, []);

  return { status };
}
