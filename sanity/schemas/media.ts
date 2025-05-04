export default {
  name: 'media',
  title: '미디어에서 본 권영국',
  type: 'document',
  description: '언론 보도, 인터뷰, TV 출연 등 미디어 관련 콘텐츠를 관리합니다.',
  fields: [
    {
      name: 'title',
      title: '제목',
      type: 'string',
      description: '미디어 콘텐츠의 제목을 입력하세요',
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
      name: 'mediaType',
      title: '미디어 유형',
      description: '미디어 유형을 선택하세요',
      type: 'string',
      options: {
        list: [
          { title: 'TV 출연', value: 'tv' },
          { title: '신문/잡지', value: 'press' },
          { title: '라디오', value: 'radio' },
          { title: '온라인 매체', value: 'online' },
          { title: '기타', value: 'other' },
        ],
        layout: 'radio',
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'publishedAt',
      title: '발행일',
      description: '발행 날짜를 선택하세요',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'mediaSource',
      title: '출처',
      description: '미디어 출처 (예: KBS, 중앙일보 등)',
      type: 'string',
    },
    {
      name: 'mainImage',
      title: '대표 이미지',
      description: '미디어에 표시될 대표 이미지를 업로드하세요 (권장 비율: 16:9)',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'summary',
      title: '요약',
      description: '미디어 내용의 간략한 요약을 입력하세요 (최대 300자)',
      type: 'text',
      rows: 3,
      validation: (Rule: any) => Rule.max(300).warning('요약은 간결하게 작성하세요'),
    },
    {
      name: 'content',
      title: '본문 내용',
      description: '본문 내용을 작성하세요.',
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
      ],
    },
    {
      name: 'videoUrl',
      title: '비디오 URL',
      description: '동영상이 있다면 URL을 입력하세요 (유튜브, 비메오 등)',
      type: 'url',
    },
    {
      name: 'externalUrl',
      title: '외부 링크',
      description: '원본 기사나 미디어 콘텐츠의 외부 링크가 있다면 입력하세요',
      type: 'url',
    },
  ],
  preview: {
    select: {
      title: 'title',
      mediaType: 'mediaType',
      media: 'mainImage',
      date: 'publishedAt',
      source: 'mediaSource',
    },
    prepare({ title, mediaType, media, date, source }: any) {
      const typeLabels: Record<string, string> = {
        tv: 'TV 출연',
        press: '신문/잡지',
        radio: '라디오',
        online: '온라인 매체',
        other: '기타',
      };
      
      return {
        title,
        subtitle: `${typeLabels[mediaType] || mediaType}${source ? ` - ${source}` : ''} (${date || '날짜 미정'})`,
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