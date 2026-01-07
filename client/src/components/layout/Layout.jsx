import Navbar from './Navbar'
import Footer from './Footer'
import MedicalDisclaimer from '../MedicalDisclaimer'
import ChatWidget from '../chat/ChatWidget'

export default function Layout({ children, showFooter = true, showDisclaimer = true }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Medical Disclaimer Banner */}
      {showDisclaimer && <MedicalDisclaimer />}
      
      {/* Main Content */}
      <main className="flex-1 pt-16">
        {children}
      </main>
      
      {/* Footer */}
      {showFooter && <Footer />}
      
      {/* Floating Chat Widget */}
      <ChatWidget />
    </div>
  )
}

