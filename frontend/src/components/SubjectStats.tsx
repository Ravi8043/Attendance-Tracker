import { useMemo } from "react";
import type { Attendance } from "../types/attendance";
import Stat from "./Stat";

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

  const percentage = useMemo(() => {
    return total ? Math.round((presentCount / total) * 100) : 0;
  }, [presentCount, total]);

  const barColor =
    percentage >= 75
      ? "bg-green-500"
      : percentage >= 50
      ? "bg-yellow-400"
      : "bg-red-500";

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="space-y-6">
        <Stat label="Attendance" value={`${percentage}%`} highlight />

        <div className="grid grid-cols-2 gap-4">
          <Stat label="Present" value={presentCount} variant="green" />
          <Stat label="Absent" value={absentCount} variant="red" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full">
        <div className="h-5 w-full rounded-full bg-neutral-800">
          <div
            className={`h-full rounded-full transition-all ${barColor}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default SubjectStats;

