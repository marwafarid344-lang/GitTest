// [PERF] Optimized: removed cache-busting (no-store + timestamp) from /api/stats/users fetch; marquee reduced from 10 → 6 items
'use client'
import HeroGeometric from "@/components/hero-geometric"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import CountUp from "@/components/CountUp"
import { BookOpen, Shield, Brain, Database, Award, Hospital, Cloud, ServerCrash, BookOpenCheck, ChevronDown, Users, RefreshCw, Sparkles } from "lucide-react"
import CreativeFeatureSlider from "@/components/creative-feature-slider"
import ScrollAnimatedSection from "@/components/scroll-animated-section"
import Navigation from "@/components/navigation"
import MagicSearch from "@/components/magic-search"
import Link from "next/link"
import Image from "next/image"
import { getStudentSession } from "@/lib/auth"
import { useEffect, useState } from "react"
import GsapStackedCards from "@/components/gsap-stacked-cards"
import AnimatedParticles from "@/components/animated-particles"
import { formatTAName } from "@/lib/ta-utils"
import AdBanner from "@/components/AdBanner"

const specializations = [
  {
    id: "computing-data-sciences",
    icon: Cloud,
    title: "Computing and Data Sciences",
    description:
      "Comprehensive foundational courses covering essential academic subjects and critical thinking skills.",
    courses: 45,
    students: "+2k students get enrolled",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  {
    id: "cybersecurity",
    icon: Shield,
    title: "Cyber Security",
    description: "Advanced security protocols, ethical hacking, and digital forensics to protect digital assets.",
    courses: 32,
    students: "+1.8k students get enrolled",
    color: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  {
    id: "artificial-intelligence",
    icon: Brain,
    title: "Artificial Intelligence",
    description: "Machine learning, neural networks, and AI development for the future of technology.",
    courses: 28,
    students: "+2.0k students get enrolled",
    color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
  {
    id: "media-analytics",
    icon: BookOpen,
    title: "Media Analytics",
    description: "Full-stack development, programming languages, and modern software engineering practices.",
    courses: 52,
    students: "+300 students get enrolled",
    color: "bg-green-500/10 text-green-400 border-green-500/20",
  },
  {
    id: "business-analytics",
    icon: Database,
    title: "Business Analytics",
    description: "Management, finance, marketing, and entrepreneurship for modern business growth.",
    courses: 24,
    students: "400+ students get enrolled",
    color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  },
  {
    id: "healthcare-informatics",
    icon: Hospital,
    title: "Healthcare Informatics",
    description: "Global politics, diplomacy, and international affairs for comprehensive understanding.",
    courses: 18,
    students: "+200 students get enrolled",
    color: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  },
]

const staticStats = [
  { icon: BookOpen, label: "Courses Available", value: 200, suffix: "" },
  { icon: ServerCrash , label: "Monthly Visits", value: 5.36, suffix: "M" },
]

interface LevelStat {
  level: number
  count: number
}

interface UserStats {
  totalUsers: number
  levels: LevelStat[]
  timestamp: string
}

export default function HomePage() {
  const [username, setUsername] = useState<string>("")
  const [userLevel, setUserLevel] = useState<number>(1)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [key, setKey] = useState(0) // Force re-render key
  const [quizCount, setQuizCount] = useState<number | null>(null)
  const [solvedQuizzes, setSolvedQuizzes] = useState<number | null>(null)

  useEffect(() => {
    const loadSession = async () => {
      const session = await getStudentSession()
      if (session) {
        setUsername(session.username)
        setUserLevel(session.current_level || 1)
      }
    }
    loadSession()
  }, [])

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/stats/users')
      if (response.ok) {
        const data = await response.json()
        setUserStats(data)
        setKey(prev => prev + 1) // Force CountUp to re-render with new value
      }
    } catch (error) {
      console.error('Failed to fetch user stats:', error)
    } finally {
      setIsLoadingStats(false)
      setIsRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchUserStats()
  }

  useEffect(() => {
    fetchUserStats()
    
    // Fetch quiz stats (available + solved)
    const fetchQuizStats = async () => {
      try {
        const response = await fetch('/api/stats/quizzes')
        if (response.ok) {
          const data = await response.json()
          setQuizCount(data.totalQuizzes)
          setSolvedQuizzes(data.solvedQuizzes + 30000) //30000 from the Chameleon v1.6
        }
      } catch (error) {
        console.error('Failed to fetch quiz stats:', error)
        setQuizCount(140) // Fallback value
        setSolvedQuizzes(30000) // Fallback value
      }
    }
    fetchQuizStats()
  }, [])

  return (
    <div className="min-h-screen bg-[#030303] relative overflow-hidden">
      {/* Animated Particles Background */}
      <AnimatedParticles />
      
      {/* Gradient Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 -right-32 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation */}
      <Navigation />

      {/* Hero Section - Using the exact design without changes */}
      <HeroGeometric badge="Chameleon FCDS" title1="Master Your" title2="Future Skills" />

      {/* Morx Coming Soon Marquee */}
      <div className="w-full bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-purple-900/20 border-y border-white/10 overflow-hidden">
        <div className="flex items-center gap-8 py-3 animate-marquee whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <a key={i} href="https://morx-team.vercel.app">
              <div className="flex items-center gap-4 px-4">
                <Image 
                  src="/Morx.png" 
                  alt="Morx" 
                  width={32}
                  height={32}
                  className="object-contain"
                />
                <span className="text-white/80 font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  Morx Team is Available Now !
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-8">
        <AdBanner dataAdSlot="8021269551" />
      </div>

      {/* Magic Search Section */}
      <ScrollAnimatedSection className="py-12 bg-[#030303] border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <Badge variant="outline" className="mb-4 bg-white/5 border-white/10 text-white/60">
                <Sparkles className="w-3 h-3 mr-1 inline" />
                Smart Search
              </Badge>
              <h2 className="text-2xl md:text-5xl font-bold text-white mb-3">
                Find Anything in <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Seconds</span>
              </h2>
              <p className="text-white/60 mb-6">
                Search across courses from any specialization with our intelligent search
              </p>
            </div>
            <MagicSearch />
          </div>
        </div>
      </ScrollAnimatedSection>

      <ScrollAnimatedSection className="py-20 bg-[#030303] border-t border-white/5">        <div className="container mx-auto px-4 mb-16">
          <AdBanner dataAdSlot="8021269551" />
        </div>        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Static stats */}
            {staticStats.map((stat, index) => (
              <ScrollAnimatedSection key={index} animation="slideUp" delay={index * 0.1} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 mb-4">
                  <stat.icon className="w-6 h-6 text-white/60" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-2">
                  <CountUp
                    from={0}
                    to={stat.value}
                    separator=","
                    direction="up"
                    duration={1}
                    className="count-up-text"
                  />
                  {stat.suffix}
                </div>
                <div className="text-sm text-white/40">{stat.label}</div>
              </ScrollAnimatedSection>
            ))}
            {/* Dynamic solved quizzes count from Supabase */}
            <ScrollAnimatedSection animation="slideUp" delay={0.1} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 mb-4">
                <Award className="w-6 h-6 text-white/60" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white mb-2">
                {solvedQuizzes !== null ? (
                  <CountUp
                    from={0}
                    to={solvedQuizzes}
                    separator=","
                    direction="up"
                    duration={1}
                    className="count-up-text"
                  />
                ) : (
                  <span className="text-white/40">...</span>
                )}
              </div>
              <div className="text-sm text-white/40">Solved Quizzes</div>
            </ScrollAnimatedSection>
            {/* Dynamic quiz count - available quizzes */}
            <ScrollAnimatedSection animation="slideUp" delay={0.2} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 mb-4">
                <BookOpenCheck className="w-6 h-6 text-white/60" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white mb-2">
                {quizCount !== null ? (
                  <>
                    <CountUp
                      from={0}
                      to={quizCount}
                      separator=","
                      direction="up"
                      duration={1}
                      className="count-up-text"
                    />
                    +
                  </>
                ) : (
                  <span className="text-white/40">...</span>
                )}
              </div>
              <div className="text-sm text-white/40">Available Quizzes</div>
            </ScrollAnimatedSection>
          </div>

          {/* Dynamic User Stats with Level Breakdown */}
          <div className="mt-12 flex justify-center">
            <Popover>
              <PopoverTrigger asChild>
                <button className="group relative px-6 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-white/60" />
                    <div className="text-left">
                      <div className="text-sm text-white/40 flex items-center gap-2">
                        Total Enrolled Students
                        {userStats && (
                          <span className="text-xs text-white/20">
                            • Updated {new Date(userStats.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {isLoadingStats ? (
                          <span className="text-white/40">Loading...</span>
                        ) : (
                          <CountUp
                            key={key}
                            from={0}
                            to={userStats?.totalUsers || 0}
                            separator=","
                            direction="up"
                            duration={1}
                            className="count-up-text"
                          />
                        )}
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-[#0a0a0a] border-white/10 p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-white flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Students by Level
                    </h4>
                    <button
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      className="p-1.5 rounded-md hover:bg-white/10 transition-colors disabled:opacity-50"
                      title="Refresh data"
                    >
                      <RefreshCw className={`w-4 h-4 text-white/60 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                  {isLoadingStats ? (
                    <p className="text-sm text-white/40">Loading breakdown...</p>
                  ) : userStats?.levels && userStats.levels.length > 0 ? (
                    <>
                      <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                        {userStats.levels.map((levelStat) => (
                          <div
                            key={levelStat.level}
                            className="flex items-center justify-between p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                                <span className="text-xs font-bold text-white/80">L{levelStat.level}</span>
                              </div>
                              <span className="text-sm text-white/60">
                                {levelStat.level === 5 ? 'Teaching Assistant' : `Level ${levelStat.level}`}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-white">
                                {levelStat.count.toLocaleString()}
                              </span>
                              <span className="text-xs text-white/40">
                                ({((levelStat.count / (userStats?.totalUsers || 1)) * 100).toFixed(1)}%)
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Verification Total */}
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <div className="flex items-center justify-between p-2 rounded-md bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20">
                          <span className="text-sm font-semibold text-white/80">Total Verified</span>
                          <span className="text-sm font-bold text-green-400">
                            {userStats.levels.reduce((sum, level) => sum + level.count, 0).toLocaleString()} / {userStats.totalUsers.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-white/40">No data available</p>
                  )}
                  {userStats && (
                    <div className="pt-3 border-t border-white/10 text-xs text-white/30 flex items-center justify-between">
                      <span>Last updated: {new Date(userStats.timestamp).toLocaleTimeString()}</span>
                      <span className="text-white/20">{userStats.levels.length} levels</span>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </ScrollAnimatedSection>

      <GsapStackedCards />

      <CreativeFeatureSlider />

      {/* Specializations Section */}
      <ScrollAnimatedSection className="py-20 bg-[#030303]" id="specializations" data-testid="specializations-section">
        <div className="container mx-auto px-4">
          <ScrollAnimatedSection animation="fadeIn" className="text-center mb-16">
            <Badge variant="outline" className="mb-4 bg-white/5 border-white/10 text-white/60">
              Specializations
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{username ? `${formatTAName(username, userLevel)}'s Learning Path` : 'Choose Your'} <span style={{ color: 'rgba(99, 102, 241, 1)' }}>Adventure</span></h2>
            <p className="text-lg text-white/40 max-w-2xl mx-auto">
              {username ? `Hi ${formatTAName(username, userLevel)}! Explore our comprehensive specializations designed to prepare you for the careers of tomorrow` : 'Explore our comprehensive specializations designed to prepare you for the careers of tomorrow'}
            </p>
          </ScrollAnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specializations.map((spec, index) => {
              // Define unique colors for each card's spotlight
              const colors = [
                'rgba(14, 165, 233, 0.3)', // sky
                'rgba(236, 72, 153, 0.3)',  // pink
                'rgba(99, 102, 241, 0.3)',  // indigo
                'rgba(20, 184, 166, 0.3)', // teal
                'rgba(234, 179, 8, 0.3)',   // yellow
                'rgba(239, 68, 68, 0.3)'   // red
              ];
              const spotlightColor = colors[index % colors.length];
              
              return (
                <ScrollAnimatedSection key={index} animation="slideInFromBottom" delay={index * 0.1} className="h-full">
                  <div 
                    className="relative h-full overflow-hidden group"
                    onMouseMove={(e) => {
                      const card = e.currentTarget;
                      const rect = card.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      card.style.setProperty('--mouse-x', `${x}px`);
                      card.style.setProperty('--mouse-y', `${y}px`);
                    }}
                  >
                    {/* Main spotlight gradient */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        background: `radial-gradient(
                          circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
                          ${spotlightColor} 0%,
                          transparent 70%
                        )`,
                      }}
                    />
                    
                    <Link href={`/specialization/${spec.id}`}>
                      <Card className="bg-white/[0.02] border-white/10 hover:bg-white/[0.04] transition-all duration-300 h-full relative z-10 cursor-pointer">
                        <CardHeader>
                          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg border ${spec.color} mb-4`}>
                            <spec.icon className="w-6 h-6" />
                          </div>
                          <CardTitle className="text-white text-xl mb-2">{spec.title}</CardTitle>
                          <CardDescription className="text-white/40 leading-relaxed">{spec.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4 text-sm text-white/60">
                              <span>{spec.courses} Courses</span>
                              <span>{spec.students} Students</span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            className={`w-full bg-transparent border-white/20 text-white hover:bg-white/10 group-hover:border-white/30 transition-all duration-300`}
                            style={{
                            color: "white",
                            transition: "color 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = spotlightColor;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = "white";
                            }}
                          >
                            Explore Courses
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                </ScrollAnimatedSection>
              );
            })}
          </div>
        </div>
      </ScrollAnimatedSection>

      <ScrollAnimatedSection className="py-20 bg-[#030303] border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimatedSection animation="scaleIn" className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{username ? `${formatTAName(username, userLevel)}, Ready to Start Your Journey?` : 'Ready to Start Your Journey?'}</h2>
            <p className="text-lg text-white/40 mb-8 leading-relaxed">
              Join thousands of students who are already building their future with our expert-led courses and
              industry-recognized certifications.
            </p>
            <ScrollAnimatedSection animation="slideUp" delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/specialization">
                  <Button size="lg" className="bg-white text-black hover:bg-white/90 px-8">
                    Start Learning Today
                  </Button>
                </Link>
                <Link href="/specialization">
                    <Button
                    size="lg"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 hover:text-white px-8 bg-transparent">
                    View All Courses
                    </Button>
                </Link>
              </div>
            </ScrollAnimatedSection>
          </ScrollAnimatedSection>
        </div>
      </ScrollAnimatedSection>

      {/* Footer */}
      <ScrollAnimatedSection 
        animation="slideUp" 
        className="py-12 bg-[#030303] border-t border-white/5"
        style={{
          backgroundImage: "url('/images/footer.png')",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: 'cover'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
              title: "Chameleon FCDS",
              content: "Empowering learners worldwide with cutting-edge education and industry-relevant skills.",
              isMain: true,
              },
              {
              title: "Specializations",
              items: specializations.map((spec) => ({
                name: spec.title,
                link: `/specialization/${spec.id}`,
              })),
              },
              {
                title: "Legal Zone",
                items: [
                  { name: "Certifications", link: "/certifications" },
                  { name: "Terms of Service", link: "/terms" },
                  { name: "Privacy and Policies", link: "/privacy" }
                ],
              },
              {
                title: "Support",
                items: [
                  { name: "Help Center", link: "mailto:tokyo9900777@gmail.com" },
                  { name: "Contact Us", link: "https://wa.me/+201552828377" },
                  { name: "LinkedIn", link: "https://www.linkedin.com/in/abdoahmed/" },
                ],
              },
            ].map((section, index) => (
              <ScrollAnimatedSection key={index} animation="slideInFromLeft" delay={index * 0.1}>
              <div>
                <h3 className="text-white font-semibold mb-4">{section.title}</h3>
                {section.isMain ? (
                <p className="text-white/40 text-sm leading-relaxed">{section.content}</p>
                ) : (
                <ul className="space-y-2 text-sm text-white/40">
                  {section.items?.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    {typeof item === "string" ? (
                    <a href="#" className="hover:underline">
                      {item}
                    </a>
                    ) : (
                    <a href={item.link} className="hover:underline">
                      {item.name}
                    </a>
                    )}
                  </li>
                  ))}
                </ul>
                )}
              </div>
              </ScrollAnimatedSection>
            ))}
          </div>
          <ScrollAnimatedSection animation="fadeIn" delay={0.5}>
            <div className="border-t border-white/5 mt-8 pt-8 text-center text-sm text-white/40">
                <p className="copy mb-2">
                  &copy; {new Date().getDate()} of {new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()} - Chameleon FCDS. All rights reserved.
                </p>
                <p className="copy mb-2">
                  Chameleon FCDS - Educational Platform by Levi Ackerman
                </p>
                {username && (
                  <p className="text-xs text-white/40" style={{ fontFamily: 'forte' }}>
                    Personalized experience for {formatTAName(username, userLevel)} ✨
                  </p>
                )}
            </div>
          </ScrollAnimatedSection>
        </div>
      </ScrollAnimatedSection>
    </div>
  )
}
