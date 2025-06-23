import React from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useGame } from "../../lib/stores/useGame";

export default function TouchControls() {
  const { phase } = useGame();

  const handleTouch = (direction: string, pressed: boolean) => {
    console.log(`Touch control: ${direction} ${pressed ? 'pressed' : 'released'}`);
    
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
    </div>
  );
}
