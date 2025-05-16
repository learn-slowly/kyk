'use client';

import styled from 'styled-components';
import { Policy } from '@/types/policy';
import PolicyCarouselWrapper from '../PolicyCarouselWrapper';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0a355e;
`;

export default function CarouselContainer({ policies }: { policies: Policy[] }) {
  return (
    <Container>
      <PolicyCarouselWrapper policies={policies} />
    </Container>
  );
} 