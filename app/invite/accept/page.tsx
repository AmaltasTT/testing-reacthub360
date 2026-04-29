"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAcceptInvitation } from "@/hooks/use-invitations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, User, Phone, AlertCircle, CheckCircle } from "lucide-react";

export default function AcceptInvitationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const acceptInvitationMutation = useAcceptInvitation();

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token, router]);

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "first_name":
        if (!value.trim()) return "First name is required";
        if (value.trim().length < 2) return "First name must be at least 2 characters";
        break;
      case "last_name":
        if (!value.trim()) return "Last name is required";
        if (value.trim().length < 2) return "Last name must be at least 2 characters";
        break;
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter";
        if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter";
        if (!/[0-9]/.test(value)) return "Password must contain at least one number";
        break;
      case "confirmPassword":
        if (value !== formData.password) return "Passwords do not match";
        break;
      case "phone_number":
        // Optional field, only validate if provided
        if (value && !/^\+?[1-9]\d{1,14}$/.test(value.replace(/[\s-]/g, ""))) {
          return "Invalid phone number format";
        }
        break;
    }
    return undefined;
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    const error = validateField(field, formData[field as keyof typeof formData]);
    if (error) {
      setErrors({ ...errors, [field]: error });
    } else {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (touched[field]) {
      const error = validateField(field, value);
      if (error) {
        setErrors({ ...errors, [field]: error });
      } else {
        const newErrors = { ...errors };
        delete newErrors[field];
        setErrors(newErrors);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const allErrors: Record<string, string> = {};
    Object.keys(formData).forEach((key) => {
      if (key !== "phone_number") { // phone_number is optional
        const error = validateField(key, formData[key as keyof typeof formData]);
        if (error) allErrors[key] = error;
      }
    });

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      setTouched({
        first_name: true,
        last_name: true,
        password: true,
        confirmPassword: true,
      });
      return;
    }

    try {
      const result = await acceptInvitationMutation.mutateAsync({
        token: token!,
        first_name: formData.first_name,
        last_name: formData.last_name,
        password: formData.password,
        phone_number: formData.phone_number || undefined,
      });

      // Store auth token and redirect to dashboard
      localStorage.setItem("auth_token", result.authToken);
      sessionStorage.setItem("auth_token", result.authToken);
      document.cookie = `auth_token=${result.authToken}; path=/; max-age=86400; SameSite=Lax`;

      // Redirect to dashboard
      router.push("/");
    } catch (error: any) {
      console.error("Failed to accept invitation:", error);
    }
  };

  const getPasswordStrength = (password: string): { strength: string; color: string; width: string } => {
    if (!password) return { strength: "", color: "", width: "0%" };

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { strength: "Weak", color: "bg-red-500", width: "33%" };
    if (score <= 3) return { strength: "Medium", color: "bg-yellow-500", width: "66%" };
    return { strength: "Strong", color: "bg-green-500", width: "100%" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  if (!token) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/40 via-violet-50/20 to-purple-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/Transparent-logo.svg" alt="REACTIQ360 Logo" className="w-12 h-12" />
            <span className="font-bold text-slate-900 text-2xl">REACTIQ360</span>
          </div>
        </div>

        <Card className="shadow-lg border-slate-200/60">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md shadow-violet-300/40">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">You've been invited!</CardTitle>
            <CardDescription className="text-slate-600 text-base mt-2">
              Create your account to join the team on REACTIQ360
            </CardDescription>
          </CardHeader>

          <CardContent>
            {acceptInvitationMutation.isError && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-[#e11d48]" />
                <AlertDescription className="text-red-800">
                  {acceptInvitationMutation.error?.message || "Failed to accept invitation. The link may be invalid or expired."}
                </AlertDescription>
              </Alert>
            )}

            {acceptInvitationMutation.isSuccess && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Account created successfully! Redirecting to dashboard...
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name */}
              <div>
                <Label htmlFor="first_name" className="text-slate-700">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1.5">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="first_name"
                    type="text"
                    placeholder="John"
                    value={formData.first_name}
                    onChange={(e) => handleChange("first_name", e.target.value)}
                    onBlur={() => handleBlur("first_name")}
                    className={`pl-10 ${touched.first_name && errors.first_name ? "border-red-300 focus:border-red-500" : ""}`}
                  />
                </div>
                {touched.first_name && errors.first_name && (
                  <p className="text-sm text-[#e11d48] mt-1">{errors.first_name}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <Label htmlFor="last_name" className="text-slate-700">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1.5">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="last_name"
                    type="text"
                    placeholder="Doe"
                    value={formData.last_name}
                    onChange={(e) => handleChange("last_name", e.target.value)}
                    onBlur={() => handleBlur("last_name")}
                    className={`pl-10 ${touched.last_name && errors.last_name ? "border-red-300 focus:border-red-500" : ""}`}
                  />
                </div>
                {touched.last_name && errors.last_name && (
                  <p className="text-sm text-[#e11d48] mt-1">{errors.last_name}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password" className="text-slate-700">
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    onBlur={() => handleBlur("password")}
                    className={`pl-10 ${touched.password && errors.password ? "border-red-300 focus:border-red-500" : ""}`}
                  />
                </div>
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-600">Password strength:</span>
                      <span className={`font-medium ${passwordStrength.strength === "Weak" ? "text-[#e11d48]" :
                          passwordStrength.strength === "Medium" ? "text-yellow-600" :
                            "text-green-600"
                        }`}>
                        {passwordStrength.strength}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength.color} transition-all duration-300`}
                        style={{ width: passwordStrength.width }}
                      />
                    </div>
                  </div>
                )}
                {touched.password && errors.password && (
                  <p className="text-sm text-[#e11d48] mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <Label htmlFor="confirmPassword" className="text-slate-700">
                  Confirm Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    onBlur={() => handleBlur("confirmPassword")}
                    className={`pl-10 ${touched.confirmPassword && errors.confirmPassword ? "border-red-300 focus:border-red-500" : ""}`}
                  />
                </div>
                {touched.confirmPassword && errors.confirmPassword && (
                  <p className="text-sm text-[#e11d48] mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Phone Number (Optional) */}
              <div>
                <Label htmlFor="phone_number" className="text-slate-700">
                  Phone Number <span className="text-slate-500 text-xs">(optional)</span>
                </Label>
                <div className="relative mt-1.5">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="phone_number"
                    type="tel"
                    placeholder="+1234567890"
                    value={formData.phone_number}
                    onChange={(e) => handleChange("phone_number", e.target.value)}
                    onBlur={() => handleBlur("phone_number")}
                    className={`pl-10 ${touched.phone_number && errors.phone_number ? "border-red-300 focus:border-red-500" : ""}`}
                  />
                </div>
                {touched.phone_number && errors.phone_number && (
                  <p className="text-sm text-[#e11d48] mt-1">{errors.phone_number}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-violet-500 to-purple-400 hover:from-violet-600 hover:to-purple-500 text-white shadow-md shadow-violet-300/30 mt-6"
                disabled={acceptInvitationMutation.isPending || acceptInvitationMutation.isSuccess}
              >
                {acceptInvitationMutation.isPending ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
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
                    Creating account...
                  </>
                ) : (
                  "Create Account & Sign In"
                )}
              </Button>
            </form>

            <p className="text-xs text-slate-500 text-center mt-6">
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
