import { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import {
  HandLandmarker,
  FilesetResolver,
  type NormalizedLandmark,
} from '@mediapipe/tasks-vision';
import showSuccessNotification from '../Toast/NotificationSuccess';

// ── Constants ──────────────────────────────────────────────
const PINCH_THRESHOLD  = 0.1;
const SCROLL_SPEED     = 12;
const IDLE_TIMEOUT     = 60_000;
const FINGER_THRESHOLD = 0.01;
const CURSOR_LERP      = 0.5;

const WASM_URL =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm';
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task';

const WEBCAM_CONSTRAINTS = { width: 320, height: 240, facingMode: 'user' } as const;

const FINGER_TIPS = [8, 12, 16, 20] as const;
const FINGER_PIPS = [6, 10, 14, 18] as const;

// ── Helpers ────────────────────────────────────────────────
const isOpenHand = (lm: NormalizedLandmark[]): boolean => {
  const thumbTip = lm[4];
  const thumbIp  = lm[3];
  const wrist    = lm[0];

  const isRightHand = lm[5].x < wrist.x;
  const thumbOpen = isRightHand
    ? thumbTip.x < thumbIp.x
    : thumbTip.x > thumbIp.x;

  const fingersOpen = FINGER_TIPS.every(
    (tipIdx, i) => lm[tipIdx].y < lm[FINGER_PIPS[i]].y - FINGER_THRESHOLD,
  );

  return thumbOpen && fingersOpen;
};

const isPinching = (hand: NormalizedLandmark[]): boolean => {
  const thumb = hand[4];
  const index = hand[8];
  return Math.hypot(thumb.x - index.x, thumb.y - index.y) < PINCH_THRESHOLD;
};

const isThumbMiddle = (hand: NormalizedLandmark[]): boolean => {
  const thumb  = hand[4];
  const middle = hand[12];
  return Math.hypot(thumb.x - middle.x, thumb.y - middle.y) < PINCH_THRESHOLD;
};

const isClosedFist = (lm: NormalizedLandmark[]): boolean => {
  const thumbTip = lm[4];
  const thumbIp  = lm[3];
  const wrist    = lm[0];

  const isRightHand = lm[5].x < wrist.x;
  const thumbClosed = isRightHand
    ? thumbTip.x > thumbIp.x
    : thumbTip.x < thumbIp.x;

  const fingersClosed = FINGER_TIPS.every(
    (tipIdx, i) => lm[tipIdx].y > lm[FINGER_PIPS[i]].y + FINGER_THRESHOLD,
  );

  return thumbClosed && fingersClosed;
};

const FIST_HOLD_DURATION = 2000; // ms giữ nắm tay để tắt

// ── Component ──────────────────────────────────────────────
interface HandScrollProps {
  enabled?: boolean;
  onDisable?: () => void;
}

const HandScroll = ({ enabled = false, onDisable }: HandScrollProps) => {
  const webcamRef       = useRef<Webcam>(null);
  const landmarkerRef   = useRef<HandLandmarker | null>(null);
  const isTrackingRef   = useRef(false);
  const lastSeenRef     = useRef(Date.now());
  const rafRef          = useRef<number>(0);
  const prevPinchYRef   = useRef<number | null>(null);
  const cursorPos       = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const cursorElRef     = useRef<HTMLDivElement>(null);
  const ringElRef       = useRef<HTMLDivElement>(null);
  const labelElRef      = useRef<HTMLSpanElement>(null);
  const wasClickingRef  = useRef(false);
  const fistStartRef    = useRef<number | null>(null);

  const [ready, setReady]           = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [statusMsg, setStatusMsg]   = useState('Đang tải model MediaPipe…');
  const [minimized, setMinimized]   = useState(false);

  useEffect(() => { isTrackingRef.current = isTracking; }, [isTracking]);

  // ── DOM cursor helpers (no React re-render) ──────────────
  const showCursor = (x: number, y: number, pinch: boolean, clicking: boolean) => {
    const el = cursorElRef.current;
    if (!el) return;
    el.style.transform = `translate(${x}px, ${y}px)`;
    el.style.display = '';

    if (ringElRef.current) {
      ringElRef.current.className = clicking
        ? 'absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-lg w-4 h-4 border-green-400 bg-green-400/60'
        : pinch
          ? 'absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-lg w-5 h-5 border-white bg-primary/40'
          : 'absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-lg w-7 h-7 border-white bg-primary/40';
    }
    if (labelElRef.current) {
      labelElRef.current.style.display = pinch ? '' : 'none';
    }
  };

  const hideCursor = () => {
    if (cursorElRef.current) cursorElRef.current.style.display = 'none';
  };

  const lerp = (prev: number, target: number) =>
    prev + (target - prev) * CURSOR_LERP;

  // ── Load model ───────────────────────────────────────────
  useEffect(() => {    if (!enabled) return;    let cancelled = false;

    const init = async () => {
      try {
        const fileset = await FilesetResolver.forVisionTasks(WASM_URL);
        const lm = await HandLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: MODEL_URL },
          runningMode: 'VIDEO',
          numHands: 1,
        });

        if (cancelled) { lm.close(); return; }

        landmarkerRef.current = lm;
        setReady(true);
        setStatusMsg('Xòe 5 ngón để kích hoạt.');
      } catch (err) {
        console.error('[HandScroll] load model failed:', err);
        setStatusMsg('Lỗi tải model.');
      }
    };

    init();
    return () => {
      cancelled = true;
      landmarkerRef.current?.close();
      landmarkerRef.current = null;
    };
  }, [enabled]);

  // Reset khi tắt
  useEffect(() => {
    if (!enabled) {
      isTrackingRef.current = false;
      setIsTracking(false);
      hideCursor();
      prevPinchYRef.current = null;
      setReady(false);
      setStatusMsg('Đang tải model MediaPipe…');
    }
  }, [enabled]);

  // ── Detection loop ───────────────────────────────────────
  useEffect(() => {
    if (!ready || !enabled) return;

    const detect = () => {
      const video = webcamRef.current?.video;
      const lm    = landmarkerRef.current;

      if (video && lm && video.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
        const { landmarks } = lm.detectForVideo(video, performance.now());

        if (landmarks?.length) {
          lastSeenRef.current = Date.now();
          const hand = landmarks[0];

          // Kích hoạt tracking khi bàn tay mở
          if (!isTrackingRef.current && isOpenHand(hand)) {
            isTrackingRef.current = true;
            setIsTracking(true);
            setStatusMsg('Di ngón trỏ = di chuột. Pinch + kéo = scroll.');
            showSuccessNotification('Trải nghiệm tích cực', 'Đã bật điều khiển tay!');
          }

          // Nắm tay giữ 2s → tắt điều khiển
          const fistNow = isClosedFist(hand);
          if (fistNow) {
            if (fistStartRef.current === null) {
              fistStartRef.current = Date.now();
            } else if (Date.now() - fistStartRef.current >= FIST_HOLD_DURATION) {
              console.log('[HandScroll] Nắm tay 2s detected — tắt điều khiển');
              fistStartRef.current = null;
              onDisable?.();
            }
          } else {
            fistStartRef.current = null;
          }

          if (isTrackingRef.current) {
            const indexTip = hand[8];
            const pinching = isPinching(hand);
            const clicking = isThumbMiddle(hand);

            // Cursor luôn theo ngón trỏ (mirror X)
            const targetX = (1 - indexTip.x) * window.innerWidth;
            const targetY = indexTip.y * window.innerHeight;

            cursorPos.current = {
              x: lerp(cursorPos.current.x, targetX),
              y: lerp(cursorPos.current.y, targetY),
            };
            showCursor(cursorPos.current.x, cursorPos.current.y, pinching, clicking);

            // Thumb + middle = click (trigger ngay khi chạm)
            if (clicking && !wasClickingRef.current) {
              const el = document.elementFromPoint(cursorPos.current.x, cursorPos.current.y);
              if (el) {
                el.dispatchEvent(new MouseEvent('click', {
                  bubbles: true,
                  cancelable: true,
                  clientX: cursorPos.current.x,
                  clientY: cursorPos.current.y,
                }));
              }
            }
            wasClickingRef.current = clicking;

            // Pinch + di chuyển = scroll
            if (pinching) {
              const curY = indexTip.y;
              if (prevPinchYRef.current !== null) {
                const dy = curY - prevPinchYRef.current;
                const scrollAmount = -dy * SCROLL_SPEED * window.innerHeight;
                if (Math.abs(scrollAmount) > 0.5) {
                  window.scrollBy({ top: scrollAmount, behavior: 'auto' });
                }
              }
              prevPinchYRef.current = curY;
            } else {
              prevPinchYRef.current = null;
            }
          }
        } else if (
          isTrackingRef.current &&
          Date.now() - lastSeenRef.current > IDLE_TIMEOUT
        ) {
          isTrackingRef.current = false;
          setIsTracking(false);
          hideCursor();
          prevPinchYRef.current = null;
          setStatusMsg('Idle quá lâu — xòe tay để tiếp tục.');
        }
      }

      rafRef.current = requestAnimationFrame(detect);
    };

    rafRef.current = requestAnimationFrame(detect);
    return () => cancelAnimationFrame(rafRef.current);
  }, [ready, enabled]);

  if (!enabled) return null;

  // ── Render ───────────────────────────────────────────────
  return (
    <>
      {/* Virtual cursor — positioned via DOM ref, no re-render */}
      <div
        ref={cursorElRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ display: 'none', willChange: 'transform' }}
      >
        <div
          ref={ringElRef}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-lg w-7 h-7 border-white bg-primary/40"
        />
        <div className="absolute w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
      </div>

      <div
        className="fixed bottom-4 left-4 z-50 flex flex-col items-start gap-2"
        style={{ pointerEvents: 'auto' }}
      >
        

        {/* Webcam preview */}
        {!minimized && (
          <div className="relative overflow-hidden rounded-xl border-2 border-gray-300 shadow-lg bg-black">
            <Webcam
              ref={webcamRef}
              audio={false}
              videoConstraints={WEBCAM_CONSTRAINTS}
              className="block"
              style={{ width: 240, height: 180 }}
              mirrored
            />
            <p className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1 text-center text-[10px] text-white leading-tight">
              {statusMsg}
            </p>
          </div>
        )}

        {minimized && (
          <Webcam
            ref={webcamRef}
            audio={false}
            videoConstraints={WEBCAM_CONSTRAINTS}
            className="sr-only"
            mirrored
          />
        )}

        {/* Control buttons */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setMinimized((v) => !v)}
            className="rounded-lg bg-gray-700 px-2 py-1 text-xs text-white hover:bg-gray-600 transition-colors"
          >
            {minimized ? '📷 Mở cam' : '🔽 Thu nhỏ'}
          </button>
        </div>
      </div>
    </>
  );
};

export default HandScroll;