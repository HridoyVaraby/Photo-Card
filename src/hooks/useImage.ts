import { useState, useCallback } from 'react';
import { ImageFile } from '../types';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_DIMENSION = 2048; // Downscale if larger

export const useImage = () => {
  const [image, setImage] = useState<ImageFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return 'Please upload an image file';
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return 'Image size must be less than 10MB';
    }

    return null;
  };

  const loadImage = useCallback((file: File): Promise<ImageFile> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
          try {
            // Create canvas for downscaling if needed
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
              reject(new Error('Could not create canvas context'));
              return;
            }

            let { width, height } = img;

            // Downscale if image is too large
            if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
              const scale = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
              width = Math.floor(width * scale);
              height = Math.floor(height * scale);
            }

            canvas.width = width;
            canvas.height = height;

            // Draw and get optimized image
            ctx.drawImage(img, 0, 0, width, height);

            const optimizedUrl = canvas.toDataURL('image/jpeg', 0.9);

            resolve({
              file,
              url: optimizedUrl,
              width,
              height
            });
          } catch (err) {
            reject(new Error('Failed to process image'));
          }
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }, []);

  const handleFileSelect = useCallback(async (file: File | null) => {
    if (!file) {
      setImage(null);
      setError(null);
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const loadedImage = await loadImage(file);
      setImage(loadedImage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load image');
      setImage(null);
    } finally {
      setIsLoading(false);
    }
  }, [loadImage]);

  const reset = useCallback(() => {
    setImage(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    image,
    isLoading,
    error,
    handleFileSelect,
    reset
  };
};