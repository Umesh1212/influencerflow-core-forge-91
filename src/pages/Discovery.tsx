
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Discovery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedCreator, setSelectedCreator] = useState<any>(null);
  const navigate = useNavigate();

  const filters = [
    { category: 'Platform', options: ['Instagram', 'TikTok', 'YouTube', 'Twitter'] },
    { category: 'Category', options: ['Fashion', 'Tech', 'Food', 'Travel', 'Fitness'] },
    { category: 'Language', options: ['English', 'Spanish', 'French', 'German'] },
    { category: 'Followers', options: ['1K-10K', '10K-100K', '100K-1M', '1M+'] },
    { category: 'Engagement', options: ['1-3%', '3-6%', '6-10%', '10%+'] }
  ];

  const creators = [
    {
      id: 1,
      name: 'Sarah Chen',
      platform: 'Instagram',
      followers: '245K',
      engagement: '4.2%',
      category: 'Fashion',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=100&h=100&fit=crop&crop=face',
      stats: { posts: 1240, avgLikes: 12400, avgComments: 340 }
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      platform: 'YouTube',
      followers: '580K',
      engagement: '6.8%',
      category: 'Tech',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      stats: { posts: 340, avgLikes: 45200, avgComments: 1200 }
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      platform: 'TikTok',
      followers: '1.2M',
      engagement: '8.4%',
      category: 'Food',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      stats: { posts: 890, avgLikes: 98000, avgComments: 2300 }
    },
    {
      id: 4,
      name: 'David Kim',
      platform: 'Instagram',
      followers: '89K',
      engagement: '5.1%',
      category: 'Travel',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      stats: { posts: 567, avgLikes: 4500, avgComments: 180 }
    },
    {
      id: 5,
      name: 'Zoe Williams',
      platform: 'YouTube',
      followers: '320K',
      engagement: '7.2%',
      category: 'Fitness',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      stats: { posts: 180, avgLikes: 23000, avgComments: 890 }
    },
    {
      id: 6,
      name: 'Alex Thompson',
      platform: 'TikTok',
      followers: '670K',
      engagement: '9.1%',
      category: 'Tech',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      stats: { posts: 420, avgLikes: 61000, avgComments: 1800 }
    }
  ];

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const handleInviteCreator = (creator: any) => {
    // Navigate to inbox with the selected creator
    navigate('/inbox', { state: { invitedCreator: creator } });
  };

  const CreatorCard = ({ creator }: { creator: any }) => (
    <Card 
      className="bg-surface-elevated border-subtle card-hover cursor-pointer"
      onClick={() => setSelectedCreator(creator)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <img 
            src={creator.avatar} 
            alt={creator.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="text-body text-primary font-semibold">{creator.name}</h3>
            <p className="text-caption text-secondary">{creator.platform}</p>
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-caption text-secondary">Followers</span>
            <span className="text-caption text-primary">{creator.followers}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-caption text-secondary">Engagement</span>
            <span className="text-caption text-primary">{creator.engagement}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-caption text-secondary">Category</span>
            <span className="text-caption text-primary">{creator.category}</span>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full border border-subtle hover:bg-surface-hover"
          onClick={(e) => {
            e.stopPropagation();
            // Add to shortlist logic here
          }}
        >
          <Plus size={14} className="mr-2" />
          Add to Shortlist
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" />
        <Input
          placeholder="Search creators by name, category, or platform..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-surface-elevated border-subtle text-primary"
        />
      </div>

      {/* Filter Pills */}
      <div className="space-y-3">
        {filters.map((filterGroup) => (
          <div key={filterGroup.category}>
            <h3 className="text-caption text-secondary mb-2 uppercase tracking-wide">{filterGroup.category}</h3>
            <div className="flex flex-wrap gap-2">
              {filterGroup.options.map((option) => (
                <button
                  key={option}
                  onClick={() => toggleFilter(option)}
                  className={`px-3 py-2 rounded-default text-caption transition-colors ${
                    selectedFilters.includes(option)
                      ? 'bg-primary-500 text-white'
                      : 'bg-surface-elevated text-secondary hover:bg-surface-hover hover:text-primary border border-subtle'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Creator Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {creators.map((creator) => (
          <CreatorCard key={creator.id} creator={creator} />
        ))}
      </div>

      {/* Creator Detail Drawer */}
      {selectedCreator && (
        <div className="fixed inset-y-0 right-0 w-drawer bg-surface-elevated border-l border-subtle z-40 animate-slide-in-right overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-heading text-primary font-semibold">Creator Details</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCreator(null)}
                className="text-secondary hover:text-primary"
              >
                ×
              </Button>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <img 
                src={selectedCreator.avatar} 
                alt={selectedCreator.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h4 className="text-subhead text-primary font-semibold">{selectedCreator.name}</h4>
                <p className="text-body text-secondary">{selectedCreator.platform}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-subtle mb-6">
              <div className="flex gap-6">
                <button className="pb-3 border-b-2 border-primary-500 text-primary">Stats</button>
                <button className="pb-3 text-secondary hover:text-primary">Audience</button>
                <button className="pb-3 text-secondary hover:text-primary">Past Brands</button>
              </div>
            </div>

            {/* Stats Content */}
            <div className="space-y-4 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-bg-default border-subtle">
                  <CardContent className="p-4 text-center">
                    <p className="text-caption text-secondary">Followers</p>
                    <p className="text-subhead text-primary font-semibold">{selectedCreator.followers}</p>
                  </CardContent>
                </Card>
                <Card className="bg-bg-default border-subtle">
                  <CardContent className="p-4 text-center">
                    <p className="text-caption text-secondary">Engagement</p>
                    <p className="text-subhead text-primary font-semibold">{selectedCreator.engagement}</p>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-secondary">Total Posts</span>
                  <span className="text-primary">{selectedCreator.stats.posts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Avg. Likes</span>
                  <span className="text-primary">{selectedCreator.stats.avgLikes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Avg. Comments</span>
                  <span className="text-primary">{selectedCreator.stats.avgComments.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Invite Button */}
            <Button 
              onClick={() => handleInviteCreator(selectedCreator)}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white"
            >
              Invite to Campaign
            </Button>
          </div>
        </div>
      )}

      {/* Backdrop for drawer */}
      {selectedCreator && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 animate-fade-in"
          onClick={() => setSelectedCreator(null)}
        />
      )}
    </div>
  );
};

export default Discovery;
