import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Check, Plus } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const PRESET_COLORS = [
  '#be123c', // Default Accent
  '#1e40af', // Blue
  '#b91c1c', // Red
  '#059669', // Green
  '#7c3aed', // Purple
  '#ea580c', // Orange
  '#0891b2', // Cyan
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
    // keep custom input open if we are editing text, but close if picking preset? 
    // Usually standard behavior is fine.
  };

  const isValidColor = (color: string) => {
    return /^#[0-9A-Fa-f]{6}$/.test(color);
  };

  return (
    <div className="space-y-3">
      <Label>Brand Color</Label>

      <div className="space-y-4">
        {/* Color Preview */}
        <div className="flex items-center gap-4 p-3 border border-border rounded-lg bg-secondary/20">
          <div
            className="w-12 h-12 rounded-full border-2 border-white shadow-sm ring-1 ring-border/50"
            style={{ backgroundColor: value }}
          />
          <div className="flex-1">
            <div className="text-sm font-medium font-mono text-foreground">
              {value.toUpperCase()}
            </div>
            <div className="text-xs text-muted-foreground">
              Headline background
            </div>
          </div>
        </div>

        {/* Preset Colors */}
        <div className="grid grid-cols-5 gap-3">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handleColorChange(color)}
              className={cn(
                "w-full aspect-square rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent",
                value === color
                  ? "scale-110 shadow-md ring-2 ring-offset-2 ring-accent"
                  : "hover:scale-105 hover:shadow-sm"
              )}
              style={{ backgroundColor: color }}
              title={color.toUpperCase()}
            >
              {value === color && <Check className="w-4 h-4 text-white mx-auto stroke-[3]" />}
            </button>
          ))}
        </div>

        {/* Custom Color Input */}
        <div className="pt-2">
          {!showCustomInput ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowCustomInput(true)}
              className="w-full text-xs"
            >
              <Plus className="w-3 h-3 mr-2" /> Custom Color
            </Button>
          ) : (
            <div className="flex gap-2 animate-fade-in">
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-border shadow-sm" style={{ backgroundColor: isValidColor(value) ? value : 'transparent' }} />
                <Input
                  type="text"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="#000000"
                  className={cn(
                    "pl-9 font-mono uppercase",
                    !isValidColor(value) && "border-destructive text-destructive focus-visible:ring-destructive"
                  )}
                />
              </div>
              <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-10 h-10 border border-input rounded-md cursor-pointer p-0.5 bg-background"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowCustomInput(false)}
                className="px-2"
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};