import Link from "next/link";
import { getAllUnits } from "@/lib/curriculum/loader";

const unitIcons = ["🔤", "📝", "💬", "📐", "📚", "🗣️", "🎓"];

export default function LearnPage() {
  const units = getAllUnits();

  return (
    <div>
      <h1 className="text-3xl font-bold">Curriculum</h1>
      <p className="mt-1 text-muted">
        7 units, 43 lessons. Start from pronunciation or jump to where you need practice.
      </p>

      <div className="mt-8 space-y-4">
        {units.map((unit, i) => (
          <Link
            key={unit.slug}
            href={`/learn/${unit.slug}`}
            className="block rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-sm"
          >
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                {unitIcons[i] || "📖"}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted">
                    Unit {unit.order}
                  </span>
                </div>
                <h2 className="text-lg font-semibold">{unit.title}</h2>
                <p className="viet-text text-sm text-muted">{unit.titleVi}</p>
                <p className="mt-1 text-sm text-muted">{unit.description}</p>
                <p className="mt-2 text-xs text-muted">
                  {unit.lessons.length} lessons
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
