"use client";

import React, { useRef, useImperativeHandle, forwardRef } from "react";
import QRCode from "react-qr-code";

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  level?: "L" | "M" | "Q" | "H";
  bgColor?: string;
  fgColor?: string;
  logoImage?: string;
  logoWidth?: number;
  logoHeight?: number;
  logoPadding?: number;
  logoBackgroundColor?: string;
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
      logoImage,
      logoWidth = size * 0.2,
      logoHeight = size * 0.2,
      logoPadding = 5,
      logoBackgroundColor = "#FFFFFF",
    },
    ref
  ) => {
    const qrWrapperRef = useRef<HTMLDivElement>(null);

    const paddedLogoWidth = logoWidth + logoPadding * 2;
    const paddedLogoHeight = logoHeight + logoPadding * 2;

    useImperativeHandle(ref, () => ({
      triggerDownload: async () => {
        if (!qrWrapperRef.current) {
          console.error("QR Code wrapper ref not found.");
          return;
        }

        const svgElement = qrWrapperRef.current.querySelector("svg");
        if (!svgElement) {
          console.error("SVG element not found.");
          return;
        }

        let svgString = new XMLSerializer().serializeToString(svgElement);

        if (logoImage) {
          try {
            const response = await fetch(logoImage);
            if (!response.ok) {
              throw new Error(`Failed to fetch logo: ${response.statusText}`);
            }
            const imageBlob = await response.blob();
            const logoDataUri = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(imageBlob);
            });

            const rectX = (size - paddedLogoWidth) / 2;
            const rectY = (size - paddedLogoHeight) / 2;
            const imageX = (size - logoWidth) / 2;
            const imageY = (size - logoHeight) / 2;
            
            const rectTag = `<rect x="${rectX}" y="${rectY}" width="${paddedLogoWidth}" height="${paddedLogoHeight}" fill="${logoBackgroundColor}" />`;
            const imageTag = `<image href="${logoDataUri}" x="${imageX}" y="${imageY}" width="${logoWidth}" height="${logoHeight}" />`;

            svgString = svgString.replace("</svg>", `${rectTag}${imageTag}</svg>`);

          } catch (error) {
            console.error("Error processing logo for SVG:", error);
          }
        }

        const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "qr-code-with-logo.svg";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      },
    }));

    const displayLogoWrapperWidth = logoWidth + (logoImage ? logoPadding * 2 : 0);
    const displayLogoWrapperHeight = logoHeight + (logoImage ? logoPadding * 2 : 0);

    return (
      <div style={{ position: "relative", width: size, height: size, padding: "16px", backgroundColor: bgColor }}>
        <div ref={qrWrapperRef} style={{ width: size, height: size }}>
          <QRCode
            value={value}
            size={size}
            level={level}
            bgColor={bgColor}
            fgColor={fgColor}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          />
        </div>
        {logoImage && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: displayLogoWrapperWidth,
              height: displayLogoWrapperHeight,
              padding: logoPadding,
              backgroundColor: logoBackgroundColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 3px rgba(0,0,0,0.2)',
            }}
          >
            <img
              src={logoImage}
              alt="QR Code Logo"
              style={{
                width: logoWidth,
                height: logoHeight,
                objectFit: "contain",
              }}
            />
          </div>
        )}
      </div>
    );
  }
);

QRCodeGenerator.displayName = "QRCodeGenerator";
export default QRCodeGenerator; 