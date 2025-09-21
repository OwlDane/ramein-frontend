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

export function ImageWithFallback({ 
  src, 
  alt, 
  fallback, 
  className,
  ...props 
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
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
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      width={500}
      height={300}
      {...props}
    />
  );
}