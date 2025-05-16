import { metadata as pageMetadata } from './metadata';
import Header from '../components/Header';

export const metadata = pageMetadata;

export default function PoliciesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
} 