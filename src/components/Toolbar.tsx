import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Layers, MousePointer2 } from 'lucide-react';
import { CardState } from '../types';
import { UploadField } from './UploadField';
import { ResolutionSelector } from './ResolutionSelector';
import { FontSelector } from './FontSelector';
import { ColorPicker } from './ColorPicker';
import { LayoutSelector } from './LayoutSelector';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { cn } from '../lib/utils';

interface ToolbarProps {
  state: CardState;
  onStateChange: (updates: Partial<CardState>) => void;
}

const AccordionItem = ({
  title,
  icon: Icon,
  isOpen,
  onClick,
  children
}: {
  title: string;
  icon: any;
  isOpen: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => {
  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md">
      <button
        onClick={onClick}
        className={cn(
          "w-full flex items-center justify-between p-4 text-left transition-colors",
          isOpen ? "bg-secondary/50" : "bg-card hover:bg-secondary/30"
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg bg-background border border-border/50 text-accent", isOpen && "bg-accent text-white shadow-sm ring-2 ring-accent/20")}>
            <Icon size={18} />
          </div>
          <span className="font-medium text-foreground">{title}</span>
        </div>
        <ChevronDown
          size={18}
          className={cn("text-muted-foreground transition-transform duration-300", isOpen && "rotate-180")}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="p-5 border-t border-border/50 space-y-5 bg-card/50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Toolbar: React.FC<ToolbarProps> = ({
  state,
  onStateChange
}) => {
  const [openSection, setOpenSection] = useState<string>('content');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? '' : section);
  };

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

  const handleLayoutChange = (layout: 'default' | 'facebook-modern' | 'facebook-minimal' | 'durbin-news') => {
    onStateChange({
      settings: {
        ...state.settings,
        layout
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Content Section */}
      <AccordionItem
        title="Content & Assets"
        icon={Layers}
        isOpen={openSection === 'content'}
        onClick={() => toggleSection('content')}
      >
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
          placeholder="Add your logo"
        />

        <div className="grid gap-2">
          <Label>Headline <span className="text-destructive">*</span></Label>
          <textarea
            value={state.headline}
            onChange={(e) => onStateChange({ headline: e.target.value })}
            placeholder="Enter your headline text..."
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-shadow resize-none"
            rows={3}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Max 3 lines</span>
            <span className={state.headline.length > 100 ? 'text-orange-500' : ''}>
              {state.headline.length} chars
            </span>
          </div>
        </div>

        <div className="grid gap-2">
          <Label>Date (Bengali)</Label>
          <Input
            value={state.date || ''}
            onChange={(e) => onStateChange({ date: e.target.value })}
            placeholder="৩০ নভেম্বর, ২০২৫"
          />
        </div>

        <UploadField
          label="Background Image (Durbin News)"
          value={state.backgroundImage || null}
          onFileSelect={handleBackgroundImageSelect}
          placeholder="Custom background"
        />
      </AccordionItem>

      {/* Design Section */}
      <AccordionItem
        title="Design & Layout"
        icon={MousePointer2}
        isOpen={openSection === 'design'}
        onClick={() => toggleSection('design')}
      >
        <LayoutSelector
          value={(state.settings.layout || 'default') as any}
          onChange={handleLayoutChange}
        />

        <div className="grid grid-cols-1 gap-4 pt-4 border-t border-border/40">
          <ResolutionSelector
            value={{
              name: 'Custom',
              width: state.settings.width,
              height: state.settings.height
            }}
            onChange={(res) => onStateChange({
              settings: {
                ...state.settings,
                width: res.width,
                height: res.height
              }
            })}
          />

          <FontSelector
            value={state.settings.font}
            onChange={(font) => onStateChange({
              settings: { ...state.settings, font }
            })}
          />

          <ColorPicker
            value={state.settings.brandColor}
            onChange={(color) => onStateChange({
              settings: { ...state.settings, brandColor: color }
            })}
          />
        </div>

        <div className="pt-4 border-t border-border/40 space-y-3">
          <Label>Export Quality</Label>
          <div className="flex items-center gap-4 bg-secondary/30 p-1 rounded-lg border border-border/50">
            {['png', 'jpeg'].map((format) => (
              <button
                key={format}
                onClick={() => onStateChange({
                  settings: {
                    ...state.settings,
                    format: format as 'png' | 'jpeg',
                    quality: format === 'jpeg' ? 90 : undefined
                  }
                })}
                className={cn(
                  "flex-1 py-1.5 text-sm font-medium rounded-md transition-all",
                  state.settings.format === format
                    ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                )}
              >
                {format.toUpperCase()}
              </button>
            ))}
          </div>

          {state.settings.format === 'jpeg' && (
            <div className="bg-secondary/20 p-3 rounded-lg border border-border/50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-muted-foreground">Quality</span>
                <span className="text-xs font-bold text-primary">{state.settings.quality || 90}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="100"
                value={state.settings.quality || 90}
                onChange={(e) => onStateChange({
                  settings: { ...state.settings, quality: parseInt(e.target.value) }
                })}
                className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          )}
        </div>
      </AccordionItem>
    </div>
  );
};