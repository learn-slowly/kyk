import { Metadata } from 'next';
import { groq } from 'next-sanity';
import { client, previewClient } from '@/app/president2025/config/lib/client';
import { Policy } from '@/types/policy';
import CarouselContainer from './CarouselContainer';

export const metadata: Metadata = {
  title: '정책 공약 | 권영국 후보',
  description: '권영국 후보의 10가지 정책 공약을 확인하세요.',
};

const policiesQuery = groq`*[_type == "policy"] | order(order asc) {
  _id,
  title,
  description,
  color,
  order,
  detailPolicies[] {
    _key,
    title,
    description
  }
}`;

export default async function PoliciesCarouselPage() {
  const policies = await previewClient.fetch<Policy[]>(policiesQuery);
  return <CarouselContainer policies={policies} />;
} 