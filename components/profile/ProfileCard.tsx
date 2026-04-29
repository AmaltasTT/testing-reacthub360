"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Upload } from "lucide-react";
import { toast } from "sonner";
import { useUpdateUser } from "@/hooks/use-update-user";

interface ProfileCardProps {
  initialData: {
    firstName: string;
    lastName: string;
    email: string;
    jobTitle: string;
    phone: string;
    avatarUrl?: string;
  };
}

export function ProfileCard({ initialData }: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    initialData.avatarUrl
  );
  const updateUserMutation = useUpdateUser();

  // Update formData when initialData changes (after user data loads or refreshes)
  useEffect(() => {
    setFormData(initialData);
    setAvatarPreview(initialData.avatarUrl);
  }, [initialData]);

  const getInitials = () => {
    return `${formData.firstName[0]}${formData.lastName[0]}`.toUpperCase();
  };

  const getFullName = () => {
    return `${formData.firstName} ${formData.lastName}`;
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB");
        return;
      }

      // Validate file type
      if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
        toast.error("Please upload a JPG, PNG, or GIF file");
        return;
      }

      // Create preview - convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      // Prepare data for API call
      const updateData: {
        first_name: string;
        last_name: string;
        email: string;
        phone_number?: string;
        avatar?: string;
      } = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
      };

      // Include phone number if provided
      if (formData.phone && formData.phone.trim() !== '') {
        updateData.phone_number = formData.phone.trim();
      }

      // Include avatar if it has changed (send base64 string)
      if (avatarPreview && avatarPreview !== initialData.avatarUrl) {
        updateData.avatar = avatarPreview;
      }

      // Call mutation to update user
      await updateUserMutation.mutateAsync(updateData);

      // Update local state with avatar if changed
      setFormData({ ...formData, avatarUrl: avatarPreview });
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setFormData(initialData);
    setAvatarPreview(initialData.avatarUrl);
    setIsEditing(false);
  };

  return (
    <div
      className={`
        transition-all duration-200 ease-out
        ${!isEditing ? "hover:shadow-lg hover:shadow-violet-300/20" : ""}
      `}
    >
      {/* Profile Header Strip */}
      <div className="bg-gradient-to-r from-violet-100/60 via-purple-100/40 to-transparent px-8 py-6 border-b border-violet-100/30">
        <div className="flex items-center justify-between gap-6 flex-wrap">
          {/* Left Side - Profile Info */}
          <div className="flex items-center gap-4">
            {/* Avatar - Identity only, non-interactive */}
            {avatarPreview || formData.avatarUrl ? (
              <img
                src={avatarPreview || formData.avatarUrl}
                alt={getFullName()}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-violet-200 shadow-md shadow-violet-300/40"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-400 to-purple-400 flex items-center justify-center text-white shadow-lg shadow-violet-300/40">
                <span className="text-xl">{getInitials()}</span>
              </div>
            )}

            {/* Identity */}
            <div>
              <h2 className="text-slate-900 mb-0.5 text-lg font-semibold">
                {getFullName()}
              </h2>
              <p className="text-sm text-slate-600 mb-0.5">
                {formData.jobTitle}
              </p>
              <p className="text-xs text-slate-500">{formData.email}</p>
            </div>
          </div>

          {/* Right Side - Edit Button */}
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className="text-white bg-gradient-to-r from-violet-500 to-purple-400 hover:from-violet-600 hover:to-purple-500 shadow-md shadow-violet-300/30"
            >
              Edit profile
            </Button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-8">
        {isEditing ? (
          // Edit Mode - Form Inputs
          <div className="space-y-6">
            {/* Profile Picture Edit Block - Only visible in Edit Mode */}
            <div className="p-6 rounded-xl bg-white/60 border border-violet-100/50">
              <div className="flex items-center gap-6">
                {/* Larger Avatar Preview */}
                <div className="relative group">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile preview"
                      className="w-20 h-20 rounded-full object-cover ring-2 ring-violet-200 shadow-md shadow-violet-300/40"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-400 to-purple-400 flex items-center justify-center text-white shadow-lg shadow-violet-400/40">
                      <span className="text-2xl">{getInitials()}</span>
                    </div>
                  )}

                  {/* Hover Overlay with Camera Icon */}
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Upload Controls */}
                <div className="flex-1">
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="border-violet-200 text-violet-600 hover:bg-violet-50 hover:text-violet-700"
                    onClick={() =>
                      document.getElementById("avatar-upload")?.click()
                    }
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Change photo
                  </Button>
                  <p className="text-xs text-slate-500 mt-2">
                    JPG, PNG or GIF. Max 2MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Two-column grid for desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <Label
                  htmlFor="firstName"
                  className="text-slate-700 mb-2 block"
                >
                  First name
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="bg-white border-violet-200 focus:border-violet-500 focus:ring-violet-500"
                />
              </div>

              {/* Last Name */}
              <div>
                <Label htmlFor="lastName" className="text-slate-700 mb-2 block">
                  Last name
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="bg-white border-violet-200 focus:border-violet-500 focus:ring-violet-500"
                />
              </div>
            </div>

            {/* Email - Full Width */}
            <div>
              <Label htmlFor="email" className="text-slate-700 mb-2 block">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="bg-white border-violet-200 focus:border-violet-500 focus:ring-violet-500"
              />
            </div>

            {/* Two-column grid continues */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Title */}
              <div>
                <Label htmlFor="jobTitle" className="text-slate-700 mb-2 block">
                  Job title
                </Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, jobTitle: e.target.value })
                  }
                  className="bg-white border-violet-200 focus:border-violet-500 focus:ring-violet-500"
                />
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone" className="text-slate-700 mb-2 block">
                  Phone number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="bg-white border-violet-200 focus:border-violet-500 focus:ring-violet-500"
                />
              </div>
            </div>

            {/* Action Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-violet-100">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={updateUserMutation.isPending}
                className="border-slate-300 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={updateUserMutation.isPending}
                className="bg-gradient-to-r from-violet-500 to-purple-400 hover:from-violet-600 hover:to-purple-500"
              >
                {updateUserMutation.isPending ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        ) : (
          // View Mode - Content Blocks
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name Block */}
            <div className="p-4 rounded-xl bg-white/60 border border-violet-100/50">
              <div className="text-xs text-slate-500 mb-1">First name</div>
              <div className="text-slate-900">{formData.firstName}</div>
            </div>

            {/* Last Name Block */}
            <div className="p-4 rounded-xl bg-white/60 border border-violet-100/50">
              <div className="text-xs text-slate-500 mb-1">Last name</div>
              <div className="text-slate-900">{formData.lastName}</div>
            </div>

            {/* Email Block - Full Width */}
            <div className="md:col-span-2 p-4 rounded-xl bg-white/60 border border-violet-100/50">
              <div className="text-xs text-slate-500 mb-1">Email address</div>
              <div className="text-slate-900">{formData.email}</div>
            </div>

            {/* Job Title Block */}
            <div className="p-4 rounded-xl bg-white/60 border border-violet-100/50">
              <div className="text-xs text-slate-500 mb-1">Job title</div>
              <div className="text-slate-900">{formData.jobTitle}</div>
            </div>

            {/* Phone Block */}
            <div className="p-4 rounded-xl bg-white/60 border border-violet-100/50">
              <div className="text-xs text-slate-500 mb-1">Phone number</div>
              <div className="text-slate-900">{formData.phone}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
