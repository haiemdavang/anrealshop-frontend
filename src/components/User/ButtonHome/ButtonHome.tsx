import { useState, useEffect, useRef } from 'react';
import HandScroll from '../../common/HandScroll';
import ChatboxPane from '../Chatbox/ChatboxPane';
import showSuccessNotification from '../../Toast/NotificationSuccess';

const ButtonHome = ({ showChat = false }: { showChat?: boolean }) => {
  const [open, setOpen] = useState(false);
  const [handEnabled, setHandEnabled] = useState(false);
  const [isChatboxOpen, setIsChatboxOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Auto-open chatbox on voice command
  useEffect(() => {
    const handleVoice = () => setIsChatboxOpen(true);
    window.addEventListener('voice-command', handleVoice);
    return () => window.removeEventListener('voice-command', handleVoice);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <>
      {/* Hand scroll overlay */}
      <HandScroll
        enabled={handEnabled}
        onDisable={() => {
          setHandEnabled(false);
          showSuccessNotification('Trải nghiệm tiêu cực', 'Đã tắt điều khiển tay!');
        }}
      />

      {/* Chatbox pane */}
      {isChatboxOpen && (
        <ChatboxPane isOpen={isChatboxOpen} onClose={() => setIsChatboxOpen(false)} />
      )}

      {/* FAB group */}
      <div ref={menuRef} className="fixed bottom-6 right-6 z-[9997] flex flex-col-reverse items-center gap-3">
        {/* Main toggle button */}
        <button
          onClick={() => setOpen((v) => !v)}
          className={`w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center hover:scale-110 bg-primary text-white ${
            open ? 'rotate-45' : ''
          }`}
          title="Menu"
        >
          <svg className="w-6 h-6 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>

        {/* Sub-buttons (expand upward) */}
        <div
          className={`flex flex-col items-center gap-3 transition-all duration-300 origin-bottom ${
            open
              ? 'opacity-100 scale-100 pointer-events-auto'
              : 'opacity-0 scale-75 pointer-events-none'
          }`}
        >
          {/* Hand scroll button */}
          <button
            onClick={() => {
              setHandEnabled((v) => !v);
              showSuccessNotification(
                handEnabled ? 'Trải nghiệm tiêu cực' : 'Trải nghiệm tích cực',
                handEnabled ? 'Đã tắt điều khiển tay!' : 'Đã bật điều khiển tay!',
              );
            }}
            className={`w-10 h-10 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center hover:scale-110 ${
              handEnabled ? 'bg-green-500 text-white' : 'bg-gray-600 text-white'
            }`}
            title={handEnabled ? 'Tắt điều khiển tay' : 'Bật điều khiển tay'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-2V11m0-5.5v-1a1.5 1.5 0 013 0v1.5m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
              />
            </svg>
          </button>

          {/* Chat button */}
          {showChat && !isChatboxOpen && (
            <button
              onClick={() => {
                setIsChatboxOpen(true);
                setOpen(false);
              }}
              className="w-9 h-9 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center hover:scale-110 relative"
              title="Mở chat"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ButtonHome;
