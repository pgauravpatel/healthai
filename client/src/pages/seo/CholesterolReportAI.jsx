import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { 
  Heart, Upload, CheckCircle, ArrowRight, 
  Activity, AlertTriangle, Sparkles, Apple
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Seo, { getMedicalWebPageSchema, getFAQSchema } from '@/components/seo/Seo'

export default function CholesterolReportAI() {
  const { t } = useTranslation()

  const faqs = [
    {
      question: "What is a good cholesterol level?",
      answer: "For total cholesterol, below 200 mg/dL is desirable. LDL (bad cholesterol) should be below 100 mg/dL, while HDL (good cholesterol) should be 60 mg/dL or higher. Triglycerides should be below 150 mg/dL."
    },
    {
      question: "What's the difference between LDL and HDL cholesterol?",
      answer: "LDL (Low-Density Lipoprotein) is called 'bad' cholesterol because it builds up in artery walls. HDL (High-Density Lipoprotein) is 'good' cholesterol because it helps remove LDL from your bloodstream."
    },
    {
      question: "How can I lower my cholesterol naturally?",
      answer: "Lifestyle changes can significantly impact cholesterol: eat heart-healthy foods, exercise regularly, maintain a healthy weight, quit smoking, and limit alcohol. Our AI provides personalized lifestyle recommendations based on your report."
    },
    {
      question: "How often should I check my cholesterol?",
      answer: "Adults should get cholesterol checked every 4-6 years. Those with risk factors or existing heart conditions may need more frequent testing. Our AI helps track your levels over time."
    }
  ]

  const schema = {
    ...getMedicalWebPageSchema(
      t('seo.cholesterolTitle'),
      t('seo.cholesterolDescription'),
      'https://www.healthreportscan.info/cholesterol-report-ai'
    ),
    ...getFAQSchema(faqs)
  }

  return (
    <>
      <Seo
        title={t('seo.cholesterolTitle')}
        description={t('seo.cholesterolDescription')}
        keywords={t('seo.cholesterolKeywords')}
        canonicalUrl="/cholesterol-report-ai"
        schema={schema}
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-pink-500/10 via-background to-red-500/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 rounded-full text-pink-600 dark:text-pink-400 text-sm font-medium mb-6">
                  <Heart className="w-4 h-4" />
                  Heart Health Analysis
                </span>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  AI Cholesterol Report Analyzer
                  <span className="block gradient-text mt-2">Understand Your Lipid Panel</span>
                </h1>
                
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Get your cholesterol and lipid panel results analyzed by AI. Understand LDL, HDL, 
                  triglycerides, and get personalized heart health recommendations.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button size="xl" variant="gradient" asChild>
                    <Link to="/report-analyzer">
                      <Upload className="w-5 h-5" />
                      Analyze Cholesterol Report
                    </Link>
                  </Button>
                  <Button size="xl" variant="outline" asChild>
                    <Link to="/blood-test-analysis">
                      Blood Test Analysis
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Cholesterol Overview */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                Understanding Cholesterol: Your Complete Guide
              </h2>
              
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p>
                  Cholesterol is a waxy substance found in your blood. Your body needs cholesterol 
                  to build healthy cells, but high levels can increase your risk of heart disease. 
                  Understanding your cholesterol numbers is crucial for maintaining heart health.
                </p>

                <h3>The Lipid Panel Explained</h3>
                <p>
                  A lipid panel (or lipid profile) is a blood test that measures different types 
                  of fats in your blood. Here's what each measurement means:
                </p>
              </div>

              {/* Cholesterol Cards */}
              <div className="my-12 grid md:grid-cols-2 gap-6">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                    <h3 className="text-xl font-bold">LDL Cholesterol (Bad)</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Low-density lipoprotein carries cholesterol to your arteries, where it may 
                    collect in vessel walls and contribute to plaque buildup.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-green-500/10 rounded">
                      <span>Optimal</span>
                      <span className="font-mono">&lt; 100 mg/dL</span>
                    </div>
                    <div className="flex justify-between p-2 bg-yellow-500/10 rounded">
                      <span>Near Optimal</span>
                      <span className="font-mono">100-129 mg/dL</span>
                    </div>
                    <div className="flex justify-between p-2 bg-orange-500/10 rounded">
                      <span>Borderline High</span>
                      <span className="font-mono">130-159 mg/dL</span>
                    </div>
                    <div className="flex justify-between p-2 bg-red-500/10 rounded">
                      <span>High</span>
                      <span className="font-mono">160-189 mg/dL</span>
                    </div>
                    <div className="flex justify-between p-2 bg-red-600/20 rounded">
                      <span>Very High</span>
                      <span className="font-mono">≥ 190 mg/dL</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Heart className="w-8 h-8 text-green-500" />
                    <h3 className="text-xl font-bold">HDL Cholesterol (Good)</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    High-density lipoprotein absorbs cholesterol and carries it back to the liver, 
                    which flushes it from the body. Higher HDL levels are better.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-red-500/10 rounded">
                      <span>Low (Risk Factor)</span>
                      <span className="font-mono">&lt; 40 mg/dL</span>
                    </div>
                    <div className="flex justify-between p-2 bg-yellow-500/10 rounded">
                      <span>Borderline</span>
                      <span className="font-mono">40-59 mg/dL</span>
                    </div>
                    <div className="flex justify-between p-2 bg-green-500/10 rounded">
                      <span>Good (Protective)</span>
                      <span className="font-mono">≥ 60 mg/dL</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Activity className="w-8 h-8 text-amber-500" />
                    <h3 className="text-xl font-bold">Triglycerides</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Triglycerides are a type of fat used to store excess energy from your diet. 
                    High levels can contribute to hardening of the arteries.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-green-500/10 rounded">
                      <span>Normal</span>
                      <span className="font-mono">&lt; 150 mg/dL</span>
                    </div>
                    <div className="flex justify-between p-2 bg-yellow-500/10 rounded">
                      <span>Borderline High</span>
                      <span className="font-mono">150-199 mg/dL</span>
                    </div>
                    <div className="flex justify-between p-2 bg-orange-500/10 rounded">
                      <span>High</span>
                      <span className="font-mono">200-499 mg/dL</span>
                    </div>
                    <div className="flex justify-between p-2 bg-red-500/10 rounded">
                      <span>Very High</span>
                      <span className="font-mono">≥ 500 mg/dL</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-8 h-8 text-blue-500" />
                    <h3 className="text-xl font-bold">Total Cholesterol</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Total cholesterol is the overall amount of cholesterol in your blood, 
                    including LDL, HDL, and other lipid components.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-green-500/10 rounded">
                      <span>Desirable</span>
                      <span className="font-mono">&lt; 200 mg/dL</span>
                    </div>
                    <div className="flex justify-between p-2 bg-yellow-500/10 rounded">
                      <span>Borderline High</span>
                      <span className="font-mono">200-239 mg/dL</span>
                    </div>
                    <div className="flex justify-between p-2 bg-red-500/10 rounded">
                      <span>High</span>
                      <span className="font-mono">≥ 240 mg/dL</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none">
                <h3>Lifestyle Tips for Better Cholesterol</h3>
                <p>
                  Our AI provides personalized recommendations based on your cholesterol levels. 
                  Here are some general tips that can help improve your lipid profile:
                </p>
              </div>

              {/* Lifestyle Tips */}
              <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: Apple, title: 'Heart-Healthy Diet', desc: 'Reduce saturated fats, eat more fiber, omega-3 rich foods' },
                  { icon: Activity, title: 'Regular Exercise', desc: '150 minutes of moderate activity per week' },
                  { icon: Heart, title: 'Maintain Weight', desc: 'Even small weight loss can help lower cholesterol' },
                  { icon: AlertTriangle, title: 'Quit Smoking', desc: 'Quitting improves HDL cholesterol levels' }
                ].map((tip, i) => (
                  <motion.div
                    key={tip.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-xl bg-card border text-center"
                  >
                    <tip.icon className="w-8 h-8 text-health-500 mx-auto mb-2" />
                    <h4 className="font-semibold text-sm mb-1">{tip.title}</h4>
                    <p className="text-xs text-muted-foreground">{tip.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                Cholesterol FAQs
              </h2>

              <div className="space-y-6">
                {faqs.map((faq, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 rounded-xl bg-card border"
                  >
                    <h3 className="text-lg font-semibold mb-3 flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-health-500 flex-shrink-0 mt-0.5" />
                      {faq.question}
                    </h3>
                    <p className="text-muted-foreground pl-8">{faq.answer}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto glass-card p-12">
              <Heart className="w-16 h-16 text-pink-500 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Check Your Heart Health Today
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Upload your lipid panel or cholesterol report for instant AI analysis 
                with heart health recommendations.
              </p>
              <Button size="xl" variant="gradient" asChild>
                <Link to="/report-analyzer">
                  <Upload className="w-5 h-5" />
                  Analyze Cholesterol Free
                </Link>
              </Button>
              
              <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
                <Link to="/ai-health-report-analyzer" className="text-primary hover:underline">
                  ← All Report Types
                </Link>
                <Link to="/blood-test-analysis" className="text-primary hover:underline">
                  Blood Test Analysis →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-8 bg-amber-50 dark:bg-amber-900/10 border-y border-amber-200 dark:border-amber-800">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>⚕️ Medical Disclaimer:</strong> Cholesterol analysis is for educational purposes only. 
              High cholesterol can be a serious condition. Please consult your doctor for proper evaluation and treatment.
            </p>
          </div>
        </section>
      </div>
    </>
  )
}

