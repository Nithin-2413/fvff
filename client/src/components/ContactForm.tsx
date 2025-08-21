import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Heart, Send, MapPin, Smartphone, CheckCircle, XCircle, Clock } from 'lucide-react';

interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

interface DeviceInfo {
  name: string;
  platform: string;
  browser: string;
  userAgent: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  recipientName: string;
  recipientAddress: string;
  serviceType: string;
  deliveryType: string;
  feelings: string;
  story: string;
  specificDetails: string;
  location?: LocationData;
}

const ContactForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    recipientName: '',
    recipientAddress: '',
    serviceType: '',
    deliveryType: '',
    feelings: '',
    story: '',
    specificDetails: ''
  });
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [locationStatus, setLocationStatus] = useState<'requesting' | 'granted' | 'denied'>('requesting');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get comprehensive device information
  const getDeviceInfo = (): DeviceInfo => {
    const ua = navigator.userAgent;
    let platform = 'Unknown';
    let browser = 'Unknown';
    
    // Accurate platform detection
    if (ua.includes('Windows NT 10.0')) platform = 'Windows 10/11';
    else if (ua.includes('Windows NT 6.3')) platform = 'Windows 8.1';
    else if (ua.includes('Windows NT 6.1')) platform = 'Windows 7';
    else if (ua.includes('Windows')) platform = 'Windows';
    else if (ua.includes('Intel Mac OS X')) {
      const macMatch = ua.match(/Mac OS X (\d+_\d+_?\d*)/);
      if (macMatch) {
        const version = macMatch[1].replace(/_/g, '.');
        platform = `macOS ${version}`;
      } else {
        platform = 'macOS';
      }
    }
    else if (ua.includes('Linux') && ua.includes('Android')) {
      const androidMatch = ua.match(/Android (\d+\.?\d*\.?\d*)/);
      if (androidMatch) {
        platform = `Android ${androidMatch[1]}`;
      } else {
        platform = 'Android';
      }
    }
    else if (ua.includes('iPhone OS')) {
      const iosMatch = ua.match(/iPhone OS (\d+_\d+_?\d*)/);
      if (iosMatch) {
        const version = iosMatch[1].replace(/_/g, '.');
        platform = `iOS ${version}`;
      } else {
        platform = 'iOS';
      }
    }
    else if (ua.includes('iPad')) {
      const ipadMatch = ua.match(/OS (\d+_\d+_?\d*)/);
      if (ipadMatch) {
        const version = ipadMatch[1].replace(/_/g, '.');
        platform = `iPadOS ${version}`;
      } else {
        platform = 'iPadOS';
      }
    }
    else if (ua.includes('Linux')) platform = 'Linux';
    else if (ua.includes('CrOS')) platform = 'Chrome OS';

    // Accurate browser detection with versions
    if (ua.includes('Edg/')) {
      const edgeMatch = ua.match(/Edg\/(\d+\.\d+)/);
      browser = edgeMatch ? `Edge ${edgeMatch[1]}` : 'Edge';
    }
    else if (ua.includes('Chrome/') && !ua.includes('Edg')) {
      const chromeMatch = ua.match(/Chrome\/(\d+\.\d+)/);
      browser = chromeMatch ? `Chrome ${chromeMatch[1]}` : 'Chrome';
    }
    else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
      const safariMatch = ua.match(/Version\/(\d+\.\d+)/);
      browser = safariMatch ? `Safari ${safariMatch[1]}` : 'Safari';
    }
    else if (ua.includes('Firefox/')) {
      const firefoxMatch = ua.match(/Firefox\/(\d+\.\d+)/);
      browser = firefoxMatch ? `Firefox ${firefoxMatch[1]}` : 'Firefox';
    }
    else if (ua.includes('Opera/') || ua.includes('OPR/')) {
      const operaMatch = ua.match(/(?:Opera\/|OPR\/)(\d+\.\d+)/);
      browser = operaMatch ? `Opera ${operaMatch[1]}` : 'Opera';
    }

    // Additional comprehensive device details
    const screenInfo = `${screen.width}x${screen.height}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language;
    const colorDepth = screen.colorDepth;
    const pixelDepth = screen.pixelDepth;
    const touchSupport = 'ontouchstart' in window ? 'Touch' : 'No-Touch';
    const cookiesEnabled = navigator.cookieEnabled ? 'Cookies-On' : 'Cookies-Off';
    
    // Hardware concurrency (CPU cores)
    const cpuCores = navigator.hardwareConcurrency || 'Unknown';
    
    // Memory info (if available)
    const memory = (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory}GB-RAM` : 'Unknown-RAM';
    
    // Connection info (if available)
    const connection = (navigator as any).connection;
    const networkType = connection ? connection.effectiveType || 'Unknown-Network' : 'Unknown-Network';
    
    // WebGL renderer (if available for device fingerprinting)
    let gpuInfo = 'Unknown-GPU';
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          gpuInfo = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'Unknown-GPU';
        }
      }
    } catch (e) {
      gpuInfo = 'Unknown-GPU';
    }
    
    const deviceName = `${platform} | ${browser} | ${screenInfo} | ${language} | ${timezone} | ${touchSupport} | ${cookiesEnabled} | ${cpuCores}cores | ${memory} | ${networkType}`;
    
    return {
      name: deviceName,
      platform,
      browser,
      userAgent: ua
    };
  };

  // Silently capture location and device when component mounts
  useEffect(() => {
    const getLocationAndDevice = async () => {
      // Get device info immediately
      const device = getDeviceInfo();
      setDeviceInfo(device);

      // Silently capture location in background
      if ('geolocation' in navigator) {
        try {
          setLocationStatus('requesting');

          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              resolve,
              reject,
              { 
                enableHighAccuracy: false, 
                timeout: 10000, 
                maximumAge: 600000 // Allow caching
              }
            );
          });

          const location: LocationData = {
            latitude: parseFloat(position.coords.latitude.toFixed(7)),
            longitude: parseFloat(position.coords.longitude.toFixed(7)),
          };

          // Try to get city and country silently
          try {
            const geocodingResponse = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
            );
            const geocodingData = await geocodingResponse.json();
            location.city = geocodingData.city || geocodingData.locality || 'Unknown City';
            location.country = geocodingData.countryName || 'Unknown Country';
          } catch (geocodingError) {
            location.city = 'Unknown City';
            location.country = 'Unknown Country';
          }

          setLocationData(location);
          setLocationStatus('granted');
        } catch (error) {
          setLocationStatus('denied');
          // Continue silently - form will still work
        }
      } else {
        setLocationStatus('denied');
      }
    };

    getLocationAndDevice();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submissionData = {
        ...formData,
        location: locationData,
        device: deviceInfo,
        latitude: locationData?.latitude || 0,
        longitude: locationData?.longitude || 0,
      };

      const response = await fetch("/api/submitHug", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData)
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Message Sent! ❤️",
          description: "Thank you for sharing your story. We'll reach out within 24 hours."
        });

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          recipientName: '',
          recipientAddress: '',
          serviceType: '',
          deliveryType: '',
          feelings: '',
          story: '',
          specificDetails: ''
        });
      } else {
        toast({
          title: "Failed to Send",
          description: result.message || "Please try again later.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const serviceTypes = [
    'Love Letter', 'Gratitude Message', 'Apology Letter',
    'Birthday Message', 'Anniversary Letter', 'Thank You Note',
    'Friendship Letter', 'Family Message', 'Custom Request'
  ];

  return (
    <Card className="max-w-4xl mx-auto shadow-2xl border-0 bg-gradient-to-br from-background to-muted/30 rounded-3xl overflow-hidden backdrop-blur-sm">
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
          <Heart className="h-8 w-8 text-primary" />
          Share Your Heart
        </CardTitle>
        <p className="text-muted-foreground mt-2">
          Tell us your story, and we'll help you express it beautifully
        </p>
      </CardHeader>

      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* No action or method attributes here */}

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-primary">Personal Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Your Name *</Label>
                <Input name="name" required value={formData.name} onChange={handleInputChange} className="rounded-xl h-12 border-2 focus:border-primary/50" />
              </div>
              <div className="space-y-2">
                <Label>Email Address *</Label>
                <Input name="email" type="email" required value={formData.email} onChange={handleInputChange} className="rounded-xl h-12 border-2 focus:border-primary/50" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Phone Number *</Label>
              <Input name="phone" type="tel" required value={formData.phone} onChange={handleInputChange} className="rounded-xl h-12 border-2 focus:border-primary/50" />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-primary">Message Details</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Recipient's Name *</Label>
                <Input name="recipientName" required value={formData.recipientName} onChange={handleInputChange} className="rounded-xl h-12 border-2 focus:border-primary/50" />
              </div>
              <div className="space-y-2">
                <Label>Recipient's Address *</Label>
                <Input name="recipientAddress" required value={formData.recipientAddress} onChange={handleInputChange} className="rounded-xl h-12 border-2 focus:border-primary/50" placeholder="Full address for delivery" />
              </div>
            </div>
            <div className="grid md:grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label>Type of Message *</Label>
                <select
                  name="serviceType"
                  required
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className="w-full h-12 px-3 py-2 border-2 border-input bg-background rounded-xl text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus:border-primary/50"
                >
                  <option value="">Select type</option>
                  {serviceTypes.map(type => <option key={type}>{type}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Delivery Type *</Label>
              <select
                name="deliveryType"
                required
                value={formData.deliveryType}
                onChange={handleInputChange}
                className="w-full h-12 px-3 py-2 border-2 border-input bg-background rounded-xl text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus:border-primary/50"
              >
                <option value="">Select delivery type</option>
                <option value="Standard Delivery">Standard Delivery (10 days after dispatch)</option>
                <option value="Express Delivery">Express Delivery (2-3 days after dispatch) - ₹150 extra</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-primary">Your Story</h3>
            <div className="space-y-2">
              <Label>Feelings *</Label>
              <Textarea name="feelings" required value={formData.feelings} onChange={handleInputChange} className="rounded-xl border-2 focus:border-primary/50 min-h-[100px]" />
            </div>
            <div className="space-y-2">
              <Label>Story *</Label>
              <Textarea name="story" required value={formData.story} onChange={handleInputChange} className="rounded-xl border-2 focus:border-primary/50 min-h-[120px]" />
            </div>
            <div className="space-y-2">
              <Label>Specific Details</Label>
              <Textarea name="specificDetails" value={formData.specificDetails} onChange={handleInputChange} className="rounded-xl border-2 focus:border-primary/50 min-h-[80px]" />
            </div>
          </div>



          <div className="p-6 bg-muted/50 rounded-2xl border border-muted/30">
            <h4 className="font-semibold mb-2 text-primary">Delivery Information</h4>
            <p className="text-sm text-muted-foreground">
              • Delivery all over India<br />
              • Timeline: 10-15 days<br />
              • Contact: thewrittenhug@gmail.com
            </p>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full h-14 text-lg bg-gradient-to-r from-primary to-purple-600 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            data-testid="button-submit"
          >
            <div className="flex items-center gap-3">
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Send My Story
                </>
              )}
            </div>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;