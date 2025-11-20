'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageWithFallbackProps {
  src?: string | null;
  alt: string;
  fallback?: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

// Helper function to convert file path to absolute URL
const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '';
  
  // If already an absolute URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If relative path (e.g., uploads/flyers/... or flyers/...), convert to absolute URL
  if (imagePath.startsWith('uploads/') || imagePath.startsWith('flyers/') || imagePath.startsWith('certificates/')) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    // Remove trailing /api if present to avoid double /api
    const cleanBaseUrl = baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;
    // Remove 'uploads/' prefix if present (backend serves from /api/files which maps to uploads/)
    const cleanPath = imagePath.startsWith('uploads/') ? imagePath.slice(8) : imagePath;
    return `${cleanBaseUrl}/api/files/${cleanPath}`;
  }
  
  // If starts with /, it's already a relative path for Next.js
  return imagePath;
};

export function ImageWithFallback({ 
  src, 
  alt, 
  fallback, 
  className,
  ...props 
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const imageUrl = getImageUrl(src);

  if (!imageUrl || hasError) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-muted text-muted-foreground",
        className
      )} {...props}>
        {fallback || (
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-muted-foreground/20 flex items-center justify-center">
              <span className="text-xs font-medium">?</span>
            </div>
            <span className="text-xs">No Image</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      width={500}
      height={300}
      {...props}
    />
  );
}