import React from 'react'
import Navbar from '@/components/Navbar'
import Landing from '@/components/Landing'
import AboutSection from '@/components/AboutSection'
import Testimonials from '@/components/Testimonials'
import Services from '@/components/Services'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
import ContactForm from '@/components/ContactForm'
import RecentEvents from '@/components/RecentStories'

function page() {
  return <>
  <div className="main">
    <Navbar/>
    <Landing/>
    <AboutSection/>
    <RecentEvents/>
    <Services/>
    <Testimonials/>
    <ContactForm/>
    <FAQ/>
    <Footer/>
  </div>
  </>
}

export default page