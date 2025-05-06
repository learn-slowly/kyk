import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 미들웨어 함수
export function middleware(request: NextRequest) {
  // 스튜디오 경로인 경우 헤더에 플래그 추가
  if (request.nextUrl.pathname.startsWith('/studio')) {
    // 스튜디오 경로에 대한 응답을 그대로 반환 (별도 처리 없음)
    return NextResponse.next()
  }

  // 다른 경로는 정상적으로 처리
  return NextResponse.next()
}

// 구성 설정 - 필요한 경로에만 미들웨어 적용
export const config = {
  matcher: [
    // 모든 경로에 적용
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 