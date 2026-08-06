import { FiLock, FiMessageSquare } from 'react-icons/fi';
import { motion } from 'framer-motion';

const WelcomeScreen = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center bg-[#0b141a] relative overflow-hidden">
            
            {/* Background Decorative Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="z-10 flex flex-col items-center px-10 text-center"
            >
                {/* Modern Logo Icon */}
                <div className="relative mb-8">
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.05, 1],
                            rotate: [0, 5, -5, 0] 
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="w-24 h-24 bg-gradient-to-tr from-primary to-indigo-400 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-primary/20"
                    >
                        <span className="text-5xl text-white font-black drop-shadow-md">C</span>
                    </motion.div>
                    
                    {/* Tiny Floating Bubbles */}
                    <div className="absolute -top-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-4 border-[#0b141a]" />
                </div>

                <h1 className="text-3xl font-black text-slate-100 tracking-tight mb-3">
                    ChatApp <span className="text-primary">Web</span>
                </h1>
                
                <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                    Send and receive messages without keeping your phone online. 
                    <br /> 
                    <span className="text-slate-500 italic mt-2 block">
                        Select a conversation from the sidebar to start chatting.
                    </span>
                </p>

                {/* Feature List (Sleek labels) */}
                <div className="flex gap-3 mt-10">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Real-time
                    </span>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                       Fun Chating
                    </span>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Media Sharing
                    </span>
                </div>
            </motion.div>

            {/* Bottom Security Label */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-10 flex items-center gap-2 text-slate-500 text-xs font-medium tracking-wide"
            >
                <FiLock className="text-primary" />
                End-to-end encrypted
            </motion.div>
        </div>
    );
};

export default WelcomeScreen;