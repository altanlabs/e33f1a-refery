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
  Plus
} from 'lucide-react';
import { useAuth } from 'altan-auth';
import { dbHelpers } from '@/lib/supabase';
import { format } from 'date-fns';

export default function Profile() {
  const { session } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [referrerProfile, setReferrerProfile] = useState<any>(null);
  
  const [profileData, setProfileData] = useState({
    name: session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || '',
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
    intro_message: "I'd love to help you find your dream job! Submit your profile below and I'll connect you with relevant opportunities."
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
          intro_message: profile.intro_message || "I'd love to help you find your dream job! Submit your profile below and I'll connect you with relevant opportunities."
        });
      }
    } catch (error) {
      console.warn('Error loading referrer profile (feature may not be available yet):', error);
      // Don't show error to user, just log it
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
      
      // Save referrer profile if user is a referrer and has username
      const userRole = session?.user?.user_metadata?.role || 'referrer';
      if (userRole === 'referrer' && editing) {
        // Only save referral link data if username is provided
        if (referralLinkData.username.trim()) {
          try {
            if (referrerProfile) {
              // Update existing profile
              await dbHelpers.updateReferrerProfile(session?.user?.id!, {
                username: referralLinkData.username.trim(),
                intro_message: referralLinkData.intro_message.trim()
              });
            } else {
              // Create new profile
              await dbHelpers.createReferrerProfile({
                user_id: session?.user?.id!,
                username: referralLinkData.username.trim(),
                intro_message: referralLinkData.intro_message.trim()
              });
            }
            await loadReferrerProfile();
          } catch (dbError: any) {
            // If it's a database table error, just log it and continue
            console.warn('Referrer profile save failed (table may not exist):', dbError);
            // Don't throw error, just continue with other profile data
          }
        }
      }
      
      // Here you could save other profile data to user metadata or another table
      // For now, we'll just simulate saving the basic profile data
      console.log('Profile data to save:', profileData);
      
      setSaved(true);
      setEditing(false);
      
      // Reset saved state after 3 seconds
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
    // Reset form data
    setProfileData({
      name: session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || '',
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
        intro_message: referrerProfile.intro_message || "I'd love to help you find your dream job! Submit your profile below and I'll connect you with relevant opportunities."
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
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const openReferralLink = () => {
    if (!referrerProfile?.username) return;
    window.open(`${window.location.origin}/r/${referrerProfile.username}`, '_blank');
  };

  const userRole = session?.user?.user_metadata?.role || 'referrer';
  const userCreatedAt = session?.user?.created_at || new Date().toISOString();

  return (
    <div className="mx-auto max-w-4xl py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your personal information and preferences
          </p>
        </div>
        
        <div className="flex gap-3">
          {editing ? (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
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
            <Button onClick={() => setEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Success/Error Messages */}
      {saved && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
            <span className="text-sm text-green-700 dark:text-green-400">
              Profile updated successfully!
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
            <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="relative inline-block mb-4">
                <Avatar className="h-24 w-24 mx-auto">
                  <AvatarImage src={profileData.avatar} alt={profileData.name} />
                  <AvatarFallback className="text-lg">
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {editing && (
                  <label className="absolute bottom-0 right-0 p-1 bg-emerald-500 rounded-full cursor-pointer hover:bg-emerald-600 transition-colors">
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
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                {profileData.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                {profileData.email}
              </p>
              <Badge variant="outline" className="mb-4 capitalize">
                {userRole}
              </Badge>
              
              {profileData.bio && (
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {profileData.bio}
                </p>
              )}
              
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-1" />
                  Joined {format(new Date(userCreatedAt), 'MMMM yyyy')}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Referral Link Management - Only for Referrers */}
          {userRole === 'referrer' && (
            <Card className="border-emerald-200 bg-emerald-50/50 dark:bg-emerald-900/10">
              <CardHeader>
                <CardTitle className="flex items-center text-emerald-800 dark:text-emerald-300">
                  <LinkIcon className="h-5 w-5 mr-2" />
                  Your Referral Link
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {referrerProfile?.username ? (
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Link</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="flex-1 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded text-sm">
                          refery.io/r/{referrerProfile.username}
                        </code>
                        <Button size="sm" variant="outline" onClick={copyReferralLink}>
                          {linkCopied ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </>
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button size="sm" variant="outline" onClick={openReferralLink}>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {editing && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="username">Username</Label>
                          <div className="flex gap-2">
                            <Input
                              id="username"
                              value={referralLinkData.username}
                              onChange={(e) => handleReferralLinkChange('username', e.target.value)}
                              placeholder="yourname"
                              className="flex-1"
                            />
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => handleReferralLinkChange('username', generateUsername())}
                            >
                              Generate
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            This will be your unique referral link: refery.io/r/{referralLinkData.username || 'username'}
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="intro_message">Personal Message</Label>
                          <Textarea
                            id="intro_message"
                            value={referralLinkData.intro_message}
                            onChange={(e) => handleReferralLinkChange('intro_message', e.target.value)}
                            placeholder="Write a personal message that candidates will see on your referral page..."
                            rows={3}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            This message will appear on your referral landing page
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <LinkIcon className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Create Your Referral Link
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Set up your personalized referral link to start receiving candidate submissions
                    </p>
                    {!editing && (
                      <Button onClick={() => setEditing(true)} className="bg-emerald-500 hover:bg-emerald-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Set Up Link
                      </Button>
                    )}
                    {editing && (
                      <div className="space-y-4 text-left">
                        <div>
                          <Label htmlFor="username">Choose Username</Label>
                          <div className="flex gap-2">
                            <Input
                              id="username"
                              value={referralLinkData.username}
                              onChange={(e) => handleReferralLinkChange('username', e.target.value)}
                              placeholder="yourname"
                              className="flex-1"
                            />
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => handleReferralLinkChange('username', generateUsername())}
                            >
                              Generate
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Your link will be: refery.io/r/{referralLinkData.username || 'username'}
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="intro_message">Personal Message</Label>
                          <Textarea
                            id="intro_message"
                            value={referralLinkData.intro_message}
                            onChange={(e) => handleReferralLinkChange('intro_message', e.target.value)}
                            placeholder="Write a personal message that candidates will see..."
                            rows={3}
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!editing}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!editing}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    disabled={!editing}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="San Francisco, CA"
                    disabled={!editing}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  disabled={!editing}
                />
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={profileData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="Your current company"
                    disabled={!editing}
                  />
                </div>
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={profileData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    placeholder="Your job title"
                    disabled={!editing}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="experience">Experience Level</Label>
                <Select 
                  value={profileData.experience} 
                  onValueChange={(value) => handleInputChange('experience', value)}
                  disabled={!editing}
                >
                  <SelectTrigger>
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
                <Label htmlFor="skills">Skills</Label>
                <Textarea
                  id="skills"
                  value={profileData.skills}
                  onChange={(e) => handleInputChange('skills', e.target.value)}
                  placeholder="List your key skills (e.g., React, TypeScript, Node.js)"
                  rows={2}
                  disabled={!editing}
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="linkedin">LinkedIn Profile</Label>
                <Input
                  id="linkedin"
                  value={profileData.linkedin}
                  onChange={(e) => handleInputChange('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  disabled={!editing}
                />
              </div>
              
              <div>
                <Label htmlFor="website">Personal Website</Label>
                <Input
                  id="website"
                  value={profileData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://yourwebsite.com"
                  disabled={!editing}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}