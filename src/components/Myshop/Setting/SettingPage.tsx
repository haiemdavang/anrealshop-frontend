import {
    Box,
    Container,
    Group,
    Paper,
    Text,
    Title,
    Grid,
    NavLink,
} from '@mantine/core';
import React, { useMemo } from 'react';
import {
    FiHome,
    FiSettings,
    FiShoppingBag,
    FiBell,
    FiShield,
    FiCreditCard,
    FiUsers,
    FiMessageSquare,
} from 'react-icons/fi';
import {
    Navigate,
    Route,
    Routes,
    useLocation,
    useNavigate,
} from "react-router-dom";
import { BreadcrumbItems } from '../Components/BreadcrumbItems';
import About from './About';
import Notifications from './Notifications';

interface SettingsProps { }

const Setting: React.FC<SettingsProps> = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { path: "/shop", icon: <FiShoppingBag size={16} />, label: "Cửa hàng" },
        { path: "/notifications", icon: <FiBell size={16} />, label: "Thông báo" },
        { path: "/security", icon: <FiShield size={16} />, label: "Bảo mật" },
        { path: "/payment", icon: <FiCreditCard size={16} />, label: "Thanh toán" },
        { path: "/team", icon: <FiUsers size={16} />, label: "Đội ngũ" },
        { path: "/messaging", icon: <FiMessageSquare size={16} />, label: "Nhắn tin" },
        { path: "/advanced", icon: <FiSettings size={16} />, label: "Nâng cao" },
    ];

    const currentTab = location.pathname.split("/").pop() || "shop";

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
            { title: tabNames[currentTab] || 'Không xác định' },
        ];
    }, [currentTab]);

    const isActive = (path: string) => {
        return location.pathname.includes(`/myshop/settings${path}`);
    };

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

            <Grid gutter={{ base: "sm", md: "md" }} mb="md">
                <Grid.Col span={{ base: 12, md: 2 }}>
                    <Paper
                        radius="md"
                        withBorder
                        p="xs"
                        style={{
                            position: "sticky",
                            top: 20,
                            height: "100%",
                        }}
                    >
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                label={item.label}
                                leftSection={item.icon}
                                active={isActive(item.path)}
                                onClick={() => navigate(`/myshop/settings${item.path}`)}
                                className="font-medium rounded-md mb-1"
                            />
                        ))}
                    </Paper>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 10 }}>
                    <Paper
                        radius="md"
                        withBorder
                        p="md"
                        style={{
                            minHeight: "calc(100vh - 220px)",
                        }}
                    >
                        <Routes>
                            <Route path="/" element={<Navigate to="shop" replace />} />
                            <Route path="shop" element={<About />} />
                            <Route path="notifications" element={<Notifications />} />
                            {['security', 'payment', 'team', 'messaging', 'advanced'].map((tab) => (
                                <Route
                                    key={tab}
                                    path={tab}
                                    element={<Text size="sm" c="dimmed" className="italic">Tính năng đang được phát triển...</Text>}
                                />
                            ))}
                        </Routes>
                    </Paper>
                </Grid.Col>
            </Grid>
        </Container>
    );
};

export default Setting;