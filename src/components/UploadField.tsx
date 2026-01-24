import React, { useCallback, useRef } from 'react';
import { useImage } from '../hooks/useImage';
import { Upload, X, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { Label } from './ui/label';

interface UploadFieldProps {
  label: string;
  value: string | null;
  onFileSelect: (file: File | null) => void;
  accept?: string;
  required?: boolean;
  placeholder?: string;
}

export const UploadField: React.FC<UploadFieldProps> = ({
  label,
  value,
  onFileSelect,
  accept = 'image/*',
  required = false,
  placeholder = 'Choose file or drag and drop'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isLoading, error } = useImage();

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileSelect(file);
  }, [onFileSelect]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRemove = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onFileSelect]);

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between">
        <Label>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      </div>

      <motion.div
        whileHover={!value && !isLoading ? { scale: 1.01, borderColor: "var(--accent)" } : {}}
        whileTap={!value && !isLoading ? { scale: 0.99 } : {}}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors bg-card",
          value ? "border-accent/40 bg-accent/5" : "border-border hover:border-accent hover:bg-secondary/50",
          isLoading && "opacity-70 cursor-not-allowed",
          error && "border-destructive bg-destructive/5"
        )}
        onClick={!isLoading ? handleClick : undefined}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={isLoading}
          required={required && !value}
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="animate-spin text-accent h-8 w-8" />
          </div>
        ) : value ? (
          <div className="relative group">
            <div className="relative rounded-lg overflow-hidden shadow-sm border border-border">
              <img
                src={value}
                alt="Preview"
                className="max-h-48 w-full object-contain bg-grid-pattern"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <button
                  type="button"
                  onClick={handleRemove}
                  className="bg-destructive text-white p-2 rounded-full hover:bg-destructive/90 transition-transform hover:scale-110 shadow-lg"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="text-accent font-medium">Image active</span>
              <span>Click to replace</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto text-muted-foreground group-hover:text-accent group-hover:bg-accent/10 transition-colors">
              <Upload className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Click or drag image
              </p>
              <p className="text-xs text-muted-foreground">
                {placeholder}
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
};