'use client'

/**
 * This configuration is used to for the Sanity Studio that's mounted on the `/studio` route
 */

import { defineConfig } from 'sanity'
import { structure } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './app/president2025/schemaTypes'
import { apiVersion, dataset, projectId } from './sanity/env'

export default defineConfig({
  name: 'default',
  title: 'president_2025',
  
  projectId,
  dataset,
  
  basePath: '/studio',
  
  plugins: [structure({}), visionTool({defaultApiVersion: apiVersion})],
  
  schema: {
    types: schemaTypes,
  },
}) 