import { createClient } from '@sanity/client';
import { projectId, dataset } from '../env';

export const client = createClient({
  projectId: projectId,
  dataset: dataset,
  apiVersion: '2023-05-03',
  useCdn: false,
  perspective: 'published',
  stega: {
    enabled: false
  },
  token: process.env.SANITY_API_TOKEN
});

// 캐시를 무시하는 추가 클라이언트
export const previewClient = createClient({
  projectId: projectId,
  dataset: dataset,
  apiVersion: '2023-05-03',
  useCdn: false,
  perspective: 'drafts',
  token: process.env.SANITY_API_TOKEN
}); 