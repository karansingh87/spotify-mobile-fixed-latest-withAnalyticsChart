'use client'

import { useState, useEffect, useRef } from 'react';

export function useAudioPlayer() {
  const [playing, setPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = (previewUrl: string) => {
    if (!previewUrl) return;
    
    if (playing === previewUrl) {
      audioRef.current?.pause();
      setPlaying(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(previewUrl);
      audioRef.current.play();
      setPlaying(previewUrl);

      audioRef.current.onended = () => {
        setPlaying(null);
      };
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return {
    playing,
    play
  };
}