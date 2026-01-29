import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";


const AddSubject = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    subject_name: "",
    subject_code: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/api/v1/subjects/", form);
      navigate("/dashboard"); // back to dashboard
    } catch (err) {
      console.error("Failed to add subject", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900">
      <form
        onSubmit={handleSubmit}
        className="bg-neutral-800 p-8 rounded-xl w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Add Subject</h1>

        <input
          name="subject_name"
          placeholder="Subject Name"
          value={form.subject_name}
          onChange={handleChange}
          required
          className="w-full p-3 rounded bg-neutral-700"
        />

        <input
          name="subject_code"
          placeholder="Subject Code (optional)"
          value={form.subject_code}
          onChange={handleChange}
          className="w-full p-3 rounded bg-neutral-700"
        />

        <button
          disabled={loading}
          className="w-full bg-indigo-500 p-3 rounded font-bold hover:bg-indigo-600"
        >
          {loading ? "Adding..." : "Add Subject"}
        </button>
      </form>
    </div>
  );
};

export default AddSubject;
