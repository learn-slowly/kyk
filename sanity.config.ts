'use client'

/**
 * This configuration is used to for the Sanity Studio that's mounted on the `/studio` route
 */

import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './app/president2025/schemaTypes'
import { apiVersion, dataset, projectId } from './app/president2025/config/env'
import { structure as customStructure } from './app/president2025/config/structure'

export default defineConfig({
  name: 'default',
  title: 'president_2025',
  
  projectId,
  dataset,
  
  basePath: '/studio',
  
  plugins: [
    deskTool({ structure: customStructure }),
    visionTool({defaultApiVersion: apiVersion})
  ],
  
  schema: {
    types: schemaTypes,
  },
}) 