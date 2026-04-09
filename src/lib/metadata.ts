import type { Metadata } from "next"

// Base metadata configuration for the entire site
export const siteConfig = {
  name: "Chameleon",
  title: "Chameleon | Future Skills",
  description: "Master your future skills with Chameleon, the ultimate platform for learning and growth with a focus on technology, design, and innovation.",
  url: "https://chameleon-nu.vercel.app", // Updated to the new Vercel domain
  ogImage: "/images/1212.jpg", // Using your existing image as OG image
  icon: "/images/1212-removebg-preview.png",
  creator: "Chameleon Team",
  keywords: [
    "learning platform",
    "future skills",
    "technology",
    "design",
    "innovation",
    "education",
    "online courses",
    "skill development"
  ],
}

// Function to generate metadata for any page
export function generateMetadata({
  title,
  description,
  path = "",
  keywords = [],
  noIndex = false,
}: {
  title?: string
  description?: string
  path?: string
  keywords?: string[]
  noIndex?: boolean
}): Metadata {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title
  const pageDescription = description || siteConfig.description
  const pageKeywords = [...siteConfig.keywords, ...keywords]
  const canonicalUrl = `${siteConfig.url}${path}`

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: pageKeywords.join(", "),
    authors: [{ name: siteConfig.creator }],
    creator: siteConfig.creator,
    publisher: siteConfig.creator,
    
    // Robots configuration
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // Icons
    icons: {
      icon: siteConfig.icon,
      shortcut: siteConfig.icon,
      apple: siteConfig.icon,
    },

    // Open Graph
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonicalUrl,
      title: pageTitle,
      description: pageDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [siteConfig.ogImage],
      creator: `@${siteConfig.creator.replace(" ", "").toLowerCase()}`,
    },

    // Canonical URL
    alternates: {
      canonical: canonicalUrl,
    },

    // Additional metadata
    category: "education",
    classification: "education platform",
    
    // Verification (add your verification codes here)
    verification: {
      google: "", // Add your Google verification code
      yandex: "", // Add your Yandex verification code
      yahoo: "", // Add your Yahoo verification code
    },
  }
}

// Predefined metadata for common pages
export const pageMetadata = {
  home: {
    title: "Future Skills Learning Platform",
    description: "Master your future skills with Chameleon, the ultimate platform for learning and growth with a focus on technology, design, and innovation.",
    keywords: ["homepage", "landing page", "learning platform"],
  },
  
  drive: {
    title: "Google Drive Files",
    description: "Access and manage your Google Drive files with our beautiful and intuitive interface.",
    keywords: ["google drive", "file management", "cloud storage", "files"],
  },
  
  auth: {
    title: "Sign In",
    description: "Sign in to your Chameleon account to access your learning materials and track your progress.",
    keywords: ["login", "sign in", "authentication", "account"],
  },
  
  dashboard: {
    title: "Dashboard",
    description: "Your personal learning dashboard with progress tracking, course management, and skill development tools.",
    keywords: ["dashboard", "progress", "learning", "courses"],
  },
  
  profile: {
    title: "Profile",
    description: "Manage your profile, preferences, and account settings.",
    keywords: ["profile", "account", "settings", "preferences"],
  },
  
  quiz: {
    title: "Quiz",
    description: "Test your knowledge and skills with interactive quizzes designed to enhance your learning experience.",
    keywords: ["quiz", "test", "assessment", "knowledge", "skills"],
  },
  
  courses: {
    title: "Courses",
    description: "Explore our comprehensive collection of courses designed to help you master future skills.",
    keywords: ["courses", "education", "learning", "skills", "training"],
  },
  
  specialization: {
    title: "Specializations",
    description: "Choose your specialization and follow a structured learning path to master specific skills.",
    keywords: ["specialization", "career path", "skills", "expertise"],
  },
  
  about: {
    title: "About Us",
    description: "Learn about Chameleon's mission to help people master future skills and transform their careers.",
    keywords: ["about", "mission", "team", "company"],
  },
  
  privacy: {
    title: "Privacy Policy",
    description: "Learn how we protect your privacy and handle your personal information on the Chameleon platform.",
    keywords: ["privacy", "policy", "data protection", "gdpr"],
    noIndex: true,
  },
  
  terms: {
    title: "Terms of Service",
    description: "Read our terms of service and understand the rules and guidelines for using the Chameleon platform.",
    keywords: ["terms", "service", "legal", "agreement"],
    noIndex: true,
  },
  
  certifications: {
    title: "Certifications",
    description: "Unlock prestigious certifications that showcase your academic achievements and dedication to excellence in computer science and data science education.",
    keywords: ["certifications", "achievements", "badges", "academic excellence", "recognition"],
  },
}
