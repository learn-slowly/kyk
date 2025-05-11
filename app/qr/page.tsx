import QRCodeGenerator from "@/app/components/QRCodeGenerator"; // 경로 별칭(@) 사용

export default function QRPage() {
  const qrValue = "https://권영국.com"; // 변경된 URL (Punycode로 변환된 한글 도메인)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px', boxSizing: 'border-box' }}>
      <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>웹사이트 QR 코드</h1>
      <QRCodeGenerator value={qrValue} size={300} />
      <p style={{ marginTop: '30px', textAlign: 'center', color: '#555' }}>
        이 QR 코드를 스캔하여 <a href={qrValue} target="_blank" rel="noopener noreferrer" style={{ color: '#0070f3' }}>{qrValue}</a>로 이동하세요.
      </p>
    </div>
  );
} 