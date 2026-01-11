import { useState } from 'react'
import { User, ChevronDown, ChevronUp } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { motion, AnimatePresence } from 'framer-motion'

export default function UserProfileForm({ profile, onChange }) {
  const [expanded, setExpanded] = useState(false)

  const handleChange = (field, value) => {
    onChange({ ...profile, [field]: value })
  }

  return (
    <div className="border rounded-xl overflow-hidden">
      {/* Header - Collapsible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm font-medium">
          <User className="w-4 h-4" />
          Optional: Add Your Profile for Better Analysis
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {/* Form Fields */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 space-y-4 border-t">
              <p className="text-xs text-muted-foreground">
                Providing this information helps us give more relevant suggestions.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Age */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Age</label>
                  <Input
                    type="number"
                    value={profile.age || ''}
                    onChange={(e) => handleChange('age', e.target.value)}
                    placeholder="e.g., 35"
                    min="1"
                    max="120"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Gender</label>
                  <select
                    value={profile.gender || ''}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Existing Conditions */}
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Known Health Conditions (optional)
                </label>
                <Input
                  type="text"
                  value={profile.conditions || ''}
                  onChange={(e) => handleChange('conditions', e.target.value)}
                  placeholder="e.g., Diabetes, Hypertension (comma separated)"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separate multiple conditions with commas
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

