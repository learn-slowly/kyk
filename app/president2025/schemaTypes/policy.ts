<<<<<<< HEAD
export default {
  name: 'policy',
  title: '정책 (아코디언용)',
=======
import { Rule } from '@sanity/types';

const policy = {
  name: 'policy',
  title: '정책',
>>>>>>> dev
  type: 'document',
  fields: [
    {
      name: 'title',
      title: '정책 제목',
      type: 'string',
<<<<<<< HEAD
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
=======
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'description',
      title: '간단 설명',
      type: 'text',
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'color',
      title: '카드 색상',
      type: 'string',
      options: {
        list: [
          {
            title: '푸른 바다 🌊',
            value: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          },
          {
            title: '봄 하늘 🌤',
            value: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
          },
          {
            title: '따뜻한 햇살 ☀️',
            value: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
          },
          {
            title: '신선한 숲 🌳',
            value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
          },
          {
            title: '차분한 저녁 🌆',
            value: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
          },
          {
            title: '활기찬 아침 🌅',
            value: 'linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)',
          },
          {
            title: '깊은 밤 🌙',
            value: 'linear-gradient(135deg, #141e30 0%, #243b55 100%)',
          },
          {
            title: '보라빛 꿈 💜',
            value: 'linear-gradient(135deg, #834d9b 0%, #d04ed6 100%)',
          },
          {
            title: '맑은 하늘 ⛅',
            value: 'linear-gradient(135deg, #00c6fb 0%, #005bea 100%)',
          },
          {
            title: '황금빛 들판 🌾',
            value: 'linear-gradient(135deg, #FFD200 0%, #F7971E 100%)',
          },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'order',
      title: '순서',
      type: 'number',
      validation: (rule: Rule) => rule.required().min(1).max(10),
    },
    {
      name: 'detailPolicies',
      title: '세부 정책',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: '세부 정책 제목',
              type: 'string',
              validation: (rule: Rule) => rule.required(),
            },
            {
              name: 'description',
              title: '세부 내용',
              type: 'markdown',
              validation: (rule: Rule) => rule.required(),
            },
            {
              name: 'image',
              title: '관련 이미지',
              type: 'image',
              options: {
                hotspot: true,
              },
            },
          ],
        },
      ],
      validation: (rule: Rule) => rule.required().min(1),
>>>>>>> dev
    },
  ],
  preview: {
    select: {
      title: 'title',
<<<<<<< HEAD
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
=======
      subtitle: 'description',
    },
  },
};

export default policy; 
>>>>>>> dev
