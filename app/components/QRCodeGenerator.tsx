"use client";

import React from "react";
import QRCode from "react-qr-code";

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  value,
  size = 256,
}) => {
  return (
    <div style={{ background: "white", padding: "16px" }}>
      <QRCode
        value={value}
        size={size}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        viewBox={`0 0 ${size} ${size}`}
      />
    </div>
  );
};

export default QRCodeGenerator; 