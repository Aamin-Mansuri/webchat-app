import { useState } from 'react';
import { useAuth, useSocket } from '../../hooks/useContexts';
import { FiPlus, FiSearch, FiLogOut, FiMoreVertical, FiSettings, FiUser } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'timeago.js';
import API from '../../services/api';
import { FiShield } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ chats, setSelectedChat, selectedChat, refreshChats, onOpenProfile }) => {
    const { user, logout } = useAuth();
    const { onlineUsers } = useSocket();
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    const handleSearch = async (val) => {
        setSearch(val);
        if (val.length > 2) {
            try {
                const { data } = await API.get(`/users/search?search=${val}`);
                setResults(data.users);
            } catch (err) { console.error(err); }
        } else setResults([]);
    };

    const startChat = async (userId) => {
        try {
            const { data } = await API.post('/chats', { userId });
            setSelectedChat(data);
            setSearch("");
            setResults([]);
            refreshChats();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="flex flex-col w-full h-full bg-[#111b21]/95 backdrop-blur-xl border-r border-white/5 relative overflow-hidden">
            
            {/* Header matching the Auth Card Identity */}
            <div className="p-6 bg-white/5 border-b border-white/5 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                    <div className="relative group cursor-pointer" onClick={onOpenProfile}>
                        <motion.img 
                            whileHover={{ scale: 1.05 }}
                            src={user?.avatar?.url} 
                            className="w-11 h-11 rounded-2xl object-cover border-2 border-primary/30 shadow-lg shadow-primary/10" 
                            alt="me"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-[#111b21] rounded-full shadow-lg"></div>
                    </div>
                    <div>
                        <h2 className="text-white font-black text-sm tracking-tight leading-tight">My Messages</h2>
                        <p className="text-primary text-[10px] font-bold uppercase tracking-widest">Active Now</p>
                    </div>
               
                {user?.isAdmin && (
                            <button 
                                onClick={() => navigate('/admin')}
                                className="flex items-center gap-1 text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full mt-1 hover:bg-primary hover:text-white transition-all font-black uppercase tracking-widest"
                            >
                                <FiShield size={10} /> Admin Panel
                            </button>
                        )}
                 </div>
                <div className="flex items-center gap-2">
                    <button onClick={onOpenProfile} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                        <FiSettings size={18} />
                    </button>
                    <button onClick={logout} className="p-2 text-rose-500/70 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all">
                        <FiLogOut size={18} />
                    </button>
                </div>
            </div>

            {/* Search Bar matching Auth Input style */}
            <div className="p-4 z-10">
                <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
                        <FiSearch size={18} />
                    </div>
                    <input 
                        className="w-full bg-[#202c33] text-[#d1d7db] text-sm pl-12 pr-4 py-3 rounded-2xl outline-none border border-transparent focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-slate-600 shadow-inner" 
                        placeholder="Search people or email..."
                        value={search} 
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-4">
                <AnimatePresence mode='wait'>
                    {search.length > 0 ? (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-1"
                        >
                            <label className="px-3 py-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block">Search Results</label>
                            {results.map(u => (
                                <motion.div 
                                    key={u._id} 
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => startChat(u._id)} 
                                    className="p-3 flex items-center gap-4 hover:bg-white/5 rounded-[1.5rem] cursor-pointer transition-all border border-transparent hover:border-white/5"
                                >
                                    <img src={u.avatar.url} className="w-12 h-12 rounded-2xl object-cover border border-white/10" alt="" />
                                    <div className="flex-1 overflow-hidden">
                                        <h4 className="font-bold text-[#e9edef] text-sm">{u.firstName} {u.lastName}</h4>
                                        <p className="text-[11px] text-slate-500 truncate">{u.email}</p>
                                    </div>
                                    <div className="text-primary"><FiPlus size={20} /></div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="space-y-1">
                            <label className="px-3 py-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block">Recent Conversations</label>
                            {chats.map(c => {
                                const other = c.participants.find(p => p._id !== user?._id);
                                const isOnline = onlineUsers.includes(other?._id);
                                const isSelected = selectedChat?._id === c._id;
                                
                                return (
                                    <motion.div 
                                        key={c._id} 
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedChat(c)} 
                                        className={`p-4 flex items-center gap-4 cursor-pointer rounded-[1.5rem] transition-all border ${
                                            isSelected 
                                            ? 'bg-primary/10 border-primary/30 shadow-lg shadow-primary/5' 
                                            : 'hover:bg-white/5 border-transparent'
                                        }`}
                                    >
                                        <div className="relative flex-shrink-0">
                                            <img 
                                                src={other?.avatar?.url} 
                                                className={`w-12 h-12 rounded-2xl object-cover border ${isSelected ? 'border-primary/50' : 'border-white/10'}`} 
                                                alt="avatar"
                                            />
                                            {isOnline && (
                                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-[3px] border-[#111b21] rounded-full"></div>
                                            )}
                                        </div>

                                        <div className="flex-1 overflow-hidden">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <h4 className={`text-sm truncate ${isSelected ? 'text-white font-black' : 'text-[#e9edef] font-bold'}`}>
                                                    {other?.firstName} {other?.lastName}
                                                </h4>
                                                <span className="text-[9px] font-bold text-slate-500 uppercase">
                                                    {c.lastMessage ? format(c.lastMessage.createdAt) : ''}
                                                </span>
                                            </div>
                                            
                                            <div className="flex justify-between items-center">
                                                <p className={`text-xs truncate flex-1 pr-2 ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                                                    {c.lastMessage?.text || "Tap to open chat"}
                                                </p>
                                                
                                                {c.unreadCount > 0 && (
                                                    <span className="bg-primary text-white text-[9px] font-black w-5 h-5 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                                                        {c.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                            
                            {chats.length === 0 && !search && (
                                <div className="text-center py-20 px-6">
                                    <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-600">
                                        <FiUser size={32} />
                                    </div>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">No chats found</p>
                                    <p className="text-slate-600 text-[10px] mt-2 italic">Search for a friend to start chatting</p>
                                </div>
                            )}
                        </div>
                    )}
                </AnimatePresence>
            </div>
            
            {/* Background Glow matching Auth pages */}
            <div className="absolute bottom-[-20%] left-[-20%] w-[80%] h-[40%] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        </div>
    );
};

export default Sidebar;