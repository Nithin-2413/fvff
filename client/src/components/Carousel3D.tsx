import { useEffect, useRef } from 'react';

const Carousel3D = () => {
  const dragContainerRef = useRef<HTMLDivElement>(null);
  const spinContainerRef = useRef<HTMLDivElement>(null);

  // Configuration with mobile responsiveness
  const autoRotate = true;
  const rotateSpeed = -60;

  // Existing images from your carousel
  const images = [
    "https://res.cloudinary.com/dwmybitme/image/upload/v1755356947/Special_Occasion_designed_wooden_boxes_5_as4sup.png",
    "https://res.cloudinary.com/dwmybitme/image/upload/v1755356958/Special_Occasion_designed_wooden_boxes_yumtwe.png",
    "https://res.cloudinary.com/dwmybitme/image/upload/v1755356951/Untitled_design_5_ar557f.png",
    "https://res.cloudinary.com/dwmybitme/image/upload/v1755356969/Untitled_design_3_iji6n1.png",
    "https://res.cloudinary.com/dwmybitme/image/upload/v1755356965/Untitled_design_4_hwtmhw.png",
    "https://res.cloudinary.com/dwmybitme/image/upload/v1755356950/Special_Occasion_designed_wooden_boxes_4_ak7pmn.png",
    "https://res.cloudinary.com/dwmybitme/image/upload/v1755356946/Special_Occasion_designed_wooden_boxes_3_e8e2zj.png",
    "https://res.cloudinary.com/dwmybitme/image/upload/v1755356945/Special_Occasion_designed_wooden_boxes_1_r5x26x.png",
    "https://res.cloudinary.com/dwmybitme/image/upload/v1755356949/Special_Occasion_designed_wooden_boxes_2_ai7htr.png"
  ];

  useEffect(() => {
    const init = (delayTime = 0) => {
      const ospin = spinContainerRef.current;
      if (!ospin) return;

      // Dynamic mobile detection and configuration
      const isMobile = window.innerWidth <= 768;
      const radius = isMobile ? 200 : 240;
      const imgWidth = isMobile ? 110 : 120;
      const imgHeight = isMobile ? 150 : 170;

      const aImg = ospin.getElementsByTagName('img');
      const aEle = Array.from(aImg);

      // Apply mobile sizing
      for (let i = 0; i < aEle.length; i++) {
        aEle[i].style.width = `${imgWidth}px`;
        aEle[i].style.height = `${imgHeight}px`;
        aEle[i].style.transform = `rotateY(${i * (360 / aEle.length)}deg) translateZ(${radius}px)`;
        aEle[i].style.transition = "transform 1s";
        aEle[i].style.transitionDelay = delayTime ? `${delayTime}s` : `${(aEle.length - i) / 4}s`;
      }
    };

    const applyTransform = (obj: HTMLElement, tX: number, tY: number) => {
      // Constrain the angle of camera (between 0 and 88 degrees to prevent upside down)
      if (tY > 88) tY = 88;
      if (tY < 0) tY = 0;

      // Apply the angle
      obj.style.transform = `rotateX(${-tY}deg) rotateY(${tX}deg)`;
    };

    const playSpin = (yes: boolean) => {
      const ospin = spinContainerRef.current;
      if (!ospin) return;
      ospin.style.animationPlayState = yes ? 'running' : 'paused';
    };

    let tX = 0, tY = 10;
    let timer: number;

    const setupCarousel = () => {
      const odrag = dragContainerRef.current;
      const ospin = spinContainerRef.current;
      
      if (!odrag || !ospin) return;

      // Dynamic mobile detection and configuration
      const isMobile = window.innerWidth <= 768;
      const imgWidth = isMobile ? 110 : 120;
      const imgHeight = isMobile ? 150 : 170;

      // Size of spin container
      ospin.style.width = `${imgWidth}px`;
      ospin.style.height = `${imgHeight}px`;

      // Initialize positions
      setTimeout(() => init(), 1000);

      // Auto spin
      if (autoRotate) {
        const animationName = rotateSpeed > 0 ? 'spin' : 'spinRevert';
        ospin.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
      }

      // Mouse/touch events with enhanced mobile optimization
      const handlePointerDown = (e: PointerEvent | TouchEvent) => {
        clearInterval(timer);
        e.preventDefault();
        
        // Stop auto-rotation completely during interaction
        playSpin(false);
        
        const isTouch = 'touches' in e;
        const clientX = isTouch ? e.touches[0].clientX : (e as PointerEvent).clientX;
        const clientY = isTouch ? e.touches[0].clientY : (e as PointerEvent).clientY;
        
        const sX = clientX;
        const sY = clientY;
        
        // Enhanced sensitivity for better mobile control
        const isMobileDevice = window.innerWidth <= 768;
        const sensitivity = isMobileDevice ? 0.45 : 0.1;
        let lastX = sX;
        let lastY = sY;

        const handlePointerMove = (e: PointerEvent | TouchEvent) => {
          e.preventDefault(); // Prevent any default behaviors
          const isTouch = 'touches' in e;
          const clientX = isTouch ? e.touches[0].clientX : (e as PointerEvent).clientX;
          const clientY = isTouch ? e.touches[0].clientY : (e as PointerEvent).clientY;
          
          // Calculate movement with enhanced sensitivity for mobile
          const deltaX = clientX - lastX;
          const deltaY = clientY - lastY;
          const desX = deltaX * sensitivity;
          // Increase vertical sensitivity more for easier top view access
          const verticalMultiplier = isMobileDevice ? 2.0 : 1.5;
          const desY = deltaY * sensitivity * verticalMultiplier;
          
          // Direct application without interference from auto-rotation
          tX += desX;
          tY += desY;
          applyTransform(odrag, tX, tY);
          
          lastX = clientX;
          lastY = clientY;
        };

        const handlePointerUp = () => {
          // Enhanced momentum for mobile with proper delay before auto-rotation
          const momentumDecay = isMobileDevice ? 0.92 : 0.95;
          const momentumThreshold = isMobileDevice ? 1 : 0.5;
          
          timer = window.setInterval(() => {
            tX *= momentumDecay;
            tY *= momentumDecay;
            applyTransform(odrag, tX, tY);
            
            if (Math.abs(tX) < momentumThreshold && Math.abs(tY) < momentumThreshold) {
              clearInterval(timer);
              // Wait a moment before resuming auto-rotation
              setTimeout(() => {
                playSpin(true);
              }, 500);
            }
          }, 17);
          
          document.removeEventListener('pointermove', handlePointerMove);
          document.removeEventListener('pointerup', handlePointerUp);
          document.removeEventListener('touchmove', handlePointerMove);
          document.removeEventListener('touchend', handlePointerUp);
        };

        document.addEventListener('pointermove', handlePointerMove);
        document.addEventListener('pointerup', handlePointerUp);
        document.addEventListener('touchmove', handlePointerMove, { passive: false });
        document.addEventListener('touchend', handlePointerUp);
      };

      // Wheel event for zoom
      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        const d = e.deltaY / 20;
        // Dynamic radius for zoom
        const currentRadius = window.innerWidth <= 768 ? 200 : 240;
        const newRadius = Math.max(100, Math.min(400, currentRadius - d));
        init(0.1);
      };

      // Add both pointer and touch events for better mobile support
      odrag.addEventListener('pointerdown', handlePointerDown);
      odrag.addEventListener('touchstart', handlePointerDown, { passive: false });
      odrag.addEventListener('wheel', handleWheel);

      return () => {
        odrag.removeEventListener('pointerdown', handlePointerDown);
        odrag.removeEventListener('touchstart', handlePointerDown);
        odrag.removeEventListener('wheel', handleWheel);
        clearInterval(timer);
      };
    };

    const cleanup = setupCarousel();
    return cleanup;
  }, []);

  return (
    <div className="relative w-full h-[500px] md:h-[500px] sm:h-[450px] overflow-visible">
      {/* Cosmic Premium Background - Same as website */}
      <div className="cosmic-background absolute inset-0"></div>
      
      {/* 3D Carousel Styles */}
      <style>{`
        @keyframes spin {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
        
        @keyframes spinRevert {
          from { transform: rotateY(360deg); }
          to { transform: rotateY(0deg); }
        }
        
        #drag-container, #spin-container {
          position: relative;
          display: flex;
          margin: auto;
          transform-style: preserve-3d;
          transform: rotateX(-10deg);
          height: 300px;
          width: 300px;
        }
        
        #drag-container img {
          transform-style: preserve-3d;
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 10px;
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
          -webkit-box-reflect: below 10px linear-gradient(transparent, transparent, rgba(0,0,0,0.3));
          transition: box-shadow 0.3s ease;
        }
        
        #drag-container img:hover {
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
          -webkit-box-reflect: below 10px linear-gradient(transparent, transparent, rgba(0,0,0,0.4));
        }
        
        #ground {
          width: 900px;
          height: 900px;
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translate(-50%, -50%) rotateX(90deg);
          background: radial-gradient(center center, farthest-side, rgba(153, 153, 153, 0.3), transparent);
        }
        
        #ground-text {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translate(-50%, -50%) rotateX(90deg);
          font-family: 'Great Vibes', cursive;
          font-size: 2.5rem;
          font-weight: bold;
          background: linear-gradient(135deg, #000000, #EC4899, #8B5CF6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 2px;
          pointer-events: none;
          z-index: 10;
          white-space: nowrap;
        }
        
        @media (max-width: 768px) {
          #ground-text {
            font-size: 1.8rem;
            letter-spacing: 1px;
          }
          
          #drag-container, #spin-container {
            transform: rotateX(-8deg);
            height: 280px;
            width: 280px;
          }
          
          #drag-container img {
            border-radius: 8px;
            box-shadow: 0 0 6px rgba(255, 255, 255, 0.2);
          }
          
          #ground {
            width: 600px;
            height: 600px;
          }
        }
        
        @media (max-width: 480px) {
          #ground-text {
            font-size: 1.5rem;
            letter-spacing: 0.5px;
          }
          
          #drag-container, #spin-container {
            transform: rotateX(-3deg);
          }
          
          #ground {
            width: 500px;
            height: 500px;
          }
        }
      `}</style>

      {/* Main container */}
      <div className="flex items-center justify-center h-full perspective-[1000px] relative z-10" style={{ transformStyle: 'preserve-3d' }}>
        <div
          id="drag-container"
          ref={dragContainerRef}
          className="relative flex mx-auto"
          style={{ transformStyle: 'preserve-3d', transform: 'rotateX(-10deg)' }}
        >
          <div
            id="spin-container"
            ref={spinContainerRef}
            className="relative flex mx-auto"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Carousel item ${index + 1}`}
                draggable={false}
                className="select-none"
              />
            ))}
          </div>

          {/* Ground reflection */}
          <div id="ground"></div>
          
          {/* Text on Ground - Flat */}
          <div id="ground-text">
            The Written Hug
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel3D;