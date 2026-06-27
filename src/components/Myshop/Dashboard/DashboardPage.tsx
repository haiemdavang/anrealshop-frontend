import {
    ActionIcon,
    Box,
    Button,
    Container,
    Group,
    Paper,
    RingProgress,
    SimpleGrid,
    Text,
    Title,
    Tooltip,
} from '@mantine/core';
import '@mantine/charts/styles.css';
import { DatePickerInput } from '@mantine/dates';
import '@mantine/dates/styles.css';
import showSuccessNotification from '../../Toast/NotificationSuccess';
import { useState } from 'react';
import {
    FiCalendar,
    FiCheck,
    FiGrid,
    FiHome,
    FiRefreshCw,
} from 'react-icons/fi';
import { BreadcrumbItems } from '../Components/BreadcrumbItems';
import { CampaignCard } from './components/CampaignCard';
import { NewsCard } from './components/NewsCard';
import { OrderBarChart } from './components/OrderBarChart';
import { OrderStatCard } from './components/OrderStatCard';
import { SalesStatCard } from './components/SalesStatCard';
import { SectionTitle } from './components/SectionTitle';
import { SuggestionItem } from './components/SuggestionItem';
import {
    BUSINESS_SUGGESTIONS,
    CAMPAIGNS,
    NEWS,
    ORDER_STATS,
    SALES_STATS,
} from './MockData';

// ─── helpers ────────────────────────────────────────────────────────────────

const showDevelopingNotice = () => {
    showSuccessNotification('Thông báo', 'Tính năng đang được phát triển');
};

// ─── Main component ──────────────────────────────────────────────────────────

