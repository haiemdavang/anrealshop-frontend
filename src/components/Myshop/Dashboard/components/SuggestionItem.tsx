import { Box, Group, Text, ThemeIcon } from '@mantine/core';
import { BUSINESS_SUGGESTIONS } from '../MockData';

export const SuggestionItem = ({ s }: { s: typeof BUSINESS_SUGGESTIONS[0] }) => {
    const Icon = s.icon;
    return (
        <Box className="flex items-start gap-3 py-2.5 border-b border-gray-100 last:border-0">
            <ThemeIcon variant="light" size="md" radius="md" color="cyan" className="mt-0.5 shrink-0">
                <Icon size={14} />
            </ThemeIcon>
            <Box className="flex-1 min-w-0">
                <Group justify="space-between" mb={2} wrap="nowrap">
                    <Text size="xs" fw={600} className="text-slate-800 line-clamp-1">
                        {s.title}
                    </Text>
                </Group>
                <Text size="xs" c="dimmed" lineClamp={2}>
                    {s.desc}
                </Text>
            </Box>
        </Box>
    );
};
