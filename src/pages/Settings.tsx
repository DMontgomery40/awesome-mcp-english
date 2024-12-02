import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Settings() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Card className="p-6 max-w-2xl">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">General Settings</h2>
            <div className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="path">Installation Path</Label>
                <Input id="path" value="/usr/local/mcp" readOnly />
              </div>
              
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="version">MCP Version</Label>
                <Input id="version" value="1.0.0" readOnly />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Advanced Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Button variant="outline">Clear Cache</Button>
                <Button variant="outline">Reset Configuration</Button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-end space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}