"use client";

import { useState, useEffect } from 'react';
import { Star, GitBranch, Code, ExternalLink, Trophy, Medal, Award, Github, Target, Zap, Sparkles, Users, TrendingUp, Check, Clock } from 'lucide-react';

// We'll load the data at runtime instead of import

const Button = ({ children, variant = 'default', size = 'default', className = '', onClick, ...props }: {
  children: any;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  onClick?: () => void;
  [key: string]: any;
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transform hover:scale-105';
  const variants = {
    default: 'bg-gradient-to-r from-primary to-[#9dff07] hover:from-[#9dff07] hover:to-primary text-black hover:shadow-xl hover:shadow-primary/30',
    outline: 'border border-white/20 text-white hover:bg-white/10 backdrop-blur-md',
    ghost: 'text-white hover:bg-white/10 backdrop-blur-md',
    secondary: 'bg-white/5 text-white border border-white/10 hover:bg-white/10 backdrop-blur-md',
  };
  const sizes = {
    default: 'h-12 py-3 px-6',
    sm: 'h-10 px-4 text-sm',
    lg: 'h-14 px-8 text-lg',
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = '', ...props }: {
  children: any;
  className?: string;
  [key: string]: any;
}) => (
<div
  className={`rounded-xl backdrop-blur-md transition-all duration-300 hover:scale-[1.02] shadow-lg bg-white/10 border border-primary/50 hover:bg-white/15 focus:outline-none focus:border-primary/50 ${className}`}
  {...props}
>
  {children}
</div>



);


const CardHeader = ({ children, className = '' }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-2xl font-bold leading-none tracking-tight text-white ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-gray-300 ${className}`}>
    {children}
  </p>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-primary text-black hover:bg-primary/90',
    secondary: 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-md',
    level: 'text-white backdrop-blur-md shadow-lg',
  };
  
  return (
    <div className={`inline-flex items-center rounded-full border-0 px-3 py-1 text-xs font-semibold transition-all duration-300 ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

const Table = ({ children, className = '' }) => (
  <div className={`w-full overflow-auto rounded-xl ${className}`}>
    <table className="w-full caption-bottom text-sm">
      {children}
    </table>
  </div>
);

const TableHeader = ({ children }) => (
  <thead className="[&_tr]:border-b [&_tr]:border-white/10">
    {children}
  </thead>
);

const TableBody = ({ children }) => (
  <tbody className="[&_tr:last-child]:border-0">
    {children}
  </tbody>
);

const TableRow = ({ children, className = '' }) => (
  <tr className={`border-b border-white/10 transition-colors hover:bg-white/5 ${className}`}>
    {children}
  </tr>
);

const TableHead = ({ children, className = '' }) => (
  <th className={`h-12 px-4 text-left align-middle font-semibold text-gray-300 ${className}`}>
    {children}
  </th>
);

const TableCell = ({ children, className = '' }) => (
  <td className={`p-4 align-middle text-white ${className}`}>
    {children}
  </td>
);

interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
}

const getLevelBadge = (contributions: number) => {
  if (contributions >= 30) {
    return { icon: <Trophy className="h-4 w-4" />, text: "Expert", color: "bg-gradient-to-r from-yellow-400 to-orange-500", level: 3, requirement: "30+" };
  } else if (contributions >= 15) {
    return { icon: <Medal className="h-4 w-4" />, text: "Advanced", color: "bg-gradient-to-r from-purple-400 to-purple-600", level: 2, requirement: "15-29" };
  } else {
    return { icon: <Award className="h-4 w-4" />, text: "Contributor", color: "bg-gradient-to-r from-primary to-[#9dff07]", level: 1, requirement: "1-14" };
  }
};

const getRankIcon = (index: number) => {
  switch (index) {
    case 0:
      return <Trophy className="h-6 w-6 text-yellow-400" />;
    case 1:
      return <Medal className="h-6 w-6 text-gray-300" />;
    case 2:
      return <Award className="h-6 w-6 text-amber-500" />;
    default:
      return <span className="text-lg font-bold text-gray-400">#{index + 1}</span>;
  }
};

const levelRequirements = [
  {
    level: "Level 1 - Contributor",
    icon: <Award className="h-6 w-6" />,
    requirement: "1-14 contributions",
    description: "Welcome to the community! Every journey starts with a single contribution.",
    color: "from-primary to-[#9dff07]",
    benefits: ["Community recognition", "Contributor badge", "GitHub profile visibility"]
  },
  {
    level: "Level 2 - Advanced",
    icon: <Medal className="h-6 w-6" />,
    requirement: "15-29 contributions",
    description: "You're getting serious! Your consistent contributions are making a real impact.",
    color: "from-purple-400 to-purple-600",
    benefits: ["Advanced badge", "Priority issue assignment", "Code review privileges"]
  },
  {
    level: "Level 3 - Expert",
    icon: <Trophy className="h-6 w-6" />,
    requirement: "30+ contributions",
    description: "You're a true champion! Your expertise drives the project forward.",
    color: "from-yellow-400 to-orange-500",
    benefits: ["Expert status", "Mentorship opportunities", "Project decision input"]
  }
];

// Format date to readable format
const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short'
  });
};

