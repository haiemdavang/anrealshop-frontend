import { Divider, Paper, Stack, Text, Title } from '@mantine/core';
import { FiAlertCircle, FiCheck, FiChevronDown, FiChevronUp, FiInfo, FiZap } from 'react-icons/fi';
import { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type TipType = 'success' | 'warning' | 'info';

interface TipItem {
    icon: React.ReactNode;
    title: string;
    description: string;
    type: TipType;
}

interface GuideSection {
    id: string;
    label: string;
    tips: TipItem[];
}

// ─── Static data ──────────────────────────────────────────────────────────────

const GUIDE_SECTIONS: GuideSection[] = [
    {
        id: 'title',
        label: 'Tên sản phẩm',
        tips: [
            {
                icon: <FiCheck size={12} />,
                title: 'Độ dài lý tưởng',
                description: 'Từ 40 – 80 ký tự, đủ hiển thị trên kết quả tìm kiếm.',
                type: 'success',
            },
            {
                icon: <FiZap size={12} />,
                title: 'Từ khóa chính',
                description: 'Đặt từ khóa quan trọng ở đầu tiêu đề để tăng thứ hạng.',
                type: 'info',
            },
            {
                icon: <FiAlertCircle size={12} />,
                title: 'Tránh viết hoa toàn bộ',
                description: 'Viết hoa toàn bộ có thể bị thuật toán giảm điểm.',
                type: 'warning',
            },
        ],
    },
    {
        id: 'description',
        label: 'Mô tả sản phẩm',
        tips: [
            {
                icon: <FiCheck size={12} />,
                title: 'Mô tả ngắn (150 – 300 ký tự)',
                description: 'Tóm gọn đặc điểm nổi bật, sử dụng đúng từ khóa mục tiêu.',
                type: 'success',
            },
            {
                icon: <FiZap size={12} />,
                title: 'Mô tả chi tiết (≥ 300 từ)',
                description: 'Nội dung phong phú giúp tăng thứ hạng tìm kiếm tự nhiên.',
                type: 'info',
            },
            {
                icon: <FiCheck size={12} />,
                title: 'Cấu trúc rõ ràng',
                description: 'Dùng danh sách bullet, tiêu đề phụ để dễ đọc và crawl.',
                type: 'success',
            },
        ],
    },
    {
        id: 'image',
        label: 'Hình ảnh',
        tips: [
            {
                icon: <FiCheck size={12} />,
                title: 'Ảnh chính sắc nét',
                description: 'Kích thước tối thiểu 800 × 800 px, nền trắng hoặc sáng.',
                type: 'success',
            },
            {
                icon: <FiZap size={12} />,
                title: 'Đặt tên file ý nghĩa',
                description: 'Ví dụ: ao-thun-nam-trang.jpg thay vì IMG_001.jpg.',
                type: 'info',
            },
            {
                icon: <FiAlertCircle size={12} />,
                title: 'Tối ưu dung lượng',
                description: 'Nén ảnh < 500 KB để tải nhanh, tránh giảm điểm tốc độ.',
                type: 'warning',
            },
        ],
    },
    {
        id: 'category',
        label: 'Danh mục & Thẻ',
        tips: [
            {
                icon: <FiCheck size={12} />,
                title: 'Chọn đúng danh mục',
                description: 'Danh mục chính xác giúp sản phẩm xuất hiện đúng ngữ cảnh.',
                type: 'success',
            },
            {
                icon: <FiZap size={12} />,
                title: 'Bổ sung thẻ từ khóa',
                description: 'Thêm 5 – 10 thẻ từ khóa liên quan tăng khả năng tìm kiếm.',
                type: 'info',
            },
        ],
    },
];

// ─── Tip icon color (minimal) ─────────────────────────────────────────────────

const tipIconClass: Record<TipType, string> = {
    success: 'text-gray-500',
    warning: 'text-gray-400',
    info: 'text-gray-400',
};

// ─── TipCard ──────────────────────────────────────────────────────────────────

const TipCard = ({ tip }: { tip: TipItem }) => (
    <div className="flex gap-2 py-1">
        <span className={`mt-0.5 shrink-0 ${tipIconClass[tip.type]}`}>{tip.icon}</span>
        <div>
            <Text size="xs" fw={500} c="dark.5">{tip.title}</Text>
            <Text size="xs" c="dimmed" mt={1} lh={1.5}>{tip.description}</Text>
        </div>
    </div>
);

// ─── CollapsibleSection ───────────────────────────────────────────────────────

const CollapsibleSection = ({ section }: { section: GuideSection }) => {
    const [open, setOpen] = useState(true);

    return (
        <div>
            <button
                type="button"
                className="flex w-full items-center justify-between py-1 text-left"
                onClick={() => setOpen(p => !p)}
            >
                <Text size="sm" fw={600} c="dark.6">{section.label}</Text>
                <span className="text-gray-400">
                    {open ? <FiChevronUp size={13} /> : <FiChevronDown size={13} />}
                </span>
            </button>

            {open && (
                <Stack gap={4} mt={4}>
                    {section.tips.map((tip, i) => (
                        <TipCard key={i} tip={tip} />
                    ))}
                </Stack>
            )}
        </div>
    );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

const GuideSEO = () => {
    return (
        <div className="">
            <Paper shadow="xs" radius="md" className="bg-white border border-gray-100 overflow-hidden flex flex-col" style={{ height: '78vh' }}>
                {/* Fixed header */}
                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-100 shrink-0">
                    <FiInfo size={14} className="text-gray-400" />
                    <Title order={6} className="!text-slate-800">Hướng dẫn SEO</Title>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto px-4 py-3">
                    <Stack gap="xs">
                        {GUIDE_SECTIONS.map((section, i) => (
                            <div key={section.id}>
                                <CollapsibleSection section={section} />
                                {i < GUIDE_SECTIONS.length - 1 && <Divider mt={6} />}
                            </div>
                        ))}
                    </Stack>
                </div>
            </Paper>
        </div>
    );
};

export default GuideSEO;
