import { axiosInstance } from './AxiosInstant';

export const RestNoticeService = {
  // User notifications
  getUserNotifications: async (page: number, size: number) => {
    const response = await axiosInstance.get(`/notifications/user`, {
      params: { page, size }
    });
    return response.data; // Page<NotificationResponse>
  },
  
  getUnreadUserCount: async () => {
    const response = await axiosInstance.get<number>(`/notifications/user/unread-count`);
    return response.data;
  },
  
  markUserAsRead: async (id: string) => {
    const response = await axiosInstance.patch(`/notifications/user/${id}/read`);
    return response.data;
  },

  markAllUserAsRead: async () => {
    await axiosInstance.patch(`/notifications/user/read-all`);
  },

  // Shop notifications
  getShopNotifications: async (page: number, size: number) => {
    const response = await axiosInstance.get(`/notifications/shop`, {
      params: { page, size }
    });
    return response.data;
  },
  
  getUnreadShopCount: async () => {
    const response = await axiosInstance.get<number>(`/notifications/shop/unread-count`);
    return response.data;
  },
  
  markShopAsRead: async (id: string) => {
    const response = await axiosInstance.patch(`/notifications/shop/${id}/read`);
    return response.data;
  },

  markAllShopAsRead: async () => {
    await axiosInstance.patch(`/notifications/shop/read-all`);
  }
};
