export default {
    name: 'event',
    title: '일정',
    type: 'document',
    fields: [
      { name: 'title', title: '일정명', type: 'string', validation: (Rule: any) => Rule.required() },
      { name: 'description', title: '설명', type: 'text' },
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
      { name: 'start', title: '시작일시', type: 'datetime', validation: (Rule: any) => Rule.required() },
      { name: 'end', title: '종료일시', type: 'datetime', validation: (Rule: any) => Rule.required() },
      { name: 'location', title: '장소', type: 'string', validation: (Rule: any) => Rule.required() },
      { name: 'isImportant', title: '중요 일정', type: 'boolean', initialValue: false }
    ],
    preview: {
      select: {
        title: 'title',
        start: 'start',
        location: 'location',
        isImportant: 'isImportant',
        category: 'category'
      },
      prepare(selection: {
        title?: string;
        start?: string | Date;
        location?: string;
        isImportant?: boolean;
        category?: string;
      }) {
        const { title, start, location, isImportant, category } = selection;
        
        let date = '날짜 미정';
        if (start) {
          try {
            const dateObj = typeof start === 'string' ? new Date(start) : start;
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
          category === 'campaign' ? '유세' : '';
        
        return {
          title: isImportant ? `⭐ ${title}` : title,
          subtitle: `[${categoryLabel}] ${date} - ${location || '장소 미정'}`
        };
      }
    }
  }