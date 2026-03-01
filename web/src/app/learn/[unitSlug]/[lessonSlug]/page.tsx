import Link from "next/link";
import { notFound } from "next/navigation";
import { getLesson, getUnit } from "@/lib/curriculum/loader";
import LessonContent from "@/components/lesson/LessonContent";
import ExerciseRouter from "@/components/exercises/ExerciseRouter";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ unitSlug: string; lessonSlug: string }>;
}) {
  const { unitSlug, lessonSlug } = await params;
  const unit = getUnit(unitSlug);
  const lesson = await getLesson(unitSlug, lessonSlug);

  if (!unit || !lesson) notFound();

  // Determine next lesson
  const lessonIndex = unit.lessons.indexOf(lessonSlug);
  const nextLessonSlug =
    lessonIndex >= 0 && lessonIndex < unit.lessons.length - 1
      ? unit.lessons[lessonIndex + 1]
      : null;

  return (
    <div>
      <Link
        href={`/learn/${unitSlug}`}
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
      >
        &larr; {unit.title}
      </Link>

      <div className="mt-4">
        <p className="text-xs font-medium text-muted">
          Unit {unit.order} &middot; Lesson {lesson.order}
        </p>
        <h1 className="text-3xl font-bold">{lesson.title}</h1>
        <p className="viet-text text-lg text-muted">{lesson.titleVi}</p>
        <p className="mt-1 text-sm text-muted">{lesson.description}</p>
        <p className="mt-1 text-xs text-muted">
          ~{lesson.estimatedMinutes} min
        </p>
      </div>

      {/* Lesson content sections */}
      <div className="mt-8">
        <LessonContent lesson={lesson} />
      </div>

      {/* Exercises */}
      {lesson.exercises.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold">Practice</h2>
          <p className="mt-1 text-sm text-muted">
            {lesson.exercises.length} exercises to test what you learned.
          </p>
          <div className="mt-4">
            <ExerciseRouter
              exercises={lesson.exercises}
              lessonSlug={lessonSlug}
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-12 flex justify-between border-t border-border pt-6">
        <Link
          href={`/learn/${unitSlug}`}
          className="text-sm text-muted hover:text-foreground"
        >
          &larr; Back to unit
        </Link>
        {nextLessonSlug ? (
          <Link
            href={`/learn/${unitSlug}/${nextLessonSlug}`}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            Next Lesson &rarr;
          </Link>
        ) : (
          <Link
            href="/learn"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            Back to Curriculum
          </Link>
        )}
      </div>
    </div>
  );
}
