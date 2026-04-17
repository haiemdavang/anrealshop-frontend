import { LineChart } from '@mantine/charts';
import { Box, Group, Paper, Text } from '@mantine/core';
import { CHART_DATA } from '../MockData';
import { SectionTitle } from './SectionTitle';

export const OrderBarChart = () => {
    return (
        <Paper radius="md" p="md" withBorder>
            <SectionTitle title="Tổng quan đơn hàng 7 ngày qua" />

            <LineChart
                h={200}
                data={CHART_DATA}
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
