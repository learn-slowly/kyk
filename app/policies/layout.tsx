'use client';

import PolicyFooter from '@/app/components/PolicyFooter';

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