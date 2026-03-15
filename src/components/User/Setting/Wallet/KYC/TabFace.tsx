import { ActionIcon, Box, Button, Group, Stack, Text } from '@mantine/core';
import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FiCamera, FiX } from 'react-icons/fi';
import showErrorNotification from '../../../../Toast/NotificationError';
import type { ImageUploadState } from './UploadDoc';

interface TabFaceProps {
    portraitImage: ImageUploadState | null;
    onCapture: (file: File, previewUrl: string) => void;
    onRemove: () => void;
    errors: Record<string, string>;
}

type FaceStatus = 'waiting' | 'no-face' | 'multiple-faces' | 'too-small' | 'not-centered' | 'ready';

const STATUS_MESSAGES: Record<FaceStatus, string> = {
    'waiting': 'Vui lòng đưa khuôn mặt vào khung hình',
    'no-face': 'Không phát hiện khuôn mặt',
    'multiple-faces': 'Chỉ cho phép một khuôn mặt trong khung hình',
    'too-small': 'Khuôn mặt quá xa — Hãy tiến lại gần hơn',
    'not-centered': 'Hãy đưa khuôn mặt vào giữa khung hình',
    'ready': 'Hoàn hảo! Giữ nguyên...',
};

const STATUS_BORDER_COLORS: Record<FaceStatus, string> = {
    'waiting': '#ffffff',
    'no-face': '#ef4444',
    'multiple-faces': '#ef4444',
    'too-small': '#ef4444',
    'not-centered': '#eab308',
    'ready': '#22c55e',
};

// Oval occupies ~65% of frame height, ~45% of width
const OVAL_RX_RATIO = 0.22;
const OVAL_RY_RATIO = 0.32;
// How close face center must be to oval center (fraction of oval radius)
const CENTER_TOLERANCE = 0.35;
// Minimum face area relative to oval area
const MIN_FACE_OVAL_RATIO = 0.25;
// Auto-capture delay (ms) after face is ready
const AUTO_CAPTURE_DELAY = 1500;
// Scrim opacity
const SCRIM_ALPHA = 0.6;

