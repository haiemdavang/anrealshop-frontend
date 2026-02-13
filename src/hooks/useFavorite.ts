import { useCallback, useEffect } from 'react';
import showErrorNotification from '../components/Toast/NotificationError';
import { addFavorite, fetchFavoriteIds, removeFavorite } from '../store/favoriteSlice';
import { useAppDispatch, useAppSelector } from './useAppRedux';

export const useFavorite = () => {
    const dispatch = useAppDispatch();
    const { productIds, status } = useAppSelector(state => state.favorites);
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchFavoriteIds());
        }
    }, [isAuthenticated, dispatch]);

    const isFavorite = useCallback((productId: string) => {
        return productIds.includes(productId);
    }, [productIds]);

    const toggleFavorite = useCallback(async (productId: string) => {
        if (!isAuthenticated) {
            showErrorNotification('Vui lòng đăng nhập', 'Bạn cần đăng nhập để thêm sản phẩm yêu thích.');
            return;
        }

        const wasFavorite = productIds.includes(productId);

        try {
            if (wasFavorite) {
                await dispatch(removeFavorite(productId)).unwrap();
            } else {
                await dispatch(addFavorite(productId)).unwrap();
            }
        } catch {
            showErrorNotification('Lỗi', 'Không thể cập nhật danh sách yêu thích.');
        }
    }, [isAuthenticated, productIds, dispatch]);

    return {
        favoriteIds: productIds,
        isFavorite,
        toggleFavorite,
        loading: status === 'loading',
    };
};
