"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import {
  ArrowLeft,
  FileText,
  Video,
  BookOpen,
  ClipboardList,
  GraduationCap,
  ExternalLink,
  Play,
  Layers,
  Share2,
  Check,
} from "lucide-react";
import { departmentData, type Department, type Subject } from "@/lib/department-data";
import { cn } from "@/lib/utils";
import React, { Suspense, memo, useState, useEffect } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import Navigation from "@/components/navigation";
import AdBanner from "@/components/AdBanner";

interface Props {
  params: Promise<{ department: string; level: string; subject: string }>;
}

interface SectionType {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  iconColor: string;
  content: string | string[] | boolean | null | undefined;
  description: string;
  buttonText: string;
  redirectToDrive: boolean;
}

const fadeUpVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
  },
};

const tabVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
  },
};

export default function SubjectPage({ params }: Props) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading subject...</div>}>
        <SubjectContent params={params} />
      </Suspense>
    </ErrorBoundary>
  );
}

// Memoized tab button component for better performance
const TabButton = memo(({ section, currentTab, onTabChange }: { 
  section: SectionType; 
  currentTab: string;
  onTabChange: (tab: string) => void;
}) => {
  const IconComponent = section.icon;
  const isActive = currentTab === section.id;
  
  return (
    <button
      onClick={() => onTabChange(section.id)}
      className={cn(
        "flex-1 flex items-center justify-center gap-2 h-full px-2 py-2 transition-colors",
        isActive 
          ? "bg-white/[0.1] text-white" 
          : "text-white/60 hover:text-white hover:bg-white/[0.05]"
      )}
    >
      <IconComponent className="w-4 h-4 flex-shrink-0" />
      <span className="hidden sm:inline truncate text-xs">{section.title}</span>
    </button>
  );
});

TabButton.displayName = "TabButton";

// Memoized copy link button
const CopyLinkButton = memo(({ tabId }: { tabId: string }) => {
  const [copied, setCopied] = useState(false);

  const copyTabLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?tab=${tabId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      onClick={copyTabLink}
      variant="ghost"
      size="sm"
      className="text-white/60 hover:text-white hover:bg-white/[0.05] border border-white/[0.08]"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          Copied!
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4 mr-2" />
          Share Tab Link
        </>
      )}
    </Button>
  );
});

CopyLinkButton.displayName = "CopyLinkButton";

