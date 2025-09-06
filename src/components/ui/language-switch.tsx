'use client'

import { useTransition } from 'react'
import { Button } from './button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu'
import { locales, localeNames, localeFlags, type Locale } from '~/i18n/config'
import { setUserLocale } from '~/i18n/locale'

interface LanguageSwitchProps {
  currentLocale: Locale
}

export function LanguageSwitch({ currentLocale }: LanguageSwitchProps) {
  const [isPending, startTransition] = useTransition()

  const handleLocaleChange = (locale: Locale) => {
    startTransition(() => {
      setUserLocale(locale)
    })
  }

  return (
    <div className="absolute top-4 right-8 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-10 w-10 bg-transparent p-0"
            disabled={isPending}
          >
            <span
              className="text-lg"
              role="img"
              aria-label={localeNames[currentLocale]}
            >
              {localeFlags[currentLocale]}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[120px]">
          {locales.map((locale) => (
            <DropdownMenuItem
              key={locale}
              onClick={() => handleLocaleChange(locale)}
              className="flex cursor-pointer items-center gap-2"
              disabled={locale === currentLocale}
            >
              <span
                className="text-base"
                role="img"
                aria-label={localeNames[locale]}
              >
                {localeFlags[locale]}
              </span>
              <span className="text-sm">{localeNames[locale]}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
