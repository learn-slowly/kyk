export default {
  name: 'policy',
  title: '정책 (아코디언용)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: '정책 제목',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: '정책 분야 (중복 선택 가능)',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          { title: '재정, 경제 분야', value: 'finance_economy' },
          { title: '복지 분야', value: 'welfare' },
          { title: '노동 분야', value: 'labor' },
          { title: '교육 분야', value: 'education' },
          { title: '장애 분야', value: 'disability' },
          { title: '사회 안전 분야', value: 'social_safety' },
          { title: '여성 분야', value: 'women' },
          { title: '가족 분야', value: 'family' },
          { title: '이주 분야', value: 'migration' },
          { title: '소수자 분야', value: 'minority' },
          { title: '보건의료 분야', value: 'health_medical' },
          { title: '환경 분야', value: 'environment' },
          { title: '산업 분야', value: 'industry' },
          { title: '정치, 행정, 사법 분야', value: 'politics_admin_justice' },
          { title: '문화 분야', value: 'culture' },
          { title: '스포츠 분야', value: 'sports' },
          { title: '국방, 통일 분야', value: 'defense_unification' },
          { title: '외교, 통상 분야', value: 'diplomacy_trade' },
          { title: '기타', value: 'etc' }
        ],
        layout: 'tags'
      },
    },
    {
      name: 'body',
      title: '상세 내용',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [{ title: 'Bullet', value: 'bullet' }, { title: 'Number', value: 'number' }],
          marks: {
            decorators: [{ title: 'Strong', value: 'strong' }, { title: 'Emphasis', value: 'em' }],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'URL',
                fields: [{ name: 'href', type: 'url', title: 'URL' }],
              },
            ],
          },
        },
        { type: 'image', options: { hotspot: true } },
      ],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'orderRank',
      title: '정렬 순서 (선택)',
      type: 'number',
      description: '숫자가 낮을수록 목록이나 아코디언 상단에 표시됩니다. 입력하지 않으면 제목순 또는 날짜순으로 정렬될 수 있습니다.',
    },
    {
      name: 'publishedAt',
      title: '발표일 (선택)',
      type: 'datetime',
    },
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
    },
    prepare(selection: { title?: string; category?: string[] }) {
      const { title, category } = selection;
      const categoryDisplay = category && category.length > 0
        ? category.map(c => 
            (c.charAt(0).toUpperCase() + c.slice(1)).replace(/_/g, ' ')
          ).join(', ') 
        : '미분류';
      return {
        title: title,
        subtitle: `분야: ${categoryDisplay}`,
      };
    },
  },
}; 