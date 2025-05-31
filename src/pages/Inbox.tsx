
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send, Play, Check, X, MessageSquare } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Inbox = () => {
  const [selectedThread, setSelectedThread] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [threads, setThreads] = useState([
    {
      id: 1,
      creator: {
        name: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=100&h=100&fit=crop&crop=face',
        platform: 'Instagram'
      },
      lastMessage: 'Thanks for the campaign invite! I\'m interested in learning more.',
      timestamp: '2 hours ago',
      unread: true,
      hasOffer: true,
      offerStatus: 'pending'
    },
    {
      id: 2,
      creator: {
        name: 'Marcus Johnson',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        platform: 'YouTube'
      },
      lastMessage: 'I can do this for $2,500. Let me know if that works.',
      timestamp: '1 day ago',
      unread: false,
      hasOffer: true,
      offerStatus: 'countered'
    },
    {
      id: 3,
      creator: {
        name: 'Elena Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        platform: 'TikTok'
      },
      lastMessage: 'Perfect! I accept the terms. When do we start?',
      timestamp: '3 days ago',
      unread: false,
      hasOffer: true,
      offerStatus: 'accepted'
    }
  ]);

  const location = useLocation();

  useEffect(() => {
    // Handle navigation from Discovery page with invited creator
    if (location.state?.invitedCreator) {
      const invitedCreator = location.state.invitedCreator;
      const newThread = {
        id: Date.now(),
        creator: {
          name: invitedCreator.name,
          avatar: invitedCreator.avatar,
          platform: invitedCreator.platform
        },
        lastMessage: 'Campaign invitation sent',
        timestamp: 'Just now',
        unread: true,
        hasOffer: true,
        offerStatus: 'pending'
      };
      
      setThreads(prev => [newThread, ...prev]);
      setSelectedThread(newThread);
    }
  }, [location.state]);

  const messages = selectedThread ? [
    {
      id: 1,
      sender: 'brand',
      content: `Hi ${selectedThread.creator.name}! We'd love to collaborate with you on our new campaign. Are you interested?`,
      timestamp: '10:30 AM'
    },
    {
      id: 2,
      sender: 'creator',
      content: selectedThread.lastMessage,
      timestamp: '11:45 AM'
    }
  ] : [];

  const handleOfferAction = (action: 'accept' | 'counter' | 'decline') => {
    if (!selectedThread) return;
    
    const updatedThreads = threads.map(thread => 
      thread.id === selectedThread.id 
        ? { ...thread, offerStatus: action === 'accept' ? 'accepted' : action }
        : thread
    );
    setThreads(updatedThreads);
    
    const updatedThread = updatedThreads.find(t => t.id === selectedThread.id);
    setSelectedThread(updatedThread);
  };

  const OfferCard = () => {
    if (!selectedThread?.hasOffer) return null;

    return (
      <Card className="bg-surface-elevated border-subtle mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-body text-primary font-semibold">Campaign Offer</h4>
            <span className={`status-chip ${
              selectedThread.offerStatus === 'accepted' ? 'status-signed' :
              selectedThread.offerStatus === 'countered' ? 'status-sent' :
              selectedThread.offerStatus === 'declined' ? 'status-error' :
              'status-draft'
            }`}>
              {selectedThread.offerStatus}
            </span>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-caption text-secondary">Fee</span>
              <span className="text-caption text-primary">$1,500</span>
            </div>
            <div className="flex justify-between">
              <span className="text-caption text-secondary">Deliverables</span>
              <span className="text-caption text-primary">3 posts + 1 story</span>
            </div>
            <div className="flex justify-between">
              <span className="text-caption text-secondary">Timeline</span>
              <span className="text-caption text-primary">Dec 15-30</span>
            </div>
          </div>
          
          {selectedThread.offerStatus === 'pending' && (
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={() => handleOfferAction('accept')}
                className="bg-secondary-500 hover:bg-secondary-500/80 text-white flex-1"
              >
                <Check size={14} className="mr-2" />
                Accept
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleOfferAction('counter')}
                className="border-subtle text-secondary hover:text-primary flex-1"
              >
                Counter
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleOfferAction('decline')}
                className="border-subtle text-danger-500 hover:bg-danger-500 hover:text-white flex-1"
              >
                <X size={14} className="mr-2" />
                Decline
              </Button>
            </div>
          )}

          {selectedThread.offerStatus === 'accepted' && (
            <div className="text-center p-3 bg-secondary-500/20 rounded-default">
              <p className="text-caption text-secondary-500">Offer accepted! Contract will be sent shortly.</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="h-[calc(100vh-120px)] flex gap-6">
      {/* Thread List */}
      <div className="w-80 bg-surface-elevated rounded-default border border-subtle">
        <div className="p-4 border-b border-subtle">
          <h2 className="text-subhead text-primary font-semibold">Messages</h2>
        </div>
        <div className="overflow-y-auto">
          {threads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => setSelectedThread(thread)}
              className={`p-4 border-b border-subtle cursor-pointer transition-colors hover:bg-surface-hover ${
                selectedThread?.id === thread.id ? 'bg-surface-hover' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src={thread.creator.avatar} 
                    alt={thread.creator.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {thread.unread && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-body text-primary font-semibold truncate">{thread.creator.name}</h3>
                    <span className="text-caption text-secondary">{thread.timestamp}</span>
                  </div>
                  <p className="text-caption text-secondary truncate">{thread.lastMessage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-surface-elevated rounded-default border border-subtle flex flex-col">
        {selectedThread ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-subtle">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedThread.creator.avatar} 
                  alt={selectedThread.creator.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-body text-primary font-semibold">{selectedThread.creator.name}</h3>
                  <p className="text-caption text-secondary">{selectedThread.creator.platform}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              <OfferCard />
              
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'brand' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs px-4 py-2 rounded-default ${
                      message.sender === 'brand' 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-surface-hover text-primary'
                    }`}>
                      <p className="text-caption">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'brand' ? 'text-blue-100' : 'text-secondary'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Voice Note Player Stub */}
              <Card className="bg-surface-hover border-subtle mt-4">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <Button size="sm" variant="ghost" className="text-secondary hover:text-primary">
                      <Play size={16} />
                    </Button>
                    <div className="flex-1 h-1 bg-border-subtle rounded-full">
                      <div className="w-1/3 h-full bg-primary-500 rounded-full"></div>
                    </div>
                    <span className="text-caption text-secondary">0:15</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-subtle">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="bg-surface-hover border-subtle text-primary"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newMessage.trim()) {
                      // Add message logic here
                      setNewMessage('');
                    }
                  }}
                />
                <Button 
                  size="sm" 
                  className="bg-primary-500 hover:bg-primary-600 text-white"
                  disabled={!newMessage.trim()}
                >
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare size={48} className="text-secondary mx-auto mb-4" />
              <h3 className="text-subhead text-secondary">Select a conversation</h3>
              <p className="text-caption text-secondary">Choose a thread to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
