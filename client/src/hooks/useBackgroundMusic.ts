
import { useRef, useEffect } from 'react';

const backgroundMusic = 'https://res.cloudinary.com/dwmybitme/video/upload/v1755353394/WhatsApp_Audio_2025-08-15_at_12.09.54_AM_fn8je9.m4a';

export const useBackgroundMusic = (volume = 0.32) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    let isPlaying = false;
    let userInteracted = false;

    const setupBackgroundMusic = () => {
      if (!audioRef.current) return;

      const audio = audioRef.current;
      audio.loop = true;
      audio.preload = 'auto';
      audio.volume = volume;

      const playMusic = async () => {
        if (isPlaying || !audio) return;

        try {
          // Reset audio to beginning
          audio.currentTime = 0;
          
          // Try direct play first
          await audio.play();
          isPlaying = true;
          console.log('Background music started successfully');
          return true;
        } catch (error) {
          console.log('Direct play failed, setting up interaction listener');
          
          // Set up interaction listener for mobile/autoplay restrictions
          const playOnInteraction = async (event: Event) => {
            if (isPlaying) return;
            
            try {
              audio.currentTime = 0;
              await audio.play();
              isPlaying = true;
              userInteracted = true;
              console.log('Music started after user interaction');
              
              // Remove all interaction listeners after successful play
              removeInteractionListeners();
            } catch (err) {
              console.log('Failed to play music even after interaction:', err);
            }
          };

          const removeInteractionListeners = () => {
            document.removeEventListener('click', playOnInteraction);
            document.removeEventListener('touchstart', playOnInteraction);
            document.removeEventListener('touchend', playOnInteraction);
            document.removeEventListener('keydown', playOnInteraction);
            document.removeEventListener('scroll', playOnInteraction);
            window.removeEventListener('focus', playOnInteraction);
          };

          // Add comprehensive interaction listeners
          document.addEventListener('click', playOnInteraction, { passive: true });
          document.addEventListener('touchstart', playOnInteraction, { passive: true });
          document.addEventListener('touchend', playOnInteraction, { passive: true });
          document.addEventListener('keydown', playOnInteraction, { passive: true });
          document.addEventListener('scroll', playOnInteraction, { passive: true });
          window.addEventListener('focus', playOnInteraction, { passive: true });

          return false;
        }
      };

      // Handle visibility change
      const handleVisibilityChange = () => {
        if (!audio) return;

        if (document.visibilityState === 'visible') {
          if (!isPlaying && userInteracted) {
            playMusic();
          }
        } else if (document.visibilityState === 'hidden') {
          if (isPlaying) {
            audio.pause();
            isPlaying = false;
          }
        }
      };

      // Handle audio events
      const handleAudioPlay = () => {
        isPlaying = true;
      };

      const handleAudioPause = () => {
        isPlaying = false;
      };

      const handleAudioError = (e: Event) => {
        console.log('Audio error:', e);
        isPlaying = false;
      };

      // Add event listeners
      audio.addEventListener('play', handleAudioPlay);
      audio.addEventListener('pause', handleAudioPause);
      audio.addEventListener('error', handleAudioError);
      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Start music attempt
      playMusic();

      // Cleanup function
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        if (audio) {
          audio.removeEventListener('play', handleAudioPlay);
          audio.removeEventListener('pause', handleAudioPause);
          audio.removeEventListener('error', handleAudioError);
          audio.pause();
        }
      };
    };

    const cleanup = setupBackgroundMusic();

    return () => {
      if (cleanup) cleanup();
    };
  }, [volume]);

  return audioRef;
};
