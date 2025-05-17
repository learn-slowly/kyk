import { type StructureBuilder } from 'sanity/desk'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('콘텐츠 관리')
    .id('content-root')
    .items([
      S.documentTypeListItem('post').title('뉴스').id('news-posts'),
      S.documentTypeListItem('event').title('이벤트').id('events-list'),
      S.documentTypeListItem('policy').title('정책카드').id('policies-list'),
      S.documentTypeListItem('cardNews').title('정책카드뉴스').id('cardnews-list'),
      S.documentTypeListItem('person').title('구성원').id('people-list'),
      // 여기에 다른 스키마 타입들도 추가할 수 있습니다.
      // 예: S.documentTypeListItem('author').title('작성자'),
    ]) 