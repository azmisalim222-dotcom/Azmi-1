import React from 'react';
import { Course } from '../types';
import { ArrowLeft, Cpu, Code2, Pi, Activity, Radio, AppWindow, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  course: Course;
  onClick: () => void;
  index: number;
}

const getIconForCourse = (course: Course) => {
  const title = course.title.toLowerCase();
  
  // Updated to brighter, more modern colors matching the Violet/Cyan theme
  if (title.includes('math') || title.includes('calc') || title.includes('prob') || title.includes('discrete')) {
    return <Pi size={24} className="text-secondary-500" />;
  }
  if (title.includes('prog') || title.includes('soft') || title.includes('hci')) {
    return <Code2 size={24} className="text-primary-500" />;
  }
  if (title.includes('network') || title.includes('comm') || title.includes('sec')) {
    return <Radio size={24} className="text-rose-500" />;
  }
  if (title.includes('os') || title.includes('sys')) {
    return <AppWindow size={24} className="text-blue-500" />;
  }
  if (title.includes('logic') || title.includes('arch') || title.includes('org') || title.includes('micro') || title.includes('circ')) {
    return <Cpu size={24} className="text-orange-500" />;
  }
  if (title.includes('phys') || title.includes('chem')) {
    return <Activity size={24} className="text-pink-500" />;
  }
  return <Globe size={24} className="text-gray-500" />;
};

export const CourseCard: React.FC<Props> = ({ course, onClick, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="group relative bg-white dark:bg-dark-900 rounded-[2rem] p-1 shadow-sm hover:shadow-xl dark:shadow-none hover:shadow-primary-500/10 transition-all duration-500 cursor-pointer h-full"
      onClick={onClick}
    >
      {/* Border Gradient on Hover */}
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary-500/30 to-secondary-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="relative h-full bg-white dark:bg-dark-900 rounded-[1.8rem] overflow-hidden flex flex-col border border-gray-100 dark:border-white/5">
        
        {/* Header */}
        <div className="p-6 pb-2 flex justify-between items-start">
          <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-primary-50 dark:group-hover:bg-primary-500/10 transition-colors">
            {getIconForCourse(course)}
          </div>
          <div className="flex items-center gap-1 bg-green-50 dark:bg-green-500/10 px-3 py-1.5 rounded-full border border-green-100 dark:border-green-500/10">
            <span className="text-green-700 dark:text-green-400 font-bold text-xs">{course.price} SR</span>
          </div>
        </div>

        <div className="p-6 pt-2 flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {course.title}
          </h3>
          
          <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-6 flex-1 font-light leading-relaxed">
            {course.description}
          </p>

          <div className="flex items-center justify-end pt-4 border-t border-gray-50 dark:border-white/5">
             <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-primary-600 group-hover:text-white transition-all transform group-hover:scale-110">
               <ArrowLeft size={18} />
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};