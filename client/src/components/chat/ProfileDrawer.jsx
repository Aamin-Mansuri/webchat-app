import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCamera, FiCheck, FiUser, FiInfo, FiEdit3, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../../hooks/useContexts';
import API from '../../services/api';
import toast from 'react-hot-toast';

const ProfileDrawer = ({ onClose }) => {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        about: user?.about || ""
    });

    // 1. Update Profile Text Data
    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await API.put('/users/update', formData);
            setUser(data.user);
            toast.success("Profile updated!");
            setIsEditing(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // 2. Remove Avatar Logic
    const handleRemoveAvatar = async () => {
        if (!window.confirm("Remove your profile photo?")) return;

        const tId = toast.loading("Removing photo...");
        try {
            const { data } = await API.delete('/users/remove-avatar');
            if (data.success) {
                setUser(data.user);
                toast.success("Photo removed", { id: tId });
            }
        } catch (err) {
            toast.error("Failed to remove photo", { id: tId });
        }
    };

    // 3. Handle Image Upload
    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadToast = toast.loading("Updating profile picture...");
        try {
            const fd = new FormData();
            fd.append('avatar', file); 

            const { data } = await API.put('/users/update', fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (data.success) {
                setUser(data.user); 
                toast.success("Avatar updated!", { id: uploadToast });
            }
        } catch (error) {
            toast.error("Upload failed", { id: uploadToast });
        }
    };

    const isDefaultAvatar = user?.avatar?.url?.includes('flaticon.com') || user?.avatar?.url?.includes('default');

    return (
        <motion.div 
            initial={{ x: '-100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-[60] bg-[#111b21] flex flex-col w-full md:w-[400px] border-r border-white/5 shadow-2xl"
        >
            {/* Header */}
            <div className="h-28 bg-[#202c33] p-6 flex items-end">
                <div className="flex items-center gap-6 text-[#d1d7db]">
                    <FiArrowLeft className="text-2xl cursor-pointer hover:text-white transition" onClick={onClose} />
                    <span className="text-xl font-black tracking-tight text-white">Profile</span>
                </div>
            </div>

            {/* Content Scroll Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 flex flex-col items-center">
                
                {/* Avatar Section */}
                <div className="relative group mb-10">
                    <div className="relative">
                        <img 
                            src={user?.avatar?.url} 
                            className="w-44 h-44 rounded-[2.5rem] object-cover border-4 border-[#202c33] shadow-2xl shadow-black/40" 
                            alt="profile"
                        />
                        
                        {/* Overlay Controls */}
                        <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/40 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                            <label className="cursor-pointer p-3 bg-primary rounded-2xl hover:scale-110 transition shadow-lg shadow-primary/20">
                                <FiCamera size={20} className="text-white" />
                                <input type="file" hidden onChange={handleAvatarChange} accept="image/*" />
                            </label>

                            {!isDefaultAvatar && (
                                <button 
                                    type="button"
                                    onClick={handleRemoveAvatar}
                                    className="p-3 bg-rose-500 rounded-2xl hover:scale-110 transition shadow-lg shadow-rose-500/20"
                                >
                                    <FiTrash2 size={20} className="text-white" />
                                </button>
                            )}
                        </div>
                    </div>
                    {/* Online Indicator */}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 border-4 border-[#111b21] rounded-full shadow-lg"></div>
                </div>

                {/* Info Form */}
                <form onSubmit={handleUpdate} className="w-full space-y-6">
                    
                    {/* Display Name Section */}
                    <div className="bg-[#202c33]/50 p-5 rounded-3xl border border-white/5 space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <FiUser /> Personal Info
                            </label>
                            <button 
                                type="button" 
                                onClick={() => setIsEditing(!isEditing)}
                                className="text-slate-400 hover:text-white transition"
                            >
                                <FiEdit3 size={16} />
                            </button>
                        </div>

                        {isEditing ? (
                            <div className="space-y-4">
                                <input 
                                    className="w-full bg-[#111b21] border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-primary transition-all"
                                    value={formData.firstName}
                                    placeholder="First Name"
                                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                />
                                <input 
                                    className="w-full bg-[#111b21] border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-primary transition-all"
                                    value={formData.lastName}
                                    placeholder="Last Name"
                                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                />
                            </div>
                        ) : (
                            <h2 className="text-white text-xl font-bold tracking-tight">{user?.firstName} {user?.lastName}</h2>
                        )}
                        <p className="text-[10px] text-slate-500 leading-tight italic">
                            Visible to all your contacts in chat and search.
                        </p>
                    </div>

                    {/* About Section */}
                    <div className="bg-[#202c33]/50 p-5 rounded-3xl border border-white/5 space-y-3">
                        <label className="text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                            <FiInfo /> About
                        </label>
                        {isEditing ? (
                            <textarea 
                                className="w-full bg-[#111b21] border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-primary min-h-[100px] resize-none transition-all"
                                value={formData.about}
                                onChange={(e) => setFormData({...formData, about: e.target.value})}
                            />
                        ) : (
                            <p className="text-slate-300 text-sm leading-relaxed">{user?.about || "No bio set."}</p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                        <motion.button 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 active:scale-95"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <><FiCheck size={16} /> Save Changes</>
                            )}
                        </motion.button>
                    )}
                </form>

                {/* Email Display (Non-Editable) */}
                <div className="w-full p-8 mt-4 text-center border-t border-white/5">
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                        Registered Email
                    </p>
                    <p className="text-slate-400 text-xs mt-1 font-mono">{user?.email}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default ProfileDrawer;