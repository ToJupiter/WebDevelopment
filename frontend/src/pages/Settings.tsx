import React, { useState } from 'react';
import { Card, Button, Input } from '../components/ui/Common';
import { Lock, User, Bell, Shield, Save } from 'lucide-react';
import api from '../services/api';

const Settings = () => {
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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

  return (
    <div className="space-y-6">
       <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500 mt-1">Manage your account preferences and security.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar Navigation */}
          <div className="space-y-2">
             <button className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-lg text-brand-600 font-medium shadow-sm">
                <Shield size={20} />
                Security
             </button>
             <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                <User size={20} />
                Profile
             </button>
             <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                <Bell size={20} />
                Notifications
             </button>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-6">
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
          </div>
       </div>
    </div>
  );
};

export default Settings;
