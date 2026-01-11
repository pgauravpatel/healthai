import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileSearch, Loader2, History, Sparkles, Shield, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import FileUpload from '@/components/report/FileUpload'
import UserProfileForm from '@/components/report/UserProfileForm'
import AnalysisResult from '@/components/report/AnalysisResult'
import MedicalDisclaimer from '@/components/MedicalDisclaimer'
import { reportAPI } from '@/services/api'
import { useToast } from '@/context/ToastContext'
import { useAuth } from '@/context/AuthContext'
import { Link } from 'react-router-dom'

export default function ReportAnalyzer() {
  const { user } = useAuth()
  const { showToast } = useToast()
  
  const [file, setFile] = useState(null)
  const [userProfile, setUserProfile] = useState({
    age: '',
    gender: '',
    conditions: ''
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleAnalyze = async () => {
    if (!file) {
      showToast('Please select a file to analyze', 'error')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('report', file)
      
      // Add user profile if provided
      if (userProfile.age) formData.append('age', userProfile.age)
      if (userProfile.gender) formData.append('gender', userProfile.gender)
      if (userProfile.conditions) formData.append('conditions', userProfile.conditions)

      const response = await reportAPI.analyzeReport(formData)
      
      setResult(response.data.data)
      showToast('Report analyzed successfully!', 'success')

    } catch (err) {
      console.error('Analysis error:', err)
      const message = err.response?.data?.message || 'Failed to analyze report. Please try again.'
      setError(message)
      showToast(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setResult(null)
    setError(null)
    setUserProfile({ age: '', gender: '', conditions: '' })
  }

  // Not logged in state
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-health-500/5 via-background to-mint-500/5 py-12">
        <div className="container max-w-2xl mx-auto px-4 text-center">
          <FileSearch className="w-16 h-16 mx-auto text-health-500 mb-4" />
          <h1 className="text-3xl font-bold mb-4">AI Report Analyzer</h1>
          <p className="text-muted-foreground mb-8">
            Please log in to use the Health Report Analyzer feature.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link to="/login">Log In</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-health-500/5 via-background to-mint-500/5">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-health-500/10 text-health-600 dark:text-health-400 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Analysis</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Health Report Analyzer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your lab report and get an easy-to-understand explanation of your results.
            Our AI helps you understand what the numbers mean.
          </p>
        </motion.div>

        {/* Features */}
        {!result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid sm:grid-cols-3 gap-4 mb-10"
          >
            <Card className="bg-card/50">
              <CardContent className="pt-6 text-center">
                <FileSearch className="w-8 h-8 mx-auto text-health-500 mb-2" />
                <h3 className="font-medium mb-1">OCR Extraction</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically reads text from PDFs and images
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardContent className="pt-6 text-center">
                <Shield className="w-8 h-8 mx-auto text-mint-500 mb-2" />
                <h3 className="font-medium mb-1">Safe & Private</h3>
                <p className="text-sm text-muted-foreground">
                  Your data is encrypted and secure
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardContent className="pt-6 text-center">
                <Clock className="w-8 h-8 mx-auto text-amber-500 mb-2" />
                <h3 className="font-medium mb-1">Quick Results</h3>
                <p className="text-sm text-muted-foreground">
                  Get analysis in under a minute
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Content */}
        {!result ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Medical Disclaimer */}
            <MedicalDisclaimer variant="compact" />

            {/* File Upload */}
            <Card>
              <CardContent className="pt-6 space-y-6">
                <FileUpload 
                  onFileSelect={setFile} 
                  disabled={loading} 
                />

                {/* User Profile Form */}
                <UserProfileForm 
                  profile={userProfile}
                  onChange={setUserProfile}
                />

                {/* Analyze Button */}
                <Button
                  onClick={handleAnalyze}
                  disabled={!file || loading}
                  className="w-full h-12 text-lg"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing Report...
                    </>
                  ) : (
                    <>
                      <FileSearch className="w-5 h-5 mr-2" />
                      Analyze Report
                    </>
                  )}
                </Button>

                {/* Error Display */}
                {error && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* History Link */}
            <div className="text-center">
              <Link 
                to="/reports/history" 
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <History className="w-4 h-4" />
                View Report History
              </Link>
            </div>
          </motion.div>
        ) : (
          /* Results Display */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Actions Bar */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Analysis Results</h2>
              <Button variant="outline" onClick={handleReset}>
                Analyze Another Report
              </Button>
            </div>

            {/* Processing Time Badge */}
            {result.processingTime && (
              <div className="text-sm text-muted-foreground">
                Analyzed in {(result.processingTime / 1000).toFixed(1)}s
              </div>
            )}

            {/* Analysis Result Component */}
            <AnalysisResult 
              analysis={result.analysis} 
              reportType={result.reportType}
            />

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <Button onClick={handleReset} className="flex-1">
                Analyze Another Report
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link to="/reports/history">View History</Link>
              </Button>
            </div>
          </motion.div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-health-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Analyzing Your Report</h3>
              <p className="text-muted-foreground">
                This may take a moment...
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

