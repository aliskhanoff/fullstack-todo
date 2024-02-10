import { verifyToken } from '@fullstack-todo/functions';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  
  // const authorization = request.headers.get("Authorization");
  
  // if (authorization) {
  //   const token = authorization.split(' ')[1];
  //   const decoded = verifyToken(token);
  // }

  // if (authorization) {
  //   return NextResponse.redirect(new URL('/dashboard', request.url))
  // }
  // return NextResponse.redirect(new URL('/login', request.url))
}
 
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}