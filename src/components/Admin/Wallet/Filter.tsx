import { ActionIcon, Button, Group, Stack, Tabs, Text, TextInput, Title, Tooltip } from '@mantine/core';
import { FiCheck, FiRefreshCcw, FiSearch } from 'react-icons/fi';
import { useWalletStatus } from '../../../hooks/useWalletStatus';

interface WalletStatusTab {
    id: string;
    count: number;
}

interface FilterProps {
    searchTerm: string;
    activeTab: string;
    walletStatusData: WalletStatusTab[];
    onSearchChange: (term: string) => void;
    onTabChange: (tab: string | null) => void;
    onResetFilters: () => void;
    onApplyFilters: () => void;
}

const Filter: React.FC<FilterProps> = ({
    searchTerm,
    activeTab,
    walletStatusData,
    onSearchChange,
    onTabChange,
    onResetFilters,
    onApplyFilters
}) => {
    const {
        getVerificationStatusIcon,
        getVerificationStatusColor,
        getVerificationStatusLabel,
        getWalletStatusLabel,
    } = useWalletStatus();

    const getTabLabel = (id: string): string => {
        if (['ALL', 'CHO_DUYET', 'DA_XAC_THUC', 'BI_TU_CHOI'].includes(id)) {
            return getVerificationStatusLabel(id);
        }
        return getWalletStatusLabel(id as any);
    };

    const getTabColor = (id: string): string => {
        return getVerificationStatusColor(id);
    };

    const getTabIcon = (id: string) => {
        return getVerificationStatusIcon(id);
    };

    return (
        <>
            <Group justify="space-between" align="flex-start" mb="md">
                <Stack gap="xs">
                    <Title order={3} size="h4">Quản lý ví & xác thực</Title>
                    <Text size="sm" c="dimmed">
                        Quản lý danh sách ví đã đăng ký và phê duyệt xác thực người dùng.
                    </Text>
                </Stack>

                <Stack gap="xs">
                    <Group>
                        <TextInput
                            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.currentTarget.value)}
                            leftSection={<FiSearch size={16} />}
                            style={{ minWidth: '300px' }}
                        />

                        <Tooltip label="Áp dụng bộ lọc">
                            <Button
                                variant="light"
                                color="blue"
                                onClick={onApplyFilters}
                                rightSection={<FiCheck size={16} />}
                            >
                                Áp dụng
                            </Button>
                        </Tooltip>

                        <Tooltip label="Reset bộ lọc">
                            <ActionIcon
                                variant="light"
                                color="gray"
                                onClick={onResetFilters}
                            >
                                <FiRefreshCcw size={16} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                </Stack>
            </Group>

            <div className="pb-4">
                <Tabs
                    value={activeTab}
                    onChange={onTabChange}
                    classNames={{
                        list: "border-b-0",
                        tab: "px-4 py-2 font-medium data-[active]:bg-blue-50 data-[active]:text-blue-600 data-[active]:border-blue-200",
                        tabLabel: "flex items-center"
                    }}
                >
                    <Tabs.List>
                        {walletStatusData.map((status) => {
                            const IconComponent = getTabIcon(status.id);
                            const iconColor = getTabColor(status.id);
                            const isActive = activeTab === status.id;
                            const label = getTabLabel(status.id);

                            return (
                                <Tabs.Tab
                                    key={status.id}
                                    value={status.id}
                                    leftSection={<IconComponent size={16} style={{ color: iconColor }} />}
                                    className={`!py-3 !px-4 cursor-pointer transition-colors duration-200 ${isActive
                                        ? 'bg-primary !text-primary border-b-2 !border-primary'
                                        : 'hover:bg-gray-100'
                                        }`}
                                >
                                    {label}
                                </Tabs.Tab>
                            );
                        })}
                    </Tabs.List>
                </Tabs>
            </div>
        </>
    );
};

export default Filter;
