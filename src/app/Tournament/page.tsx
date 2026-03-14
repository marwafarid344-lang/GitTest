"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Trophy,
  Users,
  Info,
  Crown,
  Star,
  Timer,
  Sparkles,
  Award,
  Gem,
  Eye,
  User,
  TrendingUp,
  Target,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  getLeaderboardData,
  LeaderboardEntry,
  getUserTournamentStats,
  UserTournamentStats,
} from "@/lib/tournament";
import ScrollAnimatedSection from "@/components/scroll-animated-section";
import Navigation from "@/components/navigation";
import AdBanner from "@/components/AdBanner";

// Import Stalinist One font
import "@fontsource/stalinist-one";

const FloatingIcon = ({
  icon: Icon,
  className,
  delay = 0,
}: {
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: [0.2, 0.6, 0.2],
        y: [0, -15, 0],
        rotate: [0, 8, -8, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut",
      }}
      className={`absolute ${className}`}
    >
      <Icon className="w-6 h-6 md:w-8 md:h-8 text-yellow-400/20" />
    </motion.div>
  );
};

const CountdownTimer = ({ onTournamentEnd }: { onTournamentEnd?: (ended: boolean) => void }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    // TEST END DATE: December 28, 2025 at 10:35 PM (Egypt time UTC+2)
    const tournamentEnd = new Date("2026-06-30T23:59:59.999Z"); // 22:35 in UTC+2

    const checkTime = () => {
      const now = new Date();
      const difference = tournamentEnd.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
        setIsEnded(false);
        onTournamentEnd?.(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsEnded(true);
        onTournamentEnd?.(true);
      }
    };

    checkTime(); // Check immediately
    const timer = setInterval(checkTime, 1000);

    return () => clearInterval(timer);
  }, [onTournamentEnd]);

  if (isEnded) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-4 md:p-6 backdrop-blur-xl text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <span className="text-yellow-400 font-bold text-lg md:text-xl">
            🎉 Tournament Has Ended! 🎉
          </span>
          <Trophy className="w-6 h-6 text-yellow-400" />
        </div>
        <p className="text-white/60 text-sm">
          Congratulations to all winners! Check the results below.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-4 md:p-6 backdrop-blur-xl"
    >
      <div className="text-center mb-3 md:mb-4">
        <div className="flex items-center justify-center gap-2 mb-1 md:mb-2">
          <Timer className="w-4 h-4 md:w-5 md:h-5 text-orange-400" />
          <span className="text-orange-400 font-semibold text-sm md:text-base">
            Tournament Ends In
          </span>
        </div>
        <div className="text-white/60 text-xs md:text-sm">June 30th, 2026 at 11:59:59 PM</div>
      </div>{" "}
      <div className="grid grid-cols-4 gap-2 md:gap-3">
        {[
          { value: timeLeft.days, label: "Days" },
          { value: timeLeft.hours, label: "Hours" },
          { value: timeLeft.minutes, label: "Min" },
          { value: timeLeft.seconds, label: "Sec" },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
            className="text-center"
          >
            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg p-2 md:p-3 border border-orange-500/30">
              <div className="text-lg md:text-2xl font-bold text-white">
                {item.value.toString().padStart(2, "0")}
              </div>
              <div className="text-xs text-orange-400 font-medium">
                {item.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Firework particle component
const Firework = ({ delay = 0, x = 50, color = "yellow" }: { delay?: number; x?: number; color?: string }) => {
  const colors: { [key: string]: string } = {
    yellow: "#fbbf24",
    orange: "#f97316", 
    pink: "#ec4899",
    purple: "#a855f7",
    blue: "#3b82f6",
    green: "#22c55e",
  };
  
  return (
    <motion.div
      className="absolute"
      style={{ left: `${x}%`, bottom: "20%" }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1.5, 1.5, 0],
        y: [0, -200, -300, -350],
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        repeatDelay: 3,
        ease: "easeOut",
      }}
    >
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: colors[color] }}
          animate={{
            x: [0, Math.cos((i * Math.PI * 2) / 8) * 60],
            y: [0, Math.sin((i * Math.PI * 2) / 8) * 60],
            opacity: [1, 0],
            scale: [1, 0.5],
          }}
          transition={{
            duration: 1,
            delay: delay + 0.5,
            repeat: Infinity,
            repeatDelay: 4.5,
          }}
        />
      ))}
    </motion.div>
  );
};

