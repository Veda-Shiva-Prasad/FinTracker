import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/api";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiLock,
  FiArrowRight,
  FiShield,
  FiGlobe,
  FiZap,
  FiCheckCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
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
      await register(formData.name, formData.email, formData.password);
      toast.success("Account created! Accessing vault...");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center p-4 md:p-8 overflow-hidden relative font-sans text-slate-200">
      {/* --- Dynamic Background Elements (Matches Login) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.3, 0.15],
            rotate: [0, 45, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-600/20 blur-[150px] rounded-full"
        />
        <motion.div
          animate={{
            x: [-50, 50, -50],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-700/10 blur-[120px] rounded-full"
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-6xl flex flex-col lg:flex-row-reverse items-center justify-between gap-16 relative z-10"
      >
        {/* LEFT SIDE: Visual Storytelling (Laptop Graphics) */}
        <div className="hidden lg:flex flex-col flex-1 space-y-10">
          <div className="relative">
            {/* 3D-Style Card Graphic */}
            <motion.div
              style={{ perspective: 1000 }}
              animate={{ rotateY: [0, 5, 0], rotateX: [0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="w-[450px] h-[280px] bg-gradient-to-br from-indigo-900/40 via-[#0a0f29] to-[#050816] rounded-[3rem] p-10 border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.6)] relative overflow-hidden"
            >
              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-center">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400">
                    <FiZap size={24} className="fill-indigo-400/20" />
                  </div>
                  <span className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase">
                    System Node: Active
                  </span>
                </div>

                <div>
                  <p className="text-sm text-indigo-300 font-bold uppercase tracking-wider mb-1">
                    Account Preview
                  </p>
                  <h3 className="text-4xl font-black text-white">
                    New Identity
                  </h3>
                </div>

                <div className="flex gap-3">
                  <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: ["0%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="h-full bg-blue-500"
                    />
                  </div>
                  <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: ["0%", "100%"] }}
                      transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
                      className="h-full bg-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Grid pattern background */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `radial-gradient(#4f46e5 0.5px, transparent 0.5px)`,
                  backgroundSize: "20px 20px",
                }}
              />
            </motion.div>

            {/* Floating Interaction Chips */}
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-6 -right-6 bg-[#1a1f3d] p-4 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-3"
            >
              <FiGlobe className="text-blue-400 animate-spin-slow" />
              <span className="text-xs font-bold text-white">
                Global Access Ready
              </span>
            </motion.div>
          </div>

          <div className="space-y-6">
            <h2 className="text-6xl font-black text-white leading-[1.1]">
              Start Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                Legacy Today.
              </span>
            </h2>
            <p className="text-slate-400 text-lg max-w-md font-medium leading-relaxed">
              Join the elite circle of users optimizing their wealth with our
              next-gen financial ecosystem.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE (Form): High-Gloss Glassmorphism */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full max-w-[500px] bg-white/[0.02] backdrop-blur-[50px] rounded-[4rem] p-10 md:p-14 border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.5)]"
        >
          <div className="mb-10">
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
              Register
            </h1>
            <p className="text-slate-500 font-semibold">
              Create your secure financial identity.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="group">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2 mb-2 block">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-14 pr-6 py-4 bg-white/[0.03] border border-white/5 rounded-[2rem] text-white focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all outline-none text-sm font-medium"
                  placeholder="Your Name"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="group">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2 mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-14 pr-6 py-4 bg-white/[0.03] border border-white/5 rounded-[2rem] text-white focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all outline-none text-sm font-medium"
                  placeholder="xyz@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="group">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2 mb-2 block">
                Security Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-14 pr-6 py-4 bg-white/[0.03] border border-white/5 rounded-[2rem] text-white focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all outline-none text-sm font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Register Button */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-[0_20px_40px_rgba(79,70,229,0.3)] flex items-center justify-center group disabled:opacity-50 mt-8 relative overflow-hidden"
            >
              {/* Shimmer Light Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                animate={{ x: ["-100%", "200%"] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="flex items-center gap-3 relative z-10">
                  Create a Account{" "}
                  <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
                </span>
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <div className="mt-12 text-center">
            <p className="text-sm text-slate-500 font-bold tracking-wide">
              ALREADY REGISTERED?{" "}
              <Link
                to="/login"
                className="text-white hover:text-indigo-400 transition-colors tracking-widest ml-2 border-b border-indigo-500/30 pb-1 uppercase"
              >
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Trust Badge Footer */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8 opacity-20">
        <div className="flex items-center gap-2 text-[10px] text-white font-bold tracking-[0.3em] uppercase">
          <FiCheckCircle className="text-blue-500" />
          End-to-End Encrypted
        </div>
        <div className="w-[1px] h-3 bg-white/20" />
        <div className="flex items-center gap-2 text-[10px] text-white font-bold tracking-[0.3em] uppercase">
          <FiShield className="text-blue-500" />
          2FA Capable
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
