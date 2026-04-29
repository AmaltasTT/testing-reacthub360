"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateOrganization } from '@/hooks/use-update-organization';

interface BusinessAddressCardProps {
  initialData: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export function BusinessAddressCard({ initialData }: BusinessAddressCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const updateOrganization = useUpdateOrganization();
  const {
    error: updateError,
    isError: isUpdateError,
    isSuccess: isUpdateSuccess,
    mutate: updateAddress,
    reset: resetUpdateOrganization,
  } = updateOrganization;

  // Update formData when initialData changes (after save or data refresh)
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // Handle mutation success - show toast only once
  useEffect(() => {
    if (isSaving && isUpdateSuccess) {
      setIsEditing(false);
      setIsSaving(false);
      toast.success('Business address updated successfully');
      resetUpdateOrganization(); // Reset mutation state
    }
  }, [isSaving, isUpdateSuccess, resetUpdateOrganization]);

  // Handle mutation error
  useEffect(() => {
    if (isSaving && isUpdateError) {
      setIsSaving(false);
      toast.error('Failed to update business address. Please try again.');
      console.error('Error updating address:', updateError);
    }
  }, [isSaving, isUpdateError, updateError]);

  const handleSave = () => {
    setIsSaving(true);
    updateAddress({
      street_address: formData.address,
      city: formData.city,
      state: formData.state,
      zip_code: formData.zipCode,
      country: formData.country,
    });
  };

  const handleCancel = () => {
    setFormData(initialData);
    setIsEditing(false);
  };

  return (
    <div
      className={`
      rounded-2xl overflow-hidden shadow-lg shadow-violet-100/50
      transition-all duration-300
      ${isEditing ? 'bg-violet-50/30' : 'bg-gradient-to-br from-white/90 via-violet-50/20 to-white/90'}
      backdrop-blur-sm
    `}
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-violet-100/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-100 to-purple-100/60 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-violet-600" />
          </div>
          <h3 className="text-slate-900 font-semibold">Business Address</h3>
        </div>

        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            size="sm"
            className="border-violet-200 text-violet-600 hover:bg-violet-50 hover:text-violet-700"
          >
            Edit
          </Button>
        )}
      </div>

      {/* Content Area */}
      <div className="p-6">
        {isEditing ? (
          // Edit Mode - Form Inputs
          <div className="space-y-6">
            {/* Street Address - Full Width */}
            <div>
              <Label htmlFor="address" className="text-slate-700 mb-2 block">
                Street Address
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="bg-white border-violet-200 focus:border-violet-500 focus:ring-violet-500"
              />
            </div>

            {/* City and State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="city" className="text-slate-700 mb-2 block">
                  City
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="bg-white border-violet-200 focus:border-violet-500 focus:ring-violet-500"
                />
              </div>

              <div>
                <Label htmlFor="state" className="text-slate-700 mb-2 block">
                  State
                </Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="bg-white border-violet-200 focus:border-violet-500 focus:ring-violet-500"
                />
              </div>
            </div>

            {/* ZIP Code and Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="zipCode" className="text-slate-700 mb-2 block">
                  ZIP Code
                </Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  className="bg-white border-violet-200 focus:border-violet-500 focus:ring-violet-500"
                />
              </div>

              <div>
                <Label htmlFor="country" className="text-slate-700 mb-2 block">
                  Country
                </Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="bg-white border-violet-200 focus:border-violet-500 focus:ring-violet-500"
                />
              </div>
            </div>

            {/* Action Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-violet-100">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="border-slate-300 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving || updateOrganization.isPending}
                className="bg-gradient-to-r from-violet-500 to-purple-400 hover:from-violet-600 hover:to-purple-500"
              >
                {isSaving || updateOrganization.isPending ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </div>
        ) : (
          // View Mode - Content Blocks
          <div className="space-y-4">
            {/* Street Address - Full Width */}
            <div>
              <div className="text-xs text-slate-500 mb-1">Street Address</div>
              <div className="text-slate-900">{formData.address || 'Not set'}</div>
            </div>

            {/* City and State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-500 mb-1">City</div>
                <div className="text-slate-900">{formData.city || 'Not set'}</div>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-1">State</div>
                <div className="text-slate-900">{formData.state || 'Not set'}</div>
              </div>
            </div>

            {/* ZIP Code and Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-500 mb-1">ZIP Code</div>
                <div className="text-slate-900">{formData.zipCode || 'Not set'}</div>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-1">Country</div>
                <div className="text-slate-900">{formData.country || 'Not set'}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
