// import { FilesetResolver } from '@mediapipe/tasks-vision';
// import { useEffect, useState } from 'react';

// type Closeable = { close?: () => void };

// interface UseMediaPipeOptions<T extends Closeable> {
// 	enabled?: boolean;
// 	wasmUrl: string;
// 	create: (vision: Awaited<ReturnType<typeof FilesetResolver.forVisionTasks>>) => Promise<T>;
// 	onError?: (error: unknown) => void;
// }

// const DEFAULT_ERROR_MESSAGE = 'MediaPipe load failed.';

// const useMediaPipe = <T extends Closeable>({
// 	enabled = true,
// 	wasmUrl,
// 	create,
// 	onError
// }: UseMediaPipeOptions<T>) => {
// 	const [instance, setInstance] = useState<T | null>(null);
// 	const [ready, setReady] = useState(false);
// 	const [error, setError] = useState<string>('');

// 	useEffect(() => {
// 		if (!enabled) {
// 			instance?.close?.();
// 			setInstance(null);
// 			setReady(false);
// 			setError('');
// 			return;
// 		}

// 		let cancelled = false;

// 		const init = async () => {
// 			try {
// 				const vision = await FilesetResolver.forVisionTasks(wasmUrl);
// 				const created = await create(vision);

// 				if (cancelled) {
// 					created?.close?.();
// 					return;
// 				}

// 				setInstance(created);
// 				setReady(true);
// 				setError('');
// 			} catch (err) {
// 				if (cancelled) return;
// 				setError(err instanceof Error ? err.message : DEFAULT_ERROR_MESSAGE);
// 				onError?.(err);
// 			}
// 		};

// 		init();

// 		return () => {
// 			cancelled = true;
// 			setReady(false);
// 			setInstance(prev => {
// 				prev?.close?.();
// 				return null;
// 			});
// 		};
// 	}, [enabled, wasmUrl, create, onError]);

// 	return { instance, ready, error };
// };

// export default useMediaPipe;
