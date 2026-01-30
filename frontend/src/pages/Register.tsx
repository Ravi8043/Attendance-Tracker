import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { register } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import type { RegisterPayLoad } from "../types/auth";

const Register = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterPayLoad>({
    username: "",
    id_card_number: "",
    password: "",
    password2: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await register(form);
      navigate("/login");
    } catch (err) {
      // handle backend errors
      if (typeof err === "object" && err !== null) {
        const backendErrors = err as Record<string, string[]>;
        const formatted: Record<string, string> = {};
        Object.entries(backendErrors).forEach(([key, value]) => {
          formatted[key] = Array.isArray(value) ? value.join(" ") : String(value);
        });
        setErrors(formatted);
      } else console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-neutral-800 p-6 sm:p-8 rounded-xl w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-white text-center">Register</h1>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full p-3 rounded bg-neutral-700 text-white"
        />
        {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}

        <input
          type="text"
          name="id_card_number"
          placeholder="ID Card Number"
          value={form.id_card_number}
          onChange={handleChange}
          className="w-full p-3 rounded bg-neutral-700 text-white"
        />
        {errors.id_card_number && <p className="text-red-500 text-sm">{errors.id_card_number}</p>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 rounded bg-neutral-700 text-white"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

        <input
          type="password"
          name="password2"
          placeholder="Confirm Password"
          value={form.password2}
          onChange={handleChange}
          className="w-full p-3 rounded bg-neutral-700 text-white"
        />
        {errors.password2 && <p className="text-red-500 text-sm">{errors.password2}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-indigo-500 rounded text-white font-bold hover:bg-indigo-600 transition"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
