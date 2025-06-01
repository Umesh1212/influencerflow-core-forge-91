import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Database } from '@/integrations/supabase/types';

// Assuming a type for campaign creation, can be refined based on actual needs
interface NewCampaignData {
  name: string;
  brief: string;
  budget_numeric: number | null;
  currency: string;
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD
  goals_json?: any; // Or a more specific type
}

// Type for data being sent to Supabase, aligning with table schema
type CampaignInsert = Database['public']['Tables']['campaigns']['Insert'];

interface UserBrand {
  id: string;
  name: string;
}

const NewCampaign = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  console.log('Current user for brand creation:', user); // Log the user object
  const [formData, setFormData] = useState<NewCampaignData>({
    name: '',
    brief: '',
    budget_numeric: null,
    currency: 'USD',
    start_date: '',
    end_date: '',
    goals_json: { objective: '', kpis: [] },
  });
  const [userBrands, setUserBrands] = useState<UserBrand[]>([]);
  const [brandId, setBrandId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserBrands = async () => {
      if (user) {
        console.log('[NewCampaign] fetchUserBrands triggered. User ID:', user.id);
        setLoading(true);
        setError(null);
        setUserBrands([]); // Reset user brands before fetching
        setBrandId(null); // Reset selected brandId

        const { data: brandsData, error: brandError } = await supabase
          .from('brands')
          .select('id, name')
          .eq('owner_id', user.id);

        console.log('[NewCampaign] Supabase brands query result:', { brandsData, brandError });

        if (brandError) {
          console.error('[NewCampaign] Error fetching brands:', brandError);
          setError('Could not fetch your brand information. Please check console for details.');
        } else if (brandsData && brandsData.length > 0) {
          console.log('[NewCampaign] Brands found:', brandsData);
          setUserBrands(brandsData as UserBrand[]);
          if (brandsData.length === 1) {
            console.log('[NewCampaign] Auto-selecting single brand:', brandsData[0]);
            setBrandId(brandsData[0].id);
          } else {
            console.log('[NewCampaign] Multiple brands found, user needs to select.');
            // User has multiple brands, will need to select one. Don't set brandId yet.
            // setError('Please select a brand for this campaign.'); // Optional: prompt user
          }
        } else {
           console.log('[NewCampaign] No brands found for user:', user.id);
           setError('No brand found for your account. Please create or associate a brand first.');
        }
        setLoading(false);
      } else {
        console.log('[NewCampaign] fetchUserBrands: No user object available yet.');
      }
    };
    fetchUserBrands();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'budget_numeric' ? (value === '' ? null : parseFloat(value)) : value,
    }));
  };

  const handleGoalsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        goals_json: {
            ...prev.goals_json,
            [name]: name === 'kpis' ? value.split(',').map(k => k.trim()) : value
        }
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!brandId) {
      setError('Please select a brand for this campaign, or ensure one is associated with your account.');
      return;
    }
    setLoading(true);
    setError(null);

    const campaignDataToSave: Omit<CampaignInsert, 'id' | 'created_at' | 'updated_at'> = {
      ...formData,
      brand_id: brandId,
      status: 'draft', // This will now be correctly typed by CampaignInsert
      // Ensure all non-nullable fields in CampaignInsert without defaults are present
      // or make them nullable in the form data / NewCampaignData type if appropriate.
      // `name` is required and present in formData.
      // `brand_id` is required and added.
      // `currency` has a default in formData and DB.
      // `status` has a default in DB, but good to set explicitly.
    };

    const { error: insertError } = await supabase
      .from('campaigns')
      .insert(campaignDataToSave); // Removed the array wrapper if inserting single object

    setLoading(false);
    if (insertError) {
      console.error('Error creating campaign:', insertError);
      setError(`Failed to create campaign: ${insertError.message}`);
    } else {
      navigate('/'); // Navigate back to campaigns list on success
    }
  };

  if (!user) return <p>Please log in to create a campaign.</p>;
  if (error && userBrands.length === 0 && !loading) {
    // If brand fetching failed initially, show a more prominent error.
    return (
        <Card className="max-w-2xl mx-auto mt-10">
            <CardHeader>
                <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-danger-500">{error}</p>
                <Button onClick={() => navigate('/')} className="mt-4">Go Back</Button>
            </CardContent>
        </Card>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Create New Campaign</CardTitle>
          <CardDescription>Fill in the details for your new marketing campaign.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {userBrands.length > 1 && !brandId && (
                <p className="text-sm text-warning-500">Please select a brand below to associate with this campaign.</p>
            )}
            {userBrands.length > 1 && (
              <div className="mb-6">
                <Label htmlFor="brand_id_select">Associate with Brand</Label>
                <select 
                  id="brand_id_select" 
                  value={brandId || ''} 
                  onChange={(e) => setBrandId(e.target.value || null)}
                  className="w-full p-2 border border-input rounded-md mt-1"
                  disabled={loading}
                >
                  <option value="">-- Select a Brand --</option>
                  {userBrands.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <Label htmlFor="name">Campaign Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="brief">Brief / Description</Label>
              <Textarea id="brief" name="brief" value={formData.brief} onChange={handleChange} rows={4} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="budget_numeric">Budget</Label>
                <Input id="budget_numeric" name="budget_numeric" type="number" value={formData.budget_numeric ?? ''} onChange={handleChange} placeholder="e.g., 5000" />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" name="currency" value={formData.currency} onChange={handleChange} placeholder="e.g., USD" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input id="start_date" name="start_date" type="date" value={formData.start_date} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Input id="end_date" name="end_date" type="date" value={formData.end_date} onChange={handleChange} />
              </div>
            </div>
            <div>
              <Label htmlFor="objective">Campaign Objective</Label>
              <Input id="objective" name="objective" value={formData.goals_json?.objective || ''} onChange={handleGoalsChange} placeholder="e.g., Brand Awareness, Lead Generation" />
            </div>
            <div>
              <Label htmlFor="kpis">Key KPIs (comma-separated)</Label>
              <Input id="kpis" name="kpis" value={formData.goals_json?.kpis?.join(', ') || ''} onChange={handleGoalsChange} placeholder="e.g., Reach, Impressions, Conversions" />
            </div>

            {error && <p className="text-sm text-danger-500">{error}</p>}

            <Button type="submit" disabled={loading || !brandId} className="w-full bg-primary-500 hover:bg-primary-600">
              {loading ? 'Creating Campaign...' : 'Create Campaign'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewCampaign; 