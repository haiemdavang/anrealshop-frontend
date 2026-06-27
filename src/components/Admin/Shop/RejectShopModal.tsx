import { Button, Group, Modal, Stack, Text, Textarea } from '@mantine/core';
import { FiX } from 'react-icons/fi';
import type { AdminShop } from './types';

interface RejectShopModalProps {
    opened: boolean;
    shop: AdminShop | null;
    reason: string;
    loading: boolean;
    readOnly?: boolean;
    onClose: () => void;
    onReasonChange: (reason: string) => void;
    onConfirm: () => void;
}

const RejectShopModal = ({
    opened,
    shop,
    reason,
    loading,
    readOnly = false,
    onClose,
    onReasonChange,
    onConfirm,
}: RejectShopModalProps) => (
    <Modal
        opened={opened}
        onClose={onClose}
        title={readOnly ? 'Lý do từ chối cửa hàng' : `Từ chối cửa hàng ${shop?.name || ''}`}
        centered
    >
        <Stack>
            <Text size="sm">
                {readOnly
                    ? 'Lý do cửa hàng không được phê duyệt:'
                    : 'Vui lòng cung cấp lý do từ chối cửa hàng:'}
            </Text>
            <Textarea
                placeholder="Nhập lý do từ chối..."
                minRows={4}
                value={reason}
                onChange={(event) => onReasonChange(event.currentTarget.value)}
                readOnly={readOnly}
                required={!readOnly}
            />
            <Group justify="flex-end" mt="md">
                <Button variant="outline" onClick={onClose}>
                    {readOnly ? 'Đóng' : 'Hủy'}
                </Button>
                {!readOnly && (
                    <Button
                        color="red"
                        leftSection={<FiX size={16} />}
                        onClick={onConfirm}
                        disabled={!reason.trim()}
                        loading={loading}
                    >
                        Từ chối cửa hàng
                    </Button>
                )}
            </Group>
        </Stack>
    </Modal>
);

export default RejectShopModal;
