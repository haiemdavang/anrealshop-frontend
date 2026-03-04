import {
    Group,
    Image,
    Paper,
    Rating,
    Skeleton,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';
import {
    FiImage,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { ReviewService } from '../../../../service/PreviewService';
import type { ProductReviewDto } from '../../../../types/PreviewType';
import { formatDate } from '../../../../untils/Untils';
import { ContentEmpty } from '../../../common/ContentEmpty';
import PaginationCustom from '../../../common/PaginationCustom';
import ZoomViewModal from '../../../common/ZoomViewModal';
import showErrorNotification from '../../../Toast/NotificationError';

const ITEMS_PER_PAGE = 5;

const MyReviews = () => {
    const [reviews, setReviews] = useState<ProductReviewDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activePage, setActivePage] = useState(1);

    // Image preview state
    const [previewOpened, setPreviewOpened] = useState(false);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [previewIndex, setPreviewIndex] = useState(0);

    const fetchReviews = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await ReviewService.getMyReviews();
            setReviews(data);
        } catch {
            showErrorNotification('Lỗi', 'Không thể tải danh sách đánh giá.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const openPreview = (images: string[], index: number) => {
        setPreviewImages(images);
        setPreviewIndex(index);
        setPreviewOpened(true);
    };

    const totalPages = Math.ceil(reviews.length / ITEMS_PER_PAGE);
    const paginatedReviews = reviews.slice(
        (activePage - 1) * ITEMS_PER_PAGE,
        activePage * ITEMS_PER_PAGE
    );

    return (
        <div className="overflow-hidden 2xl:h-[94vh] md:h-[85vh]">
            <Group justify="space-between" mb="md">
                <Title order={4} className="text-slate-800">
                    Đánh giá của tôi
                </Title>
                {!isLoading && reviews.length > 0 && (
                    <Text size="sm" c="dimmed">
                        {reviews.length} đánh giá
                    </Text>
                )}
            </Group>

            {isLoading ? (
                <ReviewsSkeleton count={4} />
            ) : reviews.length > 0 ? (
                <div className="flex flex-col 2xl:h-[85vh] md:h-[80vh]">
                    <Stack gap="sm" className="overflow-y-auto flex-1">
                        {paginatedReviews.map((review) => (
                            <ReviewItem
                                key={review.id}
                                review={review}
                                onImageClick={openPreview}
                            />
                        ))}
                    </Stack>

                    {totalPages > 1 && (
                        <PaginationCustom
                            currentPage={activePage}
                            totalPages={totalPages}
                            totalItems={reviews.length}
                            itemsPerPage={ITEMS_PER_PAGE}
                            onPageChange={setActivePage}
                        />
                    )}
                </div>
            ) : (
                <ContentEmpty
                    title="Chưa có đánh giá nào"
                    description="Hãy mua hàng và đánh giá sản phẩm để chia sẻ trải nghiệm của bạn"
                    buttonText="Khám phá sản phẩm"
                    buttonLink="/products"
                    height="h-[72vh]"
                />
            )}

            {/* Image Preview */}
            <ZoomViewModal
                opened={previewOpened}
                onClose={() => setPreviewOpened(false)}
                images={previewImages}
                selectedIndex={previewIndex}
                onSelectIndex={setPreviewIndex}
                altPrefix="Ảnh đánh giá"
            />
        </div>
    );
};

// --------------- Review Item ---------------

interface ReviewItemProps {
    review: ProductReviewDto;
    onImageClick: (images: string[], index: number) => void;
}

const getRatingLabel = (rating: number): string => {
    switch (rating) {
        case 1: return 'Tệ';
        case 2: return 'Không hài lòng';
        case 3: return 'Bình thường';
        case 4: return 'Hài lòng';
        case 5: return 'Tuyệt vời';
        default: return '';
    }
};

const ReviewItem: React.FC<ReviewItemProps> = ({ review, onImageClick }) => {
    const mediaUrls = review.mediaList?.map((m) => m.url) || [];

    return (
        <Paper withBorder p="md" radius="md" className="hover:shadow-md transition-shadow duration-200">
            <Group wrap="nowrap" align="flex-start">
                {/* Product Image */}
                <Image
                        src={review.productImage}
                        alt={review.productName}
                        w={90}
                        h={90}
                        radius="md"
                        className="object-cover"
                        fallbackSrc="https://placehold.co/90x90?text=No+Image"
                    />

                {/* Review content */}
                <div className="flex-1 min-w-0">
                    <Link to={`/products/${review.productId}`} className="no-underline">
                        <Text fw={500} lineClamp={1} className="text-slate-800 hover:text-blue-600 transition-colors">
                            {review.productName}
                        </Text>
                    </Link>

                    {/* Rating */}
                    <Group gap="xs" mt={4} align="center">
                        <Rating value={review.rating} size="sm" readOnly />
                        <Text size="xs" c="orange" fw={500}>
                            {getRatingLabel(review.rating)}
                        </Text>
                    </Group>

                    {/* Comment */}
                    {review.comment && (
                        <Text size="sm" mt={6} lineClamp={3} className="text-gray-700">
                            {review.comment}
                        </Text>
                    )}

                    {/* Media images - list layout */}
                    {mediaUrls.length > 0 && (
                        <Stack gap="xs" mt={8}>
                            <Group gap={4}>
                                <FiImage size={14} className="text-gray-400" />
                                <Text size="xs" c="dimmed">{mediaUrls.length} hình ảnh đánh giá</Text>
                            </Group>
                            <Stack gap="xs">
                                {review.mediaList?.map((media, idx) => (
                                    <Group
                                        key={media.id || idx}
                                        gap="sm"
                                        className="cursor-pointer hover:bg-gray-50 rounded-md p-1 transition-colors"
                                        onClick={() => onImageClick(mediaUrls, idx)}
                                    >
                                        <Image
                                            src={media.thumbnailUrl || media.url}
                                            w={48}
                                            h={48}
                                            radius="sm"
                                            className="object-cover border border-gray-200 flex-shrink-0"
                                        />
                                        <Text size="xs" c="dimmed" lineClamp={1} className="flex-1">
                                            Hình {idx + 1}
                                        </Text>
                                    </Group>
                                ))}
                            </Stack>
                        </Stack>
                    )}

                    {/* Date */}
                    <Text size="xs" c="dimmed" mt={6}>
                        {formatDate(review.createdAt)}
                        {review.updatedAt && review.updatedAt !== review.createdAt && (
                            <> · Đã chỉnh sửa</>
                        )}
                    </Text>
                </div>
            </Group>
        </Paper>
    );
};

// --------------- Skeleton ---------------

const ReviewsSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
    return (
        <Stack gap="sm">
            {Array(count).fill(0).map((_, i) => (
                <Paper key={i} withBorder p="md" radius="md">
                    <Group wrap="nowrap">
                        <Skeleton height={90} width={90} radius="md" />
                        <div className="flex-1">
                            <Skeleton height={18} width="50%" mb="xs" />
                            <Skeleton height={14} width="30%" mb="xs" />
                            <Skeleton height={14} width="80%" mb="xs" />
                            <Group gap="xs">
                                <Skeleton height={56} width={56} radius="sm" />
                                <Skeleton height={56} width={56} radius="sm" />
                            </Group>
                            <Skeleton height={12} width="25%" mt="xs" />
                        </div>
                    </Group>
                </Paper>
            ))}
        </Stack>
    );
};

export default MyReviews;
