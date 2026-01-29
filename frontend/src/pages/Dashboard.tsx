import { useEffect, useState } from "react";
import api from "../api/axios";
import SubjectCard from "../components/SubjectCard";

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
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [overallStats, setOverallStats] = useState<OverAllStats | null>(null);

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
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {overallStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* same cards as before */}
        </div>
      )}

      {subjects.length === 0 ? (
        <p className="text-neutral-400">No subjects added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map(sub => (
            <SubjectCard key={sub.id} subject={sub} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
