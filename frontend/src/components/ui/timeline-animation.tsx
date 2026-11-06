'use client';

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TimelineContentProps extends HTMLMotionProps<'div'> {
  as?: 'div' | 'p' | 'article' | 'section' | 'span';
  animationNum?: number;
  timelineRef?: React.RefObject<any>;
  customVariants?: any;
  children?: React.ReactNode;
  className?: string;
}

export function TimelineContent({
  as = 'div',
  animationNum = 0,
  timelineRef,
  customVariants,
  children,
  className,
  ...props
}: TimelineContentProps) {
  const Component = (motion as any)[as] || motion.div;

  return (
    <Component
      custom={animationNum}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={customVariants}
      className={cn(className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export default TimelineContent;

