import { Rule } from '@sanity/types';
import { defineType } from 'sanity';

interface PreviewSelection {
  title?: string;
  category?: string;
  publishedAt?: string | Date;
  media?: {
    asset: {
      url: string;
    };
  };
  author?: string;
}

const postSchema = defineType({
  name: 'post',
  title: '뉴스',
  type: 'document',
  fields: [
    { name: 'title', title: '제목', type: 'string' },
    { name: 'slug', title: '슬러그', type: 'slug', options: { source: 'title', maxLength: 96 } },
    { 
      name: 'category', 
      title: '카테고리', 
      type: 'string', 
      options: { 
        list: [
          {title: '성명', value: 'statement'},
          {title: '오늘의 영국', value: 'today'},
          {title: '언론 속 영국', value: 'media'}
        ] 
      },
      initialValue: 'statement'
    },
    { name: 'body', title: '내용', type: 'text' },
    { name: 'publishedAt', title: '게시일', type: 'datetime', initialValue: new Date().toISOString() },
    { name: 'summary', title: '요약', type: 'text', description: '목록에 표시될 요약 내용입니다. 입력하지 않으면 본문에서 자동 추출됩니다.' },
    { 
      name: 'source', 
      title: '출처', 
      type: 'string', 
      description: '언론 출처 또는 링크 (언론 속 영국 카테고리에 필요)'
    },
    { 
      name: 'author', 
      title: '작성자', 
      type: 'string',
      initialValue: '권영국후보',
      description: '게시물 작성자, 기본값은 권영국후보'
    },
    { 
      name: 'thumbnail', 
      title: '대표 이미지', 
      type: 'image',
      options: {
        hotspot: true
      }
    }
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      publishedAt: 'publishedAt',
      media: 'thumbnail',
      author: 'author'
    },
    prepare(selection) {
      const { title = '', category = '', publishedAt = '', media, author = '' } = selection;
      
      const categoryLabel = 
        category === 'statement' ? '성명' :
        category === 'today' ? '오늘의 영국' :
        category === 'media' ? '언론 속 영국' : '';
      
      let date = '날짜 미정';
      if (publishedAt) {
        try {
          const dateObj = new Date(publishedAt);
          if (!isNaN(dateObj.getTime())) {
            date = dateObj.toLocaleDateString('ko-KR');
          }
        } catch (error) {
          console.error('날짜 변환 오류:', error);
        }
      }
      
      return {
        title,
        subtitle: `[${categoryLabel}] ${date} | ${author || '권영국후보'}`,
        media
      }
    }
  }
});

export default postSchema;