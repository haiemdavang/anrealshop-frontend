import type { MediaType } from "./CommonType";

export interface ProductMediaDto {
    id?: string;
    url: string;
    thumbnailUrl: string;
    type: MediaType;
}

export interface CreateReviewRequest {
    orderItemId: string;
    rating: number;
    comment?: string;
    mediaList?: ProductMediaDto[];
}

export interface ProductReviewDto {
    id: string;
    userId: string;
    userName: string;
    userAvatarUrl?: string;
    productId: string;
    productName: string;
    productImage: string;
    orderItemId: string;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt?: string;
    mediaList?: ProductMediaDto[];
}

export interface ReviewSummaryDto {
    totalReviews: number;
    averageRating: number;
    fiveStar: number;
    fourStar: number;
    threeStar: number;
    twoStar: number;
    oneStar: number;
}

export interface ReviewListResponse {
    summary?: ReviewSummaryDto;
    reviews: ProductReviewDto[];
}
