import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import SubjectDashBoard from "../components/SubjectDashBoard";
import CalendarView from "../components/CalendarView";
import type { Attendance, AttendanceStatus } from "../types/attendance";

type SubjectView = "dashboard" | "calendar";

const Subject = () => {
  const { id } = useParams<{ id: string }>();
  const [view, setView] = useState<SubjectView>("dashboard");
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        setLoading(true);
        const res = await api.get(
          `/api/v1/attendance/subject/${id}/records/`
        );
        setAttendance(res.data ?? []);
      } catch (err) {
        console.error("Failed to load attendance", err);
      } finally {
        setLoading(false);
      }
    };

    loadAttendance();
  }, [id]);

  const handleAttendanceUpdate = async (
  date: string,
  status: AttendanceStatus | null
) => {
  const existing = attendance.find(a => a.date === date);

  try {
    if (status === null && existing) {
      // Delete on backend
      await api.delete(`/api/v1/attendance/${existing.id}/`);

      // Remove from frontend state
      setAttendance(prev => prev.filter(a => a.id !== existing.id));
      return;
    }

    // Add or update
    await api.post("/api/v1/attendance/mark/", {
      subject: id,
      date,
      status,
    });

    setAttendance(prev => {
      if (existing) {
        // update existing attendance
        return prev.map(a =>
          a.date === date ? { ...a, status } : a
        );
      }

      return [
        ...prev,
        { id: Date.now(), date, status }, // always a valid AttendanceStatus
      ];
    });
  } catch (err) {
    console.error("Attendance update failed", err);
  }
};



  if (loading) {
    return <p className="p-6 text-neutral-400">Loading subject…</p>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Tabs */}
      <div className="flex gap-6 border-b border-neutral-800">
        <button
          onClick={() => setView("dashboard")}
          className={`pb-3 text-sm font-medium transition ${
            view === "dashboard"
              ? "text-white border-b-2 border-indigo-500"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          Dashboard
        </button>

        <button
          onClick={() => setView("calendar")}
          className={`pb-3 text-sm font-medium transition ${
            view === "calendar"
              ? "text-white border-b-2 border-indigo-500"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          Calendar
        </button>
      </div>

      {view === "dashboard" && (
        <SubjectDashBoard
          subjectId={id!}
          attendance={attendance}
        />
      )}

      {view === "calendar" && (
        <CalendarView
          attendance={attendance}
          subjectId={id!}
          onAttendanceUpdate={handleAttendanceUpdate}
        />
      )}
    </div>
  );
};

export default Subject;
