import { ActionIcon, Box, Group, Image, ScrollArea } from '@mantine/core';
import { createPortal } from 'react-dom';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';

interface ZoomViewModalProps {
  opened: boolean;
  onClose: () => void;
  images: string[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  altPrefix?: string;
}

const ZoomViewModal = ({
  opened,
  onClose,
  images,
  selectedIndex,
  onSelectIndex,
  altPrefix = 'Ảnh'
}: ZoomViewModalProps) => {
  if (!opened || images.length === 0) return null;

  const handlePrev = () => {
    onSelectIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
  };

  const handleNext = () => {
    onSelectIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
  };

  return createPortal(
    <div
      className="!fixed !top-0 !left-0 !right-0 bottom-0 bg-black/90 !z-[999] flex items-center justify-center"
      onClick={onClose}
      style={{ backdropFilter: 'blur(2px)' }}
    >
      {/* Close button */}
      <ActionIcon
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white'
        }}
        className="hover:bg-black/70"
        variant="filled"
        radius="xl"
        size="lg"
        onClick={onClose}
      >
        <FiX size={24} />
      </ActionIcon>

      {/* Zoomed image container */}
      <div
        className="relative"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '90vw', maxHeight: '80vh' }}
      >
        <Image
          src={images[selectedIndex]}
          className="max-h-[80vh] max-w-[90vw] object-contain"
          alt={`${altPrefix} - ${selectedIndex + 1}`}
        />
      </div>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <div className="absolute top-1/2 w-full flex justify-between px-6" style={{ transform: 'translateY(-50%)' }}>
          <ActionIcon
            variant="filled"
            radius="xl"
            size="xl"
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', color: 'white' }}
            className="hover:bg-black/50"
          >
            <FiChevronLeft size={24} />
          </ActionIcon>
          <ActionIcon
            variant="filled"
            radius="xl"
            size="xl"
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', color: 'white' }}
            className="hover:bg-black/50"
          >
            <FiChevronRight size={24} />
          </ActionIcon>
        </div>
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <div
          className="absolute left-1/2 transform -translate-x-1/2"
          style={{ bottom: '24px' }}
        >
          <ScrollArea className="w-auto">
            <Group className="bg-black/20 p-2 rounded-lg" gap="xs">
              {images.map((imgUrl, idx) => (
                <Box
                  key={`zoom-thumb-${idx}`}
                  className={`cursor-pointer overflow-hidden border-2 rounded-md transition-all ${
                    selectedIndex === idx ? 'border-white' : 'border-transparent hover:border-gray-400'
                  }`}
                  onClick={(e) => { e.stopPropagation(); onSelectIndex(idx); }}
                  style={{
                    width: '50px',
                    height: '50px',
                    opacity: selectedIndex === idx ? 1 : 0.7
                  }}
                >
                  <Image
                    src={imgUrl}
                    height={50}
                    width={50}
                    fit="cover"
                    className="object-cover w-[50px] h-[50px] rounded"
                    alt={`${altPrefix} - thumbnail ${idx + 1}`}
                  />
                </Box>
              ))}
            </Group>
          </ScrollArea>
        </div>
      )}
    </div>,
    document.body
  );
};

export default ZoomViewModal;
