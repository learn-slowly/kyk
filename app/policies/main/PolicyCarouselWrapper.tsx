'use client';

import PolicyCarousel from '@/components/PolicyCarousel';
import { Policy } from '@/types/policy';

interface PolicyCarouselWrapperProps {
  policies: Policy[];
}

export default function PolicyCarouselWrapper({ policies }: PolicyCarouselWrapperProps) {
  return (
    <PolicyCarousel 
      policies={policies}
    />
  );
} 