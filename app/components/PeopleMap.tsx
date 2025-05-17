'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  NodeMouseHandler,
  Panel,
  NodeChange,
  NodePositionChange
} from 'reactflow';
// 서버사이드 렌더링 시 CSS 임포트 문제를 방지하기 위해 useEffect 내에서 CSS 적용
import styled from 'styled-components';
import Image from 'next/image';

// 스타일 컴포넌트
const NodeCard = styled.div<{ $isCandidate?: boolean; $isVisible?: boolean }>`
  width: 220px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${props => props.$isCandidate 
    ? '0 5px 15px rgba(0, 0, 0, 0.2)' 
    : '0 2px 4px rgba(0, 0, 0, 0.1)'};
  border: ${props => props.$isCandidate ? '2px solid #FFD700' : 'none'};
  transition: all 0.3s ease;
  opacity: ${props => props.$isVisible === false ? 0.4 : 1};
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 220px;
  background: #f5f5f5;
`;

const Content = styled.div`
  padding: 1rem;
`;

const Name = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
  text-align: center;
`;

const Role = styled.p<{ $isCandidate?: boolean }>`
  font-size: ${props => props.$isCandidate ? '1.2rem' : '1rem'};
  color: ${props => props.$isCandidate ? '#D4AF37' : '#666'};
  margin-bottom: 0.8rem;
  font-weight: ${props => props.$isCandidate ? 'bold' : 'normal'};
  text-align: center;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: #777;
  line-height: 1.5;
  margin: 0;
  max-height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const DetailPanel = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 300px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  z-index: 10;
  display: ${props => props.$isVisible ? 'block' : 'none'};
  transition: all 0.3s ease;
`;

const DetailImage = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 1rem;
  overflow: hidden;
`;

const DetailTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

const DetailRole = styled.h3<{ $isCandidate?: boolean }>`
  font-size: 1.2rem;
  color: ${props => props.$isCandidate ? '#D4AF37' : '#555'};
  margin-bottom: 1rem;
`;

const DetailDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #555;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const ControlPanel = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  background: ${props => props.$active ? '#4a90e2' : '#f0f0f0'};
  color: ${props => props.$active ? 'white' : '#333'};
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.$active ? '#3a80d2' : '#e0e0e0'};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  font-size: 1.2rem;
  color: #666;
`;

// ReactFlow 기본 스타일
const FlowContainer = styled.div`
  width: 100%;
  height: 80vh;
  position: relative;

  .react-flow {
    background-color: #f8f9fa;
  }

  .react-flow__node {
    border-radius: 8px;
    background: transparent;
    border: none;
    width: auto;
  }

  .react-flow__edge path {
    stroke-width: 2px;
  }

  .react-flow__controls {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
    border-radius: 6px;
  }

  .react-flow__controls-button {
    background: white;
    border: none;
    border-bottom: 1px solid #eee;
    box-sizing: content-box;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 16px;
    height: 16px;
    cursor: pointer;
    user-select: none;
    padding: 5px;
  }

  .react-flow__minimap {
    border-radius: 6px;
    background-color: #fff;
    border: 1px solid #f0f0f0;
  }
