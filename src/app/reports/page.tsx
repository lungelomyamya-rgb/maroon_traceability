'use client';

import { Card } from '@/components/ui/card';
import { PageTitle } from '@/components/ui/typography';
import { BarChart, Filter, Download, FileText } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageTitle className="mb-8">Reports</PageTitle>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <BarChart className="h-8 w-8 text-primary" />
              <h3 className="text-lg font-semibold">Analytics Reports</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              View comprehensive analytics and performance metrics
            </p>
            <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
              View Analytics
            </button>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Filter className="h-8 w-8 text-secondary" />
              <h3 className="text-lg font-semibold">Filter Reports</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Filter and export custom reports based on various criteria
            </p>
            <button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 px-4 py-2 rounded-md">
              Create Filter
            </button>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Download className="h-8 w-8 text-accent" />
              <h3 className="text-lg font-semibold">Export Data</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Export blockchain data and reports in various formats
            </p>
            <button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 px-4 py-2 rounded-md">
              Export Data
            </button>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="h-8 w-8 text-warning" />
              <h3 className="text-lg font-semibold">Compliance Reports</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Generate compliance and audit reports for regulatory requirements
            </p>
            <button className="w-full bg-warning text-warning-foreground hover:bg-warning/90 px-4 py-2 rounded-md">
              Generate Report
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}
