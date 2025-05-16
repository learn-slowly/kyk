import { defineType } from 'sanity';

const policySchema = defineType({
  name: 'policy',
  title: '정책',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: '제목',
      type: 'string',
      validation: (rule) => rule.required(),
    },
    {
      name: 'description',
      title: '설명',
      type: 'text',
      validation: (rule) => rule.required(),
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
              title: '제목',
              type: 'string',
              validation: (rule) => rule.required(),
            },
            {
              name: 'description',
              title: '설명',
              type: 'text',
              validation: (rule) => rule.required(),
            },
          ],
        },
      ],
      validation: (rule) => rule.required().min(1),
    },
    {
      name: 'color',
      title: '배경 색상',
      type: 'string',
      options: {
        list: [
          { title: '빨간색', value: 'linear-gradient(135deg, #FF6B6B 0%, #FF8787 100%)' },
          { title: '주황색', value: 'linear-gradient(135deg, #FFA94D 0%, #FFD8A8 100%)' },
          { title: '노란색', value: 'linear-gradient(135deg, #FFD43B 0%, #FFF3BF 100%)' },
          { title: '초록색', value: 'linear-gradient(135deg, #69DB7C 0%, #B2F2BB 100%)' },
          { title: '민트색', value: 'linear-gradient(135deg, #38D9A9 0%, #96F2D7 100%)' },
          { title: '하늘색', value: 'linear-gradient(135deg, #4DABF7 0%, #A5D8FF 100%)' },
          { title: '파란색', value: 'linear-gradient(135deg, #4C6EF5 0%, #BAC8FF 100%)' },
          { title: '보라색', value: 'linear-gradient(135deg, #7950F2 0%, #E5DBFF 100%)' },
          { title: '분홍색', value: 'linear-gradient(135deg, #E64980 0%, #FFD8E4 100%)' },
        ],
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
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
    prepare(selection) {
      const { title = '', subtitle = '' } = selection;
      return {
        title,
        subtitle: subtitle.length > 50 ? subtitle.substring(0, 50) + '...' : subtitle,
      };
    },
  },
});

export default policySchema;
