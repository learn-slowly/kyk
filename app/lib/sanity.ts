import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'qpvtzhxq', // president2025의 projectId
  dataset: 'production',
  apiVersion: '2025-05-05',
  useCdn: process.env.NODE_ENV === 'production'
})

// Helper function to get schedules with query
export async function getSchedules() {
  return client.fetch(`*[_type == "schedule"] | order(date asc)`)
}

// Helper function to get upcoming schedules
export async function getUpcomingSchedules() {
  return client.fetch(`*[_type == "schedule" && isPast == false] | order(date asc)[0...3]`)
}

// Helper function to get past schedules
export async function getPastSchedules() {
  return client.fetch(`*[_type == "schedule" && isPast == true] | order(date desc)[0...3]`)
}

// Helper function to get highlighted schedules
export async function getHighlightedSchedules() {
  return client.fetch(`*[_type == "schedule" && isHighlighted == true] | order(date asc)`)
}

// 게시물 관련 함수
export async function getPosts() {
  return client.fetch(`*[_type == "post"] | order(publishedAt desc)`)
}

// 이벤트 관련 함수
export async function getEvents() {
  return client.fetch(`*[_type == "event"] | order(start asc)`)
}