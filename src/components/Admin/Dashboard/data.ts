import type { IconType } from 'react-icons';
import {
  FiCheckCircle,
  FiCreditCard,
  FiDollarSign,
  FiPackage,
  FiShoppingBag,
  FiUserPlus,
  FiUsers,
} from 'react-icons/fi';
import { APP_ROUTES } from '../../../constant';

export interface AdminDashboardStat {
  label: string;
  value: string;
  change: string;
  icon: IconType;
  color: string;
  background: string;
}

export interface AdminRevenueData {
  day: string;
  revenue: number;
  orders: number;
}

export interface AdminPendingTask {
  label: string;
  count: number;
  progress: number;
  color: string;
  icon: IconType;
  path: string;
}

export interface AdminRecentActivity {
  id: string;
  content: string;
  type: string;
  status: 'Hoàn tất' | 'Đang chờ';
  time: string;
  icon: IconType;
  color: string;
}

export const ADMIN_DASHBOARD_STATS: AdminDashboardStat[] = [
  {
    label: 'Tổng người dùng',
    value: '12.480',
    change: '+8,2% tháng này',
    icon: FiUsers,
    color: 'text-blue-600',
    background: 'bg-blue-50',
  },
  {
    label: 'Cửa hàng hoạt động',
    value: '386',
    change: '+14 cửa hàng mới',
    icon: FiShoppingBag,
    color: 'text-emerald-600',
    background: 'bg-emerald-50',
  },
  {
    label: 'Sản phẩm chờ duyệt',
    value: '42',
    change: 'Cần xử lý',
    icon: FiPackage,
    color: 'text-amber-600',
    background: 'bg-amber-50',
  },
  {
    label: 'Tổng doanh thu',
    value: '2,48 tỷ ₫',
    change: '+12,5% tháng này',
    icon: FiDollarSign,
    color: 'text-rose-600',
    background: 'bg-rose-50',
  },
];

export const ADMIN_REVENUE_DATA: AdminRevenueData[] = [
  { day: 'T2', revenue: 286, orders: 142 },
  { day: 'T3', revenue: 324, orders: 168 },
  { day: 'T4', revenue: 298, orders: 151 },
  { day: 'T5', revenue: 372, orders: 186 },
  { day: 'T6', revenue: 416, orders: 214 },
  { day: 'T7', revenue: 463, orders: 237 },
  { day: 'CN', revenue: 521, orders: 268 },
];

export const ADMIN_PENDING_TASKS: AdminPendingTask[] = [
  {
    label: 'Đăng ký cửa hàng',
    count: 18,
    progress: 72,
    color: 'blue',
    icon: FiShoppingBag,
    path: APP_ROUTES.ADMIN.SHOP_REGISTRATIONS,
  },
  {
    label: 'Sản phẩm chờ duyệt',
    count: 42,
    progress: 48,
    color: 'orange',
    icon: FiPackage,
    path: APP_ROUTES.ADMIN.PRODUCT_APPROVALS,
  },
  {
    label: 'Xác minh ví',
    count: 9,
    progress: 84,
    color: 'rose',
    icon: FiCreditCard,
    path: '/admin/wallets',
  },
];

export const ADMIN_RECENT_ACTIVITIES: AdminRecentActivity[] = [
  {
    id: 'ACT-2401',
    content: 'Nguyễn Minh Anh đăng ký tài khoản mới',
    type: 'Người dùng',
    status: 'Hoàn tất',
    time: '5 phút trước',
    icon: FiUserPlus,
    color: 'blue',
  },
  {
    id: 'ACT-2402',
    content: 'Cửa hàng Lee Fashion gửi yêu cầu xét duyệt',
    type: 'Cửa hàng',
    status: 'Đang chờ',
    time: '18 phút trước',
    icon: FiShoppingBag,
    color: 'orange',
  },
  {
    id: 'ACT-2403',
    content: 'Sản phẩm Áo khoác Linen đã được phê duyệt',
    type: 'Sản phẩm',
    status: 'Hoàn tất',
    time: '32 phút trước',
    icon: FiCheckCircle,
    color: 'green',
  },
  {
    id: 'ACT-2404',
    content: 'Yêu cầu xác minh ví mới từ Trần Hoàng Nam',
    type: 'Ví',
    status: 'Đang chờ',
    time: '1 giờ trước',
    icon: FiCreditCard,
    color: 'rose',
  },
];
