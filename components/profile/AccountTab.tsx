"use client";

import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { ProfileCard } from './ProfileCard';
import { Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@/hooks/use-user';
import { useUpdateUser } from '@/hooks/use-update-user';
import { toast } from 'sonner';

const PASSWORD_NUMBER_OR_SYMBOL_PATTERN = /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

export function AccountTab() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { data: user, isLoading, error } = useUser();
  const updateUserMutation = useUpdateUser();

  const profileData = {
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    jobTitle: user?.role || '',
    phone: user?.phone_number || '',
    avatarUrl: user?.avatar_image?.url || ''
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!PASSWORD_NUMBER_OR_SYMBOL_PATTERN.test(password)) return false;
    return true;
  };

  const handlePasswordUpdate = async () => {
    // Validation
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!validatePassword(newPassword)) {
      toast.error('Password does not meet requirements');
      return;
    }

    try {
      await updateUserMutation.mutateAsync({ password: newPassword });
      toast.success('Password updated successfully');
      setShowPasswordModal(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Failed to update password:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update password');
    }
  };

  if (isLoading) {
    return (
      <div className="px-8 pb-12">
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-600">Loading account information...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-8 pb-12">
        <div className="flex items-center justify-center py-12">
          <div className="text-[#e11d48]">Failed to load account information</div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Personal Information */}
          <ProfileCard initialData={profileData} />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Password */}
          <GlassCard className="p-6">
            <h3 className="text-slate-900 mb-6 font-semibold">Password</h3>
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value="••••••••••••"
                  disabled
                  className="bg-white/50 pr-10"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="text-violet-600 hover:text-violet-700 transition-colors text-sm"
              >
                Change password
              </button>
            </div>
          </GlassCard>

          {/* Danger Zone */}
          <GlassCard className="p-6 bg-red-50/50 border-red-200/30">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-900 mb-2 font-semibold">Danger Zone</h3>
                <p className="text-sm text-red-700 mb-4">
                  Deleting your account is permanent and cannot be undone. All your data will be erased.
                </p>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 text-[#e11d48] text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Delete my account
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Change Password Modal */}
      <Dialog open={showPasswordModal} onOpenChange={(open) => {
        setShowPasswordModal(open);
        if (!open) {
          setNewPassword('');
          setConfirmPassword('');
        }
      }}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-slate-900 text-xl">Change Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            <div>
              <Label htmlFor="new-password" className="text-slate-700 font-medium">
                New Password
              </Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-2 bg-white border-violet-200 focus:border-violet-500 focus:ring-violet-500"
                placeholder="Enter new password"
              />
              <div className="mt-3 space-y-2 p-3 rounded-lg bg-slate-50/50 border border-slate-200/50">
                <div className="flex items-center gap-2 text-xs">
                  <div className={`w-1.5 h-1.5 rounded-full ${newPassword.length >= 8 ? 'bg-green-500' : 'bg-slate-400'}`} />
                  <span className={newPassword.length >= 8 ? 'text-green-600' : 'text-slate-600'}>At least 8 characters</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) ? 'bg-green-500' : 'bg-slate-400'}`} />
                  <span className={/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) ? 'text-green-600' : 'text-slate-600'}>Contains uppercase and lowercase</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className={`w-1.5 h-1.5 rounded-full ${PASSWORD_NUMBER_OR_SYMBOL_PATTERN.test(newPassword) ? 'bg-green-500' : 'bg-slate-400'}`} />
                  <span className={PASSWORD_NUMBER_OR_SYMBOL_PATTERN.test(newPassword) ? 'text-green-600' : 'text-slate-600'}>Contains a number or symbol</span>
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="confirm-password" className="text-slate-700 font-medium">
                Confirm New Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-2 bg-white border-violet-200 focus:border-violet-500 focus:ring-violet-500"
                placeholder="Confirm new password"
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-[#e11d48] mt-1">Passwords do not match</p>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-2 pt-4 border-t border-slate-200/50">
            <Button
              variant="outline"
              onClick={() => {
                setShowPasswordModal(false);
                setNewPassword('');
                setConfirmPassword('');
              }}
              disabled={updateUserMutation.isPending}
              className="border-slate-300 hover:bg-slate-50 text-slate-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePasswordUpdate}
              disabled={updateUserMutation.isPending}
              className="bg-gradient-to-r from-violet-500 to-purple-400 hover:from-violet-600 hover:to-purple-500 text-white shadow-md shadow-violet-300/30"
            >
              {updateUserMutation.isPending ? 'Updating...' : 'Update Password'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-red-900 text-xl flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Delete Account
            </DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <div className="p-4 rounded-lg bg-red-50/50 border border-red-200/50 mb-5">
              <p className="text-sm text-red-800 leading-relaxed">
                This action cannot be undone. This will permanently delete your account and remove all associated data from our servers.
              </p>
            </div>
            <div>
              <Label htmlFor="confirm-delete" className="text-slate-700 font-medium">
                Type <span className="font-mono font-bold text-[#e11d48]">DELETE</span> to confirm
              </Label>
              <Input
                id="confirm-delete"
                placeholder="DELETE"
                className="mt-2 bg-white border-red-200 focus:border-red-500 focus:ring-red-500 font-mono"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-2 pt-4 border-t border-slate-200/50">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              className="border-slate-300 hover:bg-slate-50 text-slate-700"
            >
              Cancel
            </Button>
            <Button
              onClick={() => setShowDeleteModal(false)}
              className="text-[#e11d48] hover:bg-red-700 text-white shadow-md shadow-red-300/30"
            >
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
