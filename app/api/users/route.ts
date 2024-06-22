import { NextResponse } from 'next/server'
 
export const GET = (request: Request) => {
  return new NextResponse('Hello, Next.js!')
}