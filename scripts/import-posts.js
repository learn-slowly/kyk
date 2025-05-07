#!/usr/bin/env node

// CSV 파일을 Sanity 스튜디오로 가져오는 스크립트
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

// Sanity 클라이언트 설정
const client = createClient({
  projectId: 'qpvtzhxq',
  dataset: 'production',
  // 환경 변수가 없으면 직접 토큰을 사용합니다
  token: 'skLWA8vJlfIL2Logzf52MWzpocMgYkdir20sUyXXe3uXq4zAI5bbLmP2BykQYAXPhpoVi8u4QNuN5DIy7IfPAtXnPBxK74vNrGg4nmiEcDU6RfKnS7oX2bJ4E4IIRmDUd8hnkIK1fGVNeq4VP1o9HCGnr6sQzcD01kIMk6i9M0fDbt3Aa8TU',
  apiVersion: '2023-05-03',
  useCdn: false,
});

// 토큰 검증 - 클라이언트 연결 확인
client.fetch('*[_type == "post"][0]')
  .then(result => {
    console.log('Sanity 연결 확인:', result ? '성공' : '실패 (데이터 없음)');
  })
  .catch(err => {
    console.error('Sanity 연결 오류:', err.message);
  });

// CSV 파일 경로
const postsFile = path.join(__dirname, '../posts.csv');

// 게시물 데이터 저장을 위한 배열
const posts = [];

// 안전하게 날짜를 파싱하는 함수
function parseDate(dateString) {
  if (!dateString) return new Date();
  
  try {
    // 따옴표로 묶인 문자열에서 따옴표 제거
    const cleanDateString = dateString.replace(/^"|"$/g, '');
    
    // 한국식 날짜 형식 (YYYYMMDD HH:MM:SS)
    const koreanFormatMatch = cleanDateString.match(/^(\d{4})(\d{2})(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/);
    if (koreanFormatMatch) {
      const [_, year, month, day, hour, minute, second] = koreanFormatMatch;
      const dateStr = `${year}-${month}-${day}T${hour}:${minute}:${second}+09:00`;
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    
    // 한국식 날짜 형식 (YYYYMMDD HH:MM) - 초 없는 버전
    const koreanFormatNoSecMatch = cleanDateString.match(/^(\d{4})(\d{2})(\d{2})\s+(\d{2}):(\d{2})$/);
    if (koreanFormatNoSecMatch) {
      const [_, year, month, day, hour, minute] = koreanFormatNoSecMatch;
      const dateStr = `${year}-${month}-${day}T${hour}:${minute}:00+09:00`;
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    
    // 표준 ISO 형식 시도
    const date = new Date(cleanDateString);
    if (!isNaN(date.getTime())) {
      return date;
    }
    
    // 다른 형식 시도...
    
    // 기본값
    console.warn(`날짜 파싱 실패: ${dateString}, 현재 날짜를 사용합니다.`);
    return new Date();
  } catch (error) {
    console.error(`날짜 파싱 오류: ${dateString}`, error);
    return new Date();
  }
}

// 진행 상황 표시용 카운터
let processedCount = 0;

// CSV 파일 읽기
fs.createReadStream(postsFile)
  .pipe(csv())
  .on('data', (data) => {
    processedCount++;
    
    if (processedCount <= 3) {
      console.log('원본 데이터 행 샘플:', data); // 처음 세 행만 샘플로 출력
    } else if (processedCount === 4) {
      console.log('더 많은 데이터 행 처리 중...');
    }
    
    // 각 행을 Sanity 문서 형식으로 변환
    try {
      const dateString = data.publishedAt || data.date;
      const publishedDate = parseDate(dateString);
      
      const post = {
        _type: 'post',
        title: data.title,
        slug: { _type: 'slug', current: data.slug || slugify(data.title) },
        excerpt: data.excerpt,
        body: data.body || convertToBlockContent(data.content),
        publishedAt: publishedDate.toISOString(),
        mainImage: data.mainImage ? { _type: 'image', asset: { _ref: data.mainImage } } : undefined,
        category: data.category || 'statement', // 기본값 추가
        summary: data.summary || '',
        source: data.source || ''
      };
      posts.push(post);
    } catch (error) {
      console.error('데이터 변환 오류:', error, data);
    }
  })
  .on('end', async () => {
    console.log(`${posts.length}개의 게시물을 가져옵니다...`);

    try {
      // 데이터 하나씩 생성 (트랜잭션 대신)
      let successCount = 0;
      let failCount = 0;
      
      // 배치 처리를 위한 설정
      const batchSize = 10; // 한 번에 처리할 게시물 수
      let i = 0;
      
      while (i < posts.length) {
        const batch = posts.slice(i, i + batchSize);
        const promises = batch.map(async (post) => {
          try {
            const result = await client.create(post);
            if (result && result._id) {
              successCount++;
              return { success: true, title: post.title, id: result._id };
            }
            return { success: false, title: post.title, error: '결과 ID가 없음' };
          } catch (itemError) {
            failCount++;
            return { success: false, title: post.title, error: itemError.message };
          }
        });
        
        const results = await Promise.all(promises);
        
        // 처리 결과 로깅 (첫 번째 배치만 자세히 로깅)
        if (i === 0) {
          results.forEach(result => {
            if (result.success) {
              console.log(`게시물 생성 성공: ${result.title} (ID: ${result.id})`);
            } else {
              console.error(`게시물 생성 실패: ${result.title} - ${result.error}`);
            }
          });
        } else if (i === batchSize) {
          console.log(`계속해서 게시물 처리 중... (${successCount}개 완료)`);
        }
        
        // 50개마다 진행 상황 로깅
        if (successCount % 50 === 0 && successCount > 0) {
          console.log(`진행 상황: ${successCount}개 게시물 처리 완료...`);
        }
        
        i += batchSize;
      }
      
      console.log(`성공적으로 ${successCount}개의 게시물을 가져왔습니다.`);
      if (failCount > 0) {
        console.log(`${failCount}개의 게시물을 가져오는데 실패했습니다.`);
      }
    } catch (error) {
      console.error('데이터 가져오기 오류:', error.message);
    }
  });

// 제목을 슬러그로 변환하는 함수
function slugify(text) {
  if (!text) return 'post-' + Date.now();
  
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // 공백을 대시로 변환
    .replace(/[^\w\-]+/g, '') // 영숫자 및 대시가 아닌 문자 제거
    .replace(/\-\-+/g, '-') // 여러 개의 대시를 단일 대시로 변환
    .replace(/^-+/, '') // 시작 부분의 대시 제거
    .replace(/-+$/, ''); // 끝 부분의 대시 제거
}

// 일반 텍스트를 Sanity 블록 콘텐츠로 변환하는 함수
function convertToBlockContent(text) {
  if (!text) return [];
  
  return [
    {
      _type: 'block',
      style: 'normal',
      _key: new Date().getTime().toString(),
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: new Date().getTime().toString() + '1',
          text: text,
          marks: []
        }
      ]
    }
  ];
} 