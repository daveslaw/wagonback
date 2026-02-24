import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'wb_admin'

export function middleware(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value
  const adminToken = process.env.ADMIN_TOKEN

  if (!adminToken || !token || token !== adminToken) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin',
}
