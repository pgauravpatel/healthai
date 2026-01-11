import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, File, X, FileText, Image, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const ALLOWED_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp'
]

const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export default function FileUpload({ onFileSelect, disabled = false }) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Invalid file type. Please upload a PDF or image (PNG, JPG, JPEG, WEBP).'
    }
    if (file.size > MAX_SIZE) {
      return 'File too large. Maximum size is 10MB.'
    }
    return null
  }

  const handleFile = (file) => {
    setError(null)
    
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setSelectedFile(file)
    onFileSelect(file)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (disabled) return
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setError(null)
    onFileSelect(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getFileIcon = (type) => {
    if (type === 'application/pdf') return FileText
    return Image
  }

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          'relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200',
          dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50',
          disabled && 'opacity-50 cursor-not-allowed',
          selectedFile && 'border-green-500 bg-green-500/5'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.webp"
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {selectedFile ? (
            <motion.div
              key="file"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center justify-center gap-4"
            >
              {(() => {
                const FileIcon = getFileIcon(selectedFile.type)
                return <FileIcon className="w-12 h-12 text-green-500" />
              })()}
              <div className="text-left">
                <p className="font-medium text-foreground truncate max-w-[200px]">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile()
                }}
                className="p-2 hover:bg-destructive/10 rounded-full text-destructive transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className={cn(
                'w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-colors',
                dragActive ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
              )}>
                <Upload className="w-8 h-8" />
              </div>
              <p className="text-lg font-medium mb-1">
                {dragActive ? 'Drop your file here' : 'Upload your lab report'}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports PDF, PNG, JPG, JPEG, WEBP (max 10MB)
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 flex items-center gap-2 text-destructive text-sm"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

