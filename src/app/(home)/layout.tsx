import { Menu } from '~/components/global/menu'
import { LanguageSwitch } from '~/components/ui/language-switch'
import { getUserLocale } from '~/i18n/locale'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const currentLocale = await getUserLocale()
  return (
    <main className="relative mx-auto flex h-screen max-w-[1500px] flex-col gap-4 border-x border-dashed">
      <LanguageSwitch currentLocale={currentLocale} />
      <div className="flex-1 overflow-y-auto">{children}</div>
      <Menu />
    </main>
  )
}
