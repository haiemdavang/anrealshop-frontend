import {
  Avatar,
  Box,
  Button,
  Divider,
  Group,
  Image,
  Paper,
  Progress,
  Rating,
  Stack,
  Text,
  Title
} from '@mantine/core';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
import { FiCamera, FiStar } from 'react-icons/fi';
import type { ProductReviewDto, ReviewSummaryDto } from '../../../types/PreviewType';
import { formatRelativeDate } from '../../../untils/Untils';
import PaginationCustom from '../../common/PaginationCustom';
import ZoomViewModal from './ZoomViewModal';

interface ProductRateProps {
  reviews: ProductReviewDto[];
  reviewSummary: ReviewSummaryDto;
}

const ProductRate = ({
  reviews,
  reviewSummary,
}: ProductRateProps) => {
  const averageRating = reviewSummary?.averageRating ?? 0;
  const totalReviews = reviewSummary?.totalReviews ?? 0;
  const ratingDistribution = {
    5: reviewSummary?.fiveStar ?? 0,
    4: reviewSummary?.fourStar ?? 0,
    3: reviewSummary?.threeStar ?? 0,
    2: reviewSummary?.twoStar ?? 0,
    1: reviewSummary?.oneStar ?? 0,
  };
  const rateRef = useRef<HTMLDivElement>(null);
  const [zoomImages, setZoomImages] = useState<string[]>([]);
  const [zoomIndex, setZoomIndex] = useState(0);
  const [zoomOpened, setZoomOpened] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [showWithImages, setShowWithImages] = useState(false);

  const scrollToTop = () => {
    rateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToTop();
  };

  const totalRatings = Object.values(ratingDistribution).reduce((a, b) => a + b, 0) || 1;

  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      if (filterRating && review.rating !== filterRating) return false;
      if (showWithImages && (!review.mediaList || review.mediaList.length === 0)) return false;
      return true;
    });
  }, [reviews, filterRating, showWithImages]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const displayedReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const reviewsWithImagesCount = reviews.filter(r => r.mediaList && r.mediaList.length > 0).length;

  const allImages = useMemo(() => {
    return reviews.flatMap(review =>
      (review.mediaList ?? []).filter(m => m.type === 'IMAGE').map(m => ({ url: m.url, reviewId: review.id }))
    );
  }, [reviews]);

  const openGalleryZoom = (index: number) => {
    setZoomImages(allImages.map(img => img.url));
    setZoomIndex(index);
    setZoomOpened(true);
  };

  const openReviewZoom = (review: ProductReviewDto, mediaIndex: number) => {
    const reviewImages = (review.mediaList ?? []).filter(m => m.type === 'IMAGE').map(m => m.url);
    setZoomImages(reviewImages);
    setZoomIndex(mediaIndex);
    setZoomOpened(true);
  };

  return (
    <>
      <Paper ref={rateRef} radius="md" className="!bg-white !shadow-sm !mb-6">
        <Box className="p-5">
          <Title order={4} className="!mb-5">Đánh giá sản phẩm</Title>

          {/* Rating Summary */}
          <Box className="flex flex-col sm:flex-row gap-6 mb-5">
            <Box className="flex flex-col items-center justify-center min-w-[140px] py-3">
              <Text className="!text-4xl !font-bold text-primary">{averageRating.toFixed(1)}</Text>
              <Text size="xs" c="dimmed" className="!mb-1">trên 5</Text>
              <Rating value={averageRating} fractions={4} readOnly size="md" />
              <Text size="xs" c="dimmed" className="!mt-2">{totalReviews} đánh giá</Text>
            </Box>

            <Divider orientation="vertical" className="!hidden sm:!block" />

            <Box className="flex-1">
              <Stack gap={6}>
                {([5, 4, 3, 2, 1] as const).map((star) => {
                  const count = ratingDistribution[star];
                  const percent = (count / totalRatings) * 100;
                  return (
                    <Group key={star} gap="xs" wrap="nowrap" className="cursor-pointer" onClick={() => { setFilterRating(filterRating === star ? null : star); setCurrentPage(1); setShowReviews(true); }}>
                      <Group gap={4} wrap="nowrap" w={40} justify="flex-end">
                        <Text size="sm" fw={500}>{star}</Text>
                        <FiStar size={12} className="text-yellow-400 fill-yellow-400" />
                      </Group>
                      <Progress value={percent} size="sm" radius="xl" className="flex-1" />
                      <Text size="xs" c="dimmed" w={28} className="text-right">{count}</Text>
                    </Group>
                  );
                })}
              </Stack>
            </Box>
          </Box>

          {/* "Xem thêm" or reviews section */}
          <AnimatePresence mode="wait">
          {!showReviews ? (
            <motion.div
              key="show-more"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Group justify="flex-end" className="mt-2">
                <Button
                  variant="subtle"
                  size="xs"
                  onClick={() => setShowReviews(true)}
                >
                  Xem {totalReviews} đánh giá &rarr;
                </Button>
              </Group>
            </motion.div>
          ) : (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <Divider className="!mb-0" />

              {/* Filters */}
              <Group gap={6} className="my-4 flex-wrap">
                <Button
                  variant={!filterRating && !showWithImages ? 'filled' : 'default'}
                  size="xs"
                  radius="md"
                  onClick={() => { setFilterRating(null); setShowWithImages(false); setCurrentPage(1); }}
                >
                  Tất cả
                </Button>
                {([5, 4, 3, 2, 1] as const).map(star => (
                  <Button
                    key={star}
                    variant={filterRating === star ? 'filled' : 'default'}
                    size="xs"
                    radius="md"
                    leftSection={<FiStar size={11} />}
                    onClick={() => { setFilterRating(filterRating === star ? null : star); setCurrentPage(1); }}
                  >
                    {star} ({ratingDistribution[star]})
                  </Button>
                ))}
                <Button
                  variant={showWithImages ? 'filled' : 'default'}
                  size="xs"
                  radius="md"
                  leftSection={<FiCamera size={11} />}
                  onClick={() => { setShowWithImages(!showWithImages); setCurrentPage(1); }}
                >
                  Có ảnh ({reviewsWithImagesCount})
                </Button>
              </Group>

              {/* Image Gallery */}
              {allImages.length > 0 && (
                <Box className="mb-4">
                  <Group gap={8}>
                    {allImages.slice(0, 6).map((image, index) => (
                      <Box
                        key={`gallery-${index}`}
                        className="w-[72px] h-[72px] cursor-pointer overflow-hidden rounded-md border border-gray-200 hover:border-primary transition-colors"
                        onClick={() => openGalleryZoom(index)}
                      >
                        <Image src={image.url} alt={`Ảnh ${index + 1}`} w={72} h={72} fit="cover" />
                      </Box>
                    ))}
                    {allImages.length > 6 && (
                      <Box
                        className="w-[72px] h-[72px] cursor-pointer overflow-hidden rounded-md border border-gray-200 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors"
                        onClick={() => openGalleryZoom(6)}
                      >
                        <Text size="xs" fw={600} c="dimmed">+{allImages.length - 6}</Text>
                      </Box>
                    )}
                  </Group>
                </Box>
              )}

              <Divider className="!mb-0" />

              {/* Review List */}
              <Stack gap={0}>
                {displayedReviews.length > 0 ? (
                  displayedReviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: index * 0.05 }}
                    >
                      <Box className="py-4">
                        <Group justify="space-between" align="flex-start" className="mb-2">
                          <Group gap="sm">
                            <Avatar src={review.userAvatarUrl} radius="xl" size={38} color="blue">
                              {(review.userName ?? '').charAt(0).toUpperCase()}
                            </Avatar>
                            <div>
                              <Text size="sm" fw={600}>{review.userName}</Text>
                              <Rating value={review.rating} readOnly size="xs" className="mt-0.5" />
                            </div>
                          </Group>
                          <Text size="xs" c="dimmed">{formatRelativeDate(review.createdAt)}</Text>
                        </Group>

                        {review.comment && (
                          <Text size="sm" className="!text-gray-700 !leading-relaxed ml-[50px] mb-2">
                            {review.comment}
                          </Text>
                        )}

                        {review.mediaList && review.mediaList.length > 0 && (
                          <Group gap={6} className="ml-[50px] mb-2">
                            {review.mediaList.map((m, idx) => (
                              <Box
                                key={`${review.id}-${idx}`}
                                className="w-[64px] h-[64px] cursor-pointer overflow-hidden rounded-md border border-gray-200 hover:border-primary transition-colors"
                                onClick={() => openReviewZoom(review, idx)}
                              >
                                <Image src={m.url} w={64} h={64} fit="cover" alt={`Ảnh ${idx + 1}`} />
                              </Box>
                            ))}
                          </Group>
                        )}
                      </Box>
                      {index < displayedReviews.length - 1 && <Divider />}
                    </motion.div>
                  ))
                ) : (
                  <Box className="py-10 text-center">
                    <FiStar size={36} className="mx-auto mb-2 text-gray-300" />
                    <Text size="sm" c="dimmed">Không có đánh giá phù hợp</Text>
                    <Button
                      variant="subtle"
                      size="xs"
                      className="mt-2"
                      onClick={() => { setFilterRating(null); setShowWithImages(false); setCurrentPage(1); }}
                    >
                      Xóa bộ lọc
                    </Button>
                  </Box>
                )}
              </Stack>

              <Group justify="space-between" align="center" className="mt-4">
                <Button
                  variant="subtle"
                  size="xs"
                  onClick={() => { setShowReviews(false); scrollToTop(); }}
                >
                  Thu gọn
                </Button>
                {totalPages > 1 && (
                  <PaginationCustom
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredReviews.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                  />
                )}
              </Group>
            </motion.div>
          )}
          </AnimatePresence>
        </Box>
      </Paper>

      <ZoomViewModal
        opened={zoomOpened}
        onClose={() => setZoomOpened(false)}
        images={zoomImages}
        selectedIndex={zoomIndex}
        onSelectIndex={setZoomIndex}
        altPrefix="Ảnh đánh giá"
      />
    </>
  );
};

export default ProductRate;