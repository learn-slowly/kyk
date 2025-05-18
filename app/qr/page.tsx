"use client";

import React, { useRef, useState } from 'react';
import QRCodeGenerator, { QRCodeGeneratorRef } from "@/app/components/QRCodeGenerator";

export default function QRPage() {
  const [url, setUrl] = useState("https://www.xn--3e0b8b410h.com/");
  const [displayUrl, setDisplayUrl] = useState("권영국.com");
  const qrSize = 300;

  const qrCodeRef = useRef<QRCodeGeneratorRef>(null);

  const handleDownload = () => {
    if (qrCodeRef.current) {
      qrCodeRef.current.triggerDownload();
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleDisplayUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayUrl(e.target.value);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px', boxSizing: 'border-box', gap: '20px' }}>
      <h1 style={{ marginBottom: '10px', textAlign: 'center' }}>커스텀 QR 코드 생성기</h1>
      
      <div style={{ width: '100%', maxWidth: '500px', marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="url" style={{ display: 'block', marginBottom: '5px' }}>QR 코드에 담을 URL:</label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={handleUrlChange}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px'
            }}
            placeholder="https://example.com"
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="displayUrl" style={{ display: 'block', marginBottom: '5px' }}>화면에 표시될 텍스트:</label>
          <input
            id="displayUrl"
            type="text"
            value={displayUrl}
            onChange={handleDisplayUrlChange}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px'
            }}
            placeholder="보여질 텍스트"
          />
        </div>
      </div>
      
      <QRCodeGenerator
        ref={qrCodeRef}
        value={url}
        size={qrSize}
        level="M"
        bgColor="#FFFFFF"
        fgColor="#000000"
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
        이 QR 코드를 스캔하여 <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: '#0070f3' }}>{displayUrl}</a>으로 이동하세요.
      </p>
    </div>
  );
} 