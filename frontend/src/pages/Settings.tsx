import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Avatar } from '../components/ui/Common';
import { Lock, User, Shield, Save } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user, checkAuth } = useAuth();
  const [activeTab, setActiveTab] = useState<'security' | 'profile'>('profile');
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    avatar_url: '',
    current_level: 'beginner'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setProfileData({
        full_name: user.full_name || '',
        email: user.email || '',
        avatar_url: user.avatar_url || '',
        current_level: user.current_level || 'beginner'
      });
    }
  }, [user]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({ type: 'error', text: "New passwords don't match" });
      return;
    }

    if (passwordData.new_password.length < 8) {
      setMessage({ type: 'error', text: "Password must be at least 8 characters long" });
      return;
    }

    try {
      setLoading(true);
      await api.put('/users/me/password', {
        old_password: passwordData.old_password,
        new_password: passwordData.new_password
      });
      setMessage({ type: 'success', text: "Password updated successfully" });
      setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.error || "Failed to update password" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      setLoading(true);
      await api.put('/users/me', {
        full_name: profileData.full_name,
        avatar_url: profileData.avatar_url,
        current_level: profileData.current_level
      });
      setMessage({ type: 'success', text: "Profile updated successfully" });
      await checkAuth(); // Refresh user data
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.error || "Failed to update profile" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
       <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500 mt-1">Manage your account preferences and security.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar Navigation */}
          <div className="space-y-2">
             <button 
                onClick={() => { setActiveTab('profile'); setMessage(null); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'profile' 
                    ? 'bg-white border border-slate-200 text-brand-600 shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
             >
                <User size={20} />
                Profile
             </button>
             <button 
                onClick={() => { setActiveTab('security'); setMessage(null); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'security' 
                    ? 'bg-white border border-slate-200 text-brand-600 shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
             >
                <Shield size={20} />
                Security
             </button>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-6">
             {activeTab === 'profile' && (
                <Card title="Profile Information">
                   <form onSubmit={handleProfileUpdate} className="space-y-4">
                      {/* Avatar Preview */}
                      <div className="flex items-center gap-4 mb-6">
                         {profileData.avatar_url ? (
                            <Avatar src={profileData.avatar_url} alt={profileData.full_name} size="lg" />
                         ) : (
                            <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-2xl font-bold">
                               {profileData.full_name.charAt(0).toUpperCase()}
                            </div>
                         )}
                         <div>
                            <p className="text-sm font-medium text-slate-700">Profile Picture</p>
                            <p className="text-xs text-slate-500">JPG, PNG or GIF, max 2MB</p>
                         </div>
                      </div>

                      <Input 
                         label="Full Name" 
                         value={profileData.full_name}
                         onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                         required
                      />
                      
                      <Input 
                         label="Email" 
                         type="email"
                         value={profileData.email}
                         disabled
                         className="bg-slate-50"
                      />
                      <p className="text-xs text-slate-500 -mt-2">Email cannot be changed</p>

                      <Input 
                         label="Avatar URL" 
                         value={profileData.avatar_url}
                         onChange={(e) => setProfileData({...profileData, avatar_url: e.target.value})}
                         placeholder="https://..."
                      />

                      <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Current Level</label>
                         <select
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none"
                            value={profileData.current_level}
                            onChange={(e) => setProfileData({...profileData, current_level: e.target.value})}
                         >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                         </select>
                      </div>

                      {message && (
                         <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message.text}
                         </div>
                      )}

                      <div className="flex justify-end pt-2">
                         <Button type="submit" isLoading={loading} icon={<Save size={18} />}>
                            Save Changes
                         </Button>
                      </div>
                   </form>
                </Card>
             )}

             {activeTab === 'security' && (
                <Card title="Change Password">
                   <form onSubmit={handlePasswordChange} className="space-y-4">
                      <Input 
                         label="Current Password" 
                         type="password"
                         value={passwordData.old_password}
                         onChange={(e) => setPasswordData({...passwordData, old_password: e.target.value})}
                         required
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <Input 
                            label="New Password" 
                            type="password"
                            value={passwordData.new_password}
                            onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                            required
                         />
                         <Input 
                            label="Confirm New Password" 
                            type="password"
                            value={passwordData.confirm_password}
                            onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                            required
                         />
                      </div>

                      <div className="bg-slate-50 p-4 rounded-lg">
                         <p className="text-sm font-medium text-slate-700 mb-2">Password requirements:</p>
                         <ul className="text-xs text-slate-600 space-y-1">
                            <li>• At least 8 characters long</li>
                            <li>• Include uppercase and lowercase letters</li>
                            <li>• Include numbers</li>
                         </ul>
                      </div>

                      {message && (
                         <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message.text}
                         </div>
                      )}

                      <div className="flex justify-end pt-2">
                         <Button type="submit" isLoading={loading} icon={<Save size={18} />}>
                            Update Password
                         </Button>
                      </div>
                   </form>
                </Card>
             )}
          </div>
       </div>
    </div>
  );
};

export default Settings;
