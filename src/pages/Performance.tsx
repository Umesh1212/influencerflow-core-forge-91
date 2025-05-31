
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Eye, Target, DollarSign, BarChart3 } from 'lucide-react';

interface KPIData {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ElementType;
}

const mockKPIs: KPIData[] = [
  {
    id: '1',
    title: 'Total Views',
    value: '2.4M',
    change: '+12.5%',
    trend: 'up',
    icon: Eye
  },
  {
    id: '2',
    title: 'Engagement Rate',
    value: '4.2%',
    change: '+0.8%',
    trend: 'up',
    icon: Target
  },
  {
    id: '3',
    title: 'Cost Per Mile (CPM)',
    value: '$3.24',
    change: '-0.12%',
    trend: 'down',
    icon: DollarSign
  },
  {
    id: '4',
    title: 'Return on Investment',
    value: '285%',
    change: '+15.2%',
    trend: 'up',
    icon: BarChart3
  }
];

interface PostData {
  id: string;
  influencer: string;
  platform: string;
  content: string;
  engagement: string;
  reach: string;
  posted: string;
}

const mockPosts: PostData[] = [
  {
    id: '1',
    influencer: '@fashionista_sarah',
    platform: 'Instagram',
    content: 'Summer collection showcase post',
    engagement: '8.2K',
    reach: '124K',
    posted: '2 hours ago'
  },
  {
    id: '2',
    influencer: '@tech_reviewer_mike',
    platform: 'YouTube',
    content: 'Product unboxing video',
    engagement: '15.6K',
    reach: '298K',
    posted: '1 day ago'
  },
  {
    id: '3',
    influencer: '@lifestyle_jenny',
    platform: 'TikTok',
    content: 'Holiday gift guide',
    engagement: '22.1K',
    reach: '567K',
    posted: '2 days ago'
  }
];

const KPICard = ({ kpi, isLoading }: { kpi: KPIData; isLoading: boolean }) => {
  const Icon = kpi.icon;
  
  if (isLoading) {
    return (
      <Card className="bg-surface-elevated border border-subtle shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-surface-hover rounded-default animate-skeleton-pulse"></div>
          <div className="w-8 h-8 bg-surface-hover rounded animate-skeleton-pulse"></div>
        </div>
        <div className="space-y-2">
          <div className="h-6 bg-surface-hover rounded animate-skeleton-pulse"></div>
          <div className="h-4 bg-surface-hover rounded animate-skeleton-pulse w-3/4"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-surface-elevated border border-subtle shadow-card p-6 card-hover">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-primary-500 bg-opacity-10 rounded-default">
          <Icon size={20} className="text-primary-500" />
        </div>
        {kpi.trend === 'up' ? (
          <TrendingUp size={16} className="text-secondary-500" />
        ) : (
          <TrendingDown size={16} className="text-danger-500" />
        )}
      </div>
      <div>
        <p className="text-caption text-secondary mb-1">{kpi.title}</p>
        <p className="text-heading text-primary mb-2">{kpi.value}</p>
        <p className={`text-caption ${kpi.trend === 'up' ? 'text-secondary-500' : 'text-danger-500'}`}>
          {kpi.change} from last month
        </p>
      </div>
    </Card>
  );
};

const SkeletonPostRow = () => (
  <tr className="border-b border-subtle">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <td key={i} className="px-6 py-4">
        <div className="h-4 bg-surface-hover rounded animate-skeleton-pulse"></div>
      </td>
    ))}
  </tr>
);

const Performance = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [kpis, setKpis] = useState<KPIData[]>([]);
  const [posts, setPosts] = useState<PostData[]>([]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setKpis(mockKPIs);
      setPosts(mockPosts);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Page Header */}
      <div>
        <h1 className="text-heading text-primary mb-2">Performance Dashboard</h1>
        <p className="text-body text-secondary">Track campaign performance and analyze influencer content metrics</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockKPIs.map((kpi) => (
          <KPICard key={kpi.id} kpi={kpi} isLoading={isLoading} />
        ))}
      </div>

      {/* Chart Section */}
      <Card className="bg-surface-elevated border border-subtle shadow-card">
        <div className="p-6">
          <h2 className="text-subhead text-primary mb-6">Performance Trends</h2>
          {isLoading ? (
            <div className="h-80 bg-surface-hover rounded-default animate-skeleton-pulse"></div>
          ) : (
            <div className="h-80 bg-surface-hover rounded-default flex items-center justify-center">
              <div className="text-center">
                <BarChart3 size={48} className="text-secondary mx-auto mb-4" />
                <p className="text-body text-secondary mb-2">Chart visualization will be displayed here</p>
                <p className="text-caption text-secondary">Integration with charting library pending</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Recent Posts Table */}
      <Card className="bg-surface-elevated border border-subtle shadow-card">
        <div className="p-6">
          <h2 className="text-subhead text-primary mb-6">Recent Posts</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-subtle">
                  <th className="text-left px-6 py-3 text-label text-secondary">Influencer</th>
                  <th className="text-left px-6 py-3 text-label text-secondary">Platform</th>
                  <th className="text-left px-6 py-3 text-label text-secondary">Content</th>
                  <th className="text-left px-6 py-3 text-label text-secondary">Engagement</th>
                  <th className="text-left px-6 py-3 text-label text-secondary">Reach</th>
                  <th className="text-left px-6 py-3 text-label text-secondary">Posted</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <>
                    <SkeletonPostRow />
                    <SkeletonPostRow />
                    <SkeletonPostRow />
                  </>
                ) : (
                  posts.map((post) => (
                    <tr 
                      key={post.id} 
                      className="border-b border-subtle card-hover cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <span className="text-body text-primary font-medium">{post.influencer}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-body text-secondary">{post.platform}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-body text-secondary">{post.content}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-body text-primary font-medium">{post.engagement}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-body text-primary font-medium">{post.reach}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-caption text-secondary">{post.posted}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Performance;
