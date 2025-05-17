import { client } from '@/sanity/lib/client';
import PolicyCarousel from '@/components/PolicyCarousel';
import { Policy } from '@/types/policy';

export const metadata = {
  title: '10대 공약 | 정책 소개',
  description: '우리의 10대 핵심 공약을 소개합니다',
};

async function getPolicies(): Promise<Policy[]> {
  const policies = await client.fetch(`
    *[_type == "policy"] | order(orderRank asc) {
      _id,
      title,
      description[] {
        _type,
        style,
        _key,
        markDefs,
        children[] {
          _type,
          _key,
          text,
          marks
        }
      },
      color,
      orderRank,
      detailPolicies[] {
        _key,
        title,
        description[] {
          _type,
          style,
          _key,
          markDefs,
          children[] {
            _type,
            _key,
            text,
            marks
          }
        }
      }
    }
  `);
  
  console.log('Fetched policies:', JSON.stringify(policies, null, 2));
  return policies;
}

export default async function PoliciesPage() {
  const policies = await getPolicies();
  return <PolicyCarousel policies={policies} />;
} 