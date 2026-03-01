import Link from "next/link";
import { getAllUnits } from "@/lib/curriculum/loader";

export default function DashboardPage() {
  const units = getAllUnits();
  const totalLessons = units.reduce((sum, u) => sum + u.lessons.length, 0);

  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-1 text-muted">Track your Vietnamese learning progress.</p>

      {/* Stats cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs font-medium text-muted uppercase tracking-wide">
            Total Lessons
          </p>
          <p className="mt-1 text-3xl font-bold">{totalLessons}</p>
          <p className="text-xs text-muted">across {units.length} units</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs font-medium text-muted uppercase tracking-wide">
            Review Due
          </p>
          <p className="mt-1 text-3xl font-bold">0</p>
          <p className="text-xs text-muted">vocabulary items</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs font-medium text-muted uppercase tracking-wide">
            Current Streak
          </p>
          <p className="mt-1 text-3xl font-bold">0</p>
          <p className="text-xs text-muted">days</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link
            href="/learn/unit-1-pronunciation/lesson-01-alphabet"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            Start First Lesson
          </Link>
          <Link
            href="/review"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-border/30"
          >
            Review Vocabulary
          </Link>
          <Link
            href="/pronunciation"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-border/30"
          >
            Pronunciation Guide
          </Link>
        </div>
      </div>

      {/* Unit progress */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">Units</h2>
        <div className="mt-3 space-y-2">
          {units.map((unit) => (
            <Link
              key={unit.slug}
              href={`/learn/${unit.slug}`}
              className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-primary/30"
            >
              <div>
                <span className="text-xs text-muted">Unit {unit.order}</span>
                <p className="font-medium">{unit.title}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted">
                  0/{unit.lessons.length}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
