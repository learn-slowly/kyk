export default {
  name: 'candidate',
  title: '후보자 프로필',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: '이름',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'position',
      title: '직책',
      type: 'string',
    },
    {
      name: 'image',
      title: '프로필 이미지',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'bio',
      title: '약력',
      type: 'array',
      of: [
        {
          type: 'block',
        },
      ],
    },
    {
      name: 'career',
      title: '경력',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'year',
              title: '연도',
              type: 'string',
            },
            {
              name: 'description',
              title: '설명',
              type: 'string',
            },
          ],
        },
      ],
    },
  ],
} 