import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";

type AttendanceStatus = "PRESENT" | "ABSENT";

type Attendance = {
  id: number;
  date: string;
  status: AttendanceStatus;
};

type Subject = {
  id: number;
  subject_name: string;
  subject_code: string;
};

type SubjectStats = {
  present: number;
  absent: number;
  percentage: number;
};

type Props = {
  subjectId: string;
  attendance: Attendance[];
};

const GOAL = 75;

const SubjectDashBoard = ({ subjectId, attendance }: Props) => {
  const [subject, setSubject] = useState<Subject | null>(null);
  const [stats, setStats] = useState<SubjectStats | null>(null);

  useEffect(() => {
    const load = async () => {
      const [subjectRes, statsRes] = await Promise.all([
        api.get(`/api/v1/subjects/${subjectId}/`),
        api.get(`/api/v1/attendance/subject/${subjectId}/stats/`),
      ]);

      setSubject(subjectRes.data);
      setStats(statsRes.data);
    };

    load();
  }, [subjectId]);

  const presentCount = useMemo(
    () =>
      attendance.filter(a => a.status === "PRESENT").length,
    [attendance]
  );

  const absentCount = useMemo(
    () =>
      attendance.filter(a => a.status === "ABSENT").length,
    [attendance]
  );

  const total = presentCount + absentCount;

  const percentage = total
    ? Math.round((presentCount / total) * 100)
    : stats?.percentage ?? 0;

  const isSafe = percentage >= GOAL;

  if (!subject) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">
          {subject.subject_name}
        </h1>
        <p className="text-neutral-400">{subject.subject_code}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <p className="text-neutral-400 text-sm">Attendance</p>
          <h2 className="text-4xl font-bold text-white mt-2">
            {percentage}%
          </h2>
          <p className="text-neutral-500 mt-1">
            Present {presentCount} · Absent {absentCount}
          </p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <p className="text-green-400 text-sm">Present</p>
          <h2 className="text-4xl font-bold text-green-500">
            {presentCount}
          </h2>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <p className="text-red-400 text-sm">Absent</p>
          <h2 className="text-4xl font-bold text-red-500">
            {absentCount}
          </h2>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
        <div className="flex justify-between mb-2">
          <p className="text-white">Goal {GOAL}%</p>
          <span className={isSafe ? "text-green-400" : "text-red-400"}>
            {isSafe ? "Safe" : "Critical"}
          </span>
        </div>

        <div className="w-full h-2 bg-neutral-800 rounded-full">
          <div
            className="h-full bg-indigo-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default SubjectDashBoard;
