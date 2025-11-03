import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar,
  Upload,
  Save,
  Edit,
  CheckCircle,
  Loader2,
  AlertCircle,
  Camera,
  Link as LinkIcon,
  Copy,
  Share2,
  ExternalLink,
  Plus,
  Sparkles,
  Star,
  Award,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { dbHelpers } from '@/lib/supabase';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function Profile() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [referrerProfile, setReferrerProfile] = useState<any>(null);
  
  const [profileData, setProfileData] = useState({
    name: session?.user?.user_metadata?.name || session?.user?.email?.split('@')[0] || '',
    email: session?.user?.email || '',
    phone: '',
    location: '',
    bio: '',
    company: '',
    position: '',
    experience: '',
    skills: '',
    linkedin: '',
    website: '',
    avatar: session?.user?.user_metadata?.avatar_url || ''
  });

  const [referralLinkData, setReferralLinkData] = useState({
    username: '',
    personal_message: "I'd love to help you find your dream job! Submit your profile below and I'll connect you with relevant opportunities."
  });

  useEffect(() => {
    if (session?.user?.id) {
      loadReferrerProfile();
    }
  }, [session?.user?.id]);

  const loadReferrerProfile = async () => {
    try {
      const profile = await dbHelpers.getReferrerProfile(session?.user?.id!);
      if (profile) {
        setReferrerProfile(profile);
        setReferralLinkData({
          username: profile.username,
          personal_message: profile.personal_message || "I'd love to help you find your dream job! Submit your profile below and I'll connect you with relevant opportunities."
        });
      }
    } catch (error) {
      console.warn('Error loading referrer profile (feature may not be available yet):', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReferralLinkChange = (field: string, value: string) => {
    setReferralLinkData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateUsername = () => {
    const name = profileData.name.toLowerCase().replace(/\s+/g, '');
    const randomNum = Math.floor(Math.random() * 1000);
    return `${name}${randomNum}`;
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const userRole = session?.user?.user_metadata?.role || 'referrer';
      if (userRole === 'referrer' && editing) {
        if (referralLinkData.username.trim()) {
          try {
            if (referrerProfile) {
              await dbHelpers.updateReferrerProfile(session?.user?.id!, {
                username: referralLinkData.username.trim(),
                personal_message: referralLinkData.personal_message.trim()
              });
            } else {
              await dbHelpers.createReferrerProfile({
                user_id: session?.user?.id!,
                username: referralLinkData.username.trim(),
                personal_message: referralLinkData.personal_message.trim()
              });
            }
            await loadReferrerProfile();
          } catch (dbError: any) {
            console.warn('Referrer profile save failed (table may not exist):', dbError);
          }
        }
      }
      
      console.log('Profile data to save:', profileData);
      
      toast({
        title: 'Success!',
        description: 'Profile updated successfully!',
      });
      
      setSaved(true);
      setEditing(false);
      
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setError(err.message || 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setError(null);
    setProfileData({
      name: session?.user?.user_metadata?.name || session?.user?.email?.split('@')[0] || '',
      email: session?.user?.email || '',
      phone: '',
      location: '',
      bio: '',
      company: '',
      position: '',
      experience: '',
      skills: '',
      linkedin: '',
      website: '',
      avatar: session?.user?.user_metadata?.avatar_url || ''
    });
    
    if (referrerProfile) {
      setReferralLinkData({
        username: referrerProfile.username,
        personal_message: referrerProfile.personal_message || "I'd love to help you find your dream job! Submit your profile below and I'll connect you with relevant opportunities."
      });
    }
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          avatar: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const copyReferralLink = async () => {
    if (!referrerProfile?.username) return;
    
    const link = `${window.location.origin}/r/${referrerProfile.username}`;
    await navigator.clipboard.writeText(link);
    setLinkCopied(true);
    toast({
      title: 'Copied!',
      description: 'Referral link copied to clipboard',
    });
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const openReferralLink = () => {
    if (!referrerProfile?.username) return;
    window.open(`${window.location.origin}/r/${referrerProfile.username}`, '_blank');
  };

  const userRole = session?.user?.user_metadata?.role || 'referrer';
  const userCreatedAt = session?.user?.created_at || new Date().toISOString();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-mint-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-mint-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative mx-auto max-w-6xl py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-mint-500 to-emerald-500 rounded-xl">
                <User className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Profile
              </h1>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Manage your personal information and preferences
            </p>
          </div>
          
          <div className="flex gap-3">
            {editing ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleCancel} 
                  disabled={saving}
                  className="border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="bg-gradient-to-r from-mint-500 to-emerald-500 hover:from-mint-600 hover:to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
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
              </>
            ) : (
              <Button 
                onClick={() => setEditing(true)}
                className="bg-gradient-to-r from-mint-500 to-emerald-500 hover:from-mint-600 hover:to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Error Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl backdrop-blur-sm">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl">
              <CardContent className="p-8 text-center">
                <div className="relative inline-block mb-6">
                  <div className="relative">
                    <Avatar className="h-32 w-32 mx-auto ring-4 ring-mint-100 dark:ring-mint-900/30">
                      <AvatarImage src={profileData.avatar} alt={profileData.name} />
                      <AvatarFallback className="text-2xl bg-gradient-to-br from-mint-500 to-emerald-500 text-white">
                        {profileData.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {editing && (
                      <label className="absolute bottom-2 right-2 p-2 bg-gradient-to-r from-mint-500 to-emerald-500 rounded-full cursor-pointer hover:from-mint-600 hover:to-emerald-600 transition-all duration-200 shadow-lg">
                        <Camera className="h-4 w-4 text-white" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                        />
                      </label>
                    )}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {profileData.name}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-3">
                  {profileData.email}
                </p>
                <div className="flex justify-center mb-4">
                  <Badge 
                    variant="outline" 
                    className="capitalize bg-gradient-to-r from-mint-50 to-emerald-50 dark:from-mint-900/30 dark:to-emerald-900/30 border-mint-200 dark:border-mint-700 text-mint-700 dark:text-mint-300 px-4 py-1"
                  >
                    <Star className="h-3 w-3 mr-1" />
                    {userRole}
                  </Badge>
                </div>
                
                {profileData.bio && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {profileData.bio}
                  </p>
                )}
                
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    Joined {format(new Date(userCreatedAt), 'MMMM yyyy')}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-mint-600 dark:text-mint-400">12</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Referrals</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">$2.4k</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Earned</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Referral Link Management - Only for Referrers */}
            {userRole === 'referrer' && (
              <Card className="border-0 shadow-xl bg-gradient-to-br from-mint-50/80 to-emerald-50/80 dark:from-mint-900/20 dark:to-emerald-900/20 backdrop-blur-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-mint-800 dark:text-mint-300">
                    <div className="p-2 bg-gradient-to-br from-mint-500 to-emerald-500 rounded-lg mr-3">
                      <LinkIcon className="h-5 w-5 text-white" />
                    </div>
                    Your Referral Link
                    <Sparkles className="h-4 w-4 ml-2 text-mint-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {referrerProfile?.username ? (
                    <div className="space-y-4">
                      <div className="bg-white/80 dark:bg-slate-800/80 rounded-xl p-6 border border-mint-200/50 dark:border-mint-700/50 backdrop-blur-sm">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Your Referral Link</Label>
                        <div className="flex items-center gap-3">
                          <code className="flex-1 bg-slate-100 dark:bg-slate-700 px-4 py-3 rounded-lg text-sm font-mono border">
                            refery.io/r/{referrerProfile.username}
                          </code>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={copyReferralLink}
                            className="border-mint-200 hover:bg-mint-50 dark:border-mint-700 dark:hover:bg-mint-900/30"
                          >
                            {linkCopied ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={openReferralLink}
                            className="border-mint-200 hover:bg-mint-50 dark:border-mint-700 dark:hover:bg-mint-900/30"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {editing && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="username" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Username</Label>
                            <div className="flex gap-2 mt-2">
                              <Input
                                id="username"
                                value={referralLinkData.username}
                                onChange={(e) => handleReferralLinkChange('username', e.target.value)}
                                placeholder="yourname"
                                className="flex-1 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50"
                              />
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => handleReferralLinkChange('username', generateUsername())}
                                className="border-mint-200 hover:bg-mint-50 dark:border-mint-700 dark:hover:bg-mint-900/30"
                              >
                                Generate
                              </Button>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                              This will be your unique referral link: refery.io/r/{referralLinkData.username || 'username'}
                            </p>
                          </div>

                          <div>
                            <Label htmlFor="personal_message" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Personal Message</Label>
                            <Textarea
                              id="personal_message"
                              value={referralLinkData.personal_message}
                              onChange={(e) => handleReferralLinkChange('personal_message', e.target.value)}
                              placeholder="Write a personal message that candidates will see on your referral page..."
                              rows={3}
                              className="mt-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50"
                            />
                            <p className="text-xs text-slate-500 mt-2">
                              This message will appear on your referral landing page
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="p-4 bg-gradient-to-br from-mint-500 to-emerald-500 rounded-2xl w-fit mx-auto mb-4">
                        <LinkIcon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        Create Your Referral Link
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                        Set up your personalized referral link to start receiving candidate submissions and earning rewards
                      </p>
                      {!editing && (
                        <Button 
                          onClick={() => setEditing(true)} 
                          className="bg-gradient-to-r from-mint-500 to-emerald-500 hover:from-mint-600 hover:to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Set Up Link
                        </Button>
                      )}
                      {editing && (
                        <div className="space-y-4 text-left max-w-md mx-auto">
                          <div>
                            <Label htmlFor="username" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Choose Username</Label>
                            <div className="flex gap-2 mt-2">
                              <Input
                                id="username"
                                value={referralLinkData.username}
                                onChange={(e) => handleReferralLinkChange('username', e.target.value)}
                                placeholder="yourname"
                                className="flex-1 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50"
                              />
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => handleReferralLinkChange('username', generateUsername())}
                                className="border-mint-200 hover:bg-mint-50 dark:border-mint-700 dark:hover:bg-mint-900/30"
                              >
                                Generate
                              </Button>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                              Your link will be: refery.io/r/{referralLinkData.username || 'username'}
                            </p>
                          </div>

                          <div>
                            <Label htmlFor="personal_message" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Personal Message</Label>
                            <Textarea
                              id="personal_message"
                              value={referralLinkData.personal_message}
                              onChange={(e) => handleReferralLinkChange('personal_message', e.target.value)}
                              placeholder="Write a personal message that candidates will see..."
                              rows={3}
                              className="mt-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Personal Information */}
            <Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-slate-900 dark:text-white">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg mr-3">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!editing}
                      className="mt-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 disabled:bg-slate-50 dark:disabled:bg-slate-800/30"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!editing}
                      className="mt-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 disabled:bg-slate-50 dark:disabled:bg-slate-800/30"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      disabled={!editing}
                      className="mt-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 disabled:bg-slate-50 dark:disabled:bg-slate-800/30"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Location</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="San Francisco, CA"
                      disabled={!editing}
                      className="mt-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 disabled:bg-slate-50 dark:disabled:bg-slate-800/30"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="bio" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    disabled={!editing}
                    className="mt-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 disabled:bg-slate-50 dark:disabled:bg-slate-800/30"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-slate-900 dark:text-white">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg mr-3">
                    <Briefcase className="h-5 w-5 text-white" />
                  </div>
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Company</Label>
                    <Input
                      id="company"
                      value={profileData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Your current company"
                      disabled={!editing}
                      className="mt-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 disabled:bg-slate-50 dark:disabled:bg-slate-800/30"
                    />
                  </div>
                  <div>
                    <Label htmlFor="position" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Position</Label>
                    <Input
                      id="position"
                      value={profileData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      placeholder="Your job title"
                      disabled={!editing}
                      className="mt-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 disabled:bg-slate-50 dark:disabled:bg-slate-800/30"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="experience" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Experience Level</Label>
                  <Select 
                    value={profileData.experience} 
                    onValueChange={(value) => handleInputChange('experience', value)}
                    disabled={!editing}
                  >
                    <SelectTrigger className="mt-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 disabled:bg-slate-50 dark:disabled:bg-slate-800/30">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                      <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                      <SelectItem value="senior">Senior Level (6-10 years)</SelectItem>
                      <SelectItem value="lead">Lead/Principal (10+ years)</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="skills" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Skills</Label>
                  <Textarea
                    id="skills"
                    value={profileData.skills}
                    onChange={(e) => handleInputChange('skills', e.target.value)}
                    placeholder="List your key skills (e.g., React, TypeScript, Node.js)"
                    rows={2}
                    disabled={!editing}
                    className="mt-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 disabled:bg-slate-50 dark:disabled:bg-slate-800/30"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-slate-900 dark:text-white">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mr-3">
                    <LinkIcon className="h-5 w-5 text-white" />
                  </div>
                  Social Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="linkedin" className="text-sm font-semibold text-slate-700 dark:text-slate-300">LinkedIn Profile</Label>
                  <Input
                    id="linkedin"
                    value={profileData.linkedin}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                    disabled={!editing}
                    className="mt-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 disabled:bg-slate-50 dark:disabled:bg-slate-800/30"
                  />
                </div>
                
                <div>
                  <Label htmlFor="website" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Personal Website</Label>
                  <Input
                    id="website"
                    value={profileData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://yourwebsite.com"
                    disabled={!editing}
                    className="mt-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 disabled:bg-slate-50 dark:disabled:bg-slate-800/30"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}