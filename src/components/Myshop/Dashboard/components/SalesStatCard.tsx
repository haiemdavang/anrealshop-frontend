import { Group, Paper, Text, ThemeIcon } from '@mantine/core';
import { motion } from 'framer-motion';
import { SALES_STATS } from '../MockData';

export const SalesStatCard = ({ stat, delay }: { stat: typeof SALES_STATS[0]; delay: number }) => {
    const Icon = stat.icon;
    const isUp = stat.trend === 'up';
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay }}
        >
            <Paper radius="md" p="md" withBorder className="hover:shadow-md transition-shadow duration-200">
                <Group gap="sm" mb={8}>
                    <ThemeIcon variant="light" size="md" radius="md" color="cyan">
                        <Icon size={16} />
                    </ThemeIcon>
                    <Text size="xs" c="dimmed" fw={500}>
                        {stat.label}
                    </Text>
                </Group>
                <Group gap="sm" align="center">
                    <Text size="lg" fw={700} className="text-slate-800 leading-none">
                        {stat.value}
                    </Text>
                    <Text size="xs" className={isUp ? 'text-emerald-600' : 'text-rose-500'}>
                        {isUp ? '▲' : '▼'} {stat.sub}
                    </Text>
                </Group>
            </Paper>
        </motion.div>
    );
};
