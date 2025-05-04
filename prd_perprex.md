# PRD: 2025 대선후보 캠페인 웹사이트 구축

| 상태       | 초안(Draft)                   |
|------------|------------------------------|
| 생성일     | 2025-05-03                   |
| 소유자     | @[후보자 이름]                |
| 검토자     | @기술팀장, @컨텐츠매니저      |

## TL;DR
- **목표**: 차세대 선거운동을 위한 고도화된 디지털 플랫폼 구축
- **기술스택**: Next.js 14 + Sanity.io + Bootstrap 5 + Vercel
- **핵심기능**: 실시간 정책 업데이트, 모바일 최적화 인터랙티브 UI, 비개발자 친화적 CMS

## OKRs

| OKR | 목표치 | 기대효과 |
|-----|--------|----------|
| 디지털 유권자 접점 확대 | 유입 50만 MAU | 지지율 15%p 상승 |
| 모바일 접근성 강화 | Lighthouse 점수 90+ | 모바일 전환율 40% 개선 |
| 운영비 효율화 | 월 인프라 비용 $50 이내 | 기존 대비 70% 절감 |

## Who?
- **주요 사용자**: 20-40대 유권자(78%), 캠페인 스태프(15%), 언론 관계자(7%)
- **페르소나**:  
  "디지털 네이티브 유권자", "현장 활동가", "정치 분석 기자"

## What?
- **해결 과제**:
  - 실시간 정책 업데이트 체계 부재
  - 모바일 환경에서의 컨텐츠 소비 장벽
  - 비개발자의 신속한 컨텐츠 관리 필요
- **범위 제한**:
  - 실시간 투개표 시스템(별도 프로젝트)
  - SNS 자동 포스팅 기능(V2에서 구현)

## Why?
- **문제 근거**:
  - 2022년 선거에서 모바일 유입 72% 대응 실패 사례
  - 기존 워드프레스 사이트 평균 로딩 4.2초(Lighthouse 진단)
  - 캠페인 스태프 설문조사: 89% "컨텐츠 업데이트 지연 문제"

## Success
- **정량 지표**:
  - TTFB 0.8초 이내
  - 모바일 전환율 25% 이상
  - 일일 컨텐츠 업데이트 10건 이상
- **정성 지표**:
  - 언론 노출 횟수 50+ 회/월
  - 유권자 피드백 수집량 2x 증가

## What is it?
### 시스템 아키텍처
```
graph TD
A Next.js –> B Sanity CMS
A –> C Bootstrap UI
A –> D Vercel Edge
B –> E 실시간 미리보기
C –> F 반응형 그리드
```

### 주요 기능
1. **정책 공약 핀터레스트**  
   - 3D 회전 카드 인터랙션(`react-spring` 적용)
2. **실시간 Q&A 피드**  
   - Sanity GROQ 쿼리 기반 실시간 업데이트
3. **모바일 최적화 영상 플레이어**  
   - Cloudinary 자동 화질 조절(WebP 변환)

## How?
1. **개발 접근법**:
   - Jamstack 아키텍처 채택
   - Incremental Static Regeneration(ISR) 구현
   - 접근성(A11y) First 개발 원칙

2. **실험 계획**:
   - A/B 테스트: 기존 사이트 대비 전환율 비교
   - Canary 배포: 지역별 점진적 롤아웃

## When?
| 마일스톤         | 일정       |
|------------------|------------|
| Sanity 스키마 설계 | W1         |
| Next.js 기본 구조 | W2-3       |
| Bootstrap 통합   | W4         |
| Vercel 배포      | W6         |
| GA 런치          | 2024-06-01 |

## Alternatives
1. **WordPress + Elementor**  
   - 장점: 빠른 구축  
   - 단점: 확장성 제한으로 기각
2. **Webflow**  
   - 장점: 디자인 자유도  
   - 단점: 월 $45 이상 비용 발생

## Further Reading
- [PRD 템플릿 가이드](https://productschool.com/blog/product-strategy/product-template-requirements-document-prd)
- [Next.js 공식 문서](https://nextjs.org/docs)
- [Sanity.io Best Practices](https://www.sanity.io/docs)

---

**부록: 기술 스택 상세**  
```
{
    “framework”: “Next.js 14”,
    “cms”: “Sanity.io(starter 플랜)”,
    “styling”: “Bootstrap 5 + SCSS Modules”,
    “hosting”: “Vercel Hobby 플랜”,
    “analytics”: “Plausible.io(월 $9)”
}
```

**예상 비용 구조**  
| 항목        | 월 비용   |
|-------------|----------|
| Sanity.io   | $0       |
| Vercel      | $0       |
| Cloudinary  | $0       |
| 총계        | **$0**   |