// Client-side tabs wrapper component
function TabsWrapper({ 
  sections, 
  subject, 
  resolvedParams 
}: { 
  sections: SectionType[]; 
  subject: Subject; 
  resolvedParams: { department: string; level: string; subject: string };
}) {
  const [currentTab, setCurrentTab] = useState("lectures");
  const [mounted, setMounted] = useState(false);

  // Get tab from URL on mount
  useEffect(() => {
    setMounted(true);
    const searchParams = new URLSearchParams(window.location.search);
    const tabParam = searchParams.get("tab");
    if (tabParam && sections.some(s => s.id === tabParam)) {
      setCurrentTab(tabParam);
    }
  }, [sections]);

  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId);
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tabId);
    window.history.pushState({}, "", url);
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="flex w-full mb-8 bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm h-12">
        {sections.map((section) => (
          <TabButton 
            key={section.id} 
            section={section} 
            currentTab={currentTab}
            onTabChange={handleTabChange}
          />
        ))}
      </TabsList>

      {sections.map((section, index) => {
        const IconComponent = section.icon;
        return (
          <TabsContent key={section.id} value={section.id}>
            <motion.div
              custom={index}
              variants={tabVariants}
              initial="hidden"
              animate="visible"
            >
              <Card className="bg-white/[0.02] border-white/[0.08] backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-white">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                          "w-12 h-12 rounded-lg flex items-center justify-center",
                          "bg-gradient-to-r to-transparent border border-white/[0.15]",
                          "backdrop-blur-sm shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
                          section.color
                        )}
                      >
                        <IconComponent
                          className={cn("w-6 h-6", section.iconColor)}
                        />
                      </motion.div>
                      {section.title}
                    </CardTitle>
                    <CopyLinkButton tabId={section.id} />
                  </div>
                </CardHeader>
                <CardContent>
                  <TabContentRenderer 
                    section={section}
                    subject={subject}
                    resolvedParams={resolvedParams}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

// Memoized content renderer for better performance
const TabContentRenderer = memo(({ 
  section, 
  subject, 
  resolvedParams 
}: { 
  section: SectionType; 
  subject: Subject; 
  resolvedParams: { department: string; level: string; subject: string };
}) => {
  // Function to extract drive ID from Google Drive URL
  const extractDriveId = (url: string): string => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes("drive.google.com")) {
        if (urlObj.pathname.includes("/file/d/")) {
          const match = url.match(/\/file\/d\/([^\/]+)/);
          return match ? match[1] : url;
        } else if (urlObj.pathname.includes("/folders/")) {
          const match = url.match(/\/folders\/([^\/\?]+)/);
          return match ? match[1] : url;
        } else if (urlObj.searchParams.has("id")) {
          return urlObj.searchParams.get("id") || url;
        }
      }
      return url;
    } catch {
      return url;
    }
  };

  // Function to extract playlist ID from YouTube URL
  const extractPlaylistId = (url: string): string => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes("youtube.com") || urlObj.hostname.includes("youtu.be")) {
        if (urlObj.pathname.includes("/playlist")) {
          return urlObj.searchParams.get("list") || "";
        } else if (urlObj.pathname.includes("/watch")) {
          return urlObj.searchParams.get("list") || "";
        }
      }
      return "";
    } catch {
      return "";
    }
  };

  const IconComponent = section.icon;

  if (!section.content) {
    return (
      <div className="text-center py-12">
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className={cn(
            "w-16 h-16 rounded-lg mx-auto mb-4 flex items-center justify-center",
            "bg-gradient-to-r to-transparent border border-white/[0.15]",
            "backdrop-blur-sm",
            section.color
          )}
        >
          <IconComponent
            className={cn("w-8 h-8", section.iconColor)}
          />
        </motion.div>
        <p className="text-white/50 mb-4 leading-relaxed">
          {section.description}.
        </p>
        <p className="text-sm text-white/30">
          This section is currently being prepared and will be available soon.
        </p>
      </div>
    );
  }

  if (section.id === "quizzes") {
    return (
      <div className="space-y-4">
        <p className="text-white/60 mb-4 leading-relaxed">
          {section.description} for {subject.name}.
        </p>
        <div className="grid gap-4">
          {subject.materials.quizzes?.map((quiz, idx: number) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 bg-white/[0.05] rounded-lg border border-white/[0.1] hover:bg-white/[0.08] transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-semibold mb-1">
                    {quiz.name}
                  </h4>
                  <div className="flex gap-4 text-sm text-white/60">
                    <span>{quiz.code}</span>
                    <span>{quiz.duration}</span>
                    <span>{quiz.questions} Q-tion</span>
                  </div>
                </div>
                <Button
                  asChild
                  className="bg-white/[0.05] border border-white/[0.1] text-white hover:bg-white/[0.1] backdrop-blur-sm"
                >
                  <Link
                    href={`/quiz/${resolvedParams.department}/${resolvedParams.subject}/${quiz.id}`}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Quiz
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (section.redirectToDrive) {
    return (
      <div className="space-y-4">
        <p className="text-white/60 mb-4 leading-relaxed">
          {section.description} for {subject.name}.
        </p>
        <Button
          asChild
          className="w-full bg-white/[0.05] border border-white/[0.1] text-white hover:bg-white/[0.1] backdrop-blur-sm"
        >
          <Link
            href={`/drive/${extractDriveId(
              typeof section.content === 'string' ? section.content : ''
            )}`}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            {section.buttonText}
          </Link>
        </Button>
      </div>
    );
  }

  // Videos section
  return (
    <div className="space-y-4">
      <p className="text-white/60 mb-4 leading-relaxed">
        {section.description} for {subject.name}.
      </p>
      {(() => {
        const videoContent = section.content;
        if (Array.isArray(videoContent)) {
          return (
            <div className="grid gap-3">
              {videoContent.map((videoUrl, idx) => {
                const url = typeof videoUrl === 'string' ? videoUrl : '';
                const playlistId = extractPlaylistId(url);
                return (
                  <Button
                    key={idx}
                    asChild
                    className="w-full bg-white/[0.05] border border-white/[0.1] text-white hover:bg-white/[0.1] backdrop-blur-sm"
                  >
                    <Link
                      href={playlistId ? `/youtube/${playlistId}` : '#'}
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {videoContent.length > 1 ? `Video Playlist ${idx + 1}` : section.buttonText}
                    </Link>
                  </Button>
                );
              })}
            </div>
          );
        } else {
          const videoUrl = typeof videoContent === 'string' ? videoContent : '';
          const playlistId = extractPlaylistId(videoUrl);
          return (
            <Button
              asChild
              className="w-full bg-white/[0.05] border border-white/[0.1] text-white hover:bg-white/[0.1] backdrop-blur-sm"
            >
              <Link
                href={playlistId ? `/youtube/${playlistId}` : '#'}
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {section.buttonText}
              </Link>
            </Button>
          );
        }
      })()}
    </div>
  );
});

TabContentRenderer.displayName = "TabContentRenderer";

async function SubjectContent({ params }: Props) {
  const resolvedParams = await params;
  const dept = departmentData[resolvedParams.department];
  const levelNum = Number.parseInt(resolvedParams.level);

  if (!dept || !dept.levels[levelNum]) {
    notFound();
  }

  const level = dept.levels[levelNum];
  const subject = [...level.subjects.term1, ...level.subjects.term2].find(
    (s) => s.id === resolvedParams.subject
  );

  if (!subject) {
    notFound();
  }

  const yearSuffix =
    levelNum === 1
      ? "st"
      : levelNum === 2
      ? "nd"
      : levelNum === 3
      ? "rd"
      : "th";

  // Function to find prerequisite subjects
  const getPrerequisiteSubjects = () => {
    if (!subject.prerequisites || subject.prerequisites.length === 0) {
      return null;
    }

    const allSubjects: Subject[] = [];
    for (const level of Object.values(dept.levels)) {
      allSubjects.push(...level.subjects.term1, ...level.subjects.term2);
    }

    return subject.prerequisites
      .map((prereqId) => {
        return allSubjects.find((s) => s.id === prereqId);
      })
      .filter((prereq): prereq is Subject => prereq !== undefined); // Remove any undefined values
  };

  const prerequisiteSubjects = getPrerequisiteSubjects();

  const sections = [
    {
      id: "lectures",
      title: "Lectures",
      icon: BookOpen,
      color: "from-blue-500/[0.15]",
      iconColor: "text-blue-400",
      content: subject.materials.lectures,
      description: "Access comprehensive lecture materials and notes",
      buttonText: "Open Lecture Materials",
      redirectToDrive: true,
    },
    {
      id: "sections",
      title: "Sections",
      icon: FileText,
      color: "from-green-500/[0.15]",
      iconColor: "text-green-400",
      content: subject.materials.sections,
      description: "Practice problems, worksheets, and section materials",
      buttonText: "Open Section Materials",
      redirectToDrive: true,
    },
    {
      id: "summaries",
      title: "Summaries",
      icon: ClipboardList,
      color: "from-indigo-500/[0.15]",
      iconColor: "text-indigo-400",
      content: subject.materials.summaries,
      description: "Quick reference guides and summary materials",
      buttonText: "Open Summary Materials",
      redirectToDrive: true,
    },
    {
      id: "videos",
      title: "Videos",
      icon: Video,
      color: "from-purple-500/[0.15]",
      iconColor: "text-purple-400",
      content: subject.materials.videos,
      description: "Watch comprehensive video lectures and tutorials",
      buttonText: "Open Video Playlist",
      redirectToDrive: false, // Videos will open directly in YouTube
    },
    {
      id: "quizzes",
      title: "Quizzes",
      icon: ClipboardList,
      color: "from-orange-500/[0.15]",
      iconColor: "text-orange-400",
      content: (subject.materials.quizzes?.length || 0) > 0 ? true : null,
      description: "Test your knowledge with interactive quizzes",
      buttonText:
        (subject.materials.quizzes?.length || 0) > 0 ? "View Quizzes" : "Coming Soon",
      redirectToDrive: false,
    },
    {
      id: "exams",
      title: "Last Exams",
      icon: GraduationCap,
      color: "from-red-500/[0.15]",
      iconColor: "text-red-400",
      content: subject.materials.exams,
      description: "Previous exam papers and solutions",
      buttonText: subject.materials.exams ? "Open Last Exams" : "Coming Soon",
      redirectToDrive: true,
    },
  ];

  return (
    <div
      className="relative min-h-screen w-full overflow-auto bg-[#030303]"
      style={{
        backgroundImage: "url('/images/Background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />
      <Navigation />

      <div className="relative z-10 py-12 px-4 min-h-screen">
        <div className="max-w-7xl mx-auto pb-20">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -10 }} // Reduced x value from -20 to -10
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }} // Reduced duration from 0.6 to 0.3 and delay from 0.2 to 0.1
            className="mb-8"
          >
            <Link
              href={`/specialization/${resolvedParams.department}/${resolvedParams.level}`}
            >
              <Button
                variant="ghost"
                className="text-white/60 hover:text-white hover:bg-white/[0.05] border border-white/[0.08] backdrop-blur-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {levelNum}
                {yearSuffix} Year
              </Button>
            </Link>
          </motion.div>

          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              custom={0}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                {subject.name}
              </span>
            </motion.h1>

            <motion.p
              custom={1}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="text-lg text-white/60 mb-6 max-w-2xl mx-auto leading-relaxed"
            >
              {subject.description}
            </motion.p>

            <motion.div
              custom={2}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="flex justify-center gap-4 mb-8 flex-wrap"
            >
              <Badge
                variant="outline"
                className="text-lg px-4 py-2 bg-white/[0.03] border-white/[0.1] text-white/70"
                style={{ height: "37px", fontSize: "11px" }}
              >
                {dept.name}
              </Badge>
              <Badge
                variant="outline"
                className="text-lg px-4 py-2 bg-white/[0.03] border-white/[0.1] text-white/70"
                style={{ height: "37px", fontSize: "11px" }}

              >
                {levelNum}
                {yearSuffix} Year
              </Badge>
              <Badge
                variant="outline"
                className="text-lg px-4 py-2 bg-white/[0.03] border-white/[0.1] text-white/70"
                style={{ height: "37px", fontSize: "11px" }}
              >
                {subject.creditHours} Credits
              </Badge>
            </motion.div>
          </div>

          {/* Prerequisites Card */}
          {prerequisiteSubjects && (
            <motion.div
              custom={2.5}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="mb-8"
            >
              <Card className="bg-white/[0.02] border-white/[0.08] backdrop-blur-sm overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-white">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r from-amber-500/[0.15] to-transparent border border-white/[0.15] backdrop-blur-sm shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]"
                    >
                      <Layers className="w-6 h-6 text-amber-400" />
                    </motion.div>
                    Prerequisites
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/60 mb-4">
                    These are the foundational subjects you should complete
                    before studying {subject.name}:
                  </p>
                  <div className="grid gap-3">
                    {prerequisiteSubjects.map((prereq, index) => (
                      <motion.div
                        key={prereq.id}
                        custom={index}
                        variants={tabVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <Link
                          href={`/specialization/${
                            resolvedParams.department
                          }/${findSubjectLevel(dept, prereq.id)}/${prereq.id}`}
                        >
                          <div className="group flex items-center justify-between p-4 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] transition-all cursor-pointer">
                            <div>
                              <h4 className="text-white font-medium mb-1">
                                {prereq.name}
                              </h4>
                              <p className="text-sm text-white/60">
                                {prereq.code}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <span className="text-amber-400 text-sm mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                View Subject
                              </span>
                              <ArrowLeft className="w-4 h-4 text-amber-400 rotate-180" />
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Tabs */}
          <motion.div
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <TabsWrapper 
              sections={sections}
              subject={subject}
              resolvedParams={resolvedParams}
            />
          </motion.div>

          <div className="mt-12">
            <AdBanner dataAdSlot="8021269551" />
          </div>
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />
    </div>
  );
}

// Helper function to find which level a subject belongs to
function findSubjectLevel(dept: Department, subjectId: string): string {
  for (const [levelNum, level] of Object.entries(dept.levels)) {
    const levelData = level;
    const allSubjects = [...levelData.subjects.term1, ...levelData.subjects.term2];
    if (allSubjects.some((s) => s.id === subjectId)) {
      return levelNum;
    }
  }
  return "1"; // Default to first level if not found
}
