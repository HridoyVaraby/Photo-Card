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
  date: '৩০ নভেম্বর, ২০২৫',
  settings: {
    width: 1200,
    height: 628,
    font: 'Inter',
    brandColor: '#8B1538',
    format: 'png',
    quality: 90,
    layout: 'durbin-news'
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

      // Render the card at full resolution (await the async render)
      await renderCard(canvas, state, 1);

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
    <div className="min-h-screen bg-gray-100 font-inter">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">
                N
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 leading-tight">
                  News Card Generator
                </h1>
                <p className="text-xs text-gray-500 font-medium">
                  Professional Social Media Assets
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200 ${isReadyToExport
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                }`}>
                {isReadyToExport ? '✓ Ready to Export' : '⚠ Missing Content'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Controls */}
          <div className="lg:col-span-5 space-y-6">
            <Toolbar
              state={state}
              onStateChange={handleStateChange}
            />
          </div>

          {/* Right Column - Preview */}
          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-24">
              <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-700">Live Preview</h3>
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
                    {state.settings.width} x {state.settings.height}
                  </span>
                </div>
                <div className="p-6 bg-gray-100 flex items-center justify-center min-h-[400px]">
                  <CanvasPreview
                    state={state}
                    onExport={handleExport}
                    isLoading={isExporting}
                  />
                </div>
              </div>

              {/* Quick Tips */}
              <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-sm font-semibold text-blue-900 mb-3">Pro Tips</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    Use high-resolution images (at least 1200px wide) for best results.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    Keep headlines concise (under 3 lines) for maximum readability.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    Match the brand color to your organization's primary color.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} News Photo Card Generator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;