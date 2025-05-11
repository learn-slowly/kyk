"use client";

import React, { useRef } from 'react';
import QRCodeGenerator, { QRCodeGeneratorRef } from "@/app/components/QRCodeGenerator";

export default function QRPage() {
  const qrValue = "https://권영국.com"; // 변경된 URL (한글 직접 사용)
  const qrSize = 300;
  const logoSize = qrSize * 0.2;

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
        logoImage="/pi.png"
        logoWidth={logoSize}
        logoHeight={logoSize}
        logoPadding={5}
        logoBackgroundColor="white"
        level="H"
        // finderColorsProp를 명시하지 않으면 QRCodeGenerator 내부의 기본값(빨강,노랑,녹색)이 사용됩니다.
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