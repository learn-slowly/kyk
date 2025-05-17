# Sanity로 인물 관계도 구현하기

## 1. Sanity 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 만들고 다음 내용을 추가합니다:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=qpvtzhxq
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-token-here
```

`your-token-here` 부분은 실제 API 토큰으로 교체해야 합니다.

## 2. Sanity API 토큰 생성하기

1. [Sanity 관리 페이지](https://www.sanity.io/manage)에 로그인합니다.
2. 해당 프로젝트를 선택합니다.
3. API 탭으로 이동합니다.
4. "Add API token" 버튼을 클릭합니다.
5. 토큰 이름을 지정하고 적절한 권한을 부여합니다 (최소 `viewer` 권한 필요).
6. 생성된 토큰을 `.env.local` 파일에 추가합니다.

## 3. CORS 설정하기

1. [Sanity 관리 페이지](https://www.sanity.io/manage)에서 프로젝트 선택
2. API 탭으로 이동
3. CORS Origins 섹션에서 "Add CORS origin" 클릭
4. 개발 환경을 위해 `http://localhost:3000`을 추가
5. "Allow credentials" 옵션을 활성화
6. 프로덕션 환경을 위해서는 실제 도메인도 추가

## 4. 인물 데이터 입력 방법

### 인물 추가하기

1. Sanity Studio(`/studio` 경로)에 접속합니다.
2. "구성원" 메뉴를 선택합니다.
3. "Create new" 버튼을 클릭하여 새 인물을 생성합니다.
4. 기본 정보(이름, 직책, 레벨)를 입력합니다.
5. "관계도에 표시" 옵션을 활성화합니다.
6. "후보자" 여부를 선택합니다.
7. "관계도 위치"에 x, y 좌표를 입력합니다 (필요시).
8. "설명(관계도용)"에 간략한 설명을 입력합니다.
9. "저장" 버튼을 클릭합니다.

### 인물 간 관계 설정하기

1. 원하는 인물의 편집 화면으로 이동합니다.
2. "관계" 섹션에서 "Add item" 버튼을 클릭합니다.
3. 다른 인물을 검색하여 선택합니다.
4. 여러 명의 인물을 추가할 수 있습니다.
5. "저장" 버튼을 클릭합니다.

## 5. 관계도 확인하기

1. 웹사이트의 `/profile/people` 경로로 이동합니다.
2. 인물 관계도가 표시됩니다.
3. 필터를 사용하여 특정 역할의 인물만 표시할 수 있습니다.
4. 인물 카드를 클릭하면 상세 정보를 볼 수 있습니다. 