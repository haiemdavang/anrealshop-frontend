import {
  FiClock,
  FiCheckCircle,
  FiRefreshCw,
  FiAlertTriangle,
  FiDollarSign,
  FiUsers,
  FiEye,
  FiPackage,
  FiZap,
  FiTag,
  FiPercent,
  FiStar,
  FiTrendingUp,
  FiActivity,
  FiBox,
  FiGrid,
  FiBookOpen,
  FiBell,
} from 'react-icons/fi';

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

export const ORDER_STATS = [
  { label: 'Đơn chờ xử lý', value: 24, icon: FiClock, color: 'amber', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', ring: 'amber' },
  { label: 'Đã xử lý', value: 189, icon: FiCheckCircle, color: 'green', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600', ring: 'green' },
  { label: 'Đơn trả / Hoàn tiền', value: 7, icon: FiRefreshCw, color: 'rose', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-600', ring: 'rose' },
  { label: 'Sản phẩm bị khóa', value: 3, icon: FiAlertTriangle, color: 'gray', bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-500', ring: 'gray' },
];

export const SALES_STATS = [
  { label: 'Doanh số hôm nay', value: formatCurrency(8_450_000), sub: '+12% so với hôm qua', icon: FiDollarSign, trend: 'up' },
  { label: 'Lượt truy cập', value: '1,234', sub: '+8% so với hôm qua', icon: FiUsers, trend: 'up' },
  { label: 'Sản phẩm đã xem', value: '3,871', sub: '-3% so với hôm qua', icon: FiEye, trend: 'down' },
  { label: 'Đơn hàng tạo mới', value: '47', sub: '+21% so với hôm qua', icon: FiPackage, trend: 'up' },
];

// 7-day order data
export const CHART_DATA = [
  { day: 'T2', orders: 18, revenue: 3_200_000, revenueM: 3.2 },
  { day: 'T3', orders: 32, revenue: 5_800_000, revenueM: 5.8 },
  { day: 'T4', orders: 27, revenue: 4_900_000, revenueM: 4.9 },
  { day: 'T5', orders: 41, revenue: 7_300_000, revenueM: 7.3 },
  { day: 'T6', orders: 36, revenue: 6_450_000, revenueM: 6.45 },
  { day: 'T7', orders: 53, revenue: 9_100_000, revenueM: 9.1 },
  { day: 'CN', orders: 47, revenue: 8_450_000, revenueM: 8.45 },
];

export const CAMPAIGNS = [
  {
    id: 1,
    title: 'Flash Sale cuối tuần',
    desc: 'Giảm giá sốc tới 70% cho toàn bộ sản phẩm thời trang',
    status: 'Đang chạy',
    statusColor: 'green' as const,
    icon: FiZap,
    iconColor: 'text-amber-500',
    startDate: '12/04/2026',
    endDate: '15/04/2026',
    progress: 68,
    image: 'https://salt.tikicdn.com/cache/w750/ts/tikimsp/67/60/9e/4bc3f9710d4c99654ec76878fc1f094a.png.webp'
  },
  {
    id: 2,
    title: 'Chương trình giới thiệu bạn bè',
    desc: 'Nhận voucher 50.000đ khi giới thiệu bạn bè đăng ký mua hàng',
    status: 'Sắp diễn ra',
    statusColor: 'blue' as const,
    icon: FiUsers,
    iconColor: 'text-blue-500',
    startDate: '20/04/2026',
    endDate: '30/04/2026',
    progress: 0,
    image: 'https://salt.tikicdn.com/cache/w750/ts/tikimsp/74/86/c8/88e156f01333ce88553bb19bf5ab4c83.png.webp'
  },
  {
    id: 3,
    title: 'Combo mua 2 tặng 1',
    desc: 'Áp dụng cho nhóm phụ kiện và túi xách cao cấp',
    status: 'Đã kết thúc',
    statusColor: 'gray' as const,
    icon: FiTag,
    iconColor: 'text-slate-400',
    startDate: '01/04/2026',
    endDate: '10/04/2026',
    progress: 100,
    image: 'https://salt.tikicdn.com/cache/w750/ts/tikimsp/40/d8/c1/951ac2e96a6e47e215b0976e51d41c48.png.webp'
  },
];

export const BUSINESS_SUGGESTIONS = [
  { id: 1, icon: FiPercent, title: 'Thêm chương trình giảm giá', desc: 'Shop chưa có voucher còn hiệu lực, hãy tạo ngay để tăng doanh số.', priority: 'high' },
  { id: 2, icon: FiStar, title: 'Cải thiện ảnh sản phẩm', desc: 'Ảnh chất lượng cao giúp tỷ lệ chuyển đổi tăng đến 30%.', priority: 'medium' },
  { id: 3, icon: FiTrendingUp, title: 'Tối ưu mô tả sản phẩm', desc: 'Bổ sung từ khóa SEO giúp sản phẩm xuất hiện nhiều hơn trong tìm kiếm.', priority: 'medium' },
  { id: 4, icon: FiActivity, title: 'Trả lời đánh giá khách hàng', desc: '12 đánh giá chưa được phản hồi — điều này ảnh hưởng uy tín cửa hàng.', priority: 'high' },
  { id: 5, icon: FiBox, title: 'Cập nhật tồn kho', desc: '5 sản phẩm sắp hết hàng, bổ sung để tránh mất đơn.', priority: 'high' },
  { id: 6, icon: FiGrid, title: 'Phân loại sản phẩm rõ ràng hơn', desc: 'Cửa hàng với danh mục rõ ràng có tỷ lệ duyệt cao hơn 25%.', priority: 'low' },
  { id: 7, icon: FiUsers, title: 'Kích hoạt chăm sóc khách hàng', desc: 'Bật tự động nhắn tin sau mua để tăng trải nghiệm và tỷ lệ quay lại.', priority: 'medium' },
  { id: 8, icon: FiBookOpen, title: 'Đọc hướng dẫn bán hàng hiệu quả', desc: 'Truy cập Trung tâm học tập để nâng cao kỹ năng kinh doanh online.', priority: 'low' },
];

export const NEWS = [
  {
    id: 1,
    tag: 'Chính sách',
    tagColor: 'blue' as const,
    title: 'Hai Lee cập nhật chính sách phí vận chuyển mới từ tháng 5/2026',
    desc: 'Từ ngày 01/05/2026, phí vận chuyển sẽ được tính dựa trên khối lượng thực tế thay vì khối lượng quy đổi, giúp tối ưu chi phí cho người bán.',
    date: '14/04/2026',
    icon: FiBell,
  },
  {
    id: 2,
    tag: 'Sự kiện',
    tagColor: 'violet' as const,
    title: 'Chương trình "Shop Vip 2026" — Đăng ký ngay để nhận ưu đãi độc quyền',
    desc: 'Shop đủ điều kiện (doanh số trên 50 triệu/tháng) sẽ được hỗ trợ quảng cáo miễn phí và hiển thị ưu tiên trên trang chủ.',
    date: '10/04/2026',
    icon: FiStar,
  },
];
