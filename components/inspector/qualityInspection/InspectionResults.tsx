// src/components/inspector/qualityInspection/InspectionResults.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Download, 
  Eye, 
  Camera,
  FileText,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import type { Grade, InspectionPhoto } from '@/types/inspector';
import type { QualityInspectionFormData, QualityInspectionComputed } from './hooks/useQualityInspection';

interface InspectionResultsProps {
  selectedPhoto: InspectionPhoto | null;
  inspectionData: QualityInspectionFormData | null;
  computed: QualityInspectionComputed;
  suggestedGrade: Grade | null;
  getGradeColor: (grade: Grade) => string;
  getDefectSeverity: (defect: string) => 'low' | 'medium' | 'high';
  onClosePhoto: () => void;
  onExportReport: () => void;
}

export function InspectionResults({
  selectedPhoto,
  inspectionData,
  computed,
  suggestedGrade,
  getGradeColor,
  getDefectSeverity,
  onClosePhoto,
  onExportReport
}: InspectionResultsProps) {
  const [showFullReport, setShowFullReport] = useState(false);

  const getDefectSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'high': return 'bg-red-100 text-red-800';
    }
  };

  const generateReport = () => {
    if (!inspectionData) return null;

    return {
      grade: suggestedGrade,
      metrics: {
        moisture: `${inspectionData.moistureContent}%`,
        size: inspectionData.size,
        color: inspectionData.color,
        firmness: `${inspectionData.firmness}/10`,
        sugar: `${inspectionData.sugarContent}% Brix`,
        weight: `${inspectionData.weight}g`,
        temperature: `${inspectionData.temperature}°C`,
        pesticide: `${inspectionData.pesticideResidue} mg/kg`,
        microbial: `${inspectionData.microbialCount} CFU/g`
      },
      defects: inspectionData.defects || [],
      recommendations: inspectionData.recommendations || [],
      notes: inspectionData.notes || '',
      timestamp: new Date().toISOString()
    };
  };

  const report = generateReport();

  if (selectedPhoto) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="text-lg font-semibold">{selectedPhoto.caption}</h3>
            <Button variant="outline" size="sm" onClick={onClosePhoto}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-4">
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.caption}
              className="w-full h-auto max-h-[70vh] object-contain"
            />
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Category: {selectedPhoto.category}</p>
                <p className="text-sm text-gray-600">Uploaded: {new Date(selectedPhoto.uploadedAt).toLocaleString()}</p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Inspection Results</h3>
            <p className="text-sm text-gray-500">Comprehensive quality assessment report</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowFullReport(!showFullReport)}>
              <FileText className="h-4 w-4 mr-2" />
              {showFullReport ? 'Hide' : 'Show'} Full Report
            </Button>
            <Button variant="outline" size="sm" onClick={onExportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Grade Display */}
        {suggestedGrade && (
          <div className="flex items-center justify-center mb-6">
            <div className="text-center">
              <Badge className={`${getGradeColor(suggestedGrade)} text-2xl px-6 py-3 mb-2`}>
                Grade {suggestedGrade}
              </Badge>
              <p className="text-sm text-gray-600">Final Quality Grade</p>
            </div>
          </div>
        )}

        {/* Quality Scores */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {Object.entries(computed.gradeMetrics).map(([metric, score]) => (
            <div key={metric} className="text-center">
              <div className="text-sm text-gray-600 capitalize mb-1">{metric.replace(/([A-Z])/g, ' $1').trim()}</div>
              <div className="text-lg font-semibold">{score.toFixed(0)}%</div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Camera className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Photos</p>
              <p className="font-semibold">{computed.inspectionStats.totalPhotos}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-sm text-gray-600">Defects</p>
              <p className="font-semibold">{computed.inspectionStats.totalDefects}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Recommendations</p>
              <p className="font-semibold">{computed.inspectionStats.totalRecommendations}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Full Report */}
      {showFullReport && (
        <Card className="p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Detailed Report</h4>
          
          {/* Metrics Table */}
          <div className="mb-6">
            <h5 className="text-sm font-medium text-gray-700 mb-3">Quality Metrics</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(report.metrics).map(([key, value]) => (
                <div key={key} className="flex justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium capitalize">{key}:</span>
                  <span className="text-sm">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Defects */}
          {report.defects.length > 0 && (
            <div className="mb-6">
              <h5 className="text-sm font-medium text-gray-700 mb-3">Identified Defects</h5>
              <div className="flex flex-wrap gap-2">
                {report.defects.map((defect, index) => {
                  const severity = getDefectSeverity(defect);
                  return (
                    <Badge
                      key={index}
                      className={`${getDefectSeverityColor(severity)}`}
                    >
                      {defect}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {report.recommendations.length > 0 && (
            <div className="mb-6">
              <h5 className="text-sm font-medium text-gray-700 mb-3">Recommendations</h5>
              <ul className="space-y-2">
                {report.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Notes */}
          {report.notes && (
            <div className="mb-6">
              <h5 className="text-sm font-medium text-gray-700 mb-3">Additional Notes</h5>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{report.notes}</p>
            </div>
          )}

          {/* Report Metadata */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Generated: {new Date(report.timestamp).toLocaleString()}</span>
              <span>Report ID: {report.timestamp.replace(/[:.]/g, '-')}</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
