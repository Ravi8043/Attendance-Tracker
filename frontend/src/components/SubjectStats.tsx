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

  const { barColor, statusText } = useMemo(() => {
    if (percentage >= 75) return { barColor: "#16a34a", statusText: "Safe" }; // green
    if (percentage >= 50) return { barColor: "#facc15", statusText: "Warning" }; // yellow
    return { barColor: "#ef4444", statusText: "Critical" }; // red
  }, [percentage]);

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

      {/* Rectangular Progress Bar */}
      <div className="w-full bg-gray-200 rounded-xl h-6 overflow-hidden mt-4">
        <div
          className="h-full rounded-xl transition-all duration-500"
          style={{
            width: `${percentage}%`,
            backgroundColor: barColor,
          }}
        />
      </div>

      {/* Optional status text */}
      <p className="text-center font-medium mt-2">{statusText}</p>
    </div>
  );
};

export default SubjectStats;
