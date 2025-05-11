import {defineConfig} from 'sanity'
import {structure} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'president_2025',

  projectId: 'qpvtzhxq',
  dataset: 'production',

  plugins: [structure({}), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
