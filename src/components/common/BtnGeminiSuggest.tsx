import { Tooltip } from '@mantine/core';
import React, { useCallback, useState } from 'react';
import showErrorNotification from '../Toast/NotificationError';
import { getErrorMessage } from '../../untils/ErrorUntils';

interface GeminiSuggestWrapperProps {
    /** Nội dung field (TextInput, Textarea, RichTextEditor, …) */
    children: React.ReactNode;
    /**
     * Callback được gọi với text mới do AI sinh ra.
     */
    onSuggest: (suggestedText: string) => void;
    /**
     * Hàm gọi API Gemini thực tế (async).
     * Nếu không truyền, sẽ dùng text giả lập mặc định.
     */
    fetchSuggestion?: () => Promise<string>;
    /** Tooltip label hiển thị khi hover icon */
    tooltipLabel?: string;
    /** Khoảng cách từ góc trên bên phải (px), mặc định 4 */
    offsetTop?: number;
    offsetRight?: number;
}


export const GeminiSuggestWrapper = ({
    children,
    onSuggest,
    fetchSuggestion,
    tooltipLabel = 'Gợi ý bằng Gemini AI',
    offsetTop = 30,
    offsetRight = 4,
}: GeminiSuggestWrapperProps) => {
    const [loading, setLoading] = useState(false);

    const handleClick = useCallback(async () => {
        if (loading) return;
        setLoading(true);
        try {
            const text = fetchSuggestion
                ? await fetchSuggestion()
                : "";
            onSuggest(text);
        } catch (err) {
            showErrorNotification("Lỗi", getErrorMessage(err) || "Lỗi khi gợi ý bằng Gemini AI");
        } finally {
            setLoading(false);
        }
    }, [loading, fetchSuggestion, onSuggest]);

    return (
        <div style={{ position: 'relative', display: 'block' }}>
            {/* Field con */}
            {children}

            {/* Nút Gemini – absolute, đè lên góc trên bên phải */}
            <div
                style={{
                    position: 'absolute',
                    top: offsetTop,
                    right: offsetRight,
                    zIndex: 10,
                    lineHeight: 1,
                }}
            >
                <Tooltip label={tooltipLabel} position="top" withArrow>
                    <button
                        type="button"
                        onClick={handleClick}
                        disabled={loading}
                        aria-label={tooltipLabel}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 26,
                            height: 26,
                            padding: 0,
                            border: 'none',
                            borderRadius: 6,
                            background: 'rgba(114, 182, 255, 0.85)',
                            backdropFilter: 'blur(4px)',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.6 : 1,
                            transition: 'opacity 0.2s, transform 0.15s, box-shadow 0.15s',
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                const btn = e.currentTarget as HTMLButtonElement;
                                btn.style.transform = 'scale(1.18)';
                                btn.style.boxShadow = '0 2px 8px rgba(66,133,244,0.35)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            const btn = e.currentTarget as HTMLButtonElement;
                            btn.style.transform = 'scale(1)';
                            btn.style.boxShadow = '0 1px 4px rgba(0,0,0,0.15)';
                        }}
                    >
                        {loading ? (
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                style={{ animation: 'gemini-spin 0.9s linear infinite' }}
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="#4285F4"
                                    strokeWidth="2.5"
                                    strokeDasharray="40 20"
                                />
                                <style>{`
                                    @keyframes gemini-spin {
                                        to { transform: rotate(360deg); }
                                    }
                                `}</style>
                            </svg>
                        ) : (
                            <img
                                src="/images/Gemini-Symbol.png"
                                alt="Gemini AI"
                                width={20}
                                height={20}
                                style={{ objectFit: 'contain', display: 'block' }}
                            />
                        )}
                    </button>
                </Tooltip>
            </div>
        </div>
    );
};

export default GeminiSuggestWrapper;
