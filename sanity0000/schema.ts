import { type SchemaTypeDefinition } from 'sanity'
import post from './schemas/post'
import event from './schemas/event'
import person from './schemas/person'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, event, person],
} 