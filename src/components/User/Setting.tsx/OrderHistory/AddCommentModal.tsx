import {
    ActionIcon,
    Box,
    Button,
    Group,
    Image,
    Loader,
    Modal,
    Rating,
    Stack,
    Text,
    Textarea,
} from '@mantine/core';
import React, { useCallback, useState } from 'react';
import { FiCamera, FiStar, FiTrash2, FiX } from 'react-icons/fi';
import { uploadToCloudinary } from '../../../../service/Cloundinary';
import type { ProductOrderItemDto } from '../../../../types/OrderType';
import type { CreateReviewRequest, ProductMediaDto } from '../../../../types/PreviewType';

export interface ReviewMediaItem {
    url: string;
    thumbnailUrl: string;
    isUploading: boolean;
    isUploaded: boolean;
    file?: File;
}

interface AddCommentModalProps {
    opened: boolean;
    onClose: () => void;
    onSubmit: (data: CreateReviewRequest) => Promise<void>;
    productItems: ProductOrderItemDto[];
}

interface ProductReviewState {
    rating: number;
    comment: string;
    media: ReviewMediaItem[];
}

const MAX_IMAGES = 5;
const MAX_COMMENT_LENGTH = 500;

const AddCommentModal: React.FC<AddCommentModalProps> = ({
    opened,
    onClose,
    onSubmit,
    productItems,
}) => {
    const [reviews, setReviews] = useState<Record<string, ProductReviewState>>(() => {
        const initial: Record<string, ProductReviewState> = {};
        productItems
            .filter((p) => !p.reviewed)
            .forEach((p) => {
                initial[p.orderItemId] = { rating: 5, comment: '', media: [] };
            });
        return initial;
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentProductIndex, setCurrentProductIndex] = useState(0);

    const unreviewedProducts = productItems.filter((p) => !p.reviewed);
    const currentProduct = unreviewedProducts[currentProductIndex];

    const currentReview = currentProduct ? reviews[currentProduct.orderItemId] : null;

    const updateReview = useCallback(
        (orderItemId: string, updates: Partial<ProductReviewState>) => {
            setReviews((prev) => ({
                ...prev,
                [orderItemId]: { ...prev[orderItemId], ...updates },
            }));
        },
        []
    );

    const handleImageUpload = useCallback(
        async (files: FileList | null) => {
            if (!files || !currentProduct) return;

            const orderItemId = currentProduct.orderItemId;
            const currentMedia = reviews[orderItemId]?.media || [];
            const remainingSlots = MAX_IMAGES - currentMedia.length;
            const filesToUpload = Array.from(files).slice(0, remainingSlots);

            if (filesToUpload.length === 0) return;

            const newItems: ReviewMediaItem[] = filesToUpload.map((file) => ({
                url: URL.createObjectURL(file),
                thumbnailUrl: '',
                isUploading: true,
                isUploaded: false,
                file,
            }));

            setReviews((prev) => ({
                ...prev,
                [orderItemId]: {
                    ...prev[orderItemId],
                    media: [...prev[orderItemId].media, ...newItems],
                },
            }));

            for (const item of newItems) {
                try {
                    const { secure_url } = await uploadToCloudinary(item.file!, 'image');
                    setReviews((prev) => ({
                        ...prev,
                        [orderItemId]: {
                            ...prev[orderItemId],
                            media: prev[orderItemId].media.map((m) =>
                                m.url === item.url
                                    ? { ...m, url: secure_url, thumbnailUrl: secure_url, isUploading: false, isUploaded: true, file: undefined }
                                    : m
                            ),
                        },
                    }));
                    URL.revokeObjectURL(item.url);
                } catch {
                    setReviews((prev) => ({
                        ...prev,
                        [orderItemId]: {
                            ...prev[orderItemId],
                            media: prev[orderItemId].media.map((m) =>
                                m.url === item.url
                                    ? { ...m, isUploading: false, isUploaded: false }
                                    : m
                            ),
                        },
                    }));
                }
            }
        },
        [currentProduct, reviews]
    );

    const handleRemoveImage = useCallback(
        (orderItemId: string, index: number) => {
            setReviews((prev) => {
                const updated = [...prev[orderItemId].media];
                if (updated[index].url.startsWith('blob:')) {
                    URL.revokeObjectURL(updated[index].url);
                }
                updated.splice(index, 1);
                return {
                    ...prev,
                    [orderItemId]: { ...prev[orderItemId], media: updated },
                };
            });
        },
        []
    );

    const handleSubmit = async () => {
        if (!currentProduct || !currentReview) return;

        const hasUploading = currentReview.media.some((m) => m.isUploading);
        if (hasUploading) return;

        setIsSubmitting(true);
        try {
            const mediaList: ProductMediaDto[] = currentReview.media
                .filter((m) => m.isUploaded)
                .map((m) => ({
                    url: m.url,
                    thumbnailUrl: m.thumbnailUrl || m.url,
                    type: 'IMAGE' as const,
                }));

            await onSubmit({
                orderItemId: currentProduct.orderItemId,
                rating: currentReview.rating,
                comment: currentReview.comment,
                mediaList,
            });

            if (currentProductIndex < unreviewedProducts.length - 1) {
                setCurrentProductIndex((prev) => prev + 1);
            } else {
                onClose();
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const getRatingLabel = (rating: number) => {
        switch (rating) {
            case 1: return 'Tệ';
            case 2: return 'Không hài lòng';
            case 3: return 'Bình thường';
            case 4: return 'Hài lòng';
            case 5: return 'Tuyệt vời';
            default: return '';
        }
    };

    if (!currentProduct || !currentReview) return null;

    const isFormValid = currentReview.rating > 0 && !currentReview.media.some((m) => m.isUploading);

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={
                <Group gap="xs">
                    <FiStar size={18} className="text-yellow-500" />
                    <Text fw={600}>Đánh giá sản phẩm</Text>
                    {unreviewedProducts.length > 1 && (
                        <Text size="xs" c="dimmed">
                            ({currentProductIndex + 1}/{unreviewedProducts.length})
                        </Text>
                    )}
                </Group>
            }
            centered
            size="lg"
        >
            <Stack gap="md">
                {/* Product info */}
                <Group align="flex-start" gap="md" className="bg-gray-50 p-3 rounded-md">
                    <Image
                        src={currentProduct.productImage}
                        className="h-16 w-16 object-cover"
                        radius="sm"
                        alt={currentProduct.productName}
                    />
                    <Box style={{ flex: 1 }}>
                        <Text size="sm" fw={500} lineClamp={2}>
                            {currentProduct.productName}
                        </Text>
                        {currentProduct.variant && (
                            <Text size="xs" c="dimmed">
                                Phân loại: {currentProduct.variant}
                            </Text>
                        )}
                    </Box>
                </Group>

                {/* Rating */}
                <Box className="text-center py-2">
                    <Text size="sm" fw={500} mb="xs">
                        Chất lượng sản phẩm
                    </Text>
                    <Group justify="center" gap="xs">
                        <Rating
                            value={currentReview.rating}
                            onChange={(value) =>
                                updateReview(currentProduct.orderItemId, { rating: value })
                            }
                            size="lg"
                        />
                        <Text size="sm" c="orange" fw={500}>
                            {getRatingLabel(currentReview.rating)}
                        </Text>
                    </Group>
                </Box>

                {/* Comment text */}
                <Textarea
                    label="Nhận xét của bạn"
                    placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm này..."
                    value={currentReview.comment}
                    onChange={(e) =>
                        updateReview(currentProduct.orderItemId, {
                            comment: e.currentTarget.value,
                        })
                    }
                    minRows={3}
                    maxRows={6}
                    maxLength={MAX_COMMENT_LENGTH}
                />
                <Text size="xs" c="dimmed" ta="right">
                    {currentReview.comment.length}/{MAX_COMMENT_LENGTH}
                </Text>

                {/* Image upload */}
                <Box>
                    <Text size="sm" fw={500} mb="xs">
                        Thêm hình ảnh ({currentReview.media.length}/{MAX_IMAGES})
                    </Text>
                    <Group gap="sm">
                        {currentReview.media.map((item, index) => (
                            <Box
                                key={index}
                                className="relative"
                                style={{ width: 80, height: 80 }}
                            >
                                <Image
                                    src={item.url}
                                    className="h-full w-full object-cover rounded-md"
                                    radius="sm"
                                    style={{
                                        opacity: item.isUploading ? 0.5 : 1,
                                    }}
                                />
                                {item.isUploading && (
                                    <Box
                                        className="absolute inset-0 flex items-center justify-center"
                                        style={{ background: 'rgba(255,255,255,0.5)' }}
                                    >
                                        <Loader size="xs" />
                                    </Box>
                                )}
                                {!item.isUploading && (
                                    <ActionIcon
                                        size="xs"
                                        color="red"
                                        variant="filled"
                                        className="absolute -top-1 -right-1"
                                        onClick={() =>
                                            handleRemoveImage(
                                                currentProduct.orderItemId,
                                                index
                                            )
                                        }
                                    >
                                        <FiX size={10} />
                                    </ActionIcon>
                                )}
                                {!item.isUploaded && !item.isUploading && (
                                    <Box className="absolute inset-0 flex items-center justify-center bg-red-50 bg-opacity-80 rounded-md">
                                        <FiTrash2 size={16} className="text-red-500" />
                                    </Box>
                                )}
                            </Box>
                        ))}

                        {currentReview.media.length < MAX_IMAGES && (
                            <label
                                className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-400 transition-colors"
                                style={{ width: 80, height: 80 }}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={(e) => handleImageUpload(e.target.files)}
                                />
                                <Stack gap={2} align="center">
                                    <FiCamera size={20} className="text-gray-400" />
                                    <Text size="xs" c="dimmed">
                                        Thêm ảnh
                                    </Text>
                                </Stack>
                            </label>
                        )}
                    </Group>
                </Box>
            </Stack>

            <Group justify="flex-end" mt="xl">
                <Button variant="outline" onClick={onClose}>
                    Hủy
                </Button>
                <Button
                    color="blue"
                    onClick={handleSubmit}
                    loading={isSubmitting}
                    disabled={!isFormValid}
                    leftSection={<FiStar size={14} />}
                >
                    {currentProductIndex < unreviewedProducts.length - 1
                        ? 'Đánh giá & Tiếp theo'
                        : 'Gửi đánh giá'}
                </Button>
            </Group>
        </Modal>
    );
};

export default AddCommentModal;
