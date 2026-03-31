interface Props {
  address: string;
}

export function TokenChart({ address }: Props) {
  const bg = "050506";
  const src = `https://birdeye.so/tv-widget/${address}?chain=solana&viewMode=pair&chartInterval=15&chartType=CANDLE&chartTimezone=UTC&chartLeftToolbar=show&theme=dark&background=${bg}`;

  return (
    <div className="rounded-lg overflow-hidden bg-bg">
      <iframe
        key={address}
        src={src}
        className="w-full border-none block h-[280px] sm:h-[340px] lg:h-[380px]"
        loading="lazy"
        allow="clipboard-write"
      />
    </div>
  );
}
