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
        <div className="simple-glassmorphism-card" style={{pointerEvents: 'auto'}}>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-12 w-full bg-white/8 border border-white/25 text-white placeholder:text-gray-300 focus:border-white/50 focus:ring-1 focus:ring-white/30 backdrop-blur-sm rounded-xl transition-all duration-300"
              placeholder="Username"
              required
              data-testid="input-username"
            />

            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 w-full bg-white/8 border border-white/25 text-white placeholder:text-gray-300 focus:border-white/50 focus:ring-1 focus:ring-white/30 backdrop-blur-sm rounded-xl transition-all duration-300"
              placeholder="Password"
              required
              data-testid="input-password"
            />

            <Button
              type="submit"
              disabled={loading || !locationPermissionGranted}
              className="w-full h-12 bg-white/12 hover:bg-white/18 border border-white/25 text-white font-medium transition-all duration-300 rounded-xl backdrop-blur-sm transform hover:scale-105"
              data-testid="button-login"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Login</span>
                </div>
              ) : (
                <span>Login</span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};



export default AdminLogin;