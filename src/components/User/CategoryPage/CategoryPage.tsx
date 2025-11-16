import {
  Anchor,
  Box,
  Breadcrumbs,
  Container,
  Grid,
  LoadingOverlay,
  Stack,
  Text,
  Title
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { getCategoryData, getCategoryProducts } from '../../../data/CategoryPageData';
import type { Product } from '../../../data/FilterData';
import Filter from '../Products/Filter';
import ModalFilter from '../Products/ModalFilter';
import CategoryMain from './CategoryMain';
import CategorySidebar from './CategorySidebar';
import ProductList from './ProductList';

// Định nghĩa kiểu dữ liệu
interface SubCategory {
  id: string;
  name: string;
  imageUrl?: string;
  productCount: number;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  hasChildren: boolean;
  slug: string;
  description?: string;
  subCategories: SubCategory[];
  parentId?: string;
  parentName?: string;
}

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();

  // States
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [productLoading, setProductLoading] = useState(false);

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [allFiltersOpened, setAllFiltersOpened] = useState(false);

  // pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalProducts, setTotalProducts] = useState(0);

  // Load category data
  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    getCategoryData(slug)
      .then(data => {
        setCategory(data);
        loadProducts(data ? data.id : '');
      })
      .catch(error => {
        console.error("Error loading category data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  // Load products
  const loadProducts = async (categoryId: string) => {
    setProductLoading(true);
    try {
      const response = await getCategoryProducts(categoryId, {
        priceRange,
        brands: selectedBrands,
        origins: selectedOrigins,
        sizes: selectedSizes,
        colors: selectedColors,
        rating: selectedRating,
        sort: sortBy,
        page: currentPage,
        limit: itemsPerPage
      });

      // Giả sử getCategoryProducts trả về { data: Product[], total: number }
      // setProducts(response.data);
      // setTotalProducts(response.total);
      setProducts(response);
      setTotalProducts(10);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setProductLoading(false);
    }
  };

  // Thêm handlers cho phân trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (category) {
      loadProducts(category.id);
    }
  };

  const handleItemsPerPageChange = (value: string | null) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset về trang đầu tiên khi thay đổi số item/trang
    if (category) {
      loadProducts(category.id);
    }
  };

  // Cập nhật useEffect để reset trang khi thay đổi danh mục
  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    setCurrentPage(1); // Reset về trang đầu tiên khi thay đổi danh mục

    getCategoryData(slug)
      .then(data => {
        setCategory(data);
        loadProducts(data ? data.id : '');
      })
      .catch(error => {
        console.error("Error loading category data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  // Filter handlers
  const handleOpenAllFilters = () => {
    setAllFiltersOpened(true);
  };

  const handleResetFilters = () => {
    setSelectedBrands([]);
    setSelectedOrigins([]);
    setSelectedSizes([]);

    if (category) {
      loadProducts(category.id);
    }
  };

  const handleAddFilter = (type: string, value: string) => {
    switch (type) {
      case 'brand':
        if (!selectedBrands.includes(value)) {
          const newBrands = [...selectedBrands, value];
          setSelectedBrands(newBrands);
          if (category) loadProducts(category.id);
        }
        break;
      case 'origin':
        if (!selectedOrigins.includes(value)) {
          const newOrigins = [...selectedOrigins, value];
          setSelectedOrigins(newOrigins);
          if (category) loadProducts(category.id);
        }
        break;
      case 'size':
        if (!selectedSizes.includes(value)) {
          const newSizes = [...selectedSizes, value];
          setSelectedSizes(newSizes);
          if (category) loadProducts(category.id);
        }
        break;
    }
  };

  const handleRemoveFilter = (type: string, value: string) => {
    switch (type) {
      case 'brand':
        setSelectedBrands(selectedBrands.filter(item => item !== value));
        break;
      case 'origin':
        setSelectedOrigins(selectedOrigins.filter(item => item !== value));
        break;
      case 'size':
        setSelectedSizes(selectedSizes.filter(item => item !== value));
        break;
    }

    if (category) {
      loadProducts(category.id);
    }
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    if (category) {
      loadProducts(category.id);
    }
  };

  const handleApplyFilters = () => {
    if (category) {
      loadProducts(category.id);
    }
  };

  // Breadcrumb items
  const breadcrumbItems = [
    { title: 'Trang chủ', href: '/' },
  ];

  if (category?.parentName) {
    breadcrumbItems.push({
      title: category.parentName,
      href: `/category/${category.parentId}`
    });
  }

  if (category) {
    breadcrumbItems.push({
      title: category.name,
      href: `/category/${slug}`
    });
  }

  return (
    <Container size="xl" py="md">
      <LoadingOverlay visible={loading} />

      {/* Breadcrumbs */}
      <Breadcrumbs mb="md">
        {breadcrumbItems.map((item, index) => (
          <Anchor component={Link} to={item.href} key={index}>
            {item.title}
          </Anchor>
        ))}
      </Breadcrumbs>

      {/* Category title and description */}
      {category && (
        <Box mb="lg">
          <Title order={1} mb="xs">{category.name}</Title>
          {category.description && (
            <Text color="dimmed">{category.description}</Text>
          )}
        </Box>
      )}

      <Grid>
        {/* Sidebar with categories list */}
        {category?.hasChildren && (
          <Grid.Col span={{ base: 12, sm: 2.5 }}>
            <CategorySidebar category={category} />
          </Grid.Col>
        )}

        {/* Main content area */}
        <Grid.Col span={{ base: 12, sm: category?.hasChildren ? 9.5 : 12 }}>
          <Stack gap="lg">
            {/* Component hiển thị danh mục con */}
            <CategoryMain category={category} />

            {/* Component Filter */}
            <Filter
              selectedBrands={selectedBrands}
              selectedOrigins={selectedOrigins}
              selectedSizes={selectedSizes}
              sortBy={sortBy}
              onOpenAllFilters={handleOpenAllFilters}
              onResetFilters={handleResetFilters}
              onRemoveFilter={handleRemoveFilter}
              onAddFilter={handleAddFilter}
              onSortChange={handleSortChange}
            />

            {/* Component hiển thị danh sách sản phẩm */}
            <ProductList
              products={products}
              loading={productLoading}
              totalProducts={totalProducts}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </Stack>
        </Grid.Col>
      </Grid>

      {/* Modal Filter */}
      <ModalFilter
        opened={allFiltersOpened}
        onClose={() => setAllFiltersOpened(false)}
        initialPriceRange={priceRange}
        initialSelectedBrands={selectedBrands}
        initialSelectedColors={selectedColors}
        initialSelectedSizes={selectedSizes}
        initialSelectedOrigins={selectedOrigins}
        initialSelectedRating={selectedRating}
        setPriceRange={setPriceRange}
        setSelectedBrands={setSelectedBrands}
        setSelectedColors={setSelectedColors}
        setSelectedSizes={setSelectedSizes}
        setSelectedOrigins={setSelectedOrigins}
        setSelectedRating={setSelectedRating}
        onApplyFilters={() => {
          setAllFiltersOpened(false);
          handleApplyFilters();
        }}
      />
    </Container>
  );
};

export default CategoryPage;