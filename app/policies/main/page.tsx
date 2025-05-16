import { Metadata } from 'next';
import { groq } from 'next-sanity';
import { client } from '@/sanity/lib/client';
import PolicyCarouselWrapper from './PolicyCarouselWrapper';
import { Policy } from '@/types/policy';

export const metadata: Metadata = {
  title: '정책 공약 | 권영국 후보',
  description: '권영국 후보의 10가지 정책 공약을 확인하세요.',
};

const policiesQuery = groq`*[_type == "policy"] | order(orderRank asc) {
  _id,
  title,
  description,
  color,
  detailPolicies[] {
    _key,
    title,
    description
  }
}`;

export default async function PoliciesMainPage() {
  const policies = await client.fetch<Policy[]>(policiesQuery);
  return <PolicyCarouselWrapper policies={policies} />;
} 