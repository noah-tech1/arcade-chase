import React from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useGame } from "../../lib/stores/useGame";

export default function TouchControls() {
  const { phase, joystickMode, toggleJoystickMode } = useGame();
  const [joystickPosition, setJoystickPosition] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const joystickRef = React.useRef<HTMLDivElement>(null);

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

  const handleJoystickMove = (event: React.TouchEvent | React.MouseEvent) => {
    if (!joystickMode || !joystickRef.current) return;

    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let clientX, clientY;
    if ('touches' in event) {
      if (event.touches.length === 0) return;
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = 40; // Maximum joystick travel distance

    let x = deltaX;
    let y = deltaY;

    // Constrain to circle
    if (distance > maxDistance) {
      x = (deltaX / distance) * maxDistance;
      y = (deltaY / distance) * maxDistance;
    }

    setJoystickPosition({ x, y });

    // Convert joystick position to keyboard events
    const threshold = 15;
    
    // Stop all current movement
    ['left', 'right', 'up', 'down'].forEach(direction => {
      handleTouch(direction, false);
    });

    // Start movement based on joystick position
    if (Math.abs(x) > threshold || Math.abs(y) > threshold) {
      if (Math.abs(x) > Math.abs(y)) {
        // Horizontal movement
        if (x > threshold) {
          handleTouch('right', true);
        } else if (x < -threshold) {
          handleTouch('left', true);
        }
      } else {
        // Vertical movement
        if (y > threshold) {
          handleTouch('down', true);
        } else if (y < -threshold) {
          handleTouch('up', true);
        }
      }
    }
  };

  const handleJoystickStart = () => {
    setIsDragging(true);
  };

  const handleJoystickEnd = () => {
    setIsDragging(false);
    setJoystickPosition({ x: 0, y: 0 });
    
    // Stop all movement when joystick is released
    ['left', 'right', 'up', 'down'].forEach(direction => {
      handleTouch(direction, false);
    });
  };

  // Joystick mode overlay
  if (joystickMode) {
    return (
      <div className="fixed bottom-8 left-8 z-50">
        {/* Joystick base */}
        <div 
          ref={joystickRef}
          className="relative w-24 h-24 bg-gray-800/80 border-2 border-cyan-400 rounded-full flex items-center justify-center"
          onTouchStart={handleJoystickStart}
          onTouchMove={handleJoystickMove}
          onTouchEnd={handleJoystickEnd}
          onMouseDown={handleJoystickStart}
          onMouseMove={isDragging ? handleJoystickMove : undefined}
          onMouseUp={handleJoystickEnd}
          onMouseLeave={handleJoystickEnd}
          style={{ touchAction: 'none' }}
        >
          {/* Joystick knob */}
          <div 
            className="absolute w-8 h-8 bg-cyan-400 rounded-full shadow-lg transition-all duration-100 ease-out"
            style={{
              transform: `translate(${joystickPosition.x}px, ${joystickPosition.y}px)`,
              backgroundColor: isDragging ? '#06b6d4' : '#22d3ee'
            }}
          />
          
          {/* Center dot */}
          <div className="w-2 h-2 bg-cyan-200 rounded-full opacity-50" />
        </div>

        {/* Joystick mode toggle button */}
        <button
          onClick={toggleJoystickMode}
          className="absolute -top-12 left-0 px-3 py-1 bg-purple-500/80 text-white rounded text-sm font-bold shadow-lg"
        >
          Exit Joystick
        </button>
      </div>
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

      {/* Joystick mode toggle button */}
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={toggleJoystickMode}
          className="px-3 py-1 bg-purple-500/80 text-white rounded text-sm font-bold shadow-lg"
        >
          Joystick Mode
        </button>
      </div>
    </div>
  );
}
