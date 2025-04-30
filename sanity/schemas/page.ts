export default {
  name: 'page',
  title: '페이지',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: '페이지 제목',
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
      name: 'description',
      title: '설명',
      type: 'text',
      rows: 3,
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
    {
      name: 'order',
      title: '메뉴 순서',
      type: 'number',
    },
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    prepare({ title, slug }: any) {
      return {
        title,
        subtitle: `/${slug}`,
      }
    },
  },
} 