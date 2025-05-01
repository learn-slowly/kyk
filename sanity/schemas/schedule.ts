import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'schedule',
  title: '일정',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '제목',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'date',
      title: '날짜',
      type: 'date',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'startTime',
      title: '시작 시간',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'endTime',
      title: '종료 시간',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'location',
      title: '장소',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'type',
      title: '일정 유형',
      type: 'string',
      options: {
        list: [
          { title: '공개 연설', value: 'speech' },
          { title: '정책 간담회', value: 'policy' },
          { title: '청년 포럼', value: 'youth' },
          { title: '출마 선언', value: 'announcement' },
          { title: '정책 발표', value: 'policyAnnouncement' },
          { title: '기타', value: 'other' },
        ],
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'description',
      title: '설명',
      type: 'text',
    }),
    defineField({
      name: 'isPast',
      title: '지난 일정',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'calendarEvent',
      title: '캘린더 이벤트 정보',
      type: 'object',
      fields: [
        defineField({
          name: 'start',
          title: '시작 일시 (ISO 형식: YYYY-MM-DDTHH:MM:SS)',
          type: 'string',
          description: '예: 2025-05-10T14:00:00'
        }),
        defineField({
          name: 'end',
          title: '종료 일시 (ISO 형식: YYYY-MM-DDTHH:MM:SS)',
          type: 'string',
          description: '예: 2025-05-10T16:00:00'
        }),
      ]
    }),
    defineField({
      name: 'isHighlighted',
      title: '주요 일정으로 표시',
      type: 'boolean',
      initialValue: false,
      description: '체크하면 주요 일정으로 표시됩니다'
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'date',
      description: 'location'
    },
    prepare({ title, subtitle, description }) {
      return {
        title,
        subtitle: `${subtitle || '날짜 미정'} - ${description || '장소 미정'}`
      }
    }
  }
}) 