import type { ProductStatusDto } from '../types/ProductType';

export const productStatusDefaultData: ProductStatusDto[] = [
  {
    id: 'ALL',
    name: 'Tất cả',
    count: 0
  },
  {
    id: 'ACTIVE',
    name: 'Đang hoạt động',
    count: 0
  },
  {
    id: 'VIOLATION',
    name: 'Vi phạm',
    count: 0
  },
  {
    id: 'PENDING',
    name: 'Chờ duyệt',
    count: 0
  },
  {
    id: 'HIDDEN',
    name: 'Đang ẩn',
    count: 0
  }
];
export const productStatusDefaultDataAdmin: ProductStatusDto[] = [ 
  {
    id: 'ALL',
    name: 'Tất cả',
    count: 0
  },
  {
    id: 'ACTIVE',
    name: 'Đang hoạt động',
    count: 0
  },
  {
    id: 'VIOLATION',
    name: 'Vi phạm',
    count: 0
  },
  {
    id: 'PENDING',
    name: 'Chờ duyệt',
    count: 0
  } 
];

