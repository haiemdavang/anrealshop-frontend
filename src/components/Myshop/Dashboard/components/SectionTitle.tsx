import { Button, Group, Text } from '@mantine/core';
import { FiChevronRight } from 'react-icons/fi';

export const SectionTitle = ({ title, onViewMore }: { title: string; onViewMore?: () => void }) => (
    <Group justify="space-between" mb="sm">
        <Text fw={600} size="sm" className="text-slate-800">
            {title}
        </Text>
        {onViewMore && (
            <Button
                variant="subtle"
                size="xs"
                color="cyan"
                rightSection={<FiChevronRight size={13} />}
                onClick={onViewMore}
                className="!text-xs"
            >
                Xem thêm
            </Button>
        )}
    </Group>
);
