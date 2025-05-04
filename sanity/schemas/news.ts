export default {
  name: 'news',
  title: '뉴스&미디어',
  type: 'document',
  description: '뉴스, 보도자료, 연설문 등을 관리합니다.',
  fields: [
    {
      name: 'title',
      title: '제목',
      type: 'string',
      description: '뉴스/보도자료의 제목을 입력하세요',
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
      name: 'type',
      title: '유형',
      description: '콘텐츠 유형을 선택하세요',
      type: 'string',
      options: {
        list: [
          { title: '뉴스', value: 'news' },
          { title: '보도자료', value: 'press' },
          { title: '연설문', value: 'speech' },
          { title: '미디어 출연', value: 'media' },
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
      name: 'mainImage',
      title: '대표 이미지',
      description: '뉴스에 표시될 대표 이미지를 업로드하세요 (권장 비율: 16:9)',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'summary',
      title: '요약',
      description: '뉴스의 간략한 요약을 입력하세요 (최대 300자)',
      type: 'text',
      rows: 3,
      validation: (Rule: any) => Rule.max(300).warning('요약은 간결하게 작성하세요'),
    },
    {
      name: 'content',
      title: '본문 내용',
      description: '본문 내용을 작성하세요. 문단 구분은 Enter로, 제목은 위 메뉴에서 설정할 수 있습니다',
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
      description: '유튜브나 비메오 영상이 있다면 URL을 입력하세요 (선택사항)',
      type: 'url',
    },
  ],
  preview: {
    select: {
      title: 'title',
      type: 'type',
      media: 'mainImage',
      date: 'publishedAt',
    },
    prepare({ title, type, media, date }: any) {
      const typeLabels: Record<string, string> = {
        news: '뉴스',
        press: '보도자료',
        speech: '연설문',
        media: '미디어 출연',
      };
      
      return {
        title,
        subtitle: `${typeLabels[type] || type} - ${date || '날짜 미정'}`,
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