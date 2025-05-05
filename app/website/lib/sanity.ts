// lib/sanity.ts
import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'qpvtzhxq', // sanity.json에서 확인
  dataset: 'production',
  apiVersion: '2025-05-05', // 오늘 날짜
  useCdn: process.env.NODE_ENV === 'production' // 개발 환경에서는 false
})