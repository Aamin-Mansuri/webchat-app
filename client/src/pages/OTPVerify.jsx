import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiShield, FiArrowLeft, FiRefreshCw } from 'react-icons/fi';

const OTPVerify = () => {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    
    // Safety check: Get email from state passed during registration
    const email = location.state?.email;

    // Senior Dev Tip: Redirect users who try to access /verify-otp directly without registering
    useEffect(() => {
        if (!email) {
            toast.error("Invalid session. Please register again.");
            navigate('/register');
        }
    }, [email, navigate]);

    const handleVerify = async () => {
        if (otp.length < 6) return toast.error("Please enter the full 6-digit code.");
        
        setLoading(true);
        try {
            const { data } = await API.post('/auth/verify-otp', { email, otp });
            if (data.success) {
                toast.success("Identity verified! Welcome to ChatApp.");
                navigate('/login');
            }
        } catch (error) {
            console.error(error);
            // Specific errors (wrong OTP) are handled by Axios interceptor
        } finally {
            setLoading(false);
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
                className="bg-[#111b21]/80 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl w-full max-w-sm z-10 text-center"
            >
                {/* Security Icon */}
                <div className="relative mb-6">
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto text-primary shadow-inner">
                        <FiShield size={32} />
                    </div>
                </div>

                <h2 className="text-2xl font-black text-white tracking-tight mb-2">Verify Your Email</h2>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                    We've sent a 6-digit code to <br />
                    <span className="text-white font-bold">{email}</span>
                </p>

                <div className="space-y-6">
                    {/* OTP Input */}
                    <div className="relative">
                        <input 
                            type="text" 
                            maxLength="6"
                            placeholder="000000"
                            className="w-full bg-[#202c33] text-[#d1d7db] text-center text-3xl font-black tracking-[0.5em] p-4 rounded-2xl outline-none border border-transparent focus:border-primary/50 transition-all placeholder:text-slate-700 shadow-inner"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // Only allow numbers
                        />
                    </div>

                    {/* Action Button */}
                    <button 
                        onClick={handleVerify}
                        disabled={loading || otp.length < 6}
                        className="w-full bg-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-500 shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Verifying</span>
                            </div>
                        ) : "Verify & Continue"}
                    </button>
                    
                    {/* Secondary Actions */}
                    <div className="flex flex-col gap-4 mt-6">
                        <button 
                            className="text-slate-500 text-[11px] font-bold uppercase tracking-widest hover:text-primary transition-colors flex items-center justify-center gap-2"
                            onClick={() => window.location.reload()}
                        >
                            <FiRefreshCw /> Resend Code
                        </button>
                        
                        <button 
                            onClick={() => navigate('/register')}
                            className="text-slate-600 text-[10px] font-bold uppercase tracking-tighter hover:text-white transition-colors flex items-center justify-center gap-1"
                        >
                            <FiArrowLeft /> Back to Registration
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default OTPVerify;