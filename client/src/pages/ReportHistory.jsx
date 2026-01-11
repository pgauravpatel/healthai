import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  FileText, Trash2, RefreshCw, Eye, Calendar, 
  ChevronLeft, Loader2, AlertCircle, FileSearch
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import AnalysisResult from '@/components/report/AnalysisResult'
import { reportAPI } from '@/services/api'
import { useToast } from '@/context/ToastContext'
import { useAuth } from '@/context/AuthContext'

export default function ReportHistory() {
  const { user } = useAuth()
  const { showToast } = useToast()
  
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [pagination, setPagination] = useState({ page: 1, pages: 1 })

  useEffect(() => {
    fetchReports()
  }, [pagination.page])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const response = await reportAPI.getReports({ page: pagination.page, limit: 10 })
      setReports(response.data.reports)
      setPagination(response.data.pagination)
    } catch (err) {
      console.error('Failed to fetch reports:', err)
      showToast('Failed to load report history', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = async (report) => {
    if (selectedReport?._id === report._id) {
      setSelectedReport(null)
      return
    }

    try {
      setDetailLoading(true)
      const response = await reportAPI.getReport(report._id)
      setSelectedReport(response.data.report)
    } catch (err) {
      showToast('Failed to load report details', 'error')
    } finally {
      setDetailLoading(false)
    }
  }

  const handleDelete = async (reportId) => {
    if (!confirm('Are you sure you want to delete this report?')) return

    try {
      await reportAPI.deleteReport(reportId)
      setReports(reports.filter(r => r._id !== reportId))
      if (selectedReport?._id === reportId) {
        setSelectedReport(null)
      }
      showToast('Report deleted successfully', 'success')
    } catch (err) {
      showToast('Failed to delete report', 'error')
    }
  }

  const handleReanalyze = async (reportId) => {
    try {
      showToast('Re-analyzing report...', 'info')
      const response = await reportAPI.reanalyzeReport(reportId)
      
      // Update the report in the list
      setReports(reports.map(r => 
        r._id === reportId 
          ? { ...r, aiResponse: response.data.data.analysis, status: 'completed' }
          : r
      ))
      
      // Update selected report if viewing
      if (selectedReport?._id === reportId) {
        setSelectedReport({
          ...selectedReport,
          aiResponse: response.data.data.analysis,
          status: 'completed'
        })
      }
      
      showToast('Report re-analyzed successfully!', 'success')
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to re-analyze report'
      showToast(message, 'error')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>
      case 'processing':
        return <Badge className="bg-amber-500">Processing</Badge>
      case 'failed':
        return <Badge className="bg-red-500">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Login Required</h2>
            <p className="text-muted-foreground mb-4">
              Please log in to view your report history.
            </p>
            <Button asChild>
              <Link to="/login">Log In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-health-500/5 via-background to-mint-500/5 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/report-analyzer">
                <ChevronLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Report History</h1>
              <p className="text-muted-foreground">
                View and manage your past analyses
              </p>
            </div>
          </div>
          <Button asChild>
            <Link to="/report-analyzer">
              <FileSearch className="w-4 h-4 mr-2" />
              New Analysis
            </Link>
          </Button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && reports.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Reports Yet</h2>
              <p className="text-muted-foreground mb-6">
                You haven't analyzed any health reports yet.
              </p>
              <Button asChild>
                <Link to="/report-analyzer">Analyze Your First Report</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Reports List */}
        {!loading && reports.length > 0 && (
          <div className="space-y-4">
            {reports.map((report, index) => (
              <motion.div
                key={report._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={selectedReport?._id === report._id ? 'ring-2 ring-primary' : ''}>
                  <CardContent className="pt-6">
                    {/* Report Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-health-500/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-health-500" />
                        </div>
                        <div>
                          <h3 className="font-medium truncate max-w-[200px] sm:max-w-none">
                            {report.fileName}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(report.createdAt)}
                            </span>
                            <Badge variant="outline" className="capitalize">
                              {report.reportType?.replace(/_/g, ' ') || 'General'}
                            </Badge>
                            {getStatusBadge(report.status)}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetails(report)}
                          disabled={detailLoading}
                        >
                          {detailLoading && selectedReport?._id === report._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        {report.status === 'failed' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleReanalyze(report._id)}
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(report._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {selectedReport?._id === report._id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 pt-6 border-t"
                      >
                        {selectedReport.status === 'completed' ? (
                          <AnalysisResult 
                            analysis={selectedReport.aiResponse}
                            reportType={selectedReport.reportType}
                          />
                        ) : selectedReport.status === 'failed' ? (
                          <div className="text-center py-8">
                            <AlertCircle className="w-12 h-12 mx-auto text-destructive mb-4" />
                            <h3 className="font-medium mb-2">Analysis Failed</h3>
                            <p className="text-muted-foreground mb-4">
                              {selectedReport.errorMessage || 'An error occurred during analysis.'}
                            </p>
                            <Button onClick={() => handleReanalyze(report._id)}>
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Try Again
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                            <p className="text-muted-foreground mt-2">Processing...</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 pt-6">
                <Button
                  variant="outline"
                  disabled={pagination.page <= 1}
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

