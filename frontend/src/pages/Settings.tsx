import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Settings as SettingsIcon, Save, Bell, Shield, Building } from 'lucide-react';

export const Settings: React.FC = () => {
  const [profileName, setProfileName] = useState('Jane Doe');
  const [profileEmail, setProfileEmail] = useState('jane.doe@ecosphere.com');
  const [companyIndustry, setCompanyIndustry] = useState('technology');

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center space-x-2">
          <SettingsIcon className="h-8 w-8 text-muted-foreground shrink-0" />
          <span>Platform Settings</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Configure platform options, manage notification settings, and set corporate industry disclosures.
        </p>
      </div>

      {/* Grid for settings areas */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Navigation Sidebar */}
        <div className="space-y-3">
          <Card className="p-2 space-y-1">
            <button className="flex items-center space-x-2.5 w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold bg-primary text-white">
              <Building className="h-4.5 w-4.5" />
              <span>Corporate Profile</span>
            </button>
            <button className="flex items-center space-x-2.5 w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="h-4.5 w-4.5" />
              <span>Notifications Settings</span>
            </button>
            <button className="flex items-center space-x-2.5 w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
              <Shield className="h-4.5 w-4.5" />
              <span>Access & Roles</span>
            </button>
          </Card>
        </div>

        {/* Main Settings Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Corporate Profile Settings</CardTitle>
            <CardDescription>Configure base settings used to compute ESG reports.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Full Name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
              />
              <Input
                label="Corporate Email"
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
              />
            </div>

            <Select
              label="Primary Reporting Industry"
              value={companyIndustry}
              onChange={(e) => setCompanyIndustry(e.target.value)}
              options={[
                { value: 'technology', label: 'Technology, Software & Services' },
                { value: 'energy', label: 'Energy, Utilities & Mining' },
                { value: 'finance', label: 'Financial Services & Insurance' },
                { value: 'manufacturing', label: 'Industrial Manufacturing' },
              ]}
            />

            <div className="flex items-center justify-between p-3.5 border border-border rounded-lg bg-muted/30">
              <div>
                <h4 className="text-sm font-semibold">Strict Audit Ledger Logs</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Require third-party auditor signatures for all transaction revisions.</p>
              </div>
              <Badge variant="primary">Active</Badge>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2.5">
            <Button variant="outline">Discard</Button>
            <Button className="inline-flex items-center space-x-1.5">
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
export default Settings;
