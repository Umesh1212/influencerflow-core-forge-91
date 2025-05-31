
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Download, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';

interface Contract {
  id: string;
  creator: string;
  campaign: string;
  status: 'draft' | 'sent' | 'signed' | 'expired';
  updated: string;
}

const mockContracts: Contract[] = [
  {
    id: '1',
    creator: 'Alex Chen',
    campaign: 'Summer Fashion Collection',
    status: 'signed',
    updated: '2 hours ago'
  },
  {
    id: '2',
    creator: 'Maria Rodriguez',
    campaign: 'Tech Product Launch',
    status: 'sent',
    updated: '1 day ago'
  },
  {
    id: '3',
    creator: 'Jordan Kim',
    campaign: 'Holiday Campaign 2024',
    status: 'draft',
    updated: '3 days ago'
  }
];

const StatusChip = ({ status }: { status: Contract['status'] }) => {
  const statusConfig = {
    draft: { label: 'Draft', className: 'status-chip status-draft' },
    sent: { label: 'Sent', className: 'status-chip status-sent' },
    signed: { label: 'Signed', className: 'status-chip status-signed' },
    expired: { label: 'Expired', className: 'status-chip status-error' }
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
    {[1, 2, 3, 4].map((i) => (
      <td key={i} className="px-6 py-4">
        <div className="h-4 bg-surface-hover rounded animate-skeleton-pulse"></div>
      </td>
    ))}
  </tr>
);

const Contracts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setContracts(mockContracts);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleRowClick = (contract: Contract) => {
    setSelectedContract(contract);
    setIsPdfModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display text-primary font-semibold">Contracts</h1>
          <p className="text-body text-secondary">Manage your influencer contracts and agreements</p>
        </div>
      </div>

      {/* Contracts Table */}
      <Card className="bg-surface-elevated border border-subtle shadow-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-subhead text-primary">Contract Library</h2>
            <Button variant="ghost" size="sm" className="text-secondary hover:text-primary focus-ring">
              <MoreHorizontal size={16} />
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-subtle">
                  <th className="text-left px-6 py-3 text-label text-secondary">Creator</th>
                  <th className="text-left px-6 py-3 text-label text-secondary">Campaign</th>
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
                  contracts.map((contract) => (
                    <tr 
                      key={contract.id} 
                      className="border-b border-subtle card-hover cursor-pointer group"
                      onClick={() => handleRowClick(contract)}
                    >
                      <td className="px-6 py-4">
                        <span className="text-body text-primary font-medium">{contract.creator}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-body text-secondary">{contract.campaign}</span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusChip status={contract.status} />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-caption text-secondary">{contract.updated}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!isLoading && contracts.length === 0 && (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-secondary mb-4" />
              <p className="text-body text-secondary mb-4">No contracts found</p>
              <Button className="bg-primary-500 hover:bg-primary-600 text-white button-press focus-ring">
                Create Your First Contract
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* PDF Modal */}
      <Dialog open={isPdfModalOpen} onOpenChange={setIsPdfModalOpen}>
        <DialogContent className="max-w-4xl h-[80vh] bg-surface-elevated border border-subtle">
          <DialogHeader>
            <DialogTitle className="text-heading text-primary">
              Contract: {selectedContract?.creator} - {selectedContract?.campaign}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 bg-surface-hover rounded-lg flex items-center justify-center">
            <div className="text-center">
              <FileText size={64} className="mx-auto text-secondary mb-4" />
              <p className="text-body text-secondary mb-6">PDF Viewer Placeholder</p>
              <div className="flex gap-3 justify-center">
                <Button className="bg-primary-500 hover:bg-primary-600 text-white button-press focus-ring">
                  <Download size={16} className="mr-2" />
                  Download
                </Button>
                <Button variant="outline" className="border-subtle hover:bg-surface-hover focus-ring">
                  Open in DocuSign
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contracts;
