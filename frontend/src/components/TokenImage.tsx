import { useState } from "react";

interface Props {
  src: string;
  alt: string;
  size?: number;
}

export function TokenImage({ src, alt, size = 24 }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className="rounded-full bg-surface-raised flex items-center justify-center text-text-tertiary text-[10px] font-semibold shrink-0"
        style={{ width: size, height: size }}
      >
        {alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {!loaded && (
        <div
          className="absolute inset-0 rounded-full shimmer"
          style={{ width: size, height: size }}
        />
      )}
      <img
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={`rounded-full transition-opacity duration-200 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
