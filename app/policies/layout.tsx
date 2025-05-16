import PolicyNavigation from './PolicyNavigation';
import { metadata as pageMetadata } from './metadata';

export const metadata = pageMetadata;

export default function PoliciesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PolicyNavigation />
      {children}
    </>
  );
} 