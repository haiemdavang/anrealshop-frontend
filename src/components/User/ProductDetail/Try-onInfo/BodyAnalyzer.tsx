import { Box, Text } from '@mantine/core';
import { PoseLandmarker } from '@mediapipe/tasks-vision';
import { useCallback, useEffect, useRef, useState } from 'react';
import useMediaPipe from '../../../../hooks/useMediaPipe';

interface BodyAnalyzerProps {
	videoRef: React.RefObject<HTMLVideoElement | null>;
	isActive: boolean;
	isVideoReady: boolean;
}

type PoseLandmarks = Array<{ visibility?: number }>;

const BodyAnalyzer = ({ videoRef, isActive, isVideoReady }: BodyAnalyzerProps) => {
	const [poseMessage, setPoseMessage] = useState<string>('');

	const poseRafRef = useRef<number | null>(null);

	const createPoseLandmarker = useCallback(
		(vision: Parameters<typeof PoseLandmarker.createFromOptions>[0]) =>
			PoseLandmarker.createFromOptions(vision, {
				baseOptions: {
					modelAssetPath:
						'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task'
				},
				runningMode: 'VIDEO',
				numPoses: 1
			}),
		[]
	);

	const { instance: poseLandmarker, ready: isPoseReady } = useMediaPipe<PoseLandmarker>({
		wasmUrl: 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.32/wasm',
		create: createPoseLandmarker,
		onError: (err) => console.log(err)
	});

	useEffect(() => {
		const landmarker = poseLandmarker;
		const videoEl = videoRef.current;

		if (!isActive || !isVideoReady || !isPoseReady || !landmarker || !videoEl) {
			if (poseRafRef.current) {
				cancelAnimationFrame(poseRafRef.current);
				poseRafRef.current = null;
			}
			setPoseMessage('');
			return;
		}

		const hasGoodVisibility = (val?: number) => typeof val === 'number' && val >= 0.5;

		const isUpperBodyVisible = (landmarks: PoseLandmarks) => {
			const leftShoulder = landmarks[11];
			const rightShoulder = landmarks[12];
			const leftHip = landmarks[23];
			const rightHip = landmarks[24];

			return (
				hasGoodVisibility(leftShoulder?.visibility) &&
				hasGoodVisibility(rightShoulder?.visibility) &&
				hasGoodVisibility(leftHip?.visibility) &&
				hasGoodVisibility(rightHip?.visibility)
			);
		};

		const isLowerBodyVisible = (landmarks: PoseLandmarks) => {
			const leftHip = landmarks[23];
			const rightHip = landmarks[24];
			const leftKnee = landmarks[25];
			const rightKnee = landmarks[26];

			return (
				hasGoodVisibility(leftHip?.visibility) &&
				hasGoodVisibility(rightHip?.visibility) &&
				(hasGoodVisibility(leftKnee?.visibility) || hasGoodVisibility(rightKnee?.visibility))
			);
		};

		const detectPose = () => {
			if (
				videoEl.readyState < HTMLMediaElement.HAVE_ENOUGH_DATA ||
				videoEl.videoWidth === 0 ||
				videoEl.videoHeight === 0
			) {
				poseRafRef.current = requestAnimationFrame(detectPose);
				return;
			}

			try {
				const now = performance.now();
				const result = landmarker.detectForVideo(videoEl, now);
				const landmarks = result.landmarks?.[0] as PoseLandmarks | undefined;

				if (landmarks) {
					const hasUpper = isUpperBodyVisible(landmarks);
					const hasLower = isLowerBodyVisible(landmarks);

					if (hasUpper || hasLower) {
						setPoseMessage('');
					} else {
						setPoseMessage('Khong nhan dien duoc than tren hoac than duoi. Vui long dieu chinh khung hinh.');
					}
				} else {
					setPoseMessage('Khong nhan dien duoc than tren hoac than duoi. Vui long dieu chinh khung hinh.');
				}

				poseRafRef.current = requestAnimationFrame(detectPose);
			} catch (err) {
				console.error('[BodyAnalyzer] detectForVideo failed:', err);
				setPoseMessage('Khong the phan tich khung hinh. Vui long thu lai.');
				if (poseRafRef.current) {
					cancelAnimationFrame(poseRafRef.current);
					poseRafRef.current = null;
				}
			}
		};

		poseRafRef.current = requestAnimationFrame(detectPose);

		return () => {
			if (poseRafRef.current) {
				cancelAnimationFrame(poseRafRef.current);
				poseRafRef.current = null;
			}
		};
	}, [isActive, isVideoReady, isPoseReady, videoRef, poseLandmarker]);

	if (!poseMessage || !isVideoReady) return null;

	return (
		<Box className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 p-4">
			<Text c="white" fw={600} className="text-center">
				{poseMessage}
			</Text>
		</Box>
	);
};

export default BodyAnalyzer;
