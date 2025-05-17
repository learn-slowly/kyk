import { TypedObject } from '@portabletext/types';

export interface DetailPolicy {
  _key: string;
  title: string;
  description: TypedObject[] | string;
}

export interface Policy {
  _id: string;
  title: string;
  description: TypedObject[] | string;
  color: string;
  detailPolicies?: DetailPolicy[];
  orderRank: number;
} 