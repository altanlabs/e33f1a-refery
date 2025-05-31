import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Upload, FileText, Image as ImageIcon } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  onClose: () => void;
}

export function FileUpload({ onFileUpload, onClose }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  return (
    <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-emerald-200 dark:border-emerald-800 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Upload className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Upload File
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        
        <div
          className={`file-drop-zone border-2 border-dashed border-emerald-300 dark:border-emerald-700 rounded-lg p-6 text-center hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors duration-200 cursor-pointer ${
            isDragOver ? 'drag-over' : ''
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
              <Upload className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Drop files here or click to browse
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PDF, DOC, DOCX, JPG, PNG (max 10MB)
              </p>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
          onChange={handleFileSelect}
        />

        <div className="mt-3 flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 border-emerald-200 dark:border-emerald-700 hover:from-emerald-100 hover:to-cyan-100 dark:hover:from-emerald-900/40 dark:hover:to-cyan-900/40"
          >
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.accept = '.jpg,.jpeg,.png,.gif';
                fileInputRef.current.click();
              }
            }}
            className="flex-1 bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 border-emerald-200 dark:border-emerald-700 hover:from-emerald-100 hover:to-cyan-100 dark:hover:from-emerald-900/40 dark:hover:to-cyan-900/40"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Images
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}