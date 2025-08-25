import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Send, User, Mail, Phone, MessageSquare, Clock, MapPin, Heart, Star, Globe, Sparkles, Package, Calendar } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Link } from 'wouter';
import { useLocation, useParams } from 'wouter';
import { useBackgroundMusic } from '@/hooks/useBackgroundMusic';
import '../styles/premium-admin.scss';

interface Hug {
  id: string;
  Name: string;
  'Email Address': string;
  'Phone Number': number;
  'Recipient\'s Name': string;
  'Type of Message': string;
  Feelings: string;
  Story: string;
  'Specific Details': string;
  'Delivery Type': string;
  Date: string;
  Status: string;
}

interface Reply {
  id: string;
  created_at: string;
  sender_type: string;
  sender_name: string;
  message: string;
  email_sent?: boolean;
  is_read?: boolean;
  email_message_id?: string;
}

const AdminConversation = () => {
  const { id } = useParams();
  const [hug, setHug] = useState<Hug | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState('');
  const [adminName, setAdminName] = useState('CEO-The Written Hug');
  const [sending, setSending] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const audioRef = useBackgroundMusic(0.32);
  const [currentStatus, setCurrentStatus] = useState(hug?.Status || 'New');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Authentication check
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated');
    const loginTime = sessionStorage.getItem('adminLoginTime');

    if (!isAuthenticated || !loginTime) {
      toast({
        title: "Access Denied",
        description: "Please login to access admin pages.",
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
      sessionStorage.removeItem('adminUsername');
      toast({
        title: "Session Expired",
        description: "Please login again.",
        variant: "destructive"
      });
      setLocation('/admin/login');
      return;
    }

    setAuthenticated(true);
  }, [setLocation, toast]);

  useEffect(() => {
    if (id) {
      fetchConversation(id);
    }
  }, [id]);

  // Update current status when hug data loads
  useEffect(() => {
    if (hug) {
      setCurrentStatus(hug.Status || 'New');
    }
  }, [hug]);

  const fetchConversation = async (hugId: string) => {
    try {
      const response = await fetch(`/api/getConversation?hugid=${hugId}`);
      const result = await response.json();

      if (result.success) {
        setHug(result.hug);
        setReplies(result.replies);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch conversation",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Failed to connect to server",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to handle status update
  const handleStatusUpdate = async (newStatus: string) => {
    if (!hug || newStatus === currentStatus) return;

    setUpdatingStatus(true);
    try {
      const response = await fetch('/api/updateOrderStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: hug.id,
          status: newStatus
        }),
      });

      if (response.ok) {
        setCurrentStatus(newStatus);
        setHug({ ...hug, Status: newStatus });
        toast({
          title: "Status Updated",
          description: `Order status changed to ${newStatus}`,
        });
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const sendReply = async () => {
    if (!replyMessage.trim() || !id) return;

    setSending(true);
    try {
      const response = await fetch('/api/sendReply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hugid: id,
          message: replyMessage,
          admin_name: adminName,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Add the new reply to the UI immediately
        const newReply: Reply = {
          id: result.reply.id,
          created_at: result.reply.created_at,
          sender_type: 'admin',
          sender_name: adminName,
          message: replyMessage,
          email_sent: true,
          is_read: true,
        };
        setReplies([...replies, newReply]);
        setReplyMessage('');

        toast({
          title: "Reply Sent",
          description: "Your reply has been sent to the client via email",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to send reply",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Failed to send reply",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const markAsRead = async (replyId: string) => {
    try {
      const response = await fetch('/api/markEmailRead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          replyId: replyId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Update the reply in the UI
        setReplies(replies.map(reply =>
          reply.id === replyId ? { ...reply, is_read: true } : reply
        ));
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  if (!authenticated) {
    return null; // Will redirect to login
  }

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        {/* Premium Cosmic Background */}
        <div className="premium-admin-bg">
          <div className="premium-stars">
            <div id="premium-stars"></div>
            <div id="premium-stars2"></div>
            <div id="premium-stars3"></div>
          </div>
          <div className="floating-particles">
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>
            <div className="particle particle-4"></div>
            <div className="particle particle-5"></div>
          </div>
        </div>

        {/* Premium Cosmic Loading Animation */}
        <div className="premium-cosmic-loader relative z-10">
          <div className="cosmic-ring"></div>
          <div className="cosmic-text">Loading Conversation</div>
          <div className="cosmic-dots">
            <div className="cosmic-dot"></div>
            <div className="cosmic-dot"></div>
            <div className="cosmic-dot"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!hug) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        {/* Premium Cosmic Background */}
        <div className="premium-admin-bg">
          <div className="premium-stars">
            <div id="premium-stars"></div>
            <div id="premium-stars2"></div>
            <div id="premium-stars3"></div>
          </div>
          <div className="floating-particles">
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>
            <div className="particle particle-4"></div>
            <div className="particle particle-5"></div>
          </div>
        </div>

        <div className="relative z-20 text-center">
          <h2 className="text-2xl font-bold premium-text-white mb-4">Conversation not found</h2>
          <Link href="/admin/orders">
            <Button className="premium-glass-button rounded-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Premium Cosmic Background */}
      <div className="premium-admin-bg">
        <div className="premium-stars">
          <div id="premium-stars"></div>
          <div id="premium-stars2"></div>
          <div id="premium-stars3"></div>
        </div>
        <div className="floating-particles">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
          <div className="particle particle-5"></div>
        </div>
      </div>

      {/* Background Music */}
      <audio ref={audioRef} preload="auto" loop></audio>

      <div className="relative z-20 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/admin/orders">
              <Button className="premium-glass-button" data-testid="link-back-orders">
                <i></i>
                <div className="btn-content">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Orders
                </div>
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold premium-text-white">
                Conversation with {hug.Name}
              </h1>
            </div>
          </div>

          {/* Premium Order Details Card */}
          <div className="premium-glass-card p-6 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Heart className="h-5 w-5 text-rose-400" />
              <h2 className="text-xl font-bold premium-text-white">Order Details</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                  <User className="h-5 w-5 text-rose-400" />
                  <div>
                    <Label className="text-sm font-medium premium-text-gray-300 sen-font">Client Name</Label>
                    <p className="font-semibold premium-text-white sen-font" data-testid="text-client-name">{hug.Name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                  <Mail className="h-5 w-5 text-rose-400" />
                  <div>
                    <Label className="text-sm font-medium premium-text-gray-300 sen-font">Email</Label>
                    <p className="premium-text-white sen-font">{hug['Email Address']}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                  <Phone className="h-5 w-5 text-rose-400" />
                  <div>
                    <Label className="text-sm font-medium premium-text-gray-300 sen-font">Phone</Label>
                    <p className="premium-text-white sen-font">{hug['Phone Number']}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                  <Heart className="h-5 w-5 text-pink-400" />
                  <div>
                    <Label className="text-sm font-medium premium-text-gray-300 sen-font">Recipient</Label>
                    <p className="font-semibold premium-text-white sen-font">{hug['Recipient\'s Name']}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                  <Package className="h-5 w-5 text-pink-400" />
                  <div>
                    <Label className="text-sm font-medium premium-text-gray-300 sen-font">Message Type</Label>
                    <p className="premium-text-white sen-font">{hug['Type of Message']}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                  <Package className="h-5 w-5 text-pink-400" />
                  <div>
                    <Label className="text-sm font-medium premium-text-gray-300 sen-font">Delivery Type</Label>
                    <p className="premium-text-white sen-font">{hug['Delivery Type']}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                  <Calendar className="h-5 w-5 text-purple-400" />
                  <div>
                    <Label className="text-sm font-medium premium-text-gray-300 sen-font">Date Submitted</Label>
                    <p className="premium-text-white sen-font">{new Date(hug.Date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <Label className="text-sm font-medium premium-text-gray-300 sen-font">Status</Label>
                  <div className="mt-2 space-y-2">
                    <Select value={currentStatus} onValueChange={handleStatusUpdate} disabled={updatingStatus}>
                      <SelectTrigger className="bg-white/10 border-white/20 premium-text-white">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Replied">Replied</SelectItem>
                        <SelectItem value="Client Replied">Client Replied</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    {updatingStatus && (
                      <p className="text-xs text-purple-400 sen-font">Updating status...</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-rose-500/10 to-pink-500/10 rounded-lg border border-rose-500/20">
                <Label className="text-sm font-medium premium-text-gray-300 mb-2 block sen-font">Feelings</Label>
                <p className="premium-text-white leading-relaxed sen-font">{hug.Feelings}</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg border border-pink-500/20">
                <Label className="text-sm font-medium premium-text-gray-300 mb-2 block sen-font">Story</Label>
                <p className="premium-text-white leading-relaxed sen-font">{hug.Story}</p>
              </div>
              {hug['Specific Details'] && (
                <div className="p-4 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-lg border border-purple-500/20">
                  <Label className="text-sm font-medium premium-text-gray-300 mb-2 block sen-font">Specific Details</Label>
                  <p className="premium-text-white leading-relaxed sen-font">{hug['Specific Details']}</p>
                </div>
              )}
            </div>
          </div>

          {/* Premium Conversation Thread */}
          <div className="premium-glass-card p-6 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="h-5 w-5 text-rose-400" />
              <h2 className="text-xl font-bold premium-text-white">Conversation History</h2>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {replies.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="premium-text-gray-300 text-lg sen-font">No replies yet</p>
                  <p className="premium-text-gray-400 text-sm sen-font">Start the conversation with your client!</p>
                </div>
              ) : (
                replies.map((reply) => (
                  <div
                    key={reply.id}
                    className={`flex ${reply.sender_type === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg relative ${
                        reply.sender_type === 'admin'
                          ? 'bg-gradient-to-r from-rose-500/80 to-pink-600/80 premium-text-white backdrop-blur-sm'
                          : reply.is_read === false
                          ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 premium-text-white border-2 border-blue-400/50 cursor-pointer hover:from-blue-500/30 hover:to-blue-600/30 backdrop-blur-sm'
                          : 'bg-white/10 premium-text-white border border-white/20 backdrop-blur-sm'
                      }`}
                      onClick={() => {
                        if (reply.sender_type === 'client' && reply.is_read === false) {
                          markAsRead(reply.id);
                        }
                      }}
                    >
                      {/* Unread indicator */}
                      {reply.sender_type === 'client' && reply.is_read === false && (
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="premium-text-white text-xs font-bold">!</span>
                        </div>
                      )}

                      <div className="text-sm font-medium mb-2 flex items-center gap-2">
                        <span>{reply.sender_name}</span>
                        <span className="px-2 py-1 rounded-full text-xs bg-white/20">
                          {reply.sender_type}
                        </span>

                        {/* Email status indicator */}
                        {reply.sender_type === 'admin' && reply.email_sent && (
                          <span className="flex items-center gap-1 px-2 py-1 bg-green-400/20 text-green-300 rounded-full text-xs">
                            <Mail className="w-3 h-3" />
                            Sent
                          </span>
                        )}

                        {reply.sender_type === 'client' && (
                          <span className="flex items-center gap-1 px-2 py-1 bg-blue-400/20 text-blue-300 rounded-full text-xs">
                            <Mail className="w-3 h-3" />
                            Email
                          </span>
                        )}
                      </div>

                      <div className="text-sm leading-relaxed">{reply.message}</div>

                      <div className="text-xs mt-2 flex items-center justify-between opacity-80">
                        <span>
                          {new Date(reply.created_at).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>

                        {reply.sender_type === 'client' && (
                          <span className={`text-xs ${reply.is_read ? 'premium-text-gray-300' : 'text-red-300 font-medium'}`}>
                            {reply.is_read ? '✓ Read' : '● Unread'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Premium Reply Form */}
          <div className="premium-glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Send className="h-5 w-5 text-rose-400" />
              <h2 className="text-xl font-bold premium-text-white">Send Reply as CEO-The Written Hug</h2>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="premium-text-gray-300 font-medium sen-font">Reply Message</Label>
                <Textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your heartfelt reply here..."
                  rows={6}
                  className="mt-2 bg-white/10 border-white/20 premium-text-white placeholder-gray-400 resize-none backdrop-blur-md hover:bg-white/12 focus:bg-white/12 focus:border-white/30 focus:backdrop-blur-lg transition-all duration-300"
                />
              </div>
              <Button
                onClick={sendReply}
                disabled={!replyMessage.trim() || sending}
                className="w-full premium-glass-button py-4 text-lg font-medium"
              >
                <i></i>
                <div className="btn-content">
                  <Send className="h-5 w-5" />
                  {sending ? 'Sending...' : 'Send Reply'}
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminConversation;