import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'
import {markdownSchema} from 'sanity-plugin-markdown'

export default defineConfig({
  name: 'default',
  title: '권영국',

  projectId: 'your-project-id',
  dataset: 'production',

  plugins: [
    deskTool(),
    visionTool(),
    markdownSchema(),
  ],

  schema: {
    types: schemaTypes,
  },
}) 