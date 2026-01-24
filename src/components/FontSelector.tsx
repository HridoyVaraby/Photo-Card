import React from 'react';
import { FontOption } from '../types';
import { Label } from './ui/label';
import { cn } from '../lib/utils';
import { Check } from 'lucide-react';

interface FontSelectorProps {
  value: string;
  onChange: (font: string) => void;
}

const FONTS: FontOption[] = [
  { name: 'Playfair Display', value: 'Playfair Display', family: 'Playfair Display, serif' },
  { name: 'Inter', value: 'Inter', family: 'Inter, sans-serif' },
  { name: 'Noto Sans Bengali', value: 'Noto Sans Bengali', family: 'Noto Sans Bengali, sans-serif' },
  { name: 'Hind Siliguri', value: 'Hind Siliguri', family: 'Hind Siliguri, sans-serif' },
  { name: 'Tiro Bangla', value: 'Tiro Bangla', family: 'Tiro Bangla, serif' },
];

export const FontSelector: React.FC<FontSelectorProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="space-y-3">
      <Label>Typography</Label>

      <div className="grid grid-cols-1 gap-2">
        {FONTS.map((font) => (
          <button
            key={font.value}
            type="button"
            onClick={() => onChange(font.value)}
            className={cn(
              "relative p-3 text-left rounded-lg border-2 transition-all duration-200 group",
              value === font.value
                ? "border-accent bg-accent/5"
                : "border-border hover:border-accent/50 hover:bg-secondary/50"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div
                  className="font-medium text-lg text-foreground"
                  style={{ fontFamily: font.family }}
                >
                  {font.name}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 group-hover:text-foreground/80 transition-colors">
                  The quick brown fox • আমার সোনার বাংলা
                </div>
              </div>

              {value === font.value && (
                <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center ml-3 shadow-sm animate-fade-in">
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="text-xs text-muted-foreground bg-secondary/50 p-2 rounded border border-border/50">
        Choose a font that supports your primary language. "Playfair" is best for English headlines.
      </div>
    </div>
  );
};