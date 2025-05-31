"use client";
import React from 'react';
import Image from 'next/image';
import { useSctiTest } from './context/SctiTestContext';
import { PolicyCharacter } from './types';
import { characters as charactersData } from '@/app/data/scti/characters'; // 전체 캐릭터 데이터 import
import Script from 'next/script'; // next/script import

// Kakao SDK 타입 정의
interface KakaoSDK {
  init: (appKey: string) => void;
  isInitialized: () => boolean;
  Share?: {
    sendDefault: (settings: {
      objectType: string;
      content: {
        title: string;
        description: string;
        imageUrl: string;
        link: {
          mobileWebUrl: string;
          webUrl: string;
        };
      };
      buttons?: Array<{
        title: string;
        link: {
          mobileWebUrl: string;
          webUrl: string;
        };
      }>;
    }) => void;
  };
}

interface WindowWithKakao extends Window {
  Kakao?: KakaoSDK;
}

// CharacterProfile 수정: useSctiTest 호출 제거, 필요한 값 props로 받기
interface CharacterProfileProps {
  character: PolicyCharacter | undefined;
  isPrimaryResult: boolean; // 현재 캐릭터가 주 결과인지 여부
}
const CharacterProfile: React.FC<CharacterProfileProps> = ({ character, isPrimaryResult }) => {
  if (!character) return <p>캐릭터 정보를 불러올 수 없습니다.</p>;
  return (
    <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f0f8ff', borderRadius: '10px', textAlign: 'center' }}>
      <h3 style={{ fontSize: '2rem', color: '#005a9c', marginBottom: '15px' }}>{isPrimaryResult ? '당신의 사회변화 캐릭터는...' : '선택한 캐릭터 정보'}</h3>
      {character.imageUrl && 
        <Image 
          src={character.imageUrl} 
          alt={character.name} 
          width={180} 
          height={180} 
          style={{ borderRadius: '50%', margin: '0 auto 20px', border: '4px solid #0070f3' }}
        />
      }
      <h4 style={{ fontSize: '1.8rem', color: '#0070f3', marginBottom: '10px' }}>{character.name}</h4>
      <p style={{ fontSize: '1.1rem', fontStyle: 'italic', color: '#333', marginBottom: '15px' }}>
        {`"${character.slogan}"`}
      </p>
      <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.6', marginBottom: '25px' }}>{character.description}</p>

      {/* 관련 공약 표시 부분 추가 */}
      {character.relatedPledges && character.relatedPledges.length > 0 && (
        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px dashed #cce0ff', textAlign: 'left' }}>
          <h5 style={{ fontSize: '1.3rem', color: '#005a9c', marginBottom: '15px', textAlign: 'center' }}>{character.name} 관련 주요 공약 📜</h5>
          <ul style={{ listStyle: 'disc', paddingLeft: '25px', color: '#444' }}>
            {character.relatedPledges.map((pledge, index) => (
              <li key={index} style={{ marginBottom: '10px', fontSize: '1rem', lineHeight: '1.5' }}>
                {pledge}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

interface MatchingCharactersProps {
  primaryCharacter: PolicyCharacter | undefined;
  onCharacterSelect: (characterId: string) => void;
}
const MatchingCharacters: React.FC<MatchingCharactersProps> = ({ primaryCharacter, onCharacterSelect }) => {
  if (!primaryCharacter || !primaryCharacter.goodMatches || primaryCharacter.goodMatches.length === 0) return null;

  const goodMatchDetails = primaryCharacter.goodMatches
    .map(matchId => charactersData.find(c => c.id === matchId))
    .filter(Boolean) as PolicyCharacter[];

  if (goodMatchDetails.length === 0) return null;

  return (
    <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#e6f7ff', borderRadius: '10px' }}>
      <h4 style={{ fontSize: '1.4rem', color: '#005a9c', marginBottom: '15px' }}>🤝 {primaryCharacter.name}님과 잘 맞는 동료 캐릭터들!</h4>
      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {goodMatchDetails.map(match => (
          <li key={match.id} 
              style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '10px', borderRadius: '8px', transition: 'background-color 0.2s ease' }}
              onClick={() => onCharacterSelect(match.id)}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d0eaff'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
            {match.imageUrl && 
              <Image 
                src={match.imageUrl} 
                alt={match.name} 
                width={60} 
                height={60} 
                style={{ borderRadius: '50%', marginRight: '15px' }}
              />
            }
            <div>
              <strong style={{ fontSize: '1.1rem', color: '#0070f3' }}>{match.name}</strong>
              <p style={{ fontSize: '0.9rem', color: '#555', margin: '5px 0 0 0' }}>{match.slogan}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

interface ScoreVisualizationProps {
  characterScores: { [characterId: string]: number };
  getCharacterName: (id: string) => string;
  onCharacterSelect: (characterId: string) => void;
}
const ScoreVisualization: React.FC<ScoreVisualizationProps> = ({ characterScores, getCharacterName, onCharacterSelect }) => {
  const sortedScores = Object.entries(characterScores).sort(([,a],[,b]) => b-a);
  const maxScore = Math.max(...Object.values(characterScores), 1);

  return (
    <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '10px' }}>
      <h4 style={{ fontSize: '1.4rem', color: '#333', marginBottom: '20px' }}>나의 정책 성향 점수 (클릭하여 자세히 보기)</h4>
      {sortedScores.map(([id, score]) => (
        <div key={id} style={{ marginBottom: '10px', cursor: 'pointer', padding: '8px', borderRadius: '6px', transition: 'background-color 0.2s ease' }}
             onClick={() => onCharacterSelect(id)}
             onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
             onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
            <span style={{ fontSize: '1rem', color: '#444' }}>{getCharacterName(id)}</span>
            <span style={{ fontSize: '1rem', color: '#0070f3', fontWeight: 'bold' }}>{score}점</span>
          </div>
          <div style={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: '4px' }}>
            <div style={{
              width: `${(score / (maxScore > 0 ? maxScore : 20)) * 100}%`,
              backgroundColor: '#0070f3',
              height: '12px',
              borderRadius: '4px',
              transition: 'width 0.5s ease-in-out'
            }} />
          </div>
        </div>
      ))}
    </div>
  );
};

const SharingOptions: React.FC = () => {
  const { testResult, getCharacterById } = useSctiTest();

  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const primaryChar = testResult ? getCharacterById(testResult.primaryCharacterId) : undefined;
  const shareText = `나의 SCTI 결과: ${primaryChar?.name || '멋진 사회변화가'} 유형! ${primaryChar?.slogan || '당신의 유형도 알아보세요!'}`;

  const handleKakaoShare = () => {
    const Kakao = (window as WindowWithKakao).Kakao;
    if (!Kakao || !Kakao.isInitialized || !Kakao.Share || !Kakao.Share.sendDefault) {
      alert('카카오 SDK가 올바르게 로드되지 않았거나 기능이 없습니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    if (!testResult) {
      alert('공유할 테스트 결과가 없습니다.');
      return;
    }
    const imageUrl = primaryChar?.imageUrl ? `${window.location.origin}${primaryChar.imageUrl}` : `${window.location.origin}/images/scti/char01.png`;
    Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `나의 SCTI 결과: ${primaryChar?.name || '멋진 사회변화가'} 유형!`,
        description: primaryChar?.slogan || '당신의 사회변화 유형을 확인하고 함께 세상을 바꿔봐요!',
        imageUrl: imageUrl,
        link: { mobileWebUrl: pageUrl, webUrl: pageUrl },
      },
      buttons: [
        { title: '결과 자세히 보기', link: { mobileWebUrl: pageUrl, webUrl: pageUrl } },
        { title: '나도 테스트 해보기', link: { mobileWebUrl: `${window.location.origin}/policies/scti`, webUrl: `${window.location.origin}/policies/scti` } },
      ],
    });
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
    window.open(facebookUrl, '_blank');
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      alert('결과 페이지 URL이 클립보드에 복사되었습니다!');
    } catch (err) {
      console.error('URL 복사 실패:', err);
      alert('URL 복사에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div style={{ marginTop: '30px', textAlign: 'center' }}>
      <h4 style={{ fontSize: '1.2rem', color: '#333', marginBottom: '15px' }}>결과 공유하기</h4>
      <button 
        onClick={handleKakaoShare}
        style={{ padding: '10px 20px', margin: '5px', backgroundColor: '#FEE500', color: '#191919', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
      >
        카카오톡
      </button>
      <button 
        onClick={handleTwitterShare}
        style={{ padding: '10px 20px', margin: '5px', backgroundColor: '#1DA1F2', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}
      >
        Twitter
      </button>
      <button 
        onClick={handleFacebookShare}
        style={{ padding: '10px 20px', margin: '5px', backgroundColor: '#4267B2', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}
      >
        Facebook
      </button>
      <button 
        onClick={handleCopyUrl}
        style={{ padding: '10px 20px', margin: '5px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}
      >
        URL 복사
      </button>
    </div>
  );
};

export default function ResultSection() {
  const {
    testResult,
    resetTest,
    getCharacterById,
    detailedCharacterId,
    setDetailedCharacterId
  } = useSctiTest();

  React.useEffect(() => {
    if (testResult && !detailedCharacterId) {
      setDetailedCharacterId(testResult.primaryCharacterId);
    }
  }, [testResult, detailedCharacterId, setDetailedCharacterId]);

  const KAKAO_JAVASCRIPT_KEY = '500b7e0fd81c5e8cc14f4b5e6165058e';

  if (!testResult) {
    return <p>결과를 계산 중이거나, 아직 테스트를 완료하지 않았습니다.</p>;
  }

  const characterToDisplay = detailedCharacterId ? getCharacterById(detailedCharacterId) : getCharacterById(testResult.primaryCharacterId);
  const primaryCharacterForMatches = getCharacterById(testResult.primaryCharacterId);
  const isPrimaryResultForProfile = detailedCharacterId === testResult.primaryCharacterId || !detailedCharacterId;

  return (
    <>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js"
        integrity="sha384-dok87au0gKqJdxs7msEdBPNnKSRT+/mhTVzq+qOhcL464zXwvcrpjeWvyj1kCdq6"
        crossOrigin="anonymous"
        onLoad={() => {
          console.log('Kakao SDK <Script> onLoad triggered (v2.7.5).');
          const Kakao = (window as WindowWithKakao).Kakao;
          if (Kakao && typeof Kakao.init === 'function') {
            if (!Kakao.isInitialized()) {
              try {
                Kakao.init(KAKAO_JAVASCRIPT_KEY);
                console.log('Kakao.init called. Initialized:', Kakao.isInitialized());
              } catch (e) {
                console.error('Kakao.init error:', e);
              }
            } else {
              console.log('Kakao SDK already initialized.');
            }
          } else {
            console.error('Kakao SDK not found or Kakao.init is not a function after load.');
          }
        }}
        onError={(e) => {
          console.error('Error loading Kakao SDK (v2.7.5):', e);
        }}
        strategy="afterInteractive"
      />
      <div style={{ padding: '30px 20px', maxWidth: '800px', margin: 'auto' }}>
        <CharacterProfile character={characterToDisplay} isPrimaryResult={isPrimaryResultForProfile} />
        
        {primaryCharacterForMatches && 
          <MatchingCharacters 
            primaryCharacter={primaryCharacterForMatches} 
            onCharacterSelect={setDetailedCharacterId}
          />
        }

        <ScoreVisualization 
          characterScores={testResult.characterScores} 
          getCharacterName={(id) => getCharacterById(id)?.name || '알 수 없는 캐릭터'}
          onCharacterSelect={setDetailedCharacterId}
        />
        
        <SharingOptions />

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button 
            onClick={() => {
              resetTest();
              setDetailedCharacterId(null);
            }} 
            style={{
              padding: '15px 30px',
              fontSize: '1.1rem',
              color: 'white',
              backgroundColor: '#6c757d',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            테스트 다시하기
          </button>
        </div>
      </div>
    </>
  );
} 