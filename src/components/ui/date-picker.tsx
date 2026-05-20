import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type DatePickerProps = {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function DatePicker({ value=Date.now.toString(), onChange, placeholder = "Pick a date" }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => parseDateValue(value) ?? new Date());
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedDate = parseDateValue(value);
  const calendarDays = useMemo(() => getCalendarDays(visibleMonth), [visibleMonth]);

  useEffect(() => {
    const nextDate = parseDateValue(value);
    if (nextDate) {
      setVisibleMonth(nextDate);
    }
  }, [value]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (rootRef.current?.contains(event.target as Node)) {
        return;
      }

      setOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [open]);

  const monthLabel = new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric"
  }).format(visibleMonth);

  return (
    <div className="relative" ref={rootRef}>
      <div className="flex gap-2">
        <button
          className={cn(
            "inline-flex h-9 min-w-0 flex-1 items-center justify-start gap-2 rounded-md border border-zinc-300 bg-white px-3 text-left text-sm outline-none hover:bg-zinc-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900 dark:focus:ring-blue-950",
            !selectedDate && "text-zinc-500 dark:text-zinc-400"
          )}
          onClick={() => setOpen((current) => !current)}
          type="button"
        >
          <CalendarDays className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
          <span className="truncate">
            {selectedDate ? formatDisplayDate(selectedDate) : placeholder}
          </span>
        </button>
        {selectedDate ? (
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-300 bg-white text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
            onClick={() => onChange("")}
            title="Clear due date"
            type="button"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Clear due date</span>
          </button>
        ) : null}
      </div>

      {open ? (
        <div className="absolute left-0 top-11 z-50 w-72 rounded-md border border-zinc-200 bg-white p-3 shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-3 flex items-center justify-between">
            <button
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
              onClick={() => setVisibleMonth((month) => addMonths(month, -1))}
              type="button"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Previous month</span>
            </button>
            <p className="text-sm font-medium text-zinc-950 dark:text-zinc-100">{monthLabel}</p>
            <button
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
              onClick={() => setVisibleMonth((month) => addMonths(month, 1))}
              type="button"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Next month</span>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {weekdays.map((day) => (
              <div className="py-1" key={day}>
                {day}
              </div>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1">
            {calendarDays.map((date) => {
              const selected = selectedDate ? isSameDate(date, selectedDate) : false;
              const inCurrentMonth = date.getMonth() === visibleMonth.getMonth();

              return (
                <button
                  className={cn(
                    "h-8 rounded-md text-sm text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900",
                    !inCurrentMonth && "text-zinc-400 dark:text-zinc-600",
                    selected &&
                      "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
                  )}
                  key={toDateValue(date)}
                  onClick={() => {
                    onChange(toDateValue(date));
                    setOpen(false);
                  }}
                  type="button"
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function parseDateValue(value?: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function toDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDisplayDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function getCalendarDays(month: Date) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

function isSameDate(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}
