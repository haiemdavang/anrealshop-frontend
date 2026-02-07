import { motion } from 'framer-motion';
import { useState, useRef, useEffect, useCallback, type MutableRefObject } from 'react';
import { useChatMessages } from '../../../hooks/useChat';
import { sendMessage } from '../../../service/websocketClient';
import type { ChatMessageResponse } from '../../../types/ChatType';

interface ChatUserProps {
    roomId: string;
    conversationName: string;
    participantAvatar?: string;
    onIncomingMessage?: MutableRefObject<((msg: ChatMessageResponse) => void) | null>;
    onNewMessage?: (msg: ChatMessageResponse) => void;
}

const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

const ChatUser = ({ roomId, conversationName, participantAvatar, onIncomingMessage, onNewMessage }: ChatUserProps) => {
    const { messages, isLoading, hasMore, loadMore, addMessage } = useChatMessages(roomId);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const isFirstLoad = useRef(true);

    // Register handler for receiving WS messages from ChatboxPane
    useEffect(() => {
        if (onIncomingMessage) {
            onIncomingMessage.current = (msg: ChatMessageResponse) => {
                addMessage(msg);
            };
            return () => { onIncomingMessage.current = null; };
        }
    }, [onIncomingMessage, addMessage]);

    // Scroll to bottom on first load and new messages
    useEffect(() => {
        if (isFirstLoad.current && messages.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
            isFirstLoad.current = false;
        } else if (!isFirstLoad.current) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Reset first load flag when roomId changes
    useEffect(() => {
        isFirstLoad.current = true;
    }, [roomId]);

    // Scroll handler for loading older messages
    const handleScroll = useCallback(() => {
        const container = messagesContainerRef.current;
        if (container && container.scrollTop === 0 && hasMore && !isLoading) {
            loadMore();
        }
    }, [hasMore, isLoading, loadMore]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        // Send via WebSocket
        sendMessage('/chat.send', {
            roomId,
            content: inputValue.trim(),
            type: 'TEXT',
        });

        // Optimistic UI: add message locally
        const optimisticMsg: ChatMessageResponse = {
            id: `temp-${Date.now()}`,
            roomId,
            senderRole: 'USER',
            type: 'text',
            content: inputValue.trim(),
            read: false,
            me: true,
            createdAt: new Date().toISOString(),
        };
        addMessage(optimisticMsg);
        onNewMessage?.(optimisticMsg);

        setInputValue('');
    };

    return (
        <>
            {/* Messages */}
            <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 bg-gray-50"
            >
                {/* Loading older messages */}
                {isLoading && messages.length > 0 && (
                    <div className="flex justify-center py-2">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {/* Initial loading */}
                {isLoading && messages.length === 0 && (
                    <div className="flex items-center justify-center h-full">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {/* Empty state */}
                {!isLoading && messages.length === 0 && (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện!
                    </div>
                )}

                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, x: msg.me ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex mb-3 ${msg.me ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className="max-w-[70%]">
                            {!msg.me && (
                                <div className="flex items-start gap-2">
                                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 overflow-hidden">
                                        {participantAvatar ? (
                                            <img src={participantAvatar} alt={conversationName} className="w-full h-full object-cover" />
                                        ) : (
                                            conversationName.charAt(0)
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 mb-1">{conversationName}</p>
                                        <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-2 shadow-sm">
                                            <p className="text-sm text-gray-800">{msg.content}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {msg.me && (
                                <div className="bg-primary text-white rounded-2xl rounded-tr-sm px-3 py-2">
                                    <p className="text-sm">{msg.content}</p>
                                </div>
                            )}
                            <p className={`text-xs text-gray-400 mt-1 ${msg.me ? 'text-right' : 'ml-8'}`}>
                                {formatTime(msg.createdAt)}
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
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={`Nhập tin nhắn với ${conversationName}...`}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-primary"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputValue.trim()}
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

export default ChatUser;
