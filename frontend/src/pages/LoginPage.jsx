import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services";
import { Button, Input } from "../components/common/UI";
import toast from "react-hot-toast";
import { Sun, Moon } from "lucide-react";

export default function LoginPage() {
  const { login, dark, toggleDark } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]       = useState({ email: "", password: "" });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.email)    errs.email    = "Email is required";
    if (!form.password) errs.password = "Password is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res  = await authService.login(form);
      const data = res.data.data;
      login(
        { name: data.name, email: data.email, role: data.role,
          subscriptionPlan: data.subscriptionPlan, subscriptionExpiry: data.subscriptionExpiry },
        data.token
      );
      toast.success(`Welcome back, ${data.name.split(" ")[0]}! 👋`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0a0a0f] px-4 relative">
      {/* Theme toggle */}
      <button onClick={toggleDark}
        className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 dark:border-[#2a2a3d] bg-white dark:bg-[#12121a] text-gray-500 dark:text-yellow-400 hover:border-indigo-400 transition-all">
        {dark ? <Sun size={15} /> : <Moon size={15} />}
      </button>

      {/* Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-400 dark:bg-indigo-600 opacity-10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-teal-400 opacity-10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Card */}
        <div className="bg-white dark:bg-[#12121a] border border-gray-100 dark:border-[#2a2a3d] rounded-2xl p-8 shadow-xl">
          {/* Logo */}
          <div className="text-center mb-7">
            <h1 className="font-syne text-3xl font-black">
              <span className="text-indigo-500">Grow</span>
              <span className="text-teal-400">Genie</span>
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-dm">
              AI-Powered Business Builder for SMEs
            </p>
          </div>

          {/* JWT chip */}
          <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl px-3 py-2 mb-6 text-xs text-indigo-600 dark:text-indigo-400 font-dm">
            🔐 Secured with JWT Authentication
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email Address" name="email" type="email"
              placeholder="owner@business.com" value={form.email}
              onChange={onChange} error={errors.email} />

            <Input label="Password" name="password" type="password"
              placeholder="••••••••" value={form.password}
              onChange={onChange} error={errors.password} />

            <Button type="submit" className="w-full mt-2" loading={loading}>
              Login 
            </Button>
          </form>

          <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-5 font-dm">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-500 hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
