"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ExternalLink, Code2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface StackedCard {
  title: string;
  description: string;
  href: string;
  technologies: string[];
  content: React.ReactNode;
  imageUrl?: string;
}

interface StackedCards3DProps {
  content: StackedCard[];
  sectionLabel?: string;
  sectionTitle?: string;
  featuredLabel?: string;
  viewDetailsLabel?: string;
}

export function StackedCards3D({
  content,
  sectionLabel,
  sectionTitle,
  featuredLabel,
  viewDetailsLabel = "View Details",
}: StackedCards3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full py-20 md:py-32">
      {/* Header Section */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl mb-16 md:mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          {sectionLabel && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-linear-to-r from-primary/10 via-purple-500/10 to-primary/10 border border-primary/30 backdrop-blur-sm relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-primary/0 via-primary/20 to-primary/0"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-primary relative z-10" />
              </motion.div>
              <span className="text-sm font-semibold text-primary uppercase tracking-wider relative z-10">
                {sectionLabel}
              </span>
            </motion.div>
          )}
          {sectionTitle && (
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-white relative inline-block"
            >
              <span className="relative">
                {sectionTitle}
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-linear-to-r from-transparent via-primary to-transparent"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </span>
            </motion.h2>
          )}
        </motion.div>
      </div>

      {/* Cards Container */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          {content.map((card, index) => {
            const cardProgress = useTransform(
              scrollYProgress,
              [index / content.length, (index + 1) / content.length],
              [0, 1]
            );

            const smoothProgress = useSpring(cardProgress, {
              stiffness: 100,
              damping: 30,
              restDelta: 0.001,
            });

            const y = useTransform(smoothProgress, [0, 1], [60, 0]);
            const opacity = useTransform(smoothProgress, [0, 0.5, 1], [0, 0.5, 1]);
            const scale = useTransform(smoothProgress, [0, 1], [0.9, 1]);
            const rotateX = useTransform(smoothProgress, [0, 1], [8, 0]);

            return (
              <StackedCard
                key={index}
                card={card}
                index={index}
                y={y}
                opacity={opacity}
                scale={scale}
                rotateX={rotateX}
                mousePosition={mousePosition}
                isHovered={hoveredCard === index}
                onHover={() => setHoveredCard(index)}
                onLeave={() => setHoveredCard(null)}
                featuredLabel={featuredLabel}
                viewDetailsLabel={viewDetailsLabel}
              />
            );
          })}
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/3 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </div>
  );
}

interface StackedCardProps {
  card: StackedCard;
  index: number;
  y: any;
  opacity: any;
  scale: any;
  rotateX: any;
  mousePosition: { x: number; y: number };
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  featuredLabel?: string;
  viewDetailsLabel?: string;
}

function StackedCard({
  card,
  index,
  y,
  opacity,
  scale,
  rotateX,
  mousePosition,
  isHovered,
  onHover,
  onLeave,
  featuredLabel,
  viewDetailsLabel,
}: StackedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardBounds, setCardBounds] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setCardBounds({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      });
    }
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const magneticStrength = 0.15;
  const magneticX = !isMobile && isHovered
    ? (mousePosition.x - cardBounds.x - cardBounds.width / 2) * magneticStrength
    : 0;
  const magneticY = !isMobile && isHovered
    ? (mousePosition.y - cardBounds.y - cardBounds.height / 2) * magneticStrength
    : 0;

  return (
    <motion.div
      ref={cardRef}
      style={{
        y,
        opacity,
        scale,
        rotateX,
      }}
      className="relative group"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <Link href={card.href}>
        <motion.div
          animate={{
            x: magneticX,
            y: magneticY,
          }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 15,
            mass: 0.1,
          }}
          className="relative"
        >
          {/* Glow Effect */}
          <div className="absolute -inset-0.5 bg-linear-to-r from-primary via-purple-500 to-primary rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />

          {/* Card Container */}
          <div className="relative bg-linear-to-br from-dark-lighter/80 to-dark/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-500 shadow-2xl hover:shadow-primary/10">
            {/* Gradient Border Animation */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/0 via-primary/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Top Border Glow */}
            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Featured Badge */}
            {index === 0 && featuredLabel && (
              <div className="absolute top-4 right-4 z-10">
                <div className="px-3 py-1.5 rounded-full bg-primary/90 backdrop-blur-sm border border-white/20 shadow-lg">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {featuredLabel}
                  </span>
                </div>
              </div>
            )}

            {/* Image Section */}
            <div className="relative h-64 md:h-80 overflow-hidden">
              <motion.div
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="w-full h-full"
              >
                {card.content}
              </motion.div>

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-linear-to-t from-dark-lighter/95 via-dark-lighter/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

              {/* Animated Gradient Orb */}
              <motion.div
                className="absolute -top-20 -right-20 w-40 h-40 bg-linear-to-br from-primary/30 to-purple-500/30 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Floating Tech Icons */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="p-2.5 rounded-xl bg-dark/70 backdrop-blur-md border border-white/10 shadow-lg"
                >
                  <Code2 className="w-4 h-4 text-primary" />
                </motion.div>
              </div>

              {/* Grid Pattern Overlay */}
              <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity duration-500">
                <div className="w-full h-full" style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                   linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                  backgroundSize: '20px 20px'
                }} />
              </div>
            </div>

            {/* Content Section */}
            <div className="relative p-6 md:p-8 space-y-4">
              {/* Title */}
              <h3 className="text-2xl md:text-3xl font-heading font-bold relative">
                <span className="bg-linear-to-r from-white via-white to-white group-hover:from-primary group-hover:via-purple-400 group-hover:to-primary bg-clip-text text-transparent transition-all duration-500">
                  {card.title}
                </span>
              </h3>

              {/* Description */}
              <p className="text-gray-text leading-relaxed line-clamp-3">
                {card.description}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2">
                {card.technologies.slice(0, 4).map((tech, i) => (
                  <motion.div
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative group/tech"
                  >
                    <div className="absolute -inset-0.5 bg-linear-to-r from-primary/20 to-purple-500/20 rounded-full opacity-0 group-hover/tech:opacity-100 blur transition-opacity duration-300" />
                    <span className="relative block px-3 py-1.5 text-xs font-medium bg-dark/80 backdrop-blur-sm border border-white/10 rounded-full text-gray-light group-hover/tech:text-white group-hover/tech:border-primary/50 transition-all duration-300">
                      {tech}
                    </span>
                  </motion.div>
                ))}
                {card.technologies.length > 4 && (
                  <motion.div whileHover={{ scale: 1.05 }} className="relative group/more">
                    <div className="absolute -inset-0.5 bg-linear-to-r from-primary/30 to-purple-500/30 rounded-full blur opacity-50" />
                    <span className="relative block px-3 py-1.5 text-xs font-bold bg-primary/20 border border-primary/40 rounded-full text-primary">
                      +{card.technologies.length - 4}
                    </span>
                  </motion.div>
                )}
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <motion.div
                  whileHover={{ x: 5 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-linear-to-r from-primary/10 to-purple-500/10 border border-primary/20 group/btn hover:border-primary/40 transition-all duration-300"
                >
                  <span className="relative font-semibold bg-linear-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                    {viewDetailsLabel}
                  </span>
                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ExternalLink className="w-4 h-4 text-primary" />
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Hover Shine Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
