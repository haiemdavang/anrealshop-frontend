import {
    ActionIcon,
    Box,
    Group,
    Image,
    Loader,
    Radio,
    Stack,
    Text,
} from '@mantine/core';
import { FiCamera, FiX } from 'react-icons/fi';
import type { DocumentType } from '../../../../../types/WalletType';

export interface ImageUploadState {
    url: string;
    isUploading: boolean;
    file?: File;
}

interface UploadDocProps {
    documentType: DocumentType;
    setDocumentType: (type: DocumentType) => void;
    frontImage: ImageUploadState | null;
    backImage: ImageUploadState | null;
    onUploadFront: (file: File) => void;
    onUploadBack: (file: File) => void;
    onRemoveFront: () => void;
    onRemoveBack: () => void;
    errors: Record<string, string>;
}

const UploadDoc = ({
    documentType,
    setDocumentType,
    frontImage,
    backImage,
    onUploadFront,
    onUploadBack,
    onRemoveFront,
    onRemoveBack,
    errors,
}: UploadDocProps) => {
    return (
        <Stack gap="md">
            <Text size="sm" c="dimmed">
                Vui lòng chụp ảnh rõ ràng, không bị mờ, không bị che khuất.
            </Text>

            <Radio.Group
                label="Loại giấy tờ"
                value={documentType}
                onChange={(val) => setDocumentType(val as DocumentType)}
                required
            >
                <Group mt="xs">
                    <Radio value="CCCD" label="Căn cước công dân" />
                    <Radio value="HO_CHIEU" label="Hộ chiếu" />
                </Group>
            </Radio.Group>

            <Group gap="md" align="flex-start" grow>
                <ImageUploadField
                    label={`Mặt trước ${documentType === 'CCCD' ? 'CCCD' : 'Hộ chiếu'}`}
                    image={frontImage}
                    onUpload={onUploadFront}
                    onRemove={onRemoveFront}
                    error={errors.frontImage}
                    fullWidth
                />

                <ImageUploadField
                    label={`Mặt sau ${documentType === 'CCCD' ? 'CCCD' : 'Hộ chiếu'}`}
                    image={backImage}
                    onUpload={onUploadBack}
                    onRemove={onRemoveBack}
                    error={errors.backImage}
                    fullWidth
                />
            </Group>
        </Stack>
    );
};

// --------------- Image Upload Field ---------------

interface ImageUploadFieldProps {
    label: string;
    image: ImageUploadState | null;
    onUpload: (file: File) => void;
    onRemove: () => void;
    error?: string;
    description?: string;
    fullWidth?: boolean;
}

export const ImageUploadField = ({ label, image, onUpload, onRemove, error, description, fullWidth }: ImageUploadFieldProps) => {
    return (
        <Box className={fullWidth ? 'w-full' : ''}>
            <Text size="sm" fw={500} mb={4}>
                {label} <Text component="span" c="red">*</Text>
            </Text>
            {description && (
                <Text size="xs" c="dimmed" mb="xs">{description}</Text>
            )}

            {image ? (
                <Box className={`relative ${fullWidth ? 'w-full' : 'inline-block'}`}>
                    <Image
                        src={image.url}
                        w={fullWidth ? '100%' : 160}
                        h={140}
                        radius="md"
                        className="object-cover border border-gray-200"
                        style={{ opacity: image.isUploading ? 0.5 : 1 }}
                    />
                    {image.isUploading && (
                        <Box className="absolute inset-0 flex items-center justify-center">
                            <Loader size="sm" />
                        </Box>
                    )}
                    {!image.isUploading && (
                        <ActionIcon
                            size="xs"
                            color="red"
                            variant="filled"
                            radius="xl"
                            className="absolute -top-2 -right-2"
                            onClick={onRemove}
                        >
                            <FiX size={10} />
                        </ActionIcon>
                    )}
                </Box>
            ) : (
                <label
                    className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-400 transition-colors ${fullWidth ? 'w-full' : ''}`}
                    style={{ width: fullWidth ? '100%' : 160, height: 140 }}
                >
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onUpload(file);
                            e.target.value = '';
                        }}
                    />
                    <FiCamera size={24} className="text-gray-400 mb-1" />
                    <Text size="xs" c="dimmed">Tải ảnh lên</Text>
                </label>
            )}

            {error && (
                <Text size="xs" c="red" mt={4}>{error}</Text>
            )}
        </Box>
    );
};

export default UploadDoc;
