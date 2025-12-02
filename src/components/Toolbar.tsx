import React from 'react';
import { CardState, ResolutionOption } from '../types';
import { UploadField } from './UploadField';
import { ResolutionSelector } from './ResolutionSelector';
import { FontSelector } from './FontSelector';
import { ColorPicker } from './ColorPicker';
import { LayoutSelector } from './LayoutSelector';

interface ToolbarProps {
  state: CardState;
  onStateChange: (updates: Partial<CardState>) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  state,
  onStateChange
}) => {
  const handleMainImageSelect = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onStateChange({
          mainImage: e.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    } else {
      onStateChange({ mainImage: null });
    }
  };

  const handleLogoSelect = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onStateChange({
          logo: e.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    } else {
      onStateChange({ logo: null });
    }
  };

  const handleHeadlineChange = (headline: string) => {
    onStateChange({ headline });
  };

  const handleDateChange = (date: string) => {
    onStateChange({ date });
  };

  const handleBackgroundImageSelect = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onStateChange({
          backgroundImage: e.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    } else {
      onStateChange({ backgroundImage: null });
    }
  };

  const handleResolutionChange = (resolution: ResolutionOption) => {
    onStateChange({
      settings: {
        ...state.settings,
        width: resolution.width,
        height: resolution.height
      }
    });
  };

  const handleFontChange = (font: string) => {
    onStateChange({
      settings: {
        ...state.settings,
        font
      }
    });
  };

  const handleColorChange = (brandColor: string) => {
    onStateChange({
      settings: {
        ...state.settings,
        brandColor
      }
    });
  };

  const handleLayoutChange = (layout: 'default' | 'facebook-modern' | 'facebook-minimal' | 'durbin-news') => {
    onStateChange({
      settings: {
        ...state.settings,
        layout
      }
    });
  };

  const handleFormatChange = (format: 'png' | 'jpeg') => {
    onStateChange({
      settings: {
        ...state.settings,
        format,
        quality: format === 'jpeg' ? 90 : undefined
      }
    });
  };

  const handleQualityChange = (quality: number) => {
    onStateChange({
      settings: {
        ...state.settings,
        quality
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Basic Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">1</span>
            Content
          </h2>
        </div>

        <div className="p-6 space-y-6">
          <UploadField
            label="Main Image"
            value={state.mainImage}
            onFileSelect={handleMainImageSelect}
            required
            placeholder="Upload your news photo"
          />

          <UploadField
            label="Company Logo (Optional)"
            value={state.logo}
            onFileSelect={handleLogoSelect}
            placeholder="Add your logo to the top-right corner"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Headline
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              value={state.headline}
              onChange={(e) => handleHeadlineChange(e.target.value)}
              placeholder="Enter your headline text..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white text-gray-900 placeholder-gray-400 transition-shadow"
              rows={3}
              required
            />
            <p className="mt-2 text-xs text-gray-500 flex justify-between">
              <span>Maximum 3 lines. Supports English and Bengali text.</span>
              <span className={state.headline.length > 100 ? 'text-orange-500' : 'text-gray-400'}>
                {state.headline.length} chars
              </span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date (Bengali)
            </label>
            <input
              type="text"
              value={state.date || ''}
              onChange={(e) => handleDateChange(e.target.value)}
              placeholder="৩০ নভেম্বর, ২০২৫"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 transition-shadow"
            />
            <p className="mt-2 text-xs text-gray-500">
              Enter date in Bengali format for news layout.
            </p>
          </div>

          <UploadField
            label="Background Image (Durbin News Only)"
            value={state.backgroundImage || null}
            onFileSelect={handleBackgroundImageSelect}
            placeholder="Upload a custom background for Durbin News layout"
          />
        </div>
      </div>

      {/* Design Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="bg-purple-100 text-purple-600 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">2</span>
            Design Settings
          </h2>
        </div>

        <div className="p-6 space-y-6">
          <ResolutionSelector
            value={{
              name: 'Custom',
              width: state.settings.width,
              height: state.settings.height
            }}
            onChange={handleResolutionChange}
          />

          <FontSelector
            value={state.settings.font}
            onChange={handleFontChange}
          />

          <LayoutSelector
            value={(state.settings.layout || 'default') as 'default' | 'facebook-modern' | 'facebook-minimal' | 'durbin-news'}
            onChange={handleLayoutChange}
          />

          <ColorPicker
            value={state.settings.brandColor}
            onChange={handleColorChange}
          />

          <div className="pt-4 border-t border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Export Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleFormatChange('png')}
                className={`
                  px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center
                  ${state.settings.format === 'png'
                    ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-600 ring-offset-1'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                PNG
              </button>
              <button
                type="button"
                onClick={() => handleFormatChange('jpeg')}
                className={`
                  px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center
                  ${state.settings.format === 'jpeg'
                    ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-600 ring-offset-1'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                JPEG
              </button>
            </div>
          </div>

          {state.settings.format === 'jpeg' && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">
                  JPEG Quality
                </label>
                <span className="text-sm font-bold text-blue-600">{state.settings.quality || 90}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={state.settings.quality || 90}
                onChange={(e) => handleQualityChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Smaller File</span>
                <span>Better Quality</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};