import { useMemo } from "react";

type AttendanceStatus = "PRESENT" | "ABSENT";

type Attendance = {
  id: number;
  date: string;
  status: AttendanceStatus;
};

type CalendarProps = {
  attendance: Attendance[];
  subjectId: string;
  onAttendanceUpdate: (
    date: string,
    status: AttendanceStatus | null
  ) => void;
};

const getMonthDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days: (Date | null)[] = [];

  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push(null);
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  return days;
};

// 🚫 timezone-safe formatter
const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const CalendarView = ({
  attendance,
  onAttendanceUpdate,
}: CalendarProps) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const days = getMonthDays(year, month);

  const attendanceMap = useMemo(() => {
    const map: Record<string, Attendance> = {};
    attendance.forEach(a => {
      map[a.date] = a;
    });
    return map;
  }, [attendance]);

  const handleClick = (dateKey: string) => {
    const current = attendanceMap[dateKey];

    if (!current) {
      onAttendanceUpdate(dateKey, "PRESENT");
    } else if (current.status === "PRESENT") {
      onAttendanceUpdate(dateKey, "ABSENT");
    } else {
      onAttendanceUpdate(dateKey, null); // 🔥 no class
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">
        {today.toLocaleString("default", { month: "long" })} {year}
      </h2>

      {/* Week header */}
      <div className="grid grid-cols-7 text-sm text-neutral-400">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
          <div key={d} className="text-center">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((date, idx) => {
          if (!date) return <div key={idx} />;

          const dateKey = formatDate(date);
          const record = attendanceMap[dateKey];

          const style =
            record?.status === "PRESENT"
              ? "bg-green-900/40 border-green-700"
              : record?.status === "ABSENT"
              ? "bg-red-900/40 border-red-700"
              : "bg-neutral-900 border-neutral-800 hover:border-neutral-600";

          return (
            <div
              key={dateKey}
              onClick={() => handleClick(dateKey)}
              className={`h-20 rounded-lg border cursor-pointer flex items-center justify-center transition ${style}`}
            >
              <span className="text-white font-medium">
                {date.getDate()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
