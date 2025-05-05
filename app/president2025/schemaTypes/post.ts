export default {
    name: 'post',
    title: '게시글',
    type: 'document',
    fields: [
      { name: 'title', title: '제목', type: 'string' },
      { name: 'slug', title: '슬러그', type: 'slug', options: { source: 'title', maxLength: 96 } },
      { name: 'category', title: '카테고리', type: 'string', options: { list: ['뉴스', '공지', '자료'] } },
      { name: 'body', title: '내용', type: 'text' },
      { name: 'publishedAt', title: '게시일', type: 'datetime' },
      { name: 'author', title: '작성자', type: 'string' },
      { name: 'thumbnail', title: '썸네일', type: 'image' }
    ]
  }