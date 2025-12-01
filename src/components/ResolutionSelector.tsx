import React from 'react';
import { ResolutionOption } from '../types';

interface ResolutionSelectorProps {
  value: ResolutionOption;
  onChange: (resolution: ResolutionOption) => void;
}

const RESOLUTIONS: ResolutionOption[] = [
  { name: 'Twitter Card', width: 1200, height: 628 },
  { name: 'Instagram Square', width: 1080, height: 1080 },
  { name: 'Instagram Story', width: 1080, height: 1920 },
];

export const ResolutionSelector: React.FC<ResolutionSelectorProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Resolution
      </label>

      <div className="grid grid-cols-1 gap-2">
        {RESOLUTIONS.map((resolution) => (
          <button
            key={`${resolution.width}x${resolution.height}`}
            type="button"
            onClick={() => onChange(resolution)}
            className={`
              p-3 text-left rounded-lg border-2 transition-all
              ${value.width === resolution.width && value.height === resolution.height
                ? 'border-blue-500 bg-blue-50 text-blue-900'
                : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{resolution.name}</div>
                <div className="text-sm text-gray-500">
                  {resolution.width} × {resolution.height}
                </div>
              </div>

              {value.width === resolution.width && value.height === resolution.height && (
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
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
        Choose the dimensions for your social media card
      </div>
    </div>
  );
};