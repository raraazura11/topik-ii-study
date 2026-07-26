import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  BookOpen,
  GraduationCap,
  FileText,
  Headphones,
  PenTool,
  LayoutDashboard,
  Search,
  Menu,
} from 'lucide-react';

const navItems = [
  { path: '/', label: '대시보드', labelEn: 'Dashboard', icon: LayoutDashboard },
  { path: '/vocabulary', label: '어휘', labelEn: 'Vocabulary', icon: BookOpen },
  { path: '/grammar', label: '문법', labelEn: 'Grammar', icon: GraduationCap },
  { path: '/reading', label: '읽기', labelEn: 'Reading', icon: FileText },
  { path: '/listening', label: '듣기', labelEn: 'Listening', icon: Headphones },
  { path: '/writing', label: '쓰기', labelEn: 'Writing', icon: PenTool },
];

function NavLink({ item, isActive, onClick }: { item: typeof navItems[0]; isActive: boolean; onClick?: () => void }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.path}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
        isActive
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-muted-foreground hover:bg-secondary hover:text-secondary-foreground'
      }`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <div className="flex flex-col">
        <span>{item.label}</span>
        <span className={`text-xs ${isActive ? 'text-primary-foreground/70' : 'text-muted-foreground/70'}`}>
          {item.labelEn}
        </span>
      </div>
    </Link>
  );
}

interface LayoutProps {
  children: React.ReactNode;
  onSearch?: (query: string) => void;
}

export default function Layout({ children, onSearch }: LayoutProps) {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link to="/" className="flex items-center gap-3 cursor-pointer" onClick={onItemClick}>
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">한</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground leading-tight">TOPIK II</h1>
            <p className="text-xs text-muted-foreground">한국어능력시험</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            item={item}
            isActive={location.pathname === item.path}
            onClick={onItemClick}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          TOPIK II Study Tool
          <br />
          Levels 3-6
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-sidebar-background fixed h-screen">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center gap-4 px-4 sm:px-6 h-16">
            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden cursor-pointer">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SidebarContent onItemClick={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="검색어를 입력하세요... (Search)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary/50 border-0 focus-visible:ring-1"
                />
              </div>
            </form>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-6xl">
          {children}
        </main>
      </div>
    </div>
  );
}