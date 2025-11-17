import { ActionIcon, Text, Transition } from '@mantine/core';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useCategory } from '../../../hooks/useCategory';
import type { CategoryDisplayDto } from '../../../types/CategoryType';

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
    const { categoriesDisplay, getCategoriesDisplay, isLoading } = useCategory();

    useEffect(() => {
        getCategoriesDisplay('SIDEBAR', 'public');
    }, [getCategoriesDisplay]);

    const renderCategory = (category: CategoryDisplayDto, index: number, level: number = 0) => (
        <div key={category.id} className={level > 0 ? 'ml-4' : ''}>
            <motion.button
                onClick={() => onCategoryChange(category.categoryId)}
                className={`w-full text-left p-3 rounded-lg transition-colors mb-1 ${selectedCategory === category.categoryId
                        ? 'bg-primary text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                title={collapsed ? category.categoryName : undefined}
            >
                <div className="flex items-center gap-2">
                    {/* Category Image */}
                    {!collapsed && category.thumbnailUrl && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-md overflow-hidden bg-gray-100">
                            <img
                                src={category.thumbnailUrl}
                                alt={category.categoryName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        </div>
                    )}

                    {/* Category Info */}
                    <div className="flex-1 flex items-center justify-between min-w-0">
                        <Transition mounted={!collapsed} transition="fade" duration={200}>
                            {(styles) => (
                                <Text
                                    size="sm"
                                    fw={level === 0 ? 500 : 400}
                                    style={styles}
                                    className="truncate"
                                >
                                    {category.categoryName}
                                </Text>
                            )}
                        </Transition>

                        {collapsed && (
                            <div
                                className={`w-2 h-2 rounded-full mx-auto ${selectedCategory === category.categoryId ? 'bg-white' : 'bg-gray-400'
                                    }`}
                            />
                        )}
                    </div>
                </div>
            </motion.button>

            {/* Render children categories if exist */}
            {!collapsed && Array.isArray((category as any).children) && (category as any).children.length > 0 && (
                <div className="mt-1">
                    {(category as any).children.map((child: CategoryDisplayDto, childIndex: number) =>
                        renderCategory(child, index + childIndex + 1, level + 1)
                    )}
                </div>
            )}
        </div>
    );

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
                {isLoading ? (
                    <div className="text-center py-8">
                        <Text size="sm" c="dimmed">Đang tải...</Text>
                    </div>
                ) : categoriesDisplay.length > 0 ? (
                    <>
                        {/* "Tất cả" option */}
                        <motion.button
                            onClick={() => onCategoryChange('all')}
                            className={`w-full text-left p-3 rounded-lg transition-colors mb-1 ${selectedCategory === 'all'
                                    ? 'bg-primary text-white'
                                    : 'hover:bg-gray-100 text-gray-700'
                                }`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="flex items-center justify-between">
                                <Transition mounted={!collapsed} transition="fade" duration={200}>
                                    {(styles) => (
                                        <Text size="sm" fw={500} style={styles}>
                                            Tất cả
                                        </Text>
                                    )}
                                </Transition>
                                {collapsed && (
                                    <div
                                        className={`w-2 h-2 rounded-full mx-auto ${selectedCategory === 'all' ? 'bg-white' : 'bg-gray-400'
                                            }`}
                                    />
                                )}
                            </div>
                        </motion.button>

                        {/* Category list */}
                        {categoriesDisplay.map((category, index) =>
                            renderCategory(category, index + 1)
                        )}
                    </>
                ) : (
                    <div className="text-center py-8">
                        <Text size="sm" c="dimmed">Không có danh mục</Text>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SidebarCategory;
