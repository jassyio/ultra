import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const StartPage = () => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle, #120026, #0a001a)", // Deep dark purple-black
        color: "#fff",
        fontFamily: "'Poppins', sans-serif",
        textAlign: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Bold Geometric Background */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          backgroundImage: `
            linear-gradient(45deg, rgba(255,0,255,0.08) 25%, transparent 25%, transparent 75%, rgba(255,0,255,0.08) 75%, rgba(255,0,255,0.08)),
            linear-gradient(45deg, rgba(255,0,255,0.08) 25%, transparent 25%, transparent 75%, rgba(255,0,255,0.08) 75%, rgba(255,0,255,0.08))
          `,
          backgroundSize: "60px 60px",
          opacity: 0.3,
          zIndex: 1,
        }}
      ></div>

      <div
        style={{
          position: "relative",
          zIndex: 2,
          opacity: showContent ? 1 : 0,
          transform: showContent ? "translateY(0)" : "translateY(-20px)",
          transition: "opacity 1s ease-out, transform 0.8s ease-out",
        }}
      >
        {/* Animated Title */}
        <h1
          style={{
            fontSize: "4.5rem",
            fontWeight: "bold",
            letterSpacing: "3px",
            textShadow: "0px 6px 30px rgba(255, 255, 255, 0.6)",
            background:
              "linear-gradient(90deg, #ff0080, #ff00ff, #8000ff, #4b0082)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            animation: "pulseGlow 2s infinite alternate",
          }}
        >
          ULTRA
        </h1>

        {/* Subtext - AI-Generated Anime OS Vibe */}
        <p
          style={{
            fontSize: "1.8rem",
            fontWeight: "500",
            marginBottom: "30px",
            background:
              "linear-gradient(90deg, #ff00ff, #ff99ff, #cc00ff, #6600ff)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            textShadow: "0px 2px 15px rgba(255, 255, 255, 0.3)",
            transition: "color 0.6s ease-in-out",
          }}
        >
          Connecting the World
        </p>

        {/* Get Started Button with Smooth Hover */}
        <Link
          to="/login"
          style={{
            padding: "18px 50px",
            background:
              "linear-gradient(135deg, #ff0080, #ff00ff, #8000ff, #4b0082)",
            fontSize: "1.4rem",
            fontWeight: "700",
            borderRadius: "50px",
            textDecoration: "none",
            color: "#fff",
            boxShadow: "0px 8px 30px rgba(255, 0, 255, 0.5)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            display: "inline-block",
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "scale(1.2)";
            e.target.style.boxShadow = "0px 12px 40px rgba(255, 0, 255, 0.7)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0px 8px 30px rgba(255, 0, 255, 0.5)";
          }}
        >
          Get Started
        </Link>
      </div>

      {/* Keyframe Animation */}
      <style>
        {`
          @keyframes pulseGlow {
            0% { text-shadow: 0px 6px 30px rgba(255, 255, 255, 0.6); }
            100% { text-shadow: 0px 10px 40px rgba(255, 255, 255, 0.9); }
          }
        `}
      </style>
    </div>
  );
};

export default StartPage;
