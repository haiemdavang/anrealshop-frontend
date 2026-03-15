import { API_ENDPOINTS } from "../constant";
import type { FavoriteDto, FavoritePageResponse, FavoriteRequest } from "../types/FavoriteType";
import { axiosInstance } from "./AxiosInstant";

const addFavorite = async (productId: string): Promise<FavoriteDto> => {
    const request: FavoriteRequest = { productId };
    const response = await axiosInstance.post(API_ENDPOINTS.FAVORITES.BASE, request);
    return response.data;
};

const removeFavoriteByProductId = async (productId: string): Promise<{ message: string }> => {
    const response = await axiosInstance.delete(API_ENDPOINTS.FAVORITES.REMOVE_BY_PRODUCT(productId));
    return response.data;
};

const removeFavoriteById = async (favoriteId: string): Promise<{ message: string }> => {
    const response = await axiosInstance.delete(API_ENDPOINTS.FAVORITES.REMOVE_BY_ID(favoriteId));
    return response.data;
};

const getMyFavorites = async (page: number = 0, size: number = 20): Promise<FavoritePageResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.FAVORITES.BASE, {
        params: { page, size },
    });
    return response.data;
};

const checkFavorite = async (productId: string): Promise<boolean> => {
    const response = await axiosInstance.get(API_ENDPOINTS.FAVORITES.CHECK(productId));
    return response.data.isFavorite;
};

const countMyFavorites = async (): Promise<number> => {
    const response = await axiosInstance.get(API_ENDPOINTS.FAVORITES.COUNT);
    return response.data.count;
};

const getMyFavoriteProductIds = async (): Promise<Set<string>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.FAVORITES.PRODUCT_IDS);
    return new Set(response.data);
};

const FavoriteService = {
    addFavorite,
    removeFavoriteByProductId,
    removeFavoriteById,
    getMyFavorites,
    checkFavorite,
    countMyFavorites,
    getMyFavoriteProductIds,
};

export default FavoriteService;
