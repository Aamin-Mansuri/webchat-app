import { useState, useRef, useEffect } from "react";
import { FiSend, FiPaperclip, FiSmile } from "react-icons/fi";
import EmojiPicker from "emoji-picker-react";
import { useSocket } from "../../context/SocketContext";
import API from "../../services/api";
import toast from "react-hot-toast";

const MessageInput = ({ chatId, receiverId, setMessages }) => {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { socket } = useSocket();
  
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null); // For throttling typing events

  // 1. Handle File Uploads (Images, Videos, PDFs)
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      return toast.error("File is too large. Max limit is 15MB");
    }

    const loadingToast = toast.loading("Uploading attachment...");
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('file', file); 
    formData.append('chatId', chatId);
    
    let type = 'image';
    if (file.type.includes('video')) type = 'video';
    else if (file.type.includes('audio')) type = 'audio';
    else if (file.type.includes('pdf')) type = 'pdf';
    formData.append('messageType', type);

    try {
        const { data } = await API.post('/messages', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        setMessages(prev => [...prev, data]);
        toast.success("File sent!", { id: loadingToast });
    } catch (err) {
        toast.error("Failed to send file", { id: loadingToast });
    } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = ""; 
    }
  };

  // 2. Optimized Typing Logic (Throttled)
  const handleTyping = (e) => {
    setText(e.target.value);
    if (!socket || !receiverId) return;

    // Send typing signal
    socket.emit("typing", { receiverId });

    // Clear previous timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // Set a timeout to send "stopTyping" after 2 seconds of silence
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { receiverId });
    }, 2000);
  };

  // 3. Handle Text Message Send
  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || isUploading) return;

    const messageContent = text; 
    setText(""); 
    setShowEmoji(false);

    try {
      // API call saves to DB and the Backend Controller handles the Socket emit to receiver
      const { data } = await API.post("/messages", { 
        content: messageContent, 
        chatId 
      });
      
      setMessages((prev) => [...prev, data]);
      
      if (socket) {
        socket.emit("stopTyping", { receiverId });
      }
    } catch (err) {
      toast.error("Failed to send message");
      setText(messageContent); // Revert text if failed
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  return (
    <div className="relative w-full">
      {/* Emoji Picker Overlay */}
      {showEmoji && (
        <div className="absolute bottom-20 left-0 z-50 shadow-2xl">
          <EmojiPicker
            theme="dark"
            onEmojiClick={(emojiData) => setText((prev) => prev + emojiData.emoji)}
          />
        </div>
      )}

      <form
        onSubmit={handleSend}
        className="flex items-center gap-3 bg-[#202c33] p-2 px-4 rounded-2xl border border-white/5 shadow-2xl"
      >
        <button
          type="button"
          onClick={() => setShowEmoji(!showEmoji)}
          className={`transition-colors ${showEmoji ? 'text-primary' : 'text-slate-400 hover:text-white'}`}
        >
          <FiSmile className="text-2xl" />
        </button>

        <label className="cursor-pointer text-slate-400 hover:text-white transition-colors">
          <FiPaperclip className={`text-2xl ${isUploading ? 'animate-pulse text-primary' : ''}`} />
          <input
            type="file"
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>

        <input
          type="text"
          value={text}
          onChange={handleTyping}
          placeholder={isUploading ? "Uploading..." : "Type a message"}
          className="flex-1 bg-transparent py-3 text-slate-200 outline-none placeholder:text-slate-500 text-sm"
          disabled={isUploading}
        />

        <button
          type="submit"
          disabled={!text.trim() || isUploading}
          className="bg-primary hover:bg-indigo-500 text-white p-3 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-30 disabled:grayscale"
        >
          <FiSend className="text-xl" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;