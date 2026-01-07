import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Save, Camera } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { UserAvatar } from '@/components/ui/Avatar'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { authAPI } from '@/services/api'

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const toast = useToast()

  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    avatar: ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        bio: user.bio || '',
        avatar: user.avatar || ''
      })
    }
  }, [user])

  const handleProfileChange = (e) => {
    setProfileData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handlePasswordChange = (e) => {
    setPasswordData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    setErrors({})

    try {
      await updateProfile(profileData)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setSavingProfile(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' })
      return
    }

    if (passwordData.newPassword.length < 6) {
      setErrors({ newPassword: 'Password must be at least 6 characters' })
      return
    }

    setSavingPassword(true)
    setErrors({})

    try {
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      toast.success('Password changed successfully!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      toast.error(error.message || 'Failed to change password')
      setErrors({ currentPassword: error.message })
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

        {/* Profile Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <UserAvatar user={user} size="xl" />
                <div>
                  <p className="font-medium mb-1">Profile Picture</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Enter a URL for your profile picture
                  </p>
                  <Input
                    type="url"
                    name="avatar"
                    value={profileData.avatar}
                    onChange={handleProfileChange}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <Input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  icon={User}
                />
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={user?.email || ''}
                  icon={Mail}
                  disabled
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Email cannot be changed
                </p>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleProfileChange}
                  placeholder="Tell us about yourself..."
                  className="w-full p-3 rounded-xl border bg-background resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary"
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {profileData.bio.length}/500 characters
                </p>
              </div>

              <Button type="submit" loading={savingProfile}>
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Current Password</label>
                <Input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  icon={Lock}
                  error={errors.currentPassword}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <Input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  icon={Lock}
                  error={errors.newPassword}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  icon={Lock}
                  error={errors.confirmPassword}
                />
              </div>

              <Button type="submit" loading={savingPassword}>
                <Lock className="w-4 h-4" />
                Change Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

