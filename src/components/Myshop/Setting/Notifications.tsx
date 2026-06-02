import { Box, Button, Card, Group, Loader, Stack, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { RestNoticeService } from '../../../service/RestNoticeService';
import { type NotificationResponse } from '../../../types/NoticeType';
import PaginationCustom from '../../common/PaginationCustom';import { formatRelativeDate } from '../../../untils/Untils';
const Notifications = () => {
    const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const ITEMS_PER_PAGE = 6;

    const fetchNotifications = async (currentPage: number) => {
        try {
            setLoading(true);
            const data: any = await RestNoticeService.getShopNotifications(currentPage - 1, ITEMS_PER_PAGE);
            setNotifications(data.content || []);
            setTotalPages(data.totalPages || 1);
            setTotalElements(data.totalElements || data.content?.length || 0);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications(page);
    }, [page]);

    const markAsRead = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await RestNoticeService.markShopAsRead(id);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, isRead: true, read: true } : n)
            );
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    return (
        <Box>
            {loading ? (
                <Group justify="center" p="xs"><Loader /></Group>
            ) : notifications.length === 0 ? (
                <Text c="dimmed" ta="center" py="xl">Chưa có thông báo nào.</Text>
            ) : (
                <Stack gap="xs">
                    {notifications.map(notice => {
                        const isRead = notice.isRead || notice.read;
                        return (
                            <Card 
                                key={notice.id} 
                                shadow="sm" 
                                radius="md" 
                                withBorder 
                                className={`transition-colors ${isRead ? ' bg-gray' : 'bg-blue-50/30'}`}
                            >
                                <Group align="flex-start" wrap="nowrap">
                                    {notice.thumbnailUrl ? (
                                        <img src={notice.thumbnailUrl} alt="notice" className="w-12 h-12 object-cover rounded" />
                                    ) : (
                                        <>  </>
                                    )}
                                    <div style={{ flex: 1 }}>
                                        <Text fw={isRead ? 400 : 500} size="md">
                                            {notice.content}
                                        </Text>
                                        <Group gap="xs" mt="xs">
                                            <Text size="sm" c="dimmed">
                                                {formatRelativeDate(notice.createdAt)}
                                            </Text>
                                            {notice.redirectUrl && (
                                                <>
                                                    <Text size="sm" c="dimmed">•</Text>
                                                    <Text 
                                                        size="sm" 
                                                        className="text-primary hover:underline" 
                                                        component="a" 
                                                        href={notice.redirectUrl} 
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        Truy cập
                                                    </Text>
                                                </>
                                            )}
                                        </Group>
                                    </div>
                                    {!isRead && (
                                        <Button size="xs" variant="subtle" onClick={(e) => markAsRead(notice.id, e)}>
                                            Đánh dấu đã đọc
                                        </Button>
                                    )}
                                </Group>
                            </Card>
                        )
                    })}
                </Stack>
            )}

            {totalPages > 1 && (
                <PaginationCustom
                    currentPage={page}
                    onPageChange={setPage}
                    totalPages={totalPages}
                    totalItems={totalElements}
                    itemsPerPage={ITEMS_PER_PAGE}
                />
            )}
        </Box>
    );
};

export default Notifications;
