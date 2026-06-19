import './globals.css'
import { Metadata } from 'next'

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
  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID || process.env.GA4_ID

  return (
    <html lang="en">
      <head>
        {ga4Id ? (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${ga4Id}');
                `,
              }}
            />
          </>
        ) : null}
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
