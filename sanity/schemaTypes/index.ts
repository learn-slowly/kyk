import { type SchemaTypeDefinition } from 'sanity'
import schedule from '../schemas/schedule'
import media from '../schemas/media'
import brief from '../schemas/brief'
import youtube from '../schemas/youtube'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [schedule, media, brief, youtube],
}
