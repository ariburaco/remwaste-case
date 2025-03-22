'use client';

import { motion } from 'framer-motion';
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
            <svg
              viewBox="0 0 90 60"
              width={70 - index * 5}
              height={50 - index * 3}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-md"
            >
              {/* Skip container */}
              <path
                d="M5 10 L15 5 L75 5 L85 10 L85 45 L5 45 Z"
                fill="#F2CA19"
                stroke="#222"
                strokeWidth="3"
              />
              {/* Top edge */}
              <path
                d="M15 5 L15 15 L75 15 L75 5"
                stroke="#222"
                strokeWidth="3"
                fill="none"
              />
              {/* Internal lines */}
              <path
                d="M30 5 L30 45"
                stroke="#222"
                strokeWidth="3"
              />
              <path
                d="M60 5 L60 45"
                stroke="#222"
                strokeWidth="3"
              />
              <path
                d="M15 30 L75 30"
                stroke="#222"
                strokeWidth="3"
              />
              {/* Handle */}
              <circle
                cx="10"
                cy="20"
                r="5"
                fill="none"
                stroke="#222"
                strokeWidth="3"
              />
            </svg>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-2 left-0 right-0 text-center text-xs font-medium text-muted-foreground"
      >
        {size} Yards
      </motion.div>
    </div>
  );
}
