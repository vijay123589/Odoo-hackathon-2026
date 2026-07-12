import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Bell, Shield, Building, Key } from 'lucide-react';

type TabType = 'profile' | 'notifications' | 'security' | 'api';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [profileName, setProfileName] = useState('Jane Doe');
  const [profileEmail, setProfileEmail] = useState('jane.doe@ecosphere.com');
  const [companyIndustry, setCompanyIndustry] = useState('technology');

  const tabs = [
    { id: 'profile' as TabType, label: 'Corporate Profile', icon: Building, desc: 'ESG organization context' },
    { id: 'notifications' as TabType, label: 'Notifications', icon: Bell, desc: 'Alert channels & triggers' },
    { id: 'security' as TabType, label: 'Security & Access', icon: Shield, desc: 'Roles and audit signatures' },
    { id: 'api' as TabType, label: 'API & Integrations', icon: Key, desc: 'Webhooks and query tokens' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground/90">
          Platform Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Configure organization contexts, set notification triggers, and audit compliance signatures.
        </p>
      </div>

      {/* Grid layout */}
      <div className="grid gap-6 md:grid-cols-3 items-start">
        {/* Left Column: Settings Navigation List */}
        <div className="md:col-span-1 space-y-3">
          <Card className="p-2 space-y-1 bg-card border border-border/50 shadow-[0_4px_20px_-4px_rgba(28,38,30,0.01)]">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-start space-x-3 w-full text-left p-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/8 text-primary border border-primary/10'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground border border-transparent'
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="text-xs font-bold block">{tab.label}</span>
                    <span className={`text-[9px] block mt-0.5 ${isActive ? 'text-primary/70' : 'text-muted-foreground/60'}`}>{tab.desc}</span>
                  </div>
                </button>
              );
            })}
          </Card>
        </div>

        {/* Right Column: Settings Tab Workspace */}
        <div className="md:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeTab === 'profile' && (
                <Card className="shadow-[0_12px_36px_-6px_rgba(28,38,30,0.03)] border border-border/50">
                  <CardHeader>
                    <CardTitle>Corporate Profile Settings</CardTitle>
                    <CardDescription>Configure reporting details used to compile disclosures.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        label="Executive Contact"
                        value={profileName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfileName(e.target.value)}
                      />
                      <Input
                        label="Reporting Email"
                        type="email"
                        value={profileEmail}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfileEmail(e.target.value)}
                      />
                    </div>

                    <Select
                      label="Primary Disclosing Industry"
                      value={companyIndustry}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCompanyIndustry(e.target.value)}
                      options={[
                        { value: 'technology', label: 'Technology, Software & Services' },
                        { value: 'energy', label: 'Energy, Utilities & Mining' },
                        { value: 'finance', label: 'Financial Services & Insurance' },
                        { value: 'manufacturing', label: 'Industrial Manufacturing' },
                      ]}
                    />

                    <div className="flex items-center justify-between p-3.5 border border-border/40 rounded-xl bg-muted/20">
                      <div>
                        <h4 className="text-xs font-bold text-foreground/80 leading-none mb-1">Strict Compliance Audit</h4>
                        <p className="text-[10px] text-muted-foreground">Log modifications to Scope 1 & 2 carbon records with cryptographic stamps.</p>
                      </div>
                      <Badge variant="primary">Active</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2.5 pt-2">
                    <Button variant="outline">Discard</Button>
                    <Button className="inline-flex items-center space-x-1.5 h-10 shadow-sm">
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {activeTab === 'notifications' && (
                <Card className="shadow-[0_12px_36px_-6px_rgba(28,38,30,0.03)] border border-border/50">
                  <CardHeader>
                    <CardTitle>Notification Triggers</CardTitle>
                    <CardDescription>Determine alert channels for emissions thresholds or auditing updates.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3.5 border border-border/40 rounded-xl bg-card">
                        <div>
                          <h4 className="text-xs font-bold text-foreground/80 leading-none mb-1">Weekly Digest Emails</h4>
                          <span className="text-[9px] text-muted-foreground">Receive weekly digests summarizing audit logs and volunteering targets.</span>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded border-border text-primary focus:ring-primary/30 h-4.5 w-4.5" />
                      </div>

                      <div className="flex justify-between items-center p-3.5 border border-border/40 rounded-xl bg-card">
                        <div>
                          <h4 className="text-xs font-bold text-foreground/80 leading-none mb-1">Anomalous Spike Alerts</h4>
                          <span className="text-[9px] text-muted-foreground">Get instant notifications if emissions spike more than 15% in a single month.</span>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded border-border text-primary focus:ring-primary/30 h-4.5 w-4.5" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2.5 pt-2">
                    <Button variant="outline">Discard</Button>
                    <Button className="inline-flex items-center space-x-1.5 h-10 shadow-sm">
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {activeTab === 'security' && (
                <Card className="shadow-[0_12px_36px_-6px_rgba(28,38,30,0.03)] border border-border/50">
                  <CardHeader>
                    <CardTitle>Security and Audit Posture</CardTitle>
                    <CardDescription>Configure user credential policies and third-party verification rules.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Multi-Factor Verification</label>
                      <div className="p-4 bg-muted/20 border border-border/40 rounded-xl flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground/80">Enforced for Admin Roles</span>
                        <Badge variant="success">Active</Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2.5 pt-2">
                    <Button variant="outline">Discard</Button>
                    <Button className="inline-flex items-center space-x-1.5 h-10 shadow-sm">
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {activeTab === 'api' && (
                <Card className="shadow-[0_12px_36px_-6px_rgba(28,38,30,0.03)] border border-border/50">
                  <CardHeader>
                    <CardTitle>API Tokens & Webhook Access</CardTitle>
                    <CardDescription>Integrate ESG metrics with third-party software and logistics trackers.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 bg-muted/30 border border-border/40 rounded-xl space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">Production Access Token</span>
                          <Badge variant="neutral" className="scale-90">Read-Only</Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <code className="text-xs font-semibold text-primary bg-card px-2.5 py-1.5 border border-border/55 rounded-lg flex-1 overflow-x-auto select-all">
                            es_live_6839aa92f1b0a72ccde9017fbbac
                          </code>
                          <Button variant="outline" size="sm" className="h-9">Copy</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
export default Settings;
