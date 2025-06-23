import React from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useGame } from "../../lib/stores/useGame";

export default function TouchControls() {
  const { phase, tabletMode, toggleTabletMode } = useGame();

  const handleTouch = (direction: string, pressed: boolean) => {
    // Create and dispatch keyboard events to simulate key presses
    const keyMap = {
      'up': 'ArrowUp',
      'down': 'ArrowDown',
      'left': 'ArrowLeft', 
      'right': 'ArrowRight'
    };
    
    const eventType = pressed ? 'keydown' : 'keyup';
    const event = new KeyboardEvent(eventType, {
      key: keyMap[direction as keyof typeof keyMap],
      code: keyMap[direction as keyof typeof keyMap],
      bubbles: true,
      cancelable: true
    });
    
    // Dispatch to window to ensure the GameCanvas keyboard handlers catch it
    window.dispatchEvent(event);
  };

  const handleTabletTouch = (event: React.TouchEvent) => {
    if (!tabletMode) return;
    
    const touch = event.touches[0];
    const rect = event.currentTarget.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Determine direction based on touch position
    const deltaX = x - centerX;
    const deltaY = y - centerY;
    
    // Prioritize the larger delta to avoid diagonal movement
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal movement
      if (deltaX > 50) {
        handleTouch('right', true);
      } else if (deltaX < -50) {
        handleTouch('left', true);
      }
    } else {
      // Vertical movement
      if (deltaY > 50) {
        handleTouch('down', true);
      } else if (deltaY < -50) {
        handleTouch('up', true);
      }
    }
  };

  const handleTabletTouchEnd = () => {
    if (!tabletMode) return;
    
    // Stop all movement when touch ends
    ['left', 'right', 'up', 'down'].forEach(direction => {
      handleTouch(direction, false);
    });
  };

  // Tablet mode overlay
  if (tabletMode) {
    return (
      <>
        {/* Tablet mode touch zones */}
        <div 
          className="fixed inset-0 z-40 pointer-events-auto"
          onTouchStart={handleTabletTouch}
          onTouchEnd={handleTabletTouchEnd}
        >
          {/* Visual indicators for touch zones */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20">
            {/* Top row */}
            <div className="border border-cyan-300 flex items-center justify-center text-cyan-300 text-2xl">↖</div>
            <div className="border border-cyan-300 flex items-center justify-center text-cyan-300 text-3xl">↑</div>
            <div className="border border-cyan-300 flex items-center justify-center text-cyan-300 text-2xl">↗</div>
            
            {/* Middle row */}
            <div className="border border-cyan-300 flex items-center justify-center text-cyan-300 text-3xl">←</div>
            <div className="border border-cyan-300 flex items-center justify-center text-cyan-300 text-sm">TAP</div>
            <div className="border border-cyan-300 flex items-center justify-center text-cyan-300 text-3xl">→</div>
            
            {/* Bottom row */}
            <div className="border border-cyan-300 flex items-center justify-center text-cyan-300 text-2xl">↙</div>
            <div className="border border-cyan-300 flex items-center justify-center text-cyan-300 text-3xl">↓</div>
            <div className="border border-cyan-300 flex items-center justify-center text-cyan-300 text-2xl">↘</div>
          </div>
        </div>

        {/* Tablet mode toggle button */}
        <button
          onClick={toggleTabletMode}
          className="fixed top-4 right-4 z-50 px-3 py-1 bg-purple-500/80 text-white rounded text-sm font-bold shadow-lg pointer-events-auto"
        >
          Exit Tablet Mode
        </button>
      </>
    );
  }

  // Only show when game is playing
  if (phase !== "playing") return null;

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50 touch-controls">
      {/* Up Arrow */}
      <div className="flex justify-center">
        <button
          className="bg-cyan-600 bg-opacity-90 hover:bg-cyan-500 active:bg-cyan-400 text-white p-4 rounded-full shadow-xl touch-none select-none transition-colors"
          onTouchStart={(e) => {
            e.preventDefault();
            handleTouch('up', true);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            handleTouch('up', false);
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            handleTouch('up', true);
          }}
          onMouseUp={(e) => {
            e.preventDefault();
            handleTouch('up', false);
          }}
          onMouseLeave={(e) => {
            e.preventDefault();
            handleTouch('up', false);
          }}
          style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
        >
          <ChevronUp size={28} />
        </button>
      </div>
      
      {/* Left, Down, Right Arrows */}
      <div className="flex gap-2 justify-center">
        <button
          className="bg-cyan-600 bg-opacity-90 hover:bg-cyan-500 active:bg-cyan-400 text-white p-4 rounded-full shadow-xl touch-none select-none transition-colors"
          onTouchStart={(e) => {
            e.preventDefault();
            handleTouch('left', true);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            handleTouch('left', false);
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            handleTouch('left', true);
          }}
          onMouseUp={(e) => {
            e.preventDefault();
            handleTouch('left', false);
          }}
          onMouseLeave={(e) => {
            e.preventDefault();
            handleTouch('left', false);
          }}
          style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
        >
          <ChevronLeft size={28} />
        </button>
        
        <button
          className="bg-cyan-600 bg-opacity-90 hover:bg-cyan-500 active:bg-cyan-400 text-white p-4 rounded-full shadow-xl touch-none select-none transition-colors"
          onTouchStart={(e) => {
            e.preventDefault();
            handleTouch('down', true);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            handleTouch('down', false);
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            handleTouch('down', true);
          }}
          onMouseUp={(e) => {
            e.preventDefault();
            handleTouch('down', false);
          }}
          onMouseLeave={(e) => {
            e.preventDefault();
            handleTouch('down', false);
          }}
          style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
        >
          <ChevronDown size={28} />
        </button>
        
        <button
          className="bg-cyan-600 bg-opacity-90 hover:bg-cyan-500 active:bg-cyan-400 text-white p-4 rounded-full shadow-xl touch-none select-none transition-colors"
          onTouchStart={(e) => {
            e.preventDefault();
            handleTouch('right', true);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            handleTouch('right', false);
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            handleTouch('right', true);
          }}
          onMouseUp={(e) => {
            e.preventDefault();
            handleTouch('right', false);
          }}
          onMouseLeave={(e) => {
            e.preventDefault();
            handleTouch('right', false);
          }}
          style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
        >
          <ChevronRight size={28} />
        </button>
      </div>

      {/* Tablet mode toggle button */}
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={toggleTabletMode}
          className="px-3 py-1 bg-purple-500/80 text-white rounded text-sm font-bold shadow-lg"
        >
          Tablet Mode
        </button>
      </div>
    </div>
  );
}
