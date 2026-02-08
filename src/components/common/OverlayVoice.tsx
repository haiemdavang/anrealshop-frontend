import { motion } from 'framer-motion';

interface OverlayVoiceProps {
    visible: boolean;
    message?: string;
    isRecording?: boolean;
}

const OverlayVoice = ({ visible, message = 'Đang nghe...', isRecording = false }: OverlayVoiceProps) => {
    if (!visible) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/5 backdrop-blur-md pb-8"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-6 bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-2xl"
            >
                {/* Microphone Icon with Pulse Animation */}
                <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
                    {isRecording && (
                        <motion.div
                            className="absolute inset-0 rounded-full bg-red-500/20"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    )}
                    <motion.div
                        className={`w-16 h-16 rounded-full flex items-center justify-center bg-primary`}
                        animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                            />
                        </svg>
                    </motion.div>
                </div>

                {/* Message Text and Voice Wave */}
                <div className="flex items-center gap-4">
                    <motion.p
                        className="text-lg font-semibold text-gray-800"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        {message}
                    </motion.p>

                    {/* Voice Wave Animation */}
                    <div className="flex gap-1 h-8 items-end">
                        {[0, 1, 2, 3, 4].map((i) => (
                            <motion.div
                                key={i}
                                className={`w-1.5 rounded-full bg-primary`}
                                animate={{
                                    height: ['10px', '32px', '10px'],
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.1,
                                    ease: 'easeInOut',
                                }}
                            />
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default OverlayVoice;
