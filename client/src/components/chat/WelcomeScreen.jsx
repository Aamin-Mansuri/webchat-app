import { FiLock } from 'react-icons/fi';
import { motion } from 'framer-motion';

const WelcomeScreen = () => {
    return (
        <div className="h-full w-full min-h-[480px] flex flex-col items-center justify-between sm:justify-center bg-[#0b141a] relative overflow-hidden p-6 sm:p-8 md:p-12 select-none">
            
            {/* Background Decorative Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-primary/10 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none" />

            {/* Main Content Area */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="z-10 flex flex-col items-center text-center my-auto w-full max-w-md"
            >
                {/* Modern Logo Icon */}
                <div className="relative mb-5 sm:mb-8">
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.05, 1],
                            rotate: [0, 4, -4, 0] 
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-tr from-primary to-indigo-400 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-primary/20"
                    >
                        <span className="text-3xl sm:text-4xl md:text-5xl text-white font-black drop-shadow-md">
                            C
                        </span>
                    </motion.div>
                    
                    {/* Floating Status Dot */}
                    <div className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-emerald-500 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full border-[3px] sm:border-4 border-[#0b141a]" />
                </div>

                {/* Main Heading */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-100 tracking-tight mb-2 sm:mb-3">
                    ChatApp <span className="text-primary">Web</span>
                </h1>
                
                {/* Description */}
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed px-2 sm:px-4">
                    Send and receive messages without keeping your phone online. 
                    <span className="text-slate-500 italic mt-1.5 sm:mt-2 block text-[11px] sm:text-xs">
                        Select a conversation from the sidebar to start chatting.
                    </span>
                </p>

                {/* Feature Tags (Wraps naturally on narrow widths) */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-6 sm:mt-8 md:mt-10">
                    <span className="px-2.5 sm:px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Real-time
                    </span>
                    <span className="px-2.5 sm:px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Fun Chatting
                    </span>
                    <span className="px-2.5 sm:px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Media Sharing
                    </span>
                </div>
            </motion.div>

            {/* Bottom Security Label */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="z-10 mt-6 sm:mt-0 sm:absolute sm:bottom-8 flex items-center gap-1.5 sm:gap-2 text-slate-500 text-[11px] sm:text-xs font-medium tracking-wide"
            >
                <FiLock className="text-primary text-xs sm:text-sm" />
                <span>End-to-end encrypted</span>
            </motion.div>
        </div>
    );
};

export default WelcomeScreen;