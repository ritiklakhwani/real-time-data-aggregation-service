import type { ConnectionStatus as Status } from "../lib/ws";

interface Props {
  status: Status;
}

export function ConnectionStatus({ status }: Props) {
  const isLive = status === "connected";
  const isConnecting = status === "connecting";

  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`w-[5px] h-[5px] rounded-full ${
          isLive
            ? "bg-positive live-dot"
            : isConnecting
              ? "bg-yellow-500 animate-pulse"
              : "bg-text-tertiary"
        }`}
      />
      <span
        className={`text-[11px] font-medium ${
          isLive
            ? "text-positive/80"
            : isConnecting
              ? "text-yellow-500/70"
              : "text-text-tertiary"
        }`}
      >
        {isLive ? "Live" : isConnecting ? "Connecting" : "Offline"}
      </span>
    </div>
  );
}
