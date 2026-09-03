import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Login = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const result = await login(data.email, data.password);
            if (result) navigate('/');
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0b141a] flex items-center justify-center p-4 font-sans relative overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute top-0 left-0 w-[50%] h-[50%] bg-primary/8 rounded-full blur-[160px] pointer-events-none translate-x-[-30%] translate-y-[-30%]" />
            <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-indigo-600/8 rounded-full blur-[160px] pointer-events-none translate-x-[30%] translate-y-[30%]" />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="bg-[#111b21]/90 backdrop-blur-2xl border border-white/[0.06] p-8 rounded-3xl shadow-2xl w-full max-w-md z-10"
            >
                {/* Header */}
                <div className="text-center mb-9">
                    <motion.div
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                        className="w-14 h-14 bg-gradient-to-br from-primary via-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-primary/25"
                    >
                        <span className="text-2xl font-black text-white">C</span>
                    </motion.div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Welcome back</h2>
                    <p className="text-slate-500 text-sm mt-1.5">Sign in to continue chatting</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-0.5">Email</label>
                        <div className="relative group">
                            <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={16} />
                            <input
                                {...register('email', {
                                    required: "Email is required",
                                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
                                })}
                                type="email"
                                className="w-full bg-[#1a2530] text-[#d1d7db] pl-10 pr-4 py-3.5 rounded-xl outline-none border border-white/[0.06] focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-600 text-sm"
                                placeholder="name@example.com"
                            />
                        </div>
                        {errors.email && <p className="text-rose-500 text-[10px] font-semibold ml-0.5">{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center ml-0.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Password</label>
                            <Link to="/forgot-password" className="text-[11px] text-primary hover:text-indigo-400 font-semibold transition-colors">Forgot password?</Link>
                        </div>
                        <div className="relative group">
                            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={16} />
                            <input
                                {...register('password', { required: "Password is required" })}
                                type={showPassword ? "text" : "password"}
                                className="w-full bg-[#1a2530] text-[#d1d7db] pl-10 pr-11 py-3.5 rounded-xl outline-none border border-white/[0.06] focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-600 text-sm"
                                placeholder="••••••••"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                            </button>
                        </div>
                        {errors.password && <p className="text-rose-500 text-[10px] font-semibold ml-0.5">{errors.password.message}</p>}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full mt-2 bg-gradient-to-r from-primary to-indigo-500 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide hover:opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Signing in…</span>
                            </div>
                        ) : (
                            <>
                                Sign In
                                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-7 text-center text-slate-500 text-xs">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary font-bold hover:text-indigo-400 transition-colors ml-1">
                        Create one
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
