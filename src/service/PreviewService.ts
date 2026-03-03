import { API_ENDPOINTS } from "../constant";
import type { CreateReviewRequest, ProductReviewDto, ReviewListResponse } from "../types/PreviewType";
import { axiosInstance } from "./AxiosInstant";

const createReview = async (request: CreateReviewRequest): Promise<ProductReviewDto> => {
    const response = await axiosInstance.post(API_ENDPOINTS.REVIEWS.CREATE, request);
    return response.data;
};

const getReviewsByProductId = async (productId: string, size: number = 10): Promise<ReviewListResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.REVIEWS.GET_BY_PRODUCT(productId), {
        params: { size },
    });
    return response.data;
};

export const ReviewService = {
    createReview,
    getReviewsByProductId,
};
