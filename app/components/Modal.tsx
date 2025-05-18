"use client";

import React, { ReactNode, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  showCloseButton = true 
}) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // 모달 열리면 스크롤 방지
      window.addEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        {showCloseButton && (
          <button onClick={onClose} style={closeButtonStyle}>
            &times;
          </button>
        )}
        {title && <h2 style={titleStyle}>{title}</h2>}
        <div style={contentStyle}>{children}</div>
      </div>
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '25px 30px',
  borderRadius: '10px',
  boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
  position: 'relative',
  width: 'auto',
  maxWidth: '500px',
  minWidth: '300px',
  maxHeight: '90vh',
  overflowY: 'auto',
};

const closeButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '15px',
  right: '15px',
  background: 'transparent',
  border: 'none',
  fontSize: '1.8rem',
  fontWeight: 'bold',
  color: '#888',
  cursor: 'pointer',
  padding: '0',
  lineHeight: '1',
};

const titleStyle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: '20px',
  fontSize: '1.5rem',
  color: '#333',
  textAlign: 'center',
};

const contentStyle: React.CSSProperties = {
  // 추가적인 내용 스타일링이 필요하면 여기에
};

export default Modal; 