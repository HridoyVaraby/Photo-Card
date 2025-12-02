import React from 'react';
import { FontOption } from '../types';

interface FontSelectorProps {
  value: string;
  onChange: (font: string) => void;
}

const FONTS: FontOption[] = [
  { name: 'Inter', value: 'Inter', family: 'Inter, system-ui, sans-serif' },
  { name: 'Montserrat', value: 'Montserrat', family: 'Montserrat, sans-serif' },
  { name: 'Noto Sans Bengali', value: 'Noto Sans Bengali', family: 'Noto Sans Bengali, sans-serif' },
  { name: 'Hind Siliguri', value: 'Hind Siliguri', family: 'Hind Siliguri, sans-serif' },
  { name: 'Tiro Bangla', value: 'Tiro Bangla', family: 'Tiro Bangla, serif' },
];

export const FontSelector: React.FC<FontSelectorProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Font
      </label>

      <div className="grid grid-cols-1 gap-2">
        {FONTS.map((font) => (
          <button
            key={font.value}
            type="button"
            onClick={() => onChange(font.value)}
            className={`
              p-3 text-left rounded-lg border-2 transition-all
              ${value === font.value
                ? 'border-blue-500 bg-blue-50 text-blue-900'
                : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div
                  className="font-medium text-lg"
                  style={{ fontFamily: font.family }}
                >
                  {font.name}
                </div>
                <div className="text-sm text-gray-500">
                  Sample Text বাংলা অক্ষর
                </div>
              </div>

              {value === font.value && (
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-2 text-xs text-gray-500">
        Choose font that supports both English and Bengali text
      </div>
    </div>
  );
};