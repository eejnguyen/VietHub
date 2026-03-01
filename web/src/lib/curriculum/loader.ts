import type { Lesson, UnitMeta } from "@/types/curriculum";
import { curriculum } from "@/data/curriculum";

export function getAllUnits(): UnitMeta[] {
  return curriculum.units;
}

export function getUnit(slug: string): UnitMeta | undefined {
  return curriculum.units.find((u) => u.slug === slug);
}

export async function getLesson(
  unitSlug: string,
  lessonSlug: string
): Promise<Lesson | null> {
  try {
    const mod = await import(
      `@/data/curriculum/${unitSlug}/${lessonSlug}.json`
    );
    return mod.default as Lesson;
  } catch {
    return null;
  }
}

export async function getUnitLessons(unitSlug: string): Promise<Lesson[]> {
  const unit = getUnit(unitSlug);
  if (!unit) return [];

  const lessons: Lesson[] = [];
  for (const lessonSlug of unit.lessons) {
    const lesson = await getLesson(unitSlug, lessonSlug);
    if (lesson) lessons.push(lesson);
  }
  return lessons;
}
