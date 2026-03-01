'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';

const LOCAL_STORAGE_KEY = 'gts-uploaded-logo';

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

  const handleLogoClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent the parent Link from navigating
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
        onClick={handleLogoClick}
        className={cn(
          'cursor-pointer',
          logoSrc
            ? 'relative'
            : 'flex items-center justify-center rounded-md border-2 border-dashed border-current p-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground',
          className
        )}
        title={logoSrc ? 'Click to change logo' : 'Click to upload logo'}
      >
        {logoSrc ? (
          <Image
            src={logoSrc}
            alt="Uploaded logo"
            fill
            className="object-contain"
          />
        ) : (
          'Logo'
        )}
      </div>
    </>
  );
}
