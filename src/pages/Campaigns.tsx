import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal } from 'lucide-react';
import NewCampaignWizard from '@/components/NewCampaignWizard';
import { useNavigate } from 'react-router-dom';

interface Campaign {
  id: string;
  name: string;
  kpi: string;
  budget: string;
  status: 'draft' | 'sent' | 'signed' | 'live' | 'paid' | 'error';
  updated: string;
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Summer Fashion Collection',
    kpi: 'Reach & Engagement',
    budget: '$12,500',
    status: 'live',
    updated: '2 hours ago'
  },
  {
    id: '2',
    name: 'Tech Product Launch',
    kpi: 'Conversions',
    budget: '$8,000',
    status: 'signed',
    updated: '1 day ago'
  },
  {
    id: '3',
    name: 'Holiday Campaign 2024',
    kpi: 'Brand Awareness',
    budget: '$25,000',
    status: 'draft',
    updated: '3 days ago'
  }
];

const StatusChip = ({ status }: { status: Campaign['status'] }) => {
  const statusConfig = {
    draft: { label: 'Draft', className: 'status-chip status-draft' },
    sent: { label: 'Sent', className: 'status-chip status-sent' },
    signed: { label: 'Signed', className: 'status-chip status-signed' },
    live: { label: 'Live', className: 'status-chip status-live' },
    paid: { label: 'Paid', className: 'status-chip status-paid' },
    error: { label: 'Error', className: 'status-chip status-error' }
  };

  const config = statusConfig[status];
  
  return (
    <span className={config.className}>
      {config.label}
    </span>
  );
};

const SkeletonRow = () => (
  <tr className="border-b border-subtle">
    {[1, 2, 3, 4, 5].map((i) => (
      <td key={i} className="px-6 py-4">
        <div className="h-4 bg-surface-hover rounded animate-skeleton-pulse"></div>
      </td>
    ))}
  </tr>
);

const Campaigns = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setCampaigns(mockCampaigns);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleWizardComplete = () => {
    // Navigate to Discovery page after campaign creation
    navigate('/discovery');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display text-primary font-semibold">Campaigns</h1>
          <p className="text-body text-secondary">Manage your influencer marketing campaigns</p>
        </div>
        <Button 
          onClick={() => setIsWizardOpen(true)}
          className="bg-primary-500 hover:bg-primary-600 text-white button-press focus-ring"
        >
          <Plus size={16} className="mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Campaigns Table */}
      <Card className="bg-surface-elevated border border-subtle shadow-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-subhead text-primary">Active Campaigns</h2>
            <Button variant="ghost" size="sm" className="text-secondary hover:text-primary focus-ring">
              <MoreHorizontal size={16} />
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-subtle">
                  <th className="text-left px-6 py-3 text-label text-secondary">Name</th>
                  <th className="text-left px-6 py-3 text-label text-secondary">KPI</th>
                  <th className="text-left px-6 py-3 text-label text-secondary">Budget</th>
                  <th className="text-left px-6 py-3 text-label text-secondary">Status</th>
                  <th className="text-left px-6 py-3 text-label text-secondary">Updated</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <>
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                  </>
                ) : (
                  campaigns.map((campaign) => (
                    <tr 
                      key={campaign.id} 
                      className="border-b border-subtle card-hover cursor-pointer group"
                    >
                      <td className="px-6 py-4">
                        <span className="text-body text-primary font-medium">{campaign.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-body text-secondary">{campaign.kpi}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-body text-primary font-medium">{campaign.budget}</span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusChip status={campaign.status} />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-caption text-secondary">{campaign.updated}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!isLoading && campaigns.length === 0 && (
            <div className="text-center py-12">
              <p className="text-body text-secondary mb-4">No campaigns found</p>
              <Button className="bg-primary-500 hover:bg-primary-600 text-white button-press focus-ring">
                <Plus size={16} className="mr-2" />
                Create Your First Campaign
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* New Campaign Wizard */}
      <NewCampaignWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onComplete={handleWizardComplete}
      />
    </div>
  );
};

export default Campaigns;
