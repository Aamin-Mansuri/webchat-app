import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft } from 'react-icons/fi';

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const res = await API.post('/auth/forgot-password', data);
            if (res.data.success) {
                toast.success("Reset OTP sent to your email!");
                navigate('/reset-password', { state: { email: data.email } });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0b141a] flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
            
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#111b21] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md z-10">
                <Link to="/login" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-6 text-sm font-bold uppercase tracking-widest">
                    <FiArrowLeft /> Back to Login
                </Link>
                
                <h2 className="text-3xl font-black text-white mb-2">Forgot Password?</h2>
                <p className="text-slate-400 text-sm mb-8">Enter your email to receive a password reset code.</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="relative group">
                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" />
                        <input 
                            {...register('email', { required: true })}
                            type="email" 
                            className="w-full bg-[#202c33] text-[#d1d7db] pl-12 pr-4 py-4 rounded-2xl outline-none border border-transparent focus:border-primary/50 transition-all placeholder:text-slate-600 shadow-inner" 
                            placeholder="Email Address" 
                        />
                    </div>
                    <button disabled={loading} type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:bg-indigo-500 transition-all disabled:opacity-50">
                        {loading ? "Sending..." : "Send Reset Code"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;