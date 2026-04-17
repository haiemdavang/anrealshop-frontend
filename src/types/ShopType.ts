export interface BaseShopDto {
  id: string;
  name: string;
  avatarUrl: string; 
} 

export interface ShopDto extends BaseShopDto {
  shopUrl: string;
}

export interface ShopDetailDto extends ShopDto {
  description?: string;
  productCount?: number;
  averageRating?: number;
  totalReviews?: number;
  followerCount?: number;
}

export interface ShopCreateRequest {
  name: string;
}

export interface ShopUpdateRequest {
  name?: string;
  description?: string;
  urlSlug?: string;
  avatarUrl?: string;
}