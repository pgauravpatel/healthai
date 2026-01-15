import { motion } from 'framer-motion'
import { AlertTriangle, Shield, Heart, Phone } from 'lucide-react'

export default function Disclaimer() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-6">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Medical Disclaimer</h1>
          <p className="text-muted-foreground text-lg">
            Important information about the use of Health Scan
          </p>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 mb-8">
            <h2 className="text-amber-800 dark:text-amber-200 mt-0 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              General Disclaimer
            </h2>
            <p className="text-amber-700 dark:text-amber-300 mb-0">
              The information provided by Health Scan is for <strong>general educational and informational purposes only</strong>. 
              It is not intended to be a substitute for professional medical advice, diagnosis, or treatment.
            </p>
          </div>

          <h2>What Health Scan Does</h2>
          <ul>
            <li>Provides general health information and education</li>
            <li>Offers lifestyle and wellness guidance</li>
            <li>Shares tips for healthy living</li>
            <li>Helps you understand when to seek medical care</li>
            <li>Provides health-related articles and resources</li>
          </ul>

          <h2>What Health Scan Does NOT Do</h2>
          <ul>
            <li>Diagnose medical conditions or diseases</li>
            <li>Prescribe medications or treatments</li>
            <li>Replace consultations with healthcare professionals</li>
            <li>Provide emergency medical advice</li>
            <li>Make specific medical recommendations</li>
          </ul>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 my-8">
            <h2 className="text-red-800 dark:text-red-200 mt-0 flex items-center gap-2">
              <Phone className="w-6 h-6" />
              In Case of Emergency
            </h2>
            <p className="text-red-700 dark:text-red-300 mb-0">
              If you are experiencing a medical emergency, please <strong>call your local emergency services immediately</strong> 
              (911 in the United States, 999 in the UK, 112 in Europe, or your local emergency number). 
              Do not rely on this platform for emergency medical situations.
            </p>
          </div>

          <h2>Always Consult Healthcare Professionals</h2>
          <p>
            Always seek the advice of your physician or other qualified health provider with any questions 
            you may have regarding a medical condition. Never disregard professional medical advice or delay 
            in seeking it because of something you have read on this platform.
          </p>

          <h2>Accuracy of Information</h2>
          <p>
            While we strive to provide accurate and up-to-date health information, medical knowledge is 
            constantly evolving. The information provided may not reflect the most current research or 
            medical guidelines. We make no representations or warranties about the completeness, reliability, 
            or accuracy of this information.
          </p>

          <h2>No Doctor-Patient Relationship</h2>
          <p>
            Your use of this platform does not create a doctor-patient relationship between you and Health Scan 
            or any of its affiliates. The assistant is not a licensed healthcare provider and cannot 
            diagnose, treat, cure, or prevent any disease or health condition.
          </p>

          <h2>User Responsibility</h2>
          <p>
            By using Health Scan, you acknowledge and agree that:
          </p>
          <ul>
            <li>You are responsible for your own health decisions</li>
            <li>You will consult qualified healthcare providers for medical advice</li>
            <li>You understand the limitations of health information on this platform</li>
            <li>You will not use this platform as a substitute for professional care</li>
          </ul>

          <div className="bg-primary/10 rounded-2xl p-6 mt-8">
            <h2 className="mt-0 flex items-center gap-2">
              <Heart className="w-6 h-6 text-primary" />
              Our Commitment
            </h2>
            <p className="mb-0">
              Health Scan is committed to providing helpful health information while always encouraging 
              users to seek professional medical care. Your health and safety are our top priorities. 
              We believe in empowering individuals with knowledge while respecting the irreplaceable 
              value of qualified healthcare professionals.
            </p>
          </div>
        </div>

        {/* Last Updated */}
        <p className="text-center text-muted-foreground mt-12">
          Last updated: January 2026
        </p>
      </motion.div>
    </div>
  )
}
