import { useEffect, useState } from "react";
import api from "../api/axios";
import SubjectCard from "../components/SubjectCard";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [overallStats, setOverallStats] = useState<OverAllStats | null>(null);

  // fetch subjects & stats only if user is logged in
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchSubjects = async () => {
      try {
        const res = await api.get("/api/v1/subjects/");
        setSubjects(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchOverallStats = async () => {
      try {
        const res = await api.get("/api/v1/attendance/overall-stats/");
        setOverallStats(res.data);
      } catch (err) {
        console.error("Failed to fetch overall stats", err);
      }
    };

    fetchSubjects();
    fetchOverallStats();
  }, [isAuthenticated]);

  // ---- UI ----
  if (!isAuthenticated) {
    // Landing view for non-logged-in users
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 p-4">
        <h1 className="text-4xl font-bold text-white mb-6 text-center">
          Welcome to Your Attendance Tracker
        </h1>
        <p className="text-neutral-400 mb-8 text-center max-w-md">
          Track your subjects, attendance, and overall stats all in one place. Please login or register to get started.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-indigo-500 text-white rounded-lg text-lg font-semibold hover:bg-indigo-600 transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-3 border border-indigo-500 text-indigo-500 rounded-lg text-lg font-semibold hover:bg-indigo-500 hover:text-white transition"
          >
            Register
          </button>
        </div>
      </div>
    );
  }

  // Authenticated user view
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      {/* Overall Stats */}
      {overallStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
            <p className="text-green-400 text-sm">Present</p>
            <h2 className="text-4xl font-bold text-green-500 mt-2">
              {overallStats.present}
            </h2>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
            <p className="text-red-400 text-sm">Absent</p>
            <h2 className="text-4xl font-bold text-red-500 mt-2">
              {overallStats.absent}
            </h2>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
            <p className="text-indigo-400 text-sm">Attendance</p>
            <h2 className="text-4xl font-bold text-white mt-2">
              {overallStats.percentage.toFixed(1)}%
            </h2>
            <p className="text-neutral-500 text-sm mt-1">
              Total classes {overallStats.total}
            </p>
          </div>
        </div>
      )}

      {/* Subject list */}
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
