'use client';

import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import Link from 'next/link';
import { TypedObject } from '@portabletext/types';
import { PortableTextMarkComponentProps, PortableTextReactComponents } from '@portabletext/react';

interface ImageValue {
  asset?: {
    url?: string;
  };
  alt?: string;
  caption?: string;
}

interface FileValue {
  asset?: {
    url?: string;
  };
  description?: string;
}

interface LinkValue {
  _type: 'link';
  href: string;
}

interface BlockProps {
  children: React.ReactNode;
}

// 포터블 텍스트 블록 커스텀 컴포넌트
const components: Partial<PortableTextReactComponents> = {
  types: {
    image: ({ value }: { value: ImageValue }) => {
      if (!value?.asset?.url) {
        return null;
      }
      return (
        <div className="my-4 position-relative rounded overflow-hidden" style={{ height: '300px' }}>
          <Image
            src={value.asset.url}
            alt={value.alt || '이미지'}
            fill
            sizes="(max-width:, height: '300px'768px) 100vw, 800px"
            className="object-fit-cover"
          />
          {value.caption && (
            <div className="bg-dark bg-opacity-50 text-white p-2 position-absolute bottom-0 w-100">
              <p className="mb-0 small">{value.caption}</p>
            </div>
          )}
        </div>
      );
    },
    file: ({ value }: { value: FileValue }) => {
      if (!value?.asset?.url) {
        return null;
      }
      return (
        <div className="my-3">
          <a
            href={value.asset.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-primary d-flex align-items-center"
          >
            <i className="bi bi-file-earmark-text me-2"></i>
            {value.description || '첨부파일 다운로드'}
          </a>
        </div>
      );
    },
  },
  marks: {
    link: ({ children, value }: PortableTextMarkComponentProps) => {
      if (!value?.href) return <>{children}</>;
      
      const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined;
      const target = !value.href.startsWith('/') ? '_blank' : undefined;
      
      return (
        <Link 
          href={value.href} 
          target={target}
          rel={rel}
          className="text-primary text-decoration-underline"
        >
          {children}
        </Link>
      );
    },
  },
  block: {
    h2: ({ children }: BlockProps) => (
      <h2 className="fs-2 fw-bold mt-5 mb-3">{children}</h2>
    ),
    h3: ({ children }: BlockProps) => (
      <h3 className="fs-3 fw-bold mt-4 mb-3">{children}</h3>
    ),
    normal: ({ children }: BlockProps) => (
      <p className="mb-4 fs-5">{children}</p>
    ),
    blockquote: ({ children }: BlockProps) => (
      <blockquote className="blockquote border-start border-primary ps-4 py-2 my-4">
        <p className="mb-0 fs-5 fst-italic">{children}</p>
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: BlockProps) => (
      <ul className="mb-4 ps-4 fs-5">{children}</ul>
    ),
    number: ({ children }: BlockProps) => (
      <ol className="mb-4 ps-4 fs-5">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: BlockProps) => (
      <li className="mb-2">{children}</li>
    ),
    number: ({ children }: BlockProps) => (
      <li className="mb-2">{children}</li>
    ),
  }
};

interface PortableTextContentProps {
  content: TypedObject | TypedObject[];
}

export function PortableTextContent({ content }: PortableTextContentProps) {
  if (!content) {
    return <p className="text-muted fs-5">콘텐츠가 없습니다.</p>;
  }

  return (
    <div className="portable-text-content">
      <PortableText value={content} components={components} />
    </div>
  );
} 