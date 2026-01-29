import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { login as loginAPI } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import type { LoginPayLoad } from "../types/auth";

const Login = () => {
  const { login } = useAuth();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  

  const [form, setForm] = useState<LoginPayLoad>({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const tokens = await loginAPI(form); // call backend
      login(tokens); // save tokens in context/localStorage
      navigate("/"); // redirect to dashboard
    } catch (err) {
      setError(`Login failed. Try again.${err}`);
    } finally {
      setLoading(false);
    }
  };

  if(isAuthenticated){
    return <Navigate to="/dashboard" replace/>;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-neutral-900">
      <form
        className="bg-neutral-800 p-8 rounded-xl w-80 space-y-6 shadow-md"
        onSubmit={handleLogin}
      >
        <h1 className="text-2xl font-bold text-white text-center">
          Login
        </h1>

        {/* Username */}
        <div className="flex flex-col">
          <label className="text-sm text-neutral-400 mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="p-2 rounded-md bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <label className="text-sm text-neutral-400 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="p-2 rounded-md bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Error message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-500 text-white p-2 rounded-md font-bold hover:bg-indigo-600 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Optional register link */}
        <p className="text-sm text-neutral-400 text-center">
          Don't have an account?{" "}
          <span
            className="text-indigo-400 cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;


// Surya, Surya@8043