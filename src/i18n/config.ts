export const locales = ['en', 'de', 'hu'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export const localeNames: Record<Locale, string> = {
    en: 'English',
    de: 'Deutsch',
    hu: 'Magyar',
}

export const localeFlags: Record<Locale, string> = {
    en: '🇺🇸',
    de: '🇩🇪',
    hu: '🇭🇺',
}
