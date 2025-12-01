import { useState, useCallback } from 'react';
import { CardState } from './types';
import { Toolbar } from './components/Toolbar';
import { CanvasPreview } from './components/CanvasPreview';
import { renderCard } from './utils/renderer';
import { exportAndDownload } from './utils/exportUtils';

const initialState: CardState = {
  mainImage: null,
  logo: null,
  headline: '',
  settings: {
    width: 1200,
    height: 628,
    font: 'Inter',
    brandColor: '#1e40af',
    format: 'png',
    quality: 90
  }
};

function App() {
  const [state, setState] = useState<CardState>(initialState);
  const [isExporting, setIsExporting] = useState(false);

  const handleStateChange = useCallback((updates: Partial<CardState>) => {
    setState(prevState => ({
      ...prevState,
      ...updates
    }));
  }, []);

  const handleExport = useCallback(async () => {
    if (!state.mainImage || !state.headline.trim()) {
      alert('Please add an image and headline before exporting.');
      return;
    }

    setIsExporting(true);

    try {
      // Create a temporary canvas for export
      const canvas = document.createElement('canvas');
      canvas.width = state.settings.width;
      canvas.height = state.settings.height;

      // Use imported renderCard function

      // Render the card at full resolution
      renderCard(canvas, state, 1);

      // Export to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          `image/${state.settings.format}`,
          state.settings.format === 'jpeg' ? (state.settings.quality || 90) / 100 : undefined
        );
      });

      // Download the file
      await exportAndDownload(blob, state.headline, state.settings.format);

    } catch (error) {
      console.error('Export failed:', error);
      alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExporting(false);
    }
  }, [state]);

  const isReadyToExport = state.mainImage && state.headline.trim() !== '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                News Photo Card Generator
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Create branded social media cards with your news photos
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                isReadyToExport
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {isReadyToExport ? 'Ready to Export' : 'Missing Content'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Controls */}
          <div className="space-y-8">
            <Toolbar
              state={state}
              onStateChange={handleStateChange}
            />
          </div>

          {/* Right Column - Preview */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <CanvasPreview
              state={state}
              onExport={handleExport}
              isLoading={isExporting}
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">How to Use</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                  1
                </div>
                <h3 className="font-medium text-gray-900">Upload Content</h3>
              </div>
              <p className="text-sm text-gray-600 ml-10">
                Add your main image and optional company logo
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                  2
                </div>
                <h3 className="font-medium text-gray-900">Customize Design</h3>
              </div>
              <p className="text-sm text-gray-600 ml-10">
                Write your headline and choose colors, fonts, and resolution
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                  3
                </div>
                <h3 className="font-medium text-gray-900">Export & Share</h3>
              </div>
              <p className="text-sm text-gray-600 ml-10">
                Download your card as PNG or JPEG and share on social media
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            News Photo Card Generator - Built with React, TypeScript, and Canvas API
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;