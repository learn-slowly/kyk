export default {
  name: 'post',
  title: '게시글',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: '제목',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: '슬러그',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: '카테고리',
      type: 'string',
      options: {
        list: [
          { title: '공지사항', value: 'notice' },
          { title: '뉴스', value: 'news' },
          { title: '보도자료', value: 'press' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'publishedAt',
      title: '발행일',
      type: 'datetime',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'content',
      title: '내용',
      type: 'array',
      of: [
        {
          type: 'block',
        },
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      publishedAt: 'publishedAt',
    },
    prepare({ title, category, publishedAt }: any) {
      return {
        title,
        subtitle: `${category} - ${new Date(publishedAt).toLocaleDateString()}`,
      }
    },
  },
} 