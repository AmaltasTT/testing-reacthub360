"use client";

import { useState } from "react";
import { ProgressBar } from "./ProgressBar";
import { FormCard } from "./FormCard";
import { SegmentedControl } from "./SegmentedControl";
import { WhyWeAsk } from "./WhyWeAsk";
import { VideoPlayer } from "./VideoPlayer";
import {
  ChevronRight,
  Info,
  X,
  User,
  Users,
  Check,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";

type BusinessModel = "B2B" | "B2C" | "Both" | null;
type ConnectionChoice = "self" | "team" | null;

interface FormData {
  companyName: string;
  businessModel: BusinessModel;
  industry: string;
  industryOther: string;
  companySize: string;
  websiteUrl: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface FormErrors {
  companyName?: string;
  businessModel?: string;
  industry?: string;
  industryOther?: string;
  companySize?: string;
}

interface TouchedFields {
  companyName?: boolean;
  businessModel?: boolean;
  industry?: boolean;
  industryOther?: boolean;
  companySize?: boolean;
}

interface OnboardingFlowProps {
  onComplete: (data: {
    formData: FormData;
    connectionChoice: ConnectionChoice;
  }) => void;
  onSkip: () => void;
}

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

export function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [connectionChoice, setConnectionChoice] =
    useState<ConnectionChoice>(null);
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    businessModel: null,
    industry: "",
    industryOther: "",
    companySize: "",
    websiteUrl: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [touched, setTouched] = useState<TouchedFields>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (
    name: keyof FormData,
    value: any
  ): string | undefined => {
    switch (name) {
      case "companyName": {
        if (!value || value.trim() === "") {
          return "Company name is required";
        }
        if (value.trim().length < 2) {
          return "Company name must be at least 2 characters";
        }
        if (value.trim().length > 100) {
          return "Company name must not exceed 100 characters";
        }
        // Allow letters, numbers, spaces, hyphens, apostrophes, ampersands, dots, commas
        const companyNamePattern = /^[a-zA-Z0-9\s\-'&.,]+$/;
        if (!companyNamePattern.test(value.trim())) {
          return "Company name contains invalid characters";
        }
        break;
      }
      case "businessModel":
        if (!value) {
          return "Business model is required";
        }
        break;
      case "industry":
        if (!value || value === "") {
          return "Industry is required";
        }
        break;
      case "industryOther":
        if (formData.industry === "other") {
          if (!value || value.trim() === "") {
            return "Please specify your industry";
          }
          if (value.trim().length < 2) {
            return "Industry must be at least 2 characters";
          }
          if (value.trim().length > 50) {
            return "Industry must not exceed 50 characters";
          }
          // Allow letters, numbers, spaces, hyphens, ampersands
          const industryPattern = /^[a-zA-Z0-9\s\-&]+$/;
          if (!industryPattern.test(value.trim())) {
            return "Industry contains invalid characters";
          }
        }
        break;
      case "companySize":
        if (!value || value === "") {
          return "Company size is required";
        }
        break;
    }
    return undefined;
  };

  const getFormErrors = (): FormErrors => {
    const errors: FormErrors = {};

    const companyNameError = validateField("companyName", formData.companyName);
    if (companyNameError) errors.companyName = companyNameError;

    const businessModelError = validateField(
      "businessModel",
      formData.businessModel
    );
    if (businessModelError) errors.businessModel = businessModelError;

    const industryError = validateField("industry", formData.industry);
    if (industryError) errors.industry = industryError;

    if (formData.industry === "other") {
      const industryOtherError = validateField(
        "industryOther",
        formData.industryOther
      );
      if (industryOtherError) errors.industryOther = industryOtherError;
    }

    const companySizeError = validateField("companySize", formData.companySize);
    if (companySizeError) errors.companySize = companySizeError;

    return errors;
  };

  const errors = getFormErrors();
  const isStep2FormValid = Object.keys(errors).length === 0;

  const handleBlur = (field: keyof FormData) => {
    setTouched({ ...touched, [field]: true });
  };

  const canProceed = () => {
    if (currentStep === 1) return true; // Demo tour - always can proceed
    if (currentStep === 2) return isStep2FormValid; // Org profile - needs validation
    if (currentStep === 3) return connectionChoice !== null; // Connection choice - needs selection
    return false;
  };

  const handleSkipTour = () => {
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleContinueLater = () => {
    if (
      window.confirm(
        "Skip channel connection? You can set this up later from your dashboard."
      )
    ) {
      onSkip();
    }
  };

  const handleSubmit = async () => {
    if (currentStep === 1) {
      // Demo tour -> Organization Profile
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      setIsSubmitting(false);
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (currentStep === 2) {
      // Organization Profile -> Channel Connection
      setTouched({
        companyName: true,
        businessModel: true,
        industry: true,
        industryOther: formData.industry === "other",
        companySize: true,
      });

      if (!isStep2FormValid) {
        return;
      }

      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("Organization data saved:", formData);
      setIsSubmitting(false);
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (currentStep === 3) {
      // Channel Connection -> Complete
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("Connection choice:", connectionChoice);
      setIsSubmitting(false);

      onComplete({ formData, connectionChoice });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderDemoTour();
      case 2:
        return renderOrgProfile();
      case 3:
        return renderChannelConnection();
      default:
        return renderDemoTour();
    }
  };

  // Step 1: Demo Tour
  const renderDemoTour = () => (
    <div className="flex flex-col items-center justify-center text-center px-4 py-12">
      <h1
        className="text-4xl text-slate-900 mb-3 tracking-tight"
        style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
      >
        See REACTIQ360 in action
      </h1>
      <p className="text-lg text-slate-600 mb-12 max-w-2xl">
        Watch how unified marketing intelligence transforms your workflow
      </p>

      {/* Video Player */}
      <div className="w-full max-w-4xl mb-6">
        <VideoPlayer posterSrc="/placeholder.svg" />
      </div>

      {/* Continue anytime reassurance */}
      <p className="text-sm text-slate-500 max-w-md">
        You can continue at any time
      </p>
    </div>
  );

  // Step 2: Organization Profile
  const renderOrgProfile = () => (
    <>
      {/* Title Section with Accent */}
      <div className="mb-8 relative pl-8 pr-8 py-2">
        <div
          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-600 via-violet-500 to-purple-400 rounded-full"
          aria-hidden="true"
        />

        <p className="text-xs uppercase tracking-wider text-slate-500 mb-4 font-medium">
          STEP 2 OF 3 · ORGANIZATION
        </p>

        <h2 className="text-3xl text-slate-900 font-bold tracking-tight mb-3">
          Tell us about your company
        </h2>
        <p className="text-slate-600 leading-relaxed max-w-2xl">
          This helps us personalize your dashboard with relevant benchmarks,
          KPIs, and recommendations.
        </p>
      </div>

      {/* Form Cards */}
      <div className="space-y-6">
        {/* Card 1: Company Basics */}
        <FormCard title="Company Basics" subtitle="Required information">
          <div className="space-y-6">
            {/* Company Name */}
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                id="companyName"
                type="text"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                onBlur={() => handleBlur("companyName")}
                placeholder="Acme Inc."
                className={`w-full px-4 py-3 rounded-lg border ${touched.companyName && errors.companyName
                  ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/20"
                  : "border-slate-200 bg-white focus:border-purple-500 focus:ring-purple-500/20"
                  } focus:outline-none focus:ring-4 transition-all`}
                aria-invalid={
                  touched.companyName && errors.companyName ? "true" : "false"
                }
                aria-describedby={
                  touched.companyName && errors.companyName
                    ? "companyName-error"
                    : undefined
                }
              />
              {touched.companyName && errors.companyName && (
                <p
                  id="companyName-error"
                  className="mt-2 text-sm text-[#e11d48]"
                  role="alert"
                >
                  {errors.companyName}
                </p>
              )}
            </div>

            {/* Business Model */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Business Model <span className="text-red-500">*</span>
              </label>
              <SegmentedControl
                options={[
                  { value: "B2B", label: "B2B" },
                  { value: "B2C", label: "B2C" },
                  { value: "Both", label: "Both" },
                ]}
                value={formData.businessModel}
                onChange={(value) => {
                  setFormData({
                    ...formData,
                    businessModel: value as BusinessModel,
                  });
                  handleBlur("businessModel");
                }}
                error={touched.businessModel && errors.businessModel}
              />
              {touched.businessModel && errors.businessModel && (
                <p className="mt-2 text-sm text-[#e11d48]" role="alert">
                  {errors.businessModel}
                </p>
              )}
              <p className="mt-2 text-sm text-slate-500">
                Used to tailor your KPIs and recommendations.
              </p>
            </div>
          </div>
        </FormCard>

        {/* Card 2: Classification for Benchmarks */}
        <FormCard
          title="Classification for Benchmarks"
          subtitle="Required information"
        >
          <div className="space-y-6">
            {/* Industry */}
            <div>
              <label
                htmlFor="industry"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Industry <span className="text-red-500">*</span>
              </label>
              <select
                id="industry"
                value={formData.industry}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    industry: e.target.value,
                    industryOther: "",
                  });
                }}
                onBlur={() => handleBlur("industry")}
                className={`w-full px-4 py-3 rounded-lg border ${touched.industry && errors.industry
                  ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/20"
                  : "border-slate-200 bg-white focus:border-purple-500 focus:ring-purple-500/20"
                  } focus:outline-none focus:ring-4 transition-all appearance-none cursor-pointer`}
                aria-invalid={
                  touched.industry && errors.industry ? "true" : "false"
                }
                aria-describedby={
                  touched.industry && errors.industry
                    ? "industry-error"
                    : undefined
                }
              >
                {industries.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {touched.industry && errors.industry && (
                <p
                  id="industry-error"
                  className="mt-2 text-sm text-[#e11d48]"
                  role="alert"
                >
                  {errors.industry}
                </p>
              )}
            </div>

            {/* Conditional: Industry Other */}
            {formData.industry === "other" && (
              <div className="animate-slideIn">
                <label
                  htmlFor="industryOther"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Industry (please specify){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="industryOther"
                  type="text"
                  value={formData.industryOther}
                  onChange={(e) =>
                    setFormData({ ...formData, industryOther: e.target.value })
                  }
                  onBlur={() => handleBlur("industryOther")}
                  placeholder="Enter your industry"
                  className={`w-full px-4 py-3 rounded-lg border ${touched.industryOther && errors.industryOther
                    ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/20"
                    : "border-slate-200 bg-white focus:border-purple-500 focus:ring-purple-500/20"
                    } focus:outline-none focus:ring-4 transition-all`}
                  aria-invalid={
                    touched.industryOther && errors.industryOther
                      ? "true"
                      : "false"
                  }
                  aria-describedby={
                    touched.industryOther && errors.industryOther
                      ? "industryOther-error"
                      : undefined
                  }
                />
                {touched.industryOther && errors.industryOther && (
                  <p
                    id="industryOther-error"
                    className="mt-2 text-sm text-[#e11d48]"
                    role="alert"
                  >
                    {errors.industryOther}
                  </p>
                )}
              </div>
            )}

            {/* Company Size */}
            <div>
              <label
                htmlFor="companySize"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Company Size <span className="text-red-500">*</span>
              </label>
              <select
                id="companySize"
                value={formData.companySize}
                onChange={(e) =>
                  setFormData({ ...formData, companySize: e.target.value })
                }
                onBlur={() => handleBlur("companySize")}
                className={`w-full px-4 py-3 rounded-lg border ${touched.companySize && errors.companySize
                  ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/20"
                  : "border-slate-200 bg-white focus:border-purple-500 focus:ring-purple-500/20"
                  } focus:outline-none focus:ring-4 transition-all appearance-none cursor-pointer`}
                aria-invalid={
                  touched.companySize && errors.companySize ? "true" : "false"
                }
                aria-describedby={
                  touched.companySize && errors.companySize
                    ? "companySize-error"
                    : "companySize-helper"
                }
              >
                {companySizes.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {touched.companySize && errors.companySize ? (
                <p
                  id="companySize-error"
                  className="mt-2 text-sm text-[#e11d48]"
                  role="alert"
                >
                  {errors.companySize}
                </p>
              ) : (
                <p
                  id="companySize-helper"
                  className="mt-2 text-sm text-slate-500"
                >
                  Helps us calibrate benchmarks to companies of similar scale.
                </p>
              )}
            </div>
          </div>
        </FormCard>

        {/* Card 3: Enrichment */}
        <FormCard title="Enrichment" subtitle="Optional but recommended">
          <div>
            <label
              htmlFor="websiteUrl"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Website URL
            </label>
            <input
              id="websiteUrl"
              type="url"
              value={formData.websiteUrl}
              onChange={(e) =>
                setFormData({ ...formData, websiteUrl: e.target.value })
              }
              placeholder="https://www.yourcompany.com"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:outline-none transition-all"
              aria-describedby="websiteUrl-helper"
            />
            <p id="websiteUrl-helper" className="mt-2 text-sm text-slate-500">
              Optional. Helps tailor channel and performance recommendations.
            </p>
          </div>
        </FormCard>

        {/* Card 4: Business Address */}
        <FormCard title="Business Address" subtitle="Optional but recommended">
          <div className="space-y-6">
            {/* Street Address */}
            <div>
              <label
                htmlFor="streetAddress"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Street Address
              </label>
              <input
                id="streetAddress"
                type="text"
                value={formData.streetAddress}
                onChange={(e) =>
                  setFormData({ ...formData, streetAddress: e.target.value })
                }
                placeholder="123 Main Street"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:outline-none transition-all"
              />
            </div>

            {/* City and State Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* City */}
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  placeholder="San Francisco"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:outline-none transition-all"
                />
              </div>

              {/* State */}
              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  State / Province
                </label>
                <input
                  id="state"
                  type="text"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  placeholder="CA"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Zip Code and Country Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Zip Code */}
              <div>
                <label
                  htmlFor="zipCode"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Zip / Postal Code
                </label>
                <input
                  id="zipCode"
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) =>
                    setFormData({ ...formData, zipCode: e.target.value })
                  }
                  placeholder="94102"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:outline-none transition-all"
                />
              </div>

              {/* Country */}
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  placeholder="United States"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            <p className="text-sm text-slate-500">
              Optional. Your business address helps us provide location-specific insights and compliance requirements.
            </p>
          </div>
        </FormCard>

        {/* Reassurance Callout */}
        <div className="bg-gradient-to-r from-purple-50/70 to-violet-50/50 border border-purple-100 rounded-xl px-5 py-4 flex items-center gap-3">
          <Info
            className="w-5 h-5 text-[#7652b3] flex-shrink-0"
            aria-hidden="true"
          />
          <p className="text-sm font-medium text-slate-700">
            You can update this anytime in Organization Settings.
          </p>
        </div>

        {/* Why We Ask This */}
        <WhyWeAsk />
      </div>
    </>
  );

  // Step 3: Who's connecting your channels
  const renderChannelConnection = () => (
    <div className="flex flex-col items-center text-center px-4 py-8">
      <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">
        Who's connecting your channels?
      </h1>
      <p className="text-lg text-slate-600 mb-12 max-w-2xl">
        Choose how you'd like to bring your marketing data together
      </p>

      {/* Selection Cards */}
      <div className="w-full max-w-3xl space-y-6 mb-8">
        {/* I'll connect them */}
        <button
          onClick={() => setConnectionChoice("self")}
          className={`w-full text-left p-8 rounded-2xl border-2 transition-all duration-200 ${connectionChoice === "self"
            ? "border-purple-500 bg-purple-50/50 shadow-lg"
            : "border-slate-200 bg-white hover:border-purple-300 hover:shadow-md"
            }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center">
              <User className="w-7 h-7 text-[#7652b3]" />
            </div>
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${connectionChoice === "self"
                ? "border-purple-600 bg-purple-600"
                : "border-slate-300 bg-white"
                }`}
            >
              {connectionChoice === "self" && (
                <Check className="w-5 h-5 text-white" />
              )}
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">
            I'll connect them
          </h3>
          <p className="text-slate-600 mb-6 leading-relaxed">
            I have access to our marketing platforms and can authorize the
            connections myself
          </p>
          <div className="inline-flex items-center gap-2 text-[#7652b3] font-medium text-sm bg-purple-50 px-4 py-2 rounded-lg">
            <ArrowRight className="w-4 h-4" />
            Connect your channels now
          </div>
        </button>

        {/* My team will */}
        <button
          onClick={() => setConnectionChoice("team")}
          className={`w-full text-left p-8 rounded-2xl border-2 transition-all duration-200 ${connectionChoice === "team"
            ? "border-purple-500 bg-purple-50/50 shadow-lg"
            : "border-slate-200 bg-white hover:border-purple-300 hover:shadow-md"
            }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center">
              <Users className="w-7 h-7 text-slate-600" />
            </div>
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${connectionChoice === "team"
                ? "border-purple-600 bg-purple-600"
                : "border-slate-300 bg-white"
                }`}
            >
              {connectionChoice === "team" && (
                <Check className="w-5 h-5 text-white" />
              )}
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">
            My team will
          </h3>
          <p className="text-slate-600 mb-6 leading-relaxed">
            I'll invite the right people who have access to our marketing
            platforms
          </p>
          <div className="inline-flex items-center gap-2 text-slate-600 font-medium text-sm bg-slate-50 px-4 py-2 rounded-lg">
            <ArrowRight className="w-4 h-4" />
            Invite team members
          </div>
        </button>
      </div>

      {/* Continue Later Link */}
      <button
        onClick={handleContinueLater}
        className="text-slate-500 hover:text-[#7652b3] text-sm transition-colors mb-2 font-medium hover:underline cursor-pointer"
      >
        I'll continue later
      </button>
      <p className="text-xs text-slate-400 max-w-md">
        You can connect channels and invite team anytime from your dashboard
      </p>
    </div>
  );

  const showSkipTour = currentStep === 1;
  const showFooter = true; // Show footer for all steps

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/40 via-violet-50/20 to-purple-50/30">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <div className="flex items-center justify-between mb-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/Transparent-logo.svg" alt="REACTIQ360 Logo" className="w-10 h-10" />
            <span className="font-bold text-slate-900 text-lg">REACTIQ360</span>
          </div>

          {/* Skip Tour or Close */}
          {showSkipTour ? (
            <button
              onClick={handleSkipTour}
              className="text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors flex items-center gap-1"
            >
              Skip tour
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to exit onboarding? Your progress will not be saved."
                  )
                ) {
                  onSkip();
                }
              }}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white/60 transition-all"
              aria-label="Exit onboarding"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-6 pb-4">
        <ProgressBar currentStep={currentStep} totalSteps={3} />
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 pb-32">
        {renderStepContent()}
      </main>

      {/* Footer Action Bar */}
      {showFooter && (
        <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 shadow-lg">
          <div className="max-w-4xl mx-auto px-6 py-5">
            <div className="flex items-center justify-between">
              {/* Previous Link */}
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`
                  inline-flex items-center gap-1 text-sm font-medium transition-colors
                  ${currentStep === 1
                    ? "text-slate-300 cursor-not-allowed"
                    : "text-slate-600 hover:text-[#7652b3] hover:underline cursor-pointer"
                  }
                `}
                aria-label="Go to previous step"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                Previous
              </button>

              {/* Next/Finish Button */}
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className={`
                  inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium
                  transition-all duration-200
                  ${!canProceed() || isSubmitting
                    ? "bg-purple-200/50 text-purple-400/60 cursor-not-allowed"
                    : "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-md active:bg-purple-800"
                  }
                `}
                aria-label={
                  currentStep === 3
                    ? "Finish onboarding"
                    : "Continue to next step"
                }
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {currentStep === 3 ? "Finishing..." : "Continuing..."}
                  </>
                ) : (
                  <>
                    {currentStep === 3 ? "Finish" : "Next"}
                    <ChevronRight className="w-5 h-5" aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
