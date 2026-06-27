export type ShopStatus = 'pending' | 'approved' | 'rejected';
export type ShopDateRange = [Date | null, Date | null];

export interface ShopOwner {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
}

export interface AdminShop {
    id: string;
    name: string;
    description: string;
    avatarUrl: string;
    owner: ShopOwner;
    createdAt: string;
    status: ShopStatus;
    productCount: number;
    followerCount: number;
    totalReviews: number;
    averageRating: number;
    reviewNote?: string;
}
