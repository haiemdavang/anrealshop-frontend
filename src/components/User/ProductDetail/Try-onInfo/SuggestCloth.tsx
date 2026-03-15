import { Box, Grid, Paper, ScrollArea, Text, TextInput } from '@mantine/core';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import type { UserProductDto } from '../../../../types/ProductType';
import ProductCard from '../../Common/ProductCard';

interface SuggestClothProps {
  products: UserProductDto[];
  selectedProduct: UserProductDto | null;
  onSelectProduct: (product: UserProductDto) => void;
  onSearch?: (query: string) => void;
}

const SuggestCloth = ({ products, selectedProduct, onSelectProduct }: SuggestClothProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Paper withBorder p="md" radius="md" className="h-full">
      <Text fw={600} size="lg" className="mb-4">Chọn quần áo</Text>

      <TextInput
        placeholder="Tìm kiếm quần áo..."
        leftSection={<FiSearch size={16} />}
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="mb-4"
      />

      <ScrollArea h={500}>
        {filteredProducts.length > 0 ? (
          <Grid gutter="md">
            {filteredProducts.map((product) => (
              <Grid.Col span={{ base: 12, sm: 6 }} key={product.id}>
                <Box
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedProduct?.id === product.id
                      ? 'ring-2 ring-primary rounded-lg'
                      : ''
                  }`}
                  onClick={() => onSelectProduct(product)}
                >
                  <ProductCard product={product} compact={false} />
                </Box>
              </Grid.Col>
            ))}
          </Grid>
        ) : (
          <Box className="flex items-center justify-center h-64">
            <Text c="dimmed">Không tìm thấy sản phẩm phù hợp</Text>
          </Box>
        )}
      </ScrollArea>
    </Paper>
  );
};

export default SuggestCloth;
