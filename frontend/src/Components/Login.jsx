import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(formData);
    setLoading(false);

    if (!result?.success) {
      setError(result.message);
      return;
    }

    setError("");
    setFormData({ username: "", password: "" });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="relative w-full max-w-sm mx-4">

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">

          {/* Header */}
          <div className="mb-7 text-center">
            <span className="text-slate-800 text-2xl font-semibold tracking-tight">
              My<span className="text-blue-500">App</span>
            </span>
            <p className="text-slate-400 text-sm mt-1">Sign in to your account</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-sm placeholder-slate-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-150"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-sm placeholder-slate-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-150"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors duration-150"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

          </form>

        </div>

      </div>
    </div>
  );
};

export default Login;