export default function Contributors() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeLevel, setActiveLevel] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load contributors data
        const contributorsResponse = await fetch('/contributors.json');
        if (!contributorsResponse.ok) {
          console.error('Contributors fetch failed:', contributorsResponse.status, contributorsResponse.statusText);
          throw new Error('Failed to load contributors data');
        }
        const contributorsData = await contributorsResponse.json();
        setContributors(contributorsData);
        
        // Load last updated data (optional - don't fail if this doesn't load)
        try {
          const lastUpdatedResponse = await fetch('/lastUpdated.json');
          if (lastUpdatedResponse.ok) {
            const lastUpdatedData = await lastUpdatedResponse.json();
            setLastUpdated(lastUpdatedData.lastUpdated);
          } else {
            console.warn('LastUpdated fetch failed:', lastUpdatedResponse.status, lastUpdatedResponse.statusText);
            setLastUpdated(new Date().toISOString()); // Fallback to current date
          }
        } catch (lastUpdatedError) {
          console.warn('Error loading last updated data:', lastUpdatedError);
          setLastUpdated(new Date().toISOString()); // Fallback to current date
        }
        
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load contributors data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const topContributors = contributors.slice(0, 3);
  const stats = {
    total: contributors.length,
    level1: contributors.filter(c => c.contributions >= 1 && c.contributions < 15).length,
    level2: contributors.filter(c => c.contributions >= 15 && c.contributions < 30).length,
    level3: contributors.filter(c => c.contributions >= 30).length,
    totalContributions: contributors.reduce((sum, c) => sum + c.contributions, 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-20 py-24">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
              <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-primary/20"></div>
            </div>
            <p className="text-gray-300 text-lg">Loading our amazing contributors...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-20 py-24">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="text-6xl">😕</div>
            <p className="text-red-400 text-center text-lg">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              <Zap className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-primary opacity-20 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-20 right-1/4 w-[250px] h-[250px] bg-purple-500 opacity-15 blur-[120px] rounded-full"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-24 relative z-10">
        {/* Last Updated Banner */}
        {lastUpdated && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-gray-300 text-sm">
                Last updated: {formatDate(lastUpdated)}
              </span>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/10">
            <Users className="h-5 w-5 text-primary" />
            <span className="text-gray-300 font-medium">Open Source Heroes</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            Our Amazing <span className="text-primary">Contributors</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Meet the talented individuals who are helping build Smriti AI. Their dedication and contributions 
            make this open-source project possible.
          </p>
          
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <Card className="p-6 text-center">
              <div className="text-3xl font-extrabold text-primary mb-2">{stats.total}</div>
              <div className="text-sm text-gray-300">Contributors</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-extrabold text-purple-400 mb-2">{stats.totalContributions}</div>
              <div className="text-sm text-gray-300">Total Commits</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-extrabold text-yellow-400 mb-2">{stats.level3}</div>
              <div className="text-sm text-gray-300">Experts</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-extrabold text-blue-400 mb-2">{stats.level2}</div>
              <div className="text-sm text-gray-300">Advanced</div>
            </Card>
          </div>
        </div>

        {/* Level Requirements Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 flex items-center justify-center gap-2">
              <Target className="h-8 w-8 text-primary" />
              Contribution Levels & How to Level Up
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Climb the ranks and earn recognition for your contributions! Here's how our leveling system works:
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {levelRequirements.map((level, index) => (
              <Card 
                key={index} 
                className={`cursor-pointer transition-all duration-300 ${
                  activeLevel === index + 1 ? 'ring-2 ring-primary shadow-2xl shadow-primary/20' : ''
                }`}
                onClick={() => setActiveLevel(index + 1)}
              >
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${level.color} flex items-center justify-center mb-4 text-white`}>
                    {level.icon}
                  </div>
                  <CardTitle className="text-xl">{level.level}</CardTitle>
                  <CardDescription className="text-lg font-semibold text-primary">
                    {level.requirement}
                  </CardDescription>
                  <p className="text-sm text-gray-300 mt-2">{level.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-200">Benefits:</h4>
                    <ul className="space-y-1">
                      {level.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                          <Check className="h-3 w-3 text-primary" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Top Contributors Section */}
        {topContributors.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-8 flex items-center justify-center gap-2">
              <Trophy className="h-8 w-8 text-yellow-400" />
              Hall of Fame - Top Contributors
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {topContributors.map((contributor, index) => {
                const badge = getLevelBadge(contributor.contributions);
                return (
                  <Card key={contributor.id} className="group relative overflow-hidden">
                    <div className="absolute top-4 right-4 z-10">
                      {getRankIcon(index)}
                    </div>
                    <CardHeader className="text-center pb-4 relative z-10">
                      <div className="relative mx-auto mb-4">
                        <div className="h-24 w-24 mx-auto rounded-full ring-4 ring-primary/30 group-hover:ring-primary/60 transition-all duration-300 overflow-hidden bg-gradient-to-r from-primary/20 to-purple-500/20 group-hover:scale-110">
                          <img 
                            src={contributor.avatar_url} 
                            alt={contributor.login}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          <div className="hidden w-full h-full flex items-center justify-center text-xl font-semibold text-primary">
                            {contributor.login.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-black font-bold text-sm group-hover:scale-110 transition-transform duration-300">
                          {index + 1}
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                        {contributor.login}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        @{contributor.login}
                      </CardDescription>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-black text-xs font-medium ${badge.color} shadow-lg`}>
                        {badge.icon}
                        {badge.text}
                      </div>
                    </CardHeader>
                    <CardContent className="text-center space-y-3 relative z-10">
                      <div className="bg-white/5 backdrop-blur-md rounded-lg p-3 border border-white/10">
                        <div className="flex items-center justify-center gap-2 text-sm">
                          <GitBranch className="h-4 w-4 text-primary" />
                          <span className="font-bold text-2xl text-primary">{contributor.contributions}</span>
                          <span className="text-gray-300">contributions</span>
                        </div>
                      </div>
                      <a href={contributor.html_url} target="_blank" rel="noopener noreferrer">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                        >
                          <Github className="h-4 w-4 mr-2" />
                          View Profile
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        {contributors.length > 0 && (
          <div className="mb-16">
            <Card className="backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-2xl font-extrabold flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  Contributors Leaderboard
                </CardTitle>
                <CardDescription>
                  Complete list of all contributors ranked by their contributions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16 text-center">Rank</TableHead>
                      <TableHead>Contributor</TableHead>
                      <TableHead className="text-center">Contributions</TableHead>
                      <TableHead className="text-center">Level</TableHead>
                      <TableHead className="text-center">Profile</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contributors.map((contributor, index) => {
                      const badge = getLevelBadge(contributor.contributions);
                      return (
                        <TableRow key={contributor.id}>
                          <TableCell className="font-medium text-center">
                            <div className="flex items-center justify-center">
                              {getRankIcon(index)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full overflow-hidden bg-gradient-to-r from-primary/20 to-purple-500/20 flex items-center justify-center ring-2 ring-white/10">
                                <img 
                                  src={contributor.avatar_url} 
                                  alt={contributor.login}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                  }}
                                />
                                <div className="hidden text-sm font-medium text-primary">
                                  {contributor.login.charAt(0).toUpperCase()}
                                </div>
                              </div>
                              <div>
                                <div className="font-medium text-white">{contributor.login}</div>
                                <div className="text-sm text-gray-400">@{contributor.login}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary" className="font-bold">
                              {contributor.contributions}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-black text-xs font-medium ${badge.color} shadow-sm`}>
                              {badge.icon}
                              {badge.text}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <a href={contributor.html_url} target="_blank" rel="noopener noreferrer">
                              <Button variant="ghost" size="sm" className="hover:text-primary">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </a>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Call to Action Section */}
        <div className="text-center space-y-8 bg-gradient-to-r from-primary/20 to-purple-500/20 backdrop-blur-md rounded-3xl p-12 border border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5"></div>
          <div className="relative z-10">
            <div className="space-y-4">
              <h3 className="text-3xl md:text-4xl font-extrabold text-white">Ready to Join the Adventure? 🚀</h3>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Every expert was once a beginner. Start your contribution journey today and become part of our amazing community!
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-6">
              <a
                href="https://github.com/vatsal-bhakodia/smriti-ai"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="px-8 py-4 text-lg font-bold">
                  <Github className="h-5 w-5 mr-2" />
                  View on GitHub
                </Button>
              </a>
              <a
                href="https://github.com/vatsal-bhakodia/smriti-ai/issues"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  variant="outline" 
                  className="px-8 py-4 text-lg font-bold"
                >
                  <Code className="h-5 w-5 mr-2" />
                  Find Your First Issue
                </Button>
              </a>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8 text-sm">
              <Card className="p-4 text-center">
                <div className="font-semibold mb-2 text-primary">🌟 New Contributors</div>
                <p className="text-gray-300">Start with "good first issue" labels to get familiar with the codebase.</p>
              </Card>
              <Card className="p-4 text-center">
                <div className="font-semibold mb-2 text-primary">🔥 Regular Contributors</div>
                <p className="text-gray-300">Take on feature requests and bug fixes to level up your impact.</p>
              </Card>
              <Card className="p-4 text-center">
                <div className="font-semibold mb-2 text-primary">🏆 Expert Contributors</div>
                <p className="text-gray-300">Lead discussions, mentor others, and shape the project's future.</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}