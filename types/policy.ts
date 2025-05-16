export interface DetailPolicy {
  _key: string;
  title: string;
  description: string;
  image?: {
    asset: {
      url: string;
    };
  };
}

export interface Policy {
  _id: string;
  title: string;
  description: string;
  color: string;
  order: number;
  detailPolicies?: DetailPolicy[];
} 