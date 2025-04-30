export default {
  name: 'policy',
  title: '공약',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: '제목',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: '카테고리',
      type: 'string',
      options: {
        list: [
          { title: '경제', value: 'economy' },
          { title: '복지', value: 'welfare' },
          { title: '교육', value: 'education' },
          { title: '안보', value: 'security' },
          { title: '기타', value: 'etc' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: '설명',
      type: 'array',
      of: [
        {
          type: 'block',
        },
      ],
    },
    {
      name: 'image',
      title: '이미지',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'order',
      title: '표시 순서',
      type: 'number',
    },
  ],
} 