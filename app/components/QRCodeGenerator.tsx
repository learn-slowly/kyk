"use client";

import React, { useRef, useImperativeHandle, forwardRef } from "react";
import QRCode from "react-qr-code";

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  level?: "L" | "M" | "Q" | "H";
  bgColor?: string;
  fgColor?: string;
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
    },
    ref
  ) => {
    const svgContainerRef = useRef<HTMLDivElement>(null);

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
      },
    }));
    
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
        </div>
      </div>
    );
  }
);

QRCodeGenerator.displayName = "QRCodeGenerator";
export default QRCodeGenerator; 