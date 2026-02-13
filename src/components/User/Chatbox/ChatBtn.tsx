import { useState, useEffect } from 'react';
import ChatboxPane from './ChatboxPane';

const ChatBtn = () => {
    const [isChatboxOpen, setIsChatboxOpen] = useState(false);

    // Auto-open chatbox on voice command
    useEffect(() => {
        const handleVoice = () => setIsChatboxOpen(true);
        window.addEventListener('voice-command', handleVoice);
        return () => window.removeEventListener('voice-command', handleVoice);
    }, []);

    return (
        <>
            {/* Chatbox */}
            {isChatboxOpen && (
                <ChatboxPane isOpen={isChatboxOpen} onClose={() => setIsChatboxOpen(false)} />
            )}

            {/* Floating Chat Button */}
            {!isChatboxOpen && (
                <button
                    onClick={() => setIsChatboxOpen(true)}
                    className="fixed bottom-6 right-6 w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all z-[9997] flex items-center justify-center group hover:scale-110"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                </button>
            )}
        </>
    );
};

export default ChatBtn;
