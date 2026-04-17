import { Text } from '@mantine/core';
import { motion } from 'framer-motion';
import { ORDER_STATS } from '../MockData';

export const OrderStatCard = ({ stat }: { stat: typeof ORDER_STATS[0] }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center p-2 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
        >
            <Text size="xl" fw={700} className="text-primary">
                {stat.value}
            </Text>
            <Text size="xs" c="dimmed" fw={500} mt={4} ta="center">
                {stat.label}
            </Text>
        </motion.div>
    );
};
