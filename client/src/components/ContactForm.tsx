import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Heart, Send, MapPin, Smartphone, CheckCircle, XCircle, Clock, ChevronDown } from 'lucide-react';

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

// Custom Premium Dropdown Component
const PremiumDropdown = ({ label, value, onChange, options, placeholder, name, required = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value) || { label: placeholder };

  return (
    <div className="relative" ref={dropdownRef}>
      <Label>{label} {required && '*'}</Label>
      <div
        className="w-full h-12 px-4 py-3 bg-white border-2 border-gray-300 rounded-xl cursor-pointer flex items-center justify-between transition-all duration-300 hover:border-gray-400 hover:shadow-md focus-within:border-purple-500 focus-within:shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)',
          boxShadow: isOpen ? '0 8px 25px rgba(0, 0, 0, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.08)'
        }}
      >
        <span className={`text-sm ${!value ? 'text-gray-500' : 'text-black'}`}>
          {selectedOption.label}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`} 
        />
      </div>
      
      {/* Dropdown Options */}
      <div
        className={`absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl transition-all duration-300 ease-out ${
          isOpen 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-[-8px] scale-95 pointer-events-none'
        }`}
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 0, 0, 0.08)'
        }}
      >
        <div className="max-h-48 overflow-y-auto py-2">
          {options.map((option, index) => (
            <div
              key={option.value || index}
              className="px-4 py-3 text-sm cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:text-purple-700 flex items-center"
              onClick={() => handleSelect(option.value)}
              style={{
                borderBottom: index < options.length - 1 ? '1px solid rgba(0, 0, 0, 0.05)' : 'none'
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ContactForm = () => {
  const { toast } = useToast();
  
  // Load cached form data on component mount
  const loadCachedFormData = (): FormData => {
    try {
      const cached = localStorage.getItem('contactFormData');
      if (cached) {
        const parsedData = JSON.parse(cached);
        // Check if cached data is less than 30 minutes old
        const cacheTime = localStorage.getItem('contactFormCacheTime');
        if (cacheTime && Date.now() - parseInt(cacheTime) < 30 * 60 * 1000) {
          return { ...getEmptyFormData(), ...parsedData };
        }
      }
    } catch (error) {
      console.log('Failed to load cached form data');
    }
    return getEmptyFormData();
  };
  
  const getEmptyFormData = (): FormData => ({
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

  const [formData, setFormData] = useState<FormData>(loadCachedFormData());
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [locationStatus, setLocationStatus] = useState<'requesting' | 'granted' | 'denied'>('requesting');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

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
      if (gl && 'getExtension' in gl) {
        const webglContext = gl as WebGLRenderingContext;
        const debugInfo = webglContext.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          gpuInfo = webglContext.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'Unknown-GPU';
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
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`,
              {
                method: 'GET',
                mode: 'cors',
                cache: 'default'
              }
            );
            if (geocodingResponse.ok) {
              const geocodingData = await geocodingResponse.json();
              location.city = geocodingData.city || geocodingData.locality || 'Unknown City';
              location.country = geocodingData.countryName || 'Unknown Country';
            } else {
              location.city = 'Unknown City';
              location.country = 'Unknown Country';
            }
          } catch (geocodingError) {
            console.log('Geocoding service unavailable, continuing silently');
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
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    setFormData(updatedFormData);
    
    // Cache form data to localStorage
    try {
      localStorage.setItem('contactFormData', JSON.stringify(updatedFormData));
      localStorage.setItem('contactFormCacheTime', Date.now().toString());
    } catch (error) {
      console.log('Failed to cache form data');
    }
  };

  const requestLocationPermission = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: LocationData = {
            latitude: parseFloat(position.coords.latitude.toFixed(7)),
            longitude: parseFloat(position.coords.longitude.toFixed(7)),
          };
          setLocationData(location);
          setLocationStatus('granted');
          setShowLocationPrompt(false);
          
          // Show success notification
          toast({
            title: "✅ Location Enabled Successfully!",
            description: "Perfect! You can now submit your story. All your information has been preserved.",
            duration: 4000
          });
          
          // Retry form submission
          handleSubmit(new Event('submit') as any);
        },
        (error) => {
          console.log('Location access denied:', error);
          setLocationStatus('denied');
          setShowLocationPrompt(false);
          toast({
            title: "Location Access Required",
            description: "Please enable location access in your browser settings to submit your story. You can try submitting again after enabling location.",
            variant: "destructive"
          });
        },
        { 
          enableHighAccuracy: false, 
          timeout: 10000, 
          maximumAge: 600000 
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if location is available, if not show prompt
    if (!locationData && locationStatus !== 'granted') {
      setShowLocationPrompt(true);
      return;
    }
    
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

        // Clear cached form data and reset form
        localStorage.removeItem('contactFormData');
        localStorage.removeItem('contactFormCacheTime');
        setFormData(getEmptyFormData());
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
    { value: '', label: 'Select type' },
    { value: 'Love Letter', label: 'Love Letter' },
    { value: 'Gratitude Message', label: 'Gratitude Message' },
    { value: 'Apology Letter', label: 'Apology Letter' },
    { value: 'Birthday Message', label: 'Birthday Message' },
    { value: 'Anniversary Letter', label: 'Anniversary Letter' },
    { value: 'Thank You Note', label: 'Thank You Note' },
    { value: 'Friendship Letter', label: 'Friendship Letter' },
    { value: 'Family Message', label: 'Family Message' },
    { value: 'Custom Request', label: 'Custom Request' }
  ];

  const deliveryTypes = [
    { value: '', label: 'Select delivery type' },
    { value: 'Standard Delivery', label: 'Standard Delivery (10 days after dispatch)' },
    { value: 'Express Delivery', label: 'Express Delivery (2-3 days after dispatch) - ₹150 extra' }
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
                <Input 
                  name="name" 
                  required 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  className="rounded-xl h-12 border-2 border-gray-300 bg-white text-black focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 placeholder:text-gray-500" 
                />
              </div>
              <div className="space-y-2">
                <Label>Email Address *</Label>
                <Input 
                  name="email" 
                  type="email" 
                  required 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  className="rounded-xl h-12 border-2 border-gray-300 bg-white text-black focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 placeholder:text-gray-500" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Phone Number *</Label>
              <Input 
                name="phone" 
                type="tel" 
                required 
                value={formData.phone} 
                onChange={handleInputChange} 
                className="rounded-xl h-12 border-2 border-gray-300 bg-white text-black focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 placeholder:text-gray-500" 
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-primary">Message Details</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Recipient's Name *</Label>
                <Input 
                  name="recipientName" 
                  required 
                  value={formData.recipientName} 
                  onChange={handleInputChange} 
                  className="rounded-xl h-12 border-2 border-gray-300 bg-white text-black focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 placeholder:text-gray-500" 
                />
              </div>
              <div className="space-y-2">
                <Label>Recipient's Address *</Label>
                <Input 
                  name="recipientAddress" 
                  required 
                  value={formData.recipientAddress} 
                  onChange={handleInputChange} 
                  className="rounded-xl h-12 border-2 border-gray-300 bg-white text-black focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 placeholder:text-gray-500" 
                  placeholder="Full address for delivery" 
                />
              </div>
            </div>
            <div className="grid md:grid-cols-1 gap-6">
              <PremiumDropdown
                label="Type of Message"
                name="serviceType"
                required
                value={formData.serviceType}
                onChange={handleInputChange}
                options={serviceTypes}
                placeholder="Select type"
              />
            </div>
            <div className="space-y-2">
              <PremiumDropdown
                label="Delivery Type"
                name="deliveryType"
                required
                value={formData.deliveryType}
                onChange={handleInputChange}
                options={deliveryTypes}
                placeholder="Select delivery type"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-primary">Your Story</h3>
            <div className="space-y-2">
              <Label>Feelings *</Label>
              <Textarea 
                name="feelings" 
                required 
                value={formData.feelings} 
                onChange={handleInputChange} 
                className="rounded-xl border-2 border-gray-300 bg-white text-black min-h-[100px] focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 placeholder:text-gray-500" 
              />
            </div>
            <div className="space-y-2">
              <Label>Story *</Label>
              <Textarea 
                name="story" 
                required 
                value={formData.story} 
                onChange={handleInputChange} 
                className="rounded-xl border-2 border-gray-300 bg-white text-black min-h-[120px] focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 placeholder:text-gray-500" 
              />
            </div>
            <div className="space-y-2">
              <Label>Specific Details</Label>
              <Textarea 
                name="specificDetails" 
                value={formData.specificDetails} 
                onChange={handleInputChange} 
                className="rounded-xl border-2 border-gray-300 bg-white text-black min-h-[80px] focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 placeholder:text-gray-500" 
              />
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

          {/* Location Permission Prompt */}
          {showLocationPrompt && (
            <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-2xl">
              <div className="flex items-start gap-3">
                <MapPin className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-yellow-800 mb-2">Location Access Required</h4>
                  <p className="text-sm text-yellow-700 mb-4">
                    We need access to your location to process your story submission for delivery purposes. 
                    Please allow location access when prompted by your browser.
                  </p>
                  <div className="text-xs text-yellow-600 mb-4 space-y-1">
                    <p><strong>Chrome/Edge:</strong> Click the location icon in the address bar → Allow</p>
                    <p><strong>Firefox:</strong> Click "Allow" when the permission popup appears</p>
                    <p><strong>Safari:</strong> Go to Safari → Settings → Websites → Location → Allow for this site</p>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      onClick={requestLocationPermission}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Enable Location Access
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowLocationPrompt(false)}
                      className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

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