const DashboardPage = () => {
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [appliedDateRange, setAppliedDateRange] = useState<[Date | null, Date | null]>([null, null]);

    const breadcrumbItems = [
        { title: 'Trang chủ', href: '/', icon: <FiHome size={14} /> },
        { title: 'Quản lý cửa hàng', href: '/myshop' },
        { title: 'Tổng quan' },
    ];

    const hasIncompleteRange = Boolean(dateRange[0]) !== Boolean(dateRange[1]);
    const hasDateFilter = Boolean(appliedDateRange[0] && appliedDateRange[1]);

    const handleApplyDateFilter = () => {
        if (hasIncompleteRange) return;
        setAppliedDateRange(dateRange);
    };

    const handleResetDateFilter = () => {
        setDateRange([null, null]);
        setAppliedDateRange([null, null]);
    };

    return (
        <Container fluid px="lg" py="md">
            {/* ── Page header ── */}
            <Paper shadow="xs" p="md" mb="md" radius="md" className="border-b border-gray-200">
                <Box mb="xs">
                    <BreadcrumbItems items={breadcrumbItems} />
                </Box>
                <Group justify="space-between" align="center" wrap="wrap">
                    <Group>
                        <FiGrid size={24} className="text-primary" />
                        <Title order={2} size="h3">
                            Tổng quan cửa hàng
                        </Title>
                    </Group>
                    <Group gap="xs" wrap="wrap">
                        <DatePickerInput
                            type="range"
                            value={dateRange}
                            onChange={setDateRange}
                            placeholder="Từ ngày — Đến ngày"
                            valueFormat="DD/MM/YYYY"
                            locale="vi"
                            clearable
                            maxDate={new Date()}
                            leftSection={<FiCalendar size={16} />}
                            aria-label="Lọc dashboard theo khoảng ngày"
                            className="w-full sm:w-[280px]"
                        />
                        <Button
                            variant="light"
                            leftSection={<FiCheck size={16} />}
                            onClick={handleApplyDateFilter}
                            disabled={hasIncompleteRange}
                        >
                            Áp dụng
                        </Button>
                        <Tooltip label="Đặt lại bộ lọc ngày">
                            <ActionIcon
                                variant="default"
                                size="lg"
                                onClick={handleResetDateFilter}
                                disabled={!dateRange[0] && !dateRange[1] && !hasDateFilter}
                                aria-label="Đặt lại bộ lọc ngày"
                            >
                                <FiRefreshCw size={16} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                </Group>
                <Text c="dimmed" size="sm" mt="xs">
                    {hasDateFilter
                        ? 'Số liệu đang được lọc theo khoảng thời gian đã chọn'
                        : 'Xem nhanh tình hình kinh doanh trong 7 ngày gần nhất'}
                </Text>
            </Paper>

            {/* ── 2-column layout ── */}
            <div className="flex gap-4 items-start">
                {/* ════════════════════ LEFT COLUMN ════════════════════ */}
                <div className="flex-1 min-w-0 flex flex-col gap-4">

                    {/* Group 1 — Order status */}
                    <Paper radius="md" p="md" withBorder>
                        <SectionTitle title="Tình trạng đơn hàng" />
                        <SimpleGrid cols={4} spacing="sm">
                            {ORDER_STATS.map((stat) => (
                                <OrderStatCard key={stat.label} stat={stat} />
                            ))}
                        </SimpleGrid>
                    </Paper>

                    {/* Group 2 — Sales analytics */}
                    <Paper radius="md" p="md" withBorder>
                        <SectionTitle title="Phân tích bán hàng" />
                        <SimpleGrid cols={2} spacing="sm">
                            {SALES_STATS.map((stat, i) => (
                                <SalesStatCard key={stat.label} stat={stat} delay={i * 0.07} />
                            ))}
                        </SimpleGrid>

                        {/* Mini ring chart for conversion */}
                        <Paper
                            radius="md"
                            p="sm"
                            mt="sm"
                            className="border border-slate-100"
                            style={{
                                backgroundImage: "url('/images/background_dashboard.png')",
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            <Group gap="md" wrap="nowrap">
                                <RingProgress
                                    size={80}
                                    thickness={7}
                                    roundCaps
                                    sections={[{ value: 38, color: 'cyan' }]}
                                    label={
                                        <Text size="11px" fw={700} ta="center" className="text-slate-800">
                                            38%
                                        </Text>
                                    }
                                />
                                <Box className="flex-1">
                                    <Text size="sm" fw={700} className="text-slate-800">
                                        Tỷ lệ chuyển đổi
                                    </Text>
                                    <Text size="xs" c="dimmed" mt={2}>
                                        38 / 100 lượt xem → mua hàng
                                    </Text>
                                    <Text size="xs" className="text-emerald-600 font-medium" mt={2}>
                                        ▲ Tăng 5% so với tuần trước
                                    </Text>
                                </Box>
                                <img src="/images/icon_doanhthu.png" alt="Doanh Thu" className="w-32 h-16 object-contain mr-2" />
                            </Group>
                        </Paper>
                    </Paper>

                    {/* Group 3 — Bar chart */}
                    <OrderBarChart dateRange={appliedDateRange} />

                    {/* Group 4 — Campaigns */}
                    <Paper radius="md" p="md" withBorder>
                        <SectionTitle title="Chiến dịch đang chạy" onViewMore={showDevelopingNotice} />
                        <div className="flex flex-col gap-3">
                            {CAMPAIGNS.map((c) => (
                                <CampaignCard key={c.id} campaign={c} />
                            ))}
                        </div>
                    </Paper>
                </div>

                {/* ════════════════════ RIGHT COLUMN ════════════════════ */}
                <div className="w-80 shrink-0 flex flex-col gap-4">

                    {/* Group 1 — Business suggestions */}
                    <Paper radius="md" p="md" withBorder>
                        <SectionTitle title="Gợi ý kinh doanh" onViewMore={showDevelopingNotice} />
                        <div>
                            {BUSINESS_SUGGESTIONS.map((s) => (
                                <SuggestionItem key={s.id} s={s} />
                            ))}
                        </div>
                    </Paper>

                    {/* Group 2 — Featured news */}
                    <Paper radius="md" p="md" withBorder>
                        <SectionTitle title="Tin nổi bật" onViewMore={showDevelopingNotice} />
                        <div className="flex flex-col gap-3">
                            {NEWS.map((n) => (
                                <NewsCard key={n.id} news={n} />
                            ))}
                        </div>
                    </Paper>
                </div>
            </div>
        </Container>
    );
};

export default DashboardPage;
