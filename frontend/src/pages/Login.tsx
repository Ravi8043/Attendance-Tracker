import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { login as loginAPI } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import type { LoginPayLoad } from "../types/auth";

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginPayLoad>({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const tokens = await loginAPI(form);
      login(tokens);
      navigate("/dashboard");
    } catch (err) {
      setError(`Login failed. Check username/password. ${err}`);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="flex items-center justify-center h-screen bg-neutral-900">
      <form
        className="bg-neutral-800 p-8 rounded-xl w-80 space-y-6 shadow-md"
        onSubmit={handleLogin}
      >
        <h1 className="text-2xl font-bold text-white text-center">Login</h1>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full p-2 rounded-md bg-neutral-700 text-white"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 rounded-md bg-neutral-700 text-white"
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-500 text-white p-2 rounded-md font-bold hover:bg-indigo-600 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
