"use client";

const TONE_PATHS: Record<string, { northern: string; southern: string; color: string }> = {
  ngang: {
    northern: "M 10,50 L 190,50",
    southern: "M 10,55 L 190,55",
    color: "#3b82f6", // blue
  },
  sac: {
    northern: "M 10,65 Q 100,40 190,20",
    southern: "M 10,60 Q 100,35 190,15",
    color: "#ef4444", // red
  },
  huyen: {
    northern: "M 10,40 Q 100,60 190,75",
    southern: "M 10,45 Q 100,65 190,80",
    color: "#22c55e", // green
  },
  hoi: {
    northern: "M 10,40 Q 60,70 100,65 Q 140,55 190,30",
    southern: "M 10,40 Q 60,70 100,65 Q 140,55 190,30",
    color: "#a855f7", // purple
  },
  nga: {
    northern: "M 10,40 Q 50,55 80,60 L 90,30 Q 140,40 190,20",
    southern: "M 10,40 Q 60,70 100,65 Q 140,55 190,30", // same as hỏi in Southern
    color: "#f97316", // orange
  },
  nang: {
    northern: "M 10,35 Q 100,70 150,85 L 160,90",
    southern: "M 10,40 Q 100,75 140,88 L 150,90",
    color: "#64748b", // slate
  },
};

const TONE_LABELS: Record<string, { name: string; mark: string; example: string }> = {
  ngang: { name: "Ngang (level)", mark: "—", example: "ma" },
  sac: { name: "Sắc (rising)", mark: "´", example: "má" },
  huyen: { name: "Huyền (falling)", mark: "`", example: "mà" },
  hoi: { name: "Hỏi (dipping)", mark: "ˀ", example: "mả" },
  nga: { name: "Ngã (broken)", mark: "˜", example: "mã" },
  nang: { name: "Nặng (heavy)", mark: ".", example: "mạ" },
};

interface ToneDiagramProps {
  tone?: string;
  dialect?: "southern" | "northern";
  showAll?: boolean;
}

export default function ToneDiagram({
  tone,
  dialect = "southern",
  showAll = false,
}: ToneDiagramProps) {
  const tones = showAll
    ? Object.keys(TONE_PATHS)
    : tone
    ? [tone]
    : [];

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
        Tone Contours ({dialect === "southern" ? "Southern" : "Northern"})
      </p>

      <svg viewBox="0 0 200 100" className="w-full max-w-md" aria-hidden="true">
        {/* Grid lines */}
        <line x1="10" y1="10" x2="10" y2="90" stroke="#e5e7eb" strokeWidth="0.5" />
        <line x1="10" y1="10" x2="190" y2="10" stroke="#e5e7eb" strokeWidth="0.5" />
        <line x1="10" y1="50" x2="190" y2="50" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="4" />
        <line x1="10" y1="90" x2="190" y2="90" stroke="#e5e7eb" strokeWidth="0.5" />
        {/* Labels */}
        <text x="2" y="14" fontSize="6" fill="#9ca3af">High</text>
        <text x="2" y="53" fontSize="6" fill="#9ca3af">Mid</text>
        <text x="2" y="94" fontSize="6" fill="#9ca3af">Low</text>

        {/* Tone paths */}
        {tones.map((t) => {
          const path = TONE_PATHS[t];
          if (!path) return null;
          const d = dialect === "southern" ? path.southern : path.northern;
          return (
            <path
              key={t}
              d={d}
              stroke={path.color}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-3">
        {tones.map((t) => {
          const label = TONE_LABELS[t];
          const path = TONE_PATHS[t];
          if (!label || !path) return null;

          const isMerged = dialect === "southern" && (t === "hoi" || t === "nga");

          return (
            <div key={t} className="flex items-center gap-1.5 text-xs">
              <span
                className="inline-block h-2 w-4 rounded-full"
                style={{ backgroundColor: path.color }}
              />
              <span className="font-medium">{label.name}</span>
              <span className="viet-text text-muted">{label.example}</span>
              {isMerged && (
                <span className="rounded bg-accent-light px-1 text-[10px] text-accent">
                  merged
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