// Winner Card Component
const WinnerCard = ({ 
  winner, 
  levelName, 
  levelColor,
  delay = 0
}: { 
  winner: LeaderboardEntry | null; 
  levelName: string;
  levelColor: string;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay, type: "spring" }}
      className={`relative bg-gradient-to-br ${levelColor} border border-white/20 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl`}
    >
      {/* Sparkle Animation */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        animate={{
          boxShadow: [
            "0 0 20px rgba(251, 191, 36, 0.3)",
            "0 0 40px rgba(251, 191, 36, 0.5)",
            "0 0 20px rgba(251, 191, 36, 0.3)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      <div className="relative z-10 text-center">
        {/* Gold Medal - All winners are 1st place in their level */}
        <motion.div
          animate={{ rotate: [-5, 5, -5], scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-5xl md:text-7xl"
        >
          🏆
        </motion.div>
        
        {/* Level Name */}
        <div className="text-white/80 text-sm md:text-base font-medium mt-2 mb-3">
          {levelName}
        </div>
        
        {/* Winner Info */}
        {winner ? (
          <>
            {winner.profile_image ? (
              <Image
                src={winner.profile_image}
                alt={winner.name}
                width={80}
                height={80}
                unoptimized
                className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-yellow-400/50 mx-auto mb-3 object-cover shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-4 border-yellow-400/50 mx-auto mb-3 shadow-lg">
                <span className="text-white font-bold text-2xl md:text-3xl">
                  {winner.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <h3 className="text-white font-bold text-lg md:text-xl mb-1 truncate max-w-[200px] mx-auto">
              {winner.name}
            </h3>
            <div className="flex items-center justify-center gap-2 text-yellow-400">
              <Star className="w-4 h-4" />
              <span className="font-bold">{winner.points} pts</span>
            </div>
          </>
        ) : (
          <div className="text-white/40 text-sm">No participants yet</div>
        )}
        
        <div className="text-yellow-400 text-sm font-bold mt-2">🥇 Champion</div>
      </div>
    </motion.div>
  );
};

// Winners Celebration Component
const WinnersCelebration = ({
  level1Winner,
  level2Winner,
  level3Winner,
}: {
  level1Winner: LeaderboardEntry | null;
  level2Winner: LeaderboardEntry | null;
  level3Winner: LeaderboardEntry | null;
}) => {
  return (
    <div className="relative">
      {/* Fireworks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Firework delay={0} x={10} color="yellow" />
        <Firework delay={0.5} x={30} color="orange" />
        <Firework delay={1} x={50} color="pink" />
        <Firework delay={1.5} x={70} color="purple" />
        <Firework delay={2} x={90} color="blue" />
        <Firework delay={2.5} x={20} color="green" />
        <Firework delay={3} x={80} color="yellow" />
      </div>

      {/* Celebration Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center mb-12"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-flex items-center gap-3 mb-4"
        >
          <span className="text-4xl md:text-6xl">🎉</span>
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
            CONGRATULATIONS!
          </h2>
          <span className="text-4xl md:text-6xl">🎉</span>
        </motion.div>
        <p className="text-white/60 text-lg md:text-xl">
          Season 1 Tournament Champions
        </p>
      </motion.div>

      {/* Winners Grid */}
      <div className="grid md:grid-cols-3 gap-6 md:gap-8">
        <WinnerCard
          winner={level1Winner}
          levelName="Level 1 Champion"
          levelColor="from-blue-500/20 via-cyan-500/10 to-blue-600/20"
          delay={0.3}
        />
        <WinnerCard
          winner={level2Winner}
          levelName="Level 2 Champion"
          levelColor="from-purple-500/20 via-pink-500/10 to-purple-600/20"
          delay={0.6}
        />
        <WinnerCard
          winner={level3Winner}
          levelName="Level 3 Champion"
          levelColor="from-orange-500/20 via-red-500/10 to-orange-600/20"
          delay={0.9}
        />
      </div>

      {/* Confetti-like particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3"
            style={{
              left: `${Math.random() * 100}%`,
              backgroundColor: ["#fbbf24", "#f97316", "#ec4899", "#a855f7", "#3b82f6"][
                Math.floor(Math.random() * 5)
              ],
              borderRadius: Math.random() > 0.5 ? "50%" : "0",
            }}
            initial={{ y: -20, opacity: 0 }}
            animate={{
              y: [0, 800],
              opacity: [0, 1, 1, 0],
              rotate: [0, 360 * 3],
              x: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              delay: Math.random() * 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Ownership Badge Component
const OwnershipBadge = ({
  rank,
  className,
}: {
  rank: number;
  className?: string;
}) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
      className={`inline-flex items-center gap-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-full px-2 py-1 ${className}`}
    >
      <User className="w-3 h-3 text-blue-400" />
      <span className="text-blue-400 text-xs font-medium">
        Your Rank: {rank}
      </span>
    </motion.div>
  );
};

export default function TournamentPage() {
  const [leaderboardLevel1, setLeaderboardLevel1] = useState<
    LeaderboardEntry[]
  >([]);
  const [leaderboardLevel2, setLeaderboardLevel2] = useState<
    LeaderboardEntry[]
  >([]);
  const [leaderboardLevel3, setLeaderboardLevel3] = useState<
    LeaderboardEntry[]
  >([]);
  const [currentUserEntry1, setCurrentUserEntry1] = useState<
    LeaderboardEntry | undefined
  >();
  const [currentUserEntry2, setCurrentUserEntry2] = useState<
    LeaderboardEntry | undefined
  >();
  const [currentUserEntry3, setCurrentUserEntry3] = useState<
    LeaderboardEntry | undefined
  >();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCurrentUserOnly, setShowCurrentUserOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<"level1" | "level2" | "level3">(
    "level1"
  );
  const [selectedUserStats, setSelectedUserStats] =
    useState<UserTournamentStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [tournamentEnded, setTournamentEnded] = useState(false);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        const [level1Data, level2Data, level3Data] = await Promise.all([
          getLeaderboardData(1),
          getLeaderboardData(2),
          getLeaderboardData(3),
        ]);

        setLeaderboardLevel1(level1Data.leaderboard);
        setCurrentUserEntry1(level1Data.currentUserEntry);
        setLeaderboardLevel2(level2Data.leaderboard);
        setCurrentUserEntry2(level2Data.currentUserEntry);
        setLeaderboardLevel3(level3Data.leaderboard);
        setCurrentUserEntry3(level3Data.currentUserEntry);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError("Failed to load leaderboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  // Get current user's rank based on active tab
  const getCurrentUserRank = (
    leaderboard: LeaderboardEntry[],
    currentUserEntry?: LeaderboardEntry
  ) => {
    if (!currentUserEntry) return undefined;

    // Find the user's position in the full sorted leaderboard
    const userIndex = leaderboard.findIndex(
      (player) => player.id === currentUserEntry.id
    );
    return userIndex !== -1 ? userIndex + 1 : undefined;
  };

  const currentUserRank =
    activeTab === "level1"
      ? getCurrentUserRank(leaderboardLevel1, currentUserEntry1)
      : activeTab === "level2"
      ? getCurrentUserRank(leaderboardLevel2, currentUserEntry2)
      : getCurrentUserRank(leaderboardLevel3, currentUserEntry3);

  const renderLeaderboard = (
    data: LeaderboardEntry[],
    currentUserEntry?: LeaderboardEntry
  ) => {
    if (loading) {
      return (
        <div className="space-y-3 md:space-y-4">
          {[...Array(5)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center justify-between p-3 md:p-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-white/20 rounded animate-pulse"></div>
                <div className="w-16 md:w-24 h-3 md:h-4 bg-white/20 rounded animate-pulse"></div>
              </div>
              <div className="w-12 md:w-16 h-3 md:h-4 bg-white/20 rounded animate-pulse"></div>
            </motion.div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-6 md:py-8"
        >
          <p className="text-red-400 text-sm md:text-base">{error}</p>
        </motion.div>
      );
    }

    // If showCurrentUserOnly is true and we have current user data, show only current user
    // Find current user either from currentUserEntry (for users not in top 10)
    // or from the leaderboard data itself (for users in top 10)
    const currentUserFromLeaderboard = data.find((player) => player.isCurrentUser);
    const effectiveCurrentUser = currentUserEntry || currentUserFromLeaderboard;
    
    if (showCurrentUserOnly && effectiveCurrentUser) {
      const actualRank =
        data.findIndex((player) => player.id === effectiveCurrentUser.id) + 1;
      return (
        <div className="space-y-3 md:space-y-4">
          <div className="text-center mb-4">
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-3 py-1 text-xs md:text-sm">
              <Eye className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              Showing Only Your Rank
            </Badge>
            <p className="text-white/60 text-xs mt-2">
              Tap the button again to see full leaderboard
            </p>
          </div>
          {renderLeaderboardItem(
            effectiveCurrentUser,
            actualRank - 1,
            true,
            actualRank
          )}
        </div>
      );
    }
    
    // If showCurrentUserOnly is true but no user is logged in or hasn't participated
    if (showCurrentUserOnly && !effectiveCurrentUser) {
      return (
        <div className="space-y-3 md:space-y-4">
          <div className="text-center py-8">
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 px-3 py-1 text-xs md:text-sm mb-4">
              <Eye className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              No Rank Found
            </Badge>
            <p className="text-white/60 text-sm mt-2">
              You haven&apos;t participated in this level&apos;s tournament yet.
            </p>
            <p className="text-white/40 text-xs mt-1">
              Complete a quiz at this level to join the leaderboard!
            </p>
            <button
              onClick={() => setShowCurrentUserOnly(false)}
              className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white/80 rounded-lg text-sm transition-all duration-300"
            >
              View Full Leaderboard
            </button>
          </div>
        </div>
      );
    }

    // Get top 10 players
    const topPlayers = data.slice(0, 10);

    // Check if current user is in top 10
    const isCurrentUserInTop10 =
      currentUserEntry &&
      topPlayers.some((player) => player.id === currentUserEntry.id);

    // Display data: top 10 + current user if not in top 10
    const displayData =
      currentUserEntry && !isCurrentUserInTop10
        ? [...topPlayers, currentUserEntry]
        : [...topPlayers];

    return (
      <div className="space-y-3 md:space-y-4">
        {displayData.map((player, index) => {
          const isCurrentUser = currentUserEntry
            ? player.id === currentUserEntry.id
            : false;
          // Use array index for ranking display (1st, 2nd, 3rd place effects)
          const displayRank = index + 1;

          return renderLeaderboardItem(
            player,
            index,
            isCurrentUser,
            displayRank
          );
        })}

        {/* Show separator if current user is not in top 10 */}
        {currentUserEntry &&
          !isCurrentUserInTop10 &&
          displayData.length > 10 && (
            <div className="relative flex items-center justify-center my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative bg-[#030303] px-4">
                <span className="text-white/40 text-xs">
                  ... and 893 more competitors
                </span>
              </div>
            </div>
          )}
      </div>
    );
  };

  const renderLeaderboardItem = (
    player: LeaderboardEntry,
    index: number,
    isCurrentUser: boolean,
    displayRank?: number
  ) => {
    const rank = displayRank || index + 1;
    const styling = getPositionStyling(index, isCurrentUser);

    return (
      <motion.div
        key={player.id}
        initial={{ opacity: 0, x: -30, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{
          duration: 0.6,
          delay: index * 0.1,
          type: "spring",
          stiffness: 100,
        }}
        whileHover={{
          scale: 1.02,
          transition: { duration: 0.2 },
        }}
        className={`relative flex items-center justify-between p-3 md:p-5 rounded-xl border backdrop-blur-xl shadow-lg ${styling.card} ${styling.glow} transition-all duration-300`}
      >
        {/* Ownership Crown for Current User */}
        {isCurrentUser && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
            className="absolute -top-2 -left-2 z-10"
          >
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full p-1 shadow-lg">
              <Crown className="w-4 h-4 text-white" />
            </div>
          </motion.div>
        )}

        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-1 md:gap-3">
            {styling.medal && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                className="text-xl md:text-2xl"
              >
                {styling.medal}
              </motion.span>
            )}
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
              className={`text-lg md:text-xl font-bold ${styling.rank}`}
            >
              {rank}.
            </motion.span>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {player.profile_image ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.4, type: "spring" }}
                className="relative cursor-pointer group"
                onClick={() =>
                  handleUserClick(
                    player.id,
                    activeTab === "level1" ? 1 : activeTab === "level2" ? 2 : 3
                  )
                }
              >
                <div className="absolute inset-0 bg-blue-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Image
                  src={player.profile_image}
                  alt={`${player.name}'s profile`}
                  width={40}
                  height={40}
                  unoptimized
                  className="w-8 h-8 md:w-12 md:h-12 rounded-full border-2 border-white/20 object-cover shadow-lg group-hover:border-blue-400/50 transition-all duration-300"
                />
                {isCurrentUser && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 border-2 border-white"
                  >
                    <User className="w-2 h-2 text-white" />
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.4, type: "spring" }}
                className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-2 border-white/20 shadow-lg relative cursor-pointer group"
                onClick={() =>
                  handleUserClick(
                    player.id,
                    activeTab === "level1" ? 1 : activeTab === "level2" ? 2 : 3
                  )
                }
              >
                <div className="absolute inset-0 bg-blue-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="text-white font-bold text-sm md:text-lg">
                  {player.name.charAt(0).toUpperCase()}
                </span>
                {isCurrentUser && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 border-2 border-white"
                  >
                    <User className="w-2 h-2 text-white" />
                  </motion.div>
                )}
              </motion.div>
            )}

            <div className="max-w-[120px] md:max-w-none">
              <div className="flex items-center gap-2">
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  className={`${styling.name} text-sm md:text-lg truncate block cursor-pointer hover:underline hover:text-blue-400 transition-colors duration-300`}
                  title={player.name || "Anonymous User"}
                  onClick={() =>
                    handleUserClick(
                      player.id,
                      activeTab === "level1"
                        ? 1
                        : activeTab === "level2"
                        ? 2
                        : 3
                    )
                  }
                >
                  {player.name || "Anonymous User"}
                </motion.span>
                {isCurrentUser && <OwnershipBadge rank={rank} />}
              </div>
              {player.specialization && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.6 }}
                  className="text-xs md:text-sm text-white/60 mt-1 truncate"
                  title={player.specialization}
                >
                  {player.specialization}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 + 0.8, type: "spring" }}
          className="flex items-center gap-1 md:gap-2 text-yellow-400 bg-yellow-500/10 px-2 md:px-4 py-1 md:py-2 rounded-full border border-yellow-500/20"
        >
          <Star className="w-3 h-3 md:w-5 md:h-5" />
          <span className="font-bold text-white text-sm md:text-lg">
            {player.points}
          </span>
        </motion.div>
      </motion.div>
    );
  };

  const getPositionStyling = (index: number, isCurrentUser: boolean) => {
    if (isCurrentUser) {
      return {
        card: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-400/50 shadow-blue-500/20 relative",
        rank: "text-blue-400",
        name: "text-blue-400 font-semibold",
        medal: null,
        glow: "shadow-blue-500/30",
      };
    }

    switch (index) {
      case 0: // 1st place - Gold
        return {
          card: "bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-yellow-600/20 border-yellow-400/60 shadow-yellow-500/30",
          rank: "text-yellow-400",
          name: "text-yellow-400 font-bold",
          medal: null,
          glow: "shadow-yellow-500/40",
        };
      case 1: // 2nd place - Silver
        return {
          card: "bg-gradient-to-r from-gray-300/20 via-slate-400/20 to-gray-400/20 border-gray-300/60 shadow-gray-300/30",
          rank: "text-gray-300",
          name: "text-gray-300 font-bold",
          medal: null,
          glow: "shadow-gray-300/40",
        };
      case 2: // 3rd place - Bronze
        return {
          card: "bg-gradient-to-r from-orange-600/20 via-red-600/20 to-orange-700/20 border-orange-500/60 shadow-orange-500/30",
          rank: "text-orange-500",
          name: "text-orange-500 font-bold",
          medal: null,
          glow: "shadow-orange-500/40",
        };
      default: // Other positions - Transparent
        return {
          card: "bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300",
          rank: "text-white/70",
          name: "text-white/80",
          medal: null,
          glow: "hover:shadow-white/20",
        };
    }
  };

  const toggleViewMode = () => {
    setShowCurrentUserOnly(!showCurrentUserOnly);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as "level1" | "level2" | "level3");
  };

  const handleUserClick = async (userId: number, level: 1 | 2 | 3) => {
    setStatsLoading(true);
    setShowStatsModal(true);

    try {
      const stats = await getUserTournamentStats(userId, level);
      setSelectedUserStats(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      setSelectedUserStats(null);
    } finally {
      setStatsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] relative overflow-hidden">
      {/* Animated Background */}
      <Navigation />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/[0.07] via-transparent to-orange-500/[0.07] blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-tl from-purple-500/[0.05] via-transparent to-pink-500/[0.05] blur-3xl" />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
          style={{ backgroundImage: "url(/images/Background.png)" }}
        />
        {/* Floating Trophy Icons */}
        <FloatingIcon
          icon={Trophy}
          className="top-10 md:top-20 left-4 md:left-10"
          delay={0}
        />
        <FloatingIcon
          icon={Crown}
          className="top-20 md:top-40 right-10 md:right-20"
          delay={1}
        />
        <FloatingIcon
          icon={Star}
          className="bottom-20 md:bottom-40 left-10 md:left-20"
          delay={2}
        />
        <FloatingIcon
          icon={Sparkles}
          className="bottom-10 md:bottom-20 right-4 md:right-10"
          delay={3}
        />
        <FloatingIcon
          icon={Award}
          className="top-32 md:top-60 left-1/2"
          delay={4}
        />
        <FloatingIcon
          icon={Gem}
          className="bottom-32 md:bottom-60 right-1/3"
          delay={5}
        />
      </div>

      <ScrollAnimatedSection className="pt-24 md:pt-32 pb-12 md:pb-16 relative z-10">
        <div className="container mx-auto px-3 md:px-4">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            {/* Season 1 Badge - Creative Colorful Design */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
              }}
              className="flex flex-col items-center justify-center mb-8"
            >
              {/* Season 1 Text - Single Line with Creative Colors */}
              <div className="text-center">
                <motion.h1
                  className="tracking-[0.15em] uppercase flex items-center justify-center gap-3 md:gap-4"
                  style={{
                    fontFamily: "'Stalinist One', sans-serif",
                    WebkitFontSmoothing: "antialiased",
                    MozOsxFontSmoothing: "grayscale",
                  }}
                >
                  {/* SEASON */}
                  <motion.span
                    className="text-4xl md:text-6xl lg:text-7xl font-black"
                    style={
                      {
                        display: "inline-block",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      } as React.CSSProperties
                    }
                  >
                    <motion.div
                      animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      style={{
                        backgroundImage:
                          "linear-gradient(135deg, #FF0000 0%, #8B00FF 100%)",
                        backgroundSize: "200% 200%",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        display: "inline-block",
                      }}
                    >
                      SEASON
                    </motion.div>
                  </motion.span>

                  {/* 1 */}
                  <motion.span
                    className="text-4xl md:text-6xl lg:text-7xl font-black"
                    style={
                      {
                        display: "inline-block",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      } as React.CSSProperties
                    }
                  >
                    <motion.div
                      animate={{
                        backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                        delay: 1,
                      }}
                      style={{
                        backgroundImage:
                          "linear-gradient(135deg, #FF0000 0%, #8B00FF 100%)",
                        backgroundSize: "200% 200%",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        display: "inline-block",
                      }}
                    >
                      1
                    </motion.div>
                  </motion.span>
                </motion.h1>

                {/* Subtitle */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-base md:text-lg lg:text-xl tracking-[0.25em] font-bold text-center mt-4 uppercase text-orange-400"
                  style={{
                    fontFamily: "'Stalinist One', sans-serif",
                    textShadow: "0 2px 10px rgba(251, 146, 60, 0.4)",
                  }}
                >
                  October 2025 - June 2026
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-2 rounded-full bg-white/5 border border-white/10 mb-4 md:mb-6"
            >
              <Trophy className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" />
              <span className="text-xs md:text-sm text-white/60 tracking-wide">
                Championship Tournament
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-2xl md:text-4xl lg:text-6xl font-bold text-white mb-4 md:mb-6"
            >
              Ultimate{" "}
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Tournament
              </span>
            </motion.h1>

            {/* Your Rank Header */}
            {currentUserRank && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mb-4 md:mb-6"
              >
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-400/20 rounded-2xl px-6 py-3 backdrop-blur-sm">
                  <Crown className="w-5 h-5 text-blue-400" />
                  <span className="text-white/80 text-sm md:text-base font-medium">
                    your rank is :
                  </span>
                  <span className="text-blue-400 text-lg md:text-2xl font-bold">
                    {currentUserRank}
                  </span>
                  <span className="text-white/60 text-sm">
                    out of{" "}
                    {activeTab === "level1"
                      ? leaderboardLevel1.length
                      : activeTab === "level2"
                      ? leaderboardLevel2.length
                      : leaderboardLevel3.length}{" "}
                    players
                  </span>
                  <User className="w-4 h-4 text-blue-400 ml-1" />
                </div>
              </motion.div>
            )}

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm md:text-lg text-white/60 max-w-3xl mx-auto mb-4 md:mb-6 px-2"
            >
              Compete with the best minds in computer science and data science.
              Show your skills, climb the leaderboard, and claim victory in this
              epic battle of knowledge!
            </motion.p>

            {/* Tournament Extension Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="max-w-4xl mx-auto mb-6 md:mb-8 px-2"
            >
              <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-400/30 rounded-xl p-4 md:p-6 backdrop-blur-sm">
                <div className="flex items-start gap-3 mb-3">
                  <Info className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-blue-400 font-semibold text-sm md:text-base mb-2">
                      Tournament Extended - Fair Competition for All!
                    </h3>
                    <p className="text-white/70 text-xs md:text-sm leading-relaxed">
                      We&apos;ve extended the tournament duration to ensure fair
                      competition across all levels. Some academic years
                      currently have quizzes from only one subject (Economics
                      only in Level 2), while others have 3 subjects in Level 3
                      and Level 1, creating an unfair competitive advantage for
                      certain levels.
                    </p>
                    <p className="text-white/70 text-xs md:text-sm leading-relaxed mt-2">
                      <span className="text-yellow-400 font-semibold">
                        Therefore, we&apos;ve decided to extend the duration to
                        include the second semester as well
                      </span>
                      , making this an annual tournament with fiercer and more
                      balanced competition for everyone!
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/50 mt-3 pt-3 border-t border-white/10">
                  <Sparkles className="w-4 h-4" />
                  <span>More time, more quizzes, more fair competition!</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-2 md:gap-4"
            >
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm">
                <Crown className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Elite Competition
              </Badge>
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm">
                <Timer className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Time Limited
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm">
                <Star className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Prestigious Rewards
              </Badge>
            </motion.div>
          </div>

          {/* Countdown Timer */}
          <ScrollAnimatedSection className="mb-8 md:mb-12">
            <CountdownTimer onTournamentEnd={setTournamentEnded} />
          </ScrollAnimatedSection>
          
          <div className="mb-8 md:mb-12">
            <AdBanner dataAdSlot="8021269551" />
          </div>

          {/* Show Winners Celebration when tournament ends, otherwise show leaderboard */}
          {tournamentEnded ? (
            <ScrollAnimatedSection className="mb-8 md:mb-12">
              <WinnersCelebration
                level1Winner={leaderboardLevel1[0] || null}
                level2Winner={leaderboardLevel2[0] || null}
                level3Winner={leaderboardLevel3[0] || null}
              />
            </ScrollAnimatedSection>
          ) : (
          <div className="grid lg:grid-cols-3 gap-4 md:gap-8">
            {/* Leaderboard Section */}
            <Card className="lg:col-span-2 bg-white/[0.02] border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-b border-white/10 p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2 text-lg md:text-2xl">
                      <Trophy className="w-4 h-4 md:w-6 md:h-6 text-yellow-400" />
                      Championship Leaderboard
                    </CardTitle>
                    <CardDescription className="text-white/60 text-sm md:text-base">
                      Battle across levels and claim your throne
                    </CardDescription>
                  </div>

                  {/* Toggle View Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleViewMode}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-300 ${
                      showCurrentUserOnly
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        : "bg-white/10 text-white/80 border border-white/20 hover:bg-white/20"
                    }`}
                  >
                    <Eye className="w-3 h-3 md:w-4 md:h-4" />
                    {showCurrentUserOnly
                      ? "Show Full Leaderboard"
                      : "Show My Rank Only"}
                  </motion.button>
                </div>
              </CardHeader>
              <CardContent className="p-3 md:p-6">
                <Tabs
                  defaultValue="level1"
                  className="w-full"
                  onValueChange={handleTabChange}
                >
                  <TabsList className="grid grid-cols-3 mb-4 md:mb-6 bg-white/10 p-1 rounded-lg">
                    <TabsTrigger
                      value="level1"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-md transition-all duration-300 text-xs md:text-sm px-2 py-1 md:px-4 md:py-2"
                    >
                      <Crown className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      Level 1
                    </TabsTrigger>
                    <TabsTrigger
                      value="level2"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-md transition-all duration-300 text-xs md:text-sm px-2 py-1 md:px-4 md:py-2"
                    >
                      <Star className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      Level 2
                    </TabsTrigger>
                    <TabsTrigger
                      value="level3"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-md transition-all duration-300 text-xs md:text-sm px-2 py-1 md:px-4 md:py-2"
                    >
                      <Gem className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      Level 3
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="level1">
                    {renderLeaderboard(leaderboardLevel1, currentUserEntry1)}
                  </TabsContent>
                  <TabsContent value="level2">
                    {renderLeaderboard(leaderboardLevel2, currentUserEntry2)}
                  </TabsContent>
                  <TabsContent value="level3">
                    {renderLeaderboard(leaderboardLevel3, currentUserEntry3)}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Tournament Details */}
            <Card className="bg-white/[0.02] border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-white/10 p-4 md:p-6">
                <CardTitle className="text-white flex items-center gap-2 text-base md:text-xl">
                  <Info className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                  Tournament Rules
                </CardTitle>
                <CardDescription className="text-white/60 text-sm md:text-base">
                  Master the competition
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6 text-white/80 p-3 md:p-6">
                <div className="space-y-3 md:space-y-4">
                  {/* Current Leaders Section */}
                  <div className="p-3 md:p-4 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-lg border border-yellow-500/20">
                    <h3 className="font-semibold text-yellow-400 flex items-center gap-2 mb-3 text-sm md:text-base">
                      <Trophy className="w-3 h-3 md:w-4 md:h-4" /> Our Current Ultimate Leaders
                    </h3>
                    <div className="space-y-2">
                      {/* Level 1 Leader */}
                      <div className="flex items-center gap-3 bg-white/5 rounded-lg p-2 border border-blue-500/20">
                        <span className="text-blue-400 text-xs font-bold min-w-[50px]">Level 1</span>
                        {leaderboardLevel1[0] ? (
                          <div className="flex items-center gap-2 flex-1">
                            {leaderboardLevel1[0].profile_image ? (
                              <Image
                                src={leaderboardLevel1[0].profile_image}
                                alt={leaderboardLevel1[0].name}
                                width={24}
                                height={24}
                                unoptimized
                                className="w-6 h-6 rounded-full border border-yellow-400/50"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
                                  {leaderboardLevel1[0].name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <span className="text-white text-xs md:text-sm font-medium truncate flex-1">
                              {leaderboardLevel1[0].name}
                            </span>
                            <span className="text-yellow-400 text-xs font-bold">
                              {leaderboardLevel1[0].points} pts
                            </span>
                          </div>
                        ) : (
                          <span className="text-white/40 text-xs">Loading...</span>
                        )}
                      </div>
                      
                      {/* Level 2 Leader */}
                      <div className="flex items-center gap-3 bg-white/5 rounded-lg p-2 border border-purple-500/20">
                        <span className="text-purple-400 text-xs font-bold min-w-[50px]">Level 2</span>
                        {leaderboardLevel2[0] ? (
                          <div className="flex items-center gap-2 flex-1">
                            {leaderboardLevel2[0].profile_image ? (
                              <Image
                                src={leaderboardLevel2[0].profile_image}
                                alt={leaderboardLevel2[0].name}
                                width={24}
                                height={24}
                                unoptimized
                                className="w-6 h-6 rounded-full border border-yellow-400/50"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
                                  {leaderboardLevel2[0].name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <span className="text-white text-xs md:text-sm font-medium truncate flex-1">
                              {leaderboardLevel2[0].name}
                            </span>
                            <span className="text-yellow-400 text-xs font-bold">
                              {leaderboardLevel2[0].points} pts
                            </span>
                          </div>
                        ) : (
                          <span className="text-white/40 text-xs">Loading...</span>
                        )}
                      </div>
                      
                      {/* Level 3 Leader */}
                      <div className="flex items-center gap-3 bg-white/5 rounded-lg p-2 border border-orange-500/20">
                        <span className="text-orange-400 text-xs font-bold min-w-[50px]">Level 3</span>
                        {leaderboardLevel3[0] ? (
                          <div className="flex items-center gap-2 flex-1">
                            {leaderboardLevel3[0].profile_image ? (
                              <Image
                                src={leaderboardLevel3[0].profile_image}
                                alt={leaderboardLevel3[0].name}
                                width={24}
                                height={24}
                                unoptimized
                                className="w-6 h-6 rounded-full border border-yellow-400/50"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
                                  {leaderboardLevel3[0].name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <span className="text-white text-xs md:text-sm font-medium truncate flex-1">
                              {leaderboardLevel3[0].name}
                            </span>
                            <span className="text-yellow-400 text-xs font-bold">
                              {leaderboardLevel3[0].points} pts
                            </span>
                          </div>
                        ) : (
                          <span className="text-white/40 text-xs">Loading...</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 md:p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                    <h3 className="font-semibold text-green-400 flex items-center gap-2 mb-1 md:mb-2 text-sm md:text-base">
                      <Crown className="w-3 h-3 md:w-4 md:h-4" /> Victory
                      Rewards
                    </h3>
                    <ul className="text-xs md:text-sm space-y-1">
                      <li>
                        • Win:{" "}
                        <span className="text-green-400 font-bold">
                          Chameleon 2026 Ultimate Edition Hoodie
                        </span>
                      </li>
                      <li>
                        • Participation:{" "}
                        <span className="text-green-400 font-bold">
                          Get Administration Access to full Chameleon 2026
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-3 md:p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
                    <h3 className="font-semibold text-blue-400 flex items-center gap-2 mb-1 md:mb-2 text-sm md:text-base">
                      <Users className="w-3 h-3 md:w-4 md:h-4" /> Competition
                      Levels
                    </h3>
                    <p className="text-xs md:text-sm">
                      Three separate leaderboards for Level 1, Level 2, and
                      Level 3 competitors. Points calculated independently.
                    </p>
                  </div>

                  <div className="p-3 md:p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                    <h3 className="font-semibold text-purple-400 flex items-center gap-2 mb-1 md:mb-2 text-sm md:text-base">
                      <Info className="w-3 h-3 md:w-4 md:h-4" /> Tournament
                      Rules
                    </h3>
                    <ul className="text-xs md:text-sm space-y-1">
                      <li>
                        •{" "}
                        <span className="text-purple-400 font-semibold">
                          First Attempt Only:
                        </span>{" "}
                        Only your first attempt on each quiz counts toward
                        tournament standings
                      </li>
                      <li>
                        •{" "}
                        <span className="text-purple-400 font-semibold">
                          Tournament Period:
                        </span>{" "}
                        October 11, 2025 - June 30, 2026
                      </li>
                      <li>
                        • Retakes and practice runs won&apos;t affect your
                        tournament score
                      </li>
                      <li>
                        •{" "}
                        <span className="text-purple-400 font-semibold">
                          Scoring:
                        </span>{" "}
                        Points are reduced (÷10) for balanced competition
                      </li>
                    </ul>
                  </div>

                  <div className="p-3 md:p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/20">
                    <h3 className="font-semibold text-orange-400 flex items-center gap-2 mb-1 md:mb-2 text-sm md:text-base">
                      <Sparkles className="w-3 h-3 md:w-4 md:h-4" /> How We
                      Calculate Your Score?
                    </h3>
                    <div className="text-xs md:text-sm space-y-2">
                      <p className="text-white/90 font-medium mb-1 md:mb-2">
                        Your tournament score is calculated using this formula:
                      </p>
                      <div className="bg-black/20 p-2 md:p-3 rounded border border-white/10">
                        <code className="text-orange-300 text-xs md:text-sm">
                          Total Points = (Correct Answers + Duration + Mode +
                          Completion) ÷ 10
                        </code>
                      </div>
                      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-2 rounded border border-yellow-500/20 mb-2">
                        <p className="text-yellow-400 text-xs font-semibold">
                          ⚠️ All points are divided by 10 and rounded for
                          balanced scoring
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 mt-2 md:mt-3">
                        <div>
                          <p className="text-white/80 font-medium mb-1 text-xs md:text-sm">
                            Duration Points (*AR):
                          </p>
                          <ul className="text-xs space-y-1 text-white/70">
                            <li>• 1 minute: +5 pts</li>
                            <li>• 5 minutes: +4.5 pts</li>
                            <li>• 15 minutes: +4 pts </li>
                            <li>• 30 minutes: +3.5 pts</li>
                            <li>• 60 minutes: +3 pts </li>
                            <li>• Unlimited: +2.5 pts</li>
                          </ul>
                        </div>
                        <div>
                          <p className="text-white/80 font-medium mb-1 text-xs md:text-sm">
                            Mode Points (*AR):
                          </p>
                          <ul className="text-xs space-y-1 text-white/70">
                            <li>• Instant Feedback: +1.5 pts</li>
                            <li>• Traditional: +1.2 pts</li>
                          </ul>
                          <p className="text-white/80 font-medium mb-1 mt-1 md:mt-2 text-xs md:text-sm">
                            Completion Points (*AR):
                          </p>
                          <ul className="text-xs space-y-1 text-white/70">
                            <li>• Completed: +2 pts</li>
                            <li>• Timed Out: +1.5 pts</li>
                          </ul>
                        </div>
                      </div>
                      <p className="text-white/60 text-xs mt-1 md:mt-2">
                        Higher scores from faster completion and instant mode
                        give you an edge in the tournament!
                        <br />
                        <br />
                         *AR stands for After Reduction
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          )}
        </div>
      </ScrollAnimatedSection>

      {/* User Statistics Modal */}
      <Dialog open={showStatsModal} onOpenChange={setShowStatsModal}>
        <DialogContent className="tournament-stats-modal bg-gradient-to-br from-slate-950/95 via-purple-950/40 to-slate-950/95 backdrop-blur-xl border border-purple-500/30 text-white max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl shadow-purple-500/20 rounded-2xl">
          {/* Simplified Background Effects - Static for better performance */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
          </div>

          <DialogHeader className="relative z-10">
            <DialogTitle className="text-2xl font-bold flex items-center gap-3 mb-2">
              {statsLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 animate-pulse" />
                  <div className="space-y-2">
                    <div className="w-32 h-6 bg-white/20 animate-pulse rounded" />
                    <div className="w-24 h-3 bg-white/10 animate-pulse rounded" />
                  </div>
                </div>
              ) : selectedUserStats ? (
                <>
                  <div className="relative">
                    {selectedUserStats.profileImage ? (
                      <Image
                        src={selectedUserStats.profileImage}
                        alt={selectedUserStats.username}
                        width={48}
                        height={48}
                        unoptimized
                        className="rounded-full border-2 border-purple-400/50 shadow-lg"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-2 border-purple-400/50 shadow-lg">
                        <span className="text-white font-bold text-xl">
                          {selectedUserStats.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {selectedUserStats.username}
                    </div>
                    {selectedUserStats.specialization && (
                      <div className="text-xs text-purple-300/70 font-medium mt-0.5">
                        {selectedUserStats.specialization}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                "User Statistics"
              )}
            </DialogTitle>
            <DialogDescription className="text-purple-300/60 text-sm relative z-10">
              Tournament Performance Overview
            </DialogDescription>
          </DialogHeader>

          {statsLoading ? (
            <div className="space-y-3 py-4 relative z-10">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl animate-pulse border border-white/5"
                />
              ))}
            </div>
          ) : selectedUserStats ? (
            <div className="space-y-4 py-2 relative z-10">
              {/* Rank & Points */}
              <div className="grid grid-cols-2 gap-3">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <span className="text-white/70 text-xs">Rank</span>
                  </div>
                  <div className="text-3xl font-black text-yellow-400">
                    #{selectedUserStats.rank}
                  </div>
                  <div className="text-xs text-white/50 mt-1">
                    of {selectedUserStats.totalParticipants} players
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-cyan-400" />
                    <span className="text-white/70 text-xs">Points</span>
                  </div>
                  <div className="text-3xl font-black text-cyan-400">
                    {selectedUserStats.totalPoints}
                  </div>
                  <div className="text-xs text-white/50 mt-1">
                    Level {selectedUserStats.level}
                  </div>
                </motion.div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-3"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-purple-400" />
                    <span className="text-white/70 text-xs">Quizzes</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-400">
                    {selectedUserStats.totalQuizzes}
                  </div>
                  <div className="text-[10px] text-white/40 mt-1 font-mono">
                    COUNT(first_attempts)
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-3"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-white/70 text-xs">Average</span>
                  </div>
                  <div className="text-2xl font-bold text-green-400">
                    {selectedUserStats.averageScore}%
                  </div>
                  <div className="text-[10px] text-white/40 mt-1 font-mono">
                    AVG(score) of all quizzes
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-3"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-white/70 text-xs">Best</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {selectedUserStats.bestScore}%
                  </div>
                  <div className="text-[10px] text-white/40 mt-1 font-mono">
                    MAX(score) achieved
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg p-3"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-cyan-400" />
                    <span className="text-white/70 text-xs">Accuracy</span>
                  </div>
                  <div className="text-2xl font-bold text-cyan-400">
                    {selectedUserStats.accuracy}%
                  </div>
                  <div className="text-[10px] text-white/40 mt-1 font-mono">
                    (correct / total) × 100
                  </div>
                </motion.div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-white/60">
              <p>Failed to load user statistics</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
