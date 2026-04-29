"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, ExternalLink, Upload, Globe } from "lucide-react";
import { toast } from "sonner";
import { useUpdateOrganization } from "@/hooks/use-update-organization";

const industries = [
  { value: "", label: "Select an industry" },
  { value: "technology", label: "Technology & Software" },
  { value: "finance", label: "Finance & Banking" },
  { value: "healthcare", label: "Healthcare & Medical" },
  { value: "retail", label: "Retail & E-commerce" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "education", label: "Education" },
  { value: "consulting", label: "Consulting & Professional Services" },
  { value: "media", label: "Media & Entertainment" },
  { value: "other", label: "Other" },
];

const companySizes = [
  { value: "", label: "Select company size" },
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "501-1000", label: "501-1,000 employees" },
  { value: "1000+", label: "1,000+ employees" },
];

const businessModels = [
  { value: "", label: "Select business model" },
  { value: "B2B", label: "B2B" },
  { value: "B2C", label: "B2C" },
  { value: "Both", label: "Both" },
];

interface OrganizationCardProps {
  initialData: {
    companyName: string;
    industry: string;
    companySize: string;
    businessModel: string;
    website: string;
    taxId: string;
    logoUrl?: string;
  };
}

export function OrganizationCard({ initialData }: OrganizationCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [logoPreview, setLogoPreview] = useState<string | undefined>(
    initialData.logoUrl
  );
  const updateOrganizationMutation = useUpdateOrganization();

  // Update formData when initialData changes (after organization data loads or refreshes)
  useEffect(() => {
    setFormData(initialData);
    setLogoPreview(initialData.logoUrl);
  }, [initialData]);

  const getCompanyInitials = () => {
    const words = formData.companyName.split(" ");
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return formData.companyName.substring(0, 2).toUpperCase();
  };

  const getIndustryLabel = (value: string) => {
    const industry = industries.find(ind => ind.value === value);
    return industry?.label || value || 'Not set';
  };

  const getCompanySizeLabel = (value: string) => {
    const size = companySizes.find(size => size.value === value);
    return size?.label || value || 'Not set';
  };

  const getBusinessModelLabel = (value: string) => {
    const model = businessModels.find(model => model.value === value);
    return model?.label || value || 'Not set';
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
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
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      // Prepare data for API call
      const updateData: {
        name: string;
        website: string;
        industry?: string;
        company_size?: string;
        business_model?: string;
        logo_image?: string;
      } = {
        name: formData.companyName,
        website: formData.website,
      };

      // Include optional fields if provided
      if (formData.industry) {
        updateData.industry = formData.industry;
      }
      if (formData.companySize) {
        updateData.company_size = formData.companySize;
      }
      if (formData.businessModel) {
        updateData.business_model = formData.businessModel;
      }

      // Include logo_image if it has changed (send base64 string)
      if (logoPreview && logoPreview !== initialData.logoUrl) {
        updateData.logo_image = logoPreview;
      }

      // Call mutation to update organization
      await updateOrganizationMutation.mutateAsync(updateData);

      // Update local state with logo if changed
      setFormData({ ...formData, logoUrl: logoPreview });
      setIsEditing(false);
      toast.success("Organization details updated successfully");
    } catch (error) {
      console.error("Failed to update organization:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update organization");
    }
  };

  const handleCancel = () => {
    setFormData(initialData);
    setLogoPreview(initialData.logoUrl);
    setIsEditing(false);
  };

  return (
    <div
      className={`
      rounded-2xl overflow-hidden shadow-lg shadow-violet-100/50
      transition-all duration-200 ease-out ${
        !isEditing ? "hover:shadow-lg hover:shadow-violet-300/20" : ""
      }
      ${
        isEditing
          ? "bg-violet-50/30"
          : "bg-gradient-to-br from-white/90 via-violet-50/20 to-white/90"
      }
      backdrop-blur-sm
    `}
    >
      {/* Organization Header Strip */}
      <div className="bg-gradient-to-r from-violet-100/60 via-purple-100/40 to-transparent px-8 py-6 border-b border-violet-100/30">
        <div className="flex items-center justify-between gap-6 flex-wrap">
          {/* Left Side - Company Identity */}
          <div className="flex items-center gap-4">
            {/* Company Logo - Always Visible */}
            {logoPreview || formData.logoUrl ? (
              <img
                src={logoPreview || formData.logoUrl}
                alt={formData.companyName}
                className="w-16 h-16 rounded-xl object-cover ring-2 ring-violet-200 shadow-md shadow-violet-300/40"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center text-white shadow-lg shadow-violet-300/40">
                <Building2 className="w-8 h-8" />
              </div>
            )}

            {/* Company Identity */}
            <div>
              <h2 className="text-slate-900 mb-1 text-lg font-semibold">
                {formData.companyName}
              </h2>
              <a
                href={
                  formData.website.startsWith("http")
                    ? formData.website
                    : `https://${formData.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-violet-600 hover:text-violet-700 inline-flex items-center gap-1 mb-0.5 transition-colors"
              >
                {formData.website}
                <ExternalLink className="w-3 h-3" />
              </a>
              <p className="text-xs text-slate-500">{getIndustryLabel(formData.industry)}</p>
            </div>
          </div>

          {/* Right Side - Edit Button (View Mode Only) */}
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className="text-white bg-gradient-to-r from-violet-500 to-purple-400 hover:from-violet-600 hover:to-purple-500 shadow-md shadow-violet-300/30"
            >
              Edit details
            </Button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-8">
        {isEditing ? (
          // Edit Mode - Form Inputs with Logo Controls
          <div className="space-y-8">
            {/* Logo Edit Section - Only Visible in Edit Mode */}
            <div className="p-6 rounded-xl bg-white/60 border border-violet-200">
              <h4 className="text-slate-900 mb-4 font-medium">Company logo</h4>
              <div className="flex items-center gap-6 flex-wrap">
                {/* Logo Preview */}
                <div className="relative group">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-24 h-24 rounded-xl object-cover ring-2 ring-violet-200 shadow-md shadow-violet-300/40"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center text-white shadow-lg shadow-violet-400/40">
                      <Building2 className="w-12 h-12" />
                    </div>
                  )}

                  {/* Hover Overlay with Upload Icon */}
                  <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Logo Actions */}
                <div className="space-y-3">
                  <input
                    type="file"
                    id="logo-upload"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="border-violet-200 text-violet-600 hover:bg-violet-50 hover:text-violet-700"
                    onClick={() =>
                      document.getElementById("logo-upload")?.click()
                    }
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Change logo
                  </Button>
                  <p className="text-xs text-slate-500">
                    JPG, PNG or GIF. Max 5MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Company Name - Full Width */}
            <div>
              <Label
                htmlFor="companyName"
                className="text-slate-700 mb-2 block"
              >
                Company name
              </Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                className="bg-white border-violet-200 focus:border-violet-500 focus:ring-violet-500"
              />
            </div>

            {/* Two-column grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Industry */}
              <div>
                <Label htmlFor="industry" className="text-slate-700 mb-2 block">
                  Industry
                </Label>
                <select
                  id="industry"
                  value={formData.industry}
                  onChange={(e) =>
                    setFormData({ ...formData, industry: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-violet-200 bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 focus:outline-none transition-all appearance-none cursor-pointer"
                >
                  {industries.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Company Size */}
              <div>
                <Label
                  htmlFor="companySize"
                  className="text-slate-700 mb-2 block"
                >
                  Company size
                </Label>
                <select
                  id="companySize"
                  value={formData.companySize}
                  onChange={(e) =>
                    setFormData({ ...formData, companySize: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-violet-200 bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 focus:outline-none transition-all appearance-none cursor-pointer"
                >
                  {companySizes.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Business Model */}
              <div>
                <Label
                  htmlFor="businessModel"
                  className="text-slate-700 mb-2 block"
                >
                  Business Model
                </Label>
                <select
                  id="businessModel"
                  value={formData.businessModel}
                  onChange={(e) =>
                    setFormData({ ...formData, businessModel: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-violet-200 bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 focus:outline-none transition-all appearance-none cursor-pointer"
                >
                  {businessModels.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Website */}
              <div>
                <Label htmlFor="website" className="text-slate-700 mb-2 block">
                  Website
                </Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  className="bg-white border-violet-200 focus:border-violet-500 focus:ring-violet-500"
                />
              </div>

              {/* Tax ID */}
              <div>
                <Label htmlFor="taxId" className="text-slate-700 mb-2 block">
                  Tax ID / EIN
                </Label>
                <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={(e) =>
                    setFormData({ ...formData, taxId: e.target.value })
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
                disabled={updateOrganizationMutation.isPending}
                className="border-slate-300 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={updateOrganizationMutation.isPending}
                className="bg-gradient-to-r from-violet-500 to-purple-400 hover:from-violet-600 hover:to-purple-500"
              >
                {updateOrganizationMutation.isPending ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        ) : (
          // View Mode - Content Blocks (No Logo Controls)
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company Name Block - Full Width */}
            <div className="md:col-span-2 p-4 rounded-xl bg-white/60 border border-violet-100/50">
              <div className="text-xs text-slate-500 mb-1">Company name</div>
              <div className="text-slate-900">{formData.companyName}</div>
            </div>

            {/* Industry Block */}
            <div className="p-4 rounded-xl bg-white/60 border border-violet-100/50">
              <div className="text-xs text-slate-500 mb-1">Industry</div>
              <div className="text-slate-900">{getIndustryLabel(formData.industry)}</div>
            </div>

            {/* Company Size Block */}
            <div className="p-4 rounded-xl bg-white/60 border border-violet-100/50">
              <div className="text-xs text-slate-500 mb-1">Company size</div>
              <div className="text-slate-900">{getCompanySizeLabel(formData.companySize)}</div>
            </div>

            {/* Business Model Block */}
            <div className="p-4 rounded-xl bg-white/60 border border-violet-100/50">
              <div className="text-xs text-slate-500 mb-1">Business Model</div>
              <div className="text-slate-900">{getBusinessModelLabel(formData.businessModel)}</div>
            </div>

            {/* Website Block */}
            <div className="p-4 rounded-xl bg-white/60 border border-violet-100/50">
              <div className="text-xs text-slate-500 mb-1">Website</div>
              <a
                href={
                  formData.website.startsWith("http")
                    ? formData.website
                    : `https://${formData.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-600 hover:text-violet-700 inline-flex items-center gap-1 transition-colors"
              >
                {formData.website}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Tax ID Block */}
            <div className="p-4 rounded-xl bg-white/60 border border-violet-100/50">
              <div className="text-xs text-slate-500 mb-1">Tax ID / EIN</div>
              <div className="text-slate-600 font-mono text-sm">
                {formData.taxId}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
