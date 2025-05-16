import { defineType } from 'sanity';

const policyGallerySchema = defineType({
  name: 'policyGallery',
  title: '분야별 세부정책',
  type: 'document',
  fields: [
    {
      name: 'category',
      title: '정책 분야',
      type: 'string',
      validation: (rule) => rule.required(),
      options: {
        list: [
          { title: '경제', value: 'economy' },
          { title: '노동', value: 'labor' },
          { title: '복지', value: 'welfare' },
          { title: '교육', value: 'education' },
          { title: '환경', value: 'environment' },
          { title: '인권', value: 'humanRights' },
          { title: '평화', value: 'peace' },
          { title: '민주주의', value: 'democracy' },
        ],
      },
    },
    {
      name: 'title',
      title: '정책 제목',
      type: 'string',
      validation: (rule) => rule.required(),
    },
    {
      name: 'description',
      title: '정책 설명',
      type: 'markdown',
      validation: (rule) => rule.required(),
    },
    {
      name: 'thumbnail',
      title: '대표 이미지',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    },
    {
      name: 'orderRank',
      title: '정렬 순서',
      type: 'number',
      description: '숫자가 낮을수록 앞에 표시됩니다.',
      validation: (rule) => rule.required(),
    },
    {
      name: 'relatedPolicies',
      title: '관련 정책',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'policyGallery' }],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'thumbnail',
    },
    prepare(selection) {
      const categoryLabels: { [key: string]: string } = {
        economy: '경제',
        labor: '노동',
        welfare: '복지',
        education: '교육',
        environment: '환경',
        humanRights: '인권',
        peace: '평화',
        democracy: '민주주의',
      };
      
      const { title = '', category = '', media } = selection;
      return {
        title,
        subtitle: `[${categoryLabels[category] || category}]`,
        media,
      };
    },
  },
});

export default policyGallerySchema; 