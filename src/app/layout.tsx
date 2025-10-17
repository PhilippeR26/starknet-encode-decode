import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Starknet-encode-decode',
  description: 'Tool to encode/decode Starknet data',
  icons: {
    icon: "./favicon.ico",
  },
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
