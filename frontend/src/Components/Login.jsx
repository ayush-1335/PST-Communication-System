import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const [error, setError] = useState("")

  const { user, login, loading } = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(formData);

    // console.log(result.message);

    if (!result?.success) {
      setError(result.message)
      return;
    }
      setError("")
      setFormData({ username: "", password: "" })

      navigate("/dashboard");

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Login
        </h2>

        <input
          type="text"
          name="username"
          placeholder="Email or Username"
          className="border p-2 rounded w-full"
          value={formData.username}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-2 rounded w-full mt-4"
          value={formData.password}
          onChange={handleChange}
        />

        {error && (
          <div className="text-red-600 text-sm mb-3">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white w-full mt-6 py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
