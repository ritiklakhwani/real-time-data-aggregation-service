interface Props {
  address: string;
}

export function TokenChart({ address }: Props) {
  const src = `https://birdeye.so/tv-widget/${address}?chain=solana&viewMode=pair&chartInterval=15&chartType=CANDLE&chartTimezone=UTC&chartLeftToolbar=show&theme=dark`;

  return (
    <div className="rounded-lg border border-border overflow-hidden bg-surface-solid">
      <iframe
        key={address}
        src={src}
        className="w-full border-none block"
        style={{ height: 380 }}
        loading="lazy"
        allow="clipboard-write"
      />
    </div>
  );
}
