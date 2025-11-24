import { Category, Course } from './types';

export const WHATSAPP_NUMBER = "966556409492";

export const CATEGORY_LABELS: Record<Category, string> = {
  [Category.PREP]: "مواد التحضيري",
  [Category.CS]: "علوم الحاسوب",
  [Category.CE]: "هندسة كمبيوتر",
};

export const COURSES: Course[] = [
  // ============================
  // 1️⃣ مواد التحضيري
  // ============================
  {
    id: 'math-101-111',
    title: 'كالكولس تفاضل وتكامل 111 - 101',
    category: Category.PREP,
    description: 'شرح شامل لأساسيات التفاضل والتكامل، النهايات، والاتصال.',
    tags: ['رياضيات', 'تفاضل'],
    price: 299,
    videoUrl: 'https://drive.google.com/file/d/1_C0_BGOa1XJH535oNMzcU2PLKi_qKUF7/preview',
    features: ['شرح القواعد الأساسية', 'حلول اختبارات سابقة', 'بنك أسئلة شامل']
  },
  {
    id: 'math-102-212',
    title: 'كالكولس تفاضل وتكامل 212 - 102',
    category: Category.PREP,
    description: 'التكامل المتقدم، المتسلسلات اللانهائية، وتطبيقات التكامل.',
    tags: ['رياضيات', 'تكامل'],
    price: 399,
    videoUrl: 'https://drive.google.com/file/d/1bg8HBFVLyjDeRnwE1FbUnFbt2Nr4H3T2/preview',
    features: ['تطبيقات التكامل', 'المتسلسلات', 'الإحداثيات القطبية']
  },
  {
    id: 'math-201',
    title: 'كالكولس 201',
    category: Category.PREP,
    description: 'تفاضل وتكامل الدوال في عدة متغيرات.',
    tags: ['رياضيات', 'متقدم'],
    price: 399,
    videoUrl: 'https://drive.google.com/file/d/1lQI6yZ4sm2uhZOtCIFNQgpEXZHR4reLA/preview',
    features: ['المتجهات', 'الاشتقاق الجزئي', 'التكامل المتعدد']
  },
  {
    id: 'math-260',
    title: 'كالكولس 260',
    category: Category.PREP,
    description: 'المعادلات التفاضلية وتطبيقاتها.',
    tags: ['رياضيات', 'معادلات'],
    price: 399,
    videoUrl: 'https://drive.google.com/file/d/1TVIKeiBSQ2LP13a9SRxZaqQ_4NtjNC2E/preview',
    features: ['معادلات الرتبة الأولى', 'تحويلات لابلاس', 'المتسلسلات']
  },
  {
    id: 'math-110',
    title: 'ماث 110',
    category: Category.PREP,
    description: 'مبادئ الرياضيات الجامعية الأساسية.',
    tags: ['رياضيات', 'تأسيس'],
    price: 250,
    videoUrl: 'https://drive.google.com/file/d/1FPyLI6Zm_d_O4gZj3PhE3gXqP8kL93lj/preview',
    features: ['الجبر', 'الدوال المثلثية', 'الهندسة التحليلية']
  },
  {
    id: 'math-127',
    title: 'ماث 127',
    category: Category.PREP,
    description: 'رياضيات للتخصصات الإدارية والإنسانية.',
    tags: ['رياضيات', 'إدارة'],
    price: 250,
    videoUrl: 'https://drive.google.com/file/d/16jlhjOgSQj3Av7GkEVHJce8YzYAO1NlN/preview',
    features: ['المصفوفات', 'البرمجة الخطية', 'الاحتمالات']
  },
  {
    id: 'math-128',
    title: 'ماث 128',
    category: Category.PREP,
    description: 'تكملة لمواضيع الرياضيات الإدارية.',
    tags: ['رياضيات', 'إدارة'],
    price: 250,
    videoUrl: 'https://drive.google.com/file/d/1-4zbqBNrHUDjIbBiFinILlsa3yoOozkP/preview',
    features: ['التكامل وتطبيقاته', 'الدوال الأسية واللوغاريتمية']
  },
  {
    id: 'math-129-134',
    title: 'ماث 129 - 134',
    category: Category.PREP,
    description: 'مواضيع مختارة في الرياضيات العامة.',
    tags: ['رياضيات', 'عام'],
    price: 250,
    videoUrl: 'https://drive.google.com/file/d/1k3ntJHtQm_M3YBwJby3qoTFqbhBp9_j3/preview',
    features: ['مراجعات شاملة', 'أمثلة تطبيقية']
  },
  {
    id: 'math-200',
    title: 'ماث 200',
    category: Category.PREP,
    description: 'أساسيات التحليل الرياضي.',
    tags: ['رياضيات', 'تحليل'],
    price: 250,
    videoUrl: 'https://drive.google.com/file/d/1zEUxGrOZtx_00D7Bp3vSSTdRllX8A5Lz/preview',
    features: ['البراهين الرياضية', 'المجموعات']
  },
  {
    id: 'phys',
    title: 'فيزياء',
    category: Category.PREP,
    description: 'الميكانيكا، الحركة، القوى، والطاقة.',
    tags: ['علوم', 'فيزياء'],
    price: 350,
    videoUrl: 'https://drive.google.com/file/d/1VvdKJlKUK6T2Vf2VTDMqAVsT4TNe7bhV/preview',
    features: ['قوانين نيوتن', 'الشغل والطاقة', 'الديناميكا الحرارية']
  },
  {
    id: 'chem',
    title: 'كيمياء',
    category: Category.PREP,
    description: 'مبادئ الكيمياء العامة والذرية.',
    tags: ['علوم', 'كيمياء'],
    price: 299,
    videoUrl: 'https://drive.google.com/file/d/1ssaKR5_4wJC8BYYCQqDUtIDTlfCjnW3G/preview',
    features: ['الروابط الكيميائية', 'التفاعلات', 'الجدول الدوري']
  },
  {
    id: 'prob-stat',
    title: 'Probability and Statistics',
    category: Category.PREP,
    description: 'الاحتمالات والإحصاء للمهندسين والعلماء.',
    tags: ['إحصاء', 'رياضيات'],
    price: 399,
    videoUrl: 'https://drive.google.com/file/d/1DE2yvHckHCkurqtzwi1xOxVuh58kGDJL/preview',
    features: ['التوزيعات الاحتمالية', 'الاستدلال الإحصائي', 'اختبار الفرضيات']
  },
  {
    id: 'discrete',
    title: 'Discrete Structures',
    category: Category.PREP,
    description: 'الهياكل المتقطعة ونظرية المجموعات والمنطق.',
    tags: ['رياضيات', 'حاسب'],
    price: 399,
    videoUrl: 'https://drive.google.com/file/d/1Yutajm6A2e58sGDEilG5eq39cuJQnbVf/preview',
    features: ['المنطق الرياضي', 'نظرية البيان', 'العد والتركيبات']
  },

  // ============================
  // 2️⃣ علوم الحاسوب
  // ============================
  {
    id: 'prog',
    title: 'Programming (برمجة)',
    category: Category.CS,
    description: 'أساسيات البرمجة وحل المشكلات (Python/Java).',
    tags: ['برمجة', 'كود'],
    price: 399, 
    features: ['الخوارزميات', 'هياكل البيانات البسيطة', 'البرمجة الشيئية']
  },
  {
    id: 'soft-eng',
    title: 'Software Engineering',
    category: Category.CS,
    description: 'هندسة البرمجيات CSCE 232.',
    tags: ['هندسة', 'برمجيات'],
    price: 399,
    videoUrl: 'https://drive.google.com/file/d/1aCZw3N4MjATun1ehlo__VT8YGk5fLpKD/preview',
    features: ['دورة حياة النظام', 'Agile & Scrum', 'UML']
  },
  {
    id: 'os',
    title: 'Operating System',
    category: Category.CS,
    description: 'مفاهيم أنظمة التشغيل وإدارة الموارد.',
    tags: ['أنظمة', 'Linux'],
    price: 399,
    videoUrl: 'https://drive.google.com/file/d/18-I09-0qZHFY_iVyG7ceSOINEUBsbEZ8/preview',
    features: ['إدارة العمليات', 'الذاكرة الافتراضية', 'التزامن']
  },
  {
    id: 'data-comm',
    title: 'Data and Computer Communication',
    category: Category.CS,
    description: 'نقل البيانات وبروتوكولات الاتصال.',
    tags: ['اتصالات', 'بيانات'],
    price: 399,
    videoUrl: 'https://drive.google.com/file/d/1wIw7gh9Delb--24iyvCVAgnhWDrACxUs/preview',
    features: ['طبقات الشبكة', 'الإشارات', 'الوسائط']
  },
  {
    id: 'networks',
    title: 'Networks (شبكات الحاسوب)',
    category: Category.CS,
    description: 'شبكات الحاسوب CSCE 353.',
    tags: ['شبكات', 'إنترنت'],
    price: 399,
    videoUrl: 'https://drive.google.com/file/d/1kl00qUGJU2uP9ZvjX_EemJBocccEuAn4/preview',
    features: ['TCP/IP', 'Routing', 'Switching']
  },
  {
    id: 'hci',
    title: 'Human Computer Interaction',
    category: Category.CS,
    description: 'تفاعل الإنسان مع الكمبيوتر وتصميم الواجهات.',
    tags: ['UI/UX', 'تصميم'],
    price: 299,
    videoUrl: 'https://drive.google.com/file/d/1jlNz1Ekd-VS31HpVz15CVrgb0X8gKIml/preview',
    features: ['تجربة المستخدم', 'النماذج الأولية', 'قابلية الاستخدام']
  },
  {
    id: 'sec',
    title: 'Fundamental of Security',
    category: Category.CS,
    description: 'أساسيات أمن المعلومات والسيبراني.',
    tags: ['أمن', 'حماية'],
    price: 250,
    videoUrl: 'https://drive.google.com/file/d/1pC-JNp_mQXiTDkWN3NrgSG52CNjP1J5N/preview',
    features: ['التشفير', 'أمن الشبكات', 'التهديدات والمخاطر']
  },
  {
    id: 'sys-sig',
    title: 'System and Signal',
    category: Category.CS,
    description: 'تحليل الإشارات والأنظمة.',
    tags: ['إشارات', 'هندسة'],
    price: 399,
    videoUrl: 'https://drive.google.com/file/d/1wwcHLLUP1A7YgpywiPCsuWWrlAhucrRE/preview',
    features: ['تحويل فورييه', 'الأنظمة الخطية', 'معالجة الإشارة']
  },

  // ============================
  // 3️⃣ هندسة كمبيوتر
  // ============================
  {
    id: 'dig-logic',
    title: 'Digital Logic (المنطق الرقمي)',
    category: Category.CE,
    description: 'التصميم المنطقي والدوائر الرقمية.',
    tags: ['دوائر', 'منطق'],
    price: 399,
    videoUrl: 'https://drive.google.com/file/d/1sHApkvQHa1eyjEIUldbqgW-or2deZWhh/preview',
    features: ['البوابات المنطقية', 'الجبر البولياني', 'الدوائر التتابعية']
  },
  {
    id: 'comp-arch',
    title: 'Computer Architecture',
    category: Category.CE,
    description: 'عمارة الحاسب وتنظيم المعالج.',
    tags: ['هاردوير', 'معالج'],
    price: 399,
    videoUrl: 'https://drive.google.com/file/d/1pxcJsS3KZoJ52hUXic9EegWDzWmq2u86/preview',
    features: ['MIPS/RISC-V', 'Pipeline', 'الذاكرة المخبأة']
  },
  {
    id: 'comp-org',
    title: 'Computer Organisations',
    category: Category.CE,
    description: 'تنظيم الحاسبات ولغة التجميع.',
    tags: ['هاردوير', 'Assembly'],
    price: 399,
    videoUrl: 'https://drive.google.com/file/d/1K8MVytvKYRgDMn_CzJrO_HtFB7HTt7Bb/preview',
    features: ['لغة الآلة', 'وحدات الإدخال والإخراج', 'الأداء']
  },
  {
    id: 'elec-circ',
    title: 'Electrical Circuits',
    category: Category.CE,
    description: 'تحليل الدوائر الكهربائية.',
    tags: ['كهرباء', 'دوائر'],
    price: 399,
    videoUrl: 'https://drive.google.com/file/d/1adgusD3n3fL_YkBkNPQPliQMzmHZM6U0/preview',
    features: ['قوانين كيرشوف', 'التيار المتردد', 'تحليل العقد']
  },
  {
    id: 'electronic-circ',
    title: 'Electronic Circuits',
    category: Category.CE,
    description: 'الدوائر الإلكترونية وأشباه الموصلات.',
    tags: ['إلكترونيات', 'مكونات'],
    price: 399,
    videoUrl: 'https://drive.google.com/file/d/1DgrHYmUPe2q6l2Dvq87ElCpmXiEqCdQo/preview',
    features: ['الدايود', 'الترانزستور', 'المكبرات']
  },
  {
    id: 'micro',
    title: 'Microprocessor',
    category: Category.CE,
    description: 'المعالجات الدقيقة وتطبيقاتها.',
    tags: ['معالج', 'متحكمات'],
    price: 399,
    videoUrl: 'https://drive.google.com/file/d/17Ik2ECVTUxPcwm348K_kNZ7KGUr97LRX/preview',
    features: ['برمجة المتحكمات', 'المقاطعات', 'الأنظمة المدمجة']
  }
];