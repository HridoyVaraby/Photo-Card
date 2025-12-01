import React, { useCallback, useRef } from 'react';
import { useImage } from '../hooks/useImage';

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
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors duration-200
          ${value
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
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

        {isLoading && (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {!isLoading && value && (
          <div>
            <div className="flex items-center justify-center mb-2">
              <img
                src={value}
                alt="Preview"
                className="max-h-32 max-w-full rounded object-contain"
              />
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-sm text-gray-600">Image uploaded</span>
              <button
                type="button"
                onClick={handleRemove}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        {!isLoading && !value && (
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-sm text-gray-600">
              <span className="font-medium text-blue-600">Upload a file</span> or drag and drop
            </div>
            <p className="text-xs text-gray-500">{placeholder}</p>
          </div>
        )}

        {error && (
          <div className="mt-2 text-sm text-red-600">
            {error}
          </div>
        )}
      </div>

      <p className="mt-1 text-xs text-gray-500">
        PNG, JPG, GIF up to 10MB
      </p>
    </div>
  );
};