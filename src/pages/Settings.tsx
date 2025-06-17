import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  CreditCard, 
  Moon, 
  Sun, 
  Globe,
  Mail,
  Smartphone,
  Eye,
  Lock,
  Trash2,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Users,
  Briefcase,
  UserCheck,
  Crown,
  Sparkles
} from 'lucide-react';
import { useAuth } from 'altan-auth';
import { supabase } from '@/lib/supabase';

export default function Settings() {
  const { session, service } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roleChanging, setRoleChanging] = useState(false);
  
  const currentRole = session?.user?.user_metadata?.role || 'referrer';
  
  const [settings, setSettings] = useState({
    // Role
    role: currentRole,
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    referralUpdates: true,
    payoutAlerts: true,
    jobMatches: false,
    weeklyDigest: true,
    
    // Privacy
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    
    // Account
    twoFactorAuth: false,
    sessionTimeout: '30',
    language: 'en',
    timezone: 'UTC-8',
    theme: 'system',
    
    // Payment
    defaultPaymentMethod: 'bank',
    autoWithdraw: false,
    withdrawalThreshold: '1000'
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleRoleChange = async (newRole: string) => {
    try {
      setRoleChanging(true);
      setError(null);
      
      // Use the imported supabase client directly
      const { data, error: updateError } = await supabase.auth.updateUser({
        data: {
          role: newRole
        }
      });
      
      if (updateError) {
        throw updateError;
      }
      
      if (data?.user) {
        handleSettingChange('role', newRole);
        setSaved(true);
        
        // Reset saved state after 3 seconds
        setTimeout(() => setSaved(false), 3000);
        
        // Refresh the page to update the UI with new role
        setTimeout(() => window.location.reload(), 1000);
      } else {
        throw new Error('Failed to update user role');
      }
      
    } catch (err: any) {
      console.error('Error updating role:', err);
      setError(`Failed to update role: ${err.message || 'Please try again.'}`);
    } finally {
      setRoleChanging(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Simulate API call for other settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaved(true);
      
      // Reset saved state after 3 seconds
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Handle account deletion
      console.log('Account deletion requested');
    }
  };

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'poster':
        return {
          icon: Briefcase,
          title: 'Job Poster',
          description: 'Post jobs and hire talent through referrals',
          color: 'from-indigo-500 to-purple-500',
          features: ['Post unlimited jobs', 'Access to referrer network', 'Candidate management', 'Analytics dashboard']
        };
      case 'referrer':
        return {
          icon: Users,
          title: 'Referrer',
          description: 'Refer candidates and earn rewards',
          color: 'from-emerald-500 to-teal-500',
          features: ['Earn up to $15,000 per referral', 'Access to premium jobs', 'Referral tracking', 'Instant payouts']
        };
      case 'candidate':
        return {
          icon: UserCheck,
          title: 'Candidate',
          description: 'Get referred to dream jobs',
          color: 'from-orange-500 to-red-500',
          features: ['Access to hidden jobs', 'Personal advocate support', '5x higher interview rates', 'Career acceleration']
        };
      default:
        return {
          icon: Users,
          title: 'Referrer',
          description: 'Refer candidates and earn rewards',
          color: 'from-emerald-500 to-teal-500',
          features: ['Earn up to $15,000 per referral', 'Access to premium jobs', 'Referral tracking', 'Instant payouts']
        };
    }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="mx-auto max-w-4xl py-8 px-4 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black mb-2">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Settings
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Manage your account preferences and privacy settings
            </p>
          </div>
          
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        {/* Success/Error Messages */}
        {saved && (
          <div className="mb-6 p-4 bg-green-50/80 dark:bg-green-900/20 backdrop-blur-xl border border-green-200 dark:border-green-800 rounded-2xl shadow-xl">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm text-green-700 dark:text-green-400">
                Settings saved successfully!
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50/80 dark:bg-red-900/20 backdrop-blur-xl border border-red-200 dark:border-red-800 rounded-2xl shadow-xl">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
            </div>
          </div>
        )}

        <Tabs defaultValue="role" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl p-2 shadow-xl border-0">
            <TabsTrigger value="role" className="rounded-xl">Role</TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-xl">Notifications</TabsTrigger>
            <TabsTrigger value="privacy" className="rounded-xl">Privacy</TabsTrigger>
            <TabsTrigger value="account" className="rounded-xl">Account</TabsTrigger>
            <TabsTrigger value="payment" className="rounded-xl">Payment</TabsTrigger>
          </TabsList>

          {/* Role Tab */}
          <TabsContent value="role" className="space-y-6">
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${getRoleInfo(currentRole).color} opacity-10`} />
                <CardTitle className="flex items-center relative">
                  <Crown className="h-6 w-6 mr-3 text-purple-600" />
                  Your Role
                  <Badge variant="outline" className="ml-3 bg-white/50 backdrop-blur-sm">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Current
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 relative">
                {/* Current Role Display */}
                <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-start space-x-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${getRoleInfo(currentRole).color} rounded-2xl flex items-center justify-center shadow-lg`}>
                      {React.createElement(getRoleInfo(currentRole).icon, { className: "h-8 w-8 text-white" })}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {getRoleInfo(currentRole).title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {getRoleInfo(currentRole).description}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {getRoleInfo(currentRole).features.map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Role Switching */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Switch Role
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    Change your role to access different features and capabilities. You can switch between roles at any time.
                  </p>
                  
                  <div className="grid gap-4">
                    {['poster', 'referrer', 'candidate'].map((role) => {
                      const roleInfo = getRoleInfo(role);
                      const isCurrentRole = role === currentRole;
                      
                      return (
                        <div 
                          key={role}
                          className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                            isCurrentRole 
                              ? 'border-purple-300 dark:border-purple-600 bg-purple-50/50 dark:bg-purple-900/20' 
                              : 'border-gray-200 dark:border-gray-700 bg-white/30 dark:bg-gray-800/30 hover:border-purple-200 dark:hover:border-purple-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`w-12 h-12 bg-gradient-to-br ${roleInfo.color} rounded-xl flex items-center justify-center shadow-md`}>
                                {React.createElement(roleInfo.icon, { className: "h-6 w-6 text-white" })}
                              </div>
                              <div>
                                <h5 className="font-semibold text-gray-900 dark:text-white">
                                  {roleInfo.title}
                                </h5>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  {roleInfo.description}
                                </p>
                              </div>
                            </div>
                            
                            {isCurrentRole ? (
                              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Active
                              </Badge>
                            ) : (
                              <Button
                                onClick={() => handleRoleChange(role)}
                                disabled={roleChanging}
                                variant="outline"
                                size="sm"
                                className="bg-white/50 hover:bg-white/80 backdrop-blur-sm"
                              >
                                {roleChanging ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  'Switch'
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 shadow-2xl rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive push notifications in your browser
                    </p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Referral Updates</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get notified when your referrals progress
                    </p>
                  </div>
                  <Switch
                    checked={settings.referralUpdates}
                    onCheckedChange={(checked) => handleSettingChange('referralUpdates', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Payout Alerts</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Notifications about payout processing
                    </p>
                  </div>
                  <Switch
                    checked={settings.payoutAlerts}
                    onCheckedChange={(checked) => handleSettingChange('payoutAlerts', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Job Matches</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get notified about relevant job opportunities
                    </p>
                  </div>
                  <Switch
                    checked={settings.jobMatches}
                    onCheckedChange={(checked) => handleSettingChange('jobMatches', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Weekly Digest</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Weekly summary of your activity
                    </p>
                  </div>
                  <Switch
                    checked={settings.weeklyDigest}
                    onCheckedChange={(checked) => handleSettingChange('weeklyDigest', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 shadow-2xl rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Privacy Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base">Profile Visibility</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Control who can see your profile
                  </p>
                  <Select 
                    value={settings.profileVisibility} 
                    onValueChange={(value) => handleSettingChange('profileVisibility', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Anyone can see</SelectItem>
                      <SelectItem value="network">Network - Only connections</SelectItem>
                      <SelectItem value="private">Private - Only you</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Show Email Address</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Display your email on your public profile
                    </p>
                  </div>
                  <Switch
                    checked={settings.showEmail}
                    onCheckedChange={(checked) => handleSettingChange('showEmail', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Show Phone Number</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Display your phone number on your profile
                    </p>
                  </div>
                  <Switch
                    checked={settings.showPhone}
                    onCheckedChange={(checked) => handleSettingChange('showPhone', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Allow Direct Messages</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Let other users send you messages
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowMessages}
                    onCheckedChange={(checked) => handleSettingChange('allowMessages', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 shadow-2xl rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="h-5 w-5 mr-2" />
                  Account Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                  />
                </div>
                
                <div>
                  <Label className="text-base">Session Timeout</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Automatically log out after inactivity
                  </p>
                  <Select 
                    value={settings.sessionTimeout} 
                    onValueChange={(value) => handleSettingChange('sessionTimeout', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="240">4 hours</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 shadow-2xl rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base">Language</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Choose your preferred language
                  </p>
                  <Select 
                    value={settings.language} 
                    onValueChange={(value) => handleSettingChange('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-base">Timezone</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Set your local timezone
                  </p>
                  <Select 
                    value={settings.timezone} 
                    onValueChange={(value) => handleSettingChange('timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="UTC+0">GMT (UTC+0)</SelectItem>
                      <SelectItem value="UTC+1">Central European Time (UTC+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-base">Theme</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Choose your preferred theme
                  </p>
                  <Select 
                    value={settings.theme} 
                    onValueChange={(value) => handleSettingChange('theme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 dark:border-red-800 bg-red-50/70 dark:bg-red-950/70 backdrop-blur-xl shadow-2xl rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center text-red-600 dark:text-red-400">
                  <Trash2 className="h-5 w-5 mr-2" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Delete Account</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button variant="destructive" onClick={handleDeleteAccount}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Tab */}
          <TabsContent value="payment" className="space-y-6">
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 shadow-2xl rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base">Default Payment Method</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Choose your preferred payout method
                  </p>
                  <Select 
                    value={settings.defaultPaymentMethod} 
                    onValueChange={(value) => handleSettingChange('defaultPaymentMethod', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Auto Withdrawal</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Automatically withdraw earnings when threshold is reached
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoWithdraw}
                    onCheckedChange={(checked) => handleSettingChange('autoWithdraw', checked)}
                  />
                </div>
                
                {settings.autoWithdraw && (
                  <div>
                    <Label htmlFor="withdrawalThreshold">Withdrawal Threshold ($)</Label>
                    <Input
                      id="withdrawalThreshold"
                      type="number"
                      value={settings.withdrawalThreshold}
                      onChange={(e) => handleSettingChange('withdrawalThreshold', e.target.value)}
                      placeholder="1000"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}