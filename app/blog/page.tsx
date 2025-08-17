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
import BlurIn from "@/components/magicui/blur-in";
import Footer from "@/components/Footer";
import { generateMathCaptcha } from "@/utils/generateMathCaptcha";
import Link from "next/link";
import Image from "next/image";

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

const blogPosts = [
    {
        id: 1,
        title: "How AI Can Help Students Study Smarter",
        description:
            "Discover how artificial intelligence is transforming the way students learn, helping them to study more effectively.",
        image: "https://siteefy.com/wp-content/uploads/2023/11/How-to-learn-ai-basics.png",
    },
    {
        id: 2,
        title: "AI-Powered Summaries: Capture the Essence",
        description:
            "AI helps convert textbooks and lengthy articles into concise summaries, enabling students to grasp key concepts faster.",
        image: "https://i.ibb.co/YPfnMqF/ai-summary.png",
    },
    {
        id: 3,
        title: "The Future of AI Tutors in Classrooms",
        description:
            "From virtual tutors to personalized learning paths, AI is changing the classroom experience forever.",
        image: "https://i.ibb.co/hC0Wr6W/ai-tutor.png",
    },
];


export default function ContactPage() {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [captcha, setCaptcha] = useState<{ question: string; answer: number } | null>(null);
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

                <div className="relative z-10 py-16 px-4 pt-30">
                    <div className="max-w-2xl mx-auto">
                        {/* Header Section */}
                       <motion.div className="text-center mb-10" variants={itemVariants}>
  <BlurIn
    word={
      <span>
    <span style={{ color: "#adff2f" }}>Welcome</span> to Smriti AI Blog
      </span>
    }
    className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4"
    duration={1}
  />
  <motion.p
    className="text-lg text-muted-foreground max-w-2xl mx-auto"
    variants={itemVariants}
  >
    Discover How Artificial Intelligence is transforming the way students learn, helping them to study more effectively.
  </motion.p>
</motion.div>

                        <div className="px-6 py-12">
                            <motion.div
                                className="text-left mb-10  margin-left max-w-3xl"
                                variants={itemVariants}
                            >
                                <BlurIn
                                    word="The Power of AI in Education"
                                    className="font-display text-2xl md:text-4xl font-bold text-foreground mb-4"
                                    duration={1}
                                />
                                <motion.p
                                    className="text-base text-muted-foreground leading-relaxed"
                                    variants={itemVariants}
                                >
                                    AI is transforming education by personalizing learning experiences and
                                    reducing repetitive tasks for teachers. It helps students understand
                                    complex concepts through tools like mind maps, summaries, and quizzes,
                                    making learning faster, smarter, and more engaging.
                                </motion.p>
                            </motion.div>
                        </div>



                        <div className="px-6 py-12">
                            <motion.div
                                className="text-left mb-10  margin-left max-w-3xl"
                                variants={itemVariants}
                            >
                                <BlurIn
                                    word="AI-Powered Summaries"
                                    className="font-display text-2xl md:text-4xl font-bold text-foreground mb-4"
                                    duration={1}
                                />
                                <motion.p
                                    className="text-base text-muted-foreground leading-relaxed"
                                    variants={itemVariants}
                                >
                                    AI makes learning easier by breaking down large amounts of information into clear, concise summaries.
                                    Instead of spending hours reading long chapters or research papers, students can quickly grasp the main points in minutes.
                                    This not only saves time but also helps in better retention of knowledge.
                                </motion.p>
                            </motion.div>
                        </div>





                        <section className="px-6 pb-16 max-w-6xl mx-auto flex-grow">
                            <div className="grid md:grid-cols-3 gap-8">
                                {blogPosts.map((post) => (
                                    <div
                                        key={post.id}
                                        className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg border border-gray-800 hover:border-green-500 transition"
                                    >
                                        <Image
                                            src="https://i.ibb.co/your-image-id.jpg"
                                            alt="Blog Image"
                                            width={800}
                                            height={500}
                                            className="rounded-lg object-cover"
                                        />
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold mb-3">{post.title}</h3>
                                            <p className="text-gray-400 mb-4">{post.description}</p>
                                            <Link
                                                href={`/blog/${post.id}`}
                                                className="text-green-500 font-semibold hover:underline"
                                            >
                                                Read More →
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
















                    </div>
                </div>
            </motion.div>
            <Footer />
        </>
    );
}
