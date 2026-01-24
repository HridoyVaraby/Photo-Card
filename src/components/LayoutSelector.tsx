import React from 'react';
import { Label } from './ui/label';
import { cn } from '../lib/utils';
import { Check, LayoutTemplate, Box, Type } from 'lucide-react';

interface LayoutSelectorProps {
  value: 'default' | 'facebook-modern' | 'facebook-minimal' | 'durbin-news';
  onChange: (layout: 'default' | 'facebook-modern' | 'facebook-minimal' | 'durbin-news') => void;
}

const LAYOUTS = [
  {
    name: 'Classic',
    value: 'default' as const,
    description: 'Logo top-right, bottom bar',
    icon: LayoutTemplate
  },
  {
    name: 'Modern Overlay',
    value: 'facebook-modern' as const,
    description: 'Gradient overlay text',
    icon: Box
  },
  {
    name: 'Minimalist',
    value: 'facebook-minimal' as const,
    description: 'Clean typography focus',
    icon: Type
  },
  {
    name: 'Broadcaster',
    value: 'durbin-news' as const,
    description: 'Full news style frame',
    icon: LayoutTemplate
  }
];

export const LayoutSelector: React.FC<LayoutSelectorProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="space-y-3">
      <Label>Composition Style</Label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {LAYOUTS.map((layout) => {
          const Icon = layout.icon;
          return (
            <button
              key={layout.value}
              type="button"
              onClick={() => onChange(layout.value)}
              className={cn(
                "relative p-3 text-left rounded-xl border-2 transition-all duration-200 h-full flex flex-col justify-between",
                value === layout.value
                  ? "border-accent bg-accent/5 shadow-sm"
                  : "border-border hover:border-accent/50 hover:bg-secondary/50 hover:shadow-sm"
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div className={cn("p-2 rounded-lg", value === layout.value ? "bg-accent/10 text-accent" : "bg-secondary text-muted-foreground")}>
                  <Icon size={18} />
                </div>
                {value === layout.value && (
                  <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center shadow-sm animate-fade-in">
                    <Check className="w-3 h-3 text-white stroke-[3]" />
                  </div>
                )}
              </div>

              <div>
                <div className="font-medium text-sm text-foreground">{layout.name}</div>
                <div className="text-xs text-muted-foreground mt-1 leading-snug">
                  {layout.description}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  );
};