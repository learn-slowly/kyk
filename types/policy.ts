import { TypedObject } from '@portabletext/types';

export interface DetailPolicy {
  _key: string;
  title: string;
  description: string;
}

export interface Policy {
  _id: string;
  title: string;
  description: string;
  color: string;
  detailPolicies?: DetailPolicy[];
  orderRank: number;
} 