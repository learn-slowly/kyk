'use client'

/**
 * This configuration is used to for the Sanity Studio that's mounted on the `/studio` route
 */

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './app/president2025/schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'president_2025',
  
  projectId: 'qpvtzhxq',
  dataset: 'production',
  
  basePath: '/studio',
  
  plugins: [structureTool(), visionTool()],
  
  schema: {
    types: schemaTypes,
  },
}) 