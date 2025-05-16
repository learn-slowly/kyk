'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0) 100%);
  pointer-events: none;

  @media (min-width: 769px) {
    top: 0;
    bottom: auto;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0) 100%);
    padding: 30px;
  }
`;

const MenuButton = styled(motion.button)`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(10px);
  pointer-events: auto;
  position: relative;
  margin: 0 auto;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  @media (min-width: 769px) {
    margin: 0;
  }
`;

const MenuList = styled(motion.div)`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 10px;
  margin-bottom: 10px;
  pointer-events: auto;
  width: 90%;
  max-width: 400px;

  @media (min-width: 769px) {
    bottom: auto;
    top: 100%;
    left: 0;
    transform: none;
    margin-top: 10px;
    margin-bottom: 0;
  }
`;

const MenuItem = styled(motion.button)`
  width: 100%;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 12px;
  color: white;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  transition: all 0.2s ease;

  &:last-child {
    margin-bottom: 0;
  }

  .icon {
    width: 40px;
    height: 40px;
    margin-right: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: rgba(255, 255, 255, 0.9);
  }

  .text {
    flex: 1;

    h3 {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 5px;
    }

    p {
      font-size: 14px;
      margin: 0;
      opacity: 0.7;
    }
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
`;

export default function PolicyNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const menuItems = [
    {
      icon: '🌟',
      title: '세상을 바꾸는 10가지 방법',
      description: '권영국의 핵심 정책 공약을 확인하세요',
      path: '/policies/main',
    },
    {
      icon: '🎯',
      title: 'SCTI 테스트',
      description: '나와 가장 잘 맞는 정책은?',
      path: '/policies/scti',
    },
    {
      icon: '📚',
      title: '분야별 세부 정책',
      description: '모든 정책을 자세히 살펴보세요',
      path: '/policies/gallery',
    },
  ];

  return (
    <Container>
      <MenuButton
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? '×' : '☰'}
      </MenuButton>
      
      <AnimatePresence>
        {isOpen && (
          <MenuList
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {menuItems.map((item) => (
              <MenuItem
                key={item.path}
                onClick={() => {
                  router.push(item.path);
                  setIsOpen(false);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="icon">{item.icon}</div>
                <div className="text">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </MenuItem>
            ))}
          </MenuList>
        )}
      </AnimatePresence>
    </Container>
  );
} 