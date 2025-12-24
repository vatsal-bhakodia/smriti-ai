import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Globe, Rocket, ArrowRightIcon, Mail } from "lucide-react";

const CTA = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-20 py-24 relative text-center">
      <div className="rounded-2xl px-8 py-12 md:px-12 md:py-16 shadow-2xl backdrop-blur-md bg-linear-to-br from-primary/10 to-primary/5 border border-primary/20">
        <Globe className="w-20 h-20 mx-auto mb-8 text-primary" />
        <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
          Ready to <span className="text-primary">Transform</span> Your
          Learning?
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Join thousands of students who've already revolutionized their study
          habits. Start your journey to academic excellence today.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Button
            className="bg-linear-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary text-black font-semibold rounded-full px-10 py-4 h-auto transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30 group relative overflow-hidden"
            asChild
          >
            <Link href="/sign-in">
              <span className="relative z-10 flex items-center gap-2">
                <Rocket className="w-5 h-5" />
                Start Learning Free
                <ArrowRightIcon className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-linear-to-r from-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </Button>
          <Button
            variant="outline"
            className="rounded-full border-white/20 hover:bg-white/10 px-10 py-4 h-auto"
            asChild
          >
            <Link href="/contact">
              <Mail className="w-5 h-5 mr-2" />
              Talk to Our Team
            </Link>
          </Button>
        </div>
      </div>

      {/* Background Blur Effect */}
      <div className="absolute bottom-0 left-1/2 w-[200px] h-[200px] bg-primary opacity-60 blur-[150px] transform -translate-x-1/2 -translate-y-1/2"></div>
    </div>
  );
};

export default CTA;
