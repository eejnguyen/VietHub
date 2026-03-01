"use client";

import Link from "next/link";

export default function ReviewPage() {
  // TODO: Fetch due review items from Supabase once connected
  const dueItems: unknown[] = [];

  if (dueItems.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-16rem)] flex-col items-center justify-center text-center">
        <p className="text-5xl">🎉</p>
        <h1 className="mt-4 text-2xl font-bold">No reviews due!</h1>
        <p className="mt-2 text-muted">
          Complete lessons to add vocabulary to your review queue.
          Items will appear here when they&apos;re due for spaced repetition review.
        </p>
        <Link
          href="/learn"
          className="mt-6 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          Go to Lessons
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Review</h1>
      <p className="mt-1 text-muted">
        {dueItems.length} items due for review.
      </p>
      {/* ReviewSession component will go here */}
    </div>
  );
}
