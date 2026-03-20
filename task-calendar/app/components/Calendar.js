"use client";

import { useState } from "react";

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function toLocalDateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function Calendar({ tasks }) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Day of week for the 1st (0=Sun…6=Sat), convert to Mon-start (0=Mon…6=Sun)
  const rawFirstDay = new Date(year, month, 1).getDay();
  const offset = (rawFirstDay + 6) % 7;

  // Build cell array: nulls for offset, then day numbers
  const cells = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Set of task date strings for O(1) lookup
  const taskDates = new Set(tasks.map((t) => t.date).filter(Boolean));

  const todayStr = toLocalDateString(today);

  function prevMonth() {
    setViewMonth(new Date(year, month - 1, 1));
  }
  function nextMonth() {
    setViewMonth(new Date(year, month + 1, 1));
  }

  const monthLabel = viewMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="text-gray-500 hover:text-gray-800 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Previous month"
        >
          ←
        </button>
        <span className="font-semibold text-gray-800">{monthLabel}</span>
        <button
          onClick={nextMonth}
          className="text-gray-500 hover:text-gray-800 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Next month"
        >
          →
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} />;
          }

          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isToday = dateStr === todayStr;
          const hasTask = taskDates.has(dateStr);

          return (
            <div key={dateStr} className="flex flex-col items-center py-1">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm
                  ${isToday ? "bg-blue-600 text-white font-semibold" : "text-gray-700 hover:bg-gray-100"}
                `}
              >
                {day}
              </div>
              {hasTask && (
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-0.5" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
