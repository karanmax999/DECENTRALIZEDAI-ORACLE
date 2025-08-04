import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const CyberCard = ({ 
  children, 
  className = '', 
  glowColor = 'primary', 
  tiltEnabled = true,
  animationDelay = 0 
}) => {
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const glowColors = {
    primary: 'rgba(0, 217, 255, 0.4)',
    secondary: 'rgba(255, 0, 255, 0.4)',
    accent: 'rgba(0, 255, 136, 0.4)',
    orange: 'rgba(255, 128, 0, 0.4)',
  };

  useEffect(() => {
    const card = cardRef.current;
    if (!card || !tiltEnabled) return;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / centerY * -10;
      const rotateY = (x - centerX) / centerX * 10;
      
      setMousePosition({ x: rotateX, y: rotateY });
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setMousePosition({ x: 0, y: 0 });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [tiltEnabled]);

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: animationDelay,
        ease: "easeOut",
      },
    },
    hover: {
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      ref={cardRef}
      className={`
        glass-card p-6 relative overflow-hidden group cursor-none
        ${tiltEnabled ? 'tilt-card' : ''}
        ${className}
      `}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      style={{
        transform: tiltEnabled 
          ? `perspective(1000px) rotateX(${mousePosition.x}deg) rotateY(${mousePosition.y}deg)`
          : 'none',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.1s ease-out',
      }}
    >
      {/* Animated border glow */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(45deg, ${glowColors[glowColor]}, transparent, ${glowColors[glowColor]})`,
          backgroundSize: '200% 200%',
          animation: isHovered ? 'holographic-shine 2s ease-in-out infinite' : 'none',
        }}
      />
      
      {/* Inner glow effect */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at center, ${glowColors[glowColor]} 0%, transparent 70%)`,
        }}
      />
      
      {/* Holographic scan line */}
      <motion.div
        className="absolute inset-0 rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100"
        initial={{ y: '-100%' }}
        animate={isHovered ? { y: '100%' } : { y: '-100%' }}
        transition={{ duration: 1.5, ease: "easeInOut", repeat: isHovered ? Infinity : 0 }}
      >
        <div 
          className="w-full h-1 bg-gradient-to-r from-transparent via-primary-glow to-transparent"
          style={{ boxShadow: `0 0 20px ${glowColors[glowColor]}` }}
        />
      </motion.div>
      
      {/* Corner accents */}
      <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 opacity-50 group-hover:opacity-100 transition-opacity duration-300"
           style={{ borderColor: glowColors[glowColor] }} />
      <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 opacity-50 group-hover:opacity-100 transition-opacity duration-300"
           style={{ borderColor: glowColors[glowColor] }} />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 opacity-50 group-hover:opacity-100 transition-opacity duration-300"
           style={{ borderColor: glowColors[glowColor] }} />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 opacity-50 group-hover:opacity-100 transition-opacity duration-300"
           style={{ borderColor: glowColors[glowColor] }} />
      
      {/* Content */}
      <div className="relative z-10 transform-gpu"
           style={{ transform: 'translateZ(20px)' }}>
        {children}
      </div>
      
      {/* Floating particles effect */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: glowColors[glowColor],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, -40],
                opacity: [1, 0],
                scale: [1, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default CyberCard;
