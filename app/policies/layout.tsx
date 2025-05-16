import PolicyNavigation from './PolicyNavigation';

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