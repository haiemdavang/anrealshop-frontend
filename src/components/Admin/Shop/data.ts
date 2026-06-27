import type { AdminShop, ShopStatus } from './types';

export const MOCK_SHOPS: AdminShop[] = [
    {
        id: 'SHP001',
        name: 'Fashion Store',
        description: 'Cửa hàng thời trang nam nữ chất lượng cao, giá cả phải chăng.',
        avatarUrl: 'https://images.unsplash.com/photo-1507914372368-b2b085b925a1?q=80&w=100',
        owner: {
            id: 'U001',
            fullName: 'Nguyễn Văn A',
            email: 'nguyenvana@example.com',
            phoneNumber: '0901234567',
        },
        createdAt: '2023-05-15T08:30:00Z',
        status: 'pending',
        productCount: 0,
        followerCount: 0,
        totalReviews: 0,
        averageRating: 0,
    },
    {
        id: 'SHP002',
        name: 'Sportland',
        description: 'Chuyên cung cấp các sản phẩm thể thao chính hãng.',
        avatarUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=100',
        owner: {
            id: 'U002',
            fullName: 'Trần Văn B',
            email: 'tranvanb@example.com',
            phoneNumber: '0912345678',
        },
        createdAt: '2023-05-16T10:15:00Z',
        status: 'pending',
        productCount: 0,
        followerCount: 0,
        totalReviews: 0,
        averageRating: 0,
    },
    {
        id: 'SHP003',
        name: 'Accessories World',
        description: 'Thế giới phụ kiện điện thoại, laptop và các thiết bị điện tử.',
        avatarUrl: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=100',
        owner: {
            id: 'U003',
            fullName: 'Lê Thị C',
            email: 'lethic@example.com',
            phoneNumber: '0923456789',
        },
        createdAt: '2023-05-17T09:45:00Z',
        status: 'approved',
        productCount: 15,
        followerCount: 120,
        totalReviews: 45,
        averageRating: 4.7,
        reviewNote: 'Cửa hàng đầy đủ thông tin, hình ảnh chuyên nghiệp.',
    },
    {
        id: 'SHP004',
        name: 'Tech Garden',
        description: 'Chuyên cung cấp các sản phẩm công nghệ chính hãng.',
        avatarUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=100',
        owner: {
            id: 'U004',
            fullName: 'Phạm Văn D',
            email: 'phamvand@example.com',
            phoneNumber: '0934567890',
        },
        createdAt: '2023-05-18T14:20:00Z',
        status: 'rejected',
        productCount: 0,
        followerCount: 0,
        totalReviews: 0,
        averageRating: 0,
        reviewNote: 'Thông tin cửa hàng chưa đầy đủ, cần bổ sung hình ảnh và mô tả.',
    },
];

export const SHOP_STATUS_OPTIONS: Array<{
    id: 'all' | ShopStatus;
    label: string;
    color: string;
}> = [
    { id: 'all', label: 'Tất cả', color: 'blue' },
    { id: 'pending', label: 'Chờ duyệt', color: 'yellow' },
    { id: 'approved', label: 'Đã duyệt', color: 'green' },
    { id: 'rejected', label: 'Đã từ chối', color: 'red' },
];

export const getShopStatusColor = (status: ShopStatus) => {
    if (status === 'approved') return 'green';
    if (status === 'rejected') return 'red';
    return 'yellow';
};

export const getShopStatusLabel = (status: ShopStatus) => {
    if (status === 'approved') return 'Đã phê duyệt';
    if (status === 'rejected') return 'Đã từ chối';
    return 'Đang chờ duyệt';
};
