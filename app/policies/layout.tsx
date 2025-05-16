'use client';

import { metadata as pageMetadata } from './metadata';
import PolicyFooter from '@/app/components/PolicyFooter';

export const metadata = pageMetadata;

export default function PolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <PolicyFooter />
    </>
  );
} 