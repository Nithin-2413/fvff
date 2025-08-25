import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface AdminLoadingAnimationProps {
  message?: string;
  className?: string;
  children?: React.ReactNode;
}

const AdminLoadingAnimation: React.FC<AdminLoadingAnimationProps> = ({ 
  message = "Loading Dashboard", 
  className = "",
  children
}) => {
  return (
    <div className={`min-h-screen relative overflow-hidden flex items-center justify-center ${className}`}>
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
      
      {/* Lottie Animation Loading */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48">
          <DotLottieReact
            src="https://lottie.host/cc5e4497-ed48-4606-b485-497b41d14d3b/DShZO8YY8A.lottie"
            loop
            autoplay
            className="w-full h-full"
          />
        </div>
        <div className="text-center mt-6">
          <h3 className="text-2xl md:text-3xl font-bold premium-text-white mb-2" style={{ fontFamily: 'Fairplay Display, serif' }}>
            {message}
          </h3>
          <div className="flex items-center justify-center space-x-2 mt-4">
            <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
        {children && (
          <div className="relative z-10 mt-6">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLoadingAnimation;