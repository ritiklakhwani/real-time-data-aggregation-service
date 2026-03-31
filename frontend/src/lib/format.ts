export function formatNumber(n: number): string {
  if (n === 0) return "0";
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + "B";
  if (abs >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (abs >= 1_000) return (n / 1_000).toFixed(1) + "K";
  if (abs >= 1) return n.toFixed(2);
  return n.toFixed(2);
}

export function formatPrice(n: number): string {
  if (n === 0) return "0";
  if (n >= 1_000) return formatNumber(n);
  if (n >= 1) return n.toFixed(4);
  if (n >= 0.001) return n.toFixed(6);
  if (n >= 0.000001) return n.toFixed(8);
  return n.toExponential(2);
}

export function formatCompact(n: number): string {
  if (n === 0) return "0";
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (abs >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toFixed(0);
}

export function timeAgo(dateStr: string | undefined): string {
  if (!dateStr) return "--";
  const then = new Date(dateStr).getTime();
  if (isNaN(then)) {
    const num = Number(dateStr);
    if (isNaN(num)) return "--";
    return timeAgoFromMs(num);
  }
  return timeAgoFromMs(then);
}

function timeAgoFromMs(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 0) return "just now";
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d`;
  return `${Math.floor(days / 30)}mo`;
}

export function truncateAddress(addr: string): string {
  if (addr.length <= 12) return addr;
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}
