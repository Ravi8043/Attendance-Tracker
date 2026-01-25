import { useEffect, useState } from "react";
import api from "../api/axios";
import SubjectCard from "../components/SubjectCard";

type Subject = {
  id: number;
  subject_name: string;
  subject_code: string;
};

const Dashboard = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject_name: "",
    subject_code: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await api.get("/api/v1/subjects/");
      setSubjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };
//works only for input fields as mentioned in type
//data sent to the backend
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
    }));
  };
//api call to add subject
  const handleAddSubject = async () => {
    if (!formData.subject_name || !formData.subject_code) return;

    try {
      setLoading(true);
      await api.post("/api/v1/subjects/", formData);
      setFormData((prev) => ({
        ...prev,
        subject_name: "",
        subject_code: "",
      }));
      setShowForm(false);
      fetchSubjects();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <button
        //if clicked, show form to add subject
        //if clicked again, hide the form
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition"
        >
          + Add Subject
        </button>
      </div>

      {/* Add Subject Form */}
      {showForm && (
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="subject_name"
              placeholder="Subject Name"
              value={formData.subject_name}
              onChange={handleChange}
              className="bg-neutral-900 border border-neutral-700 text-white p-2 rounded-md focus:outline-none focus:border-indigo-500"
            />

            <input
              type="text"
              name="subject_code"
              placeholder="Subject Code"
              value={formData.subject_code}
              onChange={handleChange}
              className="bg-neutral-900 border border-neutral-700 text-white p-2 rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAddSubject}
              disabled={loading}
              className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-md text-white disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Subject"}
            </button>

            <button
              onClick={() => setShowForm(false)}
              className="text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
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
