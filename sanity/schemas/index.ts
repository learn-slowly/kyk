import { type SchemaTypeDefinition } from 'sanity'
import post from './post'
import page from './page'
import candidate from './candidate'
import policy from './policy'

export const schemaTypes: SchemaTypeDefinition[] = [
  post,
  page,
  candidate,
  policy,
  // 여기에 스키마 타입들을 추가할 수 있습니다
] 