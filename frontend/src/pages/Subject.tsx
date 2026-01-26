import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

type Subject = {
  id: number;
  subject_name: string;
  subject_code: string;
};

type AttendanceStatus = "PRESENT" | "ABSENT";

type Attendance = {
  id: number;
  date: string;
  status: AttendanceStatus;
};

type SubjectStats = {
  present: number;
  absent: number;
  percentage: number;
};

const GOAL = 75;

const Subject = () => {
  const { id } = useParams<{ id: string }>();

  const [subject, setSubject] = useState<Subject | null>(null);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [subjectStats, setSubjectStats] = useState<SubjectStats | null>(null);
  const [loading, setLoading] = useState(true);

  // ----------------------------
  // Initial data load
  // ----------------------------
  useEffect(() => {
    const loadSubject = async () => {
      try {
        setLoading(true);

        const [subjectRes, subjectStatsRes, attendanceRes] = await Promise.all([
          api.get(`/api/v1/subjects/${id}/`),
          api.get(`/api/v1/attendance/subject/${id}/stats/`),
          api.get(`/api/v1/attendance/subject/${id}/records/`),
        ]);

        setSubject(subjectRes.data);
        setSubjectStats(subjectStatsRes.data);
        setAttendance(attendanceRes.data ?? []);
      } catch (err) {
        console.error("Failed to load subject", err);
      } finally {
        setLoading(false);
      }
    };

    loadSubject();
  }, [id]);

  // ----------------------------
  // Derived stats (reactive & safe)
  // ----------------------------
  const presentCount = useMemo(() => {
  // Start from backend stats (baseline) if available
  const base = subjectStats?.present ?? 0;

  // Only count attendance objects that were created *after page load*
  // i.e., frontend-added records
  // a.isFrontendAdded &&
  return base + attendance.filter(a => a.status === "PRESENT").length;
}, [attendance, subjectStats]);

const absentCount = useMemo(() => {
  const base = subjectStats?.absent ?? 0;
  return base + attendance.filter(a => a.status === "ABSENT").length;
}, [attendance, subjectStats]);


  const totalClasses = presentCount + absentCount;

  const attendancePercentage = totalClasses
    ? Math.round((presentCount / totalClasses) * 100)
    : subjectStats?.percentage ?? 0;

  // ----------------------------
  // UI states
  // ----------------------------
  if (loading) {
    return <p className="text-neutral-400 p-6">Loading subject…</p>;
  }

  if (!subject) {
    return <p className="text-red-400 p-6">Subject not found</p>;
  }

  const isSafe = attendancePercentage >= GOAL;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          {subject.subject_name}
        </h1>
        <p className="text-neutral-400">{subject.subject_code}</p>
      </div>

      {/* Dashboard cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <p className="text-neutral-400 text-sm">Attendance Rate</p>
          <h2 className="text-4xl font-bold text-white mt-2">
            {attendancePercentage}%
          </h2>
          <p className="text-neutral-500 mt-1">
            Present: {presentCount} | Absent: {absentCount}
          </p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <p className="text-green-400 text-sm">Present</p>
          <h2 className="text-4xl font-bold text-green-500 mt-2">
            {presentCount}
          </h2>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <p className="text-red-400 text-sm">Absent</p>
          <h2 className="text-4xl font-bold text-red-500 mt-2">
            {absentCount}
          </h2>
        </div>
      </div>

      {/* Goal progress */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
        <div className="flex justify-between mb-2">
          <p className="text-white font-medium">Goal: {GOAL}%</p>
          <span className={isSafe ? "text-green-400" : "text-red-400"}>
            {isSafe ? "Safe" : "Critical"}
          </span>
        </div>

        <div className="w-full h-2 bg-neutral-800 rounded-full">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all"
            style={{ width: `${attendancePercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Subject;
