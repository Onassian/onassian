import Masthead from '@/sections/Masthead'
import Hero from '@/sections/Hero'
import Convoy from '@/sections/Convoy'
import HarbourBand from '@/sections/HarbourBand'
import Wire from '@/sections/Wire'
import Numbers from '@/sections/Numbers'
import Stocks from '@/sections/Stocks'
import Shipyards from '@/sections/Shipyards'
import Tycoons from '@/sections/Tycoons'
import Report from '@/sections/Report'
import Contact from '@/sections/Contact'
import Footer from '@/sections/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-[#f6f1e4] text-[#241f17] antialiased">
      <Masthead />
      <main>
        <Hero />
        <HarbourBand />
        <Convoy />
        <Wire />
        <Numbers />
        <Stocks />
        <Shipyards />
        <Tycoons />
        <Report />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
