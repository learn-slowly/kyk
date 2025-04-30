import { type SchemaTypeDefinition } from 'sanity'
import post from './post'
import page from './page'

export const schemaTypes: SchemaTypeDefinition[] = [
  post,
  page,
  // 여기에 스키마 타입들을 추가할 수 있습니다
] 