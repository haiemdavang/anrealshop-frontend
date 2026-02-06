import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import ChatAI from './ChatAI';
import ChatUser from './ChatUser';

interface Conversation {
    id: string;
    type: 'ai' | 'user';
    name: string;
    avatar?: string;
    lastMessage: string;
    timestamp: string;
    unread?: number;
}

interface ChatboxPaneProps {
    isOpen: boolean;
    onClose: () => void;
}

const ChatboxPane = ({ isOpen, onClose }: ChatboxPaneProps) => {
    const [conversations] = useState<Conversation[]>([
        {
            id: 'ai-1',
            type: 'ai',
            name: 'AI Assistant',
            lastMessage: 'Tôi có thể giúp gì cho bạn?',
            timestamp: '10:30',
            unread: 1,
        },
        {
            id: 'user-1',
            type: 'user',
            name: 'Admin Support',
            lastMessage: 'Chúng tôi sẽ hỗ trợ bạn ngay',
            timestamp: '09:15',
        },
        {
            id: 'user-2',
            type: 'user',
            name: 'Nguyễn Văn A',
            lastMessage: 'Cảm ơn bạn!',
            timestamp: 'Hôm qua',
        },
    ]);

    const [selectedConversation, setSelectedConversation] = useState<string>('ai-1');

    const currentConversation = conversations.find(c => c.id === selectedConversation);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="fixed bottom-6 right-6 w-[700px] h-[500px] bg-white rounded-2xl shadow-2xl z-[9998] flex flex-col overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-primary text-white px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                                <img src="/gif/gemini.gif" alt="Chat" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">Tin nhắn</h3>
                                <p className="text-[10px] text-white/80">{conversations.length} cuộc hội thoại</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-7 h-7 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Two Panel Layout */}
                    <div className="flex flex-1 overflow-hidden">
                        {/* Left Panel - Conversation List */}
                        <div className="w-64 border-r bg-gray-50 flex flex-col">
                            <div className="p-3 border-b bg-white">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm..."
                                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {conversations.map((conv) => (
                                    <button
                                        key={conv.id}
                                        onClick={() => setSelectedConversation(conv.id)}
                                        className={`w-full p-3 flex items-start gap-3 hover:bg-white transition-colors border-b ${
                                            selectedConversation === conv.id ? 'bg-white border-l-2 border-l-primary' : ''
                                        }`}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 overflow-hidden">
                                            {conv.type === 'ai' ? (
                                                <img src="/gif/gemini.gif" alt={conv.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-white text-sm font-bold">{conv.name.charAt(0)}</span>
                                            )}
                                        </div>
                                        <div className="flex-1 text-left overflow-hidden">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="text-sm font-semibold text-gray-800 truncate flex-1">{conv.name}</h4>
                                                {conv.unread && (
                                                    <span className="w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center ml-2 flex-shrink-0">
                                                        {conv.unread}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-xs text-gray-500 truncate flex-1">{conv.lastMessage}</p>
                                                <p className="text-[10px] text-gray-400 flex-shrink-0">{conv.timestamp}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right Panel - Chat Content */}
                        <div className="flex-1 flex flex-col">
                            {currentConversation ? (
                                currentConversation.type === 'ai' ? (
                                    <ChatAI />
                                ) : (
                                    <ChatUser conversationId={currentConversation.id} conversationName={currentConversation.name} />
                                )
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-gray-400">
                                    Chọn cuộc hội thoại để bắt đầu
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ChatboxPane;
