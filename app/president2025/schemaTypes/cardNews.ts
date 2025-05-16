<<<<<<< HEAD
export default {
  name: 'cardNews',
  title: '카드뉴스',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: '카드뉴스 제목',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: '간단한 설명 (선택)',
      type: 'text',
    },
    {
      name: 'image',
      title: '카드뉴스 이미지',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: '카드뉴스 분야 (중복 선택 가능)',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [ 
          { title: '주요 공약 하이라이트', value: 'pledge_highlight' },
          { title: '정책 쉽게 보기', value: 'easy_policy' },
          { title: '후보 활동 스케치', value: 'activity_sketch' },
          { title: '메시지/논평', value: 'message_commentary' },
          { title: '기타 자료', value: 'misc_material' },
        ],
        layout: 'tags'
      },
    },
    {
      name: 'orderRank',
      title: '정렬 순서 (선택)',
      type: 'number',
      description: '숫자가 낮을수록 목록 상단에 표시됩니다.',
    },
    {
      name: 'publishedAt',
      title: '게시일',
      type: 'datetime',
      initialValue: new Date().toISOString(),
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      category: 'category', 
    },
    prepare(selection: { title?: string; media?: any; category?: string[] }) { 
      const { title, media, category } = selection;
      const categoryDisplay = category && category.length > 0
        ? category.map(c => 
            (c.charAt(0).toUpperCase() + c.slice(1)).replace(/_/g, ' ')
          ).join(', ')
        : '미분류';
      return {
        title: title,
        subtitle: `분야: ${categoryDisplay}`,
        media: media,
      };
    },
  },
}; 
=======
import { Rule } from '@sanity/types';
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
>>>>>>> dev
