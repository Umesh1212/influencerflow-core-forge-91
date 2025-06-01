import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Label } from '@/components/ui/label';

type Campaign = Database['public']['Tables']['campaigns']['Row'] & {
  brand: { name: string } | null; // From the select query in useCampaigns
  // campaign_creators: any[]; // Define this more accurately later
};

const CampaignDetail = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!campaignId) return;
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('campaigns')
        .select(`
          *,
          brand:brands(name)
        `)
        .eq('id', campaignId)
        .single();

      if (fetchError) {
        console.error('Error fetching campaign details:', fetchError);
        setError('Failed to load campaign details. It might not exist or you may not have permission.');
        setCampaign(null);
      } else {
        setCampaign(data as Campaign);
      }
      setLoading(false);
    };

    fetchCampaign();
  }, [campaignId]);

  const handleDeleteCampaign = async () => {
    if (!campaignId) return;
    if (!window.confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    const { error: deleteError } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', campaignId);
    setLoading(false);

    if (deleteError) {
      console.error('Error deleting campaign:', deleteError);
      setError(`Failed to delete campaign: ${deleteError.message}`);
    } else {
      navigate('/'); // Navigate back to campaigns list
    }
  };

  if (loading) return <p className="p-4">Loading campaign details...</p>;
  if (error) return <p className="p-4 text-danger-500">Error: {error}</p>;
  if (!campaign) return <p className="p-4">Campaign not found.</p>;

  // TODO: Add RLS policy for DELETE on campaigns table
  // RLS: Allow delete if user owns the brand associated with the campaign OR is admin.
  // Example: CREATE POLICY "Users can delete campaigns of their brands" ON public.campaigns FOR DELETE USING (has_brand_access(brand_id));
  // (has_brand_access function already exists and checks owner_id = auth.uid() or is_admin())

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Card>
        <CardHeader className="flex flex-row justify-between items-start">
          <div>
            <CardTitle className="text-2xl mb-1">{campaign.name}</CardTitle>
            <CardDescription>Brand: {campaign.brand?.name || 'N/A'} <span className="mx-2">|</span> Status: <span className="capitalize">{campaign.status || 'N/A'}</span></CardDescription>
          </div>
          <div className="flex gap-2">
            {/* TODO: Add Edit Button - visible if campaign.status is 'draft' */}
            {/* <Button variant="outline" size="sm" onClick={() => navigate(`/campaigns/${campaignId}/edit`)}>Edit</Button> */}
            <Button variant="destructive" size="sm" onClick={handleDeleteCampaign} disabled={loading}>
              Delete Campaign
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Campaign Brief</h3>
            <p className="text-secondarywhitespace-pre-wrap">{campaign.brief || 'No brief provided.'}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Budget</Label>
              <p className="font-semibold">{campaign.budget_numeric ? `$${Number(campaign.budget_numeric).toLocaleString()}` : 'N/A'} {campaign.currency}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Start Date</Label>
              <p className="font-semibold">{campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">End Date</Label>
              <p className="font-semibold">{campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>

          {campaign.goals_json && typeof campaign.goals_json === 'object' && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Goals & KPIs</h3>
              <p className="text-secondary"><span className="font-medium">Objective:</span> {(campaign.goals_json as any).objective || 'N/A'}</p>
              <p className="text-secondary"><span className="font-medium">KPIs:</span> {(campaign.goals_json as any).kpis?.join(', ') || 'N/A'}</p>
            </div>
          )}

          <hr className="my-6" />

          <div>
            <h3 className="font-semibold text-lg mb-2">Associated Creators</h3>
            {/* TODO: List associated creators from campaign_creators table */}
            <p className="text-secondary">Creator management will be available here.</p>
            <Link to={`/discovery?campaignId=${campaignId}`}>
              <Button className="mt-4">
                Find & Add Creators
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignDetail; 