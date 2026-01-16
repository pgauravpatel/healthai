import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { 
  FileSearch, Upload, Brain, Shield, Clock, CheckCircle,
  ArrowRight, Sparkles, Heart, Activity, Stethoscope
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Seo, { getMedicalWebPageSchema, getFAQSchema, softwareSchema } from '@/components/seo/Seo'

export default function AIHealthReportAnalyzer() {
  const { t } = useTranslation()

  const faqs = [
    {
      question: "What types of health reports can I analyze?",
      answer: "Health Scan can analyze various types of lab reports including Complete Blood Count (CBC), Lipid Panel, Liver Function Tests (LFT), Kidney Function Tests, Thyroid Profile, Blood Sugar tests, and more. Simply upload your report in PDF or image format."
    },
    {
      question: "Is my health data secure?",
      answer: "Yes, your privacy is our priority. All uploaded reports are encrypted, processed securely, and never shared with third parties. We comply with healthcare data protection standards."
    },
    {
      question: "How accurate is the analysis?",
      answer: "Our analysis provides educational explanations based on standard medical reference ranges. However, it's important to note that analysis is for informational purposes only and should not replace professional medical advice."
    },
    {
      question: "Can I analyze reports in different languages?",
      answer: "Yes! Health Scan supports multiple languages including English, Hindi, and Spanish. Analysis will be provided in your selected language for better understanding."
    },
    {
      question: "Is the service free to use?",
      answer: "Yes, basic health report analysis is free. You can upload your reports and get explanations without any charge."
    }
  ]

  const schema = {
    ...getMedicalWebPageSchema(
      t('seo.reportAnalyzerTitle'),
      t('seo.reportAnalyzerDescription'),
      'https://www.healthreportscan.info/report-analyzer-info'
    ),
    ...getFAQSchema(faqs)
  }

  return (
    <>
      <Seo
        title={t('seo.reportAnalyzerTitle')}
        description={t('seo.reportAnalyzerDescription')}
        keywords={t('seo.reportAnalyzerKeywords')}
        canonicalUrl="/report-analyzer-info"
        schema={[schema, softwareSchema]}
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-red-500/10 via-background to-red-500/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 rounded-full text-red-600 dark:text-red-400 text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4" />
                  Smart Medical Report Analysis
                </span>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Health Report Analyzer
                  <span className="block text-red-600 mt-2">Understand Your Lab Tests</span>
                </h1>
                
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Upload your blood test, CBC, lipid panel, or any medical lab report. 
                  Get instant, easy-to-understand explanations in your preferred language.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button size="xl" variant="gradient" asChild>
                    <Link to="/report-analyzer">
                      <Upload className="w-5 h-5" />
                      Upload Your Report
                    </Link>
                  </Button>
                  <Button size="xl" variant="outline" asChild>
                    <Link to="/blood-test-analysis">
                      Learn About Blood Tests
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How Health Report Analysis Works
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Get comprehensive insights from your medical reports in three simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  step: '01',
                  icon: Upload,
                  title: 'Upload Your Report',
                  description: 'Simply upload your lab report in PDF or image format. Our system accepts blood tests, CBC reports, lipid panels, and more.'
                },
                {
                  step: '02',
                  icon: Brain,
                  title: 'Smart Analysis',
                  description: 'Our advanced system analyzes your report, identifying key values and comparing them with standard reference ranges.'
                },
                {
                  step: '03',
                  icon: FileSearch,
                  title: 'Get Insights',
                  description: 'Receive detailed explanations in simple language, along with lifestyle recommendations and guidance on when to consult a doctor.'
                }
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative"
                >
                  <div className="health-card p-8 h-full">
                    <div className="text-5xl font-bold text-red-500/20 mb-4">{item.step}</div>
                    <div className="w-14 h-14 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
                      <item.icon className="w-7 h-7 text-red-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Comprehensive Health Report Analysis Features
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Everything you need to understand your medical test results
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: FileSearch, title: 'OCR Technology', desc: 'Automatically extracts text from PDFs and images' },
                { icon: Brain, title: 'Smart Analysis', desc: 'Advanced technology for accurate insights' },
                { icon: Shield, title: 'Secure & Private', desc: 'Your health data is encrypted and protected' },
                { icon: Clock, title: 'Instant Results', desc: 'Get analysis in under 60 seconds' },
                { icon: Heart, title: 'Lifestyle Tips', desc: 'Personalized diet and exercise recommendations' },
                { icon: Activity, title: 'Normal Ranges', desc: 'Compare your values with standard ranges' },
                { icon: Stethoscope, title: 'Doctor Guidance', desc: 'Know when to consult a healthcare provider' },
                { icon: Sparkles, title: 'Multi-Language', desc: 'Analysis available in English, Hindi & Spanish' }
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="p-6 rounded-2xl bg-card border hover:shadow-lg transition-all"
                >
                  <feature.icon className="w-10 h-10 text-red-500 mb-4" />
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Supported Reports */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                Types of Medical Reports We Analyze
              </h2>
              
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p>
                  Our health report analyzer supports a wide range of medical laboratory tests. 
                  Whether you've just received your annual checkup results or specific diagnostic tests, 
                  we can help you understand what the numbers mean.
                </p>

                <h3>Complete Blood Count (CBC) Analysis</h3>
                <p>
                  The Complete Blood Count is one of the most common blood tests. We analyze key components including:
                </p>
                <ul>
                  <li><strong>Hemoglobin (Hb)</strong> - Measures oxygen-carrying capacity of blood</li>
                  <li><strong>Red Blood Cells (RBC)</strong> - Essential for oxygen transport</li>
                  <li><strong>White Blood Cells (WBC)</strong> - Indicates immune system status</li>
                  <li><strong>Platelets</strong> - Important for blood clotting</li>
                  <li><strong>Hematocrit</strong> - Percentage of red blood cells in blood</li>
                </ul>

                <h3>Lipid Panel / Cholesterol Test</h3>
                <p>
                  Understanding your cholesterol levels is crucial for heart health. We analyze:
                </p>
                <ul>
                  <li><strong>Total Cholesterol</strong> - Overall cholesterol level</li>
                  <li><strong>LDL (Bad Cholesterol)</strong> - Associated with heart disease risk</li>
                  <li><strong>HDL (Good Cholesterol)</strong> - Protective against heart disease</li>
                  <li><strong>Triglycerides</strong> - Type of fat in blood</li>
                  <li><strong>VLDL</strong> - Very low-density lipoprotein</li>
                </ul>

                <h3>Liver Function Tests (LFT)</h3>
                <p>
                  Liver function tests help assess liver health. We explain values for ALT, AST, 
                  ALP, Bilirubin, Albumin, and other liver markers.
                </p>

                <h3>Kidney Function Tests</h3>
                <p>
                  Monitor your kidney health with analysis of Creatinine, BUN (Blood Urea Nitrogen), 
                  GFR (Glomerular Filtration Rate), and Uric Acid levels.
                </p>

                <h3>Thyroid Profile</h3>
                <p>
                  Understand your thyroid function with TSH, T3, T4, and Free T4 analysis. 
                  We help identify potential thyroid disorders.
                </p>

                <h3>Blood Sugar Tests</h3>
                <p>
                  Monitor diabetes and blood sugar with Fasting Glucose, HbA1c, and 
                  Post-Prandial Blood Sugar analysis.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                Frequently Asked Questions
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
                      <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      {faq.question}
                    </h3>
                    <p className="text-muted-foreground pl-8">{faq.answer}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center glass-card p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Understand Your Health Report?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Upload your lab report now and get instant analysis with 
                easy-to-understand explanations and health recommendations.
              </p>
              <Button size="xl" variant="gradient" asChild>
                <Link to="/report-analyzer">
                  <Upload className="w-5 h-5" />
                  Analyze Your Report Free
                </Link>
              </Button>
              
              {/* Internal Links */}
              <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
                <Link to="/blood-test-analysis" className="text-primary hover:underline">
                  Blood Test Analysis →
                </Link>
                <Link to="/cholesterol-report-ai" className="text-primary hover:underline">
                  Cholesterol Report →
                </Link>
                <Link to="/blogs" className="text-primary hover:underline">
                  Health Articles →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Medical Disclaimer */}
        <section className="py-8 bg-amber-50 dark:bg-amber-900/10 border-y border-amber-200 dark:border-amber-800">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>⚕️ Medical Disclaimer:</strong> The analysis provided is for educational and informational purposes only. 
              It is not a substitute for professional medical advice, diagnosis, or treatment. 
              Always consult with a qualified healthcare provider for medical decisions.
            </p>
          </div>
        </section>
      </div>
    </>
  )
}
