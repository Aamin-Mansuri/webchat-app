import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { FiCamera, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.firstName,
        lastName: user?.lastName,
        about: user?.about
    });

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await API.put('/users/update', formData);
            setUser(data.user);
            toast.success("Profile updated!");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const { data } = await API.put('/users/update', formData);
            setUser(data.user);
            toast.success("Avatar updated!");
        } catch (error) {
            toast.error("Upload failed");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10">
            <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
            <div className="flex flex-col items-center mb-8">
                <div className="relative">
                    <img src={user?.avatar?.url} className="w-32 h-32 rounded-full border-4 border-primary object-cover" />
                    <label className="absolute bottom-0 right-0 bg-primary p-2 rounded-full text-white cursor-pointer">
                        <FiCamera />
                        <input type="file" hidden onChange={handleAvatarChange} />
                    </label>
                </div>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">First Name</label>
                        <input 
                            className="w-full p-2 border rounded-md" 
                            value={formData.firstName} 
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Last Name</label>
                        <input 
                            className="w-full p-2 border rounded-md" 
                            value={formData.lastName} 
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium">About</label>
                    <textarea 
                        className="w-full p-2 border rounded-md" 
                        rows="3"
                        value={formData.about}
                        onChange={(e) => setFormData({...formData, about: e.target.value})}
                    />
                </div>
                <button 
                    disabled={loading}
                    className="bg-primary text-white px-6 py-2 rounded-md hover:bg-secondary flex items-center gap-2"
                >
                    {loading ? "Saving..." : <><FiCheck /> Save Changes</>}
                </button>
            </form>
        </div>
    );
};

export default Profile;