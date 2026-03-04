import { ActionIcon, Box, Group, Image, LoadingOverlay, ScrollArea, Stack, Button } from '@mantine/core';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ZoomViewModal from '../../common/ZoomViewModal';

interface ImageProductProps {
  media: string[];
  thumbnailUrl: string;
  productName: string;
  selectedImage: number;
  setSelectedImage: (image: number) => void;
  onTryProduct?: () => void;
  showTryOn?: boolean;
}

const ImageProduct = ({
  media,
  thumbnailUrl,
  productName,
  selectedImage,
  setSelectedImage,
  onTryProduct,
  showTryOn = false
}: ImageProductProps) => {
  const [loading, setLoading] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState<string[]>([]);
  const [zoomedView, setZoomedView] = useState(false);


  useEffect(() => {

    const img = new window.Image();
    img.src = media[0] || thumbnailUrl;
    img.onload = () => {
      setPreloadedImages(prev => [...prev, img.src]);
    };

    media.slice(1).forEach((imageUrl) => {
      const preloadImg = new window.Image();
      preloadImg.src = imageUrl;
      preloadImg.onload = () => {
        setPreloadedImages(prev => [...prev, imageUrl]);
      };
    });
  }, [media, thumbnailUrl]);

  const handlePrevImage = () => {
    const prevIndex = selectedImage === 0 ? media.length - 1 : selectedImage - 1;
    const prevImageUrl = media[prevIndex];

    if (!preloadedImages.includes(prevImageUrl)) {
      setLoading(true);
    }
    setSelectedImage(prevIndex);
  };

  const handleNextImage = () => {
    const nextIndex = selectedImage === media.length - 1 ? 0 : selectedImage + 1;
    const nextImageUrl = media[nextIndex];
    if (!preloadedImages.includes(nextImageUrl)) {
      setLoading(true);
    }
    setSelectedImage(nextIndex);
  };

  const handleImageLoad = () => {
    setLoading(false);
    const currentUrl = media[selectedImage];
    if (currentUrl && !preloadedImages.includes(currentUrl)) {
      setPreloadedImages(prev => [...prev, currentUrl]);
    }
  };

  return (
    <>
      <Box className="relative flex flex-col md:flex-row" style={{ minHeight: '440px' }}>
        <Stack
          className="flex-shrink-0 mr-4 hidden md:flex"
          gap="xs"
          style={{
            // width: '90px',
            maxHeight: '440px',
            overflowY: 'auto'
          }}
        >
          {media.map((imgUrl, idx) => (
            <Box
              key={idx}
              className={`cursor-pointer overflow-hidden border-2 rounded-md transition-all ${selectedImage === idx ? 'border-primary' : 'border-transparent hover:border-gray-300'
                }`}
              onClick={() => setSelectedImage(idx)}
              style={{
                height: '80px',
                position: 'relative',
                flexShrink: 0
              }}
            >
              <Image
                src={imgUrl}
                height={80}
                width={80}
                fit="cover"
                className="object-cover w-[80px] h-[80px] rounded"
                alt={`${productName} - ảnh ${idx + 1}`}
                loading="lazy"
              />
            </Box>
          ))}
        </Stack>

        <Box
          className="relative flex-1 overflow-hidden rounded-md bg-white"
          style={{ minHeight: '400px' }}
        >
          <Box
            className="relative w-full h-full"
            style={{ minHeight: '400px', cursor: 'zoom-in' }}
            onClick={() => setZoomedView(true)}
          >
            <LoadingOverlay visible={loading} />
            <Image
              src={media[selectedImage] || thumbnailUrl}
              height={500}
              className="w-full h-full object-cover bg-white transition-opacity duration-300"
              alt={productName}
              onLoad={handleImageLoad}
            />

            {media.length > 1 && (
              <Box className="absolute bottom-3 left-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
                {selectedImage + 1}/{media.length}
              </Box>
            )}

            {/* Try-on button overlay */}
            {typeof onTryProduct === 'function' && !showTryOn && (
              <motion.div 
                className="absolute bottom-3 right-3 z-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="xs"
                  onClick={(e) => { e.stopPropagation(); onTryProduct(); }}
                  className="bg-primary hover:bg-primary/90"
                >
                  Thử sản phẩm
                </Button>
              </motion.div>
            )}
          </Box>
          
          <ScrollArea className="mt-2 md:hidden">
            <Group className="gap-2 justify-center">
              {media.map((imgUrl, idx) => (
                <Box
                  key={idx}
                  className={`cursor-pointer overflow-hidden border-2 rounded-md flex-shrink-0 ${selectedImage === idx ? 'border-primary' : 'border-transparent hover:border-gray-200'
                    }`}
                  onClick={() => setSelectedImage(idx)}
                  style={{ width: '60px', height: '60px' }}
                >
                  <Image
                    src={imgUrl}
                    height={60}
                    width={60}
                    fit="cover"
                    alt={`${productName} - ảnh ${idx + 1}`}
                    loading="lazy"
                  />
                </Box>
              ))}
            </Group>
          </ScrollArea>

          {/* Navigation Arrows */}
          {media.length > 1 && (
            <div className="absolute top-1/2 w-full flex justify-between px-2" style={{ transform: 'translateY(-50%)' }}>
              <ActionIcon
                variant="filled"
                radius="xl"
                size="lg"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  color: '#333',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
                className="hover:bg-white"
              >
                <FiChevronLeft size={20} />
              </ActionIcon>
              <ActionIcon
                variant="filled"
                radius="xl"
                size="lg"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  color: '#333',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
                className="hover:bg-white"
              >
                <FiChevronRight size={20} />
              </ActionIcon>
            </div>
          )}
        </Box>
      </Box>

      {/* Zoomed View Modal */}
      <ZoomViewModal
        opened={zoomedView}
        onClose={() => setZoomedView(false)}
        images={media}
        selectedIndex={selectedImage}
        onSelectIndex={setSelectedImage}
        altPrefix={productName}
      />
    </>
  );
};

export default ImageProduct;