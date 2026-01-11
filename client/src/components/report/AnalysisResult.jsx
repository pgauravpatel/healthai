import { motion } from 'framer-motion'
import { 
  CheckCircle, AlertTriangle, AlertCircle, ArrowUp, ArrowDown, 
  Minus, Heart, Stethoscope, Apple, Activity, Info
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

/**
 * Get status color and icon based on test status
 */
const getStatusInfo = (status) => {
  switch (status) {
    case 'normal':
      return { color: 'text-green-500', bg: 'bg-green-500/10', icon: CheckCircle, label: 'Normal' }
    case 'high':
      return { color: 'text-amber-500', bg: 'bg-amber-500/10', icon: ArrowUp, label: 'High' }
    case 'low':
      return { color: 'text-blue-500', bg: 'bg-blue-500/10', icon: ArrowDown, label: 'Low' }
    case 'critical_high':
      return { color: 'text-red-500', bg: 'bg-red-500/10', icon: AlertTriangle, label: 'Critical High' }
    case 'critical_low':
      return { color: 'text-red-500', bg: 'bg-red-500/10', icon: AlertTriangle, label: 'Critical Low' }
    default:
      return { color: 'text-muted-foreground', bg: 'bg-muted', icon: Minus, label: 'Unknown' }
  }
}

/**
 * Summary Card Component
 */
function SummaryCard({ summary }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="bg-gradient-to-br from-health-500/10 to-mint-500/10 border-health-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-health-500" />
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">{summary}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

/**
 * Key Findings Card Component
 */
function KeyFindingsCard({ findings }) {
  if (!findings || findings.length === 0) return null

  // Sort findings: abnormal first
  const sortedFindings = [...findings].sort((a, b) => {
    if (a.status === 'normal' && b.status !== 'normal') return 1
    if (a.status !== 'normal' && b.status === 'normal') return -1
    return 0
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-primary" />
            Key Test Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedFindings.map((finding, index) => {
              const statusInfo = getStatusInfo(finding.status)
              const StatusIcon = statusInfo.icon

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-xl ${statusInfo.bg} border border-transparent hover:border-border transition-colors`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{finding.test}</span>
                        <Badge 
                          variant="outline" 
                          className={`${statusInfo.color} border-current`}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-mono font-medium text-foreground">
                          {finding.value}
                        </span>
                        {finding.normalRange && (
                          <span className="ml-2">
                            (Normal: {finding.normalRange})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

/**
 * Explanations Card Component
 */
function ExplanationsCard({ explanations }) {
  if (!explanations || explanations.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-500" />
            What These Results May Mean
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {explanations.map((item, index) => (
              <div key={index} className="pb-4 border-b last:border-0 last:pb-0">
                <h4 className="font-medium text-foreground mb-1">{item.test}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.meaning}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

/**
 * Lifestyle Suggestions Card Component
 */
function LifestyleCard({ suggestions }) {
  if (!suggestions || suggestions.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="bg-green-500/5 border-green-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Apple className="w-5 h-5 text-green-500" />
            Lifestyle & Diet Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-foreground">{suggestion}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  )
}

/**
 * Doctor Consultation Card Component
 */
function DoctorAdviceCard({ advice }) {
  if (!advice) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="bg-amber-500/5 border-amber-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-amber-500" />
            When to Consult a Doctor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">{advice}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

/**
 * Disclaimer Card Component
 */
function DisclaimerCard({ disclaimer }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="bg-red-500/5 border-red-500/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">
                Medical Disclaimer
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">
                {disclaimer || `This analysis is for educational purposes only and is NOT a medical diagnosis. 
                Please consult a qualified healthcare provider for proper medical advice and treatment.`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

/**
 * Main Analysis Result Component
 */
export default function AnalysisResult({ analysis, reportType }) {
  if (!analysis) return null

  return (
    <div className="space-y-6">
      {/* Report Type Badge */}
      {reportType && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Report Type:</span>
          <Badge variant="default" className="capitalize">
            {reportType.replace(/_/g, ' ')}
          </Badge>
        </div>
      )}

      {/* Summary */}
      <SummaryCard summary={analysis.summary} />

      {/* Key Findings */}
      <KeyFindingsCard findings={analysis.keyFindings} />

      {/* Explanations */}
      <ExplanationsCard explanations={analysis.explanations} />

      {/* Lifestyle Suggestions */}
      <LifestyleCard suggestions={analysis.lifestyleSuggestions} />

      {/* Doctor Advice */}
      <DoctorAdviceCard advice={analysis.doctorConsultationAdvice} />

      {/* Disclaimer */}
      <DisclaimerCard disclaimer={analysis.disclaimer} />
    </div>
  )
}

