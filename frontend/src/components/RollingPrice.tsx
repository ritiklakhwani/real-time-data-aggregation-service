import { useRef, useEffect, useState, memo } from "react";

interface Props {
  value: string;
  direction: "up" | "down" | null;
}

interface CharEntry {
  ch: string;
  key: number;
  changed: boolean;
}

let seq = 0;

export const RollingPrice = memo(function RollingPrice({ value, direction }: Props) {
  const prevValue = useRef(value);
  const [entries, setEntries] = useState<CharEntry[]>(() =>
    value.split("").map((ch) => ({ ch, key: ++seq, changed: false }))
  );

  useEffect(() => {
    const prev = prevValue.current;
    prevValue.current = value;
    if (prev === value) return;

    setEntries((old) =>
      value.split("").map((ch, i) => {
        const didChange = i >= prev.length || prev[i] !== ch;
        return {
          ch,
          key: didChange ? ++seq : (old[i]?.key ?? ++seq),
          changed: didChange,
        };
      })
    );
  }, [value]);

  const rollClass =
    direction === "up" ? "digit-roll-up" : direction === "down" ? "digit-roll-down" : "";

  return (
    <>
      {entries.map(({ ch, key, changed }) =>
        changed && rollClass ? (
          <span key={key} className={`inline-block ${rollClass}`}>{ch}</span>
        ) : (
          <span key={key}>{ch}</span>
        )
      )}
    </>
  );
});
