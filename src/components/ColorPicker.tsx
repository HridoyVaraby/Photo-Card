import React, { useState } from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const PRESET_COLORS = [
  '#1e40af', // Blue
  '#dc2626', // Red
  '#059669', // Green
  '#7c3aed', // Purple
  '#ea580c', // Orange
  '#0891b2', // Cyan
  '#be123c', // Pink
  '#4338ca', // Indigo
  '#15803d', // Dark Green
  '#713f12', // Brown
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange
}) => {
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleColorChange = (color: string) => {
    onChange(color);
    setShowCustomInput(false);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
      onChange(color);
    }
  };

  const isValidColor = (color: string) => {
    return /^#[0-9A-Fa-f]{6}$/.test(color);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Brand Color
      </label>

      <div className="space-y-3">
        {/* Color Preview */}
        <div className="flex items-center space-x-3">
          <div
            className="w-16 h-16 rounded-lg border-2 border-gray-300 shadow-sm"
            style={{ backgroundColor: value }}
          />
          <div>
            <div className="text-sm font-medium text-gray-900">
              {value.toUpperCase()}
            </div>
            <div className="text-xs text-gray-500">
              Headline bar background color
            </div>
          </div>
        </div>

        {/* Preset Colors */}
        <div className="grid grid-cols-5 gap-2">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handleColorChange(color)}
              className={`
                w-full h-10 rounded-md border-2 transition-all
                ${value === color
                  ? 'border-gray-800 scale-110 shadow-lg'
                  : 'border-gray-300 hover:border-gray-400 hover:scale-105'
                }
              `}
              style={{ backgroundColor: color }}
              title={color.toUpperCase()}
            />
          ))}
        </div>

        {/* Custom Color Input */}
        <div>
          {!showCustomInput ? (
            <button
              type="button"
              onClick={() => setShowCustomInput(true)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              + Custom Color
            </button>
          ) : (
            <div className="flex space-x-2">
              <input
                type="text"
                value={value}
                onChange={handleCustomColorChange}
                placeholder="#000000"
                className={`
                  flex-1 px-3 py-2 text-sm border rounded-md
                  ${isValidColor(value)
                    ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    : 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  }
                  focus:outline-none focus:ring-1
                `}
              />
              <input
                type="color"
                value={value}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-10 h-10 border border-gray-300 rounded-md cursor-pointer"
              />
              <button
                type="button"
                onClick={() => setShowCustomInput(false)}
                className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {!isValidColor(value) && (
          <div className="text-sm text-red-600">
            Please enter a valid hex color code (e.g., #1e40af)
          </div>
        )}
      </div>
    </div>
  );
};