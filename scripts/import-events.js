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
client.fetch('*[_type == "event"][0]')
  .then(result => {
    console.log('Sanity 연결 확인:', result ? '성공' : '실패 (데이터 없음)');
  })
  .catch(err => {
    console.error('Sanity 연결 오류:', err.message);
  });

// CSV 파일 경로
const eventsFile = path.join(__dirname, '../events.csv');

// 이벤트 데이터 저장을 위한 배열
const events = [];

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
fs.createReadStream(eventsFile)
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
      const startDate = parseDate(data.start);
      const endDate = data.end ? parseDate(data.end) : new Date(startDate.getTime() + 60 * 60 * 1000);
      
      const event = {
        _type: 'event',
        title: data.title,
        description: data.description,
        category: data.category,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        location: data.location,
        isImportant: data.isImportant === 'true' || data.isImportant === 'TRUE',
      };
      events.push(event);
    } catch (error) {
      console.error('데이터 변환 오류:', error, data);
    }
  })
  .on('end', async () => {
    console.log(`${events.length}개의 이벤트를 가져옵니다...`);
    
    try {
      // 데이터 하나씩 생성 (트랜잭션 대신)
      let successCount = 0;
      let failCount = 0;
      
      for (const event of events) {
        try {
          const result = await client.create(event);
          if (result && result._id) {
            successCount++;
            if (successCount <= 5) {
              console.log(`이벤트 생성 성공: ${event.title} (ID: ${result._id})`);
            } else if (successCount === 6) {
              console.log('더 많은 이벤트 생성 중...');
            }
          }
        } catch (itemError) {
          failCount++;
          console.error(`이벤트 생성 실패: ${event.title}`, itemError.message);
        }
      }
      
      console.log(`성공적으로 ${successCount}개의 이벤트를 가져왔습니다.`);
      if (failCount > 0) {
        console.log(`${failCount}개의 이벤트를 가져오는데 실패했습니다.`);
      }
    } catch (error) {
      console.error('데이터 가져오기 오류:', error.message);
    }
  }); 