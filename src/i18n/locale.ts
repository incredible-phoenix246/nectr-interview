'use server'

import { cookies } from 'next/headers'
import { type Locale, defaultLocale } from './config'

const COOKIE_NAME = 'NEXT_LOCALE'

export async function getUserLocale() {
  const cookie = await cookies()
  return (cookie.get(COOKIE_NAME)?.value as Locale) || defaultLocale
}

export async function setUserLocale(locale: Locale) {
  const cookie = await cookies()
  cookie.set(COOKIE_NAME, locale, { path: '/' })
}
