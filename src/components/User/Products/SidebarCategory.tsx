import { ActionIcon, Text, Transition } from '@mantine/core';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface Category {
    id: string;
    name: string;
    count: number;
    icon?: string;
}

interface SidebarCategoryProps {
    selectedCategory: string;
    onCategoryChange: (categoryId: string) => void;
    collapsed: boolean;
    onToggleCollapse: () => void;
}

const SidebarCategory = ({
    selectedCategory,
    onCategoryChange,
    collapsed,
    onToggleCollapse
}: SidebarCategoryProps) => {
    const categories: Category[] = [
        { id: 'all', name: 'Tất cả', count: 1250 },
        { id: 'ao-thun', name: 'Áo Thun', count: 120 },
        { id: 'giay-the-thao', name: 'Giày Thể Thao', count: 85 },
        { id: 'quan-jeans', name: 'Quần Jeans', count: 64 },
        { id: 'ao-khoac', name: 'Áo Khoác', count: 42 },
        { id: 'vay-dam', name: 'Váy Đầm', count: 76 },
        { id: 'phu-kien', name: 'Phụ Kiện', count: 93 },
        { id: 'do-the-thao', name: 'Đồ Thể Thao', count: 58 },
    ];

    return (
        <div
            className={`bg-white rounded-lg shadow-sm transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* Toggle Button */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <Transition mounted={!collapsed} transition="fade" duration={200}>
                    {(styles) => (
                        <Text fw={600} style={styles}>
                            Danh mục
                        </Text>
                    )}
                </Transition>
                <ActionIcon
                    variant="subtle"
                    onClick={onToggleCollapse}
                    size="sm"
                >
                    {collapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
                </ActionIcon>
            </div>

            {/* Categories List - Scrollable */}
            <div className="p-2 overflow-y-auto max-h-[calc(100vh-200px)]">
                {categories.map((category, index) => (
                    <motion.button
                        key={category.id}
                        onClick={() => onCategoryChange(category.id)}
                        className={`w-full text-left p-3 rounded-lg transition-colors mb-1 ${selectedCategory === category.id
                            ? 'bg-primary text-white'
                            : 'hover:bg-gray-100 text-gray-700'
                            }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        title={collapsed ? category.name : undefined}
                    >
                        <div className="flex items-center justify-between">
                            <Transition mounted={!collapsed} transition="fade" duration={200}>
                                {(styles) => (
                                    <Text size="sm" fw={500} style={styles} className="truncate">
                                        {category.name}
                                    </Text>
                                )}
                            </Transition>
                            <Transition mounted={!collapsed} transition="fade" duration={200}>
                                {(styles) => (
                                    <Text
                                        size="xs"
                                        c={selectedCategory === category.id ? 'white' : 'dimmed'}
                                        style={styles}
                                        className="flex-shrink-0 ml-2"
                                    >
                                        {category.count}
                                    </Text>
                                )}
                            </Transition>
                            {collapsed && (
                                <div className={`w-2 h-2 rounded-full mx-auto ${selectedCategory === category.id ? 'bg-white' : 'bg-gray-400'}`} />
                            )}
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default SidebarCategory;
