import { Box, Button, Container, Grid, Group, LoadingOverlay, Paper, Text } from '@mantine/core';
import { useState } from 'react';
import { FiRefreshCw, FiStar } from 'react-icons/fi';
import type { UserProductDto } from '../../../../types/ProductType';
import showErrorNotification from '../../../Toast/NotificationError';
import showSuccessNotification from '../../../Toast/NotificationSuccess';
import CameraPicture from './CameraPicture';
import { MOCK_TRYON_PRODUCTS } from './DataDefault';
import SuggestCloth from './SuggestCloth';

const TryOn = () => {
  const [userImage, setUserImage] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<UserProductDto | null>(null);
  const [tryOnResult, setTryOnResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImageCapture = (imageData: string) => {
    setUserImage(imageData);
    setTryOnResult('');
  };

  const handleTryOn = async () => {
    if (!userImage) {
      showErrorNotification('Lỗi', 'Vui lòng chụp hoặc tải ảnh lên');
      return;
    }
    if (!selectedProduct) {
      showErrorNotification('Lỗi', 'Vui lòng chọn sản phẩm để thử');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(res => setTimeout(res, 1500));
      setTryOnResult(userImage);
      showSuccessNotification('Thành công', 'Thử đồ thành công!');
    } catch {
      showErrorNotification('Lỗi', 'Có lỗi xảy ra khi thử đồ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUserImage('');
    setSelectedProduct(null);
    setTryOnResult('');
  };

  return (
    <Container size="xl" >
      <Grid gutter="md">
        <Grid.Col span={12}>
          <CameraPicture
            onImageCapture={handleImageCapture}
            capturedImage={userImage || null}
            onTryOn={handleTryOn}
            canTryOn={!!userImage && !!selectedProduct && !isLoading}
          />
        </Grid.Col>

        {/* Result section - full width */}
        <Grid.Col span={12}>
          <Paper withBorder p="md" radius="md" className="h-full">
            <Group justify="space-between" className="mb-4">
              <Text fw={600} size="lg">Kết quả</Text>
              {tryOnResult && (
                <Button variant="subtle" size="xs" leftSection={<FiRefreshCw size={16} />} onClick={handleReset}>
                  Thử lại
                </Button>
              )}
            </Group>

            <Box className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '3/4', minHeight: '400px' }}>
              <LoadingOverlay visible={isLoading} />
              {tryOnResult ? (
                <img src={tryOnResult} alt="Try On Result" className="w-full h-full object-cover" />
              ) : (
                <Box className="flex items-center justify-center h-full">
                  <Text c="dimmed">Kết quả sẽ hiển thị ở đây</Text>
                </Box>
              )}
            </Box>

            <Group justify="center" className="mt-4">
              <Button leftSection={<FiStar size={18} />} onClick={handleTryOn} disabled={!userImage || !selectedProduct || isLoading} fullWidth size="md">
                Thử đồ ngay
              </Button>
            </Group>

            {tryOnResult && selectedProduct && (
              <Box className="mt-4 p-3 bg-gray-50 rounded-lg">
                <Text size="sm" fw={500} className="mb-2">Sản phẩm đã thử:</Text>
                <Group>
                  <img src={selectedProduct.thumbnailUrl} alt={selectedProduct.name} className="w-12 h-12 object-cover rounded" />
                  <Box className="flex-1">
                    <Text size="sm" lineClamp={1}>{selectedProduct.name}</Text>
                    <Text size="xs" c="dimmed">{selectedProduct.shopName}</Text>
                  </Box>
                </Group>
              </Box>
            )}
          </Paper>
        </Grid.Col>

        {/* Product selection - full width */}
        <Grid.Col span={12}>
          <SuggestCloth
            products={MOCK_TRYON_PRODUCTS}
            selectedProduct={selectedProduct}
            onSelectProduct={setSelectedProduct}
          />
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default TryOn;