`;

// 커스텀 노드 컴포넌트
const PersonNode = ({ data }: { data: any }) => {
  return (
    <NodeCard $isCandidate={data.isCandidate} $isVisible={data.visible}>
      <ImageContainer>
        <Image
          src={data.image}
          alt={data.name}
          fill
          style={{ objectFit: 'cover' }}
        />
      </ImageContainer>
      <Content>
        <Name>{data.name}</Name>
        <Role $isCandidate={data.isCandidate}>{data.role}</Role>
        <Description>{data.description}</Description>
      </Content>
    </NodeCard>
  );
};

// 노드 타입 정의
const nodeTypes = {
  person: PersonNode,
};

// 기본 백업 데이터 - Sanity 연결 실패 시 사용
const fallbackPeople = [
  {
    id: '1',
    name: '권영국',
    role: '후보',
    description: '대한민국의 변화를 이끌고 국민의 목소리를 대변하는 대통령 후보입니다.',
    image: '/images/placeholder.jpg',
    position: { x: 0, y: 0 },
    relations: ['2', '3', '4', '5'],
    isCandidate: true
  },
  {
    id: '2',
    name: '김00',
    role: '선거대책본부장',
    description: '20년간의 선거 운동 경험을 바탕으로 권영국 후보의 선거를 이끌고 있습니다.',
    image: '/images/placeholder.jpg',
    position: { x: -300, y: -200 },
    relations: ['6', '7'],
    isCandidate: false
  },
  {
    id: '3',
    name: '이00',
    role: '정책위원장',
    description: '사회정책 전문가로서 권영국 후보의 정책을 설계하고 발전시키는 역할을 담당합니다.',
    image: '/images/placeholder.jpg',
    position: { x: 300, y: -200 },
    relations: ['8', '9'],
    isCandidate: false
  },
  {
    id: '4',
    name: '박00',
    role: '대변인',
    description: '언론인 출신으로 권영국 후보의 메시지를 국민들에게 전달하는 역할을 수행합니다.',
    image: '/images/placeholder.jpg',
    position: { x: -300, y: 200 },
    relations: [],
    isCandidate: false
  },
  {
    id: '5',
    name: '최00',
    role: '시민사회 자문위원',
    description: '시민단체 활동가로서 현장의 목소리를 정책에 반영하는 역할을 합니다.',
    image: '/images/placeholder.jpg',
    position: { x: 300, y: 200 },
    relations: [],
    isCandidate: false
  }
];

// 노드와 엣지 생성 함수
const createNodesAndEdges = (people: any[]) => {
  const nodes = people.map(person => ({
    id: person.id,
    type: 'person',
    position: person.position,
    data: { ...person, visible: true },
    draggable: true,
  }));

  const edges: Edge[] = [];
  people.forEach(person => {
    person.relations.forEach((targetId: string) => {
      edges.push({
        id: `${person.id}-${targetId}`,
        source: person.id,
        target: targetId,
        animated: person.isCandidate,
        style: { stroke: person.isCandidate ? '#FFD700' : '#aaa', strokeWidth: 2 },
      });
    });
  });

  return { nodes, edges };
};

// 메인 관계도 컴포넌트
const PeopleMap = () => {
  const [cssLoaded, setCssLoaded] = useState(true);
  const [peopleData, setPeopleData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedPerson, setSelectedPerson] = useState<any | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // 초기 데이터 가져오기
  useEffect(() => {
    const fetchPeopleData = async () => {
      try {
        setLoading(true);
        // 동적 임포트 사용하여 클라이언트 컴포넌트에서 데이터 가져오기
        const { getPeopleForMap } = await import('@/lib/sanity');
        const data = await getPeopleForMap();
        
        if (data && data.length > 0) {
          setPeopleData(data);
        } else {
          console.warn('Sanity에서 데이터를 가져오지 못했습니다. 기본 백업 데이터를 사용합니다.');
          setPeopleData(fallbackPeople);
        }
      } catch (err) {
        console.error('데이터를 가져오는 중 오류가 발생했습니다:', err);
        setError('데이터를 불러오는데 실패했습니다.');
        setPeopleData(fallbackPeople);
      } finally {
        setLoading(false);
      }
    };

    fetchPeopleData();
  }, []);

  // 데이터가 변경되면 노드와 엣지 업데이트
  useEffect(() => {
    if (peopleData.length > 0) {
      const { nodes: initialNodes, edges: initialEdges } = createNodesAndEdges(peopleData);
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [peopleData, setNodes, setEdges]);

  const roles = Array.from(new Set(peopleData.map(p => p.role)));

  useEffect(() => {
    const handleResize = () => {
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          position: {
            x: node.position.x,
            y: node.position.y,
          },
        }))
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setNodes]);

  // 노드 위치 변경 시 저장 타이머를 관리하기 위한 ref
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 노드 위치 변경 처리 함수
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    // 기본 노드 변경 처리
    onNodesChange(changes);
    
    // 위치 변경 감지 및 저장 로직
    const positionChanges = changes.filter(
      change => change.type === 'position' && change.position
    ) as NodePositionChange[];
    
    if (positionChanges.length > 0) {
      // 이전 타이머가 있으면 취소
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      
      // 마지막 위치 변경 후 0.5초 뒤에 저장 실행 (디바운싱)
      saveTimerRef.current = setTimeout(() => {
        savePositionsToSanity(positionChanges);
      }, 500);
    }
  }, [onNodesChange]);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge({
      ...connection,
      style: { stroke: '#aaa', strokeWidth: 2 },
    }, eds)),
    [setEdges]
  );

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    if (node.data) {
      setSelectedPerson(node.data);
    }
  }, []);

  const closeDetails = () => {
    setSelectedPerson(null);
  };

  const toggleFilter = (role: string) => {
    setActiveFilters(prev => {
      const newFilters = prev.includes(role)
        ? prev.filter(f => f !== role)
        : [...prev, role];
      
      setNodes(nodes => nodes.map(node => {
        const visible = newFilters.length === 0 || newFilters.includes(node.data.role);
        return {
          ...node,
          data: { ...node.data, visible }
        };
      }));
      
      return newFilters;
    });
  };
  
  // 노드 위치 변경시 Sanity에 저장하는 함수
  const savePositionsToSanity = async (positionChanges: NodePositionChange[]) => {
    try {
      setIsSaving(true);
      setSaveStatus('저장 중...');
      
      const { updatePersonPosition } = await import('@/lib/sanity');
      
      // 모든 위치 변경 저장 작업 병렬 처리
      const updatePromises = positionChanges.map(async (change) => {
        const nodeId = change.id;
        const position = change.position;
        
        if (!nodeId || !position) return false;
        
        // Sanity에 위치 업데이트 요청
        return updatePersonPosition(nodeId as string, position);
      });
      
      // 모든 업데이트 완료 대기
      const results = await Promise.all(updatePromises);
      
      // 업데이트 결과 확인
      const allSuccessful = results.every(result => result === true);
      
      if (allSuccessful) {
        setSaveStatus('저장 완료');
        // 3초 후 상태 메시지 제거
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus('일부 항목 저장 실패');
        setTimeout(() => setSaveStatus(null), 3000);
      }
    } catch (error) {
      console.error('위치 저장 오류:', error);
      setSaveStatus('저장 실패');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  if (!cssLoaded || loading) {
    return <LoadingContainer>데이터를 불러오는 중입니다...</LoadingContainer>;
  }

  if (error) {
    return <LoadingContainer>{error}</LoadingContainer>;
  }

  return (
    <FlowContainer>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            const role = node.data.role;
            if (node.data.isCandidate) return '#FFD700';
            
            switch (role) {
              case '선거대책본부장':
                return '#4a90e2';
              case '정책위원장':
                return '#50C878';
              case '대변인':
                return '#FF7F50';
              default:
                return '#ccc';
            }
          }}
          maskColor="rgba(255, 255, 255, 0.5)"
        />
        <Panel position="top-left">
          <ControlPanel>
            <h3 style={{ marginBottom: '0.5rem' }}>직책별 필터</h3>
            <div>
              {roles.map(role => (
                <FilterButton 
                  key={role}
                  $active={activeFilters.includes(role)}
                  onClick={() => toggleFilter(role)}
                >
                  {role}
                </FilterButton>
              ))}
            </div>
          </ControlPanel>
        </Panel>
        
        {/* 저장 상태 표시 패널 */}
        {saveStatus && (
          <Panel position="bottom-center">
            <div style={{ 
              background: 'rgba(0,0,0,0.7)', 
              color: 'white', 
              padding: '8px 16px', 
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {isSaving && (
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '50%', 
                  border: '2px solid white',
                  borderTopColor: 'transparent',
                  animation: 'spin 1s linear infinite'
                }} />
              )}
              {saveStatus}
            </div>
          </Panel>
        )}
      </ReactFlow>

      {selectedPerson && (
        <DetailPanel $isVisible={!!selectedPerson}>
          <CloseButton onClick={closeDetails}>×</CloseButton>
          <DetailImage>
            <Image
              src={selectedPerson.image}
              alt={selectedPerson.name}
              fill
              style={{ objectFit: 'cover' }}
            />
          </DetailImage>
          <DetailTitle>{selectedPerson.name}</DetailTitle>
          <DetailRole $isCandidate={selectedPerson.isCandidate}>
            {selectedPerson.role}
          </DetailRole>
          <DetailDescription>{selectedPerson.description}</DetailDescription>
        </DetailPanel>
      )}
      
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </FlowContainer>
  );
};

export default PeopleMap; 