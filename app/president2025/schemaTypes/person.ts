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
          {title: '후보', value: 'level1'},
          {title: '선대위고문', value: 'level2'},
          {title: '총괄선대위원장', value: 'level3'},
          {title: '후원회장', value: 'level4'},
          {title: '공동후원회장', value: 'level5'},
          {title: '공동선대위원장', value: 'level6'},
          {title: '부문별 선대위원장', value: 'level7'},
          {title: '특보', value: 'level8'},
          {title: '지지자', value: 'level9'}
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
    }),
    defineField({
      name: 'showOnMap',
      title: '관계도에 표시',
      type: 'boolean',
      description: '관계도에 이 인물을 표시할지 여부를 선택합니다',
      initialValue: false
    }),
    defineField({
      name: 'mapPosition',
      title: '관계도 위치',
      type: 'object',
      description: '관계도에서 표시될 위치를 지정합니다',
      hidden: ({document}) => !document?.showOnMap,
      fields: [
        {
          name: 'x',
          title: 'X 좌표',
          type: 'number',
          initialValue: 0
        },
        {
          name: 'y',
          title: 'Y 좌표',
          type: 'number',
          initialValue: 0
        }
      ]
    }),
    defineField({
      name: 'isCandidate',
      title: '후보자',
      type: 'boolean',
      description: '이 인물이 후보자인지 여부를 선택합니다',
      initialValue: false,
      hidden: ({document}) => !document?.showOnMap
    }),
    defineField({
      name: 'description',
      title: '설명(관계도용)',
      type: 'text',
      description: '관계도에 표시될 간략한 설명을 입력합니다',
      hidden: ({document}) => !document?.showOnMap
    }),
    defineField({
      name: 'relations',
      title: '관계',
      description: '이 인물과 직접 관계된 다른 인물들을 선택합니다',
      type: 'array',
      hidden: ({document}) => !document?.showOnMap,
      of: [
        {
          type: 'reference',
          to: [{type: 'person'}],
          options: {
            disableNew: false
          }
        }
      ]
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