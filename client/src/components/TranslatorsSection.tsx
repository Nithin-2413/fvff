import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

const TranslatorsSection = () => {
  return (
    <section className="py-32 px-6 bg-gradient-to-b from-purple-50/20 to-pink-50/20 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-10 left-10 animate-float">
        <Sparkles className="w-8 h-8 text-yellow-300 opacity-20" />
      </div>
      <div className="absolute top-20 right-20 animate-float delay-1000">
        <Heart className="w-6 h-6 text-pink-300 opacity-30 fill-current" />
      </div>
      <div className="absolute bottom-20 left-1/4 animate-float delay-2000">
        <Heart className="w-8 h-8 text-purple-300 opacity-20 fill-current" />
      </div>
      <div className="absolute bottom-32 right-16 animate-pulse">
        <div className="w-12 h-12 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full opacity-10"></div>
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center">
          <h2 className="text-6xl md:text-7xl font-bold mb-8 great-vibes-font">
            <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
              We're the translators
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-red-500 bg-clip-text text-transparent">
              of the heart.
            </span>
          </h2>
          
          <div className="mt-12 flex justify-center items-center space-x-8">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-pink-300"></div>
            <Heart className="w-8 h-8 text-pink-500 fill-current animate-pulse" />
            <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-pink-300"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TranslatorsSection;