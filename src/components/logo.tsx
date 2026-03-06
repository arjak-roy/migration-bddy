'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { Upload } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'mmb-uploaded-logo';

export function Logo({ className }: { className?: string }) {
  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const savedLogo = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedLogo) {
      setLogoSrc(savedLogo);
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoSrc(result);
        localStorage.setItem(LOCAL_STORAGE_KEY, result);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert('Please select a valid image file.');
    }
    // Reset file input value to allow re-uploading the same file
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleUploadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  // To avoid hydration mismatch, we can't render the interactive component on the server.
  if (!isMounted) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-md border-2 border-dashed border-current p-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground',
          className
        )}
      >
        Logo
      </div>
    );
  }

  if (!logoSrc) {
    return (
      <>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/gif, image/svg+xml"
        />
        <div
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'cursor-pointer flex items-center justify-center rounded-md border-2 border-dashed border-current p-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground',
            className
          )}
          title="Click to upload logo"
        >
          Logo
        </div>
      </>
    );
  }

  return (
    <a
      href="https://globaltalentsquare.com/for-talents"
      target="_blank"
      rel="noopener noreferrer"
      className={cn('group relative', className)}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/gif, image/svg+xml"
      />
      <Image
        src={logoSrc}
        alt="Uploaded logo"
        fill
        className="object-contain"
      />
      <div
        onClick={handleUploadClick}
        title="Change logo"
        className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <Upload className="h-6 w-6 text-white" />
      </div>
    </a>
  );
}
