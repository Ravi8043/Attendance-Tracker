import { useMemo, useState } from "react";
import type { Attendance, AttendanceStatus } from "../types/attendance";

type CalendarProps = {
  attendance: Attendance[];
  subjectId: string;
  onAttendanceUpdate: (date: string, status: AttendanceStatus | null) => void;
};

/* ---------------- Utils ---------------- */
const getMonthDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days: (Date | null)[] = [];

  // Padding for first week (Monday=0)
  const dayOffset = (firstDay.getDay() + 6) % 7;
  for (let i = 0; i < dayOffset; i++) days.push(null);

  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  return days;
};

const formatDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;

/* ---------------- Component ---------------- */
const CalendarView = ({ attendance, onAttendanceUpdate }: CalendarProps) => {
  const today = new Date();

  // State for current displayed month/year
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  /* Attendance map for O(1) lookup */
  const attendanceMap = useMemo(() => {
    const map: Record<string, Attendance> = {};
    attendance.forEach(a => {
      map[a.date] = a;
    });
    return map;
  }, [attendance]);

  /* Calendar grid */
  const days = useMemo(() => getMonthDays(currentYear, currentMonth), [currentYear, currentMonth]);

  /* Navigation */
  const goToNextMonth = () => {
    const nextMonthDate = new Date(currentYear, currentMonth + 1, 1);
    // Prevent navigating past current month/year
    if (
      nextMonthDate.getFullYear() < today.getFullYear() ||
      (nextMonthDate.getFullYear() === today.getFullYear() &&
        nextMonthDate.getMonth() <= today.getMonth())
    ) {
      setCurrentDate(nextMonthDate);
    }
  };

  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  /* Attendance cycle */
  const handleDateClick = (date: string) => {
    const selectedDate = new Date(date);
    if (selectedDate > today) return; // lock future dates

    const record = attendanceMap[date];

    if (!record) {
      onAttendanceUpdate(date, "PRESENT");
    } else if (record.status === "PRESENT") {
      onAttendanceUpdate(date, "ABSENT");
    } else {
      onAttendanceUpdate(date, null);
    }
  };

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 rounded-lg">
        <button
          onClick={goToPrevMonth}
          className="px-3 py-1 text-lg bg-neutral-800 rounded hover:bg-neutral-700"
        >
          ◀
        </button>
        <h3 className="text-2xl font-bold text-white px-4 py-2">
          {currentDate.toLocaleString("default", { month: "long" })} {currentYear}
        </h3>
        <button
          onClick={goToNextMonth}
          className={`px-3 py-1 text-lg bg-neutral-800 rounded hover:bg-neutral-700 ${
            currentYear === today.getFullYear() && currentMonth === today.getMonth()
              ? "opacity-50 cursor-not-allowed hover:bg-neutral-800"
              : ""
          }`}
          disabled={currentYear === today.getFullYear() && currentMonth === today.getMonth()}
        >
          ▶
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 text-center font-medium text-neutral-400">
        {weekDays.map(day => (
          <div key={day} className="py-1">{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((date, index) => {
          if (!date) return <div key={index} />;

          const key = formatDate(date);
          const record = attendanceMap[key];
          const isFuture = date > today;

          const cellStyle = isFuture
            ? "bg-neutral-900/30 border-neutral-700 cursor-not-allowed"
            : record?.status === "PRESENT"
            ? "bg-green-900/40 border-green-700"
            : record?.status === "ABSENT"
            ? "bg-red-900/40 border-red-700"
            : "bg-neutral-900 border-neutral-800 hover:border-neutral-600";

          return (
            <div
              key={key}
              onClick={() => !isFuture && handleDateClick(key)}
              className={`h-20 rounded-lg border flex items-center justify-center transition ${cellStyle}`}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
