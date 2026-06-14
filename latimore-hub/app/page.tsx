import { Metadata } from 'next'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import About from '@/components/About'
import CTA from '@/components/CTA'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Latimore Life & Legacy LLC - Protecting Today. Securing Tomorrow.',
  description: 'Professional insurance and financial protection services for families and businesses in Schuylkill, Luzerne, and Northumberland Counties, Pennsylvania.',
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <About />
        <CTA />
      </main>
      <Footer />
    </>
  )
}