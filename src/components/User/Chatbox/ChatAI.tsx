import { motion } from 'framer-motion';
import { useState, useRef, useEffect, useCallback } from 'react';
import { ChatService } from '../../../service/ChatService';
import type { ChatbotHistoryResponse } from '../../../types/ChatType';

interface Message {
    id: string;
    type: 'user' | 'ai';
    message: string;
    timestamp: string;
    imageUrl?: string;
    imageUrls?: string[];
    productLink?: string;
}

const formatTime = (dateStr?: string) => {
    const date = dateStr ? new Date(dateStr) : new Date();
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

const ChatAI = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const isFirstLoad = useRef(true);

    // Convert history item to Message pair (user question + ai answer)
    const historyToMessages = (item: ChatbotHistoryResponse): Message[] => [
        {
            id: `${item.id}-q`,
            type: 'user',
            message: item.question,
            timestamp: formatTime(item.createdAt),
        },
        {
            id: `${item.id}-a`,
            type: 'ai',
            message: item.answer,
            timestamp: formatTime(item.createdAt),
            ...(item.imageUrl && { imageUrl: item.imageUrl }),
            ...(item.productLink && { productLink: item.productLink }),
        },
    ];

    // Fetch chatbot history
    const fetchHistory = useCallback(async (page: number = 0) => {
        setIsLoadingHistory(true);
        try {
            const response = await ChatService.getChatbotHistory(page, 10);
            const historyMessages = response.content
                .reverse()
                .flatMap(historyToMessages);

            setMessages(prev =>
                page === 0 ? historyMessages : [...historyMessages, ...prev]
            );
            setCurrentPage(response.number);
            setHasMore(response.number + 1 < response.totalPages);
        } catch {
            // Silently fail, show welcome message
        } finally {
            setIsLoadingHistory(false);
        }
    }, []);

    // Load history on mount
    useEffect(() => {
        fetchHistory(0);
    }, [fetchHistory]);

    // Scroll to bottom on first load / new messages
    useEffect(() => {
        if (isFirstLoad.current && messages.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
            isFirstLoad.current = false;
        } else if (!isFirstLoad.current) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Load more on scroll to top
    const handleScroll = useCallback(() => {
        const container = messagesContainerRef.current;
        if (container && container.scrollTop === 0 && hasMore && !isLoadingHistory) {
            fetchHistory(currentPage + 1);
        }
    }, [hasMore, isLoadingHistory, currentPage, fetchHistory]);

    const handleSend = async () => {
        if (!inputValue.trim() || isTyping) return;

        const chatInput = inputValue.trim();
        const userMsg: Message = {
            id: `user-${Date.now()}`,
            type: 'user',
            message: chatInput,
            timestamp: formatTime(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        try {
            const response = await ChatService.askChatbot({ chatInput });
            const aiMsg: Message = {
                id: `ai-${Date.now()}`,
                type: 'ai',
                message: response.message,
                timestamp: formatTime(),
                ...(response.imageUrl && { imageUrl: response.imageUrl }),
                ...(response.imageUrls?.length && { imageUrls: response.imageUrls }),
                ...(response.productLink && { productLink: response.productLink }),
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch {
            const errorMsg: Message = {
                id: `error-${Date.now()}`,
                type: 'ai',
                message: 'Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này. Vui lòng thử lại sau.',
                timestamp: formatTime(),
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* Messages */}
            <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 bg-gray-50"
            >
                {/* Loading older history */}
                {isLoadingHistory && messages.length > 0 && (
                    <div className="flex justify-center py-2">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {/* Initial loading */}
                {isLoadingHistory && messages.length === 0 && (
                    <div className="flex items-center justify-center h-full">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {/* Welcome message when no history */}
                {!isLoadingHistory && messages.length === 0 && (
                    <div className="flex justify-start mb-3">
                        <div className="flex items-start gap-2 max-w-[70%]">
                            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 overflow-hidden">
                                <img src="/gif/gemini.gif" alt="AI" className="w-full h-full object-cover" />
                            </div>
                            <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-2 shadow-sm">
                                <p className="text-sm text-gray-800">Xin chào! Tôi là trợ lý AI. Tôi có thể giúp gì cho bạn?</p>
                            </div>
                        </div>
                    </div>
                )}

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
                                        <p className="text-sm text-gray-800 whitespace-pre-wrap">{msg.message}</p>
                                        {(msg.imageUrl || msg.imageUrls?.length) && (
                                            <div className="mt-2 flex flex-col gap-2">
                                                {msg.imageUrl && (
                                                    <img
                                                        src={msg.imageUrl}
                                                        alt="Sản phẩm"
                                                        className="w-full max-w-[200px] rounded-lg object-cover"
                                                    />
                                                )}
                                                {msg.imageUrls?.filter(url => url !== msg.imageUrl).map((url, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={url}
                                                        alt="Sản phẩm"
                                                        className="w-full max-w-[200px] rounded-lg object-cover"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                        {msg.productLink && (
                                            <a
                                                href={`/products${msg.productLink}`}
                                                className="inline-block mt-2 text-sm text-primary hover:underline font-medium"
                                            >
                                                Xem thêm →
                                            </a>
                                        )}
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

                {/* Typing indicator */}
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
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Nhập tin nhắn với AI..."
                        disabled={isTyping}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-primary disabled:opacity-50"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputValue.trim() || isTyping}
                        className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors flex-shrink-0 disabled:opacity-50"
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
