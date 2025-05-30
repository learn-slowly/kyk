#!/usr/bin/env node

// Sanity 데이터베이스에서 모든 게시판/뉴스 데이터를 삭제하는 스크립트
const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

// Sanity 클라이언트 설정 - import-events.js와 동일한 설정 사용
const client = createClient({
  projectId: 'qpvtzhxq',
  dataset: 'production',
  // 환경 변수가 없으면 직접 토큰을 사용합니다
  token: 'skLWA8vJlfIL2Logzf52MWzpocMgYkdir20sUyXXe3uXq4zAI5bbLmP2BykQYAXPhpoVi8u4QNuN5DIy7IfPAtXnPBxK74vNrGg4nmiEcDU6RfKnS7oX2bJ4E4IIRmDUd8hnkIK1fGVNeq4VP1o9HCGnr6sQzcD01kIMk6i9M0fDbt3Aa8TU',
  apiVersion: '2023-05-03',
  useCdn: false,
});

// 토큰 검증 - 클라이언트 연결 확인
console.log('Sanity에 연결 중...');
client.fetch('*[_type == "post" || _type == "statement"][0]')
  .then(result => {
    console.log('Sanity 연결 확인:', result ? '성공' : '실패 (데이터 없음)');
    if (result) {
      deleteAllPosts();
    } else {
      console.log('삭제할 게시물 데이터가 없습니다.');
    }
  })
  .catch(err => {
    console.error('Sanity 연결 오류:', err.message);
  });

// 모든 게시물 데이터 삭제 함수
async function deleteAllPosts() {
  try {
    // 모든 게시물 문서의 ID 가져오기 (post와 statement 타입 모두)
    const postIds = await client.fetch('*[_type == "post" || _type == "statement"]._id');
    console.log(`총 ${postIds.length}개의 게시물 문서를 찾았습니다.`);

    if (postIds.length === 0) {
      console.log('삭제할 게시물 데이터가 없습니다.');
      return;
    }

    // 각 게시물 문서 삭제
    let deletedCount = 0;
    for (const id of postIds) {
      try {
        await client.delete(id);
        deletedCount++;
        console.log(`게시물 삭제 성공: ID ${id}`);
      } catch (error) {
        console.error(`게시물 삭제 실패 (ID: ${id}):`, error.message);
      }
    }

    console.log(`총 ${deletedCount}개의 게시물을 성공적으로 삭제했습니다.`);
  } catch (error) {
    console.error('게시물 삭제 중 오류 발생:', error.message);
  }
} 