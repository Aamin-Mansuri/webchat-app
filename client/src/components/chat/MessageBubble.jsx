import { format } from 'timeago.js';
import { FiCheck, FiFileText, FiDownloadCloud, FiImage, FiVideo } from 'react-icons/fi';
import { motion } from 'framer-motion';

const MessageBubble = ({ message, isOwn }) => {
    
    const renderMedia = () => {
        if (!message.file?.url) return null;
        const { url, fileType, fileName } = message.file;

        return (
            <div 
                onClick={() => window.open(url, '_blank')}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all mb-2 border ${
                    isOwn ? 'bg-white/10 border-white/10 hover:bg-white/20' : 'bg-slate-700/40 border-white/5 hover:bg-slate-700/60'
                }`}
            >
                <div className="w-10 h-10 rounded-lg bg-slate-900/50 flex items-center justify-center text-xl shadow-inner">
                    {fileType === 'image' && <FiImage className="text-blue-400" />}
                    {fileType === 'video' && <FiVideo className="text-rose-400" />}
                    {fileType === 'document' && <FiFileText className="text-amber-400" />}
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-[11px] font-bold text-white truncate w-32">
                        {fileName || 'Attachment'}
                    </p>
                    <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">
                        {fileType}
                    </span>
                </div>
                <FiDownloadCloud className="text-primary mr-1" />
            </div>
        );
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex ${isOwn ? 'justify-end' : 'justify-start'} w-full`}
        >
            <div className={`max-w-[85%] md:max-w-[70%] p-2.5 rounded-2xl shadow-2xl relative ${
                isOwn 
                ? 'bg-[#005c4b] text-slate-100 rounded-tr-none' 
                : 'bg-[#202c33] text-slate-200 rounded-tl-none border border-white/5'
            }`}>
                {renderMedia()}

                {message.text && (
                    <p className="text-[13px] leading-relaxed break-words px-1">
                        {message.text}
                    </p>
                )}

                <div className="flex items-center justify-end gap-1 mt-1 opacity-60">
                    <span className="text-[9px] font-medium tracking-tight">
                        {format(message.createdAt)}
                    </span>
                    
                    {isOwn && (
                        <div className="flex items-center">
                            <FiCheck className={`text-xs ${message.seen ? 'text-sky-400' : 'text-slate-400'}`} />
                            {message.seen && <FiCheck className="text-xs text-sky-400 -ml-2" />}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default MessageBubble;