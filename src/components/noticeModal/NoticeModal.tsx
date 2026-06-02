import { ActionIcon, Divider, Group, Indicator, Menu, Text, UnstyledButton } from '@mantine/core';
import { useEffect, useState } from 'react';
import { FiBell } from 'react-icons/fi';
import { RestNoticeService } from '../../service/RestNoticeService';
import { type NotificationResponse } from '../../types/NoticeType';
import { formatRelativeDate } from '../../untils/Untils';

interface NoticeModalProps {
  isShop?: boolean;
}

export function NoticeModal({ isShop = true }: NoticeModalProps) {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotices = async () => {
    try {
      if (isShop) {
        const count = await RestNoticeService.getUnreadShopCount();
        setUnreadCount(count);
        // Using any for page type or you might have a generic page response
        const data: any = await RestNoticeService.getShopNotifications(0, 10);
        setNotifications(data.content || []);
      } else {
        const count = await RestNoticeService.getUnreadUserCount();
        setUnreadCount(count);
        const data: any = await RestNoticeService.getUserNotifications(0, 10);
        setNotifications(data.content || []);
      }
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  useEffect(() => {
    fetchNotices();
    // Optionally set up an interval or WebSocket here
  }, [isShop]);

  const markAllAsRead = async () => {
    try {
      if (isShop) {
        await RestNoticeService.markAllShopAsRead();
      } else {
        await RestNoticeService.markAllUserAsRead();
      }
      fetchNotices();
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const markAsRead = async (id: string, isRead: boolean) => {
    if (isRead) return;
    try {
      if (isShop) {
        await RestNoticeService.markShopAsRead(id);
      } else {
        await RestNoticeService.markUserAsRead(id);
      }
      fetchNotices();
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  return (
    <Menu shadow="md" width={320} position="bottom-end">
      <Menu.Target>
        <ActionIcon
          variant="subtle"
          size="lg"
          radius="xl"
          aria-label="Thông báo"
        >
          <Indicator size={8} offset={4} color="red" withBorder disabled={unreadCount === 0}>
            <FiBell size={20} className="text-gray-700" />
          </Indicator>
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <div className="p-2">
          <Group justify="space-between" className="mb-2">
            <Text fw={500}>Thông báo</Text>
            {unreadCount > 0 && (
              <Text size="xs" c="dimmed" className="cursor-pointer hover:underline" onClick={markAllAsRead}>
                Đánh dấu tất cả đã đọc
              </Text>
            )}
          </Group>

          <Divider className="mb-2" />

          <div className="space-y-1 max-h-[300px] overflow-auto">
            {notifications.length === 0 ? (
              <Text size="sm" c="dimmed" className="text-center py-4">
                Không có thông báo mới
              </Text>
            ) : (
              notifications.map((notice) => (
                <div 
                  key={notice.id} 
                  className={`p-2 rounded hover:bg-gray-50 cursor-pointer ${notice.isRead || notice.read ? 'opacity-60' : 'bg-blue-50/50'}`}
                  onClick={() => markAsRead(notice.id, notice.isRead || (notice as any).read)}
                >
                  <Group align="flex-start" wrap="nowrap">
                    {notice.thumbnailUrl && (
                      <img src={notice.thumbnailUrl} alt="thumbnail" className="w-10 h-10 object-cover rounded" />
                    )}
                    <div>
                      <Text size="sm" fw={notice.isRead || notice.read ? 400 : 500}>
                        {notice.content}
                      </Text>
                      <Group gap="xs" className="mt-1" justify="space-between">
                        <Text size="xs" c="dimmed">
                          {formatRelativeDate(notice.createdAt)}
                        </Text>
                        {notice.redirectUrl && (
                            <Text
                                size="sm"
                                className="text-primary hover:underline"
                                component="a"
                                href={notice.redirectUrl}
                                onClick={(e) => e.stopPropagation()}
                            >
                                Chi tiết...
                            </Text>
                        )}
                      </Group>
                    </div>
                  </Group>
                </div>
              ))
            )}
          </div>

          <Divider className="my-2" />

          <UnstyledButton className="w-full text-center text-sm text-primary py-1 text-decoration-underline" onClick={() => window.location.href = isShop ? '/myshop/settings/notifications' : '/settings/notifications'}  >
            Xem tất cả thông báo
          </UnstyledButton>
        </div>
      </Menu.Dropdown>
    </Menu>
  );
}
