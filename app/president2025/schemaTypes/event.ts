import { defineType } from 'sanity';

const eventSchema = defineType({
  name: 'event',
  title: '일정',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: '제목',
      type: 'string',
      validation: (rule) => rule.required(),
    },
    {
      name: 'startDateTime',
      title: '시작 일시 (새 형식)',
      type: 'datetime',
    },
    {
      name: 'endDateTime',
      title: '종료 일시 (새 형식)',
      type: 'datetime',
    },
    {
      name: 'start',
      title: '시작 일시 (이전 형식)',
      type: 'datetime',
      hidden: ({ document }) => !!document?.startDateTime,
    },
    {
      name: 'end',
      title: '종료 일시 (이전 형식)',
      type: 'datetime',
      hidden: ({ document }) => !!document?.endDateTime,
    },
    {
      name: 'location',
      title: '장소',
      type: 'string',
      validation: (rule) => rule.required(),
    },
    {
      name: 'description',
      title: '설명',
      type: 'text',
    },
    { 
      name: 'category', 
      title: '카테고리', 
      type: 'string', 
      options: { 
        list: [
          {title: '후보일정', value: 'candidate'},
          {title: '선거일정', value: 'election'},
          {title: '미디어', value: 'media'},
          {title: '유세일정', value: 'campaign'}
        ] 
      },
      initialValue: 'candidate'
    },
    { name: 'isImportant', title: '중요 일정', type: 'boolean', initialValue: false }
  ],
  preview: {
    select: {
      title: 'title',
      startDateTime: 'startDateTime',
      startLegacy: 'start',
      location: 'location',
      isImportant: 'isImportant',
      category: 'category'
    },
    prepare(selection) {
      const { title = '', startDateTime, startLegacy, location = '', isImportant = false, category = '' } = selection;
      
      const actualStartDate = startDateTime || startLegacy;
      let date = '날짜 미정';
      if (actualStartDate) {
        try {
          const dateObj = new Date(actualStartDate);
          if (!isNaN(dateObj.getTime())) {
            date = dateObj.toLocaleDateString('ko-KR');
          }
        } catch (error) {
          console.error('날짜 변환 오류:', error);
        }
      }
      
      const categoryLabel = 
        category === 'candidate' ? '후보' :
        category === 'election' ? '선거' :
        category === 'media' ? '미디어' :
        category === 'campaign' ? '유세일정' : '';
      
      return {
        title: isImportant ? `⭐ ${title}` : title,
        subtitle: `[${categoryLabel}] ${date} @ ${location || '장소 미정'}`
      };
    }
  }
});

export default eventSchema;