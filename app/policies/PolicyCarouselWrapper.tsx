'use client';

import { useRouter } from 'next/navigation';
import PolicyCarousel from '@/components/PolicyCarousel';
import { Policy } from '@/types/policy';

interface PolicyCarouselWrapperProps {
  policies: Policy[];
}

export default function PolicyCarouselWrapper({ policies }: PolicyCarouselWrapperProps) {
  const router = useRouter();

  return (
    <PolicyCarousel 
      policies={policies}
    />
  );
} 