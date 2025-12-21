import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// Theme configurations
const themes = {
  default: {
    primary: '#d97706', // amber-600
    secondary: '#dc2626', // red-600
    accent: '#15803d', // green-700
    gradient: 'from-amber-600 to-red-600',
    name: 'default'
  },
  african: {
    primary: '#15803d', // green-700
    secondary: '#eab308', // yellow-500
    accent: '#dc2626', // red-600
    gradient: 'from-green-600 to-yellow-500',
    name: 'african',
    colors: {
      text: 'text-green-700',
      bg: 'bg-green-600',
      hover: 'hover:bg-green-700',
      border: 'border-green-600'
    }
  },
  latino: {
    primary: '#dc2626', // red-600
    secondary: '#ea580c', // orange-600
    accent: '#eab308', // yellow-500
    gradient: 'from-red-600 to-orange-600',
    name: 'latino',
    colors: {
      text: 'text-red-600',
      bg: 'bg-red-600',
      hover: 'hover:bg-red-700',
      border: 'border-red-600'
    }
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(themes.default);
  const location = useLocation();

  useEffect(() => {
    // Detect theme based on URL path
    const path = location.pathname.toLowerCase();
    
    if (path.includes('/shop/african') || path.includes('african')) {
      setCurrentTheme(themes.african);
    } else if (path.includes('/shop/latino') || path.includes('latino')) {
      setCurrentTheme(themes.latino);
    } else {
      setCurrentTheme(themes.default);
    }
  }, [location]);

  const value = {
    theme: currentTheme,
    themes,
    setTheme: (themeName) => {
      if (themes[themeName]) {
        setCurrentTheme(themes[themeName]);
      }
    }
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
