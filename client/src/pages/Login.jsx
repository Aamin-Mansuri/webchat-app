import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
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
            const success = await login(data.email, data.password);
            if (success) {
                toast.success("Welcome back!");
                navigate('/');
            }
        } catch (error) {
            console.error(error);
            // Error is handled by Axios Interceptor (toast.error)
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0b141a] flex items-center justify-center p-4 font-sans relative overflow-hidden">
            {/* Background Decorative Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.4 }}
                className="bg-[#111b21]/80 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md z-10"
            >
                {/* Logo & Header */}
                <div className="text-center mb-10">
                    <motion.div 
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        className="w-16 h-16 bg-gradient-to-tr from-primary to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary/20"
                    >
                        <span className="text-3xl font-black text-white">C</span>
                    </motion.div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Welcome Back</h2>
                    <p className="text-slate-400 text-sm mt-2 font-medium">Enter your credentials to continue</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Email Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
                                <FiMail size={18} />
                            </div>
                            <input 
                                {...register('email', { 
                                    required: "Email is required",
                                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
                                })}
                                type="email" 
                                className={`w-full bg-[#202c33] text-[#d1d7db] pl-12 pr-4 py-3.5 rounded-2xl outline-none border border-transparent focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-600 shadow-inner`} 
                                placeholder="name@example.com" 
                            />
                        </div>
                        {errors.email && <p className="text-rose-500 text-[10px] font-bold uppercase ml-1 tracking-tighter">{errors.email.message}</p>}
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                            <Link to="/forgot-password" size={12} className="text-[11px] font-bold text-primary hover:text-indigo-400 transition-colors">Forgot-Password?</Link>
                        </div>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
                                <FiLock size={18} />
                            </div>
                            <input 
                                {...register('password', { required: "Password is required" })}
                                type={showPassword ? "text" : "password"} 
                                className={`w-full bg-[#202c33] text-[#d1d7db] pl-12 pr-12 py-3.5 rounded-2xl outline-none border border-transparent focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-600 shadow-inner`} 
                                placeholder="••••••••" 
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                            >
                                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </button>
                        </div>
                        {errors.password && <p className="text-rose-500 text-[10px] font-bold uppercase ml-1 tracking-tighter">{errors.password.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-indigo-500 shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Authenticating</span>
                            </div>
                        ) : (
                            <>
                                Sign In
                                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <p className="mt-8 text-center text-slate-500 text-xs font-medium">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary font-bold hover:text-indigo-400 transition-colors uppercase tracking-widest ml-1">
                        Register
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;