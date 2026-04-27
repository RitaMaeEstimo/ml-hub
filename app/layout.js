import './globals.css'

export const metadata = {
  title: 'Machine Learning Hub',
  description: 'A curated platform for learning machine learning — from foundational theory to production-ready deployment.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}