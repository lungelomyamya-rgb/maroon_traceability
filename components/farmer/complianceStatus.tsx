// src/components/farmer/complianceStatus.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, CheckCircle, AlertTriangle, Clock, Download, Upload, Shield } from 'lucide-react';

interface ComplianceRequirement {
  id: string;
  productId: string;
  category: 'food-safety' | 'export' | 'organic' | 'environmental' | 'labor';
  title: string;
  description: string;
  status: 'compliant' | 'pending' | 'overdue' | 'exempt';
  dueDate: string;
  lastUpdated: string;
  documents: string[];
  authority: string;
  region: string;
  severity: 'high' | 'medium' | 'low';
  actionRequired: string;
  nextAudit: string;
}

interface ComplianceStatusProps {
  products: any[];
}

export function ComplianceStatus({ products }: ComplianceStatusProps) {
  const [requirements, setRequirements] = useState<ComplianceRequirement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'All Requirements', icon: '📋' },
    { value: 'food-safety', label: 'Food Safety', icon: '🍎' },
    { value: 'export', label: 'Export Compliance', icon: '🌍' },
    { value: 'organic', label: 'Organic Certification', icon: '🌿' },
    { value: 'environmental', label: 'Environmental', icon: '🌱' },
    { value: 'labor', label: 'Labor Standards', icon: '👥' }
  ];

  useEffect(() => {
    // Mock compliance data - replace with API call
    const mockRequirements: ComplianceRequirement[] = [
      {
        id: 'comp1',
        productId: products[0]?.id || '',
        category: 'food-safety',
        title: 'HACCP Food Safety Plan',
        description: 'Annual review and update of Hazard Analysis and Critical Control Points plan',
        status: 'compliant',
        dueDate: '2025-03-15',
        lastUpdated: '2025-01-10',
        documents: ['HACCP_Plan_2025.pdf', 'Audit_Report_Q4_2024.pdf'],
        authority: 'Department of Agriculture',
        region: 'South Africa',
        severity: 'high',
        actionRequired: 'None - fully compliant',
        nextAudit: '2025-12-15'
      },
      {
        id: 'comp2',
        productId: products[0]?.id || '',
        category: 'export',
        title: 'GlobalG.A.P. Certification',
        description: 'Global Good Agricultural Practices certification for EU export markets',
        status: 'pending',
        dueDate: '2025-02-28',
        lastUpdated: '2025-01-05',
        documents: ['Application_Form.pdf'],
        authority: 'GlobalG.A.P.',
        region: 'European Union',
        severity: 'high',
        actionRequired: 'Complete audit preparation and submit documentation',
        nextAudit: '2025-03-01'
      },
      {
        id: 'comp3',
        productId: products[0]?.id || '',
        category: 'organic',
        title: 'Organic Certification Renewal',
        description: 'Annual organic certification renewal with soil testing and residue analysis',
        status: 'compliant',
        dueDate: '2025-06-30',
        lastUpdated: '2024-12-15',
        documents: ['Organic_Certificate_2024.pdf', 'Soil_Test_Results.pdf'],
        authority: 'Organic Standards Authority',
        region: 'South Africa',
        severity: 'medium',
        actionRequired: 'Schedule soil testing for Q2 2025',
        nextAudit: '2025-06-01'
      },
      {
        id: 'comp4',
        productId: products[0]?.id || '',
        category: 'environmental',
        title: 'Water Usage Permit',
        description: 'Annual water usage monitoring and reporting for irrigation systems',
        status: 'pending',
        dueDate: '2025-01-31',
        lastUpdated: '2025-01-01',
        documents: [],
        authority: 'Department of Water Affairs',
        region: 'South Africa',
        severity: 'medium',
        actionRequired: 'Submit water usage report for 2024',
        nextAudit: '2025-07-01'
      },
      {
        id: 'comp5',
        productId: products[0]?.id || '',
        category: 'labor',
        title: 'Labor Standards Compliance',
        description: 'Quarterly review of worker safety, wages, and working conditions',
        status: 'compliant',
        dueDate: '2025-03-01',
        lastUpdated: '2025-01-08',
        documents: ['Safety_Training_Records.pdf', 'Wage_Records_Q4_2024.pdf'],
        authority: 'Department of Labor',
        region: 'South Africa',
        severity: 'medium',
        actionRequired: 'Schedule Q1 safety training session',
        nextAudit: '2025-04-01'
      }
    ];

    setRequirements(mockRequirements);
  }, [products]);

  const filteredRequirements = selectedCategory === 'all' 
    ? requirements 
    : requirements.filter(req => req.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'success' as const;
      case 'pending': return 'warning' as const;
      case 'overdue': return 'destructive' as const;
      case 'exempt': return 'secondary' as const;
      default: return 'secondary' as const;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4" />;
      case 'exempt': return <Shield className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive' as const;
      case 'medium': return 'warning' as const;
      case 'low': return 'info' as const;
      default: return 'secondary' as const;
    }
  };

  const complianceScore = Math.round(
    (requirements.filter(req => req.status === 'compliant').length / requirements.length) * 100
  );

  const categoryConfig = {
    'food-safety': { label: 'Food Safety', icon: '🍎', color: 'red' },
    'export': { label: 'Export', icon: '🌍', color: 'blue' },
    'organic': { label: 'Organic', icon: '🌿', color: 'green' },
    'environmental': { label: 'Environmental', icon: '🌱', color: 'emerald' },
    'labor': { label: 'Labor', icon: '👥', color: 'purple' }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Compliance & Regulations</h2>
        <Button className="bg-green hover:bg-green-hover text-white">
          <Upload className="h-4 w-4 mr-2" />
          Upload Documents
        </Button>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Compliance Score</p>
              <p className="text-2xl font-bold text-gray-900">{complianceScore}%</p>
            </div>
          </div>
          <div className="mt-2">
            <Progress value={complianceScore} className="h-2" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">
                {requirements.filter(req => req.status === 'overdue').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {requirements.filter(req => req.status === 'pending').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Next Audit</p>
              <p className="text-2xl font-bold text-gray-900">15</p>
              <p className="text-xs text-gray-500">days</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(category => (
          <Button
            key={category.value}
            variant={selectedCategory === category.value ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category.value)}
            size="sm"
          >
            <span className="mr-1">{category.icon}</span>
            {category.label}
          </Button>
        ))}
      </div>

      {/* Requirements List */}
      <div className="space-y-4">
        {filteredRequirements.map((requirement) => {
          const config = categoryConfig[requirement.category as keyof typeof categoryConfig];
          const statusColor = getStatusColor(requirement.status);
          const severityColor = getSeverityColor(requirement.severity);
          
          return (
            <Card key={requirement.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{config?.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{requirement.title}</h3>
                    <p className="text-sm text-gray-500">{config?.label} • {requirement.authority}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={severityColor}>
                    {requirement.severity}
                  </Badge>
                  <Badge variant={statusColor}>
                    {getStatusIcon(requirement.status)}
                    <span className="ml-1">{requirement.status}</span>
                  </Badge>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{requirement.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Due Date:</span>
                  <span className="ml-2 font-medium">{requirement.dueDate}</span>
                </div>
                <div>
                  <span className="text-gray-600">Region:</span>
                  <span className="ml-2 font-medium">{requirement.region}</span>
                </div>
                <div>
                  <span className="text-gray-600">Next Audit:</span>
                  <span className="ml-2 font-medium">{requirement.nextAudit}</span>
                </div>
              </div>

              {requirement.actionRequired && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-900">Action Required</p>
                      <p className="text-sm text-yellow-700">{requirement.actionRequired}</p>
                    </div>
                  </div>
                </div>
              )}

              {requirement.documents.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Documents ({requirement.documents.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {requirement.documents.map((doc, index) => (
                      <Button key={index} variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        {doc}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-1" />
                  Upload Document
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Download Template
                </Button>
                <Button variant="outline" size="sm">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Mark Complete
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredRequirements.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Requirements Found</h3>
          <p className="text-gray-500">No compliance requirements found for the selected category.</p>
        </Card>
      )}
    </div>
  );
}
