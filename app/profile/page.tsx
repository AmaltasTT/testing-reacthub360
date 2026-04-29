"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useSearchParams } from 'next/navigation';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { TabNavigation } from '@/components/profile/TabNavigation';
import { AccountTab } from '@/components/profile/AccountTab';
import { OrganizationTab } from '@/components/profile/OrganizationTab';
import { TeamTab } from '@/components/profile/TeamTab';
import { BillingTab } from '@/components/profile/BillingTab';
import { NotificationsTab } from '@/components/profile/NotificationsTab';
import { useUser } from '@/hooks/use-user';

const allTabs = [
  { id: 'account', label: 'Account', requiresAdmin: false },
  { id: 'organization', label: 'Organization', requiresAdmin: false },
  { id: 'team', label: 'Team', requiresAdmin: true },
  { id: 'billing', label: 'Billing', requiresAdmin: true },
  { id: 'notifications', label: 'Notifications', requiresAdmin: false }
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('account');
  const hasAppliedRequestedTab = useRef(false);
  const searchParams = useSearchParams();
  const { data: user, isLoading: isUserLoading } = useUser();

  // Filter tabs based on user role
  const isAdmin = user?.role === 'Admin';
  const tabs = allTabs.filter(tab => !tab.requiresAdmin || isAdmin);

  const requestedTab = useMemo(() => {
    return searchParams?.get('tab');
  }, [searchParams]);

  useEffect(() => {
    if (hasAppliedRequestedTab.current || !requestedTab) return;

    const requestedTabEntry = allTabs.find(tab => tab.id === requestedTab);
    if (!requestedTabEntry) {
      hasAppliedRequestedTab.current = true;
      return;
    }

    if (requestedTabEntry.requiresAdmin) {
      if (isUserLoading || !user) {
        return;
      }
      if (!isAdmin) {
        setActiveTab('account');
        hasAppliedRequestedTab.current = true;
        return;
      }
    }

    setActiveTab(requestedTabEntry.id);
    hasAppliedRequestedTab.current = true;
  }, [requestedTab, isAdmin, isUserLoading, user]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return <AccountTab />;
      case 'organization':
        return <OrganizationTab />;
      case 'team':
        // Only render if user is admin
        return isAdmin ? <TeamTab /> : <AccountTab />;
      case 'billing':
        // Only render if user is admin
        return isAdmin ? <BillingTab /> : <AccountTab />;
      case 'notifications':
        return <NotificationsTab />;
      default:
        return <AccountTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-purple-100/20">
      {/* Subtle atmospheric gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-purple-300/5 pointer-events-none" />

      {/* Main Content */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <ProfileHeader
            userName={user ? `${user.first_name} ${user.last_name}` : 'Loading...'}
            userRole={user?.role || 'User'}
          />

          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
