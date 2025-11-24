import React, { useState, useMemo } from 'react';
import { Course } from '../types';
import { X, Send, User, FileText, AtSign, Plus, Trash2, Check, CreditCard, PieChart, Search, Sparkles, Tag, AlertCircle } from 'lucide-react';
import { WHATSAPP_NUMBER, COURSES } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  course: Course;
  onClose: () => void;
}

type PaymentMethod = 'ONE' | 'TWO';

export const RegistrationModal: React.FC<Props> = ({ course: initialCourse, onClose }) => {
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([initialCourse]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('ONE');
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percent: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);

  // Pledge State
  const [isPledgeAccepted, setIsPledgeAccepted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    telegram: '',
    notes: ''
  });

  // Calculate Subtotal (Sum of all course prices)
  const subtotal = useMemo(() => {
    return selectedCourses.reduce((sum, c) => sum + c.price, 0);
  }, [selectedCourses]);

  // Calculate Discount Amount
  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    return subtotal * (appliedCoupon.percent / 100);
  }, [subtotal, appliedCoupon]);

  // Calculate Final Total
  const finalTotal = useMemo(() => {
    return subtotal - discountAmount;
  }, [subtotal, discountAmount]);

  // Calculate Installment Amount (if applicable)
  const installmentAmount = useMemo(() => {
    return paymentMethod === 'TWO' ? finalTotal / 2 : finalTotal;
  }, [finalTotal, paymentMethod]);

  const toggleCourse = (c: Course) => {
    if (selectedCourses.find(sc => sc.id === c.id)) {
      setSelectedCourses(prev => prev.filter(sc => sc.id !== c.id));
    } else {
      setSelectedCourses(prev => [...prev, c]);
    }
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    setIsCheckingCoupon(true);
    setCouponError('');

    // Mock API for coupon validation
    setTimeout(() => {
      const code = couponCode.toUpperCase();
      if (code === 'AZMI20') {
        setAppliedCoupon({ code: 'AZMI20', percent: 20 });
        setCouponError('');
      } else if (code === 'STUDENT') {
         setAppliedCoupon({ code: 'STUDENT', percent: 10 });
         setCouponError('');
      } else {
        setAppliedCoupon(null);
        setCouponError('الكود غير صحيح أو منتهي الصلاحية');
      }
      setIsCheckingCoupon(false);
    }, 800);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const filteredAllCourses = useMemo(() => {
    return COURSES.filter(c => 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPledgeAccepted || selectedCourses.length === 0) return;

    // Build the course list string for WhatsApp
    const coursesList = selectedCourses.map(c => `   └ 📚 ${c.title} (${c.price} SR)`).join('\n');

    const paymentDetails = paymentMethod === 'ONE' 
      ? `دفعة واحدة (كامل المبلغ)` 
      : `دفعتين (قسطين متساويين)`;

    const couponText = appliedCoupon 
      ? `✅ تم تطبيق كوبون خصم: ${appliedCoupon.code} (-${appliedCoupon.percent}%)`
      : `لا يوجد كوبون`;

    const financialBreakdown = `
💰 *التفاصيل المالية:*
   ▪️ المجموع الفرعي: ${subtotal} SR
   ▪️ الخصم: ${discountAmount.toFixed(2)} SR
   ▪️ الإجمالي النهائي: ${finalTotal.toFixed(2)} SR
   ━━━━━━━━━━━━━━━━
   💳 *طريقة الدفع:* ${paymentDetails}
   ${paymentMethod === 'TWO' ? `💵 *قيمة الدفعة الأولى:* ${installmentAmount.toFixed(2)} SR` : ''}
    `;

    const text = `*طلب تسجيل جديد - معهد عزمي للتعليم* 🚀
━━━━━━━━━━━━━━━━
👤 *بيانات الطالب:*
▪️ الاسم: ${formData.name}
▪️ تليجرام: ${formData.telegram}
▪️ ملاحظات: ${formData.notes || 'لا يوجد'}

📦 *المواد المختارة:*
${coursesList}

${couponText}
${financialBreakdown}
━━━━━━━━━━━━━━━━
📜 *تعهد الطالب:*
"أتعهد أنا الطالب بالالتزام الكامل بدفع الرسوم المستحقة خلال الترم الدراسي وفق طريقة الدفع المختارة، وأُقر بتحملي المسؤولية الكاملة في حال التأخير أو عدم السداد."
✅ *تمت الموافقة على التعهد*

يرجى تأكيد الطلب وتزويدي ببيانات الحساب البنكي.`;
    
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-dark-900 w-full max-w-2xl max-h-[90vh] rounded-[2rem] shadow-2xl border border-gray-200 dark:border-white/10 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 pb-4 flex justify-between items-center shrink-0 border-b border-gray-100 dark:border-white/5">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles size={20} className="text-primary-500" />
              إتمام التسجيل
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">خطوة واحدة تفصلك عن النجاح</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors text-gray-500">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          <form id="reg-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. Student Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">البيانات الشخصية</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 mr-1">الاسم الكامل</label>
                  <div className="relative group">
                    <User className="absolute right-4 top-3.5 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-dark-800 border-none rounded-2xl py-3.5 pr-12 pl-4 focus:ring-2 focus:ring-primary-500/20 transition-all dark:text-white placeholder:text-gray-400"
                      placeholder="الاسم الثلاثي"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 mr-1">تليجرام</label>
                  <div className="relative group">
                    <AtSign className="absolute right-4 top-3.5 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                    <input
                      required
                      type="text"
                      value={formData.telegram}
                      onChange={e => setFormData({...formData, telegram: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-dark-800 border-none rounded-2xl py-3.5 pr-12 pl-4 focus:ring-2 focus:ring-primary-500/20 transition-all dark:text-white placeholder:text-gray-400"
                      placeholder="@username"
                    />
                  </div>
                </div>
              </div>
              <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 mr-1">ملاحظات (اختياري)</label>
                  <div className="relative group">
                    <FileText className="absolute right-4 top-3.5 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                    <textarea
                      value={formData.notes}
                      onChange={e => setFormData({...formData, notes: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-dark-800 border-none rounded-2xl py-3.5 pr-12 pl-4 focus:ring-2 focus:ring-primary-500/20 transition-all dark:text-white min-h-[80px] placeholder:text-gray-400 resize-none"
                      placeholder="أي استفسار إضافي..."
                    />
                  </div>
                </div>
            </div>

            {/* 2. Selected Courses */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">المواد المختارة ({selectedCourses.length})</h3>
                <button 
                  type="button"
                  onClick={() => setIsAdding(!isAdding)}
                  className="text-xs text-primary-600 dark:text-primary-400 font-bold hover:underline flex items-center gap-1 bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-full"
                >
                  <Plus size={14} />
                  إضافة مادة
                </button>
              </div>

              {/* Add Course UI */}
              <AnimatePresence>
                {isAdding && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mb-4"
                  >
                    <div className="bg-white dark:bg-dark-800 p-2 rounded-2xl border border-gray-200 dark:border-white/10 shadow-lg">
                      <div className="relative mb-2">
                        <Search className="absolute right-3 top-2.5 text-gray-400" size={16} />
                        <input 
                          type="text"
                          placeholder="ابحث عن مادة..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-dark-900 rounded-xl py-2 pr-9 pl-4 text-sm focus:outline-none"
                        />
                      </div>
                      <div className="max-h-40 overflow-y-auto space-y-1 custom-scrollbar">
                        {filteredAllCourses.map(c => {
                          const isSelected = selectedCourses.some(sc => sc.id === c.id);
                          return (
                            <div 
                              key={c.id} 
                              onClick={() => toggleCourse(c)}
                              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer text-sm transition-colors ${isSelected ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300'}`}
                            >
                              <span>{c.title}</span>
                              {isSelected ? <Check size={16} /> : <Plus size={16} className="text-gray-400" />}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* List */}
              <div className="space-y-3">
                {selectedCourses.length > 0 ? (
                  selectedCourses.map((c) => (
                    <div key={c.id} className="flex items-center justify-between bg-white dark:bg-dark-800 p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm group hover:border-primary-200 transition-colors">
                      <span className="font-bold text-gray-900 dark:text-white text-sm">{c.title}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-md">{c.price} SR</span>
                        <button 
                            type="button"
                            onClick={() => toggleCourse(c)}
                            className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                          >
                            <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl text-gray-400 text-sm">
                    لم يتم اختيار أي مادة
                  </div>
                )}
              </div>
            </div>

            {/* 3. Coupon Code */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">كوبون الخصم</h3>
              
              {!appliedCoupon ? (
                <div className="flex gap-2">
                   <div className="relative flex-1 group">
                      <Tag className="absolute right-4 top-3.5 text-gray-400 group-focus-within:text-secondary-500 transition-colors" size={18} />
                      <input 
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="أدخل كود الخصم (مثل AZMI20)"
                        className="w-full bg-gray-50 dark:bg-dark-800 border-none rounded-2xl py-3.5 pr-12 pl-4 focus:ring-2 focus:ring-secondary-500/20 transition-all dark:text-white uppercase placeholder:text-gray-400"
                      />
                   </div>
                   <button 
                     type="button"
                     onClick={handleApplyCoupon}
                     disabled={isCheckingCoupon || !couponCode}
                     className="bg-gray-900 dark:bg-white text-white dark:text-black px-6 rounded-2xl font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                   >
                     {isCheckingCoupon ? <span className="animate-spin">⌛</span> : 'تطبيق'}
                   </button>
                </div>
              ) : (
                <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-500/20 p-4 rounded-2xl flex justify-between items-center">
                   <div className="flex items-center gap-3">
                     <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-green-600 dark:text-green-400">
                       <Check size={16} />
                     </div>
                     <div>
                       <span className="block text-sm font-bold text-green-800 dark:text-green-300">الكود {appliedCoupon.code} فعال</span>
                       <span className="text-xs text-green-600 dark:text-green-400">تم خصم {appliedCoupon.percent}% من القيمة</span>
                     </div>
                   </div>
                   <button type="button" onClick={removeCoupon} className="text-red-400 hover:text-red-600 p-2">
                     <X size={18} />
                   </button>
                </div>
              )}
              {couponError && (
                 <p className="text-red-500 text-xs flex items-center gap-1 mr-2">
                   <AlertCircle size={12} /> {couponError}
                 </p>
              )}
            </div>

            {/* 4. Payment Method */}
            <div className="space-y-4">
               <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">طريقة السداد</h3>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  onClick={() => setPaymentMethod('ONE')}
                  className={`cursor-pointer rounded-2xl p-4 border transition-all relative overflow-hidden ${paymentMethod === 'ONE' 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' 
                    : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'}`}
                >
                  <div className="flex flex-col items-center text-center gap-3 relative z-10">
                    <CreditCard size={24} className={paymentMethod === 'ONE' ? 'text-primary-600' : 'text-gray-400'} />
                    <div>
                        <span className={`block font-bold text-sm ${paymentMethod === 'ONE' ? 'text-primary-900 dark:text-white' : 'text-gray-500'}`}>دفعة واحدة</span>
                        <span className="text-[10px] text-gray-400">سداد كامل المبلغ</span>
                    </div>
                  </div>
                  {paymentMethod === 'ONE' && <div className="absolute top-3 right-3 text-primary-600"><Check size={14} /></div>}
                </div>

                <div 
                  onClick={() => setPaymentMethod('TWO')}
                  className={`cursor-pointer rounded-2xl p-4 border transition-all relative overflow-hidden ${paymentMethod === 'TWO' 
                    ? 'border-secondary-500 bg-secondary-50 dark:bg-secondary-900/10' 
                    : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'}`}
                >
                  <div className="flex flex-col items-center text-center gap-3 relative z-10">
                    <PieChart size={24} className={paymentMethod === 'TWO' ? 'text-secondary-600' : 'text-gray-400'} />
                    <div>
                        <span className={`block font-bold text-sm ${paymentMethod === 'TWO' ? 'text-secondary-900 dark:text-white' : 'text-gray-500'}`}>دفعتين</span>
                        <span className="text-[10px] text-gray-400">50% مقدم، 50% لاحقاً</span>
                    </div>
                  </div>
                   {paymentMethod === 'TWO' && <div className="absolute top-3 right-3 text-secondary-600"><Check size={14} /></div>}
                </div>
              </div>
            </div>

            {/* 5. Pledge */}
            <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
               <label className="flex items-start gap-3 cursor-pointer">
                 <div className="relative flex items-center pt-1">
                    <input 
                      type="checkbox" 
                      checked={isPledgeAccepted}
                      onChange={(e) => setIsPledgeAccepted(e.target.checked)}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-800 transition-all checked:border-primary-500 checked:bg-primary-500"
                    />
                    <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100 pt-1">
                      <Check size={14} strokeWidth={4} />
                    </div>
                 </div>
                 <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed pt-0.5">
                   أتعهد أنا الطالب بالالتزام الكامل بدفع الرسوم المستحقة خلال الترم الدراسي، وأتحمل المسؤولية في حال التأخير.
                 </p>
               </label>
            </div>

          </form>
        </div>

        {/* Footer Summary */}
        <div className="p-6 bg-gray-50 dark:bg-dark-800/50 border-t border-gray-100 dark:border-white/5 shrink-0">
          <div className="flex items-center justify-between mb-6">
             <div>
                <span className="text-xs text-gray-500 block mb-1">الإجمالي النهائي</span>
                <div className="flex items-center gap-2">
                   <span className="text-2xl font-black text-gray-900 dark:text-white">{finalTotal.toFixed(0)}</span>
                   <span className="text-sm font-bold text-gray-500">SR</span>
                   {appliedCoupon && <span className="text-sm text-gray-400 line-through decoration-red-400">{subtotal}</span>}
                </div>
             </div>
             
             {paymentMethod === 'TWO' && (
                <div className="text-left">
                   <span className="text-xs text-secondary-600 dark:text-secondary-400 font-bold block bg-secondary-50 dark:bg-secondary-900/20 px-3 py-1 rounded-full">
                     تدفع الآن {installmentAmount.toFixed(0)} SR
                   </span>
                </div>
             )}
          </div>

          <button
            type="submit"
            form="reg-form"
            disabled={!isPledgeAccepted || selectedCourses.length === 0}
            className="w-full bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-200 disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:text-gray-500 text-white dark:text-black font-bold py-4 rounded-2xl shadow-xl shadow-black/5 dark:shadow-white/5 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95 disabled:hover:scale-100 disabled:shadow-none disabled:cursor-not-allowed"
          >
            <span>إرسال الطلب عبر واتساب</span>
            <Send size={18} />
          </button>
        </div>

      </motion.div>
    </div>
  );
};