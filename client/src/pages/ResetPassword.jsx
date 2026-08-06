import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiLock, FiShield } from 'react-icons/fi';

const ResetPassword = () => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, watch } = useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const res = await API.post('/auth/reset-password', { ...data, email });
            if (res.data.success) {
                toast.success("Password changed! Please login.");
                navigate('/login');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0b141a] flex items-center justify-center p-4 relative overflow-hidden">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111b21] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md z-10">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto text-primary mb-4 shadow-inner">
                        <FiShield size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-white">Reset Password</h2>
                    <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest">Verifying: {email}</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input 
                        {...register('otp', { required: true })} 
                        maxLength="6"
                        className="w-full bg-[#202c33] text-white text-center text-2xl font-black tracking-[0.5em] p-4 rounded-2xl border border-transparent focus:border-primary/50 outline-none transition-all" 
                        placeholder="000000" 
                    />
                    <div className="relative group">
                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input 
                            {...register('newPassword', { required: true, minLength: 6 })} 
                            type="password" 
                            className="w-full bg-[#202c33] text-white pl-12 pr-4 py-4 rounded-2xl outline-none border border-transparent focus:border-primary/50" 
                            placeholder="New Password" 
                        />
                    </div>
                    <button disabled={loading} type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:bg-indigo-500 transition-all">
                        {loading ? "Resetting..." : "Update Password"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default ResetPassword;