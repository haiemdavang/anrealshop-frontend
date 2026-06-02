export type NoticeScope = 'USER' | 'SHOP' | 'ADMIN' | 'PUBLIC';
// export type NoticeTemplateType = "NEW_ORDER_FOR_SHOP"
export interface NoticeMessage {
  id: string;
  content: string;
  thumbnailUrl?: string;
  receiveBy: string;
  noticeScope: NoticeScope;
  redirectUrl?: string;
  createdAt: string; 
}

export interface NotificationResponse {
  id: string;
  content: string;
  thumbnailUrl?: string;
  redirectUrl?: string;
  read: boolean; // or isRead depending on backend mapping. Jackson typically maps boolean isRead to read or isRead depending on getters. In DTO it's isRead but getter generates isRead(), Jackson serializes as "read" typically. Wait, let's use "read" and "isRead" optional to be safe.
  isRead?: boolean;
  createdAt: string;
}
