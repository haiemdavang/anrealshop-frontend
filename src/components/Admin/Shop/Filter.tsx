import {
    ActionIcon,
    Badge,
    Button,
    Group,
    Stack,
    Tabs,
    Text,
    TextInput,
    Title,
    Tooltip,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import '@mantine/dates/styles.css';
import {
    FiCalendar,
    FiCheck,
    FiCheckCircle,
    FiClock,
    FiFilter,
    FiRefreshCcw,
    FiSearch,
    FiX,
} from 'react-icons/fi';
import { SHOP_STATUS_OPTIONS } from './data';
import type { AdminShop, ShopDateRange } from './types';

interface ShopFilterProps {
    date: ShopDateRange;
    searchTerm: string;
    activeTab: string;
    shops: AdminShop[];
    onDateChange: (date: ShopDateRange) => void;
    onSearchChange: (value: string) => void;
    onTabChange: (tab: string | null) => void;
    onApplyFilters: () => void;
    onResetFilters: () => void;
}

const STATUS_ICONS = {
    all: FiFilter,
    pending: FiClock,
    approved: FiCheckCircle,
    rejected: FiX,
};

const Filter = ({
    date,
    searchTerm,
    activeTab,
    shops,
    onDateChange,
    onSearchChange,
    onTabChange,
    onApplyFilters,
    onResetFilters,
}: ShopFilterProps) => {
    const getCount = (status: string) => (
        status === 'all'
            ? shops.length
            : shops.filter((shop) => shop.status === status).length
    );

    return (
        <>
            <Group justify="space-between" align="flex-start" mb="md" wrap="wrap">
                <Stack gap="xs">
                    <Title order={3} size="h4">Xác nhận cửa hàng</Title>
                    <Text size="sm" c="dimmed">
                        Xem xét và phê duyệt các cửa hàng mới được đăng ký.
                    </Text>
                </Stack>

                <Group align="center" wrap="wrap">
                    <DatePickerInput
                        type="range"
                        placeholder="Chọn khoảng thời gian"
                        value={date}
                        onChange={onDateChange}
                        clearable
                        valueFormat="DD/MM/YYYY"
                        locale="vi"
                        leftSection={<FiCalendar size={16} />}
                        className="w-full sm:w-[280px]"
                    />
                    <TextInput
                        placeholder="Tìm tên, ID hoặc chủ cửa hàng..."
                        value={searchTerm}
                        onChange={(event) => onSearchChange(event.currentTarget.value)}
                        leftSection={<FiSearch size={16} />}
                        className="w-full sm:w-[300px]"
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') onApplyFilters();
                        }}
                    />
                    <Tooltip label="Áp dụng bộ lọc">
                        <Button
                            variant="light"
                            onClick={onApplyFilters}
                            rightSection={<FiCheck size={16} />}
                            disabled={Boolean(date[0]) !== Boolean(date[1])}
                        >
                            Áp dụng
                        </Button>
                    </Tooltip>
                    <Tooltip label="Đặt lại bộ lọc">
                        <ActionIcon variant="light" color="gray" onClick={onResetFilters}>
                            <FiRefreshCcw size={16} />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </Group>

            <div className="pb-4">
                <Tabs
                    value={activeTab}
                    onChange={onTabChange}
                    classNames={{
                        list: 'border-b-0',
                        tab: 'px-4 py-2 font-medium data-[active]:bg-blue-50 data-[active]:text-blue-600 data-[active]:border-blue-200',
                        tabLabel: 'flex items-center',
                    }}
                >
                    <Tabs.List>
                        {SHOP_STATUS_OPTIONS.map((status) => {
                            const Icon = STATUS_ICONS[status.id];
                            return (
                                <Tabs.Tab
                                    key={status.id}
                                    value={status.id}
                                    leftSection={<Icon size={16} />}
                                    className={`!py-3 !px-4 transition-colors ${
                                        activeTab === status.id
                                            ? '!text-primary !border-primary border-b-2'
                                            : 'hover:bg-gray-100'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        {status.label}
                                        <Badge size="sm" variant="light" color={status.color}>
                                            {getCount(status.id)}
                                        </Badge>
                                    </div>
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
