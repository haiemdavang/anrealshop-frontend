import React, { useState, useEffect } from 'react';
import { Paper, Group, Text, Divider, Skeleton, Box } from '@mantine/core';
import { Link } from 'react-router-dom';
import { SearchService } from '../../service/SearchService';
import type { ProductSuggestDto, CategorySuggestDto } from '../../types/SearchType';

interface SuggestSearchProps {
  searchTerm: string;
  visible: boolean;
  onSelect: () => void;
  withBlur?: boolean;
  className?: string;
  productLimit?: number;
  categoryLimit?: number;
}

const SuggestSearch: React.FC<SuggestSearchProps> = ({
  searchTerm,
  visible,
  onSelect,
  withBlur = true,
  className = '',
  productLimit = 5,
  categoryLimit = 3
}) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    products: ProductSuggestDto[];
    categories: CategorySuggestDto[];
  }>({
    products: [],
    categories: []
  });

  useEffect(() => {
    if (!visible || !searchTerm.trim()) {
      setResults({ products: [], categories: [] });
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = await SearchService.suggestSearch(searchTerm, productLimit, categoryLimit);
        setResults(data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, visible, productLimit, categoryLimit]);

  if (!visible) return null;

  // Define blur class based on withBlur prop
  const blurClass = !withBlur ? '!backdrop-blur-md !bg-white/80' : '!bg-white';
  console.log('blurClass', withBlur);

  // Loading state
  if (loading) {
    return (
      <Paper
        shadow="md"
        radius="md"
        className={`absolute mt-1 w-full z-50 px-3 py-3 ${blurClass} ${className}`}
      >
        <Box mb="md">
          <Skeleton height={16} mb={8} />
          <Skeleton height={16} mb={8} width="80%" />
          <Skeleton height={16} width="60%" />
        </Box>

        <Divider my="sm" />

        {Array(3).fill(0).map((_, index) => (
          <Group key={index} mb="md">
            <Skeleton height={50} width={50} radius="md" />
            <Box style={{ flex: 1 }}>
              <Skeleton height={16} mb={6} />
              <Skeleton height={12} width="50%" />
            </Box>
            <Skeleton height={16} width={60} />
          </Group>
        ))}
      </Paper>
    );
  }

  // When there are no results
  const noResults = !results.products.length && !results.categories.length && !searchTerm.trim();

  // Display empty state when no keyword
  if (noResults) {
    return null;
  }

  // Display search results
  return (
    <Paper
      shadow="md"
      radius="md"
      className={`absolute mt-1 w-full z-50 px-3 py-3 ${blurClass} ${className}`}
    >
      {/* Categories */}
      {results.categories.length > 0 && (
        <>
          <Text size="sm" fw={500} mb="xs">Danh mục liên quan</Text>
          <Group mb="md">
            {results.categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.urlSlug}`}
                className="no-underline"
                onClick={onSelect}
              >
                <Box
                  className="bg-gray-100 hover:bg-gray-200 py-1 px-3 rounded-full text-sm text-gray-700"
                >
                  {category.name}
                </Box>
              </Link>
            ))}
          </Group>
          <Divider my="sm" />
        </>
      )}

      {/* Suggested products */}
      {results.products.length > 0 && (
        <>
          <Text size="sm" fw={500} mb="md">Sản phẩm gợi ý</Text>

          {results.products.map(product => (
            <Link
              key={product.id}
              to={`/products/${product.urlSlug}`}
              className="no-underline text-inherit"
              onClick={onSelect}
            >
              <Group mb="md" className="hover:bg-gray-50 rounded p-2 -mx-2">
                {product.thumbnailUrl && (
                  <img
                    src={product.thumbnailUrl}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <Box style={{ flex: 1 }}>
                  <Text size="sm" lineClamp={1}>{product.name}</Text>
                  {product.categoryName && (
                    <Text size="xs" c="dimmed">{product.categoryName}</Text>
                  )}
                </Box>
                <Text size="sm" fw={500}>{product.price.toLocaleString()}đ</Text>
              </Group>
            </Link>
          ))}

          <Divider my="sm" />
        </>
      )}

      {/* See all results */}
      <Link
        to={`/search?q=${encodeURIComponent(searchTerm)}`}
        className="block text-center text-blue-600 no-underline hover:underline py-1"
        onClick={onSelect}
      >
        <Text size="sm">Xem tất cả kết quả cho "{searchTerm}"</Text>
      </Link>
    </Paper>
  );
};

export default SuggestSearch;