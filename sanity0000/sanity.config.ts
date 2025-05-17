import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from '../app/president2025/schemaTypes'

export default defineConfig({
  name: 'default',
  title: '권영국',

  projectId: 'your-project-id',
  dataset: 'production',

  plugins: [
    deskTool(),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
}) 