import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiLock, FiKey, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';

const ResetPassword = () => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const res = await API.post('/auth/reset-password', { ...data, email });
            if (res.data.success) {
                toast.success("Password updated! Please sign in.");
                navigate('/login');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0b141a] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-indigo-600/8 rounded-full blur-[160px] pointer-events-none translate-x-[30%] translate-y-[30%]" />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="bg-[#111b21]/90 backdrop-blur-2xl border border-white/[0.06] p-8 rounded-3xl shadow-2xl w-full max-w-md z-10"
            >
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-primary/15 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto text-primary mb-5">
                        <FiKey size={24} />
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Reset Password</h2>
                    {email && (
                        <p className="text-slate-500 text-xs mt-2">
                            Code sent to <span className="text-slate-300 font-semibold">{email}</span>
                        </p>
                    )}
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* OTP */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-0.5">6-digit code</label>
                        <input
                            {...register('otp', { required: "Code is required" })}
                            maxLength="6"
                            className="w-full bg-[#1a2530] text-white text-center text-2xl font-black tracking-[0.5em] py-3.5 px-4 rounded-xl border border-white/[0.06] focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder:text-slate-700"
                            placeholder="000000"
                        />
                        {errors.otp && <p className="text-rose-500 text-[10px] font-semibold ml-0.5">{errors.otp.message}</p>}
                    </div>

                    {/* New password */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-0.5">New password</label>
                        <div className="relative group">
                            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={16} />
                            <input
                                {...register('newPassword', { required: "Password required", minLength: { value: 6, message: "Min 6 characters" } })}
                                type={showPassword ? "text" : "password"}
                                className="w-full bg-[#1a2530] text-[#d1d7db] pl-10 pr-11 py-3.5 rounded-xl outline-none border border-white/[0.06] focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-600 text-sm"
                                placeholder="New password"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                            </button>
                        </div>
                        {errors.newPassword && <p className="text-rose-500 text-[10px] font-semibold ml-0.5">{errors.newPassword.message}</p>}
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary to-indigo-500 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide hover:opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Updating…</span>
                            </div>
                        ) : (
                            <>Update Password <FiArrowRight /></>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
