import React from 'react';
import { useCanvasRenderer } from '../hooks/useCanvasRenderer';
import { CardState } from '../types';
import { Loader2 } from 'lucide-react';

interface CanvasPreviewProps {
  state: CardState;
  onExport?: () => void;
  isLoading?: boolean;
}

export const CanvasPreview: React.FC<CanvasPreviewProps> = ({
  state,
  isLoading = false
}) => {
  const { canvasRef } = useCanvasRenderer(state);

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <div className="relative shadow-2xl rounded-sm overflow-hidden bg-white ring-1 ring-black/10">
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-[70vh] w-auto h-auto object-contain"
          style={{
            // Ensure canvas scales nicely
            aspectRatio: `${state.settings.width} / ${state.settings.height}`
          }}
        />

        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-10 h-10 animate-spin text-accent" />
              <p className="text-sm font-medium text-muted-foreground animate-pulse">Rendering high-res output...</p>
            </div>
          </div>
        )}
      </div>

      {/* Zoom/Pan controls could go here later */}
    </div>
  );
};