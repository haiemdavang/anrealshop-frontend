import {
    ActionIcon,
    Group,
    Image,
    Paper,
    Skeleton,
    Stack,
    Text,
    Title,
    Tooltip,
} from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import PaginationCustom from '../../../common/PaginationCustom';
import FavoriteService from '../../../../service/FavoriteService';
import { removeFavorite } from '../../../../store/favoriteSlice';
import type { FavoriteDto, FavoritePageResponse } from '../../../../types/FavoriteType';
import { formatDate, formatPrice } from '../../../../untils/Untils';
import { ContentEmpty } from '../../../common/ContentEmpty';
import showErrorNotification from '../../../Toast/NotificationError';
import showSuccessNotification from '../../../Toast/NotificationSuccess';
import { useAppDispatch } from '../../../../hooks/useAppRedux';

const ITEMS_PER_PAGE = 5;

const Favorite = () => {
    const dispatch = useAppDispatch();
    const [favorites, setFavorites] = useState<FavoriteDto[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [activePage, setActivePage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const fetchFavorites = useCallback(async (page: number) => {
        setIsLoading(true);
        try {
            const data: FavoritePageResponse = await FavoriteService.getMyFavorites(page - 1, ITEMS_PER_PAGE);
            setFavorites(data.content);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
        } catch {
            showErrorNotification('Lỗi', 'Không thể tải danh sách yêu thích.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFavorites(activePage);
    }, [activePage, fetchFavorites]);

    const handleRemove = useCallback(async (item: FavoriteDto) => {
        try {
            await dispatch(removeFavorite(item.productId)).unwrap();
            showSuccessNotification('Thành công', `Đã xóa "${item.productName}" khỏi danh sách yêu thích.`);
            // Reload current page, or go back if last item on page
            if (favorites.length === 1 && activePage > 1) {
                setActivePage(activePage - 1);
            } else {
                fetchFavorites(activePage);
            }
        } catch {
            showErrorNotification('Lỗi', 'Không thể xóa sản phẩm khỏi danh sách yêu thích.');
        }
    }, [dispatch, favorites.length, activePage, fetchFavorites]);

    const handlePageChange = (page: number) => {
        setActivePage(page);
    };

    return (
        <div className="overflow-hidden 2xl:h-[94vh] md:h-[85vh]">
            <Group justify="space-between" mb="md">
                <Title order={4} className="text-slate-800">
                    Sản phẩm yêu thích
                </Title>
                {!isLoading && totalElements > 0 && (
                    <Text size="sm" c="dimmed">
                        {totalElements} sản phẩm
                    </Text>
                )}
            </Group>

            {isLoading ? (
                <FavoriteSkeleton count={4} />
            ) : favorites.length > 0 ? (
                <div className="flex flex-col 2xl:h-[85vh] md:h-[80vh]">
                    <Stack gap="sm" className="overflow-y-auto flex-1">
                        {favorites.map((item) => (
                            <FavoriteItem
                                key={item.id}
                                item={item}
                                onRemove={handleRemove}
                            />
                        ))}
                    </Stack>

                    {totalPages > 1 && (
                        <PaginationCustom
                            currentPage={activePage}
                            totalPages={totalPages}
                            totalItems={totalElements}
                            itemsPerPage={ITEMS_PER_PAGE}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            ) : (
                <ContentEmpty
                    title="Chưa có sản phẩm yêu thích"
                    description="Hãy thêm sản phẩm yêu thích để theo dõi và mua sắm dễ dàng hơn"
                    buttonText="Khám phá sản phẩm"
                    buttonLink="/products"
                    imageType="boan_khoan"
                    height="h-[72vh]"
                />
            )}
        </div>
    );
};

// --------------- Favorite Item ---------------

interface FavoriteItemProps {
    item: FavoriteDto;
    onRemove: (item: FavoriteDto) => void;
}

const FavoriteItem: React.FC<FavoriteItemProps> = ({ item, onRemove }) => {
    const hasDiscount = item.productDiscountPrice > 0 && item.productDiscountPrice < item.productPrice;
    const discountPercentage = hasDiscount
        ? Math.round(((item.productPrice - item.productDiscountPrice) / item.productPrice) * 100)
        : 0;

    return (
        <Paper withBorder p="md" radius="md" className="hover:shadow-md transition-shadow duration-200">
            <Group wrap="nowrap" align="flex-start">
                {/* Product Image */}
                <Link to={`/products/${item.productId}`}>
                    <Image
                        src={item.productThumbnail}
                        alt={item.productName}
                        w={90}
                        h={90}
                        radius="md"
                        className="object-cover flex-shrink-0"
                    />
                </Link>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.productId}`} className="no-underline">
                        <Text fw={500} lineClamp={2} className="text-slate-800 hover:text-blue-600 transition-colors">
                            {item.productName}
                        </Text>
                    </Link>

                    <Text size="xs" c="dimmed" mt={4}>
                        Shop: {item.shopName}
                    </Text>

                    <Group gap={8} mt={6}>
                        {hasDiscount ? (
                            <>
                                <Text fw={700} size="sm" className="text-red-500">
                                    {formatPrice(item.productDiscountPrice)}
                                </Text>
                                <Text td="line-through" c="dimmed" size="xs">
                                    {formatPrice(item.productPrice)}
                                </Text>
                                <Text size="xs" className="text-red-500 font-medium">
                                    -{discountPercentage}%
                                </Text>
                            </>
                        ) : (
                            <Text fw={700} size="sm" className="text-slate-800">
                                {formatPrice(item.productPrice)}
                            </Text>
                        )}
                    </Group>

                    <Text size="xs" c="dimmed" mt={4}>
                        Đã thêm: {formatDate(item.createdAt)}
                    </Text>
                </div>

                {/* Actions */}
                <Group gap="xs" className="flex-shrink-0">
                    <Tooltip label="Xóa khỏi yêu thích">
                        <ActionIcon
                            variant="light"
                            color="red"
                            size="md"
                            onClick={() => onRemove(item)}
                        >
                            <FiTrash2 size={16} />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </Group>
        </Paper>
    );
};

// --------------- Skeleton ---------------

const FavoriteSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
    return (
        <Stack gap="sm">
            {Array(count).fill(0).map((_, i) => (
                <Paper key={i} withBorder p="md" radius="md">
                    <Group wrap="nowrap">
                        <Skeleton height={90} width={90} radius="md" />
                        <div className="flex-1">
                            <Skeleton height={18} width="60%" mb="xs" />
                            <Skeleton height={14} width="30%" mb="xs" />
                            <Skeleton height={16} width="25%" mb="xs" />
                            <Skeleton height={12} width="35%" />
                        </div>
                        <Group gap="xs">
                            <Skeleton height={30} width={30} radius="md" />
                        </Group>
                    </Group>
                </Paper>
            ))}
        </Stack>
    );
};

export default Favorite;
