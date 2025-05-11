"use client";

import React, { useRef } from 'react';
import QRCodeGenerator, { QRCodeGeneratorRef } from "@/app/components/QRCodeGenerator";

export default function QRPage() {
  const qrValue = "https://www.xn--3e0b8b410h.com/"; // 변경된 Punycode URL
  const qrSize = 300;
  // const logoSize = qrSize * 0.2; // 로고 관련 변수 제거 또는 주석 처리

  const qrCodeRef = useRef<QRCodeGeneratorRef>(null);

  const handleDownload = () => {
    if (qrCodeRef.current) {
      qrCodeRef.current.triggerDownload();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px', boxSizing: 'border-box', gap: '20px' }}>
      <h1 style={{ marginBottom: '10px', textAlign: 'center' }}>웹사이트 QR 코드</h1>
      <QRCodeGenerator
        ref={qrCodeRef}
        value={qrValue}
        size={qrSize}
        // logoImage="/pi.png" // 로고 관련 props 제거
        // logoWidth={logoSize}
        // logoHeight={logoSize}
        // logoPadding={5}
        // logoBackgroundColor="white"
        level="H"
      />
      <button
        onClick={handleDownload}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          color: 'white',
          backgroundColor: '#0070f3',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        SVG로 다운로드
      </button>
      <p style={{ marginTop: '10px', textAlign: 'center', color: '#555' }}>
        이 QR 코드를 스캔하여 <a href={qrValue} target="_blank" rel="noopener noreferrer" style={{ color: '#0070f3' }}>{qrValue}</a>로 이동하세요.
      </p>
    </div>
  );
} 