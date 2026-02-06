import type { UserProductDto } from '../../../types/ProductType';

export const MOCK_TRYON_PRODUCTS: UserProductDto[] = [
  {
    id: '1',
    name: 'Áo thun basic trắng',
    price: 150000,
    discountPrice: 120000,
    thumbnailUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    sortDescription: 'Áo thun basic trắng chất liệu cotton cao cấp, thoáng mát',
    urlSlug: 'ao-thun-basic-trang',
    quantity: 100,
    sold: 500,
    averageRating: 4.5,
    totalReviews: 120,
    categoryId: 'cat-001',
    categoryName: 'Áo thun',
    shopId: 'shop-abc',
    shopName: 'Shop Thời Trang ABC',
    shopThumbnailUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200'
  },
  {
    id: '2',
    name: 'Áo sơ mi công sở',
    price: 250000,
    discountPrice: 0,
    thumbnailUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400',
    sortDescription: 'Áo sơ mi công sở lịch sự, phù hợp đi làm',
    urlSlug: 'ao-so-mi-cong-so',
    quantity: 50,
    sold: 320,
    averageRating: 4.8,
    totalReviews: 85,
    categoryId: 'cat-002',
    categoryName: 'Áo sơ mi',
    shopId: 'shop-xyz',
    shopName: 'Shop Thời Trang XYZ',
    shopThumbnailUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200'
  },
  {
    id: '3',
    name: 'Áo khoác jean',
    price: 350000,
    discountPrice: 280000,
    thumbnailUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    sortDescription: 'Áo khoác jean phong cách năng động, trẻ trung',
    urlSlug: 'ao-khoac-jean',
    quantity: 75,
    sold: 750,
    averageRating: 4.6,
    totalReviews: 200,
    categoryId: 'cat-003',
    categoryName: 'Áo khoác',
    shopId: 'shop-def',
    shopName: 'Shop Thời Trang DEF',
    shopThumbnailUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200'
  },
  {
    id: '4',
    name: 'Áo hoodie đen',
    price: 280000,
    discountPrice: 230000,
    thumbnailUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
    sortDescription: 'Áo hoodie đen basic, chất nỉ mềm mại',
    urlSlug: 'ao-hoodie-den',
    quantity: 80,
    sold: 420,
    averageRating: 4.7,
    totalReviews: 156,
    categoryId: 'cat-004',
    categoryName: 'Áo hoodie',
    shopId: 'shop-abc',
    shopName: 'Shop Thời Trang ABC',
    shopThumbnailUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200'
  },
  {
    id: '5',
    name: 'Áo polo nam',
    price: 180000,
    discountPrice: 0,
    thumbnailUrl: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400',
    sortDescription: 'Áo polo nam lịch sự, phù hợp nhiều dịp',
    urlSlug: 'ao-polo-nam',
    quantity: 120,
    sold: 280,
    averageRating: 4.4,
    totalReviews: 95,
    categoryId: 'cat-005',
    categoryName: 'Áo polo',
    shopId: 'shop-xyz',
    shopName: 'Shop Thời Trang XYZ',
    shopThumbnailUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200'
  },
  {
    id: '6',
    name: 'Áo len cổ lọ',
    price: 320000,
    discountPrice: 270000,
    thumbnailUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400',
    sortDescription: 'Áo len cổ lọ ấm áp, thời trang mùa đông',
    urlSlug: 'ao-len-co-lo',
    quantity: 60,
    sold: 890,
    averageRating: 4.9,
    totalReviews: 234,
    categoryId: 'cat-006',
    categoryName: 'Áo len',
    shopId: 'shop-def',
    shopName: 'Shop Thời Trang DEF',
    shopThumbnailUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200'
  },
  {
    id: '7',
    name: 'Áo blazer công sở',
    price: 450000,
    discountPrice: 380000,
    thumbnailUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400',
    sortDescription: 'Áo blazer công sở sang trọng, chuyên nghiệp',
    urlSlug: 'ao-blazer-cong-so',
    quantity: 45,
    sold: 310,
    averageRating: 4.6,
    totalReviews: 142,
    categoryId: 'cat-007',
    categoryName: 'Áo blazer',
    shopId: 'shop-abc',
    shopName: 'Shop Thời Trang ABC',
    shopThumbnailUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200'
  },
  {
    id: '8',
    name: 'Áo thun polo cao cấp',
    price: 220000,
    discountPrice: 0,
    thumbnailUrl: 'https://images.unsplash.com/photo-1598032895397-7d0c1bb5f10f?w=400',
    sortDescription: 'Áo thun polo cao cấp, chất liệu thể thao',
    urlSlug: 'ao-thun-polo-cao-cap',
    quantity: 90,
    sold: 267,
    averageRating: 4.5,
    totalReviews: 98,
    categoryId: 'cat-005',
    categoryName: 'Áo polo',
    shopId: 'shop-xyz',
    shopName: 'Shop Thời Trang XYZ',
    shopThumbnailUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200'
  },
  {
    id: '9',
    name: 'Áo khoác bomber',
    price: 390000,
    discountPrice: 320000,
    thumbnailUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400',
    sortDescription: 'Áo khoác bomber phong cách streetwear',
    urlSlug: 'ao-khoac-bomber',
    quantity: 55,
    sold: 523,
    averageRating: 4.8,
    totalReviews: 178,
    categoryId: 'cat-003',
    categoryName: 'Áo khoác',
    shopId: 'shop-def',
    shopName: 'Shop Thời Trang DEF',
    shopThumbnailUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200'
  },
  {
    id: '10',
    name: 'Áo cardigan dệt kim',
    price: 260000,
    discountPrice: 210000,
    thumbnailUrl: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=400',
    sortDescription: 'Áo cardigan dệt kim mềm mại, ấm áp',
    urlSlug: 'ao-cardigan-det-kim',
    quantity: 70,
    sold: 445,
    averageRating: 4.7,
    totalReviews: 164,
    categoryId: 'cat-008',
    categoryName: 'Áo cardigan',
    shopId: 'shop-abc',
    shopName: 'Shop Thời Trang ABC',
    shopThumbnailUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200'
  },
  {
    id: '11',
    name: 'Áo sơ mi kẻ sọc',
    price: 195000,
    discountPrice: 0,
    thumbnailUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400',
    sortDescription: 'Áo sơ mi kẻ sọc thời trang, trẻ trung',
    urlSlug: 'ao-so-mi-ke-soc',
    quantity: 110,
    sold: 234,
    averageRating: 4.4,
    totalReviews: 87,
    categoryId: 'cat-002',
    categoryName: 'Áo sơ mi',
    shopId: 'shop-xyz',
    shopName: 'Shop Thời Trang XYZ',
    shopThumbnailUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200'
  },
  {
    id: '12',
    name: 'Áo thun oversize',
    price: 175000,
    discountPrice: 145000,
    thumbnailUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400',
    sortDescription: 'Áo thun oversize phong cách Hàn Quốc',
    urlSlug: 'ao-thun-oversize',
    quantity: 95,
    sold: 612,
    averageRating: 4.6,
    totalReviews: 203,
    categoryId: 'cat-001',
    categoryName: 'Áo thun',
    shopId: 'shop-def',
    shopName: 'Shop Thời Trang DEF',
    shopThumbnailUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200'
  }
];

// Helper functions
export const getProductById = (id: string): UserProductDto | undefined => {
  return MOCK_TRYON_PRODUCTS.find(product => product.id === id);
};

export const getProductsByShop = (shopName: string): UserProductDto[] => {
  return MOCK_TRYON_PRODUCTS.filter(product => product.shopName === shopName);
};

export const getProductsWithDiscount = (): UserProductDto[] => {
  return MOCK_TRYON_PRODUCTS.filter(product => product.discountPrice && product.discountPrice > 0);
};

export const getTopRatedProducts = (limit: number = 5): UserProductDto[] => {
  return [...MOCK_TRYON_PRODUCTS]
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, limit);
};

export const getBestSellingProducts = (limit: number = 5): UserProductDto[] => {
  return [...MOCK_TRYON_PRODUCTS]
    .sort((a, b) => b.sold - a.sold)
    .slice(0, limit);
};
