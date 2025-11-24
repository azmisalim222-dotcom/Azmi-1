import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, Search, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  darkMode: boolean;
  toggleTheme: () => void;
  goHome: () => void;
  goToCatalog: () => void;
  goToAITutor: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleTheme, goHome, goToCatalog, goToAITutor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'الرئيسية', action: goHome },
    { name: 'المواد التعليمية', action: goToCatalog },
  ];

  const handleWhatsapp = () => {
     window.open(`https://wa.me/966556409492`, '_blank');
  };

  return (
    <>
    <nav className={`fixed top-4 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'px-4 md:px-12' : 'px-4 md:px-8'}`}>
      <div className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 ${scrolled ? 'glass shadow-lg shadow-black/5 dark:shadow-black/20' : 'bg-transparent'}`}>
        <div className="flex items-center justify-between h-16 md:h-20 px-4 md:px-6">
          
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer flex items-center gap-2" onClick={goHome}>
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/20">
              ع
            </div>
            <span className="font-heading font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-500 dark:from-white dark:to-gray-400">
              عزمي
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2 space-x-reverse bg-gray-100/50 dark:bg-white/5 p-1.5 rounded-full border border-gray-200 dark:border-white/5 backdrop-blur-sm">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={link.action}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white dark:hover:bg-white/10 font-medium transition-all px-5 py-2 rounded-full text-sm"
              >
                {link.name}
              </button>
            ))}
            
            {/* AI Assistant Button - Special Styling */}
            <button
              onClick={goToAITutor}
              className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 text-white px-5 py-2 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all transform hover:scale-105"
            >
               <GraduationCap size={18} />
               <span>المساعد الذكي</span>
            </button>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
             {/* Theme Toggle */}
             <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-secondary-400 hover:bg-gray-200 dark:hover:bg-white/20 transition-all"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Whatsapp CTA */}
            <button 
              onClick={handleWhatsapp}
              className="bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-primary-600 dark:hover:bg-primary-300 hover:text-white dark:hover:text-black px-5 py-2.5 rounded-full font-bold text-sm transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              تواصل معنا
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
             <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-secondary-400"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 dark:text-white p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-full left-4 right-4 mt-2 bg-white dark:bg-dark-900 border border-gray-100 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden p-2"
          >
            <div className="space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    link.action();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-end px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors"
                >
                  {link.name}
                </button>
              ))}
               <button
                  onClick={() => {
                    goToAITutor();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-end px-4 py-3 text-sm font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/10 rounded-xl transition-colors"
                >
                  <GraduationCap size={18} className="ml-2" />
                  المساعد الذكي
                </button>

              <div className="pt-2 border-t border-gray-100 dark:border-white/5">
                <button 
                  onClick={handleWhatsapp}
                  className="w-full bg-gray-900 dark:bg-white text-white dark:text-black px-3 py-3 rounded-xl font-bold text-sm"
                >
                  تواصل واتساب
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
    </>
  );
};
