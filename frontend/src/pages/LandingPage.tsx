import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">
        Attendance. Simplified.
      </h1>

      <p className="text-neutral-400 max-w-md mb-10">
        Track subjects, attendance, and performance in one clean dashboard.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-3 bg-indigo-500 rounded-lg font-semibold hover:bg-indigo-600 transition"
        >
          Login
        </button>

        <button
          onClick={() => navigate("/register")}
          className="px-6 py-3 border border-indigo-500 text-indigo-400 rounded-lg font-semibold hover:bg-indigo-500 hover:text-white transition"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Landing;
