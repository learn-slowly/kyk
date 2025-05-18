import { Metadata } from 'next';
import SctiTestContainer from '../../../components/scti-test/SctiTestContainer';

export const metadata: Metadata = {
  title: 'Social Change Type Index 테스트 | 사회대전환 캐릭터 찾기기',
  description: '나의 정책 성향을 알아보고 가장 잘 맞는 정책 캐릭터를 찾아보세요.',
};

export default function SctiPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div style={{ marginTop: '20px', paddingTop: '0px' }}>
        <h1 className="page-title">
          <span>S</span><span style={{ fontSize: '50%' }}>ocial</span>{' '}
          <span>C</span><span style={{ fontSize: '50%' }}>hange</span>{' '}
          <span>T</span><span style={{ fontSize: '50%' }}>ype</span>{' '}
          <span>I</span><span style={{ fontSize: '50%' }}>ndex</span>{' '}
          테스트
        </h1>
        <p className="text-center mb-8">
          내가 가장 좋아하는 사회대전환 캐릭터를 찾아보자
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <SctiTestContainer className="w-full max-w-3xl mx-auto" />
      </div>
    </main>
  );
} 