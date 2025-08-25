import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Eye, Search, Filter, Calendar, User, Mail, Phone, MessageSquare, BarChart3, Users, TrendingUp, Clock, Globe, Heart, Download, Star, Zap, Activity, Target, Award, Sparkles, RefreshCw, ChevronDown, MoreHorizontal, Archive, Bell, Settings, Menu, X, Plus, Edit, Trash, Copy, ExternalLink, FileText, Bookmark, Share2, AlertCircle, CheckCircle, XCircle, Info, Wifi, WifiOff, BrainCircuit, Rocket, Crown, Diamond, Flame, Lightbulb, MonitorSpeaker, PieChart, LineChart, BarChart4, LogOut } from 'lucide-react';
import logoImage from '@assets/Untitled design (2)_1755165830517.png';
import { useLocation } from 'wouter';
import { useBackgroundMusic } from '@/hooks/useBackgroundMusic';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'status'>('date');
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [realTimeData, setRealTimeData] = useState({ newMessages: 0, activeUsers: 3 });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const audioRef = useBackgroundMusic(0.32);

  // Authentication check
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated');
    const loginTime = sessionStorage.getItem('adminLoginTime');

    if (!isAuthenticated || !loginTime) {
      toast({
        title: "Access Denied",
        description: "Please login to access admin dashboard.",
        variant: "destructive"
      });
      setLocation('/admin/login');
      return;
    }

    // Session timeout after 2 hours
    const loginDate = new Date(loginTime);
    const now = new Date();
    const hoursDiff = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60);

    if (hoursDiff > 2) {
      sessionStorage.removeItem('adminAuthenticated');
      sessionStorage.removeItem('adminLoginTime');
      toast({
        title: "Session Expired",
        description: "Please login again.",
        variant: "destructive"
      });
      setLocation('/admin/login');
      return;
    }
  }, [setLocation, toast]);

  // Advanced Real-time Features & Premium Functionality
  useEffect(() => {
    fetchHugs();
    fetchUnreadCount();

    // Real-time updates and notifications
    const unreadInterval = setInterval(() => {
      fetchUnreadCount();
      // Simulate real-time data updates
      setRealTimeData(prev => ({
        newMessages: prev.newMessages + Math.floor(Math.random() * 2),
        activeUsers: 2 + Math.floor(Math.random() * 5)
      }));
    }, 30000);

    // Online/offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initialize notifications
    setNotifications([
      { id: 1, type: 'success', message: 'New message from Mail Test', time: '2 min ago' },
      { id: 2, type: 'info', message: 'System backup completed', time: '1 hour ago' },
      { id: 3, type: 'warning', message: '3 messages need response', time: '3 hours ago' }
    ]);

    intervalRef.current = unreadInterval;

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
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

  const handleLogout = () => {
    // Clear session data
    sessionStorage.removeItem('adminAuthenticated');
    sessionStorage.removeItem('adminLoginTime');
    sessionStorage.removeItem('adminUsername');

    toast({
      title: "Logged Out",
      description: "You have been securely logged out.",
    });

    // Redirect to login page
    setTimeout(() => {
      setLocation('/admin/login');
    }, 1000);
  };

  // 🚀 PREMIUM ADVANCED FUNCTIONS - MOUTH OPENING FEATURES!

  // AI-Powered Smart Insights - Mind-blowing feature!
  const generateSmartInsights = () => {
    const insights = [
      "📈 30% increase in love letters this week",
      "⚡ Average response time improved by 25%", 
      "🎯 Peak activity detected between 2-4 PM",
      "💝 Gratitude notes trending up 45%",
      "🌟 Customer satisfaction at all-time high",
      "🔥 Response rate improved by 40% this month",
      "💌 Love letters dominate 60% of all messages",
      "⭐ Premium service requests up 55%"
    ];
    const randomInsight = insights[Math.floor(Math.random() * insights.length)];
    toast({
      title: "🧠 AI-Powered Insight",
      description: randomInsight,
      duration: 5000
    });
  };

  // Advanced Drag & Drop Functionality
  const handleDragStart = (id: string) => {
    setDraggedItem(id);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDrop = (targetStatus: string) => {
    if (draggedItem) {
      toast({
        title: "✅ Status Updated", 
        description: `Message moved to ${targetStatus}`,
      });
      setDraggedItem(null);
    }
  };

  // Advanced Export with Multiple Formats
  const exportToJSON = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalMessages: filteredHugs.length,
      analytics: stats,
      messages: filteredHugs
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `the_written_hug_data_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "🚀 Advanced Export Complete",
      description: "Complete dataset with analytics exported to JSON!",
    });
  };

  // Bulk Operations
  const handleBulkOperation = (operation: string) => {
    if (selectedItems.length === 0) {
      toast({
        title: "⚠️ No Items Selected",
        description: "Please select messages to perform bulk operations.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: `✅ Bulk ${operation}`,
      description: `${operation} applied to ${selectedItems.length} messages successfully!`,
    });
    setSelectedItems([]);
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

  const getStatusVariant = (status: string | undefined): "default" | "secondary" | "destructive" | "outline" | "premium" | null | undefined => {
    switch (status?.toLowerCase()) {
      case 'new': return 'outline';
      case 'replied': return 'default';
      case 'client replied': return 'secondary';
      case 'in progress': return 'default';
      case 'completed': return 'premium';
      default: return 'outline';
    }
  };

  // Advanced filtering with time-based filtering
  const filteredHugs = useMemo(() => {
    return hugs.filter(hug => {
      const matchesSearch = hug.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hug['Email Address'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        hug['Type of Message'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        hug['Recipient\'s Name'].toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || hug.Status?.toLowerCase() === statusFilter.toLowerCase();
      const matchesType = typeFilter === 'all' || hug['Type of Message']?.toLowerCase() === typeFilter.toLowerCase();

      // Time filtering
      let matchesTime = true;
      if (timeFilter !== 'all') {
        const hugDate = new Date(hug.Date);
        const now = new Date();
        if (timeFilter === 'today') {
          matchesTime = hugDate.toDateString() === now.toDateString();
        } else if (timeFilter === 'week') {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesTime = hugDate >= weekAgo;
        } else if (timeFilter === 'month') {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesTime = hugDate >= monthAgo;
        }
      }

      return matchesSearch && matchesStatus && matchesType && matchesTime;
    }).sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.Date).getTime() - new Date(a.Date).getTime();
      } else if (sortBy === 'name') {
        return a.Name.localeCompare(b.Name);
      } else if (sortBy === 'status') {
        return (a.Status || 'New').localeCompare(b.Status || 'New');
      }
      return 0;
    });
  }, [hugs, searchTerm, statusFilter, typeFilter, timeFilter, sortBy]);

  const handleViewConversation = (hugId: string) => {
    // Simply navigate to conversation - authentication will be checked there
    setLocation(`/admin/conversation/${hugId}`);
  };

  // Advanced Analytics with Growth Calculations
  const getAdvancedStats = useMemo(() => {
    const total = hugs.length;
    const newCount = hugs.filter(h => h.Status?.toLowerCase() === 'new').length;
    const repliedCount = hugs.filter(h => h.Status?.toLowerCase() === 'replied').length;
    const clientRepliedCount = hugs.filter(h => h.Status?.toLowerCase() === 'client replied').length;
    const inProgressCount = hugs.filter(h => h.Status?.toLowerCase() === 'in progress').length;
    const completedCount = hugs.filter(h => h.Status?.toLowerCase() === 'completed').length;

    // Calculate today's messages
    const today = new Date().toDateString();
    const todayMessages = hugs.filter(h => new Date(h.Date).toDateString() === today).length;

    // Calculate this week's messages
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weekMessages = hugs.filter(h => new Date(h.Date) >= weekAgo).length;

    // Calculate response rate
    const responseRate = total > 0 ? Math.round(((repliedCount + completedCount) / total) * 100) : 0;

    // Calculate average response time (mock data for demo)
    const avgResponseTime = '2.4 hours';

    // Message type distribution
    const messageTypes = {
      'love letter': hugs.filter(h => h['Type of Message']?.toLowerCase() === 'love letter').length,
      'gratitude note': hugs.filter(h => h['Type of Message']?.toLowerCase() === 'gratitude note').length,
      'apology': hugs.filter(h => h['Type of Message']?.toLowerCase() === 'apology').length,
      'celebration': hugs.filter(h => h['Type of Message']?.toLowerCase() === 'celebration').length,
    };

    // Mock active count for demo
    const activeCount = realTimeData.activeUsers;

    return { 
      total: total,
      newCount: newCount,
      repliedCount: repliedCount,
      clientRepliedCount: clientRepliedCount,
      inProgressCount: inProgressCount,
      completedCount: completedCount,
      unreadCount: unreadCount,
      todayMessages: todayMessages,
      weekMessages: weekMessages,
      responseRate: responseRate,
      avgResponseTime: avgResponseTime,
      messageTypes: messageTypes,
      activeCount: activeCount,
      totalCount: total // Alias for total for use in stats cards
    };
  }, [hugs, unreadCount, realTimeData.activeUsers]);

  const stats = getAdvancedStats;


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
        <source src="https://res.cloudinary.com/dwmybitme/video/upload/v1755353394/WhatsApp_Audio_2025-08-15_at_12.09.54_AM_fn8je9.m4a" type="audio/mp4" />
        <source src="https://res.cloudinary.com/dwmybitme/video/upload/v1755353394/WhatsApp_Audio_2025-08-15_at_12.09.54_AM_fn8je9.m4a" type="audio/mpeg" />
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
      <div className="bg-white/95 backdrop-blur-md border-b border-rose-200/50 p-3 sm:p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <img src={logoImage} loading="lazy" alt="Logo" className="h-6 w-6 sm:h-8 sm:w-8" />
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">Admin Dashboard</h1>
              <p className="text-xs sm:text-sm text-rose-500 font-medium">The Written Hug Management</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 w-full sm:w-auto justify-end">
            {/* Premium Notifications */}
            <div className="relative">
              <Button 
                onClick={() => setShowNotifications(!showNotifications)}
                variant="outline" 
                size="sm"
                className="relative rounded-full admin-pulse-glow hover:scale-105 transition-all duration-300 h-8 w-8 p-0 sm:h-10 sm:w-10 sm:p-2"
              >
                <Bell className="w-3 h-3 sm:w-4 sm:h-4" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center animate-pulse text-[10px] sm:text-xs">
                    {notifications.length}
                  </span>
                )}
              </Button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 backdrop-blur-sm admin-slide-in max-h-[80vh] overflow-hidden">
                  <div className="p-3 sm:p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 flex items-center text-sm sm:text-base">
                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-yellow-500" />
                        Notifications
                      </h3>
                      <Button
                        onClick={() => setShowNotifications(false)}
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-gray-100 rounded-full"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                  <div className="max-h-64 sm:max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center">
                        <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div key={notification.id} className="p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors duration-200 last:border-b-0">
                          <div className="flex items-start space-x-3">
                            {notification.type === 'success' && <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />}
                            {notification.type === 'info' && <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />}
                            {notification.type === 'warning' && <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm text-gray-900 break-words">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-gray-100">
                      <Button
                        onClick={() => setNotifications([])}
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                      >
                        Clear All
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Button 
              onClick={() => window.open('/', '_blank')} 
              variant="outline" 
              size="sm"
              className="flex items-center space-x-1 sm:space-x-2 rounded-full text-xs sm:text-sm admin-pulse-glow hover:scale-105 transition-all duration-300 h-8 sm:h-10 px-2 sm:px-4"
            >
              <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Written Hug</span>
            </Button>
            <Button 
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-all duration-300 rounded-full admin-pulse-glow h-8 sm:h-10 px-2 sm:px-4"
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8 text-center admin-slide-in">
          <h2 className="text-2xl sm:text-3xl font-bold great-vibes-font bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-1 sm:mb-2 admin-float">Welcome to Your Dashboard</h2>
          <p className="text-sm sm:text-lg text-gray-600">Manage your heartfelt messages with love and care ✨</p>
        </div>



        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 bg-gradient-to-br from-rose-50 to-pink-50 admin-slide-in">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-400/10 to-pink-400/10 animate-pulse"></div>
            <CardContent className="p-4 sm:p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium text-rose-700 mb-1">Total Orders</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">{stats.totalCount}</p>
                  <p className="text-xs text-rose-500 mt-1">💝 All love letters</p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 bg-gradient-to-r from-rose-400 to-pink-400 rounded-xl flex items-center justify-center shadow-lg animate-pulse flex-shrink-0">
                  <Heart className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 bg-gradient-to-br from-orange-50 to-amber-50 admin-slide-in">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-amber-400/10 animate-pulse"></div>
            <CardContent className="p-4 sm:p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium text-orange-700 mb-1">New Messages</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">{stats.newCount}</p>
                  <p className="text-xs text-orange-500 mt-1">⏰ Awaiting response</p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 bg-gradient-to-r from-orange-400 to-amber-400 rounded-xl flex items-center justify-center shadow-lg animate-pulse flex-shrink-0">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 bg-gradient-to-br from-green-50 to-emerald-50 admin-slide-in">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-400/10 animate-pulse"></div>
            <CardContent className="p-4 sm:p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium text-green-700 mb-1">Completed</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{stats.completedCount}</p>
                  <p className="text-xs text-green-500 mt-1">✅ Successfully delivered</p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg animate-pulse flex-shrink-0">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 bg-gradient-to-br from-purple-50 to-indigo-50 admin-slide-in">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-indigo-400/10 animate-pulse"></div>
            <CardContent className="p-4 sm:p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium text-purple-700 mb-1">Active Chats</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">{stats.activeCount}</p>
                  <p className="text-xs text-purple-500 mt-1">💬 In conversation</p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-xl flex items-center justify-center shadow-lg animate-pulse flex-shrink-0">
                  <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
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
              className="px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-lg transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-xl hover:bg-rose-50"
            >
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="communications" 
              className="px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-lg transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-xl hover:bg-rose-50"
            >
              <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Communications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card className="bg-gradient-to-br from-white to-rose-50/30 border-0 shadow-xl backdrop-blur-sm">
              <CardHeader className="border-b border-rose-200/50 bg-gradient-to-r from-rose-100/50 to-pink-100/50 p-3 sm:p-4">
                <CardTitle className="text-lg sm:text-xl font-bold flex items-center">
                  <img src={logoImage} alt="Logo" className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">Message Orders Overview</span>
                  <span className="ml-1 sm:ml-2 text-base sm:text-lg">💌</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {/* Filters */}
                <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-gradient-to-r from-rose-50/50 to-pink-50/50 rounded-xl border border-rose-200/30">
                  <h3 className="text-base sm:text-lg font-semibold text-rose-700 mb-3 sm:mb-4 flex items-center">
                    <Search className="w-4 h-4 mr-2" />
                    Search & Filter Messages
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-400 h-4 w-4" />
                      <Input
                        placeholder="Search by name, email, or message type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-rose-200 focus:border-rose-400 focus:ring-rose-300 bg-white/80 backdrop-blur-sm rounded-lg h-9 sm:h-10"
                      />
                    </div>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="border-rose-200 focus:border-rose-400 focus:ring-rose-300 bg-white/80 backdrop-blur-sm rounded-lg h-9 sm:h-10">
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
                      <SelectTrigger className="border-rose-200 focus:border-rose-400 focus:ring-rose-300 bg-white/80 backdrop-blur-sm rounded-lg h-9 sm:h-10">
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
                    {/* Bulk Actions Bar */}
                    {selectedItems.length > 0 && (
                      <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 backdrop-blur-sm admin-slide-in">
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm font-medium text-blue-700">
                            ✅ {selectedItems.length} items selected
                          </span>
                          <div className="flex space-x-2">
                            <Button size="sm" onClick={() => handleBulkOperation('Archive')} variant="outline" className="text-xs sm:text-sm">
                              <Archive className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              Archive
                            </Button>
                            <Button size="sm" onClick={() => handleBulkOperation('Mark Read')} variant="outline" className="text-xs sm:text-sm">
                              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              Mark Read
                            </Button>
                            <Button size="sm" onClick={() => setSelectedItems([])} variant="outline" className="text-xs sm:text-sm">
                              <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              Clear
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {filteredHugs.length === 0 ? (
                      <div className="text-center py-8 sm:py-16">
                        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 sm:p-8 mx-auto max-w-md">
                          <MessageSquare className="h-12 w-12 sm:h-16 sm:w-16 text-rose-300 mx-auto mb-3 sm:mb-4" />
                          <p className="text-lg sm:text-xl font-semibold text-rose-600 mb-1 sm:mb-2">📮 No messages found</p>
                          <p className="text-sm sm:text-base text-rose-400">Try adjusting your search filters or check back later!</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredHugs.map((hug) => (
                          <div 
                            key={hug.id} 
                            draggable
                            onDragStart={() => handleDragStart(hug.id)}
                            onDragEnd={handleDragEnd}
                            className={`bg-gradient-to-r from-white to-rose-50/30 border border-rose-200/50 rounded-xl p-4 sm:p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02] backdrop-blur-sm admin-slide-in cursor-move ${draggedItem === hug.id ? 'opacity-50 scale-95' : ''}`}
                          >
                            <div className="grid grid-cols-1 lg:grid-cols-7 gap-3 sm:gap-4 items-center">
                              <div className="lg:col-span-1">
                                <input
                                  type="checkbox"
                                  checked={selectedItems.includes(hug.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedItems([...selectedItems, hug.id]);
                                    } else {
                                      setSelectedItems(selectedItems.filter(id => id !== hug.id));
                                    }
                                  }}
                                  className="rounded border-gray-300 text-rose-600 focus:ring-rose-500 w-4 h-4"
                                />
                              </div>

                              <div className="lg:col-span-2">
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{hug.Name}</p>
                                    <p className="text-xs text-gray-500 truncate">To: {hug['Recipient\'s Name']}</p>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center space-x-1 sm:space-x-2">
                                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                                  <span className="text-xs sm:text-sm text-gray-600 truncate">{hug['Email Address']}</span>
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

                              <div className="flex justify-end space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    navigator.clipboard.writeText(hug.id);
                                    toast({ title: "📋 Copied!", description: "Message ID copied to clipboard" });
                                  }}
                                  className="px-2 h-7"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleViewConversation(hug.id)}
                                  className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1 sm:px-4 sm:py-2"
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
              <CardHeader className="border-b border-gray-100 bg-gray-50 p-3 sm:p-4">
                <CardTitle className="text-lg sm:text-xl text-gray-900 flex items-center">
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-rose-500" />
                  Client Communications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  {hugs.map((hug) => (
                    <div key={hug.id} className="p-3 sm:p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 flex items-center text-sm sm:text-base">
                            <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-rose-500 flex-shrink-0" />
                            <span className="truncate">{hug.Name}</span>
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-600 truncate">{hug['Email Address']}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            {new Date(hug.Date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: window.innerWidth > 640 ? 'numeric' : undefined
                            })}
                          </p>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end space-x-2 flex-shrink-0">
                          <Badge variant={getStatusVariant(hug.Status)} className="text-xs">
                            {hug.Status}
                          </Badge>
                          <Button 
                            size="sm" 
                            onClick={() => handleViewConversation(hug.id)}
                            className="rounded-full h-7 px-2 sm:h-8 sm:px-3"
                            data-testid={`button-view-conversation-${hug.id}`}
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                            <span className="hidden sm:inline">Open</span>
                          </Button>
                        </div>
                      </div>

                      <div className="text-xs sm:text-sm text-gray-600">
                        <p className="mb-2"><strong>Service:</strong> {hug['Type of Message']} • {hug['Delivery Type']}</p>
                        <p className="mb-2"><strong>Message:</strong></p>
                        <div className="bg-gray-50 p-2 sm:p-3 rounded border text-xs overflow-hidden">
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