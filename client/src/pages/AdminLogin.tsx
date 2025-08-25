import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { LogIn, MapPin } from 'lucide-react';
import logoImage from '@assets/Untitled design (2)_1755165830517.png';
import ExactThreeBackground from '@/components/ExactThreeBackground';

interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'loading' | 'granted' | 'denied' | 'unsupported'>('loading');
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Request location permission when component mounts
    const requestLocation = async () => {
      if ('geolocation' in navigator) {
        try {
          console.log('Requesting location permission...');
          setLocationStatus('loading');
          
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              resolve,
              reject,
              { enableHighAccuracy: false, timeout: 15000, maximumAge: 600000 } // Less strict settings
            );
          });

          const locationInfo: LocationData = {
            latitude: parseFloat(position.coords.latitude.toFixed(7)),
            longitude: parseFloat(position.coords.longitude.toFixed(7)),
          };

          // Try to get city and country from reverse geocoding
          try {
            const geocodingResponse = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
            );
            const geocodingData = await geocodingResponse.json();
            locationInfo.city = geocodingData.city || geocodingData.locality;
            locationInfo.country = geocodingData.countryName;
          } catch (geocodingError) {
            console.warn('Failed to get location details:', geocodingError);
            locationInfo.city = "Unknown City";
            locationInfo.country = "Unknown Country";
          }

          console.log('Location obtained:', locationInfo);
          setLocationData(locationInfo);
          setLocationPermissionGranted(true);
          setLocationStatus('granted');
          
          toast({
            title: "Location Access Granted",
            description: "Ready to login!",
          });
        } catch (error) {
          console.error('Location access denied:', error);
          setLocationStatus('denied');
          
          toast({
            title: "Location Access Required",
            description: "Please click 'Allow' when your browser asks for location permission to access admin login.",
            variant: "destructive",
          });
        }
      } else {
        setLocationStatus('unsupported');
        
        toast({
          title: "Location Not Supported",
          description: "Your browser doesn't support location services. Admin login requires location access.",
          variant: "destructive",
        });
      }
    };

    requestLocation();
  }, [toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mandatory location check for security
    if (!locationData) {
      toast({
        title: "Security Check Required",
        description: "Location access is mandatory for admin login. Please allow location access and try again.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/adminLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          location: locationData,
          latitude: locationData.latitude,
          longitude: locationData.longitude
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Store secure session state
        sessionStorage.setItem('adminAuthenticated', 'true');
        sessionStorage.setItem('adminLoginTime', new Date().toISOString());
        sessionStorage.setItem('adminUsername', username);

        toast({
          title: "Welcome back!",
          description: "Login successful. Redirecting to orders...",
        });

        setTimeout(() => {
          setLocation('/admin/dashboard');
        }, 1000);
      } else {
        toast({
          title: "Login Failed",
          description: result.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-black overflow-hidden premium-scroll relative">
      {/* Interactive 3D Background */}
      <ExactThreeBackground />


      <div className="relative z-50 min-h-screen px-4 py-4" style={{pointerEvents: 'none'}}>
        <div className="compact-glassmorphism-card" style={{pointerEvents: 'auto', marginTop: window.innerWidth < 768 ? '48px' : '0px'}}>
          <div className="text-center mb-3">
            <p className="playfair-display text-sm font-bold bg-gradient-to-r from-amber-400 via-purple-400 to-violet-500 bg-clip-text text-transparent" style={{
              backgroundImage: 'linear-gradient(45deg, #fbbf24, #a855f7, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Hey CEO..! Lets verify whether its you...
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-3">
            <div className="flex justify-center items-center space-x-3">
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-8 w-24 bg-white/10 backdrop-blur-md border border-white/40 text-white placeholder:text-gray-300 focus:border-white/70 focus:ring-0 focus:bg-white/20 hover:bg-white/15 active:bg-white/20 rounded-lg transition-all duration-300 text-xs text-center shadow-lg font-medium"
                placeholder="Username"
                required
                data-testid="input-username"
              />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-8 w-24 bg-white/10 backdrop-blur-md border border-white/40 text-white placeholder:text-gray-300 focus:border-white/70 focus:ring-0 focus:bg-white/20 hover:bg-white/15 active:bg-white/20 rounded-lg transition-all duration-300 text-xs text-center shadow-lg font-medium"
                placeholder="Password"
                required
                data-testid="input-password"
              />
              <Button
                type="submit"
                disabled={loading || !locationData}
                className="h-8 px-3 bg-white/10 hover:bg-white/15 border border-white/30 text-white font-medium transition-all duration-300 rounded-lg backdrop-blur-sm text-xs whitespace-nowrap disabled:opacity-50"
                data-testid="button-login"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="hidden sm:inline">Login</span>
                  </div>
                ) : (
                  <span>Login</span>
                )}
              </Button>
            </div>
          </form>
          
          {/* Hidden location tracking - no UI indication */}
          
          
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;