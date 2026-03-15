import { Box, Container, Grid, Group, LoadingOverlay, Paper, Text } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import TryOnService from '../../../../service/TryOnService';
import showErrorNotification from '../../../Toast/NotificationError';
import showSuccessNotification from '../../../Toast/NotificationSuccess';
import CameraPicture from './CameraPicture';

interface TryOnProps {
  productImageUrl: string;
  onBack?: () => void;
}

const TryOn = ({ productImageUrl, onBack }: TryOnProps) => {
  const [userImage, setUserImage] = useState<string>('');
  const [tryOnResult, setTryOnResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tryOnResult && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [tryOnResult]);

  const handleImageCapture = (imageData: string) => {
    setUserImage(imageData);
    setTryOnResult('');
  };

  const handleTryOn = async () => {
    if (!userImage) {
      showErrorNotification('Lỗi', 'Vui lòng chụp hoặc tải ảnh lên');
      return;
    }
    if (!productImageUrl) {
      showErrorNotification('Lỗi', 'Không tìm thấy ảnh sản phẩm');
      return;
    }

    setIsLoading(true);
    try {
      // Ảnh từ camera/upload làm ảnh human
      const personImageBase64 = userImage.replace(/^data:image\/\w+;base64,/, '');
      
      // Ảnh selected từ ImageProduct làm ảnh fashion
      const productImageResponse = await fetch(productImageUrl);
      const productImageBlob = await productImageResponse.blob();
      const productImageBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).replace(/^data:image\/\w+;base64,/, '');
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(productImageBlob);
      });

      const response = await TryOnService.tryOn({
        personImageBase64,
        productImageBase64,
        baseSteps: 25,
      });

      if (response.success && response.resultImageBase64) {
        // Add proper base64 prefix if not present
        const resultImage = response.resultImageBase64.startsWith('data:')
          ? response.resultImageBase64
          : `data:${response.mimeType || 'image/jpeg'};base64,${response.resultImageBase64}`;
        
        setTryOnResult(resultImage);
        showSuccessNotification('Thành công', response.message || 'Thử đồ thành công!');
      } else {
        showErrorNotification('Lỗi', response.message || 'Có lỗi xảy ra khi thử đồ');
      }
    } catch (error) {
      console.error('Try-on error:', error);
      showErrorNotification('Lỗi', 'Có lỗi xảy ra khi thử đồ. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container size="xl" >
      <Grid gutter="md">
        <Grid.Col span={12}>
          <CameraPicture
            onImageCapture={handleImageCapture}
            capturedImage={userImage || null}
            onTryOn={handleTryOn}
            canTryOn={!!userImage && !!productImageUrl && !isLoading}
            onBack={onBack}
          />
        </Grid.Col>

        {/* Result section - full width */}
        <Grid.Col span={12} ref={resultRef}>
          <Paper withBorder p="md" radius="md" className="">
            <Group justify="space-between" className="mb-4">
              <Text fw={600} size="lg">Kết quả</Text>
            </Group>

            <Box 
              className="relative bg-gray-100 rounded-lg overflow-hidden w-full" 
              style={tryOnResult ? { minHeight: '400px' } : { minHeight: '150px' }}
            >
              <LoadingOverlay visible={isLoading} />
              {tryOnResult ? (
                <img src={tryOnResult} alt="Try On Result" className="w-full h-auto object-contain" />
              ) : (
                <Box className="flex items-center justify-center h-[150px]">
                  <Text c="dimmed">Kết quả sẽ hiển thị ở đây</Text>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default TryOn;      