import { ActionIcon, Box, Group, Image, LoadingOverlay, ScrollArea, Stack } from '@mantine/core';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
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
  const tryOnPreviewImage = useMemo(() => {
    const tryOnImages = [8, 9, 10, 11, 12, 13];
    const randomIndex = Math.floor(Math.random() * tryOnImages.length);
    return `/images/tryon/${tryOnImages[randomIndex]}.png`;
  }, []);

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

            {/* Try-on image overlay */}
            {typeof onTryProduct === 'function' && !showTryOn && (
              <motion.div
                className="absolute bottom-3 right-3 z-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onTryProduct(); }}
                  className="
                    group relative isolate block h-14 w-14 overflow-visible rounded-xl p-1.5 shadow-lg transition-all duration-300
                    
                    /* MẶC ĐỊNH: Nền gương trắng đục (Đã xoá border tĩnh mặc định) */
                    bg-white/80 backdrop-blur-sm
                    shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),_0_8px_32px_0_rgba(0,0,0,0.12)]
                    
                    /* HOVER: Kính mờ thay đổi độ đục + Tăng bóng đổ */
                    hover:scale-105 
                    hover:bg-white/[0.22] 
                    hover:backdrop-blur-md 
                    hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),_0_12px_32px_rgba(0,0,0,0.2)]
                  "
                  title="Thử sản phẩm"
                >
                  {/* ================= VIỀN GIẢ CHẠY MÀU PRIMARY (MẶC ĐỊNH) ================= */}
                  {/* Lớp 1: Vệt màu Primary xoay tròn phía sau */}
                  <span className="absolute -inset-[1px] -z-20 overflow-hidden rounded-xl before:absolute before:inset-[-200%] before:animate-[spin_3s_linear_infinite] before:bg-[conic-gradient(from_0deg,transparent_40%,var(--primary)_100%)] group-hover:hidden" />
                  
                  {/* Lớp 2: Lớp đè tạo độ dày cho viền (1px) và giữ hiệu ứng trong suốt cho phần ruột */}
                  <span className="absolute inset-0 -z-20 rounded-[11px] bg-white/80 backdrop-blur-sm group-hover:hidden" />
                  {/* ========================================================================= */}


                  {/* Đốm sáng phản chiếu góc (Glow Effect) - Xuất hiện khi hover */}
                  <span className="pointer-events-none absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  
                  {/* Ảnh preview sản phẩm bên trong */}
                  <img
                    src={tryOnPreviewImage}
                    alt="Thử sản phẩm"
                    className="h-full w-full rounded-lg object-cover"
                  />

                  {/* 4 Góc Border Nhấn (Target Corners) */}
                  <span className="pointer-events-none absolute h-3 w-3 rounded-tl-md border-t-2 border-l-2 -top-1 -left-1 border-white/40 opacity-0 transition-all duration-300 group-hover:-top-1.5 group-hover:-left-1.5 group-hover:border-primary group-hover:opacity-100" />
                  <span className="pointer-events-none absolute h-3 w-3 rounded-tr-md border-t-2 border-r-2 -top-1 -right-1 border-white/40 opacity-0 transition-all duration-300 group-hover:-top-1.5 group-hover:-right-1.5 group-hover:border-primary group-hover:opacity-100" />
                  <span className="pointer-events-none absolute h-3 w-3 rounded-bl-md border-b-2 border-l-2 -bottom-1 -left-1 border-white/40 opacity-0 transition-all duration-300 group-hover:-bottom-1.5 group-hover:-left-1.5 group-hover:border-primary group-hover:opacity-100" />
                  <span className="pointer-events-none absolute h-3 w-3 rounded-br-md border-r-2 border-b-2 -right-1 -bottom-1 border-white/40 opacity-0 transition-all duration-300 group-hover:-right-1.5 group-hover:-bottom-1.5 group-hover:border-primary group-hover:opacity-100" />
                </button>
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
