import { Group, Paper, SimpleGrid, Skeleton, Stack, Table } from '@mantine/core';

interface ShopListSkeletonProps {
    viewMode: 'grid' | 'list';
    items?: number;
    rows?: number;
}

const ShopTableSkeleton = ({ rows }: { rows: number }) => (
    <Table striped withColumnBorders>
        <Table.Thead>
            <Table.Tr>
                <Table.Th>Cửa hàng</Table.Th>
                <Table.Th>Chủ sở hữu</Table.Th>
                <Table.Th>Liên hệ</Table.Th>
                <Table.Th>Ngày đăng ký</Table.Th>
                <Table.Th>Trạng thái</Table.Th>
                <Table.Th style={{ width: 100, textAlign: 'center' }}>Thao tác</Table.Th>
            </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
            {Array.from({ length: rows }).map((_, index) => (
                <Table.Tr key={index}>
                    <Table.Td>
                        <Group gap="sm" wrap="nowrap">
                            <Skeleton height={40} width={40} radius="md" />
                            <div>
                                <Skeleton height={14} width={130} mb={6} />
                                <Skeleton height={11} width={72} />
                            </div>
                        </Group>
                    </Table.Td>
                    <Table.Td><Skeleton height={14} width={110} /></Table.Td>
                    <Table.Td>
                        <Skeleton height={13} width={155} mb={6} />
                        <Skeleton height={13} width={92} />
                    </Table.Td>
                    <Table.Td><Skeleton height={14} width={125} /></Table.Td>
                    <Table.Td><Skeleton height={24} width={96} radius="xl" /></Table.Td>
                    <Table.Td>
                        <Group justify="center" gap="xs">
                            <Skeleton height={30} width={30} radius="md" />
                            <Skeleton height={30} width={30} radius="md" />
                        </Group>
                    </Table.Td>
                </Table.Tr>
            ))}
        </Table.Tbody>
    </Table>
);

const ShopGridSkeleton = ({ items }: { items: number }) => (
    <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }} spacing="md" my="md">
        {Array.from({ length: items }).map((_, index) => (
            <Paper key={index} withBorder p="md" radius="md">
                <Group align="flex-start" wrap="nowrap" mb="md">
                    <Skeleton height={64} width={64} radius="md" />
                    <Stack gap={7} className="flex-1">
                        <Skeleton height={17} width="70%" />
                        <Skeleton height={11} width="38%" />
                        <Skeleton height={22} width={90} radius="xl" />
                    </Stack>
                </Group>
                <Skeleton height={12} mb={7} />
                <Skeleton height={12} width="82%" mb="lg" />
                <Stack gap="sm">
                    <Skeleton height={13} />
                    <Skeleton height={13} />
                    <Skeleton height={13} />
                </Stack>
                <Group justify="space-between" mt="lg">
                    <Skeleton height={34} width={112} radius="md" />
                    <Group gap="xs">
                        <Skeleton height={34} width={34} radius="md" />
                        <Skeleton height={34} width={34} radius="md" />
                    </Group>
                </Group>
            </Paper>
        ))}
    </SimpleGrid>
);

export const ShopListSkeleton = ({
    viewMode,
    items = 5,
    rows,
}: ShopListSkeletonProps) => (
    viewMode === 'list'
        ? <ShopTableSkeleton rows={rows ?? items} />
        : <ShopGridSkeleton items={items} />
);
