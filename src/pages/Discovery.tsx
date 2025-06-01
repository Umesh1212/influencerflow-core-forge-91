import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Plus, ChevronDown, ChevronUp, Filter as FilterIcon, EyeOff as EyeOffIcon } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCreators, Creator } from '@/hooks/useCreators';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner"; // Correct import for sonner

// Define interface for the 'stats' JSONB object
interface SocialPlatformStats {
  handle?: string | null;
  followers?: number | null;
  subscribers?: number | null; // For YouTube
  posts_count?: number | null;
  videos_count?: number | null; // For YouTube/TikTok
  avg_likes?: number | null;
  avg_comments?: number | null;
  engagement_rate_pct?: number | null; // Instagram specific
  avg_views?: number | null; // YouTube/TikTok
  watch_time_hours?: number | null; // YouTube
  completion_rate_pct?: number | null; // TikTok
}

interface CreatorStats {
  profile_picture_url?: string | null;
  tier?: string | null;
  is_verified_platform_account?: boolean | null;
  social_platforms?: {
    instagram?: SocialPlatformStats | null;
    youtube?: SocialPlatformStats | null;
    tiktok?: SocialPlatformStats | null;
    // Add other platforms as needed
  } | null;
  audience_insights?: {
    primary_audience_language?: string | null;
    top_audience_countries?: { code: string; percentage: number }[] | null;
    age_groups_distribution_pct?: Record<string, number> | null;
    gender_distribution_pct?: Record<string, number> | null;
  } | null;
  engagement_metrics?: {
    overall_avg_engagement_rate_pct?: number | null;
    platform_specific_er_pct?: Record<string, number> | null; 
  } | null;
  content_specialization?: {
    primary_niches?: string[] | null;
    content_themes?: string[] | null;
    content_quality_assessment?: string | null;
    posting_frequency?: Record<string, string> | null;
  } | null;
  past_collaborations?: {
    brand_name: string;
    campaign_type: string;
    year: number;
    platform: string;
    outcome_summary?: string | null;
  }[] | null;
  last_stats_update_at?: string | null; // Assuming timestamptz is string
}

