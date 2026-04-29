"use client";

import React from 'react';
import { GlassCard } from './GlassCard';
import { OrganizationCard } from './OrganizationCard';
import { BusinessAddressCard } from './BusinessAddressCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@/hooks/use-user';

export function OrganizationTab() {
  const { data: user, isLoading, error } = useUser();

  if (isLoading) {
    return (
      <div className="px-8 pb-12">
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-600">Loading organization information...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-8 pb-12">
        <div className="flex items-center justify-center py-12">
          <div className="text-[#e11d48]">
            <div className="mb-2">Failed to load organization information</div>
            <div className="text-sm text-slate-500">
              {error instanceof Error ? error.message : 'Unknown error occurred'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user?._organizations) {
    console.error('Organization data missing from user:', user);
    return (
      <div className="px-8 pb-12">
        <div className="flex items-center justify-center py-12">
          <div className="text-[#e11d48]">
            <div className="mb-2">Organization data not available</div>
            <div className="text-sm text-slate-500">
              Please contact support if this issue persists
            </div>
          </div>
        </div>
      </div>
    );
  }

  const organization = user._organizations;

  const coreDetailsData = {
    companyName: organization.name || '',
    industry: organization.industry || '',
    companySize: organization.company_size || '',
    businessModel: organization.business_model || '',
    website: organization.website || '',
    taxId: '',
    logoUrl: organization.logo?.url || ''
  };

  const addressData = {
    address: organization.street_address || '',
    city: organization.city || '',
    state: organization.state || '',
    zipCode: organization.zip_code || '',
    country: organization.country || ''
  };

  return (
    <div className="px-8 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Core Details with Integrated Logo */}
          <OrganizationCard initialData={coreDetailsData} />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Address */}
          <BusinessAddressCard initialData={addressData} />

          {/* Fiscal Information */}
          <GlassCard className="p-6">
            <h3 className="text-slate-900 mb-6 font-semibold">Fiscal Information</h3>
            <div>
              <Label className="text-slate-700 mb-2 block">Fiscal Year End</Label>
              <div className="p-4 rounded-xl bg-white/60 border border-violet-100/50">
                <div className="text-slate-900">Not set</div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Used for reporting and analytics purposes
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
