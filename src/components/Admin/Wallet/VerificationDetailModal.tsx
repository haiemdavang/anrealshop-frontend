import {
    Badge,
    Group,
    Image,
    Loader,
    Modal,
    ScrollArea,
    SimpleGrid,
    Stack,
    Text,
} from '@mantine/core';
import type { UserVerificationDto } from '../../../types/WalletType';
import { useWalletStatus } from '../../../hooks/useWalletStatus';
import { formatDate, formatRelativeDate } from '../../../untils/Untils';

interface VerificationDetailModalProps {
    opened: boolean;
    onClose: () => void;
    verification: UserVerificationDto | null;
    isLoading: boolean;
}

const VerificationDetailModal: React.FC<VerificationDetailModalProps> = ({
    opened,
    onClose,
    verification,
    isLoading,
}) => {
    const { getVerificationStatusLabel, getVerificationBadgeColor } = useWalletStatus();

    const getDocumentTypeLabel = (type: string) => {
        switch (type) {
            case 'CCCD': return 'Căn cước công dân';
            case 'HO_CHIEU': return 'Hộ chiếu';
            default: return type;
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={
                <Text fw={600} size="lg">Chi tiết hồ sơ bao gồm KYC</Text>
            }
            size="lg"
            centered
            scrollAreaComponent={ScrollArea.Autosize}
            styles={{ body: { maxHeight: '70vh', overflow: 'hidden' } }}
        >
            {isLoading ? (
                <Group justify="center" py="xl">
                    <Loader size="md" />
                </Group>
            ) : !verification ? (
                <Text ta="center" py="xl" c="dimmed">
                    Không có dữ liệu xác thực.
                </Text>
            ) : (
                <Stack gap="md">
                    {/* Status */}
                    <Group justify="space-between">
                        <Text size="sm" c="dimmed">Trạng thái</Text>
                        <Badge
                            color={getVerificationBadgeColor(verification.status)}
                            variant="light"
                            size="lg"
                        >
                            {getVerificationStatusLabel(verification.status)}
                        </Badge>
                    </Group>

                    {/* Personal Info */}
                    <SimpleGrid cols={2}>
                        <Stack gap={4}>
                            <Text size="xs" c="dimmed">Họ và tên</Text>
                            <Text size="sm" fw={500}>{verification.realFullName}</Text>
                        </Stack>
                        <Stack gap={4}>
                            <Text size="xs" c="dimmed">Ngày sinh</Text>
                            <Text size="sm" fw={500}>{verification.dateOfBirth ? formatDate(verification.dateOfBirth) : '—'}</Text>
                        </Stack>
                        <Stack gap={4}>
                            <Text size="xs" c="dimmed">Loại giấy tờ</Text>
                            <Text size="sm" fw={500}>{getDocumentTypeLabel(verification.documentType)}</Text>
                        </Stack>
                        <Stack gap={4}>
                            <Text size="xs" c="dimmed">Số giấy tờ</Text>
                            <Text size="sm" fw={500}>{verification.documentNumber}</Text>
                        </Stack>
                    </SimpleGrid>

                    {/* Images */}
                    <Text size="sm" fw={600} mt="xs">Hình ảnh giấy tờ</Text>
                    <SimpleGrid cols={3}>
                        <Stack gap={4}>
                            <Text size="xs" c="dimmed">Mặt trước</Text>
                            <Image
                                src={verification.frontImageUrl}
                                alt="Mặt trước"
                                radius="md"
                                h={140}
                                fit="cover"
                                fallbackSrc="https://placehold.co/200x140?text=Không+tải+được"
                            />
                        </Stack>
                        <Stack gap={4}>
                            <Text size="xs" c="dimmed">Mặt sau</Text>
                            <Image
                                src={verification.backImageUrl}
                                alt="Mặt sau"
                                radius="md"
                                h={140}
                                fit="cover"
                                fallbackSrc="https://placehold.co/200x140?text=Không+tải+được"
                            />
                        </Stack>
                        <Stack gap={4}>
                            <Text size="xs" c="dimmed">Ảnh chân dung</Text>
                            <Image
                                src={verification.portraitImageUrl}
                                alt="Ảnh chân dung"
                                radius="md"
                                h={140}
                                fit="cover"
                                fallbackSrc="https://placehold.co/200x140?text=Không+tải+được"
                            />
                        </Stack>
                    </SimpleGrid>

                    {/* Timestamps */}
                    <SimpleGrid cols={2} mt="xs">
                        <Stack gap={4}>
                            <Text size="xs" c="dimmed">Ngày gửi</Text>
                            <Text size="sm">{verification.createdAt ? formatRelativeDate(verification.createdAt) : '—'}</Text>
                        </Stack>
                        {verification.approvedAt && (
                            <Stack gap={4}>
                                <Text size="xs" c="dimmed">Ngày duyệt</Text>
                                <Text size="sm">{verification.approvedAt ? formatDate(verification.approvedAt) : '—'}</Text>
                            </Stack>
                        )}
                    </SimpleGrid>

                    {/* Rejection Reason */}
                    {verification.rejectionReason && (
                        <Stack gap={4}>
                            <Text size="xs" c="dimmed">Lý do từ chối</Text>
                            <Text size="sm" c="red">{verification.rejectionReason}</Text>
                        </Stack>
                    )}
                </Stack>
            )}
        </Modal>
    );
};

export default VerificationDetailModal;
