import { useState } from 'react';
import API from '../../services/api';
import toast from 'react-hot-toast';

const CreateGroupModal = ({ isOpen, onClose, refreshChats }) => {
    const [groupName, setGroupName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) return;
        const { data } = await API.get(`/users/search?search=${query}`);
        setSearchResults(data.users);
    };

    const handleCreate = async () => {
        if (!groupName || selectedUsers.length < 2) {
            return toast.error("Provide a name and at least 2 friends");
        }
        try {
            await API.post('/chats/group', {
                name: groupName,
                users: JSON.stringify(selectedUsers.map(u => u._id))
            });
            toast.success("Group created!");
            refreshChats();
            onClose();
        } catch (error) {
            toast.error("Failed to create group");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Create Group Chat</h2>
                <input 
                    placeholder="Group Name" 
                    className="w-full p-2 border rounded-md mb-4"
                    onChange={(e) => setGroupName(e.target.value)}
                />
                <input 
                    placeholder="Search friends..." 
                    className="w-full p-2 border rounded-md mb-2"
                    onChange={(e) => handleSearch(e.target.value)}
                />
                
                <div className="flex flex-wrap gap-2 mb-4">
                    {selectedUsers.map(u => (
                        <span key={u._id} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                            {u.firstName} 
                            <button onClick={() => setSelectedUsers(selectedUsers.filter(x => x._id !== u._id))} className="ml-1">x</button>
                        </span>
                    ))}
                </div>

                <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                    {searchResults.map(user => (
                        <div 
                            key={user._id} 
                            onClick={() => setSelectedUsers([...selectedUsers, user])}
                            className="p-2 hover:bg-slate-100 cursor-pointer flex items-center gap-2"
                        >
                            <img src={user.avatar.url} className="w-8 h-8 rounded-full" />
                            <span>{user.firstName} {user.lastName}</span>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 text-gray-500">Cancel</button>
                    <button onClick={handleCreate} className="bg-primary text-white px-4 py-2 rounded-md">Create</button>
                </div>
            </div>
        </div>
    );
};

export default CreateGroupModal;