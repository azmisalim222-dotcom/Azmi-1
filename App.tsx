import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AIAssistant } from './components/AIAssistant';
import { CourseCard } from './components/CourseCard';
import { RegistrationModal } from './components/RegistrationModal';
import { AITutorPage } from './components/AITutorPage';
import { COURSES, CATEGORY_LABELS } from './constants';
import { Category, Course, ViewState, ChatMessage } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle, Play, ChevronLeft, Cpu, Code, Calculator, Search, SlidersHorizontal, MessageCircle, Bot, Layout, Zap, X, Tag, Star, ArrowRight } from 'lucide-react';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [view, setView] = useState<ViewState>('HOME');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'DEFAULT' | 'PRICE_ASC' | 'PRICE_DESC'>('DEFAULT');
  const [showNotification, setShowNotification] = useState(true);

  // Persistent Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    // Check local storage or preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setView('DETAILS');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (cat: Category | 'ALL') => {
    setSelectedCategory(cat);
    setView('CATALOG');
    setSearchQuery(""); // Reset search on category change
    // Scroll to catalog section slightly delayed to allow render
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  };

  const getFilteredCourses = () => {
    let courses = COURSES;

    // Filter by Category
    if (selectedCategory !== 'ALL') {
      courses = courses.filter(c => c.category === selectedCategory);
    }

    // Filter by Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      courses = courses.filter(c => 
        c.title.toLowerCase().includes(query) || 
        c.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort
    if (sortBy === 'PRICE_ASC') {
      courses = [...courses].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'PRICE_DESC') {
      courses = [...courses].sort((a, b) => b.price - a.price);
    }

    return courses;
  };

  const filteredCourses = getFilteredCourses();

  // -- Views Components --

  const NotificationBar = () => (
    <AnimatePresence>
      {showNotification && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-dark-950 text-white relative z-[60] overflow-hidden border-b border-white/10"
        >
           <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3 text-xs md:text-sm font-medium">
              <span className="flex items-center justify-center w-5 h-5 bg-gradient-to-r from-secondary-400 to-secondary-600 rounded-full animate-pulse shadow-lg shadow-secondary-500/50">
                 <Zap size={10} className="text-white fill-white" />
              </span>
              <span>عرض خاص لفترة محدودة! استخدم كود <span className="font-mono font-bold text-secondary-400 mx-1">AZMI20</span> لخصم 20%</span>
              <button 
                onClick={() => setShowNotification(false)}
                className="absolute left-4 p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
           </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const HeroSection = () => (
    <section className="relative pt-40 pb-20 lg:pt-52 lg:pb-32 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary-500/20 dark:bg-primary-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-secondary-400/20 dark:bg-secondary-500/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] bg-violet-400/20 dark:bg-violet-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-5"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-white/50 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-sm shadow-sm">
             <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary-500"></span>
             </span>
             <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">معهد تعليمي ذكي</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] tracking-tight text-gray-900 dark:text-white">
            اصنع <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-secondary-400 to-primary-600 animate-gradient-x bg-[length:200%_auto]">مستقبلك</span> <br />
            بذكاء وإبداع
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            معهد عزمي يوفر لك كل ما تحتاجه للتفوق الجامعي. شروحات مركزة، متابعة ذكية، وتجربة تعليمية لا تضاهى.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => setView('CATALOG')}
              className="w-full sm:w-auto px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-primary-500/20 hover:shadow-primary-500/40"
            >
              استعرض المواد
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );

  const AboutSection = () => (
    <section className="py-24 bg-white dark:bg-dark-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">لماذا تختار <span className="text-primary-600 dark:text-primary-400">معهد عزمي</span>؟</h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl">
            صممنا المعهد ليكون الرفيق المثالي في رحلتك الجامعية. إليك ما يميزنا.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 grid-rows-3 gap-6 h-[1000px] md:h-[600px]">
           {/* Card 1: Large Feature */}
           <div className="col-span-1 md:col-span-2 row-span-2 rounded-[2.5rem] bg-gray-50 dark:bg-dark-900 p-8 flex flex-col justify-between border border-gray-100 dark:border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                 <div className="w-14 h-14 bg-primary-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary-500/30">
                    <BookOpen size={28} />
                 </div>
                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">شرح مبسط ومركز</h3>
                 <p className="text-gray-500 dark:text-gray-400 leading-relaxed">نقدم لك شروحات مصممة خصيصاً لتوفير وقتك وجهدك، مع التركيز على النقاط الأساسية التي تضمن لك الفهم العميق والدرجات العالية.</p>
              </div>
              <div className="relative h-40 mt-6 rounded-2xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-white/5 overflow-hidden">
                 {/* Mock UI */}
                 <div className="absolute top-4 left-4 right-4 h-2 bg-gray-100 dark:bg-white/5 rounded-full"></div>
                 <div className="absolute top-8 left-4 w-2/3 h-2 bg-gray-100 dark:bg-white/5 rounded-full"></div>
                 <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary-500/10 rounded-tl-full"></div>
              </div>
           </div>

           {/* Card 2: AI Assistant */}
           <div className="col-span-1 lg:col-span-2 row-span-1 rounded-[2.5rem] bg-dark-900 dark:bg-white text-white dark:text-black p-8 flex items-center justify-between overflow-hidden relative group">
              <div className="relative z-10 max-w-[60%]">
                 <h3 className="text-xl font-bold mb-1">مساعد ذكي 24/7</h3>
                 <p className="text-gray-400 dark:text-gray-600 text-sm">إجابات فورية على استفساراتك الأكاديمية.</p>
              </div>
              <div className="w-16 h-16 bg-white/10 dark:bg-black/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                 <Bot size={32} />
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-full blur-[50px] opacity-30"></div>
           </div>

           {/* Card 3: WhatsApp */}
           <div className="col-span-1 row-span-1 rounded-[2.5rem] bg-green-50 dark:bg-green-500/5 border border-green-100 dark:border-green-500/10 p-6 flex flex-col justify-center items-center text-center group">
              <div className="w-12 h-12 bg-green-500 text-white rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-green-500/30 group-hover:rotate-12 transition-transform">
                 <MessageCircle size={24} />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">متابعة واتساب</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">تواصل مباشر مع المشرفين</p>
           </div>

            {/* Card 4: Examples */}
           <div className="col-span-1 row-span-1 rounded-[2.5rem] bg-violet-50 dark:bg-violet-500/5 border border-violet-100 dark:border-violet-500/10 p-6 flex flex-col justify-center items-center text-center group">
               <div className="w-12 h-12 bg-violet-500 text-white rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-violet-500/30 group-hover:-rotate-12 transition-transform">
                 <Zap size={24} />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">أمثلة تطبيقية</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">تمارين تحاكي الاختبارات</p>
           </div>

           {/* Card 5: Organization */}
           <div className="col-span-1 md:col-span-2 lg:col-span-4 row-span-1 rounded-[2.5rem] bg-gray-50 dark:bg-dark-900 border border-gray-100 dark:border-white/5 p-8 flex items-center gap-8 overflow-hidden group">
              <div className="hidden md:flex shrink-0 w-20 h-20 bg-secondary-100 dark:bg-secondary-500/10 text-secondary-600 dark:text-secondary-400 rounded-2xl items-center justify-center">
                 <Layout size={40} />
              </div>
              <div>
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">محتوى أكاديمي منظم</h3>
                 <p className="text-gray-500 dark:text-gray-400 text-sm">
                   المحتوى مقسم بشكل ذكي ليسهل عليك المتابعة والمراجعة، مع إمكانية الوصول السريع لأي جزئية تحتاجها.
                 </p>
              </div>
              <div className="mr-auto">
                 <div className="w-10 h-10 rounded-full border border-gray-300 dark:border-white/20 flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                    <ArrowRight size={18} />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </section>
  );

  const HomeCategories = () => (
    <section className="py-24 bg-gray-50 dark:bg-dark-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">تصفح مواد تخصصك</h2>
          <p className="text-gray-500 dark:text-gray-400">انطلق في مسارك الأكاديمي مع أفضل المواد التعليمية</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { id: Category.PREP, label: 'مواد التحضيري', icon: <Calculator size={40} />, desc: 'أسس نفسك بقوة في الرياضيات والعلوم', color: 'primary' },
            { id: Category.CS, label: 'علوم الحاسوب', icon: <Code size={40} />, desc: 'برمجة، خوارزميات، وأنظمة تشغيل', color: 'purple' },
            { id: Category.CE, label: 'هندسة كمبيوتر', icon: <Cpu size={40} />, desc: 'عمارة الحاسب، دوائر، ومنطق رقمي', color: 'secondary' }
          ].map((cat, idx) => (
             <motion.div
               key={cat.id}
               whileHover={{ y: -10, rotateX: 2, rotateY: 2 }}
               onClick={() => handleCategorySelect(cat.id)}
               className="group cursor-pointer relative h-[400px] rounded-[2.5rem] overflow-hidden bg-white dark:bg-dark-900 border border-gray-100 dark:border-white/5 p-8 flex flex-col justify-between shadow-xl shadow-gray-200/40 dark:shadow-none"
             >
                {/* Background Gradient */}
                <div className={`absolute top-0 right-0 w-3/4 h-3/4 bg-${cat.color}-500/10 rounded-bl-full blur-3xl -z-10 transition-transform group-hover:scale-150 duration-700`}></div>
                
                <div className={`w-20 h-20 rounded-2xl bg-${cat.color}-50 dark:bg-${cat.color}-500/10 text-${cat.color}-600 dark:text-${cat.color}-400 flex items-center justify-center mb-6 transition-all group-hover:scale-110 shadow-sm`}>
                   {cat.icon}
                </div>

                <div>
                   <h3 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white leading-tight">{cat.label}</h3>
                   <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-light">{cat.desc}</p>
                </div>

                <div className="flex justify-end mt-4">
                   <div className={`w-12 h-12 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 group-hover:bg-${cat.color}-600 group-hover:text-white group-hover:border-transparent transition-all`}>
                      <ChevronLeft size={24} />
                   </div>
                </div>
             </motion.div>
          ))}
        </div>
      </div>
    </section>
  );

  const CatalogView = () => (
    <div className="pt-40 pb-20 min-h-screen bg-gray-50 dark:bg-dark-950">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-8 justify-between items-start mb-12">
            <div>
               <button 
                onClick={() => setView('HOME')}
                className="flex items-center text-sm font-bold text-gray-500 hover:text-primary-600 mb-6 transition-colors"
               >
                 <ArrowRight size={16} className="ml-2" />
                 العودة للرئيسية
               </button>
               <h2 className="text-5xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">المواد التعليمية</h2>
               <p className="text-gray-500 dark:text-gray-400">اختر من بين {filteredCourses.length} مادة متاحة</p>
            </div>

            <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
               <div className="relative group min-w-[320px]">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                  <input 
                    type="text" 
                    placeholder="ابحث عن مادة، كود، أو موضوع..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white dark:bg-dark-900 border border-transparent dark:border-white/10 shadow-sm rounded-2xl py-4 pr-12 pl-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all placeholder:text-gray-400"
                  />
               </div>
               <div className="relative w-full sm:w-auto">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full appearance-none bg-white dark:bg-dark-900 border border-transparent dark:border-white/10 shadow-sm rounded-2xl py-4 px-6 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-primary-500/20 focus:outline-none cursor-pointer h-full"
                  >
                    <option value="DEFAULT">الأكثر طلباً</option>
                    <option value="PRICE_ASC">السعر: الأقل للأعلى</option>
                    <option value="PRICE_DESC">السعر: الأعلى للأقل</option>
                  </select>
                  <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
               </div>
            </div>
        </div>

        {/* Categories Tab */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-10 pb-2">
            <button
              onClick={() => handleCategorySelect('ALL')}
              className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${selectedCategory === 'ALL' ? 'bg-gray-900 dark:bg-white text-white dark:text-black border-transparent' : 'bg-white dark:bg-dark-900 text-gray-500 border-gray-200 dark:border-white/10 hover:border-gray-300'}`}
            >
              جميع المواد
            </button>
            {Object.values(Category).map(cat => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${selectedCategory === cat ? 'bg-gray-900 dark:bg-white text-white dark:text-black border-transparent' : 'bg-white dark:bg-dark-900 text-gray-500 border-gray-200 dark:border-white/10 hover:border-gray-300'}`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
        </div>

        {/* Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredCourses.map((course, idx) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                index={idx}
                onClick={() => handleCourseClick(course)} 
              />
            ))}
          </div>
        ) : (
           <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 text-gray-400">
                <Search size={48} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">لا توجد نتائج مطابقة</h3>
              <p className="text-gray-500 dark:text-gray-400">جرب البحث بكلمات مختلفة أو تغيير التصنيف</p>
           </div>
        )}
      </div>
    </div>
  );

  const CourseDetailsView = () => {
    if (!selectedCourse) return null;

    return (
      <div className="pt-32 pb-20 min-h-screen bg-white dark:bg-dark-950">
        {/* Header Background */}
        <div className="fixed top-0 left-0 w-full h-[50vh] bg-gray-50 dark:bg-dark-900 -z-10"></div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-8 text-sm font-medium text-gray-500">
             <button onClick={() => setView('CATALOG')} className="hover:text-primary-600 transition-colors">المواد</button>
             <ChevronLeft size={14} />
             <span className="text-gray-900 dark:text-white">{selectedCourse.title}</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-10">
              <div>
                <div className="flex flex-wrap gap-3 mb-6">
                   <span className="px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 text-sm font-bold">
                    {CATEGORY_LABELS[selectedCourse.category]}
                  </span>
                  {selectedCourse.tags.map(tag => (
                    <span key={tag} className="px-4 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 text-sm border border-gray-200 dark:border-white/5">#{tag}</span>
                  ))}
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">{selectedCourse.title}</h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-light">
                    {selectedCourse.description}
                </p>
              </div>

              {/* Video Player Area */}
              <div className="aspect-video bg-black rounded-[2rem] overflow-hidden relative shadow-2xl group ring-1 ring-white/10">
                {selectedCourse.videoUrl ? (
                  <iframe 
                    src={selectedCourse.videoUrl} 
                    title={selectedCourse.title}
                    className="w-full h-full"
                    allow="autoplay; fullscreen" 
                    allowFullScreen
                  ></iframe>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                    {/* Abstract Pattern Placeholder for Video */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-xl group-hover:scale-110 transition-transform cursor-pointer">
                          <Play size={40} className="text-white ml-2 fill-white" />
                       </div>
                    </div>
                     <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
                       <span className="text-white text-sm font-medium">مقدمة المادة</span>
                    </div>
                  </>
                )}
              </div>

              {/* Features */}
              <div className="grid sm:grid-cols-2 gap-6">
                  {selectedCourse.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                       <div className="mt-1 w-6 h-6 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                          <CheckCircle size={14} />
                       </div>
                       <span className="text-gray-800 dark:text-gray-200 font-medium">{feat}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Sidebar CTA */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 bg-white dark:bg-dark-900 rounded-[2.5rem] p-8 border border-gray-200 dark:border-white/10 shadow-2xl shadow-gray-200/50 dark:shadow-none">
                 <div className="flex items-center justify-between mb-8">
                    <span className="text-gray-500 text-sm font-medium">السعر الكامل</span>
                    <div className="px-3 py-1 bg-secondary-50 dark:bg-secondary-500/20 text-secondary-500 text-xs font-bold rounded-full">خصم لفترة محدودة</div>
                 </div>
                 
                 <div className="flex items-end gap-2 mb-8">
                    <span className="text-5xl font-black text-gray-900 dark:text-white">{selectedCourse.price}</span>
                    <span className="text-xl font-bold text-gray-500 mb-2">ريال</span>
                 </div>

                 <button 
                  onClick={() => setShowRegistration(true)}
                  className="w-full py-5 bg-gray-900 dark:bg-white text-white dark:text-black font-bold text-lg rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-3 mb-4"
                 >
                   <span>سجل الآن</span>
                   <ArrowRight size={20} />
                 </button>

                 <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                       <Layout size={18} />
                       <span>وصول كامل للمحتوى</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                       <Bot size={18} />
                       <span>دعم ذكي غير محدود</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                       <Star size={18} />
                       <span>شهادة إتمام</span>
                    </div>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''} bg-gray-50 dark:bg-dark-950 transition-colors duration-500 font-sans selection:bg-primary-500 selection:text-white`}>
      <NotificationBar />
      <Navbar 
        darkMode={theme === 'dark'} 
        toggleTheme={toggleTheme} 
        goHome={() => setView('HOME')}
        goToCatalog={() => {
            setSelectedCategory('ALL');
            setView('CATALOG');
        }}
        goToAITutor={() => setView('AI_TUTOR')}
      />

      <main>
        <AnimatePresence mode='wait'>
          {view === 'HOME' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <HeroSection />
              <AboutSection />
              <HomeCategories />
            </motion.div>
          )}
          
          {view === 'CATALOG' && (
            <motion.div key="catalog" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CatalogView />
            </motion.div>
          )}

          {view === 'DETAILS' && (
            <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CourseDetailsView />
            </motion.div>
          )}

          {view === 'AI_TUTOR' && (
             <motion.div key="aitutor" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
               <AITutorPage 
                 messages={chatMessages} 
                 setMessages={setChatMessages} 
                 selectedCourse={selectedCourse}
                 onBack={() => setView('HOME')} 
               />
             </motion.div>
          )}
        </AnimatePresence>
      </main>

      {view !== 'AI_TUTOR' && <Footer />}
      
      {/* Hide floating assistant widget when on full tutor page to avoid duplication */}
      {view !== 'AI_TUTOR' && <AIAssistant />}

      {showRegistration && selectedCourse && (
        <RegistrationModal 
          course={selectedCourse} 
          onClose={() => setShowRegistration(false)} 
        />
      )}
    </div>
  );
}

export default App;
