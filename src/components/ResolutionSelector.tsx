import React from 'react';
import { ResolutionOption } from '../types';
import { Label } from './ui/label';
import { cn } from '../lib/utils';
import { Check, Smartphone, Monitor } from 'lucide-react';

interface ResolutionSelectorProps {
  value: ResolutionOption;
  onChange: (resolution: ResolutionOption) => void;
}

const RESOLUTIONS: (ResolutionOption & { icon: any, shortName: string })[] = [
  { name: 'Twitter Card', shortName: 'Twitter', width: 1200, height: 628, icon: Monitor },
  { name: 'Facebook Post', shortName: 'Facebook', width: 1200, height: 630, icon: Monitor },
  { name: 'Square Post', shortName: 'Square', width: 1080, height: 1080, icon: Smartphone },
  { name: 'Instagram Story', shortName: 'Story', width: 1080, height: 1920, icon: Smartphone },
];

export const ResolutionSelector: React.FC<ResolutionSelectorProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="space-y-3">
      <Label>Canvas Dimensions</Label>

      <div className="grid grid-cols-2 gap-3">
        {RESOLUTIONS.map((resolution) => {
          const Icon = resolution.icon;
          const isActive = value.width === resolution.width && value.height === resolution.height;

          return (
            <button
              key={`${resolution.width}x${resolution.height}`}
              type="button"
              onClick={() => onChange(resolution)}
              className={cn(
                "relative p-3 text-left rounded-lg border-2 transition-all duration-200 flex flex-col justify-between h-20",
                isActive
                  ? "border-accent bg-accent/5 shadow-sm"
                  : "border-border hover:border-accent/50 hover:bg-secondary/50"
              )}
            >
              <div className="flex justify-between items-start w-full">
                <span className={cn("text-xs font-semibold uppercase tracking-wider", isActive ? "text-accent" : "text-muted-foreground")}>
                  {resolution.shortName}
                </span>
                {isActive && <Check className="w-3.5 h-3.5 text-accent" />}
              </div>

              <div className="mt-1">
                <div className="text-sm font-medium text-foreground">{resolution.width} × {resolution.height}</div>
              </div>

              <Icon className={cn("absolute bottom-2 right-2 w-8 h-8 opacity-5", isActive ? "text-accent" : "text-foreground")} />
            </button>
          )
        })}
      </div>

      <div className="text-xs text-muted-foreground bg-secondary/30 p-2 rounded-md border border-border/50 flex items-center gap-2">
        <Monitor className="w-3 h-3" />
        <span>Optimized for high-DPI displays (Retina/4K)</span>
      </div>
    </div>
  );
};