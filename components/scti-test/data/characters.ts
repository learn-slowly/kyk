import { PolicyCharacter } from '../types';

const characters: PolicyCharacter[] = [
  {
    id: 'taxman',
    name: '세금 정의맨',
    slogan: '공정한 부담으로 더 나은 사회를',
    description: '저는 공정한 세금 제도를 통해 사회 불평등을 해소하고자 합니다. 부자와 대기업에게 더 많은 세금을 걷어서 공공 서비스와 복지에 투자해야 한다고 생각합니다.',
    imageUrl: '/images/scti/char01.png',
    traits: ['정의로움', '합리적', '균형 중시'],
    goodMatches: ['sharer', 'careman'],
  },
  {
    id: 'laborman',
    name: '노동이 권리다',
    slogan: '모든 일하는 사람들의 권리를 지킵니다',
    description: '저는 모든 노동자의 권리를 보호하고 좋은 일자리 창출을 중요시합니다. 고용 형태에 관계없이 동등한 권리와 안전한 근로 환경을 보장받아야 한다고 믿습니다.',
    imageUrl: '/images/scti/char02.png',
    traits: ['연대감', '포용적', '단호함'],
    goodMatches: ['diversityman', 'houseman'],
  },
  {
    id: 'sharer',
    name: '나눔이',
    slogan: '함께 나누면 모두가 행복합니다',
    description: '저는 사회적 부를 공정하게 분배하여 함께 잘 사는 사회를 만들고자 합니다. 경제 성장의 혜택이 모든 사람에게 골고루 돌아가야 한다고 생각합니다.',
    imageUrl: '/images/scti/char03.png',
    traits: ['관대함', '배려심', '공동체 의식'],
    goodMatches: ['taxman', 'careman'],
  },
  {
    id: 'diversityman',
    name: '다양성 수호자',
    slogan: '모두가 존중받는 세상을 만듭니다',
    description: '저는 모든 사람이 차별 없이 존중받는 사회를 만들고자 합니다. 성별, 인종, 종교, 성적 지향 등에 관계없이 모두가 평등한 권리를 누려야 한다고 믿습니다.',
    imageUrl: '/images/scti/char04.png',
    traits: ['열린 마음', '포용적', '진보적'],
    goodMatches: ['laborman', 'learnman'],
  },
  {
    id: 'earthman',
    name: '지구지킴이',
    slogan: '우리의 미래, 지금 행동합니다',
    description: '저는 기후위기 대응과 환경 보호를 최우선 과제로 생각합니다. 지속가능한 발전과 미래 세대를 위한 책임 있는 정책이 필요하다고 믿습니다.',
    imageUrl: '/images/scti/char05.png',
    traits: ['책임감', '미래지향적', '실용적'],
    goodMatches: ['peaceman', 'learnman'],
  },
  {
    id: 'houseman',
    name: '집지기',
    slogan: '모두에게 안정된 보금자리를',
    description: '저는 모든 사람이 안정된 주거 환경에서 살 권리가 있다고 믿습니다. 부동산 투기를 억제하고 공공임대주택을 확대하여 주거 불평등을 해소하고자 합니다.',
    imageUrl: '/images/scti/char06.png',
    traits: ['안정감', '신뢰', '보호자'],
    goodMatches: ['laborman', 'careman'],
  },
  {
    id: 'constitutionman',
    name: '헌법수호자',
    slogan: '더 강한 민주주의, 더 나은 공화국',
    description: '저는 견고한 민주주의 제도와 헌법적 가치를 수호하고자 합니다. 권력 분립, 법치주의, 시민 참여를 통해 더 나은 민주주의를 만들어가야 한다고 믿습니다.',
    imageUrl: '/images/scti/char07.png',
    traits: ['원칙적', '정의로움', '비전'],
    goodMatches: ['peaceman', 'diversityman'],
  },
  {
    id: 'careman',
    name: '돌봄이',
    slogan: '생애주기 전체를 함께 돌봅니다',
    description: '저는 아동부터 노인까지 모든 세대가 필요한 돌봄을 받을 수 있는 사회를 만들고자 합니다. 돌봄 노동의 가치를 인정하고 사회적 약자를 보호해야 한다고 믿습니다.',
    imageUrl: '/images/scti/char08.png',
    traits: ['따뜻함', '공감능력', '헌신적'],
    goodMatches: ['sharer', 'taxman'],
  },
  {
    id: 'learnman',
    name: '배움이',
    slogan: '경쟁 대신 성장을, 행복한 배움의 시간',
    description: '저는 모든 아이가 행복하게 배우고 성장할 수 있는 교육 환경을 만들고자 합니다. 입시 경쟁보다 다양한 재능을 키우는 교육이 필요하다고 믿습니다.',
    imageUrl: '/images/scti/char09.png',
    traits: ['호기심', '창의적', '긍정적'],
    goodMatches: ['diversityman', 'earthman'],
  },
  {
    id: 'peaceman',
    name: '평화사절단',
    slogan: '대화와 협력으로 한반도의 평화를',
    description: '저는 한반도와 세계의 평화를 위해 대화와 협력이 중요하다고 믿습니다. 국제 문제는 외교와 다자간 협력을 통해 해결해야 한다고 생각합니다.',
    imageUrl: '/images/scti/char10.png',
    traits: ['중재자', '냉철함', '대화 중시'],
    goodMatches: ['earthman', 'constitutionman'],
  },
];

