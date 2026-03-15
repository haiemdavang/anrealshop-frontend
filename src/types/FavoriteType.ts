export interface FavoriteDto {
    id: string;
    productId: string;
    productName: string;
    productThumbnail: string;
    productPrice: number;
    productDiscountPrice: number;
    shopId: string;
    shopName: string;
    createdAt: string;
}

export interface FavoriteRequest {
    productId: string;
}

export interface FavoritePageResponse {
    content: FavoriteDto[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}
