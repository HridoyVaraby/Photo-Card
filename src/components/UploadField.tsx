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
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200 group
          ${value
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 bg-white hover:bg-gray-50'
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
          <div className="relative">
            <div className="flex items-center justify-center mb-3">
              <div className="relative group-hover:scale-105 transition-transform duration-200">
                <img
                  src={value}
                  alt="Preview"
                  className="max-h-40 max-w-full rounded-lg shadow-sm object-contain bg-white"
                />
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <span className="text-sm text-blue-700 font-medium bg-blue-100 px-2 py-1 rounded">Image uploaded</span>
              <button
                type="button"
                onClick={handleRemove}
                className="text-red-500 hover:text-red-700 text-sm font-medium hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        {!isLoading && !value && (
          <div className="space-y-3">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-200">
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-blue-600 hover:text-blue-700">Click to upload</span>
              <span className="text-gray-500"> or drag and drop</span>
            </div>
            <p className="text-xs text-gray-400">{placeholder}</p>
          </div>
        )}

        {error && (
          <div className="mt-3 text-sm text-red-600 bg-red-50 py-1 px-2 rounded">
            {error}
          </div>
        )}
      </div>

      <p className="mt-2 text-xs text-gray-400 flex items-center">
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Supports PNG, JPG, GIF up to 10MB
      </p>
    </div>
  );
};