export const mockReviews = [
  {
    id: 'r1',
    rating: 5,
    comment: 'Sản phẩm rất đẹp, chất liệu tốt. Mình rất hài lòng với đơn hàng này! Giao hàng nhanh, đóng gói cẩn thận.',
    createdAt: '2026-02-20T10:30:00Z',
    user: {
      id: 'u1',
      username: 'nguyenvana',
      fullName: 'Nguyễn Văn A',
      avatarUrl: '',
    },
    media: [
      { id: 'm1', mediaUrl: 'https://picsum.photos/seed/review1a/400/400', mediaType: 'IMAGE' as const },
      { id: 'm2', mediaUrl: 'https://picsum.photos/seed/review1b/400/400', mediaType: 'IMAGE' as const },
    ],
  },
  {
    id: 'r2',
    rating: 4,
    comment: 'Chất lượng ổn so với giá tiền. Màu sắc hơi khác so với hình một chút nhưng vẫn chấp nhận được.',
    createdAt: '2026-02-18T14:15:00Z',
    user: {
      id: 'u2',
      username: 'tranthib',
      fullName: 'Trần Thị B',
      avatarUrl: '',
    },
    media: [
      { id: 'm3', mediaUrl: 'https://picsum.photos/seed/review2a/400/400', mediaType: 'IMAGE' as const },
    ],
  },
  {
    id: 'r3',
    rating: 5,
    comment: 'Mua lần 2 rồi, vẫn rất ưng ý. Shop tư vấn nhiệt tình, sẽ ủng hộ tiếp!',
    createdAt: '2026-02-15T08:45:00Z',
    user: {
      id: 'u3',
      username: 'levanc',
      fullName: 'Lê Văn C',
      avatarUrl: '',
    },
    media: [],
  },
  {
    id: 'r4',
    rating: 3,
    comment: 'Sản phẩm tạm ổn, không quá nổi bật. Giao hàng hơi chậm.',
    createdAt: '2026-02-12T16:20:00Z',
    user: {
      id: 'u4',
      username: 'phamthid',
      fullName: 'Phạm Thị D',
      avatarUrl: '',
    },
    media: [],
  },
  {
    id: 'r5',
    rating: 5,
    comment: 'Sản phẩm đúng như mô tả, đẹp lắm ạ. Đóng gói kỹ càng, giao hàng nhanh chóng.',
    createdAt: '2026-02-10T11:00:00Z',
    user: {
      id: 'u5',
      username: 'hoangvane',
      fullName: 'Hoàng Văn E',
      avatarUrl: '',
    },
    media: [
      { id: 'm4', mediaUrl: 'https://picsum.photos/seed/review5a/400/400', mediaType: 'IMAGE' as const },
      { id: 'm5', mediaUrl: 'https://picsum.photos/seed/review5b/400/400', mediaType: 'IMAGE' as const },
      { id: 'm6', mediaUrl: 'https://picsum.photos/seed/review5c/400/400', mediaType: 'IMAGE' as const },
    ],
  },
  {
    id: 'r6',
    rating: 4,
    comment: 'Chất vải mềm mại, form đẹp. Sẽ quay lại mua thêm.',
    createdAt: '2026-02-08T09:30:00Z',
    user: {
      id: 'u6',
      username: 'ngothif',
      fullName: 'Ngô Thị F',
      avatarUrl: '',
    },
    media: [
      { id: 'm7', mediaUrl: 'https://picsum.photos/seed/review6a/400/400', mediaType: 'IMAGE' as const },
    ],
  },
  {
    id: 'r7',
    rating: 2,
    comment: 'Hơi thất vọng về chất lượng, không đúng như kỳ vọng. Đường may chưa được gọn gàng lắm.',
    createdAt: '2026-02-05T13:45:00Z',
    user: {
      id: 'u7',
      username: 'dangvang',
      fullName: 'Đặng Văn G',
      avatarUrl: '',
    },
    media: [],
  },
  {
    id: 'r8',
    rating: 5,
    comment: 'Tuyệt vời! Mặc rất thoải mái, phối đồ dễ dàng. 10 điểm không có nhưng!',
    createdAt: '2026-02-03T17:10:00Z',
    user: {
      id: 'u8',
      username: 'vuuthih',
      fullName: 'Vũ Thị H',
      avatarUrl: '',
    },
    media: [
      { id: 'm8', mediaUrl: 'https://picsum.photos/seed/review8a/400/400', mediaType: 'IMAGE' as const },
    ],
  },
  {
    id: 'r9',
    rating: 4,
    comment: 'Sản phẩm khá tốt trong tầm giá. Giao hàng nhanh, đóng gói đẹp.',
    createdAt: '2026-01-28T10:00:00Z',
    user: {
      id: 'u9',
      username: 'buivani',
      fullName: 'Bùi Văn I',
      avatarUrl: '',
    },
    media: [],
  },
  {
    id: 'r10',
    rating: 1,
    comment: 'Nhận hàng bị lỗi, đã liên hệ shop để đổi trả. Hy vọng lần sau sẽ tốt hơn.',
    createdAt: '2026-01-25T15:30:00Z',
    user: {
      id: 'u10',
      username: 'dothik',
      fullName: 'Đỗ Thị K',
      avatarUrl: '',
    },
    media: [
      { id: 'm9', mediaUrl: 'https://picsum.photos/seed/review10a/400/400', mediaType: 'IMAGE' as const },
    ],
  },
];

export const mockRatingDistribution = {
  5: 45,
  4: 25,
  3: 12,
  2: 8,
  1: 5,
};

export const mockAverageRating = 4.2;
export const mockTotalReviews = mockReviews.length;
