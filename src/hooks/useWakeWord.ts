import { usePorcupine } from '@picovoice/porcupine-react';
  import { useEffect, useState, useCallback } from 'react';
  import { PORCUPINE_ACCESS_KEY } from '../constant';

  // Interfaces to avoid "Unexpected any" errors
  interface SpeechRecognitionEvent extends Event {
    results: {
      [index: number]: {
        [index: number]: {
          transcript: string;
        };
      };
    };
  }

  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message?: string;
  }

  interface ISpeechRecognition extends EventTarget {
    lang: string;
    continuous?: boolean;
    interimResults?: boolean;
    start: () => void;
    stop: () => void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onend: ((event: Event) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  }

  interface WindowWithSpeech extends Window {
    SpeechRecognition?: new () => ISpeechRecognition;
    webkitSpeechRecognition?: new () => ISpeechRecognition;
  }

  const ACCESS_KEY = PORCUPINE_ACCESS_KEY;

  export const useWakeWord = () => {
    const [isWakeWordDetected, setIsWakeWordDetected] = useState<boolean>(false);
    const [detectedLabel, setDetectedLabel] = useState<string | null>(null);
    const [isRecognizing, setIsRecognizing] = useState<boolean>(false);

    const {
      keywordDetection,
      isLoaded,
      isListening,
      error,
      init,
      start,
      stop,
      release,
    } = usePorcupine();

    const initWakeWord = useCallback(async () => {
      if (!ACCESS_KEY) {
        console.warn('Picovoice AccessKey is missing in environment variables (VITE_PICOVOICE_ACCESS_KEY).');
        return;
      }

      try {
        await init(
          ACCESS_KEY,
          { 
            publicPath: '/voice/hey-Jerry_en_wasm_v4_0_0.ppn', 
            label: 'hey Jerry' 
          },
          { 
            publicPath: '/voice/porcupine_params.pv'
          }
        );
      } catch (err) {
        console.error('Failed to initialize wake word engine:', err);
      }
    }, [init]);

    useEffect(() => {
      if (keywordDetection !== null) {
        setIsWakeWordDetected(true);
        setDetectedLabel(keywordDetection.label);
        setIsRecognizing(false);

        // KÍCH HOẠT NHẬN DIỆN CÂU LỆNH TIẾNG VIỆT NGAY LẬP TỨC
        handleVietnameseCommand();
      }
    }, [keywordDetection]);

    const handleVietnameseCommand = () => {
      const win = window as unknown as WindowWithSpeech;
      const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        console.error("Trình duyệt không hỗ trợ nhận diện giọng nói.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'vi-VN';
      
      setIsRecognizing(true);
      recognition.start();

      recognition.onresult = async (event: SpeechRecognitionEvent) => {
        const command = event.results[0][0].transcript;
        await sendToBackend(command);
      };

      recognition.onend = () => {
        setIsRecognizing(false);
        
        setTimeout(() => {
          setIsWakeWordDetected(false);
          setDetectedLabel(null);
        }, 3000);
      };

      recognition.onerror = () => {
        setIsRecognizing(false);
        
        // Đóng modal ngay nếu có lỗi
        setTimeout(() => {
          setIsWakeWordDetected(false);
          setDetectedLabel(null);
        }, 1000);
      };
    };

    const sendToBackend = async (text: string) => {
      // Dispatch custom event so ChatBtn/ChatboxPane/ChatAI can react
      window.dispatchEvent(new CustomEvent('voice-command', { detail: { text } }));
    };

    useEffect(() => {
      return () => {
        release();
      };
    }, [release]);

    return {
      isWakeWordDetected,
      detectedLabel,
      isRecognizing,
      isLoaded,
      isListening,
      error,
      initWakeWord,
      startListening: start,
      stopListening: stop,
    };
  };
