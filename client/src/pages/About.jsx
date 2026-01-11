import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { 
  Shield, Heart, Brain, Users, Globe, Award,
  CheckCircle, ArrowRight, Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Seo, { organizationSchema, softwareSchema } from '@/components/seo/Seo'

export default function About() {
  const { t } = useTranslation()

  return (
    <>
      <Seo
        title="About HealthAI - Our Mission & Team"
        description="Learn about HealthAI's mission to make health information accessible. We use AI to help people understand their medical reports in simple language."
        keywords="about HealthAI, health AI company, medical AI startup, health tech, AI health analyzer team"
        canonicalUrl="/about"
        schema={[organizationSchema, softwareSchema]}
      />

      <div className="min-h-screen">
        {/* Hero */}
        <section className="relative py-20 bg-gradient-to-br from-health-500/10 via-background to-mint-500/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  About <span className="gradient-text">HealthAI</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Empowering individuals to understand their health through AI-powered insights. 
                  We believe everyone deserves access to clear, understandable health information.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Medical reports can be confusing. Lab values, abbreviations, and technical terms 
                  often leave patients feeling uncertain about their health. HealthAI was created 
                  to bridge this gap.
                </p>
                <p className="text-lg text-muted-foreground mb-6">
                  We leverage advanced AI technology to translate complex medical information into 
                  clear, understandable language. Our goal is not to replace doctors, but to 
                  empower patients with knowledge before and after their medical consultations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="gradient" asChild>
                    <Link to="/report-analyzer">Try Report Analyzer</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/ai-health-report-analyzer">Learn More <ArrowRight className="w-4 h-4" /></Link>
                  </Button>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 gap-4"
              >
                {[
                  { icon: Brain, label: 'AI-Powered', desc: 'Advanced GPT-4 technology' },
                  { icon: Shield, label: 'Private & Secure', desc: 'Your data is protected' },
                  { icon: Globe, label: 'Multi-Language', desc: 'English, Hindi, Spanish' },
                  { icon: Heart, label: 'Health First', desc: 'Educational focus' }
                ].map((item, i) => (
                  <div key={item.label} className="p-6 rounded-xl bg-card border">
                    <item.icon className="w-10 h-10 text-health-500 mb-3" />
                    <h3 className="font-semibold mb-1">{item.label}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do at HealthAI
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: Shield,
                  title: 'Privacy First',
                  description: 'Your health data is sensitive. We never store, share, or sell your medical information. All processing is secure and encrypted.'
                },
                {
                  icon: Award,
                  title: 'Accuracy & Safety',
                  description: 'We use cautious, medically-reviewed language. Our AI always recommends consulting healthcare professionals for medical decisions.'
                },
                {
                  icon: Users,
                  title: 'Accessibility',
                  description: 'Health information should be accessible to everyone. We support multiple languages and provide free basic analysis.'
                }
              ].map((value, i) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-2xl bg-card border text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-health-500/10 flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-8 h-8 text-health-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">What We Offer</h2>
              
              <div className="space-y-6">
                {[
                  {
                    title: 'AI Health Report Analyzer',
                    desc: 'Upload blood tests, CBC, lipid panels, and other lab reports. Get instant, easy-to-understand analysis.',
                    link: '/ai-health-report-analyzer'
                  },
                  {
                    title: 'AI Health Assistant',
                    desc: 'Chat with our AI about health questions. Get information about symptoms, lifestyle advice, and when to see a doctor.',
                    link: '/chat'
                  },
                  {
                    title: 'Health Blog',
                    desc: 'Expert articles on wellness, nutrition, fitness, and disease prevention. Evidence-based health information.',
                    link: '/blogs'
                  },
                  {
                    title: 'Multi-Language Support',
                    desc: 'Access all features in English, Hindi, and Spanish. More languages coming soon.',
                    link: '/report-analyzer'
                  }
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex gap-4 p-6 rounded-xl bg-card border hover:shadow-lg transition-all"
                  >
                    <CheckCircle className="w-6 h-6 text-health-500 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground mb-3">{item.desc}</p>
                      <Link to={item.link} className="text-primary hover:underline inline-flex items-center gap-1">
                        Learn more <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-health-500/10 to-mint-500/10">
          <div className="container mx-auto px-4 text-center">
            <Sparkles className="w-12 h-12 text-health-500 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Understand Your Health Better?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of users who trust HealthAI to help them understand their medical reports.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="xl" variant="gradient" asChild>
                <Link to="/register">Get Started Free</Link>
              </Button>
              <Button size="xl" variant="outline" asChild>
                <Link to="/report-analyzer">Try Report Analyzer</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-8 bg-amber-50 dark:bg-amber-900/10 border-y border-amber-200 dark:border-amber-800">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>⚕️ Important:</strong> HealthAI provides educational information only. 
              We do not provide medical diagnosis, treatment advice, or prescriptions. 
              Always consult qualified healthcare professionals for medical decisions.
            </p>
          </div>
        </section>
      </div>
    </>
  )
}

