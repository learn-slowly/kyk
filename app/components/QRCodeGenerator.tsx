"use client";

import React, { useRef, useImperativeHandle, forwardRef, useState } from "react";
import QRCode from "react-qr-code";
import Image from "next/image";

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  level?: "L" | "M" | "Q" | "H";
  bgColor?: string;
  fgColor?: string;
  logoUrl?: string;
  logoSize?: number;
}

export interface QRCodeGeneratorRef {
  triggerDownload: () => Promise<void>;
}

const QRCodeGenerator = forwardRef<QRCodeGeneratorRef, QRCodeGeneratorProps>(
  (
    {
      value,
      size = 256,
      level = "H",
      bgColor = "#FFFFFF",
      fgColor = "#000000",
      logoUrl,
      logoSize = 64,
    },
    ref
  ) => {
    const svgContainerRef = useRef<HTMLDivElement>(null);
    const [logoError, setLogoError] = useState(false);

    useImperativeHandle(ref, () => ({
      triggerDownload: async () => {
        if (!svgContainerRef.current) {
          console.error("SVG container ref not found.");
          return;
        }
        const svgElement = svgContainerRef.current.querySelector("svg");
        if (!svgElement) {
          console.error("SVG element not found for download.");
          return;
        }

        // SVG로 QR코드와 로고를 포함한 이미지 생성
        try {
          // 새 캔버스 생성
          const canvas = document.createElement("canvas");
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            throw new Error("Canvas context not available");
          }
          
          // QR 코드를, URL로 변환
          const svgString = new XMLSerializer().serializeToString(svgElement);
          const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
          const url = URL.createObjectURL(blob);
          
          // QR 코드 이미지 그리기
          const img = new Image();
          img.src = url;
          
          await new Promise<void>((resolve, reject) => {
            img.onload = () => {
              ctx.drawImage(img, 0, 0, size, size);
              resolve();
            };
            img.onerror = reject;
          });
          
          // 로고가 있다면 로고도 그리기
          if (logoUrl && !logoError) {
            const logoImg = new Image();
            logoImg.src = logoUrl;
            
            await new Promise<void>((resolve) => {
              logoImg.onload = () => {
                const logoX = (size - logoSize) / 2;
                const logoY = (size - logoSize) / 2;
                
                // 로고 배경을 흰색으로
                ctx.fillStyle = bgColor;
                ctx.fillRect(logoX - 4, logoY - 4, logoSize + 8, logoSize + 8);
                
                // 로고 그리기
                ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
                resolve();
              };
              logoImg.onerror = () => {
                console.error("Failed to load logo");
                resolve();
              };
            });
          }
          
          // PNG로 다운로드
          const dataUrl = canvas.toDataURL("image/png");
          const a = document.createElement("a");
          a.href = dataUrl;
          a.download = "qr-code-with-logo.png";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Error generating QR code with logo:", error);
          
          // 일반 SVG 다운로드로 폴백
          const svgString = new XMLSerializer().serializeToString(svgElement);
          const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "qr-code.svg";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      },
    }));
    
    // 로고 크기가 너무 크면 QR 코드를 읽기 어려우므로 제한
    const actualLogoSize = Math.min(logoSize, size * 0.3);
    
    return (
      <div style={{ padding: "16px", backgroundColor: bgColor, display: 'inline-block' }}>
        <div ref={svgContainerRef} style={{ position: "relative", width: size, height: size }}>
          <QRCode
            value={value}
            size={size}
            level={level}
            bgColor={bgColor}
            fgColor={fgColor}
            style={{ display: 'block' }}
          />
          
          {/* 로고 오버레이 */}
          {logoUrl && !logoError && (
            <div 
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: actualLogoSize,
                height: actualLogoSize,
                backgroundColor: bgColor,
                borderRadius: "8px",
                padding: "2px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)"
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                  borderRadius: "4px"
                }}
              >
                <Image
                  src={logoUrl}
                  fill
                  style={{ objectFit: "contain" }}
                  alt="QR Code Logo"
                  onError={() => setLogoError(true)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

QRCodeGenerator.displayName = "QRCodeGenerator";
export default QRCodeGenerator; 