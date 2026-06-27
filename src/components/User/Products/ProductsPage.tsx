import { Container, Drawer, SimpleGrid, Text } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FiPackage } from "react-icons/fi";
import {
  useGetProduct,
  type UseProductParams,
} from "../../../hooks/useProduct";
import { useURLParams } from "../../../hooks/useURLParams";
import type { UserProductDto } from "../../../types/ProductType";
import ProductCard from "../Common/ProductCard";
import BannerFlowCategory from "./BannerFlowCategory";
import FilterBar from "./FilterBar";
import SidebarCategory from "./SidebarCategory";

const LIMIT = 20;

const ProductsPage = () => {
  const { getParam, updateParams } = useURLParams();
  const [products, setProducts] = useState<UserProductDto[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const requestIdRef = useRef(0);

  // Responsive breakpoints
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { getListRecommended, isLoading } = useGetProduct();

  // Get all params from URL
  const selectedCategory = getParam("ct", "all");
  const searchQuery = getParam("q");
  const minPrice = getParam("mip");
  const maxPrice = getParam("map");
  const brands = getParam("br");
  const colors = getParam("cl");
  const sizes = getParam("sz");
  const origins = getParam("or");
  const rating = getParam("rt");

  // Computed key to detect filter changes
  const filterKey = [selectedCategory, searchQuery, minPrice, maxPrice, brands, colors, sizes, origins, rating].join("|");

  // Parse initial filter values from URL
  const initialFilters = {
    priceRange: [
      minPrice ? Number(minPrice) : 0,
      maxPrice ? Number(maxPrice) : 10000000,
    ] as [number, number],
    brands: brands ? brands.split(",") : [],
    colors: colors ? colors.split(",") : [],
    sizes: sizes ? sizes.split(",") : [],
    origins: origins ? origins.split(",") : [],
    rating: rating || "",
  };

  // Reset khi filter thay đổi
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setPage(0);
    setProducts([]);
    setHasMore(true);
  }, [filterKey]);

  // Fetch products (reset hoặc append tuỳ page)
  useEffect(() => {
    const reqId = ++requestIdRef.current;
    const append = page > 0;

    const params: UseProductParams = {
      page,
      limit: LIMIT,
      search: searchQuery || undefined,
      categoryId: selectedCategory === "all" ? undefined : selectedCategory,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      brands: brands ? brands.split(",") : undefined,
      colors: colors ? colors.split(",") : undefined,
      sizes: sizes ? sizes.split(",") : undefined,
      origins: origins ? origins.split(",") : undefined,
      rating: rating ? Number(rating) : undefined,
    };

    (async () => {
      try {
        const data = await getListRecommended(params);
        if (reqId !== requestIdRef.current) return;
        if (append) {
          setProducts((prev) => [...prev, ...data]);
        } else {
          setProducts(data);
        }
        setHasMore(data.length >= LIMIT);
      } catch {
        if (reqId !== requestIdRef.current) return;
        setHasMore(false);
        if (!append) setProducts([]);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey, page]);

  // IntersectionObserver – load thêm khi gần cuối danh sách
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isLoading]);

  const handleCategoryChange = (categorySlug: string) => {
    updateParams({
      ct: categorySlug,
      page: null,
    });
  };

  const handleApplyFilters = (filters: {
    priceRange: [number, number];
    brands: string[];
    colors: string[];
    sizes: string[];
    origins: string[];
    rating: string;
  }) => {
    updateParams({
      mip: filters.priceRange[0] || null,
      map: filters.priceRange[1] || null,
      br: filters.brands.length > 0 ? filters.brands.join(",") : null,
      cl: filters.colors.length > 0 ? filters.colors.join(",") : null,
      sz: filters.sizes.length > 0 ? filters.sizes.join(",") : null,
      or: filters.origins.length > 0 ? filters.origins.join(",") : null,
      rt: filters.rating || null,
      page: null,
    });
  };

  return (
    <Container className="min-h-screen bg-gray-50" size={"xl"} py="md">
      {/* Main Layout Container */}
      <div className="flex">
        {/* Desktop Sidebar - Hidden on mobile */}
        {!isMobile && (
          <aside
            className={`${
              sidebarCollapsed ? "w-20" : "w-64"
            } flex-shrink-0 transition-all duration-300 mb-6`}
          >
            <div className="sticky top-0 rounded-lg overflow-hidden">
              <SidebarCategory
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
              />
            </div>
          </aside>
        )}

        {/* Right Content Area */}
        <main className="flex-1 min-w-0">
          {/* Banner Section */}
          <BannerFlowCategory />

          {/* Content Container */}
          <Container size={"lg"} className={`py-6 ${isMobile ? "px-2" : ""}`}>
            {/* Filter Bar with initial values */}
            <FilterBar
              totalProducts={products.length}
              onApplyFilters={handleApplyFilters}
              initialValues={initialFilters}
              isMobile={isMobile}
              onOpenDrawer={openDrawer}
            />

            {/* Products Grid */}
            <div>
              {isLoading && products.length === 0 ? (
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
                    cols={{
                      base: 2,
                      xs: 2,
                      sm: 2,
                      md: 3,
                      lg: sidebarCollapsed ? 4 : 3,
                      xl: sidebarCollapsed ? 5 : 4,
                    }}
                    spacing={{ base: "xs", sm: "sm", md: "md", lg: "lg" }}
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

                  {/* Sentinel cho IntersectionObserver */}
                  <div ref={sentinelRef} className="h-4" />

                  {/* Đang tải thêm */}
                  {isLoading && (
                    <div className="py-6 text-center">
                      <Text c="dimmed" size="sm">Đang tải thêm...</Text>
                    </div>
                  )}

                  {/* Hết danh sách */}
                  {!hasMore && (
                    <div className="py-8 text-center">
                      <Text c="dimmed" size="sm">— Không còn gì để xem —</Text>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="py-20 min-h-[80vh] text-center bg-white rounded-lg shadow-sm">
                  <FiPackage
                    size={isMobile ? 40 : 50}
                    className="mx-auto mb-4 text-gray-400"
                  />
                  <Text size={isMobile ? "md" : "lg"} fw={500} c="dimmed">
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

      {/* Mobile Drawer for Sidebar + Filters */}
      {isMobile && (
        <Drawer
          opened={drawerOpened}
          onClose={closeDrawer}
          position="left"
          size="75%"
        >
          <SidebarCategory
            selectedCategory={selectedCategory}
            onCategoryChange={(category) => {
              handleCategoryChange(category);
              closeDrawer();
            }}
            collapsed={false}
            onToggleCollapse={() => {}}
          />
        </Drawer>
      )}
    </Container>
  );
};

export default ProductsPage;
