import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail,
  FiLock,
  FiArrowRight,
  FiShield,
  FiActivity,
  FiLayers,
  FiCheckCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login(formData.email, formData.password);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("lastLogin", Date.now().toString());
      toast.success("Identity Verified. Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060b23] flex items-center justify-center p-4 md:p-8 overflow-hidden relative font-sans">
      {/* --- High-Impact Animated Background --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [-20, 20, -20],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-500/20 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.3, 0.1],
            y: [20, -20, 20],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-600/20 blur-[120px] rounded-full"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10"
      >
        {/* LEFT SIDE: Brand Experience (High Graphics for Laptop) */}
        <div className="hidden lg:flex flex-col flex-1 space-y-12">
          <div className="relative">
            {/* Main Graphic: The Animated "Login Shield" */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="w-[420px] h-[260px] bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#020617] rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.7)] p-10 border border-white/10 relative overflow-hidden group"
            >
              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                <div className="flex gap-2 text-emerald-400 text-4xl">
                  <FiShield className="animate-pulse" />
                </div>
                <h4 className="text-xl font-extrabold text-white">
                  Secure Access Portal
                </h4>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-1/3 h-full bg-emerald-500"
                  />
                </div>
                <p className="text-xs text-white/50 max-w-[80%] leading-relaxed">
                  Encryption Key:{" "}
                  <span className="text-emerald-400 font-mono">
                    AES_256_GCM
                  </span>{" "}
                  active. Verifying session integrity...
                </p>
              </div>

              {/* Complex SVG/Motion Background for the card */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 z-0 flex items-center justify-center opacity-20"
              >
                <div className="w-80 h-80 rounded-full border border-emerald-500/30" />
                <div className="absolute w-60 h-60 rounded-full border border-emerald-500/20" />
                <div className="absolute w-40 h-40 rounded-full border-2 border-dashed border-emerald-500/10" />
              </motion.div>
            </motion.div>

            {/* Floating Status Badge */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute top-1/2 -left-12 translate-y-8 bg-[#1e293b]/90 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                <FiActivity className="text-2xl animate-bounce" />
              </div>
              <div>
                <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em]">
                  System Status
                </p>
                <p className="text-sm text-white font-semibold">
                  Network Encrypted
                </p>
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <h2 className="text-6xl font-black text-white leading-none tracking-tight">
              Unlock Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                Wealth Vault.
              </span>
            </h2>
            <p className="text-slate-400 text-xl max-w-md font-medium leading-relaxed">
              Continue your journey to financial freedom with automated
              portfolio tracking and insights.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: Glassmorphism Login Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-[480px] bg-white/[0.03] backdrop-blur-[40px] rounded-[3.5rem] p-10 md:p-14 border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.5)]"
        >
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-4xl font-bold text-white mb-3">Sign In</h1>
            <p className="text-slate-400 font-medium">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="group">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                  <FiMail size={20} />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-14 pr-6 py-4 bg-white/[0.04] border border-white/5 rounded-3xl text-white focus:border-blue-500/50 focus:bg-white/[0.07] transition-all outline-none placeholder:text-slate-700 text-sm font-medium"
                  placeholder="xyz@company.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <div className="flex justify-between items-center mb-2 px-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  size={10}
                  className="text-[10px] font-bold text-blue-400 uppercase tracking-widest hover:text-blue-300"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                  <FiLock size={20} />
                </span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-14 pr-6 py-4 bg-white/[0.04] border border-white/5 rounded-3xl text-white focus:border-blue-500/50 focus:bg-white/[0.07] transition-all outline-none placeholder:text-slate-700 text-sm font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Premium Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 rounded-3xl font-bold text-lg shadow-2xl shadow-blue-600/30 flex items-center justify-center group disabled:opacity-50 relative overflow-hidden mt-8"
            >
              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                animate={{ x: ["-100%", "200%"] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <span className="relative flex items-center gap-2">
                {loading ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Authorize Login</span>
                    <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </span>
            </motion.button>
          </form>

          {/* Footer Link */}
          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Don't have a vault yet?{" "}
              <Link
                to="/register"
                className="text-white hover:text-emerald-400 font-bold transition-colors underline underline-offset-8 decoration-blue-500/30"
              >
                Create Account
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Modern Bottom Trust Bar */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8 opacity-40">
        <div className="flex items-center gap-2 text-[10px] text-white font-bold tracking-[0.3em] uppercase">
          <FiCheckCircle className="text-emerald-500" />
          Hardware Verified
        </div>
        <div className="w-[1px] h-3 bg-white/20" />
        <div className="text-[10px] text-white font-bold tracking-[0.3em] uppercase">
          SSL Layer 7
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
