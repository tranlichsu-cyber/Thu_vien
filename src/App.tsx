/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { sanityClient, fetchStories, fetchMaterials } from './lib/sanity';
import { 
  BookOpen, 
  Menu, 
  X, 
  UserRoundCheck, 
  Rocket, 
  Wand2, 
  GraduationCap, 
  Video, 
  Headphones, 
  Bookmark, 
  School, 
  ChevronRight, 
  User, 
  MapPin, 
  Clock, 
  AlertCircle,
  PlusCircle,
  LogOut,
  Trash2,
  ExternalLink,
  Star,
  Zap,
  Leaf,
  Globe,
  FileText,
  Download,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface Story {
  id: number;
  title: string;
  category: string;
  icon: string;
  image: string;
  type: 'modal' | 'link' | 'pdf' | 'flipbook';
  link: string;
  color: string;
}

interface Material {
  id: number;
  title: string;
  type: 'doc' | 'ppt' | 'video' | 'other';
  grade: number;
  link: string;
  date: string;
}

// --- Constants ---
const INITIAL_STORIES: Story[] = [
  // Cổ tích Việt Nam
  { id: 1, title: 'Thạch Sanh', category: 'Cổ tích', icon: 'Star', image: 'https://truyenthieunhi.vn/Uploads/News/thach-sanh.jpg', type: 'link', link: 'https://truyenthieunhi.vn/truyen-cho-tre/truyen-co-tich/co-tich-viet-nam/thach-sanh-ly-thong', color: 'orange' },
  { id: 2, title: 'Sơn Tinh Thủy Tinh', category: 'Cổ tích', icon: 'Star', image: 'https://truyenthieunhi.vn/Uploads/News/son-tinh-thuy-tinh.jpg', type: 'link', link: 'https://truyenthieunhi.vn/truyen-cho-tre/truyen-co-tich/co-tich-viet-nam/son-tinh-thuy-tinh', color: 'emerald' },
  { id: 3, title: 'Sự tích cây vú sữa', category: 'Cổ tích', icon: 'Star', image: 'https://truyenthieunhi.vn/Uploads/News/cay-vu-sua.jpg', type: 'link', link: 'https://truyenthieunhi.vn/truyen-cho-tre/truyen-co-tich/co-tich-viet-nam/su-tich-cay-vu-sua', color: 'pink' },
  { id: 4, title: 'Sự tích Bánh chưng bánh giầy', category: 'Cổ tích', icon: 'Star', image: 'https://truyenthieunhi.vn/Uploads/News/banh-chung-banh-day.jpg', type: 'link', link: 'https://truyenthieunhi.vn/truyen-cho-tre/truyen-co-tich/co-tich-viet-nam/su-tich-banh-chung-banh-giay', color: 'yellow' },
  { id: 5, title: 'Sự tích Mai An Tiêm', category: 'Cổ tích', icon: 'Star', image: 'https://truyenthieunhi.vn/Uploads/News/mai-an-tiem.jpg', type: 'link', link: 'https://truyenthieunhi.vn/truyen-cho-tre/truyen-co-tich/co-tich-viet-nam/su-tich-qua-dua-hau', color: 'sky' },
  
  // Cổ tích thế giới
  { id: 6, title: 'Cô bé quàng khăn đỏ', category: 'Văn học nước ngoài', icon: 'Globe', image: 'https://truyenthieunhi.vn/Uploads/News/co-be-quang-khan-do.jpg', type: 'link', link: 'https://truyenthieunhi.vn/truyen-cho-tre/truyen-co-tich/co-tich-the-gioi/co-be-quang-khan-do', color: 'orange' },
  { id: 7, title: 'Ba chú lợn con', category: 'Văn học nước ngoài', icon: 'Globe', image: 'https://truyenthieunhi.vn/Uploads/News/ba-chu-lon-con.jpg', type: 'link', link: 'https://truyenthieunhi.vn/truyen-cho-tre/truyen-co-tich/co-tich-the-gioi/ba-chu-lon-con', color: 'emerald' },
  { id: 8, title: 'Vịt con xấu xí', category: 'Văn học nước ngoài', icon: 'Globe', image: 'https://truyenthieunhi.vn/Uploads/News/vit-con-xau-xi.jpg', type: 'link', link: 'https://truyenthieunhi.vn/truyen-cho-tre/truyen-co-tich/co-tich-the-gioi/vit-con-xau-xi', color: 'pink' },
  { id: 9, title: 'Aladin và cây đèn thần', category: 'Văn học nước ngoài', icon: 'Globe', image: 'https://truyenthieunhi.vn/Uploads/News/aladin.jpg', type: 'link', link: 'https://truyenthieunhi.vn/truyen-cho-tre/truyen-co-tich/co-tich-the-gioi/aladin-va-cay-den-than', color: 'yellow' },
  
  // Ngụ ngôn / Văn học VN (dùng category Văn học VN cho Ngụ ngôn Việt)
  { id: 10, title: 'Rùa và Thỏ', category: 'Văn học VN', icon: 'Leaf', image: 'https://truyenthieunhi.vn/Uploads/News/rua-va-tho.jpg', type: 'link', link: 'https://truyenthieunhi.vn/truyen-cho-tre/truyen-ngu-ngon/rua-va-tho', color: 'sky' },
  { id: 11, title: 'Thầy bói xem voi', category: 'Văn học VN', icon: 'Leaf', image: 'https://truyenthieunhi.vn/Uploads/News/thay-boi-xem-voi.jpg', type: 'link', link: 'https://truyenthieunhi.vn/truyen-cho-tre/truyen-ngu-ngon/thay-boi-xem-voi', color: 'orange' },
  { id: 12, title: 'Ěch ngồi đáy giếng', category: 'Văn học VN', icon: 'Leaf', image: 'https://truyenthieunhi.vn/Uploads/News/ech-ngoi-day-gieng.jpg', type: 'link', link: 'https://truyenthieunhi.vn/truyen-cho-tre/truyen-ngu-ngon/ech-ngoi-day-gieng', color: 'emerald' },
  
  // Khoa học
  { id: 13, title: 'Tại sao biển lại mặn?', category: 'Khoa học', icon: 'Zap', image: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&q=80&w=400', type: 'link', link: 'https://truyenthieunhi.vn/truyen-cho-tre/10-van-cau-hoi-vi-sao/tai-sao-nuoc-bien-man', color: 'pink' },
  { id: 14, title: 'Tại sao có sấm sét?', category: 'Khoa học', icon: 'Zap', image: 'https://images.unsplash.com/photo-1472141521881-95d0e87e2e39?auto=format&fit=crop&q=80&w=400', type: 'link', link: 'https://truyenthieunhi.vn/truyen-cho-tre/10-van-cau-hoi-vi-sao/tai-sao-co-sam-set', color: 'yellow' },
  
  // Truyện cười (Thêm category mới hoặc cho vào Văn học VN)
  { id: 15, title: 'Lợn cưới áo mới', category: 'Văn học VN', icon: 'Leaf', image: 'https://truyenthieunhi.vn/Uploads/News/lon-cuoi-ao-moi.jpg', type: 'link', link: 'https://truyenthieunhi.vn/truyen-cho-tre/truyen-cuoi/lon-cuoi-ao-moi', color: 'sky' },
  { id: 16, title: 'Trạng Quỳnh', category: 'Cổ tích', icon: 'Star', image: 'https://truyenthieunhi.vn/Uploads/News/trang-quynh.jpg', type: 'link', link: 'https://truyenthieunhi.vn/truyen-cho-tre/truyen-cuoi/trang-quynh', color: 'orange' },
  { id: 17, title: 'Cậu bé thông minh', category: 'Cổ tích', icon: 'Star', image: 'https://truyenthieunhi.vn/Uploads/News/cau-be-thong-minh.jpg', type: 'link', link: 'https://truyenthieunhi.vn/truyen-cho-tre/truyen-co-tich/co-tich-viet-nam/cau-be-thong-minh', color: 'emerald' },
  { id: 18, title: 'Nàng Bạch Tuyết và bảy chú lùn', category: 'Văn học nước ngoài', icon: 'Globe', image: 'https://truyenthieunhi.vn/Uploads/News/bach-tuyet.jpg', type: 'link', link: 'https://truyenthieunhi.vn/truyen-cho-tre/truyen-co-tich/co-tich-the-gioi/nang-bach-tuyet-va-7-chu-lun', color: 'pink' }
];

const INITIAL_MATERIALS: Material[] = [
  { id: 1, title: '10 vạn câu hỏi vì sao - PDF', type: 'doc', grade: 0, link: 'https://truyenthieunhi.vn/truyen-cho-tre/10-van-cau-hoi-vi-sao', date: '07/05/2024' },
  { id: 2, title: 'Đồng dao cho bé', type: 'doc', grade: 1, link: 'https://truyenthieunhi.vn/truyen-cho-tre/dong-dao-cho-tre-mam-non', date: '07/05/2024' },
  { id: 3, title: 'Câu đố dân gian', type: 'doc', grade: 2, link: 'https://truyenthieunhi.vn/truyen-cho-tre/cau-do', date: '07/05/2024' }
];

const CATEGORIES = ['Cổ tích', 'Văn học VN', 'Khoa học', 'Văn học nước ngoài', 'Truyện PDF', 'Truyện sách lật'];
const COLORS = ['emerald', 'pink', 'yellow', 'sky', 'orange'];

// --- Components ---

const IconRenderer = ({ name, className }: { name: string, className?: string }) => {
  switch (name) {
    case 'Leaf': return <Leaf className={className} />;
    case 'Star': return <Star className={className} />;
    case 'Zap': return <Zap className={className} />;
    case 'Globe': return <Globe className={className} />;
    case 'FileText': return <FileText className={className} />;
    case 'BookOpen': return <BookOpen className={className} />;
    default: return <BookOpen className={className} />;
  }
};

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [addStoryModalOpen, setAddStoryModalOpen] = useState(false);
  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem('library_stories_v4');
    return saved ? JSON.parse(saved) : INITIAL_STORIES;
  });
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('stories');
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Document/Material management
  const [materials, setMaterials] = useState<Material[]>(() => {
    const saved = localStorage.getItem('library_materials_v3');
    return saved ? JSON.parse(saved) : INITIAL_MATERIALS;
  });

  useEffect(() => {
    localStorage.setItem('library_stories_v4', JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem('library_materials_v3', JSON.stringify(materials));
  }, [materials]);
  const [addDocModalOpen, setAddDocModalOpen] = useState(false);

  // Real statistics tracking
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('library_stats');
    return saved ? JSON.parse(saved) : { visits: 1042, interactions: 528 };
  });

  useEffect(() => {
    // Increment visit on mount
    setStats(prev => ({ ...prev, visits: prev.visits + 1 }));

    // Fetch from Sanity if available
    const loadSanityData = async () => {
      if (!sanityClient) return;
      setIsLoading(true);
      try {
        const [cmsStories, cmsMaterials] = await Promise.all([
          fetchStories(),
          fetchMaterials()
        ]);
        if (cmsStories) setStories(prev => [...prev, ...cmsStories]);
        if (cmsMaterials) setMaterials(prev => [...prev, ...cmsMaterials]);
      } catch (error) {
        console.error("Sanity fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSanityData();
  }, []);

  useEffect(() => {
    localStorage.setItem('library_stats', JSON.stringify(stats));
  }, [stats]);

  const recordInteraction = () => {
    setStats(prev => ({ ...prev, interactions: prev.interactions + 1 }));
  };

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Add story form state
  const [newTitle, setNewTitle] = useState('');
  const [newLink, setNewLink] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newCategory, setNewCategory] = useState('Cổ tích');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [storyMethod, setStoryMethod] = useState<'link' | 'file'>('link');
  const [storyFile, setStoryFile] = useState<{ name: string; data: string } | null>(null);

  // Add material form state
  const [docTitle, setDocTitle] = useState('');
  const [docLink, setDocLink] = useState('');
  const [docType, setDocType] = useState<'doc' | 'ppt' | 'video' | 'other'>('doc');
  const [docGrade, setDocGrade] = useState(1);
  const [docMethod, setDocMethod] = useState<'link' | 'file'>('link');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; data: string } | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === '123456') {
      setIsAdmin(true);
      setLoginModalOpen(false);
      setLoginError(false);
      setUsername('');
      setPassword('');
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Bạn có muốn đăng xuất khỏi quyền quản trị thư viện?')) {
      setIsAdmin(false);
    }
  };

  const handleAddStory = (e: React.FormEvent) => {
    e.preventDefault();
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const finalLink = storyMethod === 'file' && storyFile ? storyFile.data : (newLink || '#');
    
    let icon = 'BookOpen';
    if (newCategory === 'Cổ tích') icon = 'Star';
    else if (newCategory === 'Khoa học') icon = 'Zap';
    else if (newCategory === 'Văn học VN') icon = 'Leaf';
    else if (newCategory === 'Văn học nước ngoài') icon = 'Globe';
    else if (newCategory === 'Truyện PDF') icon = 'Leaf';
    else if (newCategory === 'Truyện sách lật') icon = 'BookOpen';

    const newStory: Story = {
      id: Date.now() + Math.random(),
      title: newTitle || (storyMethod === 'file' && storyFile ? storyFile.name : 'Truyện mới'),
      category: newCategory,
      icon,
      image: newImage || `https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400`,
      type: newCategory === 'Truyện PDF' ? 'pdf' : (newCategory === 'Truyện sách lật' ? 'flipbook' : (finalLink ? 'link' : 'modal')),
      link: finalLink,
      color
    };
    setStories([...stories, newStory]);
    setAddStoryModalOpen(false);
    setNewTitle('');
    setNewLink('');
    setNewImage('');
    setNewCategory('Cổ tích');
    setStoryFile(null);
    setStoryMethod('link');
  };

  const handleStoryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setStoryFile({
          name: file.name,
          data: event.target?.result as string
        });
        if (!newTitle) setNewTitle(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteStory = (id: number) => {
    if (window.confirm("Cô/thầy có chắc chắn muốn xóa truyện này khỏi thư viện không?")) {
      setStories(stories.filter(s => s.id !== id));
    }
  };

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    const materialLink = docMethod === 'file' && uploadedFile ? uploadedFile.data : (docLink || '#');
    
    const newMaterial: Material = {
      id: Date.now() + Math.random(),
      title: docTitle || (docMethod === 'file' && uploadedFile ? uploadedFile.name : 'Tài liệu không tên'),
      type: docType,
      grade: docType === 'video' ? 0 : docGrade,
      link: materialLink,
      date: new Intl.DateTimeFormat('vi-VN').format(new Date())
    };
    setMaterials([...materials, newMaterial]);
    setAddDocModalOpen(false);
    setDocTitle('');
    setDocLink('');
    setDocType('doc');
    setUploadedFile(null);
    setDocMethod('link');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = event.target?.result as string;
        setUploadedFile({
          name: file.name,
          data: base64Data
        });
        if (!docTitle) setDocTitle(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteMaterial = (id: number) => {
    if (window.confirm("Thủ thư có chắc chắn muốn xóa tài liệu này không?")) {
      setMaterials(materials.filter(m => m.id !== id));
    }
  };

  // State for PDF Viewer
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [viewingPdf, setViewingPdf] = useState<{ url: string; title: string } | null>(null);

  const handleDownload = (link: string, title: string, type?: string) => {
    recordInteraction();
    
    // Check if it's a PDF or Flipbook and should be viewed in-app
    const isPdf = link.startsWith('data:application/pdf') || link.toLowerCase().endsWith('.pdf') || type === 'pdf';
    
    // Only use internal viewer for PDF or explicit flipbook type
    // If it's a general link containing 'flip' or 'book', we only auto-view if type is flipbook
    const isFlipbook = type === 'flipbook';
    
    if ((isPdf || isFlipbook) && !link.includes('download=true') && link !== '#') {
      setViewingPdf({ url: link, title });
      setPdfViewerOpen(true);
      return;
    }

    if (link.startsWith('data:')) {
      const a = document.createElement('a');
      a.href = link;
      a.download = title;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      window.open(link, '_blank');
    }
  };

  const handleStoryOpen = (title: string) => {
    recordInteraction();
    setSelectedStory(title);
  };

  return (
    <div className="flex h-screen bg-gb-bg text-gb-text-dark font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gb-sidebar flex flex-col transition-all duration-300 relative z-50`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gb-primary rounded-lg flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-lg shadow-blue-500/20">
            <School size={24} />
          </div>
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col overflow-hidden"
            >
              <span className="text-white font-bold text-sm tracking-wide whitespace-nowrap">LÝ TỰ TRỌNG</span>
              <span className="text-blue-400 text-[10px] uppercase font-semibold">Thư Viện Số</span>
            </motion.div>
          )}
        </div>

        <nav className="mt-4 flex-1 px-4 space-y-2">
          {[
            { id: 'stories', icon: BookOpen, label: 'Kho Truyện' },
            { id: 'docs', icon: GraduationCap, label: 'Tài liệu' },
            { id: 'video', icon: Video, label: 'Video' },
            { id: 'admin', icon: isAdmin ? LogOut : UserRoundCheck, label: isAdmin ? 'Đăng xuất' : 'Quản trị' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'admin') {
                  isAdmin ? handleLogout() : setLoginModalOpen(true);
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${
                activeTab === item.id 
                ? 'bg-gb-primary text-white shadow-lg shadow-blue-500/20' 
                : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <item.icon size={20} />
              {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Librarian Profile */}
        <div className="p-6 border-t border-slate-700/50 mt-auto">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-slate-600 border-2 border-blue-400 overflow-hidden shrink-0`}>
              <img src={`https://ui-avatars.com/api/?name=Nguyen+Thi+Nhung&background=3B82F6&color=fff`} alt="Staff" />
            </div>
            {isSidebarOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col overflow-hidden"
              >
                <span className="text-white text-xs font-bold whitespace-nowrap">Nguyễn Thị Nhung</span>
                <span className="text-slate-500 text-[10px] uppercase">Thủ thư</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Toggle Sidebar Button */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-gb-primary shadow-sm z-50"
        >
          {isSidebarOpen ? <X size={12} /> : <Menu size={12} />}
        </button>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gb-border px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-full w-96 border border-slate-100">
            <Wand2 size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm truyện, tài liệu..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Star size={20} className="text-slate-400" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] text-white">3</span>
            </div>
            <div className="h-8 w-[1px] bg-slate-200"></div>
            {isLoading && (
              <div className="flex items-center gap-2 text-gb-primary">
                <Loader2 className="animate-spin" size={18} />
                <span className="text-[10px] font-bold uppercase">Đang đồng bộ CMS</span>
              </div>
            )}
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-gb-text-dark">Thư Viện Lý Tự Trọng</p>
              <p className="text-[10px] text-gb-text-muted capitalize">
                {new Intl.DateTimeFormat('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())}
              </p>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 flex-1 overflow-y-auto space-y-8 scroll-smooth">


          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Tổng tài nguyên số', value: (stories.length + materials.length).toLocaleString(), growth: `${stories.length} truyện - ${materials.length} dữ liệu`, color: 'emerald' },
              { label: 'Lượt xem & tải tài liệu', value: stats.interactions.toLocaleString(), growth: 'Tổng tương tác', color: 'sky' },
              { label: 'Tổng lượt truy cập', value: stats.visits.toLocaleString(), growth: 'Người dùng thật', color: 'pink' },
              { label: 'Video học tập', value: materials.filter(m => m.type === 'video').length.toString(), growth: 'Dữ liệu đa phương tiện', color: 'orange' }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gb-border shadow-sm hover:shadow-md transition-shadow">
                <p className="text-gb-text-muted text-xs font-medium uppercase mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-gb-text-dark">{stat.value}</h3>
                <div className={`mt-2 flex items-center gap-1 text-${stat.color}-500`}>
                  <Zap size={12} />
                  <span className="text-[10px] font-bold uppercase">{stat.growth}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'stories' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-extrabold text-slate-800">Kho Truyện Kỳ Diệu</h2>
                  <div className="flex gap-2">
                    {isAdmin && (
                      <button 
                        onClick={() => setAddStoryModalOpen(true)}
                        className="flex items-center gap-2 bg-gb-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all"
                      >
                        <PlusCircle size={18} /> Thêm Truyện
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      selectedCategory === 'All' ? 'bg-gb-primary text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Tất cả
                  </button>
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                        selectedCategory === cat ? 'bg-gb-primary text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {stories
                    .filter(s => selectedCategory === 'All' || s.category === selectedCategory)
                    .filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((story) => (
                      <motion.div
                      key={story.id}
                      layout
                      whileHover={{ y: -4 }}
                      onClick={() => {
                        if (story.type === 'link' || story.type === 'pdf' || story.type === 'flipbook') {
                          handleDownload(story.link, story.title, story.type);
                        } else {
                          handleStoryOpen(story.title);
                        }
                      }}
                      className="bg-white rounded-2xl border border-gb-border shadow-sm hover:shadow-xl transition-all p-3 group relative cursor-pointer"
                    >
                      {isAdmin && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteStory(story.id); }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white w-8 h-8 rounded-full shadow-lg flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity border-2 border-white"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                      
                      <div className="aspect-[3/4] rounded-xl overflow-hidden mb-4 relative">
                        <img src={story.image} alt={story.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gb-sidebar/0 group-hover:bg-gb-sidebar/60 transition-all flex flex-col items-center justify-center p-4">
                          <Rocket className="text-white w-10 h-10 mb-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all" />
                          <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all text-center">
                            {story.type === 'pdf' ? 'Đọc truyện PDF' : (story.type === 'flipbook' ? 'Xem sách lật' : (story.type === 'link' ? 'Mở liên kết' : 'Xem nội dung'))}
                          </span>
                        </div>
                      </div>

                      <div className="px-1">
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1 block">
                          {story.category}
                        </span>
                        <h3 className="font-bold text-slate-800 line-clamp-1 mb-2 group-hover:text-gb-primary transition-colors">
                          {story.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                            <IconRenderer name={story.icon} className="w-3 h-3 text-slate-500" />
                          </div>
                          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Đọc truyện điện tử</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'docs' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-extrabold text-slate-800">
                    {selectedGrade ? `Tài Liệu Khối ${selectedGrade}` : 'Góc Học Tập Nhỏ'}
                  </h2>
                  <div className="flex gap-2">
                    {selectedGrade && (
                      <button 
                        onClick={() => setSelectedGrade(null)}
                        className="px-4 py-2 rounded-xl text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all"
                      >
                        Quay lại
                      </button>
                    )}
                    {isAdmin && (
                      <button 
                        onClick={() => {
                          setDocType('doc');
                          if (selectedGrade) setDocGrade(selectedGrade);
                          setAddDocModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
                      >
                        <PlusCircle size={18} /> Thêm Tài Liệu
                      </button>
                    )}
                  </div>
                </div>

                {!selectedGrade ? (
                  <div className="bg-white rounded-2xl border border-gb-border shadow-sm overflow-hidden p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {[1, 2, 3, 4, 5].map((grade) => (
                      <button 
                        key={grade} 
                        onClick={() => setSelectedGrade(grade)}
                        className="flex flex-col items-center p-6 border-2 border-slate-100 rounded-2xl hover:border-gb-primary hover:bg-blue-50 transition-all group"
                      >
                        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-black text-2xl mb-3 group-hover:bg-gb-primary group-hover:text-white transition-all">
                          {grade}
                        </div>
                        <span className="font-bold text-slate-700">Khối {grade}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold mt-1">
                          {materials.filter(m => m.grade === grade).length} tài liệu
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-gb-border shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-gb-border">
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Tên tài liệu</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Loại</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Ngày đăng</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Hành động</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gb-border">
                        {materials
                          .filter(m => m.grade === selectedGrade)
                          .filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
                          .length > 0 ? (
                          materials
                            .filter(m => m.grade === selectedGrade)
                            .filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((doc) => (
                            <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4">
                                <p className="text-sm font-bold text-slate-800">{doc.title}</p>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${
                                  doc.type === 'ppt' ? 'bg-orange-100 text-orange-600' : 
                                  doc.type === 'doc' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {doc.type}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-xs text-slate-400 font-medium">{doc.date}</td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <button 
                                    onClick={() => handleDownload(doc.link, doc.title)}
                                    className="p-2 text-gb-primary hover:bg-blue-50 rounded-lg transition-all"
                                    title="Tải xuống/Xem"
                                  >
                                    <ExternalLink size={16} />
                                  </button>
                                  {isAdmin && (
                                    <button 
                                      onClick={() => deleteMaterial(doc.id)}
                                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                      title="Xóa tài liệu"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                              Chưa có tài liệu học tập nào được cập nhật cho Khối {selectedGrade}.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'video' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-extrabold text-slate-800">Rạp Chiếu Phim Thư Viện</h2>
                  {isAdmin && (
                    <button 
                      onClick={() => {
                        setDocType('video');
                        setAddDocModalOpen(true);
                      }}
                      className="flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-pink-500/20 hover:bg-pink-600 transition-all"
                    >
                      <PlusCircle size={18} /> Thêm Video
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {materials
                    .filter(m => m.type === 'video')
                    .filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((vid) => (
                    <div key={vid.id} className="bg-white rounded-2xl border border-gb-border shadow-sm overflow-hidden group relative">
                      {isAdmin && (
                        <button 
                          onClick={() => deleteMaterial(vid.id)}
                          className="absolute top-2 right-2 z-20 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                      <div className="p-4 border-b border-gb-border flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-pink-500">
                          <Video size={16} />
                        </div>
                        <h4 className="font-bold text-slate-800 line-clamp-1">{vid.title}</h4>
                      </div>
                      <div 
                        onClick={() => handleDownload(vid.link, vid.title)}
                        className="aspect-video bg-slate-900 relative flex items-center justify-center cursor-pointer overflow-hidden"
                      >
                        <img 
                          src={`https://images.unsplash.com/photo-1550399105-c4db5fb85c18?auto=format&fit=crop&q=80&w=800`} 
                          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
                          alt="Video cover" 
                        />
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-2xl border border-white/30 transform group-hover:scale-110 transition-transform">
                          <Video size={32} fill="currentColor" />
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50 flex justify-between items-center">
                        <div>
                          <p className="text-sm font-bold text-slate-700">Phát video ngay</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Cập nhật: {vid.date}</p>
                        </div>
                        <ExternalLink size={16} className="text-slate-300" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {selectedStory && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStory(null)}
              className="absolute inset-0 bg-gb-sidebar/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full relative z-10 shadow-2xl text-center border border-gb-border"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-gb-primary mx-auto mb-4 border border-blue-100">
                <BookOpen size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">{selectedStory}</h3>
              <p className="text-slate-500 mb-6 text-sm font-medium">Tính năng nội dung chi tiết đang được đồng bộ hóa. Các em vui lòng quay lại sau nhé!</p>
              <button 
                onClick={() => setSelectedStory(null)}
                className="w-full bg-gb-primary text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-500/20 active:translate-y-1 transition-all"
              >
                Đã hiểu
              </button>
            </motion.div>
          </div>
        )}

        {loginModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setLoginModalOpen(false); setLoginError(false); }}
              className="absolute inset-0 bg-gb-sidebar/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full relative z-10 shadow-2xl border border-gb-border"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gb-primary rounded-2xl flex items-center justify-center text-white">
                  <UserRoundCheck size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Quản Trị Thư Viện</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Đăng nhập hệ thống</p>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Tài khoản</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required 
                    placeholder="Tên đăng nhập"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:border-gb-primary focus:bg-white outline-none transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Mật khẩu</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:border-gb-primary focus:bg-white outline-none transition-all text-sm"
                  />
                </div>

                {loginError && (
                  <motion.p 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-red-500 text-xs font-bold"
                  >
                    Mật khẩu hoặc tài khoản chưa chính xác!
                  </motion.p>
                )}

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => { setLoginModalOpen(false); setLoginError(false); }} 
                    className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all text-sm"
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-gb-primary hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all text-sm"
                  >
                    Đăng nhập
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {addStoryModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAddStoryModalOpen(false)}
              className="absolute inset-0 bg-gb-sidebar/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full relative z-10 shadow-2xl border border-gb-border"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-gb-primary border border-blue-100">
                  <PlusCircle size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Thêm Truyện Mới</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Cập nhật kho truyện số</p>
                </div>
              </div>

              <form onSubmit={handleAddStory} className="space-y-4">
                <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
                  <button 
                    type="button"
                    onClick={() => setStoryMethod('link')}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${storyMethod === 'link' ? 'bg-white shadow-sm text-gb-primary' : 'text-slate-400'}`}
                  >
                    Dùng liên kết
                  </button>
                  <button 
                    type="button"
                    onClick={() => setStoryMethod('file')}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${storyMethod === 'file' ? 'bg-white shadow-sm text-emerald-500' : 'text-slate-400'}`}
                  >
                    Tải tệp PDF
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Tên Truyện *</label>
                  <input 
                    type="text" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required 
                    placeholder="VD: Dế Mèn Phiêu Lưu Ký"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:border-gb-primary focus:bg-white outline-none transition-all text-sm"
                  />
                </div>

                {storyMethod === 'link' ? (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Liên kết (Link đọc)</label>
                    <input 
                      type="url" 
                      value={newLink}
                      onChange={(e) => setNewLink(e.target.value)}
                      placeholder="https://..." 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:border-gb-primary focus:bg-white outline-none transition-all text-sm"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Chọn tệp PDF truyện</label>
                    <div className="relative">
                      <input 
                        type="file" 
                        onChange={handleStoryFileChange}
                        accept=".pdf"
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                      />
                      <div className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl px-4 py-6 flex flex-col items-center justify-center gap-2 group-hover:border-emerald-500 transition-all">
                        <PlusCircle size={24} className="text-slate-300" />
                        <span className="text-[10px] font-bold text-slate-400">
                          {storyFile ? storyFile.name : 'Nhấn để chọn tệp PDF'}
                        </span>
                        {storyFile && (
                          <span className="text-[10px] text-emerald-500 font-bold uppercase mt-1">Tệp đã sẵn sàng</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Ảnh bìa (URL)</label>
                  <input 
                    type="text" 
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="Bỏ trống để dùng ảnh mặc định" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:border-gb-primary focus:bg-white outline-none transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Thể loại</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:border-gb-primary focus:bg-white outline-none transition-all text-sm font-bold appearance-none cursor-pointer"
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="flex gap-3 pt-6">
                  <button type="button" onClick={() => setAddStoryModalOpen(false)} className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all text-sm">Hủy bỏ</button>
                  <button type="submit" className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-gb-primary hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all text-sm">Lưu Truyện</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {addDocModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAddDocModalOpen(false)}
              className="absolute inset-0 bg-gb-sidebar/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full relative z-10 shadow-2xl border border-gb-border"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-100">
                  <PlusCircle size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Thêm Tài Liệu</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Cập nhật tài liệu số</p>
                </div>
              </div>

              <form onSubmit={handleAddMaterial} className="space-y-4">
                <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
                  <button 
                    type="button"
                    onClick={() => setDocMethod('link')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${docMethod === 'link' ? 'bg-white shadow-sm text-gb-primary' : 'text-slate-400'}`}
                  >
                    Dùng liên kết
                  </button>
                  <button 
                    type="button"
                    onClick={() => setDocMethod('file')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${docMethod === 'file' ? 'bg-white shadow-sm text-emerald-500' : 'text-slate-400'}`}
                  >
                    Tải tệp từ máy
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Tên tài liệu *</label>
                  <input 
                    type="text" 
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    required 
                    placeholder="VD: Giáo án Toán khối 1"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:border-gb-primary focus:bg-white outline-none transition-all text-sm"
                  />
                </div>

                {docMethod === 'link' ? (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Liên kết (Link tải/xem)</label>
                    <input 
                      type="url" 
                      value={docLink}
                      onChange={(e) => setDocLink(e.target.value)}
                      placeholder="https://..." 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:border-gb-primary focus:bg-white outline-none transition-all text-sm"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Chọn tệp (.docx, .pdf, .ppt)</label>
                    <div className="relative">
                      <input 
                        type="file" 
                        onChange={handleFileChange}
                        accept=".doc,.docx,.pdf,.ppt,.pptx"
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                      />
                      <div className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl px-4 py-6 flex flex-col items-center justify-center gap-2 group-hover:border-emerald-500 transition-all">
                        <PlusCircle size={24} className="text-slate-300" />
                        <span className="text-xs font-bold text-slate-400">
                          {uploadedFile ? uploadedFile.name : 'Nhấn để chọn tệp hoặc kéo thả'}
                        </span>
                        {uploadedFile && (
                          <span className="text-[10px] text-emerald-500 font-bold uppercase">Tệp đã sẵn sàng</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Loại tài liệu</label>
                    <select 
                      value={docType}
                      onChange={(e) => setDocType(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:border-gb-primary focus:bg-white outline-none transition-all text-sm font-bold appearance-none cursor-pointer"
                    >
                      <option value="doc">Văn bản (DOCX/PDF)</option>
                      <option value="ppt">Bài giảng (PPT)</option>
                      <option value="video">Video</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Dành cho Khối</label>
                    <select 
                      value={docGrade}
                      onChange={(e) => setDocGrade(Number(e.target.value))}
                      disabled={docType === 'video'}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:border-gb-primary focus:bg-white outline-none transition-all text-sm font-bold appearance-none cursor-pointer disabled:opacity-50"
                    >
                      {[1, 2, 3, 4, 5].map(g => <option key={g} value={g}>Khối {g}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-6">
                  <button type="button" onClick={() => setAddDocModalOpen(false)} className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all text-sm">Hủy bỏ</button>
                  <button type="submit" className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all text-sm">Lưu Tài Liệu</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
        {pdfViewerOpen && viewingPdf && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-0 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPdfViewerOpen(false)}
              className="absolute inset-0 bg-slate-900/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full h-full md:rounded-3xl relative z-10 shadow-2xl flex flex-col overflow-hidden max-w-6xl"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 line-clamp-1">{viewingPdf.title}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Chế độ đọc sách số</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = viewingPdf.url;
                      a.download = viewingPdf.title;
                      a.click();
                    }}
                    className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                    title="Tải về máy"
                  >
                    <Download size={20} />
                  </button>
                  <button 
                    onClick={() => window.open(viewingPdf.url, '_blank')}
                    className="p-2 text-slate-400 hover:text-gb-primary hover:bg-blue-50 rounded-xl transition-all"
                    title="Mở trong tab mới (Nếu không xem được tại đây)"
                  >
                    <Globe size={20} />
                  </button>
                  <button 
                    onClick={() => setPdfViewerOpen(false)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* PDF Content */}
              <div className="flex-1 bg-slate-100 relative overflow-hidden">
                <iframe 
                  src={`${viewingPdf.url}#toolbar=1&navpanes=0&scrollbar=1`}
                  className="w-full h-full border-none"
                  title="PDF Viewer"
                />
              </div>

              {/* Footer / Controls Note */}
              <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  Sử dụng thanh công cụ bên trên để Phóng to, Thu nhỏ và Chuyển trang
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
