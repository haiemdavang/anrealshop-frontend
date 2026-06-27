import {
    Avatar,
    Badge,
    Button,
    Group,
    Modal,
    Paper,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { FiCheck, FiX } from 'react-icons/fi';
import { formatDate } from '../../../untils/Untils';
import { getShopStatusColor, getShopStatusLabel } from './data';
import type { AdminShop } from './types';

interface ShopReviewModalProps {
    opened: boolean;
    shop: AdminShop | null;
    loading: boolean;
    onClose: () => void;
    onApprove: (shop: AdminShop) => void;
    onReject: (shop: AdminShop) => void;
}

const ShopReviewModal = ({
    opened,
    shop,
    loading,
    onClose,
    onApprove,
    onReject,
}: ShopReviewModalProps) => (
    <Modal
        opened={opened}
        onClose={onClose}
        title={`Chi tiết cửa hàng: ${shop?.name || ''}`}
        size="lg"
        centered
    >
        {shop && (
            <Stack>
                <Group align="flex-start" wrap="nowrap">
                    <Avatar src={shop.avatarUrl} size={100} radius="md" alt={shop.name} />
                    <Stack className="flex-1" gap="xs">
                        <Text fw={700} size="xl">{shop.name}</Text>
                        <Text size="sm" c="dimmed">ID: {shop.id}</Text>
                        <Badge color={getShopStatusColor(shop.status)} size="lg" w="fit-content">
                            {getShopStatusLabel(shop.status)}
                        </Badge>
                        <Text mt="xs">{shop.description}</Text>
                    </Stack>
                </Group>

                <Paper withBorder p="md" mt="md">
                    <Title order={5} mb="sm">Thông tin chủ sở hữu</Title>
                    <Stack gap="xs">
                        <Group justify="space-between">
                            <Text size="sm" fw={500}>Họ tên:</Text>
                            <Text size="sm">{shop.owner.fullName}</Text>
                        </Group>
                        <Group justify="space-between">
                            <Text size="sm" fw={500}>Email:</Text>
                            <Text size="sm">{shop.owner.email}</Text>
                        </Group>
                        <Group justify="space-between">
                            <Text size="sm" fw={500}>Số điện thoại:</Text>
                            <Text size="sm">{shop.owner.phoneNumber}</Text>
                        </Group>
                        <Group justify="space-between">
                            <Text size="sm" fw={500}>Ngày đăng ký:</Text>
                            <Text size="sm">{formatDate(shop.createdAt)}</Text>
                        </Group>
                    </Stack>
                </Paper>

                {shop.status !== 'pending' && (
                    <Paper withBorder p="md">
                        <Group mb="xs">
                            <Title order={5}>Kết quả xét duyệt</Title>
                            <Badge color={getShopStatusColor(shop.status)}>
                                {getShopStatusLabel(shop.status)}
                            </Badge>
                        </Group>
                        <Text size="sm">{shop.reviewNote || 'Không có ghi chú'}</Text>
                    </Paper>
                )}

                <Group mt="lg" justify="space-between">
                    <Button variant="outline" onClick={onClose}>Đóng</Button>
                    {shop.status === 'pending' && (
                        <Group>
                            <Button
                                variant="outline"
                                color="red"
                                leftSection={<FiX size={16} />}
                                onClick={() => onReject(shop)}
                                disabled={loading}
                            >
                                Từ chối
                            </Button>
                            <Button
                                color="green"
                                leftSection={<FiCheck size={16} />}
                                onClick={() => onApprove(shop)}
                                loading={loading}
                            >
                                Phê duyệt
                            </Button>
                        </Group>
                    )}
                </Group>
            </Stack>
        )}
    </Modal>
);

export default ShopReviewModal;
