import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

interface Message {
    id: string;
    userId: string;
    userName: string;
    message: string;
    timestamp: string;
    isMe: boolean;
}

interface ChatUserProps {
    conversationId: string;
    conversationName: string;
}

const ChatUser = ({ conversationName }: ChatUserProps) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            userId: 'admin',
            userName: conversationName,
            message: 'Xin chào! Chúng tôi có thể hỗ trợ gì cho bạn?',
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            isMe: false,
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            userId: 'me',
            userName: 'Bạn',
            message: inputValue,
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            isMe: true,
        };

        setMessages((prev) => [...prev, newMessage]);
        setInputValue('');
    };

    return (
        <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, x: msg.isMe ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex mb-3 ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className="max-w-[70%]">
                            {!msg.isMe && (
                                <div className="flex items-start gap-2">
                                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                                        {msg.userName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 mb-1">{msg.userName}</p>
                                        <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-2 shadow-sm">
                                            <p className="text-sm text-gray-800">{msg.message}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {msg.isMe && (
                                <div className="bg-primary text-white rounded-2xl rounded-tr-sm px-3 py-2">
                                    <p className="text-sm">{msg.message}</p>
                                </div>
                            )}
                            <p className={`text-xs text-gray-400 mt-1 ${msg.isMe ? 'text-right' : 'ml-8'}`}>
                                {msg.timestamp}
                            </p>
                        </div>
                    </motion.div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t bg-white">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={`Nhập tin nhắn với ${conversationName}...`}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-primary"
                    />
                    <button
                        onClick={handleSend}
                        className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors flex-shrink-0"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </div>
        </>
    );
};

export default ChatUser;
