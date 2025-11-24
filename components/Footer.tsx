import React from 'react';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-dark-900 border-t border-gray-200 dark:border-white/5 pt-16 pb-8 mt-20 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500"></div>
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          
          {/* Col 1: Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/20">
                ع
              </div>
              <span className="font-heading font-bold text-2xl text-gray-900 dark:text-white">
                معهد عزمي
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
              معهد تعليمي رائد يهدف لتمكين طلاب الجامعات من خلال شروحات ذكية ومتابعة مستمرة، لنصنع معاً مستقبلكم الأكاديمي.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-6 text-lg">روابط سريعة</h3>
            <ul className="space-y-4">
               {['الرئيسية', 'المواد التعليمية', 'من نحن', 'تواصل معنا', 'سياسة الخصوصية'].map((item) => (
                 <li key={item}>
                    <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm flex items-center gap-2 group">
                       <span className="w-1.5 h-1.5 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                       {item}
                    </a>
                 </li>
               ))}
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-6 text-lg">تواصل معنا</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-500 dark:text-gray-400 text-sm">
                 <Phone size={18} className="text-primary-500 mt-0.5" />
                 <span dir="ltr">+966 55 640 9492</span>
              </li>
              <li className="flex items-start gap-3 text-gray-500 dark:text-gray-400 text-sm">
                 <Mail size={18} className="text-primary-500 mt-0.5" />
                 <span>azmisalim222@gmail.com</span>
              </li>
              <li className="flex items-start gap-3 text-gray-500 dark:text-gray-400 text-sm">
                 <MapPin size={18} className="text-primary-500 mt-0.5" />
                 <span>المملكة العربية السعودية</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
           <p className="text-gray-500 dark:text-gray-400 text-sm">
             جميع الحقوق محفوظة © {new Date().getFullYear()} معهد عزمي للتعليم.
           </p>
           <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-50 dark:bg-white/5 px-4 py-2 rounded-full">
              <span>صنع بـ</span>
              <Heart size={12} className="text-red-500 fill-red-500 animate-pulse" />
              <span>من أجل طلابنا المبدعين</span>
           </div>
        </div>
      </div>
    </footer>
  );
};