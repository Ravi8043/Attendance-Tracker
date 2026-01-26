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
  total: number;
  percentage: number;
};

const SubjectPage = () => {
  const { id } = useParams<{ id: string }>();
  const today = new Date().toISOString().split("T")[0];

  const [subject, setSubject] = useState<Subject | null>(null);
  const [todayAttendance, setTodayAttendance] = useState<Attendance[]>([]);
  const [stats, setStats] = useState<SubjectStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  // ----------------------------
  // Initial load
  // ----------------------------
  const loadPageData = async () => {
    try {
      setLoading(true);

      const [subjectRes, statsRes, todayRes] = await Promise.all([
        api.get(`/api/v1/subjects/${id}/`),
        api.get(`/api/v1/attendance/subject/${id}/stats/`),
        api.get(`/api/v1/attendance/subject/${id}/records/?date=${today}`),
      ]);

      setSubject(subjectRes.data);
      setStats(statsRes.data);
      setTodayAttendance(todayRes.data);
    } catch (err) {
      console.error("Failed to load subject page", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPageData();
  }, [id]);

  // ----------------------------
  // Derived stats (reactive)
  // ----------------------------
  const presentCount = useMemo(() => {
    if (todayAttendance.length) {
      return todayAttendance.filter(a => a.status === "PRESENT").length;
    }
    return stats?.present || 0;
  }, [todayAttendance, stats]);

  const absentCount = useMemo(() => {
    if (todayAttendance.length) {
      return todayAttendance.filter(a => a.status === "ABSENT").length;
    }
    return stats?.absent || 0;
  }, [todayAttendance, stats]);

  const totalClasses = presentCount + absentCount;

  const attendancePercentage = totalClasses
    ? Math.round((presentCount / totalClasses) * 100)
    : stats?.percentage || 0;

  const goal = 75;

  // ----------------------------
  // Mark / Update attendance
  // ----------------------------
  const markAttendance = async (status: AttendanceStatus) => {
    if (!subject) return;

    try {
      setMarking(true);

      // optimistic UI (today only)
      setTodayAttendance([
        {
          id: -1, // temp ID (never trust this)
          date: today,
          status,
        },
      ]);

      await api.post("/api/v1/attendance/mark/", {
        subject: subject.id,
        date: today,
        status,
      });

      // refresh stats (backend truth)
      const statsRes = await api.get(
        `/api/v1/attendance/subject/${id}/stats/`
      );
      setStats(statsRes.data);
    } catch (err) {
      console.error("Attendance update failed", err);
      loadPageData(); // rollback
    } finally {
      setMarking(false);
    }
  };

  if (loading) {
    return <p className="text-neutral-400 p-6">Loading subject...</p>;
  }

  const alreadyMarkedToday = todayAttendance.length > 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          {subject?.subject_name}
        </h1>
        <p className="text-neutral-400">{subject?.subject_code}</p>
      </div>

      {/* Stats */}
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

      {/* Goal */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
        <div className="flex justify-between mb-2">
          <p className="text-white font-medium">Goal: {goal}%</p>
          {attendancePercentage < goal ? (
            <span className="text-red-400">Critical</span>
          ) : (
            <span className="text-green-400">Safe</span>
          )}
        </div>

        <div className="w-full h-2 bg-neutral-800 rounded-full">
          <div
            className="h-full bg-indigo-500"
            style={{
              width: `${Math.min(attendancePercentage, 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          disabled={marking}
          onClick={() => markAttendance("PRESENT")}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg disabled:opacity-50"
        >
          {alreadyMarkedToday ? "Update to Present" : "Mark Present"}
        </button>

        <button
          disabled={marking}
          onClick={() => markAttendance("ABSENT")}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg disabled:opacity-50"
        >
          {alreadyMarkedToday ? "Update to Absent" : "Mark Absent"}
        </button>
      </div>
    </div>
  );
};

export default SubjectPage;
