import { type SchemaTypeDefinition } from 'sanity'
import post from '../app/president2025/schemaTypes/post'
import event from '../app/president2025/schemaTypes/event'
import person from '../app/president2025/schemaTypes/person'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, event, person],
} 