
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Upload, Plus, Trash2, CreditCard } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Wilson',
    email: 'sarah@company.com',
    role: 'Admin',
    avatar: 'SW'
  },
  {
    id: '2',
    name: 'Mike Johnson',
    email: 'mike@company.com',
    role: 'Manager',
    avatar: 'MJ'
  },
  {
    id: '3',
    name: 'Emma Davis',
    email: 'emma@company.com',
    role: 'Member',
    avatar: 'ED'
  }
];

const Settings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    slack: false,
    sms: true
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display text-primary font-semibold">Settings</h1>
          <p className="text-body text-secondary">Manage your account preferences and team</p>
        </div>
      </div>

      {/* Settings Tabs */}
      <Card className="bg-surface-elevated border border-subtle shadow-card">
        <Tabs defaultValue="organisation" className="w-full">
          <div className="border-b border-subtle px-6 pt-6">
            <TabsList className="bg-surface-hover">
              <TabsTrigger value="organisation" className="data-[state=active]:bg-primary-500 data-[state=active]:text-white">
                Organisation
              </TabsTrigger>
              <TabsTrigger value="team" className="data-[state=active]:bg-primary-500 data-[state=active]:text-white">
                Team
              </TabsTrigger>
              <TabsTrigger value="billing" className="data-[state=active]:bg-primary-500 data-[state=active]:text-white">
                Billing
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-primary-500 data-[state=active]:text-white">
                Notifications
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="organisation" className="p-6 space-y-6">
            <div>
              <h3 className="text-subhead text-primary mb-4">Organisation Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-label text-secondary block mb-2">Company Name</label>
                  <input 
                    type="text" 
                    defaultValue="InfluencerFlow AI" 
                    className="w-full px-4 py-3 bg-surface-hover border border-subtle rounded-lg text-body text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-label text-secondary block mb-2">Company Logo</label>
                  <div className="border-2 border-dashed border-subtle rounded-lg p-8 text-center">
                    <Upload size={32} className="mx-auto text-secondary mb-2" />
                    <p className="text-body text-secondary mb-2">Drop logo here or click to upload</p>
                    <p className="text-caption text-secondary">PNG, JPG up to 2MB</p>
                    <Button variant="outline" className="mt-4 border-subtle hover:bg-surface-hover focus-ring">
                      Choose File
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="team" className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-subhead text-primary">Team Members</h3>
              <Button className="bg-primary-500 hover:bg-primary-600 text-white button-press focus-ring">
                <Plus size={16} className="mr-2" />
                Invite
              </Button>
            </div>
            
            <div className="space-y-3">
              {mockTeamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 bg-surface-hover rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white text-caption font-semibold">
                      {member.avatar}
                    </div>
                    <div>
                      <p className="text-body text-primary font-medium">{member.name}</p>
                      <p className="text-caption text-secondary">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <select className="px-3 py-2 bg-surface-elevated border border-subtle rounded text-caption text-primary focus:ring-2 focus:ring-primary-500">
                      <option value="admin" selected={member.role === 'Admin'}>Admin</option>
                      <option value="manager" selected={member.role === 'Manager'}>Manager</option>
                      <option value="member" selected={member.role === 'Member'}>Member</option>
                    </select>
                    <Button variant="ghost" size="sm" className="text-danger-500 hover:bg-red-900/20 focus-ring">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="billing" className="p-6 space-y-6">
            <div>
              <h3 className="text-subhead text-primary mb-4">Payment Methods</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-surface-hover rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard size={20} className="text-secondary" />
                    <div>
                      <p className="text-body text-primary">•••• •••• •••• 4242</p>
                      <p className="text-caption text-secondary">Expires 12/26</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-secondary hover:text-primary focus-ring">
                    Edit
                  </Button>
                </div>
              </div>
              <Button variant="outline" className="border-subtle hover:bg-surface-hover focus-ring">
                <Plus size={16} className="mr-2" />
                Add Payment Method
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-label text-secondary block mb-2">Billing Email</label>
                <input 
                  type="email" 
                  defaultValue="billing@company.com" 
                  className="w-full px-4 py-3 bg-surface-hover border border-subtle rounded-lg text-body text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-label text-secondary block mb-2">GST Number (Optional)</label>
                <input 
                  type="text" 
                  placeholder="Enter GST number" 
                  className="w-full px-4 py-3 bg-surface-hover border border-subtle rounded-lg text-body text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="p-6 space-y-6">
            <div>
              <h3 className="text-subhead text-primary mb-4">Notification Preferences</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-body text-primary font-medium">Email Notifications</p>
                    <p className="text-caption text-secondary">Receive updates via email</p>
                  </div>
                  <Switch 
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-body text-primary font-medium">Slack Notifications</p>
                    <p className="text-caption text-secondary">Get notified in Slack channels</p>
                  </div>
                  <Switch 
                    checked={notifications.slack}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, slack: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-body text-primary font-medium">SMS Notifications</p>
                    <p className="text-caption text-secondary">Receive urgent alerts via SMS</p>
                  </div>
                  <Switch 
                    checked={notifications.sms}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Settings;
