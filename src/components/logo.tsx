'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';

const LOCAL_STORAGE_KEY = 'gts-uploaded-logo';

export function Logo({ className }: { className?: string }) {
  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedLogo = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedLogo) {
      setLogoSrc(savedLogo);
    }
  }, []);

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

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
  };
  
  // To avoid hydration mismatch, we can't render the interactive component on the server.
  // We'll render a simple placeholder on the server and then the full component on the client.
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
      {logoSrc ? (
        <div
          className={cn('relative cursor-pointer', className)}
          onClick={handleLogoClick}
          title="Click to change logo"
        >
          <Image
            src={logoSrc}
            alt="Uploaded logo"
            fill
            className="object-contain"
          />
        </div>
      ) : (
        <div
          className={cn(
            'flex cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-current p-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground',
            className
          )}
          onClick={handleLogoClick}
          title="Click to upload logo"
        >
          Logo
        </div>
      )}
    </>
  );
}
