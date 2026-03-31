import { ConnectionStatus } from "./ConnectionStatus";
import type { ConnectionStatus as Status } from "../lib/ws";

interface Props {
  wsStatus: Status;
}

export function Header({ wsStatus }: Props) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-11 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 397.7 311.7" fill="none" xmlns="http://www.w3.org/2000/svg">
            <linearGradient id="sol-a" x1="360.879" y1="351.455" x2="141.213" y2="-69.294" gradientUnits="userSpaceOnUse" gradientTransform="translate(0 -33)">
              <stop offset="0" stopColor="#00FFA3"/>
              <stop offset="1" stopColor="#DC1FFF"/>
            </linearGradient>
            <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" fill="url(#sol-a)"/>
            <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" fill="url(#sol-a)"/>
            <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" fill="url(#sol-a)"/>
          </svg>
          <span className="text-[12px] font-semibold text-text-primary tracking-[-0.2px]">
            Solana Markets
          </span>
        </div>
        <ConnectionStatus status={wsStatus} />
      </div>
    </header>
  );
}
