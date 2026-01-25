import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

type Subject = {
  id: number;
  subject_name: string;
  subject_code: string;
};

type Attendance = {
  id: number;
  date: string;
  status: "PRESENT" | "ABSENT";
};
type AttendanceStatus = "PRESENT" | "ABSENT";

const SubjectPage = () => {
  const { id } = useParams<{ id: string }>();

  const [subject, setSubject] = useState<Subject | null>(null);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);

      const [subjectRes, attendanceRes] = await Promise.all([
        api.get(`/api/v1/subjects/${id}/`),
        api.get(`/api/v1/attendance/?subject=${id}`),
      ]);

      setSubject(subjectRes.data);
      setAttendance(attendanceRes.data);
    } catch (error) {
      console.error("Failed to load subject data:", error);
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, [id]);


  // 📊 Derived stats
  const presentCount = useMemo(
    () => attendance.filter((a) => a.status === "PRESENT").length,
    [attendance]
  );

  const absentCount = useMemo(
    () => attendance.filter((a) => a.status === "ABSENT").length,
    [attendance]
  );

  const totalClasses = presentCount + absentCount;

  const attendancePercentage = totalClasses
    ? Math.round((presentCount / totalClasses) * 100)
    : 0;

  const goal = 75;

  if (loading) {
    return <p className="text-neutral-400 p-6">Loading subject...</p>;
  }
  //marking attendance logic
  const markAttendance = async (status: AttendanceStatus) => {
  try {
    setMarking(true);

    await api.post("/api/v1/attendance/", {
      subject: subject!.id,
      status,
      date: new Date().toISOString().split("T")[0],
    });

    // reload attendance after marking
    const res = await api.get(`/api/v1/attendance/?subject=${subject!.id}`);
    setAttendance(res.data);
  } catch (err) {
    console.error(err);
  } finally {
    setMarking(false);
  }
};


  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          {subject?.subject_name}
        </h1>
        <p className="text-neutral-400">{subject?.subject_code}</p>
      </div>

      {/* Attendance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Attendance Rate */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <p className="text-neutral-400 text-sm">Attendance Rate</p>
          <h2 className="text-4xl font-bold text-white mt-2">
            {attendancePercentage}%
          </h2>
          <p className="text-neutral-500 mt-1">
            Present: {presentCount} | Absent: {absentCount}
          </p>
        </div>

        {/* Present */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <p className="text-green-400 text-sm">Present</p>
          <h2 className="text-4xl font-bold text-green-500 mt-2">
            {presentCount}
          </h2>
          <p className="text-neutral-500 mt-1">classes attended</p>
        </div>

        {/* Absent */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <p className="text-red-400 text-sm">Absent</p>
          <h2 className="text-4xl font-bold text-red-500 mt-2">
            {absentCount}
          </h2>
          <p className="text-neutral-500 mt-1">classes missed</p>
        </div>
      </div>

      {/* Goal Progress */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-white font-medium">
            Goal: {goal}% Attendance
          </p>

          {attendancePercentage < goal ? (
            <span className="text-xs px-3 py-1 rounded-full bg-red-500/10 text-red-400">
              Critical
            </span>
          ) : (
            <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-400">
              Safe
            </span>
          )}
        </div>

        <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all"
            style={{ width: `${attendancePercentage}%` }}
          />
        </div>

        <p className="text-neutral-500 text-sm mt-2">
          {attendancePercentage < goal
            ? "Attendance is low. Try not to miss more classes."
            : "You're on track. Keep it up."}
        </p>
      </div>
      <div className="flex gap-4 mt-6">
  <button
    disabled={marking}
    onClick={() => markAttendance("PRESENT")}
    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium disabled:opacity-50"
  >
    Mark Present
  </button>

  <button
    disabled={marking}
    onClick={() => markAttendance("ABSENT")}
    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium disabled:opacity-50"
  >
    Mark Absent
  </button>
</div>

    </div>
  );
};

export default SubjectPage;
