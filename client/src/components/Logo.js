import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Logo = ({ size = 'medium', showText = true, className = '' }) => {
  const { colors } = useTheme();

  const sizeClasses = {
    small: {
      container: 'flex items-center gap-2',
      icon: 'text-2xl',
      text: 'text-lg font-bold',
      underline: 'h-0.5'
    },
    medium: {
      container: 'flex items-center gap-3',
      icon: 'text-3xl',
      text: 'text-xl font-bold',
      underline: 'h-0.5'
    },
    large: {
      container: 'flex items-center gap-4',
      icon: 'text-4xl',
      text: 'text-2xl font-bold',
      underline: 'h-1'
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`${currentSize.container} ${className}`}>
      {/* Animated Logo Icon */}
      <div className="relative">
        <div className={`${currentSize.icon} logo-icon-animated transition-all duration-300`}>
          🤖
        </div>
        <div className={`${currentSize.icon} logo-icon-overlay absolute top-0 left-0 opacity-0`}>
          🧠
        </div>
        <div className={`${currentSize.icon} logo-icon-overlay absolute top-0 left-0 opacity-0`}>
          💡
        </div>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="relative">
          <h1 className={`${currentSize.text} logo-text-gradient ${colors.textPrimary} tracking-tight`}>
            IntelliHealth Assistant
          </h1>
          <div className={`logo-underline ${currentSize.underline} w-full rounded-full mt-1`}></div>
        </div>
      )}

      <style jsx>{`
        .logo-icon-animated {
          background: linear-gradient(45deg, #06b6d4, #8b5cf6, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.3));
          animation: iconPulse 2s ease-in-out infinite;
        }

        .logo-icon-overlay:nth-child(2) {
          background: linear-gradient(45deg, #06b6d4, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: iconCycle 6s ease-in-out infinite;
        }

        .logo-icon-overlay:nth-child(3) {
          background: linear-gradient(45deg, #ec4899, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: iconCycle 6s ease-in-out infinite 3s;
        }

        .logo-text-gradient {
          background: linear-gradient(45deg, #1e293b, #334155, #475569);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
        }

        .logo-underline {
          background: linear-gradient(90deg, #06b6d4, #8b5cf6, #ec4899, #06b6d4);
          background-size: 200% 100%;
          animation: underlineFlow 3s ease-in-out infinite;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.4);
        }

        @keyframes iconPulse {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.3));
          }
          50% {
            transform: scale(1.05);
            filter: drop-shadow(0 0 15px rgba(139, 92, 246, 0.6));
          }
        }

        @keyframes iconCycle {
          0%, 90%, 100% {
            opacity: 0;
            transform: scale(0.8) rotate(-10deg);
          }
          30%, 60% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes underlineFlow {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        /* Dark mode specific styles */
        .dark .logo-text-gradient {
          background: linear-gradient(45deg, #f8fafc, #e2e8f0, #cbd5e1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Hover effects */
        .logo-icon-animated:hover {
          animation-duration: 1s;
          transform: scale(1.1);
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .logo-text-gradient {
            font-size: 0.9em;
          }
        }
      `}</style>
    </div>
  );
};

export default Logo; 