import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import SubjectCard from "../components/SubjectCard";
import Stat from "../components/Stat";

type Subject = {
  id: number;
  subject_name: string;
  subject_code: string;
};

type OverAllStats = {
  present: number;
  absent: number;
  total: number;
  percentage: number;
};

const Dashboard = () => {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [overallStats, setOverallStats] = useState<OverAllStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [subjectsRes, statsRes] = await Promise.all([
          api.get("/api/v1/subjects/"),
          api.get("/api/v1/attendance/overall-stats/"),
        ]);

        setSubjects(subjectsRes.data);
        setOverallStats(statsRes.data);
      } catch (err) {
        console.error("Dashboard load failed", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <p className="p-6 text-neutral-400">Loading dashboard...</p>;
  }

  const stats = overallStats
    ? [
        { label: "Total Present", value: overallStats.present, variant: "green" as const },
        { label: "Total Absent", value: overallStats.absent, variant: "red" as const },
        {
          label: "Attendance",
          value: `${overallStats.percentage.toFixed(1)}%`,
          highlight: true,
        },
      ]
    : [];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <button
          onClick={() => navigate("/subjects/add")}
          className="bg-indigo-500 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-600 transition"
        >
          + Add Subject
        </button>
      </div>

      {/* Stats */}
      {overallStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((s) => (
            <Stat key={s.label} {...s} />
          ))}
        </div>
      )}

      {/* Subjects */}
      {subjects.length === 0 ? (
        <p className="text-neutral-400">No subjects added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((sub) => (
            <SubjectCard key={sub.id} subject={sub} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
