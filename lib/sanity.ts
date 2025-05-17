import { client } from '@/sanity0000/lib/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

// 이미지 URL 빌더 설정
const builder = imageUrlBuilder(client);

// 이미지 URL 생성 함수
export const urlFor = (source: SanityImageSource) => {
  return builder.image(source);
};

// 관계도에 표시될 인물 정보 가져오기
export async function getPeopleForMap() {
  const query = `*[_type == "person" && showOnMap == true] {
    _id,
    name,
    position,
    description,
    photo,
    isCandidate,
    mapPosition,
    "relations": relations[]->._id
  } | order(isCandidate desc, order asc)`;
  
  const people = await client.fetch(query);
  
  // Sanity 형식의 데이터를 관계도 컴포넌트에 맞게 변환
  return people.map((person: any) => ({
    id: person._id,
    name: person.name,
    role: person.position,
    description: person.description || '설명이 없습니다.',
    image: person.photo ? urlFor(person.photo).url() : '/images/placeholder.jpg',
    position: person.mapPosition || { x: 0, y: 0 },
    relations: person.relations || [],
    isCandidate: person.isCandidate || false
  }));
}

// 모든 인물 정보 가져오기 (목록 페이지용)
export async function getAllPeople() {
  const query = `*[_type == "person"] {
    _id,
    name,
    position,
    quote,
    photo,
    level,
    hasVideo,
    videoUrl,
    order
  } | order(order asc)`;
  
  return client.fetch(query);
}

// 단일 인물 정보 가져오기 (상세 페이지용)
export async function getPerson(id: string) {
  const query = `*[_type == "person" && _id == $id][0]`;
  
  return client.fetch(query, { id });
} 