import { Tabs, Text } from '@mantine/core';
import React from 'react';
import {
    FiBell,
    FiCreditCard,
    FiMessageSquare,
    FiSettings,
    FiShield,
    FiShoppingBag,
    FiUsers,
} from 'react-icons/fi';

interface TabItem {
    value: string;
    icon: React.ReactNode;
    label: string;
}

const TABS: TabItem[] = [
    { value: 'shop', icon: <FiShoppingBag size={16} />, label: 'Cửa hàng' },
    { value: 'notifications', icon: <FiBell size={16} />, label: 'Thông báo' },
    { value: 'security', icon: <FiShield size={16} />, label: 'Bảo mật' },
    { value: 'payment', icon: <FiCreditCard size={16} />, label: 'Thanh toán' },
    { value: 'team', icon: <FiUsers size={16} />, label: 'Đội ngũ' },
    { value: 'messaging', icon: <FiMessageSquare size={16} />, label: 'Nhắn tin' },
    { value: 'advanced', icon: <FiSettings size={16} />, label: 'Nâng cao' },
];

const TabControll: React.FC = () => {
    return (
        <Tabs.List>
            {TABS.map((tab) => (
                <Tabs.Tab
                    key={tab.value}
                    value={tab.value}
                    className="w-full !justify-start"
                    leftSection={tab.icon}
                >
                    <Text size="sm" fw={500}>{tab.label}</Text>
                </Tabs.Tab>
            ))}
        </Tabs.List>
    );
};

export default TabControll;