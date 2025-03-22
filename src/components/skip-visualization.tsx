'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface SkipVisualizationProps {
  size: number;
  className?: string;
}

export function SkipVisualization({
  size,
  className = '',
}: SkipVisualizationProps) {
  const [skips, setSkips] = useState<number[]>([]);

  useEffect(() => {
    // Calculate how many skip images to show based on the size
    // Using a rule of 1 skip image for 4 yards, 2 for 8-12, 3 for 16+
    let count = 1;
    if (size > 4 && size <= 12) {
      count = 2;
    } else if (size > 12) {
      count = 3;
    }
    setSkips(Array.from({ length: count }, (_, i) => i));
  }, [size]);

  return (
    <div
      className={`relative flex items-center justify-center w-full h-full ${className}`}
    >
      <div className="flex items-end justify-center">
        {skips.map((_, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
              delay: index * 0.15,
            }}
            className="relative mx-1"
          >
            <Image src="/skip.png" alt="Skip" width={50} height={50} />
          </motion.div>
        ))}
      </div>
     
    </div>
  );
}