const TabFace = ({ portraitImage, onCapture, onRemove, errors }: TabFaceProps) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);

    const detectorRef = useRef<FaceDetector | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const autoCaptureTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const readyStartRef = useRef<number | null>(null);

    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isVideoReady, setIsVideoReady] = useState(false);
    const [isLoadingDetector, setIsLoadingDetector] = useState(false);
    const [faceStatus, setFaceStatus] = useState<FaceStatus>('waiting');
    const [autoCaptureProgress, setAutoCaptureProgress] = useState(0);
    const [error, setError] = useState('');

    // —— Draw scrim with oval cutout + boundary ——
    const drawOverlay = useCallback((
        ctx: CanvasRenderingContext2D,
        w: number,
        h: number,
        borderColor: string,
        pulsePhase: number,
    ) => {
        const cx = w / 2;
        const cy = h * 0.45; // slightly above center
        const rx = w * OVAL_RX_RATIO;
        const ry = h * OVAL_RY_RATIO;

        // 1. Draw scrim (dark overlay with oval cutout)
        ctx.save();
        ctx.fillStyle = `rgba(0, 0, 0, ${SCRIM_ALPHA})`;
        ctx.beginPath();
        ctx.rect(0, 0, w, h);
        // Cut out oval using even-odd rule
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2, true);
        ctx.fill('evenodd');
        ctx.restore();

        // 2. Draw oval boundary line
        const pulse = borderColor === '#ffffff'
            ? 0.5 + 0.5 * Math.sin(pulsePhase * 0.05)  // pulsing for waiting
            : 1;

        ctx.save();
        ctx.strokeStyle = borderColor;
        ctx.globalAlpha = pulse;
        ctx.lineWidth = 3;
        ctx.setLineDash(borderColor === '#22c55e' ? [] : [10, 6]);
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Glow effect for ready state
        if (borderColor === '#22c55e') {
            ctx.shadowColor = '#22c55e';
            ctx.shadowBlur = 16;
            ctx.strokeStyle = '#22c55e';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
        ctx.restore();

        // 3. Small guide marks at top/bottom of oval
        ctx.save();
        ctx.strokeStyle = borderColor;
        ctx.globalAlpha = 0.7;
        ctx.lineWidth = 2;
        const markLen = 12;
        // Top
        ctx.beginPath();
        ctx.moveTo(cx, cy - ry - markLen);
        ctx.lineTo(cx, cy - ry + markLen);
        ctx.stroke();
        // Bottom
        ctx.beginPath();
        ctx.moveTo(cx, cy + ry - markLen);
        ctx.lineTo(cx, cy + ry + markLen);
        ctx.stroke();
        // Left
        ctx.beginPath();
        ctx.moveTo(cx - rx - markLen, cy);
        ctx.lineTo(cx - rx + markLen, cy);
        ctx.stroke();
        // Right
        ctx.beginPath();
        ctx.moveTo(cx + rx - markLen, cy);
        ctx.lineTo(cx + rx + markLen, cy);
        ctx.stroke();
        ctx.restore();
    }, []);

    // —— Get oval params for current video size ——
    const getOvalParams = useCallback((videoW: number, videoH: number) => {
        return {
            cx: videoW / 2,
            cy: videoH * 0.45,
            rx: videoW * OVAL_RX_RATIO,
            ry: videoH * OVAL_RY_RATIO,
        };
    }, []);

    // —— Check if face is inside the oval ——
    const checkFaceInOval = useCallback((
        bb: { originX: number; originY: number; width: number; height: number },
        videoW: number,
        videoH: number,
    ): FaceStatus => {
        const oval = getOvalParams(videoW, videoH);

        const faceCx = bb.originX + bb.width / 2;
        const faceCy = bb.originY + bb.height / 2;

        // Check center alignment (normalized to oval radius)
        const dx = (faceCx - oval.cx) / oval.rx;
        const dy = (faceCy - oval.cy) / oval.ry;
        const distFromCenter = Math.sqrt(dx * dx + dy * dy);
        if (distFromCenter > CENTER_TOLERANCE * 2) {
            return 'not-centered';
        }

        // Check face size relative to oval
        const faceArea = bb.width * bb.height;
        const ovalArea = Math.PI * oval.rx * oval.ry;
        if (faceArea / ovalArea < MIN_FACE_OVAL_RATIO) {
            return 'too-small';
        }

        return 'ready';
    }, [getOvalParams]);

    // Initialize FaceDetector
    const initDetector = useCallback(async () => {
        if (detectorRef.current) return;
        setIsLoadingDetector(true);
        try {
            const vision = await FilesetResolver.forVisionTasks(
                'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
            );
            detectorRef.current = await FaceDetector.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite',
                    delegate: 'GPU',
                },
                runningMode: 'VIDEO',
                minDetectionConfidence: 0.5,
            });
        } catch (err) {
            console.error('FaceDetector init error:', err);
        } finally {
            setIsLoadingDetector(false);
        }
    }, []);

    // Cleanup
    useEffect(() => {
        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
            if (autoCaptureTimerRef.current) clearTimeout(autoCaptureTimerRef.current);
            if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
            detectorRef.current?.close();
            detectorRef.current = null;
        };
    }, []);

    // —— Auto capture ——
    const doAutoCapture = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return;

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

        canvas.toBlob(
            (blob) => {
                if (!blob) return;
                const file = new File([blob], `selfie_${Date.now()}.jpg`, { type: 'image/jpeg' });
                const previewUrl = URL.createObjectURL(blob);
                onCapture(file, previewUrl);
                stopCamera();
            },
            'image/jpeg',
            0.92
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onCapture]);

    // —— Detection loop ——
    const pulseRef = useRef(0);

    const detectLoop = useCallback(() => {
        const video = videoRef.current;
        const overlay = overlayCanvasRef.current;
        const detector = detectorRef.current;

        if (!video || !overlay || video.readyState < 2) {
            animFrameRef.current = requestAnimationFrame(detectLoop);
            return;
        }

        const ctx = overlay.getContext('2d');
        if (!ctx) return;

        const w = video.videoWidth;
        const h = video.videoHeight;
        overlay.width = w;
        overlay.height = h;
        ctx.clearRect(0, 0, w, h);

        pulseRef.current += 1;

        let currentStatus: FaceStatus = 'waiting';

        if (detector) {
            try {
                const result = detector.detectForVideo(video, performance.now());
                const detections = result.detections;

                if (detections.length === 0) {
                    currentStatus = 'no-face';
                } else if (detections.length > 1) {
                    currentStatus = 'multiple-faces';
                } else {
                    const bb = detections[0].boundingBox;
                    if (bb) {
                        currentStatus = checkFaceInOval(bb, w, h);
                    } else {
                        currentStatus = 'no-face';
                    }
                }
            } catch {
                currentStatus = 'waiting';
            }
        }

        setFaceStatus(currentStatus);

        // Auto-capture progress
        if (currentStatus === 'ready') {
            if (!readyStartRef.current) {
                readyStartRef.current = performance.now();
            }
            const elapsed = performance.now() - readyStartRef.current;
            const progress = Math.min(elapsed / AUTO_CAPTURE_DELAY, 1);
            setAutoCaptureProgress(Math.round(progress * 100));

            if (progress >= 1 && !autoCaptureTimerRef.current) {
                autoCaptureTimerRef.current = setTimeout(() => {
                    doAutoCapture();
                }, 50);
            }
        } else {
            readyStartRef.current = null;
            setAutoCaptureProgress(0);
            if (autoCaptureTimerRef.current) {
                clearTimeout(autoCaptureTimerRef.current);
                autoCaptureTimerRef.current = null;
            }
        }

        // Draw overlay (scrim + oval + boundary)
        const borderColor = STATUS_BORDER_COLORS[currentStatus];
        drawOverlay(ctx, w, h, borderColor, pulseRef.current);

        // Draw auto-capture progress arc on oval when ready
        if (currentStatus === 'ready' && autoCaptureProgress > 0) {
            const oval = getOvalParams(w, h);
            ctx.save();
            ctx.strokeStyle = '#22c55e';
            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            ctx.beginPath();
            // Draw arc from top, clockwise
            const startAngle = -Math.PI / 2;
            const endAngle = startAngle + (Math.PI * 2 * autoCaptureProgress / 100);
            ctx.ellipse(oval.cx, oval.cy, oval.rx + 4, oval.ry + 4, 0, startAngle, endAngle);
            ctx.stroke();
            ctx.restore();
        }

        animFrameRef.current = requestAnimationFrame(detectLoop);
    }, [checkFaceInOval, doAutoCapture, drawOverlay, getOvalParams, autoCaptureProgress]);

    const startCamera = async () => {
        setError('');
        setIsVideoReady(false);
        setFaceStatus('waiting');
        setAutoCaptureProgress(0);
        readyStartRef.current = null;

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }

        try {
            const media = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
                audio: false,
            });

            streamRef.current = media;
            setIsCameraActive(true);

            await initDetector();

            if (videoRef.current) {
                videoRef.current.srcObject = media;
                videoRef.current.onloadeddata = () => {
                    setIsVideoReady(true);
                    videoRef.current?.play();
                    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
                    animFrameRef.current = requestAnimationFrame(detectLoop);
                };
            }
        } catch (err) {
            let msg = 'Không thể truy cập camera.';
            if (err instanceof Error) {
                if (err.name === 'NotAllowedError') msg = 'Vui lòng cấp quyền truy cập camera trong cài đặt trình duyệt.';
                else if (err.name === 'NotFoundError') msg = 'Không tìm thấy camera trên thiết bị.';
                else if (err.name === 'NotReadableError') msg = 'Camera đang được sử dụng bởi ứng dụng khác.';
            }
            setError(msg);
            setIsCameraActive(false);
        }
    };

    const stopCamera = () => {
        if (animFrameRef.current) {
            cancelAnimationFrame(animFrameRef.current);
            animFrameRef.current = null;
        }
        if (autoCaptureTimerRef.current) {
            clearTimeout(autoCaptureTimerRef.current);
            autoCaptureTimerRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.srcObject = null;
        }
        readyStartRef.current = null;
        setIsCameraActive(false);
        setIsVideoReady(false);
        setFaceStatus('waiting');
        setAutoCaptureProgress(0);
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current || !isVideoReady) return;

        if (faceStatus !== 'ready' && detectorRef.current) {
            showErrorNotification('Cảnh báo', 'Vui lòng đảm bảo khuôn mặt nằm gọn trong khung hình oval.');
            return;
        }

        doAutoCapture();
    };

    const handleRemove = () => {
        onRemove();
        setError('');
        stopCamera();
    };

    // Status text color for UI
    const statusTextColor =
        faceStatus === 'ready' ? 'green'
            : faceStatus === 'not-centered' ? 'yellow'
                : faceStatus === 'waiting' ? 'white'
                    : 'red';

    return (
        <Stack gap="md">
            <Text size="sm" c="dimmed" ta="center">
                Chụp ảnh chân dung rõ ràng, nhìn thẳng vào camera, không đeo kính râm hay khẩu trang.
            </Text>

            <Box
                className="relative rounded-xl overflow-hidden mx-auto"
                style={{ width: '100%', maxWidth: 480, height: 420, backgroundColor: '#111' }}
            >
                {/* === Camera Active === */}
                {isCameraActive && !portraitImage ? (
                    <Box className="relative w-full h-full">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                            style={{ transform: 'scaleX(-1)', backgroundColor: '#000' }}
                        />

                        {/* Overlay canvas (scrim + oval + boundary + progress arc) */}
                        <canvas
                            ref={overlayCanvasRef}
                            className="absolute inset-0 w-full h-full pointer-events-none"
                            style={{ transform: 'scaleX(-1)' }}
                        />

                        {/* Guidance text at bottom of oval area */}
                        {isVideoReady && (
                            <Box className="absolute bottom-16 left-0 right-0 z-20 flex flex-col items-center gap-1">
                                <Text
                                    size="sm"
                                    fw={600}
                                    ta="center"
                                    style={{ color: statusTextColor, textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
                                >
                                    {STATUS_MESSAGES[faceStatus]}
                                </Text>
                                {faceStatus === 'ready' && autoCaptureProgress > 0 && (
                                    <Text
                                        size="xs"
                                        ta="center"
                                        style={{ color: '#86efac', textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}
                                    >
                                        Tự động chụp sau {Math.max(0, Math.ceil((AUTO_CAPTURE_DELAY - autoCaptureProgress * AUTO_CAPTURE_DELAY / 100) / 1000))}s...
                                    </Text>
                                )}
                            </Box>
                        )}

                        {/* Loading overlay */}
                        {!isVideoReady && (
                            <Box className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 gap-2">
                                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <Text c="white" size="sm">Đang khởi động camera...</Text>
                            </Box>
                        )}

                        {isLoadingDetector && isVideoReady && (
                            <Box className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
                                <Text
                                    size="xs"
                                    style={{ color: '#93c5fd', textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}
                                >
                                    Đang tải bộ nhận diện khuôn mặt...
                                </Text>
                            </Box>
                        )}

                        {/* Bottom buttons */}
                        <Box className="absolute bottom-3 left-0 right-0 z-20 flex justify-center px-4">
                            <Group gap="sm">
                                <Button
                                    size="sm"
                                    leftSection={<FiCamera size={16} />}
                                    onClick={capturePhoto}
                                    variant="filled"
                                    disabled={!isVideoReady || (faceStatus !== 'ready' && !!detectorRef.current)}
                                    color={faceStatus === 'ready' ? 'green' : 'gray'}
                                    styles={{
                                        root: {
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                                        },
                                    }}
                                >
                                    {!isVideoReady ? 'Đang tải...' : faceStatus === 'ready' ? 'Chụp ngay' : 'Đưa mặt vào khung'}
                                </Button>
                                <Button
                                    size="sm"
                                    leftSection={<FiX size={16} />}
                                    onClick={stopCamera}
                                    variant="default"
                                    styles={{
                                        root: {
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                                            backgroundColor: 'rgba(255,255,255,0.15)',
                                            color: 'white',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                        },
                                    }}
                                >
                                    Hủy
                                </Button>
                            </Group>
                        </Box>
                    </Box>
                ) : portraitImage ? (
                    /* === Captured / Uploaded Preview === */
                    <Box className="relative w-full h-full">
                        <img
                            src={portraitImage.url}
                            alt="Ảnh chân dung"
                            className="w-full h-full object-cover"
                        />
                        <ActionIcon
                            color="red"
                            variant="filled"
                            onClick={handleRemove}
                            size="md"
                            radius="xl"
                            className="absolute top-3 right-3 z-20 shadow-lg"
                        >
                            <FiX size={16} />
                        </ActionIcon>
                        {portraitImage.isUploading && (
                            <Box className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 gap-2">
                                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <Text c="white" fw={500}>Đang tải lên...</Text>
                            </Box>
                        )}
                        {/* Retake button */}
                        <Box className="absolute bottom-3 left-0 right-0 z-20 flex justify-center">
                            <Button
                                size="sm"
                                leftSection={<FiCamera size={16} />}
                                onClick={() => {
                                    handleRemove();
                                    setTimeout(startCamera, 100);
                                }}
                                variant="filled"
                                styles={{
                                    root: {
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                                    },
                                }}
                            >
                                Chụp lại
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    /* === Empty State === */
                    <Box className="flex flex-col items-center justify-center h-full p-6 text-center">
                        {/* Oval guide illustration */}
                        <Box
                            className="mb-4 flex items-center justify-center"
                            style={{
                                width: 120,
                                height: 160,
                                borderRadius: '50%',
                                border: '2px dashed rgba(255,255,255,0.3)',
                            }}
                        >
                            <FiCamera size={36} className="text-gray-500" />
                        </Box>
                        <Text c="gray.4" size="sm" fw={500} mb={4}>
                            Chụp ảnh selfie chân dung
                        </Text>
                        <Text c="gray.6" size="xs" mb="md">
                            Khuôn mặt sẽ được tự động nhận diện khi mở camera
                        </Text>

                        <Button
                            size="sm"
                            leftSection={<FiCamera size={16} />}
                            onClick={startCamera}
                            variant="filled"
                        >
                            Mở camera
                        </Button>

                        {error && (
                            <Text c="red" size="sm" ta="center" mt="md" className="bg-red-950/50 p-2 rounded w-full">
                                {error}
                            </Text>
                        )}
                    </Box>
                )}
            </Box>

            {errors.portraitImage && (
                <Text c="red" size="sm" ta="center">
                    {errors.portraitImage}
                </Text>
            )}

            <canvas ref={canvasRef} className="hidden" />
        </Stack>
    );
};

export default TabFace;
