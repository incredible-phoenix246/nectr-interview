export const locales = ['en', 'de', 'hu'] as const
export const defaultLocale: Locale = 'en'
export type Locale = (typeof locales)[number]