const Discovery = () => {
  const [searchParams] = useSearchParams(); // Get URL search params
  const activeCampaignId = searchParams.get('campaignId'); // Read campaignId

  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [areAllFiltersOpen, setAreAllFiltersOpen] = useState(true);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [addingCreatorToCampaign, setAddingCreatorToCampaign] = useState<Record<string, boolean>>({}); // To track loading state per button
  const [addedCreatorIds, setAddedCreatorIds] = useState<Set<string>>(new Set()); // Track added creator IDs for current campaign context
  const navigate = useNavigate();

  const { data: fetchedCreators, isLoading, error } = useCreators();

  // Define filters array before useMemo so it can be in its dependency array
  const filters = [
    { category: 'Platform', options: ['Instagram', 'TikTok', 'YouTube', 'Twitter'] },
    { category: 'Category', options: ['Fashion', 'Tech', 'Food', 'Travel', 'Fitness'] },
    { category: 'Language', options: ['English', 'Spanish', 'French', 'German'] },
    { category: 'Followers', options: ['1K-10K', '10K-100K', '100K-1M', '1M+'] },
    { category: 'Engagement', options: ['1-3%', '3-6%', '6-10%', '10%+'] }
  ];

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [inputValue]);

  // When activeCampaignId changes, reset the list of addedCreatorIds for the new campaign context
  useEffect(() => {
    setAddedCreatorIds(new Set());
  }, [activeCampaignId]);

  // Memoized search and filter logic
  const processedCreators = useMemo(() => {
    let creatorsToProcess: Creator[] = []; // Initialize with correct type

    if (fetchedCreators && Array.isArray(fetchedCreators)) {
      creatorsToProcess = [...fetchedCreators]; // Start with a copy
    }

    // Apply search query first
    if (searchQuery && creatorsToProcess.length > 0) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      creatorsToProcess = creatorsToProcess.filter((creator: Creator) => {
        const stats = creator.stats as CreatorStats | null;
        const displayName = creator.display_name?.toLowerCase() || '';
        const bio = ('bio' in creator && creator.bio) ? (creator.bio as string).toLowerCase() : '';
        const niches = stats?.content_specialization?.primary_niches?.join(' ').toLowerCase() || '';
        const igHandle = stats?.social_platforms?.instagram?.handle?.toLowerCase() || '';
        const ytHandle = stats?.social_platforms?.youtube?.handle?.toLowerCase() || '';
        const tiktokHandle = stats?.social_platforms?.tiktok?.handle?.toLowerCase() || '';

        return displayName.includes(lowerCaseQuery) ||
               bio.includes(lowerCaseQuery) ||
               niches.includes(lowerCaseQuery) ||
               igHandle.includes(lowerCaseQuery) ||
               ytHandle.includes(lowerCaseQuery) ||
               tiktokHandle.includes(lowerCaseQuery);
      });
    }
    // If !searchQuery, creatorsToProcess remains as fetchedCreators (or empty array if fetch failed)

    // Apply filters if any are selected
    if (selectedFilters.length > 0 && creatorsToProcess.length > 0) {
      creatorsToProcess = creatorsToProcess.filter((creator: Creator) => {
        const stats = creator.stats as CreatorStats | null;
        const activeFilterCategories: Record<string, string[]> = {};
        selectedFilters.forEach(sf => {
          const group = filters.find(fg => fg.options.includes(sf));
          if (group) {
            if (!activeFilterCategories[group.category]) {
              activeFilterCategories[group.category] = [];
            }
            activeFilterCategories[group.category].push(sf.toLowerCase());
          }
        });

        let matchesAllActiveCategories = true;
        for (const categoryName in activeFilterCategories) {
          const selectedOptionsForCategory = activeFilterCategories[categoryName];
          let matchesThisCategory = false;

          if (categoryName === 'Platform') {
            const creatorPlatforms: string[] = [];
            if (stats?.social_platforms?.instagram?.handle) creatorPlatforms.push('instagram');
            if (stats?.social_platforms?.youtube?.handle) creatorPlatforms.push('youtube');
            if (stats?.social_platforms?.tiktok?.handle) creatorPlatforms.push('tiktok');
            // Add other platforms like Twitter if present in stats
            // if (stats?.social_platforms?.twitter?.handle) creatorPlatforms.push('twitter');
            
            if (selectedOptionsForCategory.some(opt => creatorPlatforms.includes(opt))) {
              matchesThisCategory = true;
            }
          }
          if (categoryName === 'Category') {
            const niches = stats?.content_specialization?.primary_niches?.map(n => n.toLowerCase()) || [];
            if (selectedOptionsForCategory.some(opt => niches.includes(opt))) {
              matchesThisCategory = true;
            }
          }
          if (categoryName === 'Language') {
            const languageMap: Record<string, string> = {
              english: 'en',
              spanish: 'es',
              french: 'fr',
              german: 'de'
              // Add other mappings as needed
            };

            const creatorLangs: string[] = [];
            if (creator.languages && Array.isArray(creator.languages)) {
              creator.languages.forEach(lang => lang && creatorLangs.push(lang.toLowerCase()));
            }
            if (('primary_language' in creator && typeof creator.primary_language === 'string') && 
                creator.primary_language && 
                !creatorLangs.includes(creator.primary_language.toLowerCase())) {
              creatorLangs.push(creator.primary_language.toLowerCase());
            }
            
            // console.log(`Creator ID: ${creator.id}, Display Name: ${creator.display_name}`);
            // console.log(`  Selected Lang Filters: ${JSON.stringify(selectedOptionsForCategory)}`);
            // console.log(`  Creator Langs Derived: ${JSON.stringify(creatorLangs)}`);
            
            // Convert selected full language names to codes for comparison
            const selectedLangCodes = selectedOptionsForCategory.map(opt => languageMap[opt] || opt); // Fallback to option itself if no map

            if (selectedLangCodes.some(code => creatorLangs.includes(code))) {
              matchesThisCategory = true;
            }
            // console.log(`  Selected Lang Codes for Filter: ${JSON.stringify(selectedLangCodes)}`);
            // console.log(`  Matches This Category (Language): ${matchesThisCategory}`);
          }
          if (categoryName === 'Followers') {
            const getNumericValue = (str: string): number => {
              const lower = str.toLowerCase().trim();
              if (lower.endsWith('k')) return parseFloat(lower) * 1000;
              if (lower.endsWith('m')) return parseFloat(lower) * 1000000;
              return parseFloat(lower);
            };

            const creatorFollowersNumbers: number[] = [];
            if (stats?.social_platforms?.instagram?.followers) creatorFollowersNumbers.push(stats.social_platforms.instagram.followers);
            if (stats?.social_platforms?.youtube?.subscribers) creatorFollowersNumbers.push(stats.social_platforms.youtube.subscribers);
            if (stats?.social_platforms?.tiktok?.followers) creatorFollowersNumbers.push(stats.social_platforms.tiktok.followers);
            
            const maxFollowers = creatorFollowersNumbers.length > 0 ? Math.max(...creatorFollowersNumbers) : 0;

            if (selectedOptionsForCategory.some(opt => {
              const lowerOpt = opt.toLowerCase().trim();
              let minVal: number;
              let maxVal: number | null = null;

              if (lowerOpt.includes('-')) { 
                const parts = lowerOpt.split('-');
                minVal = getNumericValue(parts[0]);
                maxVal = getNumericValue(parts[1]);
              } else if (lowerOpt.endsWith('+')) { 
                minVal = getNumericValue(lowerOpt.slice(0, -1));
                maxVal = Infinity; 
              } else { 
                minVal = getNumericValue(lowerOpt);
                maxVal = minVal; 
              }
              
              if (maxFollowers >= minVal && (maxVal === Infinity || (maxVal !== null && maxFollowers <= maxVal))) {
                return true; 
              }
              return false;
            })) {
              matchesThisCategory = true;
            }
          }
          if (categoryName === 'Engagement') {
            const getNumericPercent = (str: string): number => {
              return parseFloat(str.replace('%', '').trim());
            };

            const engagementRatePct = stats?.engagement_metrics?.overall_avg_engagement_rate_pct;

            if (typeof engagementRatePct === 'number' && selectedOptionsForCategory.some(opt => {
              const lowerOpt = opt.toLowerCase().trim();
              let minVal: number;
              let maxVal: number | null = null;

              if (lowerOpt.includes('-')) { 
                const parts = lowerOpt.split('-');
                minVal = getNumericPercent(parts[0]);
                maxVal = getNumericPercent(parts[1]);
              } else if (lowerOpt.endsWith('+')) { 
                minVal = getNumericPercent(lowerOpt.slice(0, -1));
                maxVal = Infinity; 
              } else { 
                minVal = getNumericPercent(lowerOpt);
                maxVal = minVal; 
              }

              // console.log(`Opt: ${opt}, Min: ${minVal}, Max: ${maxVal}, CreatorER: ${engagementRatePct}`);
              if (engagementRatePct >= minVal && (maxVal === Infinity || (maxVal !== null && engagementRatePct <= maxVal))) {
                return true; 
              }
              return false;
            })) {
              matchesThisCategory = true;
            }
          }

          if (!matchesThisCategory && selectedOptionsForCategory.length > 0) { // only fail if category had selections
            matchesAllActiveCategories = false;
            break; 
          }
        }
        return matchesAllActiveCategories;
      });
    }
    
    return creatorsToProcess;

  }, [fetchedCreators, searchQuery, selectedFilters, filters]);

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const toggleAllFilterSections = () => {
    setAreAllFiltersOpen(prev => !prev);
  };

  const handleInviteCreator = (creator: Creator) => {
    // Navigate to inbox with the selected creator
    navigate('/inbox', { state: { invitedCreator: creator } });
  };

  const handleAddCreatorToCampaign = async (creatorId: string) => {
    if (!activeCampaignId) {
      toast.error("No active campaign selected to add creator to.");
      console.error("No active campaign selected.");
      return;
    }
    setAddingCreatorToCampaign(prev => ({ ...prev, [creatorId]: true }));
    try {
      if (addedCreatorIds.has(creatorId)) {
        toast.info("Creator already added to this campaign.");
        setAddingCreatorToCampaign(prev => ({ ...prev, [creatorId]: false }));
        return;
      }

      const { error: insertError } = await supabase.from('campaign_creators').insert({
        campaign_id: activeCampaignId,
        creator_id: creatorId,
        status_in_campaign: 'shortlisted' 
      });

      if (insertError) {
        // The unique constraint error will have code '23505'
        if (insertError.code === '23505') {
          toast.error("Creator is already part of this campaign (database constraint).");
          // Also update local state if DB says it's a duplicate
          setAddedCreatorIds(prev => new Set(prev).add(creatorId)); 
        } else {
          throw insertError;
        }
      }
      
      toast.success("Creator successfully added to campaign!");
      console.log("Creator added to campaign", { creatorId, activeCampaignId });
      setAddedCreatorIds(prev => new Set(prev).add(creatorId));
    } catch (error) {
      console.error("Error adding creator to campaign:", error);
      toast.error(`Failed to add creator: ${(error as Error).message}`);
    }
    setAddingCreatorToCampaign(prev => ({ ...prev, [creatorId]: false }));
  };

  const CreatorCard = ({ creator }: { creator: Creator }) => {
    const stats = creator.stats as CreatorStats | null;

    const displayName = creator.display_name || 'N/A';
    
    // Improved platform display for multiple platforms
    const platforms: string[] = [];
    if (stats?.social_platforms?.instagram?.handle) platforms.push('Instagram');
    if (stats?.social_platforms?.youtube?.handle) platforms.push('YouTube');
    if (stats?.social_platforms?.tiktok?.handle) platforms.push('TikTok');
    // Add Twitter if needed: if (stats?.social_platforms?.twitter?.handle) platforms.push('Twitter');
    const platformDisplay = platforms.length > 0 ? platforms.join(', ') : 'N/A';

    const avatarUrl = stats?.profile_picture_url || 'https://via.placeholder.com/100';
    
    const followersCount = stats?.social_platforms?.instagram?.followers ??
                           stats?.social_platforms?.youtube?.subscribers ??
                           stats?.social_platforms?.tiktok?.followers ?? 'N/A';

    const engagementRate = stats?.engagement_metrics?.overall_avg_engagement_rate_pct ? 
                           `${stats.engagement_metrics.overall_avg_engagement_rate_pct}%` : 'N/A';

    const categoryDisplay = stats?.content_specialization?.primary_niches?.[0] || 'N/A';

    return (
    <Card 
      className="bg-surface-elevated border-subtle card-hover cursor-pointer"
      onClick={() => setSelectedCreator(creator)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <img 
              src={avatarUrl} 
              alt={displayName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
              <h3 className="text-body text-primary font-semibold">{displayName}</h3>
              <p className="text-caption text-secondary">{platformDisplay}</p>
            </div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-caption text-secondary">Followers</span>
              <span className="text-caption text-primary">{followersCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-caption text-secondary">Engagement</span>
              <span className="text-caption text-primary">{engagementRate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-caption text-secondary">Category</span>
              <span className="text-caption text-primary">{categoryDisplay}</span>
            </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full border border-subtle hover:bg-surface-hover"
          onClick={(e) => {
            e.stopPropagation();
            if (activeCampaignId) {
              if (!addedCreatorIds.has(creator.id)) { // Check before calling
                handleAddCreatorToCampaign(creator.id);
              }
            } else {
              console.log('Shortlist (no campaign context):', creator.id);
            }
          }}
          disabled={addingCreatorToCampaign[creator.id] || (activeCampaignId ? addedCreatorIds.has(creator.id) : false)}
        >
          {addingCreatorToCampaign[creator.id] ? (
            'Adding...'
          ) : activeCampaignId ? (
            addedCreatorIds.has(creator.id) ? '✓ Added to Campaign' : <><Plus size={14} className="mr-2" /> Add to Campaign</>
          ) : (
            <><Plus size={14} className="mr-2" /> Add to Shortlist</>
          )}
        </Button>
      </CardContent>
    </Card>
  );
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" />
        <Input
          placeholder="Search creators by name, category, or platform..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="pl-10 bg-surface-elevated border-subtle text-primary"
        />
      </div>

      {/* Filter Pills */}
      <div className="space-y-3">
        <div className="flex justify-end mb-2">
          <Button 
            variant="ghost"
            size="sm"
            onClick={toggleAllFilterSections}
            className="text-secondary hover:text-primary"
          >
            {areAllFiltersOpen ? <EyeOffIcon size={16} className="mr-2" /> : <FilterIcon size={16} className="mr-2" />}
            {areAllFiltersOpen ? 'Hide All Filters' : 'Show All Filters'}
          </Button>
        </div>

        {/* Conditionally render the entire block of filter groups */}
        {areAllFiltersOpen && (
          <>
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
          </>
        )}
      </div>

      {/* Creator Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading && (
          // Basic loading state: Repeat a skeleton card a few times
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="bg-surface-elevated border-subtle p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-surface-hover animate-skeleton-pulse"></div>
                <div>
                  <div className="h-4 w-24 bg-surface-hover rounded animate-skeleton-pulse mb-1"></div>
                  <div className="h-3 w-16 bg-surface-hover rounded animate-skeleton-pulse"></div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-3 w-full bg-surface-hover rounded animate-skeleton-pulse"></div>
                <div className="h-3 w-full bg-surface-hover rounded animate-skeleton-pulse"></div>
                <div className="h-3 w-full bg-surface-hover rounded animate-skeleton-pulse"></div>
              </div>
              <div className="h-8 w-full bg-surface-hover rounded animate-skeleton-pulse"></div>
            </Card>
          ))
        )}
        {error && (
          <div className="col-span-full text-danger-500">
            <p>Error fetching creators: {error.message}</p>
            <p>Please ensure you have signed up a new user to initialize data and that database permissions (RLS) are correct.</p>
          </div>
        )}
        {!isLoading && !error && processedCreators && Array.isArray(processedCreators) && processedCreators.map((creator) => (
          <CreatorCard key={creator.id} creator={creator} />
        ))}
        {!isLoading && !error && processedCreators && Array.isArray(processedCreators) && processedCreators.length === 0 && (
          <div className="col-span-full text-center text-secondary">
            <p>No creators found{searchQuery || selectedFilters.length > 0 ? ' for your criteria.' : '.'}</p>
            {/* Update message when filters are also active */}
            <p>If this is unexpected, try signing up a new user to initialize data or check database permissions.</p>
          </div>
        )}
      </div>

      {/* Creator Detail Drawer */}
      {selectedCreator && (() => {
        const detailStats = selectedCreator.stats as CreatorStats | null;
        const detailDisplayName = selectedCreator.display_name || 'N/A';
        const detailPlatform = detailStats?.social_platforms?.instagram?.handle ? 'Instagram' :
                               detailStats?.social_platforms?.youtube?.handle ? 'YouTube' :
                               detailStats?.social_platforms?.tiktok?.handle ? 'TikTok' : 'N/A';
        const detailAvatarUrl = detailStats?.profile_picture_url || 'https://via.placeholder.com/100';
        const detailFollowers = detailStats?.social_platforms?.instagram?.followers ??
                                detailStats?.social_platforms?.youtube?.subscribers ??
                                detailStats?.social_platforms?.tiktok?.followers ?? 'N/A';
        const detailEngagement = detailStats?.engagement_metrics?.overall_avg_engagement_rate_pct ? 
                               `${detailStats.engagement_metrics.overall_avg_engagement_rate_pct}%` : 'N/A';
        // Example, adjust based on your CreatorStats structure and what you want to display
        const detailTotalPosts = detailStats?.social_platforms?.instagram?.posts_count ?? 
                                 detailStats?.social_platforms?.youtube?.videos_count ?? 
                                 detailStats?.social_platforms?.tiktok?.videos_count ?? 'N/A';
        const detailAvgLikes = detailStats?.social_platforms?.instagram?.avg_likes ?? 
                               detailStats?.social_platforms?.youtube?.avg_likes ?? 
                               detailStats?.social_platforms?.tiktok?.avg_likes ?? 'N/A';
        const detailAvgComments = detailStats?.social_platforms?.instagram?.avg_comments ?? 'N/A'; // Assuming TikTok/YT might not have this readily

        return (
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
                  src={detailAvatarUrl} 
                  alt={detailDisplayName}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                  <h4 className="text-subhead text-primary font-semibold">{detailDisplayName}</h4>
                  <p className="text-body text-secondary">{detailPlatform}</p>
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
                      <p className="text-subhead text-primary font-semibold">{detailFollowers}</p>
                  </CardContent>
                </Card>
                <Card className="bg-bg-default border-subtle">
                  <CardContent className="p-4 text-center">
                    <p className="text-caption text-secondary">Engagement</p>
                      <p className="text-subhead text-primary font-semibold">{detailEngagement}</p>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-secondary">Total Posts</span>
                    <span className="text-primary">{detailTotalPosts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Avg. Likes</span>
                    {/* Ensure detailAvgLikes is a string or number before toLocaleString if it can be 'N/A' directly */}
                    <span className="text-primary">{typeof detailAvgLikes === 'number' ? detailAvgLikes.toLocaleString() : detailAvgLikes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Avg. Comments</span>
                    <span className="text-primary">{typeof detailAvgComments === 'number' ? detailAvgComments.toLocaleString() : detailAvgComments}</span>
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
        );
      })()}

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
