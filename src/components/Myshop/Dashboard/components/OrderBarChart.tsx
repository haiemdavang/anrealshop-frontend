import { LineChart } from '@mantine/charts';
import { Box, Group, Paper, Text } from '@mantine/core';
import { eachDayOfInterval, format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useMemo } from 'react';
import { CHART_DATA } from '../MockData';
import { SectionTitle } from './SectionTitle';

interface OrderBarChartProps {
    dateRange?: [Date | null, Date | null];
}

export const OrderBarChart = ({ dateRange = [null, null] }: OrderBarChartProps) => {
    const chartData = useMemo(() => {
        const [startDate, endDate] = dateRange;
        if (!startDate || !endDate) return CHART_DATA;

        const days = eachDayOfInterval({ start: startDate, end: endDate });
        const step = Math.max(1, Math.ceil(days.length / 31));
        const displayDays = days.filter(
            (_, index) => index % step === 0 || index === days.length - 1
        );

        return displayDays.map((date, index) => {
            const template = CHART_DATA[index % CHART_DATA.length];
            return {
                ...template,
                day: format(date, 'dd/MM', { locale: vi }),
            };
        });
    }, [dateRange]);

    const title = dateRange[0] && dateRange[1]
        ? `Tổng quan đơn hàng từ ${format(dateRange[0], 'dd/MM/yyyy')} đến ${format(dateRange[1], 'dd/MM/yyyy')}`
        : 'Tổng quan đơn hàng 7 ngày qua';

    return (
        <Paper radius="md" p="md" withBorder>
            <SectionTitle title={title} />

            <LineChart
                h={200}
                data={chartData}
                dataKey="day"
                series={[
                    { name: 'orders', label: 'Số đơn hàng', color: 'cyan.5' },
                    { name: 'revenueM', label: 'Doanh thu (triệu ₫)', color: 'blue.5' },
                ]}
                curveType="linear"
                withDots
                withTooltip
                tooltipAnimationDuration={200}
                gridAxis="xy"
                tickLine="none"
                strokeWidth={2}
                dotProps={{ r: 4, strokeWidth: 2 }}
                activeDotProps={{ r: 6, strokeWidth: 2 }}
            />

            {/* Legend */}
            <Group mt="xs" gap="lg" justify="center">
                <Group gap={6}>
                    <Box className="w-3 h-0.5 rounded bg-cyan-500" />
                    <Text size="xs" c="dimmed">Số đơn hàng</Text>
                </Group>
                <Group gap={6}>
                    <Box className="w-3 h-0.5 rounded bg-blue-500" />
                    <Text size="xs" c="dimmed">Doanh thu (triệu ₫)</Text>
                </Group>
            </Group>
        </Paper>
    );
};
