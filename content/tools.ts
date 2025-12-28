import {
  Zap,
  Brain,
  Sparkles,
  Clock,
  Network,
  GitBranch,
  Eye,
  BarChart3,
  Target,
  TrendingUp,
  LucideIcon,
} from "lucide-react";

export type InputType = "pdf" | "youtube" | "text";
export type ToolType = "flashcard" | "mindmap" | "quiz";

export interface ToolPageProps {
  slug: string;
  metadata: {
    title: string;
    description: string;
    keywords: string[];
    url: string;
  };
  hero: {
    title: string;
    titleHighlight: string;
    subtitle: string;
    toolType: ToolType;
    defaultInputType: InputType;
    keyBenefits: string[];
  };
  steps: {
    number: string;
    title: string;
    description: string;
  }[];
  howItWorksDescription: string;
  features: {
    icon: LucideIcon;
    title: string;
    description: string;
  }[];
  benefits: {
    title: string;
    description: string;
    items: {
      title: string;
      description: string;
    }[];
  };
  extraSection?: {
    title: string;
    titleHighlight: string;
    description: string;
    items: {
      icon: LucideIcon;
      title: string;
      description: string;
    }[];
  };
}

export const toolsData: Record<string, ToolPageProps> = {
  "pdf-to-flashcards": {
    slug: "pdf-to-flashcards",
    metadata: {
      title: "PDF to Flashcards in 30 Seconds - Free AI Study Tool",
      description:
        "Turn PDF documents into flashcards automatically. Free AI tool for students. Just upload your PDF. Export to Anki or Quizlet. Study smarter!",
      keywords: [
        "pdf to flashcards",
        "document to flashcards",
        "convert pdf to flashcards",
        "ai flashcard maker",
        "pdf flashcard generator",
        "flashcards from pdf",
        "pdf study tool",
        "anki flashcards",
        "smriti ai",
        "ai study tool",
        "free online tool",
        "student helper",
        "exam prep",
        "study aid",
        "learning assistant",
        "AI flashcards",
        "interactive flashcards",
        "study flashcards",
        "educational flashcards",
      ],
      url: "https://www.smriti.live/pdf-to-flashcards",
    },
    hero: {
      title: "PDF to",
      titleHighlight: "Flashcards",
      subtitle:
        "Transform any PDF document into interactive flashcards instantly with AI. Study smarter, remember longer.",
      toolType: "flashcard",
      defaultInputType: "pdf",
      keyBenefits: ["AI-Powered", "Instant Generation", "Smart Learning"],
    },
    steps: [
      {
        number: "01",
        title: "Upload PDF",
        description:
          "Simply upload your PDF document. No sign-up required to get started.",
      },
      {
        number: "02",
        title: "AI Processing",
        description:
          "Our AI analyzes the PDF content, extracts key information, and identifies important concepts to create flashcards.",
      },
      {
        number: "03",
        title: "Get Your Flashcards",
        description:
          "Receive your personalized flashcards instantly. Review them, study at your own pace, and track your progress.",
      },
    ],
    howItWorksDescription:
      "Creating flashcards from PDF documents has never been easier. Get started in three simple steps.",
    features: [
      {
        icon: Brain,
        title: "AI-Powered Generation",
        description:
          "Our advanced AI analyzes PDF content and automatically creates comprehensive flashcards covering key concepts, definitions, and important points.",
      },
      {
        icon: Zap,
        title: "Lightning Fast",
        description:
          "Get your flashcards ready in seconds. No manual work required - just upload your PDF and let AI do the heavy lifting.",
      },
      {
        icon: Sparkles,
        title: "Smart & Interactive",
        description:
          "Each flashcard is intelligently designed with questions and answers that help reinforce your understanding and improve memory retention.",
      },
      {
        icon: Clock,
        title: "Study Anytime, Anywhere",
        description:
          "Access your flashcards on any device. Review them during your commute, breaks, or study sessions for maximum learning efficiency.",
      },
    ],
    benefits: {
      title: "Get Things Very Fast",
      description:
        "Our AI-powered system processes PDFs and generates flashcards in seconds, not hours. Spend more time studying, less time creating.",
      items: [
        {
          title: "AI Included",
          description:
            "Advanced artificial intelligence analyzes PDF content and extracts the most important information automatically.",
        },
        {
          title: "Instant Results",
          description:
            "No waiting around. Get your flashcards ready in seconds and start studying immediately.",
        },
        {
          title: "Comprehensive Coverage",
          description:
            "Every important concept, definition, and key point from the PDF is captured in your flashcards.",
        },
        {
          title: "Enhanced Retention",
          description:
            "Scientifically-backed flashcard methods help you remember information longer and more effectively.",
        },
      ],
    },
  },
  "youtube-to-flashcards": {
    slug: "youtube-to-flashcards",
    metadata: {
      title: "YouTube to Flashcards in 30 Seconds - Free AI Study Tool",
      description:
        "Turn YouTube lectures into flashcards automatically. Free AI tool for students. Just paste the video URL. Export to Anki or Quizlet. Study smarter!",
      keywords: [
        "youtube to flashcards",
        "video to flashcards",
        "lecture to flashcards",
        "convert youtube to flashcards",
        "ai flashcard maker",
        "youtube flashcard generator",
        "flashcards from video",
        "video study tool",
        "anki flashcards",
        "smriti ai",
        "ai study tool",
        "free online tool",
        "student helper",
        "exam prep",
        "study aid",
        "learning assistant",
        "AI flashcards",
        "interactive flashcards",
        "study flashcards",
        "educational flashcards",
      ],
      url: "https://www.smriti.live/youtube-to-flashcards",
    },
    hero: {
      title: "YouTube Video to",
      titleHighlight: "Flashcards",
      subtitle:
        "Transform any YouTube educational video into interactive flashcards instantly with AI. Study smarter, remember longer.",
      toolType: "flashcard",
      defaultInputType: "youtube",
      keyBenefits: ["AI-Powered", "Instant Generation", "Smart Learning"],
    },
    steps: [
      {
        number: "01",
        title: "Paste YouTube URL",
        description:
          "Simply copy and paste your YouTube video link into our form. No sign-up required to get started.",
      },
      {
        number: "02",
        title: "AI Processing",
        description:
          "Our AI analyzes the video content, extracts key information, and identifies important concepts to create flashcards.",
      },
      {
        number: "03",
        title: "Get Your Flashcards",
        description:
          "Receive your personalized flashcards instantly. Review them, study at your own pace, and track your progress.",
      },
    ],
    howItWorksDescription:
      "Creating flashcards from YouTube videos has never been easier. Get started in three simple steps.",
    features: [
      {
        icon: Brain,
        title: "AI-Powered Generation",
        description:
          "Our advanced AI analyzes video content and automatically creates comprehensive flashcards covering key concepts, definitions, and important points.",
      },
      {
        icon: Zap,
        title: "Lightning Fast",
        description:
          "Get your flashcards ready in seconds. No manual work required - just paste your YouTube URL and let AI do the heavy lifting.",
      },
      {
        icon: Sparkles,
        title: "Smart & Interactive",
        description:
          "Each flashcard is intelligently designed with questions and answers that help reinforce your understanding and improve memory retention.",
      },
      {
        icon: Clock,
        title: "Study Anytime, Anywhere",
        description:
          "Access your flashcards on any device. Review them during your commute, breaks, or study sessions for maximum learning efficiency.",
      },
    ],
    benefits: {
      title: "Get Things Very Fast",
      description:
        "Our AI-powered system processes videos and generates flashcards in seconds, not hours. Spend more time studying, less time creating.",
      items: [
        {
          title: "AI Included",
          description:
            "Advanced artificial intelligence analyzes video content and extracts the most important information automatically.",
        },
        {
          title: "Instant Results",
          description:
            "No waiting around. Get your flashcards ready in seconds and start studying immediately.",
        },
        {
          title: "Comprehensive Coverage",
          description:
            "Every important concept, definition, and key point from the video is captured in your flashcards.",
        },
        {
          title: "Enhanced Retention",
          description:
            "Scientifically-backed flashcard methods help you remember information longer and more effectively.",
        },
      ],
    },
  },
  "text-to-flashcards": {
    slug: "text-to-flashcards",
    metadata: {
      title: "Text to Flashcards in 30 Seconds - Free AI Study Tool",
      description:
        "Turn text content into flashcards automatically. Free AI tool for students. Just paste your text. Export to Anki or Quizlet. Study smarter!",
      keywords: [
        "text to flashcards",
        "content to flashcards",
        "convert text to flashcards",
        "ai flashcard maker",
        "text flashcard generator",
        "flashcards from text",
        "text study tool",
        "anki flashcards",
        "smriti ai",
        "ai study tool",
        "free online tool",
        "student helper",
        "exam prep",
        "study aid",
        "learning assistant",
        "AI flashcards",
        "interactive flashcards",
        "study flashcards",
        "educational flashcards",
      ],
      url: "https://www.smriti.live/text-to-flashcards",
    },
    hero: {
      title: "Text to",
      titleHighlight: "Flashcards",
      subtitle:
        "Transform any text content into interactive flashcards instantly with AI. Study smarter, remember longer.",
      toolType: "flashcard",
      defaultInputType: "text",
      keyBenefits: ["AI-Powered", "Instant Generation", "Smart Learning"],
    },
    steps: [
      {
        number: "01",
        title: "Paste Text",
        description:
          "Simply paste your text content into our form. No sign-up required to get started.",
      },
      {
        number: "02",
        title: "AI Processing",
        description:
          "Our AI analyzes the text content, extracts key information, and identifies important concepts to create flashcards.",
      },
      {
        number: "03",
        title: "Get Your Flashcards",
        description:
          "Receive your personalized flashcards instantly. Review them, study at your own pace, and track your progress.",
      },
    ],
    howItWorksDescription:
      "Creating flashcards from text content has never been easier. Get started in three simple steps.",
    features: [
      {
        icon: Brain,
        title: "AI-Powered Generation",
        description:
          "Our advanced AI analyzes text content and automatically creates comprehensive flashcards covering key concepts, definitions, and important points.",
      },
      {
        icon: Zap,
        title: "Lightning Fast",
        description:
          "Get your flashcards ready in seconds. No manual work required - just paste your text and let AI do the heavy lifting.",
      },
      {
        icon: Sparkles,
        title: "Smart & Interactive",
        description:
          "Each flashcard is intelligently designed with questions and answers that help reinforce your understanding and improve memory retention.",
      },
      {
        icon: Clock,
        title: "Study Anytime, Anywhere",
        description:
          "Access your flashcards on any device. Review them during your commute, breaks, or study sessions for maximum learning efficiency.",
      },
    ],
    benefits: {
      title: "Get Things Very Fast",
      description:
        "Our AI-powered system processes text and generates flashcards in seconds, not hours. Spend more time studying, less time creating.",
      items: [
        {
          title: "AI Included",
          description:
            "Advanced artificial intelligence analyzes text content and extracts the most important information automatically.",
        },
        {
          title: "Instant Results",
          description:
            "No waiting around. Get your flashcards ready in seconds and start studying immediately.",
        },
        {
          title: "Comprehensive Coverage",
          description:
            "Every important concept, definition, and key point from the text is captured in your flashcards.",
        },
        {
          title: "Enhanced Retention",
          description:
            "Scientifically-backed flashcard methods help you remember information longer and more effectively.",
        },
      ],
    },
  },
  "pdf-to-mindmaps": {
    slug: "pdf-to-mindmaps",
    metadata: {
      title: "PDF to Mindmaps in 30 Seconds - Free AI Study Tool",
      description:
        "Turn PDF documents into visual mindmaps automatically. Free AI tool for students. Just upload your PDF. Visualize concepts and relationships easily.",
      keywords: [
        "pdf to mindmaps",
        "document to mindmaps",
        "convert pdf to mindmaps",
        "ai mindmap maker",
        "pdf mindmap generator",
        "mindmaps from pdf",
        "pdf study tool",
        "visual mindmaps",
        "smriti ai",
        "ai study tool",
        "free online tool",
        "student helper",
        "exam prep",
        "study aid",
        "learning assistant",
        "AI mindmaps",
        "interactive mindmaps",
        "concept mapping",
        "visual learning",
      ],
      url: "https://www.smriti.live/pdf-to-mindmaps",
    },
    hero: {
      title: "PDF to",
      titleHighlight: "Mindmaps",
      subtitle:
        "Transform any PDF document into visual mindmaps instantly with AI. Visualize concepts, understand relationships, and learn more effectively.",
      toolType: "mindmap",
      defaultInputType: "pdf",
      keyBenefits: ["AI-Powered", "Instant Generation", "Visual Learning"],
    },
    steps: [
      {
        number: "01",
        title: "Upload PDF",
        description:
          "Simply upload your PDF document. No sign-up required to get started.",
      },
      {
        number: "02",
        title: "AI Processing",
        description:
          "Our AI analyzes the PDF content, identifies key concepts, relationships, and hierarchies to create a structured mindmap.",
      },
      {
        number: "03",
        title: "Get Your Mindmap",
        description:
          "Receive your personalized mindmap instantly. Explore concepts visually, understand relationships, and enhance your learning experience.",
      },
    ],
    howItWorksDescription:
      "Creating mindmaps from PDF documents has never been easier. Get started in three simple steps.",
    features: [
      {
        icon: Brain,
        title: "AI-Powered Generation",
        description:
          "Our advanced AI analyzes PDF content and automatically creates comprehensive mindmaps with interconnected concepts, relationships, and key topics.",
      },
      {
        icon: Zap,
        title: "Lightning Fast",
        description:
          "Get your mindmap ready in seconds. No manual work required - just upload your PDF and let AI create a visual representation instantly.",
      },
      {
        icon: Network,
        title: "Visual Learning",
        description:
          "Transform complex information into easy-to-understand visual diagrams. See connections between concepts and understand relationships at a glance.",
      },
      {
        icon: GitBranch,
        title: "Interactive & Editable",
        description:
          "Explore your mindmap interactively, expand branches, and customize the layout. Export and share your mindmaps for collaborative learning.",
      },
    ],
    benefits: {
      title: "Get Things Very Fast",
      description:
        "Our AI-powered system processes PDFs and generates mindmaps in seconds, not hours. Spend more time learning, less time creating.",
      items: [
        {
          title: "AI Included",
          description:
            "Advanced artificial intelligence analyzes PDF content and automatically structures concepts into hierarchical mindmaps.",
        },
        {
          title: "Instant Results",
          description:
            "No waiting around. Get your mindmap ready in seconds and start visualizing concepts immediately.",
        },
        {
          title: "Visual Understanding",
          description:
            "See how concepts connect and relate to each other. Visual learning helps you understand and remember information more effectively.",
        },
        {
          title: "Comprehensive Structure",
          description:
            "Every important concept, subtopic, and relationship from the PDF is captured and organized in your mindmap.",
        },
      ],
    },
    extraSection: {
      title: "Visual Learning",
      titleHighlight: "Benefits",
      description:
        "Mindmaps help you understand complex topics by visualizing relationships and connections between concepts.",
      items: [
        {
          icon: Eye,
          title: "Better Comprehension",
          description:
            "Visual representation helps you understand complex topics faster and see the big picture at a glance.",
        },
        {
          icon: Network,
          title: "See Connections",
          description:
            "Understand how different concepts relate to each other and identify patterns in the information.",
        },
        {
          icon: Sparkles,
          title: "Enhanced Memory",
          description:
            "Visual learning improves memory retention and makes it easier to recall information when you need it.",
        },
      ],
    },
  },
  "youtube-to-mindmaps": {
    slug: "youtube-to-mindmaps",
    metadata: {
      title: "YouTube to Mindmaps in 30 Seconds - Free AI Study Tool",
      description:
        "Turn YouTube lectures into visual mindmaps automatically. Free AI tool for students. Just paste the video URL. Visualize concepts and relationships easily.",
      keywords: [
        "youtube to mindmaps",
        "video to mindmaps",
        "lecture to mindmaps",
        "convert youtube to mindmaps",
        "ai mindmap maker",
        "youtube mindmap generator",
        "mindmaps from video",
        "video study tool",
        "visual mindmaps",
        "smriti ai",
        "ai study tool",
        "free online tool",
        "student helper",
        "exam prep",
        "study aid",
        "learning assistant",
        "AI mindmaps",
        "interactive mindmaps",
        "concept mapping",
        "visual learning",
      ],
      url: "https://www.smriti.live/youtube-to-mindmaps",
    },
    hero: {
      title: "YouTube Video to",
      titleHighlight: "Mindmaps",
      subtitle:
        "Transform any YouTube educational video into visual mindmaps instantly with AI. Visualize concepts, understand relationships, and learn more effectively.",
      toolType: "mindmap",
      defaultInputType: "youtube",
      keyBenefits: ["AI-Powered", "Instant Generation", "Visual Learning"],
    },
    steps: [
      {
        number: "01",
        title: "Paste YouTube URL",
        description:
          "Simply copy and paste your YouTube video link into our form. No sign-up required to get started.",
      },
      {
        number: "02",
        title: "AI Processing",
        description:
          "Our AI analyzes the video content, identifies key concepts, relationships, and hierarchies to create a structured mindmap.",
      },
      {
        number: "03",
        title: "Get Your Mindmap",
        description:
          "Receive your personalized mindmap instantly. Explore concepts visually, understand relationships, and enhance your learning experience.",
      },
    ],
    howItWorksDescription:
      "Creating mindmaps from YouTube videos has never been easier. Get started in three simple steps.",
    features: [
      {
        icon: Brain,
        title: "AI-Powered Generation",
        description:
          "Our advanced AI analyzes video content and automatically creates comprehensive mindmaps with interconnected concepts, relationships, and key topics.",
      },
      {
        icon: Zap,
        title: "Lightning Fast",
        description:
          "Get your mindmap ready in seconds. No manual work required - just paste your YouTube URL and let AI create a visual representation instantly.",
      },
      {
        icon: Network,
        title: "Visual Learning",
        description:
          "Transform complex information into easy-to-understand visual diagrams. See connections between concepts and understand relationships at a glance.",
      },
      {
        icon: GitBranch,
        title: "Interactive & Editable",
        description:
          "Explore your mindmap interactively, expand branches, and customize the layout. Export and share your mindmaps for collaborative learning.",
      },
    ],
    benefits: {
      title: "Get Things Very Fast",
      description:
        "Our AI-powered system processes videos and generates mindmaps in seconds, not hours. Spend more time learning, less time creating.",
      items: [
        {
          title: "AI Included",
          description:
            "Advanced artificial intelligence analyzes video content and automatically structures concepts into hierarchical mindmaps.",
        },
        {
          title: "Instant Results",
          description:
            "No waiting around. Get your mindmap ready in seconds and start visualizing concepts immediately.",
        },
        {
          title: "Visual Understanding",
          description:
            "See how concepts connect and relate to each other. Visual learning helps you understand and remember information more effectively.",
        },
        {
          title: "Comprehensive Structure",
          description:
            "Every important concept, subtopic, and relationship from the video is captured and organized in your mindmap.",
        },
      ],
    },
    extraSection: {
      title: "Visual Learning",
      titleHighlight: "Benefits",
      description:
        "Mindmaps help you understand complex topics by visualizing relationships and connections between concepts.",
      items: [
        {
          icon: Eye,
          title: "Better Comprehension",
          description:
            "Visual representation helps you understand complex topics faster and see the big picture at a glance.",
        },
        {
          icon: Network,
          title: "See Connections",
          description:
            "Understand how different concepts relate to each other and identify patterns in the information.",
        },
        {
          icon: Sparkles,
          title: "Enhanced Memory",
          description:
            "Visual learning improves memory retention and makes it easier to recall information when you need it.",
        },
      ],
    },
  },
  "text-to-mindmaps": {
    slug: "text-to-mindmaps",
    metadata: {
      title: "Text to Mindmaps in 30 Seconds - Free AI Study Tool",
      description:
        "Turn text content into visual mindmaps automatically. Free AI tool for students. Just paste your text. Visualize concepts and relationships easily.",
      keywords: [
        "text to mindmaps",
        "content to mindmaps",
        "convert text to mindmaps",
        "ai mindmap maker",
        "text mindmap generator",
        "mindmaps from text",
        "text study tool",
        "visual mindmaps",
        "smriti ai",
        "ai study tool",
        "free online tool",
        "student helper",
        "exam prep",
        "study aid",
        "learning assistant",
        "AI mindmaps",
        "interactive mindmaps",
        "concept mapping",
        "visual learning",
      ],
      url: "https://www.smriti.live/text-to-mindmaps",
    },
    hero: {
      title: "Text to",
      titleHighlight: "Mindmaps",
      subtitle:
        "Transform any text content into visual mindmaps instantly with AI. Visualize concepts, understand relationships, and learn more effectively.",
      toolType: "mindmap",
      defaultInputType: "text",
      keyBenefits: ["AI-Powered", "Instant Generation", "Visual Learning"],
    },
    steps: [
      {
        number: "01",
        title: "Paste Text",
        description:
          "Simply paste your text content into our form. No sign-up required to get started.",
      },
      {
        number: "02",
        title: "AI Processing",
        description:
          "Our AI analyzes the text content, identifies key concepts, relationships, and hierarchies to create a structured mindmap.",
      },
      {
        number: "03",
        title: "Get Your Mindmap",
        description:
          "Receive your personalized mindmap instantly. Explore concepts visually, understand relationships, and enhance your learning experience.",
      },
    ],
    howItWorksDescription:
      "Creating mindmaps from text content has never been easier. Get started in three simple steps.",
    features: [
      {
        icon: Brain,
        title: "AI-Powered Generation",
        description:
          "Our advanced AI analyzes text content and automatically creates comprehensive mindmaps with interconnected concepts, relationships, and key topics.",
      },
      {
        icon: Zap,
        title: "Lightning Fast",
        description:
          "Get your mindmap ready in seconds. No manual work required - just paste your text and let AI create a visual representation instantly.",
      },
      {
        icon: Network,
        title: "Visual Learning",
        description:
          "Transform complex information into easy-to-understand visual diagrams. See connections between concepts and understand relationships at a glance.",
      },
      {
        icon: GitBranch,
        title: "Interactive & Editable",
        description:
          "Explore your mindmap interactively, expand branches, and customize the layout. Export and share your mindmaps for collaborative learning.",
      },
    ],
    benefits: {
      title: "Get Things Very Fast",
      description:
        "Our AI-powered system processes text and generates mindmaps in seconds, not hours. Spend more time learning, less time creating.",
      items: [
        {
          title: "AI Included",
          description:
            "Advanced artificial intelligence analyzes text content and automatically structures concepts into hierarchical mindmaps.",
        },
        {
          title: "Instant Results",
          description:
            "No waiting around. Get your mindmap ready in seconds and start visualizing concepts immediately.",
        },
        {
          title: "Visual Understanding",
          description:
            "See how concepts connect and relate to each other. Visual learning helps you understand and remember information more effectively.",
        },
        {
          title: "Comprehensive Structure",
          description:
            "Every important concept, subtopic, and relationship from the text is captured and organized in your mindmap.",
        },
      ],
    },
    extraSection: {
      title: "Visual Learning",
      titleHighlight: "Benefits",
      description:
        "Mindmaps help you understand complex topics by visualizing relationships and connections between concepts.",
      items: [
        {
          icon: Eye,
          title: "Better Comprehension",
          description:
            "Visual representation helps you understand complex topics faster and see the big picture at a glance.",
        },
        {
          icon: Network,
          title: "See Connections",
          description:
            "Understand how different concepts relate to each other and identify patterns in the information.",
        },
        {
          icon: Sparkles,
          title: "Enhanced Memory",
          description:
            "Visual learning improves memory retention and makes it easier to recall information when you need it.",
        },
      ],
    },
  },
  "pdf-to-quiz": {
    slug: "pdf-to-quiz",
    metadata: {
      title: "PDF to Quiz in 30 Seconds - Free AI Study Tool",
      description:
        "Turn PDF documents into interactive quizzes automatically. Free AI tool for students. Just upload your PDF. Test your knowledge and track your performance.",
      keywords: [
        "pdf to quiz",
        "document to quiz",
        "convert pdf to quiz",
        "ai quiz maker",
        "pdf quiz generator",
        "quizzes from pdf",
        "pdf study tool",
        "online quiz",
        "smriti ai",
        "ai study tool",
        "free online tool",
        "student helper",
        "exam prep",
        "study aid",
        "learning assistant",
        "AI quizzes",
        "interactive quizzes",
        "educational quizzes",
        "quiz performance tracking",
      ],
      url: "https://www.smriti.live/pdf-to-quiz",
    },
    hero: {
      title: "PDF to",
      titleHighlight: "Quiz",
      subtitle:
        "Transform any PDF document into interactive quizzes instantly with AI. Test your knowledge and track your performance.",
      toolType: "quiz",
      defaultInputType: "pdf",
      keyBenefits: ["AI-Powered", "Instant Generation", "Score Tracking"],
    },
    steps: [
      {
        number: "01",
        title: "Upload PDF",
        description:
          "Simply upload your PDF document. No sign-up required to get started.",
      },
      {
        number: "02",
        title: "AI Processing",
        description:
          "Our AI analyzes the PDF content, identifies key concepts, and generates relevant quiz questions automatically.",
      },
      {
        number: "03",
        title: "Take Quiz & Track Progress",
        description:
          "Answer questions, get instant feedback, and track your scores. Monitor your improvement over time with detailed analytics.",
      },
    ],
    howItWorksDescription:
      "Creating quizzes from PDF documents has never been easier. Get started in three simple steps.",
    features: [
      {
        icon: Brain,
        title: "AI-Powered Questions",
        description:
          "Our advanced AI analyzes PDF content and generates comprehensive quiz questions covering all important concepts and topics.",
      },
      {
        icon: Zap,
        title: "Lightning Fast",
        description:
          "Get your quiz ready in seconds. No manual work required - just upload your PDF and let AI create questions instantly.",
      },
      {
        icon: Target,
        title: "Performance Tracking",
        description:
          "Track your quiz scores and monitor your progress over time. Identify weak areas and focus your study efforts effectively.",
      },
      {
        icon: BarChart3,
        title: "Detailed Analytics",
        description:
          "Get insights into your performance with detailed analytics. See which topics you've mastered and which need more practice.",
      },
    ],
    benefits: {
      title: "Get Things Very Fast",
      description:
        "Our AI-powered system processes PDFs and generates quizzes in seconds, not hours. Spend more time learning, less time creating.",
      items: [
        {
          title: "AI Included",
          description:
            "Advanced artificial intelligence analyzes PDF content and generates relevant quiz questions automatically.",
        },
        {
          title: "Instant Results",
          description:
            "No waiting around. Get your quiz ready in seconds and start testing your knowledge immediately.",
        },
        {
          title: "Track Quiz Scores",
          description:
            "Monitor your performance with detailed score tracking. See your improvement over time and identify areas that need more practice.",
        },
        {
          title: "Performance Insights",
          description:
            "Get detailed analytics on your quiz performance to help you track your progress and optimize your learning strategy.",
        },
      ],
    },
    extraSection: {
      title: "Track Your",
      titleHighlight: "Performance",
      description:
        "Our quiz system helps you monitor your learning progress and identify areas for improvement.",
      items: [
        {
          icon: TrendingUp,
          title: "Score History",
          description:
            "View your quiz scores over time and track your improvement journey.",
        },
        {
          icon: Target,
          title: "Weak Areas",
          description:
            "Identify topics where you need more practice and focus your study efforts.",
        },
        {
          icon: BarChart3,
          title: "Detailed Analytics",
          description:
            "Get comprehensive insights into your performance with detailed analytics and reports.",
        },
      ],
    },
  },
  "youtube-to-quiz": {
    slug: "youtube-to-quiz",
    metadata: {
      title: "YouTube to Quiz in 30 Seconds - Free AI Study Tool",
      description:
        "Turn YouTube lectures into interactive quizzes automatically. Free AI tool for students. Just paste the video URL. Test your knowledge and track your performance.",
      keywords: [
        "youtube to quiz",
        "video to quiz",
        "lecture to quiz",
        "convert youtube to quiz",
        "ai quiz maker",
        "youtube quiz generator",
        "quizzes from video",
        "video study tool",
        "online quiz",
        "smriti ai",
        "ai study tool",
        "free online tool",
        "student helper",
        "exam prep",
        "study aid",
        "learning assistant",
        "AI quizzes",
        "interactive quizzes",
        "educational quizzes",
        "quiz performance tracking",
      ],
      url: "https://www.smriti.live/youtube-to-quiz",
    },
    hero: {
      title: "YouTube Video to",
      titleHighlight: "Quiz",
      subtitle:
        "Transform any YouTube educational video into interactive quizzes instantly with AI. Test your knowledge and track your performance.",
      toolType: "quiz",
      defaultInputType: "youtube",
      keyBenefits: ["AI-Powered", "Instant Generation", "Score Tracking"],
    },
    steps: [
      {
        number: "01",
        title: "Paste YouTube URL",
        description:
          "Simply copy and paste your YouTube video link into our form. No sign-up required to get started.",
      },
      {
        number: "02",
        title: "AI Processing",
        description:
          "Our AI analyzes the video content, identifies key concepts, and generates relevant quiz questions automatically.",
      },
      {
        number: "03",
        title: "Take Quiz & Track Progress",
        description:
          "Answer questions, get instant feedback, and track your scores. Monitor your improvement over time with detailed analytics.",
      },
    ],
    howItWorksDescription:
      "Creating quizzes from YouTube videos has never been easier. Get started in three simple steps.",
    features: [
      {
        icon: Brain,
        title: "AI-Powered Questions",
        description:
          "Our advanced AI analyzes video content and generates comprehensive quiz questions covering all important concepts and topics.",
      },
      {
        icon: Zap,
        title: "Lightning Fast",
        description:
          "Get your quiz ready in seconds. No manual work required - just paste your YouTube URL and let AI create questions instantly.",
      },
      {
        icon: Target,
        title: "Performance Tracking",
        description:
          "Track your quiz scores and monitor your progress over time. Identify weak areas and focus your study efforts effectively.",
      },
      {
        icon: BarChart3,
        title: "Detailed Analytics",
        description:
          "Get insights into your performance with detailed analytics. See which topics you've mastered and which need more practice.",
      },
    ],
    benefits: {
      title: "Get Things Very Fast",
      description:
        "Our AI-powered system processes videos and generates quizzes in seconds, not hours. Spend more time learning, less time creating.",
      items: [
        {
          title: "AI Included",
          description:
            "Advanced artificial intelligence analyzes video content and generates relevant quiz questions automatically.",
        },
        {
          title: "Instant Results",
          description:
            "No waiting around. Get your quiz ready in seconds and start testing your knowledge immediately.",
        },
        {
          title: "Track Quiz Scores",
          description:
            "Monitor your performance with detailed score tracking. See your improvement over time and identify areas that need more practice.",
        },
        {
          title: "Performance Insights",
          description:
            "Get detailed analytics on your quiz performance to help you track your progress and optimize your learning strategy.",
        },
      ],
    },
    extraSection: {
      title: "Track Your",
      titleHighlight: "Performance",
      description:
        "Our quiz system helps you monitor your learning progress and identify areas for improvement.",
      items: [
        {
          icon: TrendingUp,
          title: "Score History",
          description:
            "View your quiz scores over time and track your improvement journey.",
        },
        {
          icon: Target,
          title: "Weak Areas",
          description:
            "Identify topics where you need more practice and focus your study efforts.",
        },
        {
          icon: BarChart3,
          title: "Detailed Analytics",
          description:
            "Get comprehensive insights into your performance with detailed analytics and reports.",
        },
      ],
    },
  },
  "text-to-quiz": {
    slug: "text-to-quiz",
    metadata: {
      title: "Text to Quiz in 30 Seconds - Free AI Study Tool",
      description:
        "Turn text content into interactive quizzes automatically. Free AI tool for students. Just paste your text. Test your knowledge and track your performance.",
      keywords: [
        "text to quiz",
        "content to quiz",
        "convert text to quiz",
        "ai quiz maker",
        "text quiz generator",
        "quizzes from text",
        "text study tool",
        "online quiz",
        "smriti ai",
        "ai study tool",
        "free online tool",
        "student helper",
        "exam prep",
        "study aid",
        "learning assistant",
        "AI quizzes",
        "interactive quizzes",
        "educational quizzes",
        "quiz performance tracking",
      ],
      url: "https://www.smriti.live/text-to-quiz",
    },
    hero: {
      title: "Text to",
      titleHighlight: "Quiz",
      subtitle:
        "Transform any text content into interactive quizzes instantly with AI. Test your knowledge and track your performance.",
      toolType: "quiz",
      defaultInputType: "text",
      keyBenefits: ["AI-Powered", "Instant Generation", "Score Tracking"],
    },
    steps: [
      {
        number: "01",
        title: "Paste Text",
        description:
          "Simply paste your text content into our form. No sign-up required to get started.",
      },
      {
        number: "02",
        title: "AI Processing",
        description:
          "Our AI analyzes the text content, identifies key concepts, and generates relevant quiz questions automatically.",
      },
      {
        number: "03",
        title: "Take Quiz & Track Progress",
        description:
          "Answer questions, get instant feedback, and track your scores. Monitor your improvement over time with detailed analytics.",
      },
    ],
    howItWorksDescription:
      "Creating quizzes from text content has never been easier. Get started in three simple steps.",
    features: [
      {
        icon: Brain,
        title: "AI-Powered Questions",
        description:
          "Our advanced AI analyzes text content and generates comprehensive quiz questions covering all important concepts and topics.",
      },
      {
        icon: Zap,
        title: "Lightning Fast",
        description:
          "Get your quiz ready in seconds. No manual work required - just paste your text and let AI create questions instantly.",
      },
      {
        icon: Target,
        title: "Performance Tracking",
        description:
          "Track your quiz scores and monitor your progress over time. Identify weak areas and focus your study efforts effectively.",
      },
      {
        icon: BarChart3,
        title: "Detailed Analytics",
        description:
          "Get insights into your performance with detailed analytics. See which topics you've mastered and which need more practice.",
      },
    ],
    benefits: {
      title: "Get Things Very Fast",
      description:
        "Our AI-powered system processes text and generates quizzes in seconds, not hours. Spend more time learning, less time creating.",
      items: [
        {
          title: "AI Included",
          description:
            "Advanced artificial intelligence analyzes text content and generates relevant quiz questions automatically.",
        },
        {
          title: "Instant Results",
          description:
            "No waiting around. Get your quiz ready in seconds and start testing your knowledge immediately.",
        },
        {
          title: "Track Quiz Scores",
          description:
            "Monitor your performance with detailed score tracking. See your improvement over time and identify areas that need more practice.",
        },
        {
          title: "Performance Insights",
          description:
            "Get detailed analytics on your quiz performance to help you track your progress and optimize your learning strategy.",
        },
      ],
    },
    extraSection: {
      title: "Track Your",
      titleHighlight: "Performance",
      description:
        "Our quiz system helps you monitor your learning progress and identify areas for improvement.",
      items: [
        {
          icon: TrendingUp,
          title: "Score History",
          description:
            "View your quiz scores over time and track your improvement journey.",
        },
        {
          icon: Target,
          title: "Weak Areas",
          description:
            "Identify topics where you need more practice and focus your study efforts.",
        },
        {
          icon: BarChart3,
          title: "Detailed Analytics",
          description:
            "Get comprehensive insights into your performance with detailed analytics and reports.",
        },
      ],
    },
  },
};
