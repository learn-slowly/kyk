import { TypedObject } from '@portabletext/types';

export interface DetailPolicy {
  _key: string;
  title: string;
  description: TypedObject | TypedObject[];
}

export interface Policy {
  _id: string;
  title: string;
  description: TypedObject | TypedObject[];
  color: string;
  detailPolicies?: DetailPolicy[];
  orderRank: number;
} 