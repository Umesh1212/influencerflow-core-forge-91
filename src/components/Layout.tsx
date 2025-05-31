
import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, BarChart3, Search, MessageSquare, FileText, CreditCard, TrendingUp, Settings, Plus, LogOut, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const navigationItems = [
  { name: 'Campaigns', path: '/', icon: BarChart3, isDefault: true },
  { name: 'Discovery', path: '/discovery', icon: Search },
  { name: 'Inbox', path: '/inbox', icon: MessageSquare },
  { name: 'Contracts', path: '/contracts', icon: FileText },
  { name: 'Payments', path: '/payments', icon: CreditCard },
  { name: 'Performance', path: '/performance', icon: TrendingUp },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);
  const location = useLocation();
  const { signOut, userRole } = useAuth();

  const getBreadcrumb = () => {
    const currentItem = navigationItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.name : 'Home';
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const NavItem = ({ item, mobile = false }: { item: typeof navigationItems[0], mobile?: boolean }) => {
    const isActive = location.pathname === item.path || 
                    (item.isDefault && location.pathname === '/');
    
    return (
      <NavLink
        to={item.path}
        className={({ isActive: linkActive }) => `
          flex items-center gap-3 px-3 py-3 rounded-default transition-all duration-200 min-tap focus-ring
          ${linkActive || isActive ? 'bg-primary-500 text-white' : 'text-secondary hover:bg-surface-hover hover:text-primary'}
          ${mobile ? 'text-body' : 'text-caption'}
          w-full justify-${isMenuExpanded ? 'start' : 'center'}
        `}
        onClick={() => {
          if (mobile) {
            setIsMobileMenuOpen(false);
          }
        }}
      >
        <item.icon size={20} className="flex-shrink-0" />
        {(mobile || isMenuExpanded) && (
          <span className="truncate">{item.name}</span>
        )}
      </NavLink>
    );
  };

  return (
    <div className="min-h-screen bg-bg-default text-text-primary w-full flex">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Slide-over Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-y-0 left-0 w-80 bg-surface-elevated border-r border-subtle z-50 lg:hidden animate-slide-in-right">
          <div className="flex items-center justify-between p-4 border-b border-subtle">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent-gradient rounded-default"></div>
              <span className="text-heading font-semibold">InfluencerFlow AI</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(false)}
              className="min-tap focus-ring"
            >
              <X size={20} />
            </Button>
          </div>
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => (
              <NavItem key={item.name} item={item} mobile={true} />
            ))}
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="w-full justify-start gap-3 px-3 py-3 text-secondary hover:text-primary"
            >
              <LogOut size={20} />
              Sign Out
            </Button>
          </nav>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex lg:flex-shrink-0 ${isMenuExpanded ? 'lg:w-56' : 'lg:w-16'} lg:flex-col bg-surface-elevated border-r border-subtle h-screen sticky top-0 transition-all duration-300`}>
        <div className="flex h-topbar border-b border-subtle w-full">
          {isMenuExpanded ? (
            <div className="flex items-center justify-between w-full px-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-default flex-shrink-0"></div>
                <span className="text-sm font-medium text-text-primary">InfluencerFlow</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsMenuExpanded(!isMenuExpanded)}
                className="min-tap focus-ring text-secondary hover:text-primary flex-shrink-0">
                <ChevronLeft size={18} />
              </Button>
            </div>
          ) : (
            <div className="flex items-center w-full h-full">
              <div className="mx-auto w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-default"></div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsMenuExpanded(!isMenuExpanded)}
                className="min-tap focus-ring text-secondary hover:text-primary absolute right-0 top-[10px]">
                <ChevronRight size={18} />
              </Button>
            </div>
          )}
        </div>
        <nav className="flex-1 p-2 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>
        <div className="p-2 border-t border-subtle">
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className={`w-full ${isMenuExpanded ? 'justify-start' : 'justify-center'} gap-3 px-3 py-3 text-secondary hover:text-primary`}
          >
            <LogOut size={20} />
            {isMenuExpanded && <span>Sign Out</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-topbar bg-surface-elevated border-b border-subtle flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden min-tap focus-ring"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </Button>
            
            {/* Breadcrumb */}
            <nav className="text-caption text-secondary">
              <span>Home</span>
              <span className="mx-2">›</span>
              <span className="text-primary">{getBreadcrumb()}</span>
            </nav>
          </div>

          {/* Action Slot */}
          <div className="flex items-center gap-3">
            {userRole && (
              <span className="text-caption text-secondary capitalize">
                {userRole}
              </span>
            )}
            {location.pathname === '/' && (
              <Button className="bg-primary-500 hover:bg-primary-600 text-white button-press focus-ring">
                <Plus size={16} className="mr-2" />
                New Campaign
              </Button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 min-h-[calc(100vh-var(--topbar-height))]" id="main-content">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface-elevated border-t border-subtle z-30">
          <div className="flex items-center justify-around py-2">
            {navigationItems.slice(0, 5).map((item) => {
              const isActive = location.pathname === item.path || 
                              (item.isDefault && location.pathname === '/');
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={`flex flex-col items-center gap-1 p-2 min-tap focus-ring rounded-default transition-colors ${
                    isActive ? 'text-primary-500' : 'text-secondary'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="text-xs truncate">{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Right Drawer (placeholder for future use) */}
      {isDrawerOpen && (
        <div className="fixed inset-y-0 right-0 w-drawer bg-surface-elevated border-l border-subtle z-40 animate-slide-in-right">
          <div className="p-6">
            <h3 className="text-heading mb-4">Detail Panel</h3>
            <p className="text-secondary">Content will be displayed here</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
