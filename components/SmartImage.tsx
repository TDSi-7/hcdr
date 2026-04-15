"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

type SmartImageProps = ImageProps & {
  fallbackSrc?: string;
};

export function SmartImage({ fallbackSrc = "/images/fallback.svg", src, alt, ...props }: SmartImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
}
