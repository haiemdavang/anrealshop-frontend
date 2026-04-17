import { Group, Paper, Text, ThemeIcon } from '@mantine/core';
import { NEWS } from '../MockData';

export const NewsCard = ({ news }: { news: typeof NEWS[0] }) => {
    const Icon = news.icon;
    return (
        <Paper radius="md" p="md" withBorder className="hover:shadow-sm transition-shadow duration-200">
            <Group gap="xs" mb={6}>
                <ThemeIcon variant="light" size="sm" radius="md" color={news.tagColor}>
                    <Icon size={12} />
                </ThemeIcon>

                <Text size="xs" c="dimmed" ml="auto">
                    {news.date}
                </Text>
            </Group>
            <Text fw={600} size="sm" mb={4} lineClamp={2} className="text-slate-800">
                {news.title}
            </Text>
            <Text size="xs" c="dimmed" lineClamp={3}>
                {news.desc}
            </Text>
        </Paper>
    );
};
