
import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, BarChart3, Search, MessageSquare, FileText, CreditCard, TrendingUp, Settings, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigationItems = [
  { name: 'Campaigns', path: '/', icon: BarChart3, isDefault: true },
  { name: 'Discovery', path: '/discovery', icon: Search },
  { name: 'Inbox', path: '/inbox', icon: MessageSquare },
  { name: 'Contracts', path: '/contracts', icon: FileText, disabled: true },
  { name: 'Payments', path: '/payments', icon: CreditCard, disabled: true },
  { name: 'Performance', path: '/performance', icon: TrendingUp },
  { name: 'Settings', path: '/settings', icon: Settings, disabled: true },
];

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();

  const getBreadcrumb = () => {
    const currentItem = navigationItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.name : 'Home';
  };

  const NavItem = ({ item, mobile = false }: { item: typeof navigationItems[0], mobile?: boolean }) => {
    const isActive = location.pathname === item.path;
    
    return (
      <NavLink
        to={item.path}
        className={({ isActive: linkActive }) => `
          flex items-center gap-3 px-3 py-3 rounded-default transition-all duration-200 min-tap focus-ring
          ${linkActive || isActive ? 'bg-primary-500 text-white' : 'text-secondary hover:bg-surface-hover hover:text-primary'}
          ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${mobile ? 'text-body' : 'text-caption'}
        `}
        onClick={(e) => {
          if (item.disabled) {
            e.preventDefault();
            return;
          }
          if (mobile) {
            setIsMobileMenuOpen(false);
          }
        }}
      >
        <item.icon size={20} className="flex-shrink-0" />
        <span className={mobile ? 'block' : 'hidden lg:block'}>{item.name}</span>
      </NavLink>
    );
  };

  return (
    <div className="min-h-screen bg-bg-default text-text-primary w-full">
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
          </nav>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-rail lg:flex-col bg-surface-elevated border-r border-subtle">
        <div className="flex items-center justify-center h-topbar border-b border-subtle">
          <div className="w-8 h-8 bg-accent-gradient rounded-default"></div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-rail">
        {/* Top Header */}
        <header className="h-topbar bg-surface-elevated border-b border-subtle flex items-center justify-between px-4 lg:px-6">
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
            {location.pathname === '/' && (
              <Button className="bg-primary-500 hover:bg-primary-600 text-white button-press focus-ring">
                <Plus size={16} className="mr-2" />
                New Campaign
              </Button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface-elevated border-t border-subtle">
          <div className="flex items-center justify-around py-2">
            {navigationItems.slice(0, 5).map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={`flex flex-col items-center gap-1 p-2 min-tap focus-ring rounded-default transition-colors ${
                    isActive ? 'text-primary-500' : 'text-secondary'
                  } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={(e) => {
                    if (item.disabled) {
                      e.preventDefault();
                    }
                  }}
                >
                  <item.icon size={20} />
                  <span className="text-xs">{item.name}</span>
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
