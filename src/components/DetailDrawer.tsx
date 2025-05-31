
import React, { useEffect } from 'react';
import { X, TrendingUp, Users, DollarSign, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'creator' | 'invoice' | 'kpi';
  data?: any;
}

const CreatorStats = ({ data }: { data: any }) => (
  <div className="space-y-6">
    <div className="flex items-center gap-4 p-4 bg-surface-hover rounded-lg">
      <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center text-white text-heading font-semibold">
        {data?.initials || 'AC'}
      </div>
      <div>
        <h3 className="text-subhead text-primary font-semibold">{data?.name || 'Alex Chen'}</h3>
        <p className="text-caption text-secondary">@{data?.handle || 'alexchen'}</p>
        <div className="flex gap-4 mt-2">
          <span className="text-caption text-secondary">125K followers</span>
          <span className="text-caption text-secondary">4.2% engagement</span>
        </div>
      </div>
    </div>

    <Tabs defaultValue="stats" className="w-full">
      <TabsList className="bg-surface-hover w-full">
        <TabsTrigger value="stats" className="flex-1 data-[state=active]:bg-primary-500 data-[state=active]:text-white">
          Stats
        </TabsTrigger>
        <TabsTrigger value="audience" className="flex-1 data-[state=active]:bg-primary-500 data-[state=active]:text-white">
          Audience
        </TabsTrigger>
        <TabsTrigger value="brands" className="flex-1 data-[state=active]:bg-primary-500 data-[state=active]:text-white">
          Past Brands
        </TabsTrigger>
      </TabsList>

      <TabsContent value="stats" className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-surface-hover rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Eye size={16} className="text-secondary" />
              <span className="text-label text-secondary">Avg Views</span>
            </div>
            <p className="text-subhead text-primary font-semibold">45.2K</p>
          </div>
          <div className="p-4 bg-surface-hover rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-secondary" />
              <span className="text-label text-secondary">Engagement</span>
            </div>
            <p className="text-subhead text-primary font-semibold">4.2%</p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="audience" className="space-y-4 mt-4">
        <div className="p-4 bg-surface-hover rounded-lg">
          <h4 className="text-body text-primary font-medium mb-3">Demographics</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-caption text-secondary">18-24</span>
              <span className="text-caption text-primary">45%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-caption text-secondary">25-34</span>
              <span className="text-caption text-primary">35%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-caption text-secondary">35+</span>
              <span className="text-caption text-primary">20%</span>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="brands" className="space-y-4 mt-4">
        <div className="space-y-3">
          {['Nike', 'Apple', 'Samsung'].map((brand, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-surface-hover rounded-lg">
              <span className="text-body text-primary">{brand}</span>
              <span className="text-caption text-secondary">2024</span>
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>

    <Button className="w-full bg-primary-500 hover:bg-primary-600 text-white button-press focus-ring">
      Invite to Campaign
    </Button>
  </div>
);

const InvoiceDetail = ({ data }: { data: any }) => (
  <div className="space-y-6">
    <div className="p-4 bg-surface-hover rounded-lg">
      <h3 className="text-subhead text-primary font-semibold mb-4">Invoice Details</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-caption text-secondary">Invoice Number</span>
          <span className="text-body text-primary">INV-2024-001</span>
        </div>
        <div className="flex justify-between">
          <span className="text-caption text-secondary">Campaign</span>
          <span className="text-body text-primary">Summer Fashion Collection</span>
        </div>
        <div className="flex justify-between">
          <span className="text-caption text-secondary">Amount</span>
          <span className="text-body text-primary font-semibold">$12,500</span>
        </div>
        <div className="flex justify-between">
          <span className="text-caption text-secondary">Due Date</span>
          <span className="text-body text-primary">Dec 15, 2024</span>
        </div>
      </div>
    </div>

    <div className="space-y-3">
      <Button className="w-full bg-primary-500 hover:bg-primary-600 text-white button-press focus-ring">
        Pay Invoice
      </Button>
      <Button variant="outline" className="w-full border-subtle hover:bg-surface-hover focus-ring">
        Download PDF
      </Button>
    </div>
  </div>
);

const KPIBreakdown = ({ data }: { data: any }) => (
  <div className="space-y-6">
    <div className="p-4 bg-surface-hover rounded-lg">
      <h3 className="text-subhead text-primary font-semibold mb-4">Performance Breakdown</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Eye size={16} className="text-secondary" />
            <span className="text-label text-secondary">Views</span>
          </div>
          <p className="text-heading text-primary font-semibold">2.4M</p>
          <p className="text-caption text-secondary">+12% vs target</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp size={16} className="text-secondary" />
            <span className="text-label text-secondary">Engagement</span>
          </div>
          <p className="text-heading text-primary font-semibold">4.8%</p>
          <p className="text-caption text-secondary">+0.5% vs target</p>
        </div>
      </div>
    </div>

    <div className="p-4 bg-surface-hover rounded-lg">
      <h4 className="text-body text-primary font-medium mb-3">Top Performing Content</h4>
      <div className="space-y-2">
        {['Instagram Reel #1', 'TikTok Video #2', 'Instagram Story #3'].map((content, i) => (
          <div key={i} className="flex justify-between">
            <span className="text-caption text-secondary">{content}</span>
            <span className="text-caption text-primary">{(350 - i * 50)}K views</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const DetailDrawer: React.FC<DetailDrawerProps> = ({ isOpen, onClose, type, data }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const drawer = document.getElementById('detail-drawer');
      if (drawer && !drawer.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const renderContent = () => {
    switch (type) {
      case 'creator':
        return <CreatorStats data={data} />;
      case 'invoice':
        return <InvoiceDetail data={data} />;
      case 'kpi':
        return <KPIBreakdown data={data} />;
      default:
        return <div>Content not found</div>;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 z-40 animate-fade-in" />
      
      {/* Drawer */}
      <div 
        id="detail-drawer"
        className="fixed inset-y-0 right-0 w-drawer bg-surface-elevated border-l border-subtle z-50 animate-slide-in-right focus-trap"
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        <div className="flex items-center justify-between p-6 border-b border-subtle">
          <h2 className="text-heading text-primary font-semibold">
            {type === 'creator' && 'Creator Profile'}
            {type === 'invoice' && 'Invoice Details'}
            {type === 'kpi' && 'KPI Breakdown'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="min-tap focus-ring"
            aria-label="Close drawer"
          >
            <X size={20} />
          </Button>
        </div>
        
        <div className="p-6 overflow-y-auto h-full">
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default DetailDrawer;
