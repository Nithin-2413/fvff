import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { LogIn, MapPin, Sparkles } from 'lucide-react';
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
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Request location permission when component mounts
    const requestLocation = async () => {
      if ('geolocation' in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              resolve,
              reject,
              { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
            );
          });

          const locationInfo: LocationData = {
            latitude: parseFloat(position.coords.latitude.toFixed(7)), // 7 decimal places for high accuracy
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
          }

          setLocationData(locationInfo);
          setLocationPermissionGranted(true);
        } catch (error) {
          console.error('Location access denied:', error);
          toast({
            title: "Location Required",
            description: "Please enable location access to login to the admin panel.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Location Not Supported",
          description: "Your browser doesn't support location services.",
          variant: "destructive",
        });
      }
    };

    requestLocation();
  }, [toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!locationPermissionGranted || !locationData) {
      toast({
        title: "Location Required",
        description: "Please enable location access to proceed with login.",
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
          location: locationData
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Store login state in localStorage
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminUsername', username);

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

      <div className="relative z-50 min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8" style={{pointerEvents: 'none'}}>
        <div className="interactive-card w-full" style={{pointerEvents: 'auto'}}>
          <div className="glow"></div>
          <div className="card-content">
            <div className="w-full space-y-6">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20">
                  <img 
                    src="https://res.cloudinary.com/dwmybitme/image/upload/v1755357106/image_1_o0l7go.png" 
                    alt="The Written Hug" 
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover shadow-lg transform hover:scale-110 transition-transform duration-300" 
                  />
                </div>
                <h1 className="text-3xl sm:text-4xl great-vibes-font bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                  Admin Portal
                </h1>
                <p className="text-gray-300 text-sm sm:text-base font-light">
                  The Written Hug - Secure Admin Access
                </p>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium text-gray-200 block">
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-12 w-full bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-orange-400 focus:ring-orange-400/20 backdrop-blur-md rounded-xl transition-all duration-200 hover:bg-white/15 focus:bg-white/15"
                    placeholder="Enter your username"
                    required
                    data-testid="input-username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-200 block">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 w-full bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-orange-400 focus:ring-orange-400/20 backdrop-blur-md rounded-xl transition-all duration-200 hover:bg-white/15 focus:bg-white/15"
                    placeholder="Enter your password"
                    required
                    data-testid="input-password"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={loading || !locationPermissionGranted}
                    className="w-full h-12 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 hover:from-orange-600 hover:via-pink-600 hover:to-purple-700 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 rounded-full backdrop-blur-sm transform hover:scale-105 active:scale-95 sparkle-button"
                    data-testid="button-login"
                  >
                    <div className="star-1">✦</div>
                    <div className="star-2">✧</div>
                    <div className="star-3">✦</div>
                    <div className="star-4">✧</div>
                    <div className="star-5">✦</div>
                    <div className="star-6">✧</div>
                    <div className="star-7">✦</div>
                    <div className="star-8">✧</div>
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm sm:text-base">Authenticating...</span>
                      </div>
                    ) : !locationPermissionGranted ? (
                      <div className="flex items-center justify-center space-x-2">
                        <MapPin className="h-5 w-5" />
                        <span className="text-sm sm:text-base">Securing Connection...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <LogIn className="h-5 w-5" />
                        <span className="text-sm sm:text-base font-medium">Access Portal</span>
                      </div>
                    )}
                  </Button>
                </div>

                {locationData && (
                  <div className="text-center text-xs text-gray-400 mt-4 p-3 bg-white/5 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center justify-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>
                        Secured from {locationData.city || 'Unknown'}, {locationData.country || 'Location'}
                      </span>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



export default AdminLogin;