import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { LogIn, MapPin, Sparkles } from 'lucide-react';
import logoImage from '@assets/Untitled design (2)_1755165830517.png';
import SimpleStarBackground from '@/components/SimpleStarBackground';

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
      {/* Animated Particle Background */}
      <SimpleStarBackground className="opacity-90" />


      <div className="relative z-20 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card className="border-white/20 shadow-2xl backdrop-blur-xl bg-black/30 ring-1 ring-white/10">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16">
                <img src="https://res.cloudinary.com/dwmybitme/image/upload/v1755357106/image_1_o0l7go.png" alt="The Written Hug" className="h-16 w-16 rounded-full object-cover shadow-lg transform scale-130" />
              </div>
              <CardTitle className="text-3xl great-vibes-font bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text text-transparent">
                Admin Portal
              </CardTitle>
              <p className="text-gray-300">
                The Written Hug - Admin Access
              </p>
              {/* Location verification happens silently in background */}
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium text-gray-200">
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-orange-400 focus:ring-orange-400/20 backdrop-blur-md"
                    placeholder="Enter your username"
                    required
                    data-testid="input-username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-200">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-orange-400 focus:ring-orange-400/20 backdrop-blur-md"
                    placeholder="Enter your password"
                    required
                    data-testid="input-password"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || !locationPermissionGranted}
                  className="w-full h-12 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 rounded-full backdrop-blur-sm"
                  data-testid="button-login"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : !locationPermissionGranted ? (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>Waiting for location...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <LogIn className="h-4 w-4" />
                      <span>Sign In</span>
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};



export default AdminLogin;