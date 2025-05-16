import { Rule } from '@sanity/types';

const event = {
  name: 'event',
  title: '일정',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: '제목',
      type: 'string',
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'startDateTime',
      title: '시작 일시',
      type: 'datetime',
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'endDateTime',
      title: '종료 일시',
      type: 'datetime',
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'location',
      title: '장소',
      type: 'string',
      validation: (rule: Rule) => rule.required(),
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
          {title: '미디어', value: 'media'}
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
      location: 'location',
      isImportant: 'isImportant',
      category: 'category'
    },
    prepare(selection: {
      title?: string;
      startDateTime?: string;
      location?: string;
      isImportant?: boolean;
      category?: string;
    }) {
      const { title, startDateTime, location, isImportant, category } = selection;
      
      let date = '날짜 미정';
      if (startDateTime) {
        try {
          const dateObj = new Date(startDateTime);
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
        category === 'media' ? '미디어' : '';
      
      return {
        title: isImportant ? `⭐ ${title}` : title,
        subtitle: `[${categoryLabel}] ${date} @ ${location || '장소 미정'}`
      };
    }
  }
};

export default event;