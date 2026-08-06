import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

const Register = () => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const res = await API.post('/auth/register', data);
            if (res.data.success) {
                toast.success("OTP sent to your email!");
                // Passing email state to OTP page is critical
                navigate('/verify-otp', { state: { email: data.email } });
            }
        } catch (error) {
            console.error("Registration failed:", error.response?.data);
            // General error toast is handled by Axios Interceptor
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0b141a] flex items-center justify-center p-4 font-sans relative overflow-hidden">
            {/* Background Decorative Glows (Same as Login) */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.4 }}
                className="bg-[#111b21]/80 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md z-10"
            >
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <motion.div 
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        className="w-14 h-14 bg-gradient-to-tr from-primary to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary/20"
                    >
                        <span className="text-2xl font-black text-white">C</span>
                    </motion.div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Create Account</h2>
                    <p className="text-slate-400 text-sm mt-2">Join the conversation today</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Name Group */}
                    <div className="flex gap-3">
                        <div className="flex-1 space-y-1">
                            <div className="relative group">
                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" />
                                <input 
                                    {...register('firstName', { required: "Required" })}
                                    className="w-full bg-[#202c33] text-[#d1d7db] pl-11 pr-4 py-3 rounded-2xl outline-none border border-transparent focus:border-primary/50 transition-all placeholder:text-slate-600 text-sm" 
                                    placeholder="First Name" 
                                />
                            </div>
                            {errors.firstName && <p className="text-rose-500 text-[10px] font-bold ml-1">{errors.firstName.message}</p>}
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="relative group">
                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" />
                                <input 
                                    {...register('lastName', { required: "Required" })}
                                    className="w-full bg-[#202c33] text-[#d1d7db] pl-11 pr-4 py-3 rounded-2xl outline-none border border-transparent focus:border-primary/50 transition-all placeholder:text-slate-600 text-sm" 
                                    placeholder="Last Name" 
                                />
                            </div>
                            {errors.lastName && <p className="text-rose-500 text-[10px] font-bold ml-1">{errors.lastName.message}</p>}
                        </div>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1">
                        <div className="relative group">
                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" />
                            <input 
                                {...register('email', { 
                                    required: "Email is required",
                                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                                })}
                                type="email" 
                                className="w-full bg-[#202c33] text-[#d1d7db] pl-11 pr-4 py-3.5 rounded-2xl outline-none border border-transparent focus:border-primary/50 transition-all placeholder:text-slate-600 text-sm" 
                                placeholder="Email Address" 
                            />
                        </div>
                        {errors.email && <p className="text-rose-500 text-[10px] font-bold ml-1">{errors.email.message}</p>}
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1">
                        <div className="relative group">
                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" />
                            <input 
                                {...register('password', { 
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Minimum 6 characters" }
                                })}
                                type="password" 
                                className="w-full bg-[#202c33] text-[#d1d7db] pl-11 pr-4 py-3.5 rounded-2xl outline-none border border-transparent focus:border-primary/50 transition-all placeholder:text-slate-600 text-sm" 
                                placeholder="Password" 
                            />
                        </div>
                        {errors.password && <p className="text-rose-500 text-[10px] font-bold ml-1">{errors.password.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full bg-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-500 shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Processing</span>
                            </div>
                        ) : (
                            <>
                                Create Account
                                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-slate-500 text-xs font-medium">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary font-bold hover:text-indigo-400 transition-colors uppercase tracking-widest ml-1">
                            Login
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;