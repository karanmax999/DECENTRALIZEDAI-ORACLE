import { useEffect, useState, useRef } from 'react';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [trails, setTrails] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalTimeoutRef = useRef(null);

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
      // Show cursor if it was hidden
      setIsVisible(true);
      
      // Clear any existing timeout
      if (modalTimeoutRef.current) {
        clearTimeout(modalTimeoutRef.current);
      }
      
      requestAnimationFrame(() => updateMousePosition(e));
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Listen for wallet connection modal events
    const handleModalOpen = () => {
      setIsModalOpen(true);
      setIsVisible(true);
    };

    const handleModalClose = () => {
      setIsModalOpen(false);
      // Set a timeout to hide the cursor again after the modal is closed
      modalTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 100);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);
    
    // Listen for custom events that might indicate modal opening/closing
    window.addEventListener('walletModalOpen', handleModalOpen);
    window.addEventListener('walletModalClose', handleModalClose);

    // Fade out trails
    const trailInterval = setInterval(() => {
      setTrails(prev => prev.slice(1));
    }, 50);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('walletModalOpen', handleModalOpen);
      window.removeEventListener('walletModalClose', handleModalClose);
      
      if (modalTimeoutRef.current) {
        clearTimeout(modalTimeoutRef.current);
      }
      
      clearInterval(trailInterval);
    };
  }, []);

  return (
    <>
      {/* Main Cursor */}
      <div
        className={`custom-cursor ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{
          left: `${mousePosition.x - 10}px`,
          top: `${mousePosition.y - 10}px`,
          transition: 'opacity 0.2s ease-in-out',
        }}
      />
      
      {/* Cursor Trails */}
      {trails.map((trail, index) => (
        <div
          key={trail.id}
          className={`cursor-trail ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{
            left: `${trail.x - 3}px`,
            top: `${trail.y - 3}px`,
            opacity: (index + 1) / trails.length * 0.6,
            transform: `scale(${(index + 1) / trails.length})`,
            transition: 'opacity 0.2s ease-in-out',
          }}
        />
      ))}
    </>
  );
};

export default CustomCursor;
