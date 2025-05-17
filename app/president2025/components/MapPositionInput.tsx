import React, { useState, useEffect, useCallback } from 'react'
import { set, PatchEvent } from 'sanity'
import { Box, Card, Stack, Text, Button, Flex } from '@sanity/ui'
import { useClient } from 'sanity'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  NodeChange,
  NodePositionChange,
  Node,
  Edge,
} from 'reactflow'
import 'reactflow/dist/style.css'

// 노드 데이터 타입 정의
interface PersonNodeData {
  _id: string;
  name: string;
  position: string;
  isCandidate?: boolean;
  photo?: string;
  isSelected?: boolean;
  relations?: string[];
  mapPosition?: { x: number; y: number };
}

// 커스텀 노드 컴포넌트
const PersonNode: React.FC<{ data: PersonNodeData }> = ({ data }) => {
  return (
    <div 
      style={{
        padding: '10px',
        borderRadius: '5px',
        backgroundColor: data.isCandidate ? '#FFEFBF' : 'white',
        border: `2px solid ${data.isCandidate ? '#FFD700' : '#ddd'}`,
        width: '200px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '8px',
        }}
      >
        {data.photo && (
          <div 
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%',
              overflow: 'hidden',
              marginRight: '10px',
              background: '#eee',
              flexShrink: 0
            }}
          >
            <img 
              src={data.photo} 
              alt={data.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
        )}
        <div>
          <div style={{ fontWeight: 'bold' }}>{data.name}</div>
          <div style={{ fontSize: '0.8em', color: '#666' }}>{data.position}</div>
        </div>
      </div>
    </div>
  )
}

// 노드 타입 정의
const nodeTypes = {
  person: PersonNode,
}

// 문서 타입 정의
interface DocumentProps {
  _id: string;
  name: string;
}

// Input 컴포넌트 Props 타입 정의
interface MapPositionInputProps {
  onChange: (event: PatchEvent) => void;
  value?: { x: number; y: number };
  schemaType: any; // sanity 스키마 타입
  readOnly?: boolean;
  document: DocumentProps;
}

const MapPositionInput: React.FC<MapPositionInputProps> = (props) => {
  const { 
    onChange, 
    value = { x: 0, y: 0 },
    schemaType,
    readOnly,
    document: documentProp
  } = props
  
  const client = useClient({ apiVersion: '2023-01-01' })
  const [people, setPeople] = useState<PersonNodeData[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  
  // 현재 문서의 ID
  const documentId = documentProp._id.replace('drafts.', '')
  const documentName = documentProp.name
  
  // 관계도에 표시될 모든 인물 데이터 가져오기
  const fetchPeopleData = useCallback(async () => {
    try {
      setLoading(true)
      
      // 관계도에 표시되는 모든 인물 쿼리
      const query = `*[_type == "person" && showOnMap == true]{
        _id,
        name,
        position,
        isCandidate,
        "photo": photo.asset->url,
        "relations": relations[]._ref,
        mapPosition
      }`
      
      const peopleData = await client.fetch<PersonNodeData[]>(query)
      setPeople(peopleData)
      
      // 노드와 엣지 생성
      const nodes = peopleData.map(person => ({
        id: person._id,
        type: 'person',
        position: person.mapPosition || { x: 0, y: 0 },
        data: {
          ...person,
          isSelected: person._id === documentId
        },
        // 현재 편집 중인 노드만 드래그 가능
        draggable: person._id === documentId,
      }))
      
      // 엣지(관계선) 생성
      const edges: Edge[] = []
      peopleData.forEach(person => {
        if (Array.isArray(person.relations)) {
          person.relations.forEach(targetId => {
            edges.push({
              id: `${person._id}-${targetId}`,
              source: person._id,
              target: targetId,
              animated: person.isCandidate,
              style: { stroke: person.isCandidate ? '#FFD700' : '#aaa' },
            })
          })
        }
      })
      
      setNodes(nodes)
      setEdges(edges)
      
      // 현재 편집 중인 노드 중심으로 뷰 맞추기
      const currentNode = nodes.find(node => node.id === documentId)
      if (currentNode) {
        setSelectedNode(currentNode)
      }
    } catch (error) {
      console.error('데이터 가져오기 오류:', error)
    } finally {
      setLoading(false)
    }
  }, [client, documentId, setNodes, setEdges])
  
  useEffect(() => {
    fetchPeopleData()
  }, [fetchPeopleData])
  
  // 노드 위치 변경 감지
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    onNodesChange(changes)
    
    // 위치 변경 감지
    const positionChanges = changes.filter(
      change => change.type === 'position' && change.position && change.id === documentId
    ) as NodePositionChange[]
    
    if (positionChanges.length > 0) {
      const { position } = positionChanges[0]
      
      // position이 정의되어 있는지 확인 후 Sanity 필드 값 업데이트
      if (position) {
        onChange(PatchEvent.from(set({ x: position.x, y: position.y })))
      }
    }
  }, [documentId, onChange, onNodesChange])
  
  // 현재 노드로 뷰 중심 이동
  const focusCurrentNode = useCallback(() => {
    const reactFlowInstance = document.querySelector('.react-flow')?.reactFlowInstance as any
    if (reactFlowInstance && selectedNode) {
      reactFlowInstance.fitView({
        nodes: [selectedNode],
        padding: 0.5,
        duration: 800
      })
    }
  }, [selectedNode])
  
  // 모든 노드 표시
  const showAllNodes = useCallback(() => {
    const reactFlowInstance = document.querySelector('.react-flow')?.reactFlowInstance as any
    if (reactFlowInstance) {
      reactFlowInstance.fitView({
        padding: 0.5,
        duration: 800
      })
    }
  }, [])
  
  return (
    <Stack space={4}>
      <Text>
        {readOnly 
          ? '관계도 위치 (읽기 전용)' 
          : `"${documentName}" 구성원의 관계도 위치를 드래그하여 조정하세요`
        }
      </Text>
      
      <Flex gap={2} marginY={2}>
        <Button 
          fontSize={1}
          padding={2}
          text="내 노드로 이동" 
          onClick={focusCurrentNode}
          disabled={!selectedNode}
          tone="primary"
        />
        <Button
          fontSize={1}
          padding={2}
          text="전체 노드 보기"
          onClick={showAllNodes}
          tone="default"
        />
      </Flex>
      
      <Card padding={0} radius={2} shadow={1} overflow="hidden">
        <Box height={500}>
          {loading ? (
            <Flex align="center" justify="center" height="100%">
              <Text>관계도를 불러오는 중입니다...</Text>
            </Flex>
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={handleNodesChange}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.5 }}
              minZoom={0.2}
              maxZoom={4}
              style={{ background: '#f5f5f5' }}
              proOptions={{ hideAttribution: true }}
            >
              <Controls />
              <Background color="#aaa" gap={16} />
              <MiniMap
                nodeColor={(node) => {
                  return node.data?.isCandidate ? '#FFD700' : '#666'
                }}
                maskColor="rgba(255, 255, 255, 0.5)"
              />
            </ReactFlow>
          )}
        </Box>
      </Card>
      
      <Flex gap={1}>
        <Text size={1} weight="semibold">현재 좌표:</Text>
        <Text size={1}>X: {value.x.toFixed(0)}, Y: {value.y.toFixed(0)}</Text>
      </Flex>
      
      <Text size={1} muted>
        * 노드를 드래그하여 위치를 조정하면 자동으로 저장됩니다
      </Text>
    </Stack>
  )
}

export default MapPositionInput 