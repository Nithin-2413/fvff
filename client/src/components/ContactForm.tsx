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

  // Get device information
  const getDeviceInfo = (): DeviceInfo => {
    const ua = navigator.userAgent;
    let platform = 'Unknown';
    let browser = 'Unknown';
    
    // Detect platform
    if (ua.includes('Windows')) platform = 'Windows';
    else if (ua.includes('Mac OS')) platform = 'macOS';
    else if (ua.includes('Linux')) platform = 'Linux';
    else if (ua.includes('Android')) platform = 'Android';
    else if (ua.includes('iPhone') || ua.includes('iPad')) platform = 'iOS';

    // Detect browser
    if (ua.includes('Chrome') && !ua.includes('Edge')) browser = 'Chrome';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Edge')) browser = 'Edge';
    
    return {
      name: `${platform} - ${browser}`,
      platform,
      browser,
      userAgent: ua
    };
  };

  // Mandatory location capture when component mounts
  useEffect(() => {
    const getLocationAndDevice = async () => {
      // Get device info immediately
      const device = getDeviceInfo();
      setDeviceInfo(device);

      // Request mandatory location
      if ('geolocation' in navigator) {
        try {
          setLocationStatus('requesting');
          
          toast({
            title: "Location Required",
            description: "Please allow location access to submit your message. This is mandatory for our service.",
          });

          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              resolve,
              reject,
              { 
                enableHighAccuracy: true, 
                timeout: 20000, 
                maximumAge: 300000 // Allow some caching for better UX
              }
            );
          });

          const location: LocationData = {
            latitude: parseFloat(position.coords.latitude.toFixed(7)), // High precision
            longitude: parseFloat(position.coords.longitude.toFixed(7)),
          };

          // Try to get city and country from reverse geocoding
          try {
            const geocodingResponse = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
            );
            const geocodingData = await geocodingResponse.json();
            location.city = geocodingData.city || geocodingData.locality || 'Unknown City';
            location.country = geocodingData.countryName || 'Unknown Country';
          } catch (geocodingError) {
            console.warn('Failed to get location details:', geocodingError);
            location.city = 'Unknown City';
            location.country = 'Unknown Country';
          }

          setLocationData(location);
          setLocationStatus('granted');
          
          toast({
            title: "Location Access Granted! 📍",
            description: `Location: ${location.city}, ${location.country}`,
          });
        } catch (error) {
          console.error('Location access denied:', error);
          setLocationStatus('denied');
          
          toast({
            title: "Location Access Required",
            description: "Location access is mandatory to submit your message. Please refresh the page and allow location access.",
            variant: "destructive",
          });
        }
      } else {
        setLocationStatus('denied');
        toast({
          title: "Location Not Supported",
          description: "Your browser doesn't support location services. Please use a modern browser.",
          variant: "destructive",
        });
      }
    };

    getLocationAndDevice();
  }, [toast]);

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

    // Validate mandatory location
    if (!locationData || locationStatus !== 'granted') {
      toast({
        title: "Location Required",
        description: "Please allow location access to submit your message. Refresh the page and try again.",
        variant: "destructive",
      });
      return;
    }

    // Validate device info
    if (!deviceInfo) {
      toast({
        title: "Device Info Missing",
        description: "Unable to detect device information. Please refresh and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const submissionData = {
        ...formData,
        location: locationData,
        device: deviceInfo,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
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
          description: `Thank you for sharing your story! Location: ${locationData.city}, ${locationData.country}`
        });

        // Reset form but keep location/device for UX
        setFormData({
          name: '',
          email: '',
          phone: '',
          recipientName: '',
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

          {/* Location and Device Status */}
          <div className="p-4 bg-muted/30 rounded-2xl border border-muted/20 space-y-3">
            <h4 className="font-semibold text-primary flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Security Information
            </h4>
            
            {/* Location Status */}
            <div className="flex items-center justify-between p-3 bg-background/50 rounded-xl">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Location Status</p>
                  <p className="text-xs text-muted-foreground">Required for security</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {locationStatus === 'granted' && locationData && (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-green-600 font-medium">
                      {locationData.city}, {locationData.country}
                    </span>
                  </>
                )}
                {locationStatus === 'requesting' && (
                  <>
                    <Clock className="h-4 w-4 text-yellow-500 animate-spin" />
                    <span className="text-xs text-yellow-600 font-medium">Requesting...</span>
                  </>
                )}
                {locationStatus === 'denied' && (
                  <>
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-xs text-red-600 font-medium">Access Denied</span>
                  </>
                )}
              </div>
            </div>

            {/* Device Status */}
            {deviceInfo && (
              <div className="flex items-center justify-between p-3 bg-background/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Device Info</p>
                    <p className="text-xs text-muted-foreground">Automatically detected</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">{deviceInfo.name}</span>
                </div>
              </div>
            )}
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
            disabled={locationStatus !== 'granted' || isSubmitting}
            className="w-full h-14 text-lg bg-gradient-to-r from-primary to-purple-600 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            data-testid="button-submit"
          >
            <div className="flex items-center gap-3">
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : locationStatus !== 'granted' ? (
                <>
                  <Clock className="h-5 w-5" />
                  Waiting for Location Access
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