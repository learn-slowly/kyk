export default {
  name: 'youtube',
  title: '영상으로 권영국보기',
  type: 'document',
  description: '유튜브 영상 컨텐츠를 관리합니다.',
  fields: [
    {
      name: 'title',
      title: '제목',
      type: 'string',
      description: '영상의 제목을 입력하세요',
      validation: (Rule: any) => Rule.required().max(100).warning('제목은 간결하게 작성하세요'),
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
      name: 'youtubeUrl',
      title: '유튜브 URL',
      description: '유튜브 영상의 전체 URL을 입력하세요 (예: https://www.youtube.com/watch?v=xxxx)',
      type: 'url',
      validation: (Rule: any) => Rule.required().uri({
        scheme: ['http', 'https']
      }),
    },
    {
      name: 'youtubeId',
      title: '유튜브 ID',
      description: '유튜브 영상 ID를 입력하세요 (URL의 v= 이후 부분, 자동 입력되지 않는 경우만)',
      type: 'string',
    },
    {
      name: 'category',
      title: '카테고리',
      description: '영상의 카테고리를 선택하세요',
      type: 'string',
      options: {
        list: [
          { title: '후보 연설', value: 'speech' },
          { title: '인터뷰', value: 'interview' },
          { title: '언론 출연', value: 'media' },
          { title: '현장 방문', value: 'visit' },
          { title: '정책 발표', value: 'policy' },
          { title: '토론회', value: 'debate' },
          { title: '쇼츠', value: 'shorts' },
          { title: '기타', value: 'other' },
        ],
        layout: 'radio',
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'publishedAt',
      title: '발행일',
      description: '영상이 촬영된/발행된 날짜를 선택하세요',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'thumbnail',
      title: '썸네일 이미지',
      description: '유튜브 기본 썸네일 외에 사용할 이미지가 있다면 업로드하세요 (선택사항)',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'description',
      title: '영상 설명',
      description: '영상에 대한 설명을 입력하세요',
      type: 'text',
      rows: 4,
    },
    {
      name: 'featured',
      title: '메인 표시',
      description: '메인 페이지에 표시할 중요 영상인 경우 선택하세요',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'relatedLinks',
      title: '관련 링크',
      description: '이 영상과 관련된 다른 콘텐츠 링크',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: '제목',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule: any) => Rule.required(),
            }
          ]
        }
      ]
    },
    {
      name: 'tags',
      title: '태그',
      description: '영상과 관련된 태그를 입력하세요 (쉼표로 구분)',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      }
    },
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'thumbnail',
      date: 'publishedAt',
    },
    prepare({ title, category, media, date }: any) {
      const categoryLabels: Record<string, string> = {
        speech: '후보 연설',
        interview: '인터뷰',
        media: '언론 출연',
        visit: '현장 방문',
        policy: '정책 발표',
        debate: '토론회',
        shorts: '쇼츠',
        other: '기타',
      };
      
      return {
        title,
        subtitle: `${categoryLabels[category] || category} (${date || '날짜 미정'})`,
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
    {
      title: '중요도 (메인 표시)',
      name: 'featuredFirst',
      by: [
        {field: 'featured', direction: 'desc'},
        {field: 'publishedAt', direction: 'desc'}
      ]
    },
  ],
}

// URL에서 유튜브 ID 추출 함수
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  
  // 일반 유튜브 URL (https://www.youtube.com/watch?v=VIDEO_ID)
  let match = url.match(/youtube\.com\/watch\?v=([^&]+)/);
  if (match) return match[1];
  
  // 짧은 유튜브 URL (https://youtu.be/VIDEO_ID)
  match = url.match(/youtu\.be\/([^?]+)/);
  if (match) return match[1];
  
  // 임베드 URL (https://www.youtube.com/embed/VIDEO_ID)
  match = url.match(/youtube\.com\/embed\/([^?]+)/);
  if (match) return match[1];
  
  return null;
} 