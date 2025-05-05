import { type SchemaTypeDefinition } from 'sanity'
import post from './schemas/post'
import event from './schemas/event'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, event],
} 