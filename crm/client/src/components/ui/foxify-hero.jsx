import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function FoxifyHero({
  logo = { initial: "F", text: "oxify" },
  navigation = [],
  authButtons,
  badge,
  title,
  description,
  ctaButtons,
  className,
  children,
}) {
  return (
    <section
      className={cn(
        "relative w-full min-h-screen flex flex-col items-center overflow-hidden",
        className
      )}
      style={{ background: "#0A0A1A" }}
      role="banner"
      aria-label="Hero section"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0" style={{ background: "#0A0A1A" }} />

        <motion.div
          className="absolute"
          style={{
            width: "1438px",
            height: "653px",
            left: "1.5px",
            top: "371.5px",
            background: "#6366F1",
            filter: "blur(150px)",
            opacity: 0.35,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          transition={{ duration: 1.5 }}
        />
        <motion.div
          className="absolute"
          style={{
            width: "1438px",
            height: "653px",
            left: "1.5px",
            top: "371.5px",
            background: "#8B5CF6",
            filter: "blur(150px)",
            opacity: 0.25,
            transform: "matrix(-1, 0, 0, 1, 0, 0)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          transition={{ duration: 1.5, delay: 0.2 }}
        />

        <div
          className="absolute flex-row justify-between items-center hidden lg:flex"
          style={{
            width: "1940px",
            height: "500px",
            left: "-250px",
            top: "-250px",
            gap: "940px",
          }}
        >
          <motion.div
            style={{
              width: "500px",
              height: "500px",
              background: "#6366F1",
              filter: "blur(150px)",
              borderRadius: "50%",
              opacity: 0.25,
            }}
            animate={{
              x: [0, 60, 120, 60, 0],
              y: [0, -80, 0, 80, 0],
              scale: [1, 1.2, 1.4, 1.2, 1],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            style={{
              width: "500px",
              height: "500px",
              background: "#8B5CF6",
              filter: "blur(150px)",
              borderRadius: "50%",
              opacity: 0.2,
            }}
            animate={{
              x: [0, -60, -120, -60, 0],
              y: [0, 90, 0, -90, 0],
              scale: [1, 1.3, 1.5, 1.3, 1],
            }}
            transition={{
              duration: 32,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>

      {/* Glassmorphic Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-row justify-between items-center px-4 py-2.5 mt-5"
        style={{
          width: "min(1200px, 92vw)",
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        <span
          style={{
            fontFamily: "Manrope, sans-serif",
            fontStyle: "normal",
            fontWeight: 700,
            fontSize: "22px",
            lineHeight: "30px",
            letterSpacing: "-0.03em",
            color: "#F1F5F9",
            flexShrink: 0,
          }}
        >
          {logo.initial}{logo.text}
        </span>

        <nav className="hidden lg:flex flex-row items-center gap-1" aria-label="Main navigation">
          {navigation.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="flex flex-row items-center gap-1 hover:opacity-70 transition-opacity whitespace-nowrap px-3 py-1.5 rounded-lg hover:bg-white/5"
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                letterSpacing: "-0.03em",
                color: "#94A3B8",
              }}
            >
              {item.label}
              {item.hasDropdown && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 10L12 15L17 10"
                    stroke="#94A3B8"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </nav>

        {authButtons && (
          <div className="flex flex-row items-center gap-3 flex-shrink-0">
            <button
              onClick={authButtons.login.onClick}
              className="flex flex-col justify-center items-center px-4 py-2 rounded-lg transition-all hover:scale-105 hover:bg-white/10"
              style={{
                background: "transparent",
                fontFamily: "Manrope, sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                letterSpacing: "-0.03em",
                color: "#CBD5E1",
              }}
            >
              {authButtons.login.label}
            </button>
            <button
              onClick={authButtons.signup.onClick}
              className="flex flex-col justify-center items-center px-5 py-2 rounded-lg transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                border: "1px solid rgba(99, 102, 241, 0.3)",
                fontFamily: "Manrope, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "-0.03em",
                color: "#FFFFFF",
              }}
            >
              {authButtons.signup.label}
            </button>
          </div>
        )}
      </motion.header>

      {/* Center Content */}
      {children ? (
        <div className="relative z-10 flex-1 flex items-center justify-center w-full">
          {children}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative z-10 flex flex-col justify-center items-center px-4"
          style={{
            maxWidth: "1133px",
            gap: "55px",
            marginTop: "clamp(60px, 10vh, 120px)",
          }}
        >
          {badge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-row justify-center items-center px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(255, 255, 255, 0.06)",
                gap: "5px",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              {badge.icon}
              <span
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "16px",
                  letterSpacing: "-0.03em",
                  color: "#94A3B8",
                }}
              >
                {badge.text}
              </span>
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-center"
            style={{
              fontFamily: "Manrope, sans-serif",
              fontWeight: 500,
              fontSize: "clamp(32px, 5vw, 64px)",
              lineHeight: "1.17",
              letterSpacing: "-0.03em",
              background: "linear-gradient(90deg, #6366F1 0%, #8B5CF6 50%, #3B82F6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-center max-w-3xl"
            style={{
              fontFamily: "Manrope, sans-serif",
              fontWeight: 500,
              fontSize: "clamp(16px, 2vw, 20px)",
              lineHeight: "1.45",
              letterSpacing: "-0.03em",
              color: "#94A3B8",
            }}
          >
            {description}
          </motion.p>

          {ctaButtons && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-row items-center gap-11"
            >
              <button
                onClick={ctaButtons.primary.onClick}
                className="flex flex-col justify-center items-center px-6 py-3 rounded-md transition-all hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "16px",
                  letterSpacing: "-0.03em",
                  color: "#FFFFFF",
                }}
              >
                {ctaButtons.primary.label}
              </button>
              <button
                onClick={ctaButtons.secondary.onClick}
                className="flex flex-col justify-center items-center px-6 py-3 rounded-md transition-all hover:scale-105"
                style={{
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "16px",
                  letterSpacing: "-0.03em",
                  color: "#F1F5F9",
                }}
              >
                {ctaButtons.secondary.label}
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </section>
  );
}
