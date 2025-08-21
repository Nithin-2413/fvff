import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Eye, Search, Filter, Calendar, User, Mail, Phone, MessageSquare, BarChart3, Users, TrendingUp, Clock, Globe, Heart } from 'lucide-react';
import logoImage from '@assets/Untitled design (2)_1755165830517.png';
import { useLocation } from 'wouter';
const backgroundMusic = 'https://res.cloudinary.com/dwmybitme/video/upload/v1755353394/WhatsApp_Audio_2025-08-15_at_12.09.54_AM_fn8je9.m4a';

interface Hug {
  id: string;
  Name: string;
  'Recipient\'s Name': string;
  'Email Address': string;
  'Phone Number': number;
  'Type of Message': string;
  'Message Details': string;
  Feelings: string;
  Story: string;
  'Specific Details': string;
  'Delivery Type': string;
  Status: string;
  Date: string;
}

const AdminDashboard = () => {
  const [hugs, setHugs] = useState<Hug[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    fetchHugs();
    fetchUnreadCount();
    
    // Setup background music
    const setupBackgroundMusic = () => {
      if (audioRef.current) {
        const audio = audioRef.current;
        audio.volume = 0.32;
        audio.loop = true;
        audio.preload = 'auto';
        audio.autoplay = true;
        audio.muted = false;
        
        // Enhanced auto-play for all devices including mobile
        const playMusic = async () => {
          // Strategy 1: Direct play
          try {
            await audio.play();
            console.log('Music started automatically');
            return;
          } catch (e) {
            console.log('Direct play failed, trying muted approach');
          }

          // Strategy 2: Muted play then unmute
          try {
            audio.muted = true;
            await audio.play();
            audio.muted = false;
            console.log('Music started with muted workaround');
            return;
          } catch (e) {
            console.log('Muted approach failed, setting up interaction listeners');
          }

          // Strategy 3: Comprehensive interaction listeners for mobile
          const startMusic = async () => {
            try {
              await audio.play();
              console.log('Music started on user interaction');
              ['click', 'touchstart', 'touchend', 'touchmove', 'scroll', 'mousemove', 'keydown', 'focus'].forEach(event => {
                document.removeEventListener(event, startMusic);
                window.removeEventListener(event, startMusic);
              });
            } catch (err) {
              console.log('Failed to start music even with interaction:', err);
            }
          };
            
          ['click', 'touchstart', 'touchend', 'touchmove', 'scroll', 'mousemove', 'keydown'].forEach(event => {
            document.addEventListener(event, startMusic, { once: true, passive: true });
          });
          ['focus', 'blur', 'resize', 'orientationchange'].forEach(event => {
            window.addEventListener(event, startMusic, { once: true });
          });

          // Special mobile device handling
          if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            setTimeout(() => {
              if (audio.paused) {
                console.log('Mobile device detected, trying delayed start');
                playMusic();
              }
            }, 1500);
          }
        };

        // Start music
        playMusic();
      }
    };

    setupBackgroundMusic();
    
    // Set up periodic refresh for unread count
    const interval = setInterval(fetchUnreadCount, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchHugs = async () => {
    try {
      const response = await fetch('/api/getHugs');
      const result = await response.json();

      if (result.success) {
        setHugs(result.hugs || []);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch hugs",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching hugs:', error);
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('/api/getUnreadCount');
      const result = await response.json();
      if (result.success) {
        setUnreadCount(result.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'replied': return 'bg-green-100 text-green-800 border-green-200';
      case 'client replied': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'in progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredHugs = hugs.filter(hug => {
    const matchesSearch = hug.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hug['Email Address'].toLowerCase().includes(searchTerm.toLowerCase()) ||
      hug['Type of Message'].toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || hug.Status?.toLowerCase() === statusFilter.toLowerCase();
    const matchesType = typeFilter === 'all' || hug['Type of Message']?.toLowerCase() === typeFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleViewConversation = (hugId: string) => {
    setLocation(`/admin/conversation/${hugId}`);
  };

  const getStats = () => {
    const total = hugs.length;
    const newCount = hugs.filter(h => h.Status?.toLowerCase() === 'new').length;
    const repliedCount = hugs.filter(h => h.Status?.toLowerCase() === 'replied').length;
    const clientRepliedCount = hugs.filter(h => h.Status?.toLowerCase() === 'client replied').length;
    const inProgressCount = hugs.filter(h => h.Status?.toLowerCase() === 'in progress').length;
    
    return { total, newCount, repliedCount, clientRepliedCount, inProgressCount, unreadCount };
  };

  const stats = getStats();

  const handleLogout = () => {
    sessionStorage.removeItem('adminLoggedIn');
    setLocation('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 relative overflow-hidden">
      {/* Cosmic Premium Background */}
      <div className="cosmic-background"></div>
      
      {/* Animated Star Background */}
      <div className="star-background">
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
        <div className="night">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="shooting_star"></div>
          ))}
        </div>
      </div>
      
      {/* Background Music */}
      <audio ref={audioRef} preload="auto">
        <source src={backgroundMusic} type="audio/mp4" />
        <source src={backgroundMusic} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      {/* Background Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Sparse floating elements with gentle animations */}
        <div className="absolute top-16 left-8 animate-float opacity-20">
          <Heart className="w-6 h-6 text-rose-100 fill-current" />
        </div>
        <div className="absolute top-64 right-16 animate-float delay-2000 opacity-15">
          <span className="text-2xl">💌</span>
        </div>
        <div className="absolute top-96 left-1/4 animate-float delay-4000 opacity-20">
          <span className="text-xl">✨</span>
        </div>
        <div className="absolute top-40 right-1/3 animate-float delay-6000 opacity-15">
          <Heart className="w-5 h-5 text-pink-100 fill-current" />
        </div>
        <div className="absolute top-[200px] left-2/3 animate-float delay-8000 opacity-20">
          <span className="text-lg">⭐</span>
        </div>
        <div className="absolute top-[350px] right-24 animate-float delay-10000 opacity-15">
          <span className="text-xl">💝</span>
        </div>
        <div className="absolute top-[500px] left-16 animate-float delay-12000 opacity-20">
          <span className="text-lg">🌟</span>
        </div>
        <div className="absolute top-[650px] right-2/3 animate-float delay-14000 opacity-15">
          <Heart className="w-4 h-4 text-rose-100 fill-current" />
        </div>
      </div>
      
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-purple-50 shadow-lg border-b border-rose-200/50 relative z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <img src="https://res.cloudinary.com/dwmybitme/image/upload/v1755357106/image_1_o0l7go.png" alt="Logo" className="h-8 w-8" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">Admin Dashboard</h1>
                <p className="text-xs sm:text-sm text-rose-500 font-medium">The Written Hug Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <Button 
                onClick={() => window.open('/', '_blank')} 
                variant="outline" 
                size="sm"
                className="flex items-center space-x-1 sm:space-x-2 rounded-full text-xs sm:text-sm admin-pulse-glow hover:scale-105 transition-all duration-300"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">Written Hug</span>
              </Button>
              <Button onClick={handleLogout} variant="outline" size="sm" className="rounded-full text-xs sm:text-sm hover:scale-105 transition-all duration-300">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Welcome Section */}
        <div className="mb-8 text-center admin-slide-in">
          <h2 className="text-3xl font-bold great-vibes-font bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-2 admin-float">Welcome to Your Dashboard</h2>
          <p className="text-gray-600 text-lg">Manage your heartfelt messages with love and care ✨</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-cyan-50 admin-slide-in">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 animate-pulse"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 mb-1">Total Messages</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{stats.total}</p>
                  <p className="text-xs text-blue-500 mt-1">💌 All time</p>
                </div>
                <div className="h-14 w-14 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                  <MessageSquare className="h-7 w-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-orange-50 to-amber-50 admin-slide-in">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-amber-400/10 animate-pulse"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700 mb-1">New Messages</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">{stats.newCount}</p>
                  <p className="text-xs text-orange-500 mt-1">⏰ Awaiting response</p>
                </div>
                <div className="h-14 w-14 bg-gradient-to-r from-orange-400 to-amber-400 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                  <Clock className="h-7 w-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-green-50 to-emerald-50 admin-slide-in">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-400/10 animate-pulse"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 mb-1">Replied</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{stats.repliedCount}</p>
                  <p className="text-xs text-green-500 mt-1">✅ Completed</p>
                </div>
                <div className="h-14 w-14 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-purple-50 to-pink-50 admin-slide-in">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-pink-400/10 animate-pulse"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700 mb-1">In Progress</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{stats.inProgressCount}</p>
                  <p className="text-xs text-purple-500 mt-1">🎨 Being crafted</p>
                </div>
                <div className="h-14 w-14 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="h-7 w-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="bg-gradient-to-r from-white to-rose-50 border-2 border-rose-200/50 p-1 rounded-xl shadow-lg backdrop-blur-sm">
            <TabsTrigger 
              value="orders" 
              className="px-6 py-3 text-sm font-medium rounded-lg transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-xl hover:bg-rose-50"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              📈 Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="communications" 
              className="px-6 py-3 text-sm font-medium rounded-lg transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-xl hover:bg-rose-50"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              💬 Communications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card className="bg-gradient-to-br from-white to-rose-50/30 border-0 shadow-xl backdrop-blur-sm">
              <CardHeader className="border-b border-rose-200/50 bg-gradient-to-r from-rose-100/50 to-pink-100/50">
                <CardTitle className="text-xl font-bold flex items-center">
                  <img src="https://res.cloudinary.com/dwmybitme/image/upload/v1755357106/image_1_o0l7go.png" alt="Logo" className="w-6 h-6 mr-3" />
                  <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">Message Orders Overview</span>
                  <span className="ml-2 text-lg">💌</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {/* Filters */}
                <div className="mb-8 p-4 bg-gradient-to-r from-rose-50/50 to-pink-50/50 rounded-xl border border-rose-200/30">
                  <h3 className="text-lg font-semibold text-rose-700 mb-4 flex items-center">
                    🔍 Search & Filter Messages
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-400 h-4 w-4" />
                      <Input
                        placeholder="Search by name, email, or message type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-rose-200 focus:border-rose-400 focus:ring-rose-300 bg-white/80 backdrop-blur-sm rounded-lg"
                      />
                    </div>
                    
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="border-rose-200 focus:border-rose-400 focus:ring-rose-300 bg-white/80 backdrop-blur-sm rounded-lg">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="replied">Replied</SelectItem>
                      <SelectItem value="in progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>

                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="border-rose-200 focus:border-rose-400 focus:ring-rose-300 bg-white/80 backdrop-blur-sm rounded-lg">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="love letter">Love Letter</SelectItem>
                      <SelectItem value="gratitude note">Gratitude Note</SelectItem>
                      <SelectItem value="apology">Apology</SelectItem>
                      <SelectItem value="celebration">Celebration</SelectItem>
                    </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Orders Table */}
                <div className="overflow-x-auto">
                  <div className="min-w-full">
                    {filteredHugs.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8 mx-auto max-w-md">
                          <MessageSquare className="h-16 w-16 text-rose-300 mx-auto mb-4" />
                          <p className="text-rose-600 text-xl font-semibold mb-2">📮 No messages found</p>
                          <p className="text-rose-400 text-sm">Try adjusting your search filters or check back later!</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredHugs.map((hug) => (
                          <div key={hug.id} className="bg-gradient-to-r from-white to-rose-50/30 border border-rose-200/50 rounded-xl p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02] backdrop-blur-sm admin-slide-in">
                            <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                              <div className="lg:col-span-2">
                                <div className="flex items-center space-x-3">
                                  <User className="h-5 w-5 text-gray-400" />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{hug.Name}</p>
                                    <p className="text-xs text-gray-500 truncate">To: {hug['Recipient\'s Name']}</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <div className="flex items-center space-x-2">
                                  <Mail className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-600 truncate">{hug['Email Address']}</span>
                                </div>
                              </div>
                              
                              <div>
                                <Badge variant="outline" className="text-xs">
                                  {hug['Type of Message']}
                                </Badge>
                              </div>
                              
                              <div>
                                <Badge className={`text-xs border hover:opacity-80 transition-opacity ${getStatusColor(hug.Status)}`}>
                                  {hug.Status || 'New'}
                                </Badge>
                              </div>
                              
                              <div className="flex justify-end">
                                <Button
                                  size="sm"
                                  onClick={() => handleViewConversation(hug.id)}
                                  className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2"
                                  data-testid={`button-view-${hug.id}`}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communications">
            <Card className="bg-white border-0 shadow-md">
              <CardHeader className="border-b border-gray-100 bg-gray-50">
                <CardTitle className="text-xl text-gray-900 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-rose-500" />
                  Client Communications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {filteredHugs.map((hug) => (
                    <div key={hug.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{hug.Name}</h3>
                          <p className="text-sm text-gray-500">{hug['Email Address']} • {new Date(hug.Date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`text-xs border ${getStatusColor(hug.Status)}`}>
                            {hug.Status || 'New'}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewConversation(hug.id)}
                            className="rounded-full"
                            data-testid={`button-view-conversation-${hug.id}`}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Open
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <p className="mb-2"><strong>Service:</strong> {hug['Type of Message']} • {hug['Delivery Type']}</p>
                        <p className="mb-2"><strong>Message:</strong></p>
                        <div className="bg-gray-50 p-3 rounded border text-xs overflow-hidden">
                          <p className="line-clamp-2">{hug.Feelings}</p>
                          {hug.Story && (
                            <p className="mt-2 line-clamp-2 text-gray-500">{hug.Story}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;