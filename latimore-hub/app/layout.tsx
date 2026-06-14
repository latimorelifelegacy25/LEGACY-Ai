import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Latimore Life & Legacy LLC - Protecting Today. Securing Tomorrow.',
  description: 'Professional insurance and financial protection services for families and businesses in Schuylkill, Luzerne, and Northumberland Counties, Pennsylvania.',
  keywords: 'life insurance, financial planning, retirement planning, Pennsylvania, Schuylkill County',
  authors: [{ name: 'Jackson M. Latimore Sr.' }],
  openGraph: {
    title: 'Latimore Life & Legacy LLC',
    description: 'Protecting Today. Securing Tomorrow. #TheBeatGoesOn',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA4_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.GA4_ID}');
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}