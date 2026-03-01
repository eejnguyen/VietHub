"use client";

import type { Lesson } from "@/types/curriculum";
import ExampleCard from "./ExampleCard";

/** Render inline markdown: **bold**, *italic*, `code` */
function renderInline(text: string, keyPrefix: string) {
  const elements: Array<string | JSX.Element> = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      elements.push(<strong key={`${keyPrefix}-${match.index}`}>{match[2]}</strong>);
    } else if (match[3]) {
      elements.push(<em key={`${keyPrefix}-${match.index}`}>{match[3]}</em>);
    } else if (match[4]) {
      elements.push(
        <code key={`${keyPrefix}-${match.index}`} className="rounded bg-border/50 px-1 py-0.5 text-sm font-mono">
          {match[4]}
        </code>
      );
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }
  return elements;
}

/** Check if a block of lines is a markdown table */
function isTable(lines: string[]): boolean {
  if (lines.length < 2) return false;
  const trimmed = lines.map((l) => l.trim());
  return (
    trimmed[0].startsWith("|") &&
    trimmed[0].endsWith("|") &&
    trimmed[1].startsWith("|") &&
    /^[\s|:-]+$/.test(trimmed[1])
  );
}

/** Render a markdown table */
function renderTable(lines: string[], key: string) {
  const trimmed = lines.map((l) => l.trim());
  const parseRow = (row: string) =>
    row.split("|").slice(1, -1).map((c) => c.trim());

  const headers = parseRow(trimmed[0]);
  const rows = trimmed.slice(2).map(parseRow);

  return (
    <div key={key} className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className="border border-border bg-background px-3 py-2 text-left font-semibold"
              >
                {renderInline(h, `${key}-th-${i}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} className="border border-border px-3 py-2">
                  <span className="viet-text">{renderInline(cell, `${key}-${ri}-${ci}`)}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Parse markdown text into React elements (paragraphs + tables) */
function renderMarkdown(text: string) {
  const paragraphs = text.split(/\n\n+/);

  return paragraphs.map((para, pi) => {
    const lines = para.split("\n");

    // Check if this block is a table
    if (isTable(lines)) {
      return renderTable(lines, `p-${pi}`);
    }

    return (
      <p key={pi} className="whitespace-pre-line">
        {renderInline(para, `p-${pi}`)}
      </p>
    );
  });
}

interface LessonContentProps {
  lesson: Lesson;
}

export default function LessonContent({ lesson }: LessonContentProps) {
  return (
    <div className="space-y-8">
      {lesson.sections.map((section, i) => {
        switch (section.type) {
          case "instruction":
            return (
              <div key={i} className="space-y-3 text-base leading-relaxed">
                {renderMarkdown(section.content)}
              </div>
            );

          case "vocabulary":
            return (
              <div key={i} className="grid gap-3 sm:grid-cols-2">
                {section.items.map((item) => (
                  <ExampleCard key={item.key} item={item} />
                ))}
              </div>
            );

          case "cultural_note":
            return (
              <div
                key={i}
                className="rounded-xl border-l-4 border-accent bg-accent-light/30 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                  Cultural Note
                </p>
                <div className="mt-1 space-y-2 text-sm leading-relaxed">
                  {renderMarkdown(section.content)}
                </div>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
