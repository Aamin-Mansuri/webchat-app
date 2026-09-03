import { useState, useEffect } from 'react';
import API from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiMessageSquare, FiActivity, FiShield, FiTrash2, FiSearch, FiArrowLeft, FiPieChart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalMessages: 0, totalGroups: 0, onlineUsers: 0 });
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const [sRes, uRes] = await Promise.all([
                    API.get('/admin/stats'),
                    API.get('/admin/users')
                ]);
                setStats(sRes.data.stats);
                setUsers(uRes.data.users);
            } catch (err) {
                toast.error("Unauthorized Access");
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchAdminData();
    }, [navigate]);

    const handleDelete = async (id) => {
        if (!window.confirm("CRITICAL: Permanently delete this user?")) return;
        try {
            await API.delete(`/admin/user/${id}`);
            setUsers(users.filter(u => u._id !== id));
            toast.success("User purged from system");
        } catch (err) { toast.error("Purge failed"); }
    };

    const filteredUsers = users.filter(u => 
        u.firstName.toLowerCase().includes(search.toLowerCase()) || 
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className="h-screen bg-[#0b141a] flex flex-col items-center justify-center text-white">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="animate-pulse text-xs font-black uppercase tracking-[0.3em]">Accessing Mainframe...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0b141a] text-white p-6 md:p-12 font-sans overflow-x-hidden">
            
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-500 hover:text-white mb-3 transition-all text-xs font-bold uppercase tracking-widest">
                        <FiArrowLeft /> Return to Chat
                    </button>
                    <h1 className="text-4xl font-black tracking-tighter">SYSTEM <span className="text-primary italic">CORE</span></h1>
                    <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-medium">Administrator Oversight Panel</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-2xl flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                        <span className="text-emerald-500 text-[10px] font-black uppercase">Nodes Active</span>
                    </div>
                </div>
            </header>

            {/* Stats Visualization */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {[
                    { label: 'Total Accounts', val: stats.totalUsers, icon: <FiUsers />, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
                    { label: 'Live Traffic', val: stats.onlineUsers, icon: <FiActivity />, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                    { label: 'Message Flow', val: stats.totalMessages, icon: <FiMessageSquare />, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                    { label: 'Group Cells', val: stats.totalGroups, icon: <FiPieChart />, color: 'text-amber-400', bg: 'bg-amber-400/10' }
                ].map((stat, i) => (
                    <motion.div 
                        key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        className="bg-[#111b21] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute -right-4 -bottom-4 opacity-5 text-7xl">{stat.icon}</div>
                        <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg`}>
                            {stat.icon}
                        </div>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
                        <h2 className="text-4xl font-black mt-2 tracking-tighter">{stat.val}</h2>
                    </motion.div>
                ))}
            </div>

            {/* User Management Database */}
            <div className="bg-[#111b21] rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden backdrop-blur-xl">
                <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 bg-white/2">
                    <h3 className="text-xl font-bold tracking-tight">Global User Index</h3>
                    <div className="relative w-full md:w-96">
                        <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input 
                            value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-[#202c33] border border-transparent focus:border-primary/50 p-4 pl-14 rounded-2xl outline-none transition-all text-sm shadow-inner"
                            placeholder="Filter by Name, Email or ID..."
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/2 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
                                <th className="p-8">Identification</th>
                                <th className="p-8">Status</th>
                                <th className="p-8 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence>
                                {filteredUsers.map((u) => (
                                    <motion.tr 
                                        key={u._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="hover:bg-white/2 transition-all group"
                                    >
                                        <td className="p-8">
                                            <div className="flex items-center gap-5">
                                                <img src={u.avatar.url} className="w-14 h-14 rounded-2xl object-cover border-2 border-white/5 shadow-xl group-hover:border-primary/30 transition-all" alt="" />
                                                <div>
                                                    <p className="font-black text-slate-100 tracking-tight">{u.firstName} {u.lastName}</p>
                                                    <p className="text-xs text-slate-500 font-mono">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2.5 h-2.5 rounded-full ${u.status === 'Online' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`} />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{u.status}</span>
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <div className="flex justify-center gap-3">
                                                <button 
                                                    disabled={u.isAdmin}
                                                    onClick={() => handleDelete(u._id)}
                                                    className={`p-4 rounded-2xl transition-all shadow-lg ${u.isAdmin ? 'opacity-10 bg-slate-800 text-slate-500' : 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white shadow-rose-500/10'}`}
                                                >
                                                    <FiTrash2 size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div className="p-20 text-center text-slate-600 text-xs font-black uppercase tracking-[0.5em]">
                            No records found in database
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;