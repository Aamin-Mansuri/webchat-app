import { useState, useEffect } from 'react';
import Sidebar from '../components/chat/Sidebar';
import ChatWindow from '../components/chat/ChatWindow';
import WelcomeScreen from '../components/chat/WelcomeScreen';
import ProfileDrawer from '../components/chat/ProfileDrawer'; // Bring this back
import API from '../services/api';
import { AnimatePresence } from 'framer-motion';

const Home = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [chats, setChats] = useState([]);
    const [showProfile, setShowProfile] = useState(false); // State for drawer

    const fetchChats = async () => {
        try {
            const { data } = await API.get('/chats');
            setChats(data);
        } catch (error) { console.error(error); }
    };

    useEffect(() => { fetchChats(); }, []);

    return (
        <div className="flex h-screen bg-[#0f172a] overflow-hidden relative">

            {/* PROFILE DRAWER - Animated Slide */}
            <AnimatePresence>
                {showProfile && (
                    <ProfileDrawer onClose={() => setShowProfile(false)} />
                )}
            </AnimatePresence>

            <div className="flex w-full h-full z-10">
                <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} w-full md:w-[400px] border-r border-white/5`}>
                    <Sidebar 
                        chats={chats} 
                        setSelectedChat={setSelectedChat} 
                        selectedChat={selectedChat} 
                        refreshChats={fetchChats}
                        onOpenProfile={() => setShowProfile(true)} // Trigger for Sidebar
                    />
                </div>

                <div className={`${selectedChat ? 'flex' : 'hidden md:flex'} flex-1 bg-white/5`}>
                    {selectedChat ? (
                        <ChatWindow 
                            chat={selectedChat} 
                            setSelectedChat={setSelectedChat} 
                        />
                    ) : (
                        <WelcomeScreen />
                    )}
                </div>
            </div>
        </div>
    );
};
export default Home;