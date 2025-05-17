import styled from 'styled-components';

// 모든 페이지에서 공통으로 사용할 제목 스타일
export const PageTitle = styled.h1`
  font-size: 2.8rem;
  font-weight: normal;
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  padding: 1rem;
  z-index: 10;
  font-family: 'GamtanRoad Gamtan', sans-serif;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 5px;
    background: linear-gradient(to right, #FF0000, #FFed00, #00a366);
  }
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
    margin-bottom: 2rem;
    
    &::after {
      width: 150px;
    }
  }
`; 