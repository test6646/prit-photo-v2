import React from 'react'
import Navbar from '@/components/Navbar'
import Landing from '@/components/Landing'
import AboutSection from '@/components/AboutSection'
import Testimonials from '@/components/Testimonials'
import Services from '@/components/Services'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'

function page() {
  return <>
  <div className="main">
    <Navbar/>
    <Landing/>
    <AboutSection/>
    <Services/>
    <Testimonials/>
    <FAQ/>
    <Footer/>
  </div>
  </>
}

export default page