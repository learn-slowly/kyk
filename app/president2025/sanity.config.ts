import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'president_2025',

  projectId: 'qpvtzhxq',
  dataset: 'production',

  plugins: [deskTool({}), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
