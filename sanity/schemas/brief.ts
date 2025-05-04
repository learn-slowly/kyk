export default {
  name: 'brief',
  title: '브리핑룸',
  type: 'document',
  description: '브리핑, 기자회견, 성명서 등 공식 브리핑 자료를 관리합니다.',
  fields: [
    {
      name: 'title',
      title: '제목',
      type: 'string',
      description: '브리핑 제목을 입력하세요',
      validation: (Rule: any) => Rule.required().max(80).warning('제목은 간결하게 작성하세요'),
    },
    {
      name: 'slug',
      title: '고유 주소',
      description: '자동으로 생성되는 웹주소입니다. 수정이 필요하면 "생성" 버튼을 누른 후 수정하세요',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'briefType',
      title: '브리핑 유형',
      description: '브리핑 유형을 선택하세요',
      type: 'string',
      options: {
        list: [
          { title: '기자회견', value: 'press_conference' },
          { title: '성명서', value: 'statement' },
          { title: '입장문', value: 'position' },
          { title: '브리핑 자료', value: 'briefing' },
          { title: '기타', value: 'other' },
        ],
        layout: 'radio',
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'publishedAt',
      title: '발행일',
      description: '브리핑 날짜를 선택하세요',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'location',
      title: '장소',
      description: '브리핑이 진행된 장소 (예: 당사 1층 브리핑룸)',
      type: 'string',
    },
    {
      name: 'mainImage',
      title: '대표 이미지',
      description: '브리핑에 표시될 대표 이미지를 업로드하세요 (권장 비율: 16:9)',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'summary',
      title: '요약',
      description: '브리핑 내용의 간략한 요약을 입력하세요 (최대 300자)',
      type: 'text',
      rows: 3,
      validation: (Rule: any) => Rule.max(300).warning('요약은 간결하게 작성하세요'),
    },
    {
      name: 'content',
      title: '본문 내용',
      description: '브리핑 전문을 작성하세요.',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: '일반 텍스트', value: 'normal'},
            {title: '제목 1', value: 'h2'},
            {title: '제목 2', value: 'h3'},
            {title: '인용문', value: 'blockquote'},
          ],
          marks: {
            decorators: [
              {title: '굵게', value: 'strong'},
              {title: '기울임', value: 'em'},
              {title: '밑줄', value: 'underline'},
            ],
          },
        },
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: '이미지 설명',
              description: '이미지에 대한 설명을 입력하세요',
              options: {
                isHighlighted: true,
              },
            },
            {
              name: 'alt',
              type: 'string',
              title: '대체 텍스트',
              description: '시각장애인을 위한 이미지 설명을 입력하세요',
              options: {
                isHighlighted: true,
              },
            },
          ],
        },
        {
          type: 'file',
          name: 'attachment',
          title: '첨부파일',
          description: 'PDF나 문서 파일을 첨부할 수 있습니다',
          fields: [
            {
              name: 'description',
              type: 'string',
              title: '파일 설명',
              description: '첨부파일에 대한 설명을 입력하세요',
            }
          ]
        }
      ],
    },
    {
      name: 'videoUrl',
      title: '비디오 URL',
      description: '브리핑 영상이 있다면 URL을 입력하세요 (유튜브, 비메오 등)',
      type: 'url',
    },
  ],
  preview: {
    select: {
      title: 'title',
      briefType: 'briefType',
      media: 'mainImage',
      date: 'publishedAt',
    },
    prepare({ title, briefType, media, date }: any) {
      const typeLabels: Record<string, string> = {
        press_conference: '기자회견',
        statement: '성명서',
        position: '입장문',
        briefing: '브리핑 자료',
        other: '기타',
      };
      
      return {
        title,
        subtitle: `${typeLabels[briefType] || briefType} (${date || '날짜 미정'})`,
        media,
      };
    },
  },
  orderings: [
    {
      title: '발행일 (최신순)',
      name: 'publishedDateDesc',
      by: [
        {field: 'publishedAt', direction: 'desc'}
      ]
    },
  ],
} 