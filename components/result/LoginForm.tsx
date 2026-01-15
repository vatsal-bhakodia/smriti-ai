"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw, Brain, Eye, EyeOff } from "lucide-react";

interface LoginFormProps {
  enrollmentNumber: string;
  password: string;
  captcha: string;
  captchaImage: string;
  isLoading: boolean;
  isLoadingCaptcha: boolean;
  error: string;
  onEnrollmentChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onCaptchaChange: (value: string) => void;
  onRefreshCaptcha: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function LoginForm({
  enrollmentNumber,
  password,
  captcha,
  captchaImage,
  isLoading,
  isLoadingCaptcha,
  error,
  onEnrollmentChange,
  onPasswordChange,
  onCaptchaChange,
  onRefreshCaptcha,
  onSubmit,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      {/* Password Information Warning Box */}
      <Card className="mb-6 border-orange-500/30 bg-orange-950/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-white mb-2">
                Password Information
              </h3>
              <p className="text-white text-sm mb-3">
                Please double-check the following before entering your password:
              </p>
              <ul className="text-white text-sm space-y-1.5 list-disc list-inside">
                <li>
                  Default password is your{" "}
                  <span className="text-lime-400 font-semibold">
                    father's full name in CAPITAL LETTERS
                  </span>
                </li>
                <li>
                  Ensure space between words as per registered father's name
                </li>
                <li>
                  3 Wrong attempts will lead to temporary account lockout. Enter
                  password wisely
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Login Form Card */}
      <Card className="bg-zinc-900/95 border-zinc-800 max-w-2xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-black mb-4">
              <Brain className="h-10 w-10" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              GGSIPU Results
            </h1>
            <p className="text-zinc-400">
              Enter your credentials to view your result analysis
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="enrollment" className="text-white">
                Enrollment Number
              </Label>
              <Input
                id="enrollment"
                type="text"
                placeholder="Enter Enrollment No."
                value={enrollmentNumber}
                onChange={(e) => onEnrollmentChange(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) =>
                    onPasswordChange(e.target.value.toUpperCase())
                  }
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 pr-10"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-zinc-400 hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="captcha" className="text-white">
                Captcha
              </Label>
              <div className="flex gap-3">
                <Input
                  id="captcha"
                  type="text"
                  placeholder="ENTER CAPTCHA"
                  value={captcha}
                  onChange={(e) =>
                    onCaptchaChange(e.target.value.toUpperCase())
                  }
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 flex-1"
                  disabled={isLoading}
                />
                <div className="flex gap-2">
                  {isLoadingCaptcha || !captchaImage ? (
                    <Skeleton className="h-10 w-32 border border-zinc-700 rounded" />
                  ) : (
                    <img
                      src={captchaImage}
                      alt="Captcha"
                      className="h-10 w-32 border border-zinc-700 rounded bg-white object-contain"
                    />
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={onRefreshCaptcha}
                    disabled={isLoadingCaptcha || isLoading}
                    className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${
                        isLoadingCaptcha ? "animate-spin" : ""
                      }`}
                    />
                  </Button>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-primary/10 border border-primary/50 rounded text-primary text-sm">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold mb-1">Error</p>
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || isLoadingCaptcha}
              className="w-full bg-primary hover:bg-lime-400 text-black font-semibold py-6 text-lg"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="text-center text-zinc-500 text-sm mt-6">
            Data is fetched directly from GGSIPU Exam Portal.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
