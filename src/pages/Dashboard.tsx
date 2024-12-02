import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">MCP Manager Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Button className="w-full">Install MCP</Button>
            <Button className="w-full" variant="outline">Check Updates</Button>
            <Button className="w-full" variant="outline">Open Logs</Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">MCP Version</p>
              <p className="font-medium">1.0.0</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium text-green-600">Running</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">No recent activity</p>
          </div>
        </Card>
      </div>
    </div>
  );
}