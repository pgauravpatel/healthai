import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { 
  Droplets, Upload, Brain, CheckCircle, ArrowRight, 
  Activity, Heart, Sparkles, AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Seo, { getMedicalWebPageSchema, getFAQSchema } from '@/components/seo/Seo'

export default function BloodTestAnalysis() {
  const { t } = useTranslation()

  const faqs = [
    {
      question: "What is included in a Complete Blood Count (CBC)?",
      answer: "A CBC measures several components of your blood including red blood cells (RBC), white blood cells (WBC), hemoglobin, hematocrit, and platelets. It helps detect conditions like anemia, infections, and blood disorders."
    },
    {
      question: "What do abnormal blood test results mean?",
      answer: "Abnormal results can indicate various conditions depending on which values are affected. High or low values may suggest infections, nutritional deficiencies, organ dysfunction, or other health issues. Our AI provides educational explanations, but always consult a doctor for proper diagnosis."
    },
    {
      question: "How often should I get blood tests?",
      answer: "For healthy adults, annual blood tests are typically recommended. Those with chronic conditions or risk factors may need more frequent testing. Your healthcare provider can advise on the appropriate frequency for your situation."
    },
    {
      question: "Can AI accurately analyze my blood test?",
      answer: "Our AI provides educational analysis by comparing your values with standard reference ranges. While it offers helpful insights, it's designed to complement—not replace—professional medical interpretation."
    }
  ]

  const schema = {
    ...getMedicalWebPageSchema(
      t('seo.bloodTestTitle'),
      t('seo.bloodTestDescription'),
      'https://healthai.vercel.app/blood-test-analysis'
    ),
    ...getFAQSchema(faqs)
  }

  return (
    <>
      <Seo
        title={t('seo.bloodTestTitle')}
        description={t('seo.bloodTestDescription')}
        keywords={t('seo.bloodTestKeywords')}
        canonicalUrl="/blood-test-analysis"
        schema={schema}
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-red-500/10 via-background to-health-500/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 rounded-full text-red-600 dark:text-red-400 text-sm font-medium mb-6">
                  <Droplets className="w-4 h-4" />
                  Free Blood Test Analysis
                </span>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  AI-Powered Blood Test Analysis
                  <span className="block gradient-text mt-2">CBC, Lipid Panel & More</span>
                </h1>
                
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Understand your blood test results instantly. Our AI analyzes CBC, hemoglobin, 
                  cholesterol levels, and other blood markers with easy-to-understand explanations.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button size="xl" variant="gradient" asChild>
                    <Link to="/report-analyzer">
                      <Upload className="w-5 h-5" />
                      Analyze Blood Test
                    </Link>
                  </Button>
                  <Button size="xl" variant="outline" asChild>
                    <Link to="/cholesterol-report-ai">
                      Cholesterol Analysis
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* What is Blood Test */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                Understanding Blood Tests: A Complete Guide
              </h2>
              
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p>
                  Blood tests are one of the most important diagnostic tools in modern medicine. 
                  They provide valuable insights into your overall health, helping detect diseases, 
                  assess organ function, and monitor chronic conditions. With Health Scan's blood test 
                  analyzer, you can now understand your results without medical jargon.
                </p>

                <h3>Complete Blood Count (CBC) - The Essential Test</h3>
                <p>
                  The Complete Blood Count (CBC) is the most commonly ordered blood test. It evaluates 
                  your overall health and detects a wide range of disorders, including anemia, infection, 
                  and leukemia.
                </p>

                <div className="my-8 grid md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-xl bg-red-500/5 border border-red-500/20">
                    <h4 className="font-bold text-red-600 dark:text-red-400 mb-3">Red Blood Cells (RBC)</h4>
                    <ul className="text-sm space-y-2">
                      <li><strong>Normal Range:</strong> 4.5-5.5 million cells/mcL (men), 4.0-5.0 million cells/mcL (women)</li>
                      <li><strong>High:</strong> May indicate dehydration, lung disease, or polycythemia</li>
                      <li><strong>Low:</strong> May suggest anemia, blood loss, or nutritional deficiency</li>
                    </ul>
                  </div>

                  <div className="p-6 rounded-xl bg-blue-500/5 border border-blue-500/20">
                    <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-3">White Blood Cells (WBC)</h4>
                    <ul className="text-sm space-y-2">
                      <li><strong>Normal Range:</strong> 4,500-11,000 cells/mcL</li>
                      <li><strong>High:</strong> May indicate infection, inflammation, or immune disorders</li>
                      <li><strong>Low:</strong> May suggest bone marrow problems or autoimmune conditions</li>
                    </ul>
                  </div>

                  <div className="p-6 rounded-xl bg-orange-500/5 border border-orange-500/20">
                    <h4 className="font-bold text-orange-600 dark:text-orange-400 mb-3">Hemoglobin (Hb)</h4>
                    <ul className="text-sm space-y-2">
                      <li><strong>Normal Range:</strong> 14-18 g/dL (men), 12-16 g/dL (women)</li>
                      <li><strong>High:</strong> May indicate lung disease or living at high altitude</li>
                      <li><strong>Low:</strong> Primary indicator of anemia</li>
                    </ul>
                  </div>

                  <div className="p-6 rounded-xl bg-purple-500/5 border border-purple-500/20">
                    <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-3">Platelets</h4>
                    <ul className="text-sm space-y-2">
                      <li><strong>Normal Range:</strong> 150,000-400,000 cells/mcL</li>
                      <li><strong>High:</strong> May increase clotting risk</li>
                      <li><strong>Low:</strong> May cause bleeding problems</li>
                    </ul>
                  </div>
                </div>

                <h3>Hemoglobin and Anemia</h3>
                <p>
                  Hemoglobin is the protein in red blood cells that carries oxygen throughout your body. 
                  Low hemoglobin levels (anemia) can cause fatigue, weakness, and shortness of breath. 
                  Common causes include iron deficiency, vitamin B12 deficiency, chronic diseases, and blood loss.
                </p>

                <h3>Understanding Your Blood Test Reference Ranges</h3>
                <p>
                  Reference ranges can vary slightly between laboratories. Factors like age, sex, 
                  and health conditions can affect what's considered "normal" for you. Our AI 
                  considers these factors when analyzing your results.
                </p>

                <h3>When to Get a Blood Test</h3>
                <p>
                  Regular blood tests are recommended for:
                </p>
                <ul>
                  <li>Annual health checkups</li>
                  <li>Monitoring chronic conditions like diabetes or thyroid disorders</li>
                  <li>Before starting new medications</li>
                  <li>Investigating symptoms like fatigue, unexplained weight loss, or frequent infections</li>
                  <li>Assessing nutritional status and deficiencies</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Blood Test Parameters */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Blood Test Parameters We Analyze
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { name: 'Hemoglobin (Hb)', desc: 'Oxygen-carrying protein in red blood cells', icon: Droplets },
                { name: 'RBC Count', desc: 'Number of red blood cells per unit volume', icon: Activity },
                { name: 'WBC Count', desc: 'White blood cells - immune system indicator', icon: Heart },
                { name: 'Platelet Count', desc: 'Blood clotting cells', icon: Sparkles },
                { name: 'Hematocrit (HCT)', desc: 'Percentage of blood volume that is RBCs', icon: Activity },
                { name: 'MCV, MCH, MCHC', desc: 'Red blood cell indices for anemia classification', icon: Brain },
                { name: 'ESR', desc: 'Erythrocyte sedimentation rate - inflammation marker', icon: AlertTriangle },
                { name: 'Blood Sugar', desc: 'Fasting glucose and HbA1c levels', icon: Heart },
                { name: 'Iron Studies', desc: 'Serum iron, ferritin, and TIBC', icon: Droplets }
              ].map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="p-6 rounded-xl bg-card border hover:shadow-lg transition-all"
                >
                  <item.icon className="w-8 h-8 text-red-500 mb-3" />
                  <h3 className="font-semibold mb-2">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                Blood Test FAQs
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
        <section className="py-20 bg-gradient-to-br from-red-500/10 to-health-500/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Get Your Blood Test Analyzed Now
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Upload your blood test report and receive instant AI-powered analysis 
              with detailed explanations and health recommendations.
            </p>
            <Button size="xl" variant="gradient" asChild>
              <Link to="/report-analyzer">
                <Upload className="w-5 h-5" />
                Analyze Blood Test Free
              </Link>
            </Button>
            
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/ai-health-report-analyzer" className="text-primary hover:underline">
                ← All Report Types
              </Link>
              <Link to="/cholesterol-report-ai" className="text-primary hover:underline">
                Cholesterol Analysis →
              </Link>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-8 bg-amber-50 dark:bg-amber-900/10 border-y border-amber-200 dark:border-amber-800">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>⚕️ Medical Disclaimer:</strong> Blood test analysis provided is for educational purposes only. 
              Results should be reviewed with a qualified healthcare provider for accurate interpretation and medical advice.
            </p>
          </div>
        </section>
      </div>
    </>
  )
}

