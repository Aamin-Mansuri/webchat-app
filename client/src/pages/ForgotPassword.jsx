import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft, FiArrowRight } from 'react-icons/fi';

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const res = await API.post('/auth/forgot-password', data);
            if (res.data.success) {
                toast.success("Reset code sent to your email!");
                navigate('/reset-password', { state: { email: data.email } });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0b141a] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            <div className="absolute top-0 left-0 w-[50%] h-[50%] bg-primary/8 rounded-full blur-[160px] pointer-events-none translate-x-[-30%] translate-y-[-30%]" />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="bg-[#111b21]/90 backdrop-blur-2xl border border-white/[0.06] p-8 rounded-3xl shadow-2xl w-full max-w-md z-10"
            >
                <Link to="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-7 text-xs font-semibold uppercase tracking-wider">
                    <FiArrowLeft size={14} /> Back to login
                </Link>

                <div className="mb-7">
                    <h2 className="text-2xl font-black text-white tracking-tight">Forgot password?</h2>
                    <p className="text-slate-500 text-sm mt-2">Enter your email and we'll send you a reset code.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-0.5">Email address</label>
                        <div className="relative group">
                            <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={16} />
                            <input
                                {...register('email', { required: "Email is required" })}
                                type="email"
                                className="w-full bg-[#1a2530] text-[#d1d7db] pl-10 pr-4 py-3.5 rounded-xl outline-none border border-white/[0.06] focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-600 text-sm"
                                placeholder="name@example.com"
                            />
                        </div>
                        {errors.email && <p className="text-rose-500 text-[10px] font-semibold ml-0.5">{errors.email.message}</p>}
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary to-indigo-500 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide hover:opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Sending…</span>
                            </div>
                        ) : (
                            <>Send Reset Code <FiArrowRight /></>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
