import { useMemo } from "react";
import type { Attendance } from "../types/attendance";

type Props = {
  attendance: Attendance[];
};

const SubjectStats = ({ attendance }: Props) => {
  const presentCount = useMemo(
    () => attendance.filter(a => a.status === "PRESENT").length,
    [attendance]
  );

  const absentCount = useMemo(
    () => attendance.filter(a => a.status === "ABSENT").length,
    [attendance]
  );

  const total = presentCount + absentCount;
  const percentage = total ? Math.round((presentCount / total) * 100) : 0;

  const getBarColor = () => {
    if (percentage >= 75) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-400";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Stat label="Attendance" value={`${percentage}%`} />
        <Stat label="Present" value={presentCount} green />
        <Stat label="Absent" value={absentCount} red />
      </div>

      {/* Attendance Bar */}
      <div className="mt-4 w-full">
        <div className="bg-neutral-800 h-5 rounded-full w-full">
          <div
            className={`${getBarColor()} h-full rounded-full transition-all`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const Stat = ({
  label,
  value,
  green,
  red,
}: {
  label: string;
  value: number | string;
  green?: boolean;
  red?: boolean;
}) => (
  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 min-w-0">
    <p className="text-neutral-400 text-sm truncate">{label}</p>
    <h2
      className={`text-3xl sm:text-4xl font-bold mt-2 truncate ${
        green ? "text-green-500" : red ? "text-red-500" : "text-white"
      }`}
    >
      {value}
    </h2>
  </div>
);

export default SubjectStats;
