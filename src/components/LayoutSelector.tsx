import React from 'react';

interface LayoutSelectorProps {
  value: 'default' | 'facebook-modern' | 'facebook-minimal' | 'durbin-news';
  onChange: (layout: 'default' | 'facebook-modern' | 'facebook-minimal' | 'durbin-news') => void;
}

const LAYOUTS = [
  {
    name: 'Default',
    value: 'default' as const,
    description: 'Classic layout with logo top-right'
  },
  {
    name: 'Facebook Modern',
    value: 'facebook-modern' as const,
    description: 'Trendy design with overlay box'
  },
  {
    name: 'Facebook Minimal',
    value: 'facebook-minimal' as const,
    description: 'Clean, typography-focused design'
  },
  {
    name: 'Durbin News',
    value: 'durbin-news' as const,
    description: 'Bengali news layout with red background'
  }
];

export const LayoutSelector: React.FC<LayoutSelectorProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Layout Style
      </label>

      <div className="space-y-2">
        {LAYOUTS.map((layout) => (
          <button
            key={layout.value}
            type="button"
            onClick={() => onChange(layout.value)}
            className={`
              w-full p-3 text-left rounded-lg border-2 transition-all
              ${value === layout.value
                ? 'border-blue-500 bg-blue-50 text-blue-900'
                : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{layout.name}</div>
                <div className="text-sm text-gray-500">
                  {layout.description}
                </div>
              </div>

              {value === layout.value && (
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
        Choose the visual style that best fits your brand
      </div>
    </div>
  );
};