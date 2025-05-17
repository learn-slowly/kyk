import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'person',
  title: '구성원',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: '이름',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'position',
      title: '직책',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'level',
      title: '레벨',
      type: 'string',
      options: {
        list: [
          {title: '선대위고문', value: 'level1'},
          {title: '총괄선대위원장', value: 'level2'},
          {title: '후원회장', value: 'level3'},
          {title: '공동후원회장', value: 'level4'},
          {title: '공동선대위원장', value: 'level5'},
          {title: '부문별 선대위원장', value: 'level6'},
          {title: '특보', value: 'level7'},
          {title: '지지자', value: 'level8'}
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'photo',
      title: '사진',
      type: 'image',
      options: {hotspot: true}
    }),
    defineField({
      name: 'quote',
      title: '한마디',
      type: 'text'
    }),
    defineField({
      name: 'hasVideo',
      title: '영상 있음',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'videoUrl',
      title: '영상 URL',
      type: 'url',
      hidden: ({document}) => !document?.hasVideo
    }),
    defineField({
      name: 'order',
      title: '순서',
      type: 'number',
      initialValue: 999
    })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'position',
      media: 'photo'
    }
  }
}) 