'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const COOKIE_NAME = 'wb_admin'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function loginAction(formData: FormData) {
  const password = formData.get('password') as string
  const adminToken = process.env.ADMIN_TOKEN

  if (!adminToken || !password || password !== adminToken) {
    return { error: 'Invalid password' }
  }

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, adminToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  })

  redirect('/admin')
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
  redirect('/admin/login')
}
