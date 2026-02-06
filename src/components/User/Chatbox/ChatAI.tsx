import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

interface Message {
    id: string;
    type: 'user' | 'ai';
    message: string;
    timestamp: string;
}

const ChatAI = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            type: 'ai',
            message: 'Xin chào! Tôi là trợ lý AI. Tôi có thể giúp gì cho bạn?',
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
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
            type: 'user',
            message: inputValue,
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, newMessage]);
        setInputValue('');

        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                type: 'ai',
                message: 'Tôi đã nhận được câu hỏi của bạn. Đây là câu trả lời từ AI.',
                timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages((prev) => [...prev, aiResponse]);
        }, 1500);
    };

    return (
        <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, x: msg.type === 'user' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex mb-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className="max-w-[70%]">
                            {msg.type === 'ai' && (
                                <div className="flex items-start gap-2">
                                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 overflow-hidden">
                                        <img src="/gif/gemini.gif" alt="AI" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-2 shadow-sm">
                                        <p className="text-sm text-gray-800">{msg.message}</p>
                                    </div>
                                </div>
                            )}
                            {msg.type === 'user' && (
                                <div className="bg-primary text-white rounded-2xl rounded-tr-sm px-3 py-2">
                                    <p className="text-sm">{msg.message}</p>
                                </div>
                            )}
                            <p className={`text-xs text-gray-400 mt-1 ${msg.type === 'user' ? 'text-right' : 'ml-8'}`}>
                                {msg.timestamp}
                            </p>
                        </div>
                    </motion.div>
                ))}
                {isTyping && (
                    <div className="flex justify-start mb-3">
                        <div className="flex items-start gap-2">
                            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center overflow-hidden">
                                <img src="/gif/gemini.gif" alt="AI" className="w-full h-full object-cover" />
                            </div>
                            <div className="bg-white rounded-2xl px-3 py-2 shadow-sm">
                                <div className="flex gap-1">
                                    {[0, 1, 2].map((i) => (
                                        <motion.div
                                            key={i}
                                            className="w-2 h-2 bg-gray-400 rounded-full"
                                            animate={{ y: [0, -6, 0] }}
                                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
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
                        placeholder="Nhập tin nhắn với AI..."
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

export default ChatAI;
