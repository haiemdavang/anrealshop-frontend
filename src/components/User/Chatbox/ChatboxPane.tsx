import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import ChatAI from './ChatAI';
import ChatUser from './ChatUser';
import { useChatRooms } from '../../../hooks/useChat';
import type { ChatMessageResponse, ChatRoomResponse } from '../../../types/ChatType';
import { onChatMessage, sendRead } from '../../../service/websocketClient';
import showSuccessNotification from '../../Toast/NotificationSuccess';

interface ChatboxPaneProps {
    isOpen: boolean;
    onClose: () => void;
}

const formatTime = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    if (diffDays === 1) return 'Hôm qua';
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
};

const ChatboxPane = ({ isOpen, onClose }: ChatboxPaneProps) => {
    const { rooms, isLoading: isLoadingRooms, updateRoomLastMessage, incrementUnread, clearUnread } = useChatRooms();

    const [selectedConversation, setSelectedConversation] = useState<string>('ai-1');

    // Auto-select AI conversation on voice command
    useEffect(() => {
        const handleVoice = () => setSelectedConversation('ai-1');
        window.addEventListener('voice-command', handleVoice);
        return () => window.removeEventListener('voice-command', handleVoice);
    }, []);

    // Ref to pass incoming WS messages to active ChatUser
    const incomingMsgHandler = useRef<((msg: ChatMessageResponse) => void) | null>(null);

    // Track state in refs for WS callback (avoid stale closures)
    const isOpenRef = useRef(isOpen);
    const selectedConvRef = useRef(selectedConversation);
    useEffect(() => { isOpenRef.current = isOpen; }, [isOpen]);
    useEffect(() => { selectedConvRef.current = selectedConversation; }, [selectedConversation]);

    // Get partner name by roomId for notification
    const getPartnerName = useCallback((roomId: string) => {
        const room = rooms.find(r => r.roomId === roomId);
        return room?.partnerName || 'Tin nhắn mới';
    }, [rooms]);

    // Subscribe to WebSocket chat messages
    useEffect(() => {
        const unsubscribe = onChatMessage((msg: ChatMessageResponse) => {
            const roomId = msg.roomId;
            const isActiveRoom = isOpenRef.current && selectedConvRef.current === roomId;

            // Always update room list sidebar (last message + sort)
            updateRoomLastMessage(roomId, msg);

            if (isActiveRoom) {
                // Message for active room → push to ChatUser (skip sender's own echo)
                if (!msg.me) {
                    incomingMsgHandler.current?.(msg);
                    sendRead(roomId);
                }
            } else {
                // Not the active room → increment unread + show toast notification
                if (!msg.me) {
                    incrementUnread(roomId);
                    const partnerName = getPartnerName(roomId);
                    showSuccessNotification({
                        title: `Bạn có một tin nhắn mới từ ${partnerName}`,
                        message: msg.content.length > 80 ? msg.content.substring(0, 80) + '...' : msg.content,
                    });
                }
            }
        });

        return unsubscribe;
    }, [updateRoomLastMessage, incrementUnread, getPartnerName]);

    // Merge AI + real rooms
    const conversations = useMemo(() => {
        const ai = {
            id: 'ai-1',
            type: 'ai' as const,
            name: 'AI Assistant',
            lastMessage: 'Tôi có thể giúp gì cho bạn?',
            timestamp: '',
            unread: 0,
        };
        const userConvs = rooms.map((room: ChatRoomResponse) => ({
            id: room.roomId,
            type: 'user' as const,
            name: room.partnerName,
            avatar: room.partnerAvatar,
            lastMessage: room.lastMessage?.content || '',
            timestamp: formatTime(room.lastActive),
            unread: room.unreadCount,
            roomData: room,
        }));
        return [ai, ...userConvs];
    }, [rooms]);

    const currentConversation = conversations.find(c => c.id === selectedConversation);
    const totalConversations = conversations.length;

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
                                <p className="text-[10px] text-white/80">{totalConversations} cuộc hội thoại</p>
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
                                {isLoadingRooms && rooms.length === 0 ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    </div>
                                ) : (
                                    conversations.map((conv) => (
                                        <button
                                            key={conv.id}
                                            onClick={() => {
                                                setSelectedConversation(conv.id);
                                                if (conv.type === 'user') {
                                                    clearUnread(conv.id);
                                                    sendRead(conv.id);
                                                }
                                            }}
                                            className={`w-full p-3 flex items-start gap-3 hover:bg-white transition-colors border-b ${
                                                selectedConversation === conv.id ? 'bg-white border-l-2 border-l-primary' : ''
                                            }`}
                                        >
                                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                {conv.type === 'ai' ? (
                                                    <img src="/gif/gemini.gif" alt={conv.name} className="w-full h-full object-cover" />
                                                ) : conv.avatar ? (
                                                    <img src={conv.avatar} alt={conv.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-white text-sm font-bold">{conv.name.charAt(0)}</span>
                                                )}
                                            </div>
                                            <div className="flex-1 text-left overflow-hidden">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="text-sm font-semibold text-gray-800 truncate flex-1">{conv.name}</h4>
                                                    {conv.unread ? (
                                                        <span className="w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center ml-2 flex-shrink-0">
                                                            {conv.unread}
                                                        </span>
                                                    ) : null}
                                                </div>
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="text-xs text-gray-500 truncate flex-1">{conv.lastMessage}</p>
                                                    <p className="text-[10px] text-gray-400 flex-shrink-0">{conv.timestamp}</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Right Panel - Chat Content */}
                        <div className="flex-1 flex flex-col">
                            {currentConversation ? (
                                currentConversation.type === 'ai' ? (
                                    <ChatAI />
                                ) : (
                                    <ChatUser
                                        roomId={currentConversation.id}
                                        conversationName={currentConversation.name}
                                        participantAvatar={currentConversation.avatar}
                                        onIncomingMessage={incomingMsgHandler}
                                        onNewMessage={(msg) => {
                                            updateRoomLastMessage(currentConversation.id, msg);
                                        }}
                                    />
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
