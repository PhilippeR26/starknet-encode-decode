import './globals.css'

export const metadata = {
  title: 'Starknet-encode-decode',
  description: 'Tool to encode/decode Starknet data',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}</body>
    </html>
  )
}
