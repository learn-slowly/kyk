'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { usePathname } from 'next/navigation';

const FooterWrapper = styled.footer`
  position: relative;
  color: white;
  padding: 3rem 0;
  margin-top: auto;
  background-color: #0b365f !important;
  width: 100%;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #0b365f !important;
    z-index: -1;
  }
`;

const BackgroundImage = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 150px;
  background-image: url('/images/bottom.png');
  background-size: auto 150px;
  background-position: center bottom;
  background-repeat: repeat-x;
  opacity: 0.3;
  z-index: 0;
`;

export default function PolicyFooter() {
  const [year, setYear] = useState('2024');
  const pathname = usePathname();

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  if (pathname?.includes('/studio')) {
    return null;
  }

  return (
    <FooterWrapper>
      <BackgroundImage />
      <div className="container-fluid position-relative" style={{ zIndex: 2 }}>
        <div className="row">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <h3 className="fs-4 mb-3" style={{ fontFamily: 'GamtanRoad Gamtan, sans-serif' }}>
              사회대전환 연대회의 대통령 후보
            </h3>
            <div className="d-flex align-items-center mb-3">
              <Image 
                src="/images/header.png" 
                alt="민주노동당 권영국 후보 푸터 로고" 
                width={220} 
                height={32} 
                style={{ marginRight: '8px' }} 
              />
              <span className="fs-1" style={{ fontFamily: 'GamtanRoad Gamtan, sans-serif' }}>권영국</span>
            </div>
          </div>
          <div className="col-lg-6">
            <p className="mb-0 text-white-50">
              이메일: admin@justice21.org<br />
              전화: 02-2038-0103<br />
              FAX: 02-761-0103<br />
              주소: (08376) 서울특별시 구로구 디지털로33길 55, 이앤씨벤처드림타워2차 1011호
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-top border-white-10 text-center text-white-50">
          <p className="mb-0">© {year} 민주노동당 권영국. All rights reserved.</p>
        </div>
      </div>
    </FooterWrapper>
  );
} 