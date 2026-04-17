import { Box, Group, Paper, Progress, Text } from '@mantine/core';
import { CAMPAIGNS } from '../MockData';

export const CampaignCard = ({ campaign }: { campaign: typeof CAMPAIGNS[0] }) => {
    const Icon = campaign.icon;
    return (
        <Paper radius="md" p="sm" withBorder className="hover:shadow-sm transition-shadow duration-200 flex gap-4">
            <img src={campaign.image} alt={campaign.title} className="w-32 h-24 object-cover rounded-md shrink-0" />
            <Box className="flex-1 flex flex-col justify-center min-w-0">
                <Group gap="xs" mb={4} wrap="nowrap">
                    <Icon size={18} className={campaign.iconColor + " shrink-0"} />
                    <Text fw={600} size="sm" className="text-slate-800 line-clamp-1">
                        {campaign.title}
                    </Text>
                </Group>
                <Text size="xs" c="dimmed" mb={4} lineClamp={2}>
                    {campaign.desc}
                </Text>
                <Box>
                    <Progress value={campaign.progress} size="xs" color="cyan" radius="xl" mb={6} />
                    <Group justify="space-between" wrap="nowrap">
                        <Text size="xs" c="dimmed">
                            {campaign.startDate} → {campaign.endDate}
                        </Text>
                        <Text size="10px" fw={600} className="text-primary shrink-0">
                            {campaign.progress}%
                        </Text>
                    </Group>
                </Box>
            </Box>
        </Paper>
    );
};
