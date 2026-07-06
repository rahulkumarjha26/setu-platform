import { STATUS_META, type StatusKey } from "@/lib/mock-data";

interface StatusPillProps {
  status: StatusKey;
  className?: string;
}

export function StatusPill({ status, className = "" }: StatusPillProps) {
  const s = STATUS_META[status];
  if (!s) return null;
  return (
    <span className={`pill ${s.pillCls} ${className}`}>
      <span aria-hidden="true" style={{ fontSize: 13, lineHeight: 1 }}>
        {s.glyph}
      </span>
      {s.label}
    </span>
  );
}
