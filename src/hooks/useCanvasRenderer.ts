import { useRef, useEffect, useCallback } from 'react';
import { renderCard } from '../utils/renderer';
import { CardState } from '../types';

export const useCanvasRenderer = (state: CardState) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTimeoutRef = useRef<number>();

  const render = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const { width, height } = state.settings;

    // Calculate preview scale for reasonable display size
    const maxDisplayWidth = 600;
    const maxDisplayHeight = 400;
    const scale = Math.min(
      1,
      maxDisplayWidth / width,
      maxDisplayHeight / height
    );

    try {
      renderCard(canvas, state, scale);
    } catch (error) {
      console.error('Canvas rendering error:', error);
    }
  }, [state]);

  // Debounced render for performance
  const debouncedRender = useCallback(() => {
    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
    }

    renderTimeoutRef.current = setTimeout(() => {
      render();
    }, 100);
  }, [render]);

  useEffect(() => {
    debouncedRender();

    return () => {
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
    };
  }, [debouncedRender]);

  const exportCanvas = useCallback(async (format: 'png' | 'jpeg', quality?: number): Promise<Blob> => {
    if (!canvasRef.current) {
      throw new Error('Canvas not available for export');
    }

    // Create a temporary canvas for export at full resolution
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = state.settings.width;
    exportCanvas.height = state.settings.height;

    try {
      renderCard(exportCanvas, state, 1);

      return new Promise((resolve, reject) => {
        exportCanvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to export canvas'));
            }
          },
          `image/${format}`,
          format === 'jpeg' ? (quality || 0.9) : undefined
        );
      });
    } catch (error) {
      throw new Error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [state]);

  return {
    canvasRef,
    render,
    exportCanvas
  };
};