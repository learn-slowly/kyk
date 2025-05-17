import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

export const client = createClient({
  projectId: 'qpvtzhxq', // president2025의 projectId
  dataset: 'production',
  apiVersion: '2025-05-05',
  useCdn: false // CDN 사용을 비활성화하여 최신 데이터를 가져오도록 수정
})

// 항상 최신 데이터를 가져오는 프리뷰 클라이언트
export const previewClient = createClient({
  projectId: 'qpvtzhxq',
  dataset: 'production',
  apiVersion: '2025-05-05',
  useCdn: false,
  perspective: 'previewDrafts',
  token: process.env.SANITY_API_TOKEN
})

// Sanity 이미지 URL 빌더 생성
const builder = imageUrlBuilder(client)

// 이미지 URL 생성 함수
export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// Generic 타입을 사용하는 fetchSanityData 함수
export async function fetchSanityData<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  return previewClient.fetch<T>(query, params);
}

// Helper function to get schedules with query
export async function getSchedules() {
  return previewClient.fetch(`*[_type == "schedule"] | order(date asc)`)
}

// Helper function to get upcoming schedules
export async function getUpcomingSchedules() {
  return previewClient.fetch(`*[_type == "schedule" && isPast == false] | order(date asc)[0...3]`)
}

// Helper function to get past schedules
export async function getPastSchedules() {
  return previewClient.fetch(`*[_type == "schedule" && isPast == true] | order(date desc)[0...3]`)
}

// Helper function to get highlighted schedules
export async function getHighlightedSchedules() {
  return previewClient.fetch(`*[_type == "schedule" && isHighlighted == true] | order(date asc)`)
}

// 게시물 관련 함수
export async function getPosts() {
  return previewClient.fetch(`*[_type == "post"] | order(publishedAt desc)`)
}

// 이벤트 관련 함수
export async function getEvents() {
  return previewClient.fetch(`*[_type == "event"] | order(start asc)`)
}