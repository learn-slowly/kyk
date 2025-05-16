import { Rule } from '@sanity/types';

interface PreviewProps {
  title: string;
  media: {
    asset: {
      url: string;
    };
  };
  publishedAt: string;
}

export default {
  name: 'cardNews',
  title: '카드뉴스',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: '제목',
      type: 'string',
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'slug',
      title: 'URL',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'publishedAt',
      title: '발행일',
      type: 'datetime',
      validation: (rule: Rule) => rule.required(),
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
      validation: (rule: Rule) => rule.required().min(1),
    },
    {
      name: 'description',
      title: '설명',
      type: 'text',
      validation: (rule: Rule) => rule.required(),
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
  ],
  preview: {
    select: {
      title: 'title',
      media: 'images.0',
      publishedAt: 'publishedAt',
    },
    prepare({ title, media, publishedAt }: PreviewProps) {
      return {
        title,
        subtitle: new Date(publishedAt).toLocaleDateString(),
        media,
      };
    },
  },
} 