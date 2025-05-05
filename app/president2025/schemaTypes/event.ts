export default {
    name: 'event',
    title: '일정',
    type: 'document',
    fields: [
      { name: 'title', title: '일정명', type: 'string' },
      { name: 'description', title: '설명', type: 'text' },
      { name: 'start', title: '시작일시', type: 'datetime' },
      { name: 'end', title: '종료일시', type: 'datetime' },
      { name: 'location', title: '장소', type: 'string' },
      { name: 'isImportant', title: '중요 일정', type: 'boolean' }
    ]
  }