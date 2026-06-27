import {
    ActionIcon,
    Avatar,
    Badge,
    Group,
    Menu,
    Table,
    Text,
    Tooltip,
} from '@mantine/core';
import { FiCheck, FiEye, FiFileText, FiMoreVertical, FiX } from 'react-icons/fi';
import { formatDate } from '../../../untils/Untils';
import { getShopStatusColor, getShopStatusLabel } from './data';
import { ShopListSkeleton } from './skeleton';
import type { AdminShop } from './types';

interface ShopListProps {
    shops: AdminShop[];
    loading: boolean;
    onViewShop: (shop: AdminShop) => void;
    onApproveShop: (shop: AdminShop) => void;
    onRejectShop: (shop: AdminShop) => void;
    onViewRejectionReason: (shop: AdminShop) => void;
}

const ShopList = ({
    shops,
    loading,
    onViewShop,
    onApproveShop,
    onRejectShop,
    onViewRejectionReason,
}: ShopListProps) => {
    if (loading) return <ShopListSkeleton viewMode="list" rows={6} />;

    return (
        <Table striped highlightOnHover withColumnBorders>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Cửa hàng</Table.Th>
                    <Table.Th style={{ textAlign: 'center' }}>Chủ sở hữu</Table.Th>
                    <Table.Th style={{ textAlign: 'center' }}>Liên hệ</Table.Th>
                    <Table.Th style={{ textAlign: 'center' }}>Ngày đăng ký</Table.Th>
                    <Table.Th style={{ textAlign: 'center' }}>Trạng thái</Table.Th>
                    <Table.Th style={{ width: 100, textAlign: 'center' }}>Thao tác</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {shops.length === 0 ? (
                    <Table.Tr>
                        <Table.Td colSpan={6}>
                            <Text ta="center" py={70} fw={500} >
                                Không tìm thấy cửa hàng phù hợp
                            </Text>
                        </Table.Td>
                    </Table.Tr>
                ) : shops.map((shop) => (
                    <Table.Tr key={shop.id}>
                        <Table.Td>
                            <Group wrap="nowrap">
                                <Avatar src={shop.avatarUrl} alt={shop.name} size="md" radius="md" />
                                <Tooltip label={shop.name}>
                                    <div className="min-w-0">
                                        <Text size="sm" fw={500} lineClamp={1}>{shop.name}</Text>
                                        <Text size="xs" c="dimmed">ID: {shop.id}</Text>
                                    </div>
                                </Tooltip>
                            </Group>
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                            {shop.owner.fullName}
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                            <Text size="sm">{shop.owner.email}</Text>
                            <Text size="xs" c="dimmed">{shop.owner.phoneNumber}</Text>
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                            {formatDate(shop.createdAt)}
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                            <Badge color={getShopStatusColor(shop.status)}>
                                {getShopStatusLabel(shop.status)}
                            </Badge>
                        </Table.Td>
                        <Table.Td>
                            <Group justify="center" gap="xs">
                                <Tooltip label="Xem chi tiết">
                                    <ActionIcon variant="subtle" onClick={() => onViewShop(shop)}>
                                        <FiEye size={16} />
                                    </ActionIcon>
                                </Tooltip>

                                {shop.status === 'pending' && (
                                    <Menu position="bottom-end" withinPortal>
                                        <Menu.Target>
                                            <ActionIcon variant="subtle">
                                                <FiMoreVertical size={16} />
                                            </ActionIcon>
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            <Menu.Item
                                                leftSection={<FiCheck size={14} color="green" />}
                                                onClick={() => onApproveShop(shop)}
                                            >
                                                Phê duyệt
                                            </Menu.Item>
                                            <Menu.Item
                                                leftSection={<FiX size={14} color="red" />}
                                                onClick={() => onRejectShop(shop)}
                                            >
                                                Từ chối
                                            </Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                )}

                                {shop.status === 'rejected' && (
                                    <Tooltip label="Xem lý do từ chối">
                                        <ActionIcon
                                            variant="subtle"
                                            color="red"
                                            onClick={() => onViewRejectionReason(shop)}
                                        >
                                            <FiFileText size={16} />
                                        </ActionIcon>
                                    </Tooltip>
                                )}
                            </Group>
                        </Table.Td>
                    </Table.Tr>
                ))}
            </Table.Tbody>
        </Table>
    );
};

export default ShopList;
