"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, MessageSquare, User, FileText, Clock, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/magicui/dot-pattern";
import Footer from "@/components/Footer";
import { generateMathCaptcha } from "@/utils/generateMathCaptcha";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [captcha, setCaptcha] = useState<{
    question: string;
    answer: number;
  } | null>(null);
  const [userCaptcha, setUserCaptcha] = useState<string>("");
  const [captchaError, setCaptchaError] = useState<string | null>(null);

  useEffect(() => {
    setCaptcha(generateMathCaptcha());
  }, []);

  const refreshCaptcha = () => setCaptcha(generateMathCaptcha());

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !captcha) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim() || undefined,
          message: formData.message.trim(),
          userAnswer: Number(userCaptcha),
          answer: captcha.answer,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (
          response.status === 400 &&
          data.error === "Incorrect CAPTCHA answer."
        ) {
          setCaptchaError("Wrong answer. Try again.");
          refreshCaptcha();
          setUserCaptcha("");
          setIsSubmitting(false);
          return;
        }
        if (data.message) {
          toast.error(data.message);
          setIsSubmitting(false);
          return;
        }
        if (response.status === 429) {
          toast.error(
            "You’ve reached the submission limit. Please try again later."
          );
          setIsSubmitting(false);
          return;
        }
        throw new Error(data.error || "Failed to send message");
      }

      toast.success("Thank you for your message! We'll get back to you soon.");

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setErrors({});
      setUserCaptcha("");
      setCaptcha(null);
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to send message. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <motion.div
        className="relative min-h-screen bg-background overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Background Pattern */}
        <DotPattern
          className={cn(
            "absolute inset-0 z-0 [mask-image:radial-gradient(50vw_circle_at_center,white,transparent)] dark:[mask-image:radial-gradient(50vw_circle_at_center,black,transparent)]"
          )}
        />

        <div className="relative z-10 py-16 px-4 pt-32">
          <div className="max-w-2xl mx-auto">
            {/* Header Section */}
            <motion.div className="text-center mb-12" variants={itemVariants}>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4">
                Get in Touch
              </h1>
              <motion.p
                className="text-lg text-muted-foreground max-w-2xl mx-auto"
                variants={itemVariants}
              >
                Have questions about Smriti AI? We'd love to hear from you!
              </motion.p>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-2xl border-border/50 backdrop-blur-sm bg-background/95">
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label
                        htmlFor="name"
                        className="flex items-center gap-2 text-foreground"
                      >
                        <User className="w-4 h-4 text-primary" />
                        Name *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="Enter your full name"
                        className={cn(
                          "transition-all duration-200",
                          errors.name
                            ? "border-red-500 focus-visible:ring-red-500/20"
                            : "focus-visible:ring-primary/20"
                        )}
                        disabled={isSubmitting}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">{errors.name}</p>
                      )}
                    </motion.div>

                    {/* Email Field */}
                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label
                        htmlFor="email"
                        className="flex items-center gap-2 text-foreground"
                      >
                        <Mail className="w-4 h-4 text-primary" />
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="Enter your email address"
                        className={cn(
                          "transition-all duration-200",
                          errors.email
                            ? "border-red-500 focus-visible:ring-red-500/20"
                            : "focus-visible:ring-primary/20"
                        )}
                        disabled={isSubmitting}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email}</p>
                      )}
                    </motion.div>

                    {/* Subject Field */}
                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label
                        htmlFor="subject"
                        className="flex items-center gap-2 text-foreground"
                      >
                        <FileText className="w-4 h-4 text-primary" />
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        type="text"
                        value={formData.subject}
                        onChange={(e) =>
                          handleInputChange("subject", e.target.value)
                        }
                        placeholder="What is this about? (optional)"
                        className="focus-visible:ring-primary/20 transition-all duration-200"
                        disabled={isSubmitting}
                      />
                    </motion.div>

                    {/* Message Field */}
                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label
                        htmlFor="message"
                        className="flex items-center gap-2 text-foreground"
                      >
                        <MessageSquare className="w-4 h-4 text-primary" />
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) =>
                          handleInputChange("message", e.target.value)
                        }
                        placeholder="Tell us more about your inquiry..."
                        rows={5}
                        className={cn(
                          "h-40 transition-all duration-200 resize-none",
                          errors.message
                            ? "border-red-500 focus-visible:ring-red-500/20"
                            : "focus-visible:ring-primary/20"
                        )}
                        disabled={isSubmitting}
                      />
                      {errors.message && (
                        <p className="text-sm text-red-500">{errors.message}</p>
                      )}
                    </motion.div>

                    {/* CAPTCHA Field */}
                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label
                        htmlFor="captcha"
                        className="flex items-center gap-2 text-foreground"
                      >
                        <Clock className="w-4 h-4 text-primary" />
                        {captcha?.question} =
                      </Label>
                      <Input
                        id="captcha"
                        type="number"
                        value={userCaptcha}
                        onChange={(e) => {
                          setUserCaptcha(e.target.value);
                          setCaptchaError(null);
                        }}
                        placeholder="Your answer"
                        className={cn(
                          "transition-all duration-200",
                          captchaError
                            ? "border-red-500 focus-visible:ring-red-500/20"
                            : "focus-visible:ring-primary/20"
                        )}
                        disabled={isSubmitting}
                        aria-invalid={!!captchaError}
                        required
                      />
                      {captchaError && (
                        <p role="alert" className="text-sm text-red-500">
                          {captchaError}
                        </p>
                      )}
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div variants={itemVariants}>
                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-all duration-200"
                        disabled={isSubmitting}
                        size="lg"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Additional Contact Information */}
            <motion.div className="mt-12" variants={itemVariants}>
              <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
                Other Ways to Reach Us
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                  <Card className="border-border/50 backdrop-blur-sm bg-background/95 hover:shadow-lg transition-all duration-200">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Mail className="w-8 h-8 mx-auto mb-3 text-primary" />
                        <h3 className="font-semibold text-foreground mb-2">
                          Email
                        </h3>
                        <p className="text-muted-foreground">
                          support@smriti.live
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Card className="border-border/50 backdrop-blur-sm bg-background/95 hover:shadow-lg transition-all duration-200">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Clock className="w-8 h-8 mx-auto mb-3 text-primary" />
                        <h3 className="font-semibold text-foreground mb-2">
                          Response Time
                        </h3>
                        <p className="text-muted-foreground">
                          Usually within 24 hours
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
      <Footer />
    </>
  );
}
