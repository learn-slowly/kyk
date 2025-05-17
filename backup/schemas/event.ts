import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'event',
  title: '일정',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '일정명',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'description',
      title: '설명',
      type: 'text'
    }),
    defineField({
      name: 'category',
      title: '카테고리',
      type: 'string',
      options: {
        list: [
          {title: '후보일정', value: 'candidate'},
          {title: '선거일정', value: 'election'},
          {title: '미디어', value: 'media'}
        ]
      },
      initialValue: 'candidate'
    }),
    defineField({
      name: 'start',
      title: '시작일시',
      type: 'datetime',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'end',
      title: '종료일시',
      type: 'datetime',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'location',
      title: '장소',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'isImportant',
      title: '중요 일정',
      type: 'boolean',
      initialValue: false
    })
  ],
  preview: {
    select: {
      title: 'title',
      start: 'start',
      location: 'location',
      isImportant: 'isImportant',
      category: 'category'
    },
    prepare({ title, start, location, isImportant, category }) {
      const date = start ? new Date(start).toLocaleDateString('ko-KR') : '날짜 미정';
      const categoryLabel = category === 'candidate' ? '후보' :
                           category === 'election' ? '선거' :
                           category === 'media' ? '미디어' : '';
      
      return {
        title: isImportant ? `⭐ ${title}` : title,
        subtitle: `[${categoryLabel}] ${date} - ${location || '장소 미정'}`
      }
    }
  }
})