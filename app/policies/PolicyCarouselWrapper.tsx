'use client';

import { useRouter } from 'next/navigation';
import PolicyCarousel from '@/components/PolicyCarousel';
import { Policy } from '@/types/policy';

export default function PolicyCarouselWrapper({ policies }: { policies: Policy[] }) {
  const router = useRouter();

  return (
    <PolicyCarousel 
      policies={policies}
      onTestClick={() => {
        router.push('/scti');
      }}
    />
  );
} 