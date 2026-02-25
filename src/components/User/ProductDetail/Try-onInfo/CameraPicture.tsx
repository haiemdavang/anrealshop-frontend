import { ActionIcon, Box, Button, Group, Paper, Text } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { FiCamera, FiUpload, FiX, FiArrowLeft } from 'react-icons/fi';
// import BodyAnalyzer from './BodyAnalyzer';
import showErrorNotification from '../../../Toast/NotificationError';

interface CameraPictureProps {
  onImageCapture: (imageData: string) => void;
  capturedImage: string | null;
  onTryOn?: () => void;
  canTryOn?: boolean;
  onBack?: () => void;
}

const CameraPicture = ({ onImageCapture, capturedImage, onTryOn, canTryOn, onBack }: CameraPictureProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [error, setError] = useState<string>('');
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    if (!stream || !videoRef.current) return;

    const videoEl = videoRef.current;
    videoEl.srcObject = stream;

    const play = async () => {
      try {
        await videoEl.play();
        setIsVideoReady(true);
        setError('');
      } catch (e) {
        console.log(e);
        setTimeout(() => {
          videoEl.play().catch(() => setError('Không thể phát video từ camera'));
        }, 150);
      }
    };

    play();

    return () => {
      videoEl.pause();
      videoEl.srcObject = null;
    };
  }, [stream]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [stream]);


  const startCamera = async () => {
    setError('');
    setIsVideoReady(false);

    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
      setIsCameraActive(false);
      setIsVideoReady(false);
    }

    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      });

      setShowCamera(true);
      setStream(media);
      setIsCameraActive(true);
    } catch (err) {
      let msg = 'Không thể truy cập camera.';
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          msg = 'Vui lòng cấp quyền truy cập camera trong cài đặt trình duyệt.';
        } else if (err.name === 'NotFoundError') {
          msg = 'Không tìm thấy camera trên thiết bị.';
        } else if (err.name === 'NotReadableError') {
          msg = 'Camera đang được sử dụng bởi ứng dụng khác.';
        } else {
          msg = err.message || msg;
        }
      }
      setError(msg);
      setIsCameraActive(false);
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
    }
    setIsCameraActive(false);
    setIsVideoReady(false);
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !isVideoReady) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();

    const data = canvas.toDataURL('image/jpeg', 0.9);
    onImageCapture(data);
    stopCamera();
    setShowCamera(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showErrorNotification('Lỗi chọn file', 'Vui lòng chọn file ảnh');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showErrorNotification('Lỗi chọn file', 'Kích thước file không được vượt quá 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const data = ev.target?.result as string;
      onImageCapture(data);
      setShowCamera(false);
    };
    reader.onerror = () => showErrorNotification('Lỗi khi tải ảnh', 'Không thể đọc file. Vui lòng thử lại.');
    reader.readAsDataURL(file);
  };

  const resetImage = () => {
    onImageCapture('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setError('');
    stopCamera();
    setShowCamera(false);
  };

  return (
    <Paper withBorder radius="md" className="bg-white shadow-sm relative">
      <Box className="relative bg-gray-100 rounded-lg overflow-hidden border border-gray-100 w-full" style={{ height: '450px' }}>
        {/* Back button */}
        {onBack && (
          <Box className="absolute top-3 left-3 z-20">
            <ActionIcon 
              variant="filled" 
              onClick={onBack} 
              size="md" 
              className="bg-white hover:bg-white text-gray-800"
              style={{ color: '#000' }}
              title="Quay lại"
            >
              <FiArrowLeft size={20} />
            </ActionIcon>
          </Box>
        )}

        <Box className="absolute top-3 right-3 z-20 flex items-center gap-2">
          <Text fw={600} size="sm" className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-md shadow-sm">
            Ảnh của bạn
          </Text>
          {capturedImage && (
            <ActionIcon color="red" variant="filled" onClick={resetImage} size="sm" className="bg-red-500 hover:bg-red-600">
              <FiX size={18} />
            </ActionIcon>
          )}
        </Box>

        {/* Always show camera if showCamera is true */}
        {showCamera ? (
          <Box className="relative w-full h-full">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)', backgroundColor: '#000' }}
              onCanPlay={() => setIsVideoReady(true)}
            />
            {/* <BodyAnalyzer videoRef={videoRef} isActive={showCamera} isVideoReady={isVideoReady} /> */}
            {!isVideoReady && (
              <Box className="absolute inset-0 flex items-center justify-center bg-gray-100/90 z-10">
                <Text c="dimmed">Đang khởi động camera...</Text>
              </Box>
            )}
          </Box>
        ) : capturedImage ? (
          <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
        ) : (
          <Box className="flex flex-col items-center justify-center h-full p-4">
            <Box className="bg-white p-4 rounded-full mb-3 shadow-sm">
              <FiCamera size={32} className="text-gray-400" />
            </Box>
            <Text c="dimmed" className="mb-2 text-center">Chụp ảnh hoặc tải ảnh lên để bắt đầu</Text>
            {error && (
              <Text c="red" size="sm" className="text-center px-4 mt-2 bg-red-50 p-2 rounded w-full">
                {error}
              </Text>
            )}
          </Box>
        )}

        <Box className="absolute bottom-4 left-0 right-0 z-20 flex justify-center px-4">
          <Group gap="md" className="bg-white/50 backdrop-blur-md px-4 py-3 rounded-lg shadow-lg border border-white/20">
            {!capturedImage && !isCameraActive && (
              <>
                <Button leftSection={<FiCamera size={18} />} onClick={startCamera} variant="filled" className="bg-primary hover:bg-primary/90">
                  Chụp ảnh
                </Button>
                <Button leftSection={<FiUpload size={18} />} onClick={() => fileInputRef.current?.click()} variant="outline" className="border-primary text-primary hover:bg-primary/5">
                  Tải ảnh lên
                </Button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </>
            )}

            {isCameraActive && (
              <>
                <Button leftSection={<FiCamera size={18} />} onClick={capturePhoto} variant="filled" disabled={!isVideoReady} className="bg-primary hover:bg-primary/90">
                  {isVideoReady ? 'Chụp ngay' : 'Đang tải...'}
                </Button>
                <Button leftSection={<FiX size={18} />} onClick={stopCamera} variant="default">
                  Hủy
                </Button>
              </>
            )}

            {capturedImage && !isCameraActive && (
              <>
                <Button leftSection={<FiCamera size={18} />} onClick={startCamera} variant="filled" className="bg-primary hover:bg-primary/90">
                  Chụp lại
                </Button>
                {onTryOn && (
                  <Button 
                    leftSection={<FiCamera size={18} />} 
                    onClick={onTryOn}
                    disabled={!canTryOn}
                    variant="filled"
                    className="bg-primary hover:bg-primary/90 !text-white"
                  >
                    Thử đồ
                  </Button>
                )}
              </>
            )}
          </Group>
        </Box>
      </Box>

      <canvas ref={canvasRef} className="hidden" />

    </Paper>
  );
};

export default CameraPicture;
