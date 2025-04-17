"use client";

import { Menu, X, Eye, EyeOff } from "lucide-react"
import UserMenu from "@/components/user/UserMenu"
import Link from "next/link"
import { useState, useEffect } from "react"
import config from "@/config";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  
  // Debug logging
  useEffect(() => {
    console.log("Zened Driver Header component rendered");
  }, []);

  const toggleFocusMode = () => {
    setFocusMode(!focusMode);
    // In a real implementation, this would trigger app-wide focus mode
  };

  return (
    <header className="bg-primary text-white shadow-md py-4 px-4 border-b border-primary/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/app/">
            <h1 className="text-xl font-semibold">{config.metadata.title}</h1>
          </Link>
          
          {/* Driving status indicator */}
          <div className="ml-4 hidden md:flex items-center">
            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${focusMode ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></span>
            <span className="text-sm font-medium">{focusMode ? 'Focus Active' : 'Standard Mode'}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Focus Mode Toggle */}
          <button 
            onClick={toggleFocusMode}
            className="flex items-center justify-center px-3 py-1.5 bg-secondary rounded-full text-xs font-medium text-primary transition-all duration-200 hover:bg-secondary/90"
          >
            {focusMode ? (
              <>
                <EyeOff size={14} className="mr-1" />
                <span>Focused</span>
              </>
            ) : (
              <>
                <Eye size={14} className="mr-1" />
                <span>Focus Mode</span>
              </>
            )}
          </button>
          
          <UserMenu />
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-primary/80 transition-all duration-200 shadow-sm hover:shadow-md" 
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 py-2 border-t border-primary/20">
          <nav className="flex flex-col space-y-2">
            <Link href="/app" className="px-4 py-2 hover:bg-primary/80 rounded-md">
              Dashboard
            </Link>
            <Link href="/analytics" className="px-4 py-2 hover:bg-primary/80 rounded-md">
              Analytics
            </Link>
            <div className="px-4 py-2 flex items-center">
              <span className="mr-2">Focus Mode:</span>
              <button 
                onClick={toggleFocusMode}
                className={`px-3 py-1 rounded-full text-xs ${focusMode ? 'bg-secondary text-primary' : 'bg-primary/20'}`}
              >
                {focusMode ? 'On' : 'Off'}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

