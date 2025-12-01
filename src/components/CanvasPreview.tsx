import React from 'react';
import { useCanvasRenderer } from '../hooks/useCanvasRenderer';
import { CardState } from '../types';

interface CanvasPreviewProps {
  state: CardState;
  onExport?: () => void;
  isLoading?: boolean;
}

export const CanvasPreview: React.FC<CanvasPreviewProps> = ({
  state,
  onExport,
  isLoading = false
}) => {
  const { canvasRef } = useCanvasRenderer(state);

  const isReadyToExport = state.mainImage && state.headline.trim() !== '';

  return (
    <div className="w-full space-y-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>

        <div className="flex justify-center">
          <div className="relative inline-block">
            <canvas
              ref={canvasRef}
              className="border border-gray-300 rounded shadow-sm max-w-full h-auto"
              style={{ maxHeight: '400px' }}
            />

            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Generating...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          {state.settings.width} × {state.settings.height} pixels
        </div>
      </div>

      {onExport && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Export</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Format:</span>
              <span className="text-sm text-gray-600 uppercase">{state.settings.format}</span>
            </div>

            {state.settings.format === 'jpeg' && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Quality:</span>
                <span className="text-sm text-gray-600">{state.settings.quality || 90}%</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Font:</span>
              <span className="text-sm text-gray-600">{state.settings.font}</span>
            </div>

            <button
              onClick={onExport}
              disabled={!isReadyToExport || isLoading}
              className={`
                w-full px-4 py-2 rounded-md font-medium transition-colors
                ${isReadyToExport && !isLoading
                  ? 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {isLoading ? 'Exporting...' : 'Download Image'}
            </button>

            {!isReadyToExport && (
              <div className="text-sm text-gray-500 text-center">
                {state.mainImage ? 'Please add a headline' : 'Please upload an image and add a headline'} to enable export
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};