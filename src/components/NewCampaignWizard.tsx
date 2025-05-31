
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface NewCampaignWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const STEPS = [
  'Brief',
  'Targets',
  'Budget & Timeline',
  'Review'
];

const NewCampaignWizard = ({ isOpen, onClose, onComplete }: NewCampaignWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    objective: '',
    description: '',
    countries: [] as string[],
    platforms: [] as string[],
    ageRange: [18, 65],
    budget: '',
    startDate: '',
    endDate: ''
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const Stepper = () => (
    <div className="w-full bg-accent-gradient p-6 rounded-t-default">
      <div className="flex items-center justify-between mb-2">
        {STEPS.map((step, index) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-caption font-semibold ${
              index <= currentStep ? 'bg-white text-primary-500' : 'bg-white/30 text-white'
            }`}>
              {index + 1}
            </div>
            {index < STEPS.length - 1 && (
              <div className={`h-0.5 w-16 mx-2 ${
                index < currentStep ? 'bg-white' : 'bg-white/30'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="text-center">
        <h2 className="text-heading text-white font-semibold">{STEPS[currentStep]}</h2>
        <p className="text-caption text-white/80">Step {currentStep + 1} of {STEPS.length}</p>
      </div>
    </div>
  );

  const BriefStep = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="name" className="text-primary mb-2 block">Campaign Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => updateFormData('name', e.target.value)}
          placeholder="Enter campaign name"
          className="bg-surface-elevated border-subtle"
        />
      </div>
      <div>
        <Label htmlFor="objective" className="text-primary mb-2 block">Objective</Label>
        <Input
          id="objective"
          value={formData.objective}
          onChange={(e) => updateFormData('objective', e.target.value)}
          placeholder="Brand awareness, sales, etc."
          className="bg-surface-elevated border-subtle"
        />
      </div>
      <div>
        <Label htmlFor="description" className="text-primary mb-2 block">Description</Label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => updateFormData('description', e.target.value)}
          placeholder="Describe your campaign goals and requirements"
          className="w-full h-24 px-3 py-2 bg-surface-elevated border border-subtle rounded-default text-primary resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
    </div>
  );

  const TargetsStep = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-primary mb-3 block">Countries</Label>
        <div className="flex flex-wrap gap-2">
          {['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany'].map((country) => (
            <button
              key={country}
              onClick={() => {
                const isSelected = formData.countries.includes(country);
                updateFormData('countries', 
                  isSelected 
                    ? formData.countries.filter(c => c !== country)
                    : [...formData.countries, country]
                );
              }}
              className={`px-3 py-2 rounded-default text-caption transition-colors ${
                formData.countries.includes(country)
                  ? 'bg-primary-500 text-white'
                  : 'bg-surface-elevated text-secondary hover:bg-surface-hover'
              }`}
            >
              {country}
            </button>
          ))}
        </div>
      </div>
      <div>
        <Label className="text-primary mb-3 block">Platforms</Label>
        <div className="flex flex-wrap gap-2">
          {['Instagram', 'TikTok', 'YouTube', 'Twitter', 'LinkedIn'].map((platform) => (
            <button
              key={platform}
              onClick={() => {
                const isSelected = formData.platforms.includes(platform);
                updateFormData('platforms', 
                  isSelected 
                    ? formData.platforms.filter(p => p !== platform)
                    : [...formData.platforms, platform]
                );
              }}
              className={`px-3 py-2 rounded-default text-caption transition-colors ${
                formData.platforms.includes(platform)
                  ? 'bg-primary-500 text-white'
                  : 'bg-surface-elevated text-secondary hover:bg-surface-hover'
              }`}
            >
              {platform}
            </button>
          ))}
        </div>
      </div>
      <div>
        <Label className="text-primary mb-3 block">Age Range: {formData.ageRange[0]} - {formData.ageRange[1]}</Label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="13"
            max="65"
            value={formData.ageRange[0]}
            onChange={(e) => updateFormData('ageRange', [parseInt(e.target.value), formData.ageRange[1]])}
            className="flex-1"
          />
          <input
            type="range"
            min="13"
            max="65"
            value={formData.ageRange[1]}
            onChange={(e) => updateFormData('ageRange', [formData.ageRange[0], parseInt(e.target.value)])}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );

  const BudgetTimelineStep = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="budget" className="text-primary mb-2 block">Campaign Budget (USD)</Label>
        <Input
          id="budget"
          type="number"
          value={formData.budget}
          onChange={(e) => updateFormData('budget', e.target.value)}
          placeholder="10000"
          className="bg-surface-elevated border-subtle"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate" className="text-primary mb-2 block">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => updateFormData('startDate', e.target.value)}
            className="bg-surface-elevated border-subtle"
          />
        </div>
        <div>
          <Label htmlFor="endDate" className="text-primary mb-2 block">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => updateFormData('endDate', e.target.value)}
            className="bg-surface-elevated border-subtle"
          />
        </div>
      </div>
    </div>
  );

  const ReviewStep = () => (
    <Card className="bg-surface-elevated border-subtle">
      <CardContent className="p-6 space-y-4">
        <h3 className="text-subhead text-primary font-semibold">Campaign Summary</h3>
        <div className="space-y-3">
          <div><span className="text-secondary">Name:</span> <span className="text-primary">{formData.name || 'Not specified'}</span></div>
          <div><span className="text-secondary">Objective:</span> <span className="text-primary">{formData.objective || 'Not specified'}</span></div>
          <div><span className="text-secondary">Countries:</span> <span className="text-primary">{formData.countries.join(', ') || 'None selected'}</span></div>
          <div><span className="text-secondary">Platforms:</span> <span className="text-primary">{formData.platforms.join(', ') || 'None selected'}</span></div>
          <div><span className="text-secondary">Age Range:</span> <span className="text-primary">{formData.ageRange[0]} - {formData.ageRange[1]}</span></div>
          <div><span className="text-secondary">Budget:</span> <span className="text-primary">${formData.budget || '0'}</span></div>
          <div><span className="text-secondary">Timeline:</span> <span className="text-primary">{formData.startDate} to {formData.endDate}</span></div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return <BriefStep />;
      case 1: return <TargetsStep />;
      case 2: return <BudgetTimelineStep />;
      case 3: return <ReviewStep />;
      default: return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 bg-surface-elevated border-subtle">
        <Stepper />
        <div className="p-6">
          {renderStepContent()}
          <div className="flex justify-between mt-8">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="text-secondary hover:text-primary"
            >
              <ChevronLeft size={16} className="mr-2" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="bg-primary-500 hover:bg-primary-600 text-white"
            >
              {currentStep === STEPS.length - 1 ? 'Create Campaign' : 'Next'}
              {currentStep < STEPS.length - 1 && <ChevronRight size={16} className="ml-2" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewCampaignWizard;
