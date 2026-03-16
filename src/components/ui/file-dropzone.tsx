import { useState, useRef, useCallback } from 'react';
import { Upload, FileSpreadsheet, X, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileDropzoneProps {
  accept?: string;
  acceptLabel?: string;
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileClear: () => void;
  id?: string;
}

const FileDropzone = ({
  accept = '.xlsx,.xls,.csv',
  acceptLabel = '.xlsx, .xls or .csv',
  file,
  onFileSelect,
  onFileClear,
  id = 'file-dropzone',
}: FileDropzoneProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      const ext = droppedFile.name.split('.').pop()?.toLowerCase();
      const allowedExts = accept.split(',').map(a => a.trim().replace('.', ''));
      if (ext && allowedExts.includes(ext)) {
        onFileSelect(droppedFile);
      }
    }
  }, [accept, onFileSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) onFileSelect(selected);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (file) {
    return (
      <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-5 transition-all">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              <p className="font-medium text-foreground truncate">{file.name}</p>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{formatSize(file.size)}</p>
          </div>
          <button
            onClick={(e) => { e.preventDefault(); onFileClear(); }}
            className="w-8 h-8 rounded-full hover:bg-destructive/10 flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'relative rounded-xl border-2 border-dashed p-10 text-center transition-all duration-200 cursor-pointer group',
        isDragOver
          ? 'border-primary bg-primary/5 scale-[1.02]'
          : 'border-border hover:border-primary/50 hover:bg-secondary/30'
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        id={id}
      />
      <label htmlFor={id} className="cursor-pointer block">
        <div className={cn(
          'w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-all duration-200',
          isDragOver ? 'bg-primary/20 scale-110' : 'bg-secondary group-hover:bg-primary/10'
        )}>
          <Upload className={cn(
            'w-7 h-7 transition-colors',
            isDragOver ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
          )} />
        </div>
        <p className="font-semibold text-foreground mb-1">
          {isDragOver ? 'Drop your file here' : 'Drag & drop your file here'}
        </p>
        <p className="text-sm text-muted-foreground mb-3">or click to browse</p>
        <span className="inline-block text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground">
          Supports {acceptLabel}
        </span>
      </label>
    </div>
  );
};

export default FileDropzone;
