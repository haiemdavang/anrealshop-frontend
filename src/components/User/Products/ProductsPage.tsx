import { Container, SimpleGrid, Text } from '@mantine/core';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FiPackage } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';
import { useGetProduct } from '../../../hooks/useProduct';
import type { UserProductDto } from '../../../types/ProductType';
import ProductCard from '../Common/ProductCard';
import BannerFlowCategory from './BannerFlowCategory';
import FilterBar from './FilterBar';
import SidebarCategory from './SidebarCategory';

export const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [products, setProducts] = useState<UserProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { getListRecommended } = useGetProduct();

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) setSelectedCategory(category);

    setLoading(true);
    getListRecommended()
      .then((data) => setProducts(data))
      .finally(() => setLoading(false));
  }, [searchParams]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // TODO: Fetch products by category
  };

  const handleApplyFilters = (filters: any) => {
    console.log('Applied filters:', filters);
    // TODO: Apply filters and fetch products
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Layout Container */}
      <div className="flex">
        {/* Left Sidebar - Fixed */}
        <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} flex-shrink-0 transition-all duration-300`}>
          <div className="sticky top-0 rounded-lg overflow-hidden">
            <SidebarCategory
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              collapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 min-w-0">
          {/* Banner Section */}
          <BannerFlowCategory category={selectedCategory} />

          {/* Content Container */}
          <Container size="xl" className="py-6">
            {/* Filter Bar */}
            <FilterBar
              totalProducts={products.length}
              onApplyFilters={handleApplyFilters}
            />

            {/* Products Grid */}
            <div>
              {loading ? (
                <div className="py-20 text-center">
                  <Text c="dimmed">Đang tải sản phẩm...</Text>
                </div>
              ) : products.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <SimpleGrid
                    cols={{ base: 1, sm: 2, md: 2, lg: sidebarCollapsed ? 4 : 3, xl: sidebarCollapsed ? 5 : 4 }}
                    spacing="lg"
                  >
                    {products.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </SimpleGrid>
                </motion.div>
              ) : (
                <div className="py-20 text-center bg-white rounded-lg shadow-sm">
                  <FiPackage size={50} className="mx-auto mb-4 text-gray-400" />
                  <Text size="lg" fw={500} c="dimmed">
                    Không tìm thấy sản phẩm
                  </Text>
                  <Text c="dimmed" size="sm" mt="xs">
                    Thử thay đổi bộ lọc hoặc danh mục khác
                  </Text>
                </div>
              )}
            </div>
          </Container>
        </main>
      </div>
    </div>
  );
};
