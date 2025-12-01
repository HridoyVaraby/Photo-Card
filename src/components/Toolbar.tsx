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
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Content</h2>

        <div className="space-y-6">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Maximum 3 lines. Supports English and Bengali text.
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter date in Bengali format for news layout.
            </p>
          </div>
        </div>
      </div>

      {/* Design Settings */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Design Settings</h2>

        <div className="space-y-6">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleFormatChange('png')}
                className={`
                  px-4 py-2 rounded-md font-medium transition-colors
                  ${state.settings.format === 'png'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }
                `}
              >
                PNG
              </button>
              <button
                type="button"
                onClick={() => handleFormatChange('jpeg')}
                className={`
                  px-4 py-2 rounded-md font-medium transition-colors
                  ${state.settings.format === 'jpeg'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }
                `}
              >
                JPEG
              </button>
            </div>
          </div>

          {state.settings.format === 'jpeg' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                JPEG Quality: {state.settings.quality || 90}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={state.settings.quality || 90}
                onChange={(e) => handleQualityChange(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Low (10%)</span>
                <span>High (100%)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};