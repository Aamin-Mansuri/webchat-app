import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const res = await API.post('/auth/register', data);
            if (res.data.success) {
                setUser(res.data.user);
                toast.success(`Welcome, ${data.firstName}! Account created.`);
                navigate('/');
            }
        } catch (error) {
            console.error("Registration failed:", error.response?.data);
        } finally {
            setLoading(false);
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
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                        className="w-14 h-14 bg-gradient-to-br from-primary via-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-primary/25"
                    >
                        <span className="text-2xl font-black text-white">C</span>
                    </motion.div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Create Account</h2>
                    <p className="text-slate-500 text-sm mt-1.5">Start chatting in seconds</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name row */}
                    <div className="flex gap-3">
                        <div className="flex-1 space-y-1">
                            <div className="relative group">
                                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={15} />
                                <input
                                    {...register('firstName', { required: "Required" })}
                                    className="w-full bg-[#1a2530] text-[#d1d7db] pl-10 pr-3 py-3 rounded-xl outline-none border border-white/[0.06] focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-600 text-sm"
                                    placeholder="First name"
                                />
                            </div>
                            {errors.firstName && <p className="text-rose-500 text-[10px] font-semibold ml-1">{errors.firstName.message}</p>}
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="relative group">
                                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={15} />
                                <input
                                    {...register('lastName', { required: "Required" })}
                                    className="w-full bg-[#1a2530] text-[#d1d7db] pl-10 pr-3 py-3 rounded-xl outline-none border border-white/[0.06] focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-600 text-sm"
                                    placeholder="Last name"
                                />
                            </div>
                            {errors.lastName && <p className="text-rose-500 text-[10px] font-semibold ml-1">{errors.lastName.message}</p>}
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                        <div className="relative group">
                            <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={15} />
                            <input
                                {...register('email', {
                                    required: "Email is required",
                                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                                })}
                                type="email"
                                className="w-full bg-[#1a2530] text-[#d1d7db] pl-10 pr-4 py-3.5 rounded-xl outline-none border border-white/[0.06] focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-600 text-sm"
                                placeholder="Email address"
                            />
                        </div>
                        {errors.email && <p className="text-rose-500 text-[10px] font-semibold ml-1">{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                        <div className="relative group">
                            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={15} />
                            <input
                                {...register('password', {
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Minimum 6 characters" }
                                })}
                                type={showPassword ? 'text' : 'password'}
                                className="w-full bg-[#1a2530] text-[#d1d7db] pl-10 pr-11 py-3.5 rounded-xl outline-none border border-white/[0.06] focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-600 text-sm"
                                placeholder="Create a password"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                                {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                            </button>
                        </div>
                        {errors.password && <p className="text-rose-500 text-[10px] font-semibold ml-1">{errors.password.message}</p>}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 bg-gradient-to-r from-primary to-indigo-500 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide hover:opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Creating account…</span>
                            </div>
                        ) : (
                            <>
                                Get Started
                                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-7 text-center text-slate-500 text-xs">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary font-bold hover:text-indigo-400 transition-colors ml-1">
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
