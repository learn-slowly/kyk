import { createClient } from '@sanity/client'

import { apiVersion, dataset, projectId, useCdn } from '../env'

export const client = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn,
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
