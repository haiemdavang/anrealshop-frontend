import {
    Box,
    Container,
    Group,
    Paper,
    Tabs,
    Text,
    Title,
} from '@mantine/core';
import React, { useMemo, useState } from 'react';
import {
    FiHome,
    FiSettings,
} from 'react-icons/fi';
import { BreadcrumbItems } from '../Components/BreadcrumbItems';
import About from './About';
import TabControll from './TabControll';

interface SettingsProps { }

const Setting: React.FC<SettingsProps> = () => {
    const [activeTab, setActiveTab] = useState('shop');

    const breadcrumbItems = useMemo(() => {
        const tabNames: Record<string, string> = {
            shop: 'Cài đặt cửa hàng',
            notifications: 'Thông báo',
            security: 'Bảo mật',
            payment: 'Thanh toán',
            team: 'Đội ngũ',
            messaging: 'Nhắn tin',
            advanced: 'Nâng cao',
        };
        return [
            { title: 'Trang chủ', href: '/', icon: <FiHome size={14} /> },
            { title: 'Cài đặt', href: '/myshop/settings' },
            { title: tabNames[activeTab] || 'Không xác định' },
        ];
    }, [activeTab]);

    return (
        <Container fluid px="lg" py="md">
            {/* Page header */}
            <Paper shadow="xs" p="md" mb="md" radius="md" className="border-b border-gray-200">
                <Box mb="xs">
                    <BreadcrumbItems items={breadcrumbItems} />
                </Box>
                <Group justify="space-between" align="center">
                    <Group>
                        <FiSettings size={22} className="text-primary" />
                        <Title order={2} size="h3">Cài đặt cửa hàng</Title>
                    </Group>
                    <Text c="dimmed" size="sm">
                        Quản lý thông tin và các thiết lập của cửa hàng
                    </Text>
                </Group>
            </Paper>

            <Tabs
                value={activeTab}
                onChange={(value) => setActiveTab(value as string)}
                orientation="vertical"
                radius="md"
                variant="pills"
                styles={{
                    root: { display: 'flex', gap: 16, alignItems: 'flex-start' },
                    list: { flexShrink: 0 },
                    panel: { flex: 1 },
                }}
            >
                {/* Left sidebar */}
                <Paper
                    radius="md"
                    withBorder
                    p="xs"
                    style={{
                        minWidth: 220,
                        position: 'sticky',
                        top: 20,
                        height: 'calc(100vh - 220px)',
                        overflowY: 'auto'
                    }}
                >
                    <TabControll />
                </Paper>

                {/* Right content */}
                <Paper
                    radius="md"
                    withBorder
                    p="xl"
                    style={{
                        flex: 1,
                        minHeight: 'calc(100vh - 220px)'
                    }}
                >
                    {/* Shop tab */}
                    <Tabs.Panel value="shop">
                        <About />
                    </Tabs.Panel>

                    {/* Other tabs placeholder */}
                    {['notifications', 'security', 'payment', 'team', 'messaging', 'advanced'].map((tab) => (
                        <Tabs.Panel key={tab} value={tab}>
                            <Text size="sm" c="dimmed" className="italic">Tính năng đang được phát triển...</Text>
                        </Tabs.Panel>
                    ))}
                </Paper>
            </Tabs>
        </Container>
    );
};

export default Setting;