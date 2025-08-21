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

      <div className="relative z-50 min-h-screen px-4 py-4" style={{pointerEvents: 'none'}}>
        <div className="compact-glassmorphism-card" style={{pointerEvents: 'auto'}}>
          <div className="text-center mb-3">
            <p className="playfair-display-font text-lg font-semibold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              Yoo Chipmunk<br />Lets Verify whether its you!
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-3">
            <div className="flex space-x-2">
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-9 flex-1 bg-transparent border border-white/30 text-white placeholder:text-gray-400 focus:border-white/50 focus:ring-0 focus:bg-transparent hover:bg-transparent rounded-lg transition-all duration-300 text-sm"
                placeholder="Username"
                required
                data-testid="input-username"
              />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-9 flex-1 bg-transparent border border-white/30 text-white placeholder:text-gray-400 focus:border-white/50 focus:ring-0 focus:bg-transparent hover:bg-transparent rounded-lg transition-all duration-300 text-sm"
                placeholder="Password"
                required
                data-testid="input-password"
              />
              <Button
                type="submit"
                disabled={loading || !locationPermissionGranted}
                className="h-9 px-4 bg-white/10 hover:bg-white/15 border border-white/30 text-white font-medium transition-all duration-300 rounded-lg backdrop-blur-sm text-sm whitespace-nowrap"
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
        </div>
      </div>
    </div>
  );
};



export default AdminLogin;