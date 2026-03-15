import { Box, Group, Image, Stack, Text } from '@mantine/core';
import type { DocumentType } from '../../../../../types/WalletType';
import type { ImageUploadState } from './UploadDoc';

interface TabConfirmProps {
    realFullName: string;
    documentType: DocumentType;
    documentNumber: string;
    dateOfBirth: Date | null;
    frontImage: ImageUploadState | null;
    backImage: ImageUploadState | null;
    portraitImage: ImageUploadState | null;
}

const TabConfirm = ({
    realFullName,
    documentType,
    documentNumber,
    dateOfBirth,
    frontImage,
    backImage,
    portraitImage,
}: TabConfirmProps) => {
    return (
        <Stack gap="sm">
            <Text size="sm" fw={500} mb="xs">Xác nhận thông tin</Text>

            <ConfirmRow label="Họ và tên" value={realFullName} />
            <ConfirmRow label="Loại giấy tờ" value={documentType === 'CCCD' ? 'Căn cước công dân' : 'Hộ chiếu'} />
            <ConfirmRow label="Số giấy tờ" value={documentNumber} />
            <ConfirmRow label="Ngày sinh" value={dateOfBirth ? dateOfBirth.toLocaleDateString('vi-VN') : ''} />

            <Text size="sm" fw={500} mt="md" mb="xs">Hình ảnh giấy tờ</Text>
            <Group gap="md">
                {frontImage && (
                    <Box className="text-center">
                        <Image src={frontImage.url} w={100} h={70} radius="sm" className="object-cover border border-gray-200" />
                        <Text size="xs" c="dimmed" mt={4}>Mặt trước</Text>
                    </Box>
                )}
                {backImage && (
                    <Box className="text-center">
                        <Image src={backImage.url} w={100} h={70} radius="sm" className="object-cover border border-gray-200" />
                        <Text size="xs" c="dimmed" mt={4}>Mặt sau</Text>
                    </Box>
                )}
                {portraitImage && (
                    <Box className="text-center">
                        <Image src={portraitImage.url} w={70} h={90} radius="sm" className="object-cover border border-gray-200" />
                        <Text size="xs" c="dimmed" mt={4}>Chân dung</Text>
                    </Box>
                )}
            </Group>

            <Text size="xs" c="dimmed" mt="md" className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                Bằng việc gửi xác thực, bạn xác nhận thông tin trên là chính xác và đồng ý với điều khoản sử dụng dịch vụ ví điện tử.
            </Text>
        </Stack>
    );
};

const ConfirmRow = ({ label, value }: { label: string; value: string }) => (
    <Group justify="space-between">
        <Text size="sm" c="dimmed">{label}</Text>
        <Text size="sm" fw={500}>{value}</Text>
    </Group>
);

export default TabConfirm;
