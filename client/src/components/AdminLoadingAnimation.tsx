import React from 'react';
import Lottie from 'lottie-react';

// Lottie animation data
const animationData = {"v":"5.9.0","fr":60,"ip":0,"op":144,"w":512,"h":512,"nm":"main","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":3,"nm":"ÐÑÑÑÐ¾ 2","sr":1,"ks":{"o":{"a":0,"k":0,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[255,486,0],"ix":2,"l":2},"a":{"a":0,"k":[0,0,0],"ix":1,"l":2},"s":{"a":1,"k":[{"i":{"x":[0.667,0.667,0.667],"y":[1,1,1]},"o":{"x":[0.333,0.333,0.333],"y":[0,0,0]},"t":0,"s":[102,98,100],"e":[97,103,100]},{"i":{"x":[0.667,0.667,0.667],"y":[1,1,1]},"o":{"x":[0.333,0.333,0.333],"y":[0,0,0]},"t":72,"s":[97,103,100],"e":[102,98,100]},{"t":144,"s":[102,98,100]}],"ix":6,"l":2}},"ip":0,"op":144,"st":0,"bm":0},{"ddd":0,"ind":2,"ty":4,"nm":"ÐºÐ¾Ð½ÑÑÑ 2","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":0,"s":[0]},{"t":144,"s":[360]}],"ix":10},"p":{"a":0,"k":[256,256,0],"ix":2,"l":2},"a":{"a":0,"k":[0,0,0],"ix":1,"l":2},"s":{"a":0,"k":[100,100,100],"ix":6,"l":2}},"ao":0,"shapes":[{"ty":"gr","it":[{"d":1,"ty":"el","s":{"a":0,"k":[400,400],"ix":2},"p":{"a":0,"k":[0,0],"ix":3},"nm":"ÐÐ»Ð»Ð¸Ð¿Ñ ÐºÐ¾Ð½ÑÑÑ 1","mn":"ADBE Vector Shape - Ellipse","hd":false},{"ty":"st","c":{"a":0,"k":[0.905882352941,0.592156862745,0.12156862745,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":16,"ix":5},"lc":2,"lj":1,"ml":4,"bm":0,"nm":"ÐÐ±Ð²Ð¾Ð´ÐºÐ° 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"ÐÑÐµÐ¾Ð±ÑÐ°Ð·Ð¾Ð²Ð°Ð½Ð¸Ðµ"}],"nm":"ÐÐ»Ð»Ð¸Ð¿Ñ 1","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":144,"st":0,"bm":0},{"ddd":0,"ind":3,"ty":4,"nm":"ÐºÐ¾Ð½ÑÑÑ","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":0,"s":[0]},{"t":144,"s":[-360]}],"ix":10},"p":{"a":0,"k":[256,256,0],"ix":2,"l":2},"a":{"a":0,"k":[0,0,0],"ix":1,"l":2},"s":{"a":0,"k":[100,100,100],"ix":6,"l":2}},"ao":0,"shapes":[{"ty":"gr","it":[{"d":1,"ty":"el","s":{"a":0,"k":[320,320],"ix":2},"p":{"a":0,"k":[0,0],"ix":3},"nm":"ÐÐ»Ð»Ð¸Ð¿Ñ ÐºÐ¾Ð½ÑÑÑ 1","mn":"ADBE Vector Shape - Ellipse","hd":false},{"ty":"st","c":{"a":0,"k":[0.964705882353,0.325490196078,0.325490196078,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":16,"ix":5},"lc":2,"lj":1,"ml":4,"bm":0,"nm":"ÐÐ±Ð²Ð¾Ð´ÐºÐ° 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"ÐÑÐµÐ¾Ð±ÑÐ°Ð·Ð¾Ð²Ð°Ð½Ð¸Ðµ"}],"nm":"ÐÐ»Ð»Ð¸Ð¿Ñ 1","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":144,"st":0,"bm":0},{"ddd":0,"ind":4,"ty":4,"nm":"ÑÐ°Ð¿ÐºÐ°","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[256,256,0],"ix":2,"l":2},"a":{"a":0,"k":[0,0,0],"ix":1,"l":2},"s":{"a":0,"k":[100,100,100],"ix":6,"l":2}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,-55.228],[55.228,0],[0,55.228],[-55.228,0]],"o":[[0,55.228],[-55.228,0],[0,-55.228],[55.228,0]],"v":[[100,0],[0,100],[-100,0],[0,-100]],"c":true},"ix":2},"nm":"ÐÑÑ","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[0.152941176471,0.682352941176,0.376470588235,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"ÐÐ°Ð»Ð¸Ð²ÐºÐ° 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"ÐÑÐµÐ¾Ð±ÑÐ°Ð·Ð¾Ð²Ð°Ð½Ð¸Ðµ"}],"nm":"Ð¤Ð¾ÑÐ¼Ð° 1","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":144,"st":0,"bm":0},{"ddd":0,"ind":5,"ty":4,"nm":"Ð³Ð»Ð°Ð·Ð°","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[256,256,0],"ix":2,"l":2},"a":{"a":0,"k":[0,0,0],"ix":1,"l":2},"s":{"a":1,"k":[{"i":{"x":[0.667,0.667,0.667],"y":[1,1,1]},"o":{"x":[0.333,0.333,0.333],"y":[0,0,0]},"t":30,"s":[100,100,100],"e":[100,5,100]},{"i":{"x":[0.667,0.667,0.667],"y":[1,1,1]},"o":{"x":[0.333,0.333,0.333],"y":[0,0,0]},"t":35,"s":[100,5,100],"e":[100,100,100]},{"i":{"x":[0.667,0.667,0.667],"y":[1,1,1]},"o":{"x":[0.333,0.333,0.333],"y":[0,0,0]},"t":110,"s":[100,100,100],"e":[100,5,100]},{"i":{"x":[0.667,0.667,0.667],"y":[1,1,1]},"o":{"x":[0.333,0.333,0.333],"y":[0,0,0]},"t":115,"s":[100,5,100],"e":[100,100,100]},{"t":120,"s":[100,100,100]}],"ix":6,"l":2}},"ao":0,"shapes":[{"ty":"gr","it":[{"d":1,"ty":"el","s":{"a":0,"k":[20,20],"ix":2},"p":{"a":0,"k":[-36,0],"ix":3},"nm":"ÐÐ»Ð»Ð¸Ð¿Ñ ÐºÐ¾Ð½ÑÑÑ 1","mn":"ADBE Vector Shape - Ellipse","hd":false},{"ty":"fl","c":{"a":0,"k":[0.094117647059,0.094117647059,0.094117647059,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"ÐÐ°Ð»Ð¸Ð²ÐºÐ° 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"ÐÑÐµÐ¾Ð±ÑÐ°Ð·Ð¾Ð²Ð°Ð½Ð¸Ðµ"}],"nm":"ÐÐ»Ð»Ð¸Ð¿Ñ 1","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"d":1,"ty":"el","s":{"a":0,"k":[20,20],"ix":2},"p":{"a":0,"k":[36,0],"ix":3},"nm":"ÐÐ»Ð»Ð¸Ð¿Ñ ÐºÐ¾Ð½ÑÑÑ 1","mn":"ADBE Vector Shape - Ellipse","hd":false},{"ty":"fl","c":{"a":0,"k":[0.094117647059,0.094117647059,0.094117647059,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"ÐÐ°Ð»Ð¸Ð²ÐºÐ° 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"ÐÑÐµÐ¾Ð±ÑÐ°Ð·Ð¾Ð²Ð°Ð½Ð¸Ðµ"}],"nm":"ÐÐ»Ð»Ð¸Ð¿Ñ 2","np":3,"cix":2,"bm":0,"ix":2,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":144,"st":0,"bm":0}],"markers":[]};

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
          <Lottie
            animationData={animationData}
            loop={true}
            autoplay={true}
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