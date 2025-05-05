import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'post',
  title: '뉴스',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '제목',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: '슬러그',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'category',
      title: '카테고리',
      type: 'string',
      options: {
        list: [
          {title: '성명', value: 'statement'},
          {title: '오늘의 영국', value: 'today'},
          {title: '언론 속 영국', value: 'media'}
        ]
      },
      validation: Rule => Rule.required(),
      initialValue: 'statement'
    }),
    defineField({
      name: 'thumbnail',
      title: '대표 이미지',
      type: 'image',
      options: {
        hotspot: true
      }
    }),
    defineField({
      name: 'publishedAt',
      title: '발행일',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'body',
      title: '내용',
      type: 'text',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'summary',
      title: '요약',
      type: 'text',
      description: '목록에 표시될 요약 내용입니다. 입력하지 않으면 본문에서 자동 추출됩니다.',
      validation: Rule => Rule.max(200)
    }),
    defineField({
      name: 'source',
      title: '출처',
      type: 'string',
      description: '언론 출처 또는 링크 (언론 속 영국 카테고리에 필요)',
      hidden: ({ document }) => document?.category !== 'media'
    })
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      publishedAt: 'publishedAt',
      media: 'thumbnail'
    },
    prepare({ title, category, publishedAt, media }) {
      const categoryLabel = 
        category === 'statement' ? '성명' :
        category === 'today' ? '오늘의 영국' :
        category === 'media' ? '언론 속 영국' : '';
      
      const date = publishedAt 
        ? new Date(publishedAt).toLocaleDateString('ko-KR')
        : '날짜 미정';
      
      return {
        title,
        subtitle: `[${categoryLabel}] ${date}`,
        media
      }
    }
  }
}) 