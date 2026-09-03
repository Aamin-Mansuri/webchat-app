import { useState, useEffect, useRef } from "react";
import { useAuth, useSocket } from "../../hooks/useContexts";
import { FiArrowLeft, FiMoreVertical, FiShield } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import API from "../../services/api";
import toast from "react-hot-toast";

const ChatWindow = ({ chat, setSelectedChat }) => {
  const { user, setUser } = useAuth();
  const { socket } = useSocket();

  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef();

  const otherUser = chat.participants.find((p) => p._id !== user?._id);
  const didIBlock = user?.blockedUsers?.includes(otherUser?._id);
  const amIBlocked = otherUser?.blockedUsers?.includes(user?._id);

  // 1. Fetch History & Trigger Seen Status
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await API.get(`/messages/${chat._id}`);
        setMessages(data);

        // Tell Alice (the sender) I've seen her old messages
        if (socket) {
          socket.emit("mark-as-seen", {
            chatId: chat._id,
            userId: user._id,
            senderId: otherUser?._id,
          });
        }
      } catch (err) {
        console.error("History Error", err);
      }
    };

    if (chat?._id) fetchMessages();
  }, [chat._id, user._id, otherUser?._id, socket]);

  // 2. Real-time Socket Handlers
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (
        msg.conversationId === chat._id ||
        msg.conversationId?._id === chat._id
      ) {
        setMessages((prev) => [...prev, msg]);

        // If I'm looking at the chat, mark this new message as seen instantly
        socket.emit("mark-as-seen", {
          chatId: chat._id,
          userId: user._id,
          senderId: otherUser?._id,
        });
      }
    };

    const handleSeenSync = ({ chatId }) => {
      if (chatId === chat._id) {
        setMessages((prev) => prev.map((m) => ({ ...m, seen: true })));
      }
    };

    const handleTyping = (id) => {
      if (id === otherUser?._id) setIsTyping(true);
    };
    const handleStopTyping = () => setIsTyping(false);

    socket.on("getMessage", handleNewMessage);
    socket.on("messages-seen-sync", handleSeenSync);
    socket.on("displayTyping", handleTyping);
    socket.on("hideTyping", handleStopTyping);

    return () => {
      socket.off("getMessage", handleNewMessage);
      socket.off("messages-seen-sync", handleSeenSync);
      socket.off("displayTyping", handleTyping);
      socket.off("hideTyping", handleStopTyping);
    };
  }, [socket, chat._id, otherUser?._id, user._id]);

  useEffect(() => {
    socket.on("getMessage", (newMsg) => {
      if (newMsg.conversationId === chat._id) {
        setMessages((prev) => [...prev, newMsg]);
      }
    });
    return () => socket.off("getMessage");
  }, [chat._id]);

  // 3. Auto-Scroll Logic
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleBlockToggle = async () => {
    try {
      const { data } = await API.put(`/users/block/${otherUser._id}`);
      setUser({ ...user, blockedUsers: data.blockedUsers });
      toast.success(didIBlock ? "User Unblocked" : "User Blocked");
    } catch (e) {
      toast.error("Action failed");
    }
  };
 useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = (msg) => {
        // 1. Ensure message belongs to this chat
        if (msg.conversationId === chat._id || msg.conversationId?._id === chat._id) {
            
            setMessages((prev) => {
                // 2. DEDUPLICATION: If ID already exists, don't add it
                const isDuplicate = prev.some(m => m._id === msg._id);
                if (isDuplicate) return prev;
                
                return [...prev, msg];
            });

            // 3. Mark as seen
            socket.emit("mark-as-seen", {
                chatId: chat._id,
                senderId: msg.sender._id || msg.sender,
                receiverId: user._id
            });
        }
    };

    socket.on("getMessage", handleIncomingMessage);

    // 4. CLEANUP: This prevents the "2 message" bug caused by React re-renders
    return () => {
        socket.off("getMessage", handleIncomingMessage);
    };
}, [socket, chat._id, user._id]);

  return (
    <div className="flex flex-col h-full w-full bg-[#0b141a] relative overflow-hidden">
      {/* --- HEADER --- */}
      <header className="p-4 bg-[#202c33] flex justify-between items-center shadow-lg z-30">
        <div className="flex items-center gap-3">
          <FiArrowLeft
            className="md:hidden text-slate-300 text-xl cursor-pointer"
            onClick={() => setSelectedChat(null)}
          />
          <div className="relative">
            <img
              src={otherUser?.avatar?.url}
              className="w-10 h-10 rounded-full border border-white/10 object-cover"
              alt="avatar"
            />
            <div
              className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-[#202c33] rounded-full ${isTyping ? "bg-primary" : "bg-emerald-500"}`}
            />
          </div>
          <div>
            <h3 className="text-slate-100 font-bold text-sm leading-tight">
              {otherUser?.firstName} {otherUser?.lastName}
            </h3>
            <p className="text-[10px] text-primary font-medium tracking-wide">
              {isTyping ? "typing..." : "Online"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5 text-slate-400">
          {/* {!didIBlock && !amIBlocked && (
                        <>
                            <FiPhone 
                                className="cursor-pointer hover:text-white transition" 
                                onClick={() => startCall(otherUser._id, otherUser.firstName, otherUser.avatar.url, 'audio')} 
                            />
                            <FiVideo 
                                className="cursor-pointer hover:text-white transition" 
                                onClick={() => startCall(otherUser._id, otherUser.firstName, otherUser.avatar.url, 'video')} 
                            />
                        </>
                    )} */}
          <button
            onClick={handleBlockToggle}
            className={`text-[10px] uppercase font-black px-2 py-1 rounded ${didIBlock ? "text-emerald-400 bg-emerald-400/10" : "text-rose-400 bg-rose-400/10"}`}
          >
            {didIBlock ? "Unblock" : "Block"}
          </button>
        </div>
      </header>

      {/* --- MESSAGES AREA --- */}
      <main className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-fixed">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <MessageBubble
              key={m._id}
              message={m}
              isOwn={m.sender._id === user._id || m.sender === user._id}
            />
          ))}
        </AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-[#202c33] text-primary text-xs px-4 py-2 rounded-2xl rounded-bl-none">
              typing...
            </div>
          </motion.div>
        )}
        <div ref={scrollRef} />
      </main>

      {/* --- INPUT AREA --- */}
      <footer className="p-4 bg-[#202c33] z-30">
        {didIBlock ?
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-center text-xs rounded-xl font-bold">
            YOU HAVE BLOCKED THIS CONTACT
          </div>
        : amIBlocked ?
          <div className="p-3 bg-white/5 text-slate-500 text-center text-xs rounded-xl">
            YOU CAN NO LONGER MESSAGE THIS CONTACT
          </div>
        : <MessageInput
            chatId={chat._id}
            receiverId={otherUser?._id}
            setMessages={setMessages}
          />
        }
      </footer>
    </div>
  );
};

export default ChatWindow;
