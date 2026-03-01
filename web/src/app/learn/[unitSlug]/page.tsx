import Link from "next/link";
import { notFound } from "next/navigation";
import { getUnit } from "@/lib/curriculum/loader";

export default async function UnitPage({
  params,
}: {
  params: Promise<{ unitSlug: string }>;
}) {
  const { unitSlug } = await params;
  const unit = getUnit(unitSlug);

  if (!unit) notFound();

  return (
    <div>
      <Link
        href="/learn"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
      >
        &larr; All Units
      </Link>

      <div className="mt-4">
        <p className="text-xs font-medium text-muted">Unit {unit.order}</p>
        <h1 className="text-3xl font-bold">{unit.title}</h1>
        <p className="viet-text text-lg text-muted">{unit.titleVi}</p>
        <p className="mt-2 text-muted">{unit.description}</p>
      </div>

      <div className="mt-8 space-y-3">
        {unit.lessons.map((lessonSlug, i) => {
          const lessonTitle = lessonSlug
            .replace("lesson-", "")
            .replace(/^\d+-/, "")
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");

          return (
            <Link
              key={lessonSlug}
              href={`/learn/${unitSlug}/${lessonSlug}`}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-sm"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {i + 1}
              </span>
              <div>
                <h3 className="font-medium">{lessonTitle}</h3>
                <p className="text-xs text-muted">{lessonSlug}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
