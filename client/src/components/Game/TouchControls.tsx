import { useEffect, useState } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

export default function TouchControls() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) return null;

  const handleTouchStart = (direction: 'left' | 'right' | 'up' | 'down') => {
    if ((window as any).handleTouchInput) {
      (window as any).handleTouchInput(direction, true);
    }
  };

  const handleTouchEnd = (direction: 'left' | 'right' | 'up' | 'down') => {
    if ((window as any).handleTouchInput) {
      (window as any).handleTouchInput(direction, false);
    }
  };

  return (
    <div className="touch-controls">
      <div className="dpad">
        <button
          className="dpad-button dpad-up"
          onTouchStart={() => handleTouchStart('up')}
          onTouchEnd={() => handleTouchEnd('up')}
          onMouseDown={() => handleTouchStart('up')}
          onMouseUp={() => handleTouchEnd('up')}
        >
          <ChevronUp size={24} />
        </button>
        
        <div className="dpad-middle">
          <button
            className="dpad-button dpad-left"
            onTouchStart={() => handleTouchStart('left')}
            onTouchEnd={() => handleTouchEnd('left')}
            onMouseDown={() => handleTouchStart('left')}
            onMouseUp={() => handleTouchEnd('left')}
          >
            <ChevronLeft size={24} />
          </button>
          
          <button
            className="dpad-button dpad-right"
            onTouchStart={() => handleTouchStart('right')}
            onTouchEnd={() => handleTouchEnd('right')}
            onMouseDown={() => handleTouchStart('right')}
            onMouseUp={() => handleTouchEnd('right')}
          >
            <ChevronRight size={24} />
          </button>
        </div>
        
        <button
          className="dpad-button dpad-down"
          onTouchStart={() => handleTouchStart('down')}
          onTouchEnd={() => handleTouchEnd('down')}
          onMouseDown={() => handleTouchStart('down')}
          onMouseUp={() => handleTouchEnd('down')}
        >
          <ChevronDown size={24} />
        </button>
      </div>
    </div>
  );
}
