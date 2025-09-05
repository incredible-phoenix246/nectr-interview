import { Menu } from '~/components/global/menu'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="relative mx-auto flex h-screen max-w-[1500px] flex-col gap-4 border-x border-dashed">
      <div className="flex-1 overflow-y-auto">{children}</div>
      <Menu />
    </main>
  )
}
