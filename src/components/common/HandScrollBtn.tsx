import { useState } from 'react';
import HandScroll from './HandScroll';
import showSuccessNotification from '../Toast/NotificationSuccess';

const HandScrollBtn = () => {
  const [enabled, setEnabled] = useState(false);

  return (
    <>
      <HandScroll enabled={enabled} onDisable={() => {
        setEnabled(false);
        showSuccessNotification('Trải nghiệm tiêu cực', 'Đã tắt điều khiển tay!');
      }} />

      <button
        onClick={() => {
            setEnabled((v) => !v);
            showSuccessNotification(enabled ? 'Trải nghiệm tiêu cực' : 'Trải nghiệm tích cực', enabled ? 'Đã tắt điều khiển tay!' : 'Đã bật điều khiển tay!');
        }}
        className={`fixed bottom-20 right-6 w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all z-[9997] flex items-center justify-center hover:scale-110 ${
          enabled
            ? 'bg-green-500 text-white'
            : 'bg-gray-600 text-white'
        }`}
        title={enabled ? 'Tắt điều khiển tay' : 'Bật điều khiển tay'}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-2V11m0-5.5v-1a1.5 1.5 0 013 0v1.5m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
        </svg>
      </button>
    </>
  );
};

export default HandScrollBtn;
