import { defineType } from 'sanity';

const cardNewsSchema = defineType({
  name: 'cardNews',
  title: '카드뉴스',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: '제목',
      type: 'string',
      validation: (rule) => rule.required(),
    },
    {
      name: 'slug',
      title: 'URL',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    },
    {
      name: 'publishedAt',
      title: '발행일',
      type: 'datetime',
      validation: (rule) => rule.required(),
    },
    {
      name: 'images',
      title: '카드뉴스 이미지',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
      validation: (rule) => rule.required().min(1),
    },
    {
      name: 'description',
      title: '설명',
      type: 'text',
      validation: (rule) => rule.required(),
    },
    {
      name: 'tags',
      title: '태그',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    },
    {
      name: 'link',
      title: '관련 링크',
      type: 'url',
      description: '정책 관련 외부 링크 (선택사항)',
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'images.0',
      publishedAt: 'publishedAt',
    },
    prepare(selection) {
      const { title = '', media, publishedAt = '' } = selection;
      return {
        title,
        subtitle: new Date(publishedAt).toLocaleDateString(),
        media
      };
    },
  },
});

export default cardNewsSchema;