// 기승정 권영국의 정책과 연결하기 위한 함수
export function getKwonPolicies(characterId: string): string[] {
  const policyMap: {[key: string]: string[]} = {
    'taxman': [
      '불로소득 과세 강화로 공정한 세금 체계 구축',
      '대기업 법인세 정상화로 공정한 시장질서 확립',
      '금융소득 과세 강화로 부의 재분배 촉진',
    ],
    'laborman': [
      '특수고용 노동자 권리 보장 및 산재보험 확대',
      '주 4.5일제 시범 도입으로 일과 삶의 균형 실현',
      '최저임금 실질적 인상으로 노동자 생활 안정',
    ],
    'sharer': [
      '보편적 기본소득 단계적 도입으로 소득 불평등 완화',
      '복지 사각지대 해소를 위한 사회안전망 확충',
      '공공서비스 확대로 모두가 누리는 사회적 부 창출',
    ],
    'diversityman': [
      '차별금지법 제정으로 모든 시민의 평등권 보장',
      '성평등 정책 강화로 성별 격차 해소',
      '장애인 권리 증진 및 접근성 향상 정책',
    ],
    'earthman': [
      '2050 탄소중립 로드맵 실천과 녹색 일자리 창출',
      '재생에너지 전환 가속화로 지속가능한 미래 준비',
      '기후위기 대응을 위한 환경 규제 합리화',
    ],
    'houseman': [
      '공공임대주택 대폭 확대로 주거 안정성 확보',
      '부동산 투기 근절 및 실거주자 중심 주택 정책',
      '청년 주거 지원 확대로 주거비 부담 경감',
    ],
    'constitutionman': [
      '권력기관 개혁으로 견제와 균형의 민주주의 실현',
      '직접 민주주의 요소 강화로 시민 참여 확대',
      '지방분권 강화로 지역 맞춤형 발전 도모',
    ],
    'careman': [
      '국공립 돌봄시설 확충으로 돌봄 공공성 강화',
      '노인 돌봄 서비스 확대로 존엄한 노후 보장',
      '아동 돌봄 국가책임제로 양육 부담 경감',
    ],
    'learnman': [
      '입시 경쟁 완화 및 교육 다양성 확대',
      '평생교육 체계 강화로 변화하는 사회 대응',
      '교육 불평등 해소를 위한 교육 복지 확대',
    ],
    'peaceman': [
      '남북관계 개선을 위한 대화 채널 복원',
      '동북아 다자안보협력체제 구축 추진',
      '평화경제를 통한 한반도 공동 번영 모색',
    ],
  };
  
  return policyMap[characterId] || [];
}

export default characters; 