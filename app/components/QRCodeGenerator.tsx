"use client";

import React, { useRef, useImperativeHandle, forwardRef } from "react";
import QRCode from "react-qr-code";

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  level?: "L" | "M" | "Q" | "H";
  bgColor?: string;
  fgColor?: string;
  finderColorsProp?: {
    topLeft?: string;
    topRight?: string;
    bottomLeft?: string;
  };
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
      finderColorsProp,
    },
    ref
  ) => {
    const svgContainerRef = useRef<HTMLDivElement>(null);

    const finderColors = finderColorsProp || {
      topLeft: "#FF0000",
      topRight: "#FFED00",
      bottomLeft: "#00A366",
    };

    const finderPatternEdgeSize = size * (7 / 29);

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

        let svgString = new XMLSerializer().serializeToString(svgElement);
        
        const finderRectsString = `
          <rect x="0" y="0" width="${finderPatternEdgeSize}" height="${finderPatternEdgeSize}" fill="${finderColors.topLeft}" />
          <rect x="${size - finderPatternEdgeSize}" y="0" width="${finderPatternEdgeSize}" height="${finderPatternEdgeSize}" fill="${finderColors.topRight}" />
          <rect x="0" y="${size - finderPatternEdgeSize}" width="${finderPatternEdgeSize}" height="${finderPatternEdgeSize}" fill="${finderColors.bottomLeft}" />
        `;
        
        svgString = svgString.replace("</svg>", `${finderRectsString}</svg>`);
        
        const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "qr-code-colored.svg";
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
            bgColor={"transparent"}
            fgColor={fgColor}
            style={{ display: 'block' }}
          />
          {/* Display Overlays for Finder Patterns */}
          <div style={{position: 'absolute', top: 0, left: 0, width: finderPatternEdgeSize, height: finderPatternEdgeSize, backgroundColor: finderColors.topLeft, zIndex: 1}} />
          <div style={{position: 'absolute', top: 0, right: 0, width: finderPatternEdgeSize, height: finderPatternEdgeSize, backgroundColor: finderColors.topRight, zIndex: 1}} />
          <div style={{position: 'absolute', bottom: 0, left: 0, width: finderPatternEdgeSize, height: finderPatternEdgeSize, backgroundColor: finderColors.bottomLeft, zIndex: 1}} />
        </div>
      </div>
    );
  }
);

QRCodeGenerator.displayName = "QRCodeGenerator";
export default QRCodeGenerator; 