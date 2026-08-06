import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import MessageInput from './MessageInput';
import MessageBubble from './MessageBubble';
import { FiPhone, FiVideo, FiInfo } from 'react-icons/fi';
import API from '../../services/api';

const ChatContainer = ({ chat }) => {
    const { user } = useAuth();
    const { socket } = useSocket();
    const [messages, setMessages] = useState([]);
    const [typing, setTyping] = useState(false);
    const scrollRef = useRef();

    const otherUser = chat.participants.find(p => p._id !== user._id);

    // Fetch Messages
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const { data } = await API.get(`/messages/${chat._id}`);
                setMessages(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchMessages();
    }, [chat]);

    // Socket Listeners
    useEffect(() => {
        if (!socket) return;

        socket.on('getMessage', (newMessage) => {
            if (chat._id === newMessage.conversationId._id) {
                setMessages((prev) => [...prev, newMessage]);
            }
        });

        socket.on('displayTyping', (senderId) => {
            if (senderId === otherUser._id) setTyping(true);
        });

        socket.on('hideTyping', () => setTyping(false));

        return () => {
            socket.off('getMessage');
            socket.off('displayTyping');
            socket.off('hideTyping');
        };
    }, [socket, chat, otherUser]);

    // Auto-scroll
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="p-4 border-b flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                    <img src={otherUser?.avatar?.url} className="w-10 h-10 rounded-full" alt="" />
                    <div>
                        <h2 className="font-bold">{otherUser?.firstName}</h2>
                        <p className="text-xs text-green-500">{typing ? 'typing...' : 'Online'}</p>
                    </div>
                </div>
                <div className="flex gap-5 text-gray-500 text-xl">
                    <FiPhone className="cursor-pointer hover:text-primary" />
                    <FiVideo className="cursor-pointer hover:text-primary" />
                    <FiInfo className="cursor-pointer hover:text-primary" />
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8fafc]">
                {messages.map((msg) => (
                    <MessageBubble key={msg._id} message={msg} isOwn={msg.sender._id === user._id || msg.sender === user._id} />
                ))}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <MessageInput chatId={chat._id} receiverId={otherUser._id} setMessages={setMessages} />
        </div>
    );
};

export default ChatContainer;