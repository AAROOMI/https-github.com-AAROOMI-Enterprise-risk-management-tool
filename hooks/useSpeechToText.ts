
import { useState, useEffect, useRef, useCallback } from 'react';

// FIX: Add type definition for the Speech Recognition API to avoid TypeScript errors.
interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: any) => void;
  onend: () => void;
  onerror: (event: any) => void;
}

interface SpeechToTextOptions {
  onTranscript: (transcript: string) => void;
  onFinalTranscript: (transcript: string) => void;
}

const getSpeechRecognition = () => {
  if (typeof window !== 'undefined') {
    // FIX: Use `as any` to bypass TypeScript's lack of built-in types for these properties.
    return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  }
  return null;
};

export const useSpeechToText = ({ onTranscript, onFinalTranscript }: SpeechToTextOptions) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  // Use refs to hold the latest callback functions to avoid restarting recognition on every render
  const onTranscriptRef = useRef(onTranscript);
  const onFinalTranscriptRef = useRef(onFinalTranscript);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
    onFinalTranscriptRef.current = onFinalTranscript;
  }, [onTranscript, onFinalTranscript]);

  const isSupported = !!getSpeechRecognition();

  useEffect(() => {
    if (!isSupported) {
      console.warn('Speech recognition is not supported in this browser.');
      return;
    }

    const SpeechRecognition = getSpeechRecognition()!;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      
      // Use ref to call the latest callback
      if (interimTranscript) {
          onTranscriptRef.current(interimTranscript);
      }
      if (finalTranscript) {
        onFinalTranscriptRef.current(finalTranscript);
      }
    };

    recognition.onend = () => {
      // The component state will control restarting.
      // This handler is to ensure we update state if recognition stops on its own.
      setIsListening(false);
    };
    
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if(recognitionRef.current?.stop) {
            recognitionRef.current.stop();
        }
        setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isSupported]); // Removed dependencies on callbacks

  const toggleListening = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch(e) {
            console.error("Could not start speech recognition:", e);
        }
      }
    }
  }, [isListening]);

  return {
    isListening,
    toggleListening,
    isSupported,
  };
};
