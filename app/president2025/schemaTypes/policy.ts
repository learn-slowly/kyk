import { Rule } from '@sanity/types';

const policy = {
  name: 'policy',
  title: '정책',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: '정책 제목',
      type: 'string',
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
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
};

export default policy; 