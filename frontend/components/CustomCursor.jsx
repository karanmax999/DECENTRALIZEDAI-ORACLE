import { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [trails, setTrails] = useState([]);

  useEffect(() => {
    const updateMousePosition = (e) => {
      const newPosition = { x: e.clientX, y: e.clientY };
      setMousePosition(newPosition);
      
      // Add trail point
      setTrails(prev => {
        const newTrails = [...prev, { ...newPosition, id: Date.now() }];
        // Keep only last 10 trail points
        return newTrails.slice(-10);
      });
    };

    const handleMouseMove = (e) => {
      requestAnimationFrame(() => updateMousePosition(e));
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Fade out trails
    const trailInterval = setInterval(() => {
      setTrails(prev => prev.slice(1));
    }, 50);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(trailInterval);
    };
  }, []);

  return (
    <>
      {/* Main Cursor */}
      <div
        className="custom-cursor"
        style={{
          left: `${mousePosition.x - 10}px`,
          top: `${mousePosition.y - 10}px`,
        }}
      />
      
      {/* Cursor Trails */}
      {trails.map((trail, index) => (
        <div
          key={trail.id}
          className="cursor-trail"
          style={{
            left: `${trail.x - 3}px`,
            top: `${trail.y - 3}px`,
            opacity: (index + 1) / trails.length * 0.6,
            transform: `scale(${(index + 1) / trails.length})`,
          }}
        />
      ))}
    </>
  );
};

export default CustomCursor;
