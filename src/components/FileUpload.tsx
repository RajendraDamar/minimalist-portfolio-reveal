
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, ImagePlus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  currentUrl?: string;
  className?: string;
  buttonText?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelect, 
  currentUrl, 
  className,
  buttonText = "Upload File" 
}) => {
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL for image files
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        // For non-image files, just show the file name
        setPreview(null);
      }
      
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-col items-center">
        <Input 
          ref={inputRef} 
          type="file" 
          onChange={handleFileChange} 
          className="hidden" 
        />
        <Button 
          type="button" 
          onClick={handleButtonClick}
          variant="outline"
          className="w-full border-dashed border-2 border-portfolio-gray p-8 flex flex-col items-center justify-center bg-portfolio-charcoal hover:bg-portfolio-charcoal/90 text-portfolio-white"
        >
          {preview ? (
            <>
              <div className="w-full h-40 mb-2 flex justify-center">
                <img src={preview} alt="Preview" className="h-full object-contain" />
              </div>
              <div className="flex items-center">
                <ImagePlus className="mr-2 h-4 w-4" />
                Change Image
              </div>
            </>
          ) : (
            <>
              <Upload className="mb-2 h-8 w-8" />
              {fileName || buttonText}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FileUpload;
