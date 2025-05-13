import { type StructureBuilder } from 'sanity/desk'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('콘텐츠 관리')
    .items([
      S.documentTypeListItem('post').title('뉴스'),
      S.documentTypeListItem('event').title('이벤트'),
      // 여기에 다른 스키마 타입들도 추가할 수 있습니다.
      // 예: S.documentTypeListItem('author').title('작성자'),
    ]) 