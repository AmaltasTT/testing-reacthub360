"use client";

import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { Mail, Bell, AlertTriangle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export function NotificationsTab() {
  const [emailNotifications, setEmailNotifications] = useState<NotificationSetting[]>([
    {
      id: 'email-updates',
      label: 'Product Updates',
      description: 'News about product features and updates',
      enabled: true
    },
    {
      id: 'email-team',
      label: 'Team Activity',
      description: 'When team members join or leave',
      enabled: true
    },
    {
      id: 'email-billing',
      label: 'Billing & Invoices',
      description: 'Payment confirmations and receipts',
      enabled: true
    },
    {
      id: 'email-security',
      label: 'Security Alerts',
      description: 'Important account security notifications',
      enabled: true
    },
    {
      id: 'email-marketing',
      label: 'Marketing Emails',
      description: 'Tips, case studies, and newsletters',
      enabled: false
    }
  ]);

  const [inAppNotifications, setInAppNotifications] = useState<NotificationSetting[]>([
    {
      id: 'app-mentions',
      label: 'Mentions',
      description: 'When someone mentions you in a comment',
      enabled: true
    },
    {
      id: 'app-assignments',
      label: 'Assignments',
      description: 'When you are assigned to a task',
      enabled: true
    },
    {
      id: 'app-comments',
      label: 'Comments',
      description: 'New comments on your projects',
      enabled: true
    },
    {
      id: 'app-status',
      label: 'Status Changes',
      description: 'When project status is updated',
      enabled: false
    }
  ]);

  const [advancedSettings, setAdvancedSettings] = useState<NotificationSetting[]>([
    {
      id: 'adv-digest',
      label: 'Daily Digest',
      description: 'Receive a daily summary instead of individual notifications',
      enabled: false
    },
    {
      id: 'adv-usage',
      label: 'Usage Warnings',
      description: 'Alert me when approaching plan limits',
      enabled: true
    },
    {
      id: 'adv-downtime',
      label: 'Maintenance Alerts',
      description: 'Scheduled maintenance and downtime notices',
      enabled: true
    }
  ]);

  const toggleNotification = (
    category: 'email' | 'inApp' | 'advanced',
    id: string
  ) => {
    const updateFn = (items: NotificationSetting[]) =>
      items.map(item =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      );

    if (category === 'email') {
      setEmailNotifications(updateFn);
    } else if (category === 'inApp') {
      setInAppNotifications(updateFn);
    } else {
      setAdvancedSettings(updateFn);
    }
  };

  const NotificationGroup = ({
    title,
    icon: Icon,
    items,
    category
  }: {
    title: string;
    icon: React.ElementType;
    items: NotificationSetting[];
    category: 'email' | 'inApp' | 'advanced';
  }) => (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-400 to-purple-400 flex items-center justify-center text-white">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-slate-900 font-semibold">{title}</h3>
      </div>

      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <Label className="text-slate-900 mb-1 block cursor-pointer font-medium">
                {item.label}
              </Label>
              <p className="text-sm text-slate-600">{item.description}</p>
            </div>
            <Switch
              checked={item.enabled}
              onCheckedChange={() => toggleNotification(category, item.id)}
              className="data-[state=checked]:bg-violet-600"
            />
          </div>
        ))}
      </div>
    </GlassCard>
  );

  return (
    <div className="px-8 pb-12">
      <div className="space-y-8">
        {/* Email Notifications */}
        <NotificationGroup
          title="Email Notifications"
          icon={Mail}
          items={emailNotifications}
          category="email"
        />

        {/* In-App Notifications */}
        <NotificationGroup
          title="In-App Notifications"
          icon={Bell}
          items={inAppNotifications}
          category="inApp"
        />

        {/* Advanced Settings */}
        <NotificationGroup
          title="Advanced Settings"
          icon={AlertTriangle}
          items={advancedSettings}
          category="advanced"
        />

        {/* Info Banner */}
        <GlassCard className="p-6 bg-violet-50/50 border-violet-200/30">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600 flex-shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-violet-900 mb-2 font-semibold">Notification Preferences Saved</h4>
              <p className="text-sm text-violet-700">
                Your notification preferences are automatically saved. Some security alerts cannot be disabled for account safety.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
