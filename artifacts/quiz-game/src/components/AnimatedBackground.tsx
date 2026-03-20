import { motion } from "framer-motion";
import { useMemo } from "react";

export function AnimatedBackground() {
  // Generate stable random properties for shapes
  const shapes = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: Math.random() * 80 + 40,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
      type: Math.floor(Math.random() * 3), // 0: circle, 1: square, 2: triangle
      colorClass: ['bg-primary/20', 'bg-secondary/20', 'bg-accent/20'][Math.floor(Math.random() * 3)]
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-background transition-colors duration-500">
      {shapes.map((shape) => {
        const borderRadius = shape.type === 0 ? "50%" : shape.type === 1 ? "16px" : "0%";
        const clipPath = shape.type === 2 ? "polygon(50% 0%, 0% 100%, 100% 100%)" : "none";
        
        return (
          <motion.div
            key={shape.id}
            className={`absolute ${shape.colorClass} backdrop-blur-3xl`}
            style={{
              width: shape.size,
              height: shape.size,
              borderRadius: shape.type !== 2 ? borderRadius : 0,
              clipPath,
              top: `${shape.y}%`,
              left: `${shape.x}%`,
            }}
            animate={{
              y: ["0%", "100%", "0%"],
              x: ["0%", "50%", "0%"],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: shape.duration,
              delay: shape.delay,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        );
      })}
      
      {/* Soft gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />
    </div>
  );
}
