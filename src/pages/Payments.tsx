
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, ArrowUpRight } from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  campaign: string;
  amount: string;
  due: string;
  status: 'paid' | 'pending' | 'overdue';
}

interface Payout {
  id: string;
  milestone: string;
  creator: string;
  amount: string;
  releaseDate: string;
  status: 'released' | 'pending' | 'processing';
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    campaign: 'Summer Fashion Collection',
    amount: '$12,500',
    due: 'Dec 15, 2024',
    status: 'pending'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    campaign: 'Tech Product Launch',
    amount: '$8,000',
    due: 'Dec 10, 2024',
    status: 'overdue'
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    campaign: 'Holiday Campaign 2024',
    amount: '$25,000',
    due: 'Dec 20, 2024',
    status: 'paid'
  }
];

const mockPayouts: Payout[] = [
  {
    id: '1',
    milestone: 'Content Delivery',
    creator: 'Alex Chen',
    amount: '$2,500',
    releaseDate: 'Dec 15, 2024',
    status: 'pending'
  },
  {
    id: '2',
    milestone: 'Campaign Launch',
    creator: 'Maria Rodriguez',
    amount: '$1,600',
    releaseDate: 'Dec 12, 2024',
    status: 'processing'
  },
  {
    id: '3',
    milestone: 'Performance Bonus',
    creator: 'Jordan Kim',
    amount: '$5,000',
    releaseDate: 'Dec 8, 2024',
    status: 'released'
  }
];

const InvoiceStatusChip = ({ status }: { status: Invoice['status'] }) => {
  const statusConfig = {
    paid: { label: 'Paid', className: 'status-chip status-paid' },
    pending: { label: 'Pending', className: 'status-chip status-sent' },
    overdue: { label: 'Overdue', className: 'inline-flex items-center px-2 py-1 rounded text-label bg-red-900 text-red-300' }
  };

  const config = statusConfig[status];
  
  return (
    <span className={config.className}>
      {config.label}
    </span>
  );
};

const PayoutStatusChip = ({ status }: { status: Payout['status'] }) => {
  const statusConfig = {
    released: { label: 'Released', className: 'status-chip status-paid' },
    pending: { label: 'Pending', className: 'status-chip status-sent' },
    processing: { label: 'Processing', className: 'inline-flex items-center px-2 py-1 rounded text-label bg-blue-900 text-blue-300' }
  };

  const config = statusConfig[status];
  
  return (
    <span className={config.className}>
      {config.label}
    </span>
  );
};

const SkeletonRow = ({ columns }: { columns: number }) => (
  <tr className="border-b border-subtle">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <div className="h-4 bg-surface-hover rounded animate-skeleton-pulse"></div>
      </td>
    ))}
  </tr>
);

const Payments = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setInvoices(mockInvoices);
      setPayouts(mockPayouts);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display text-primary font-semibold">Payments</h1>
          <p className="text-body text-secondary">Manage invoices and creator payouts</p>
        </div>
      </div>

      {/* Payments Card with Tabs */}
      <Card className="bg-surface-elevated border border-subtle shadow-card">
        <Tabs defaultValue="invoices" className="w-full">
          <div className="border-b border-subtle px-6 pt-6">
            <TabsList className="bg-surface-hover">
              <TabsTrigger value="invoices" className="data-[state=active]:bg-primary-500 data-[state=active]:text-white">
                Invoices
              </TabsTrigger>
              <TabsTrigger value="payouts" className="data-[state=active]:bg-primary-500 data-[state=active]:text-white">
                Payouts
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="invoices" className="p-6 pt-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-subtle">
                    <th className="text-left px-6 py-3 text-label text-secondary">Invoice #</th>
                    <th className="text-left px-6 py-3 text-label text-secondary">Campaign</th>
                    <th className="text-left px-6 py-3 text-label text-secondary">Amount</th>
                    <th className="text-left px-6 py-3 text-label text-secondary">Due</th>
                    <th className="text-left px-6 py-3 text-label text-secondary">Status</th>
                    <th className="text-left px-6 py-3 text-label text-secondary">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <>
                      <SkeletonRow columns={6} />
                      <SkeletonRow columns={6} />
                      <SkeletonRow columns={6} />
                    </>
                  ) : (
                    invoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b border-subtle card-hover">
                        <td className="px-6 py-4">
                          <span className="text-body text-primary font-medium">{invoice.invoiceNumber}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-body text-secondary">{invoice.campaign}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-body text-primary font-medium">{invoice.amount}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-caption text-secondary">{invoice.due}</span>
                        </td>
                        <td className="px-6 py-4">
                          <InvoiceStatusChip status={invoice.status} />
                        </td>
                        <td className="px-6 py-4">
                          {invoice.status !== 'paid' && (
                            <Button 
                              size="sm" 
                              className="bg-primary-500 hover:bg-primary-600 text-white button-press focus-ring"
                            >
                              Pay
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="payouts" className="p-6 pt-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-subtle">
                    <th className="text-left px-6 py-3 text-label text-secondary">Milestone</th>
                    <th className="text-left px-6 py-3 text-label text-secondary">Creator</th>
                    <th className="text-left px-6 py-3 text-label text-secondary">Amount</th>
                    <th className="text-left px-6 py-3 text-label text-secondary">Release Date</th>
                    <th className="text-left px-6 py-3 text-label text-secondary">Status</th>
                    <th className="text-left px-6 py-3 text-label text-secondary">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <>
                      <SkeletonRow columns={6} />
                      <SkeletonRow columns={6} />
                      <SkeletonRow columns={6} />
                    </>
                  ) : (
                    payouts.map((payout) => (
                      <tr key={payout.id} className="border-b border-subtle card-hover">
                        <td className="px-6 py-4">
                          <span className="text-body text-primary font-medium">{payout.milestone}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-body text-secondary">{payout.creator}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-body text-primary font-medium">{payout.amount}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-caption text-secondary">{payout.releaseDate}</span>
                        </td>
                        <td className="px-6 py-4">
                          <PayoutStatusChip status={payout.status} />
                        </td>
                        <td className="px-6 py-4">
                          {payout.status === 'pending' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-secondary hover:text-primary focus-ring"
                            >
                              Release
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Payments;
