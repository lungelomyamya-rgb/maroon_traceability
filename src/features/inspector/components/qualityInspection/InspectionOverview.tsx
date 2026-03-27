// src/components/inspector/qualityInspection/InspectionOverview.tsx
'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  AlertTriangle, 
  Camera, 
  TrendingUp,
  TrendingDown,
  Eye,
  Download,
  FileText
} from 'lucide-react';
import type { Grade, InspectionPhoto } from '@/types/inspector';
import type { QualityInspectionComputed } from './hooks/useQualityInspection';

interface InspectionOverviewProps {
  suggestedGrade: Grade | null;
  computed: QualityInspectionComputed;
  photos: InspectionPhoto[];
  getGradeColor: (grade: Grade) => string;
  onViewPhoto: (photo: InspectionPhoto) => void;
  onExportReport: () => void;
}

export function InspectionOverview({ 
  suggestedGrade, 
  computed, 
  photos, 
  getGradeColor, 
  onViewPhoto, 
  onExportReport 
}: InspectionOverviewProps) {
  const { gradeMetrics, inspectionStats } = computed;

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case 'excellent': return { icon: TrendingUp, color: 'text-green-600' };
      case 'good': return { icon: CheckCircle, color: 'text-blue-600' };
      case 'fair': return { icon: AlertTriangle, color: 'text-yellow-600' };
      default: return { icon: TrendingDown, color: 'text-red-600' };
    }
  };

  const QualityIcon = getQualityIcon(inspectionStats.overallQuality).icon;
  const qualityColor = getQualityIcon(inspectionStats.overallQuality).color;

  return (
    <div className="space-y-6">
      {/* Grade Display */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Inspection Grade</h3>
              <p className="text-sm text-gray-500">Automatically calculated based on quality metrics</p>
            </div>
          </div>
          {suggestedGrade && (
            <Badge className={`${getGradeColor(suggestedGrade)} text-lg px-4 py-2`}>
              Grade {suggestedGrade}
            </Badge>
          )}
        </div>
      </Card>

      {/* Quality Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Moisture Score</span>
            <span className="text-sm text-gray-500">{gradeMetrics.moistureScore.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${gradeMetrics.moistureScore}%` }}
            />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Firmness Score</span>
            <span className="text-sm text-gray-500">{gradeMetrics.firmnessScore.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${gradeMetrics.firmnessScore}%` }}
            />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Sugar Score</span>
            <span className="text-sm text-gray-500">{gradeMetrics.sugarScore.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-yellow-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${gradeMetrics.sugarScore}%` }}
            />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Size Score</span>
            <span className="text-sm text-gray-500">{gradeMetrics.sizeScore.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${gradeMetrics.sizeScore}%` }}
            />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Safety Score</span>
            <span className="text-sm text-gray-500">{gradeMetrics.safetyScore.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-red-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${gradeMetrics.safetyScore}%` }}
            />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-600">Overall Quality</span>
              <div className="flex items-center gap-2 mt-1">
                <QualityIcon className={`h-4 w-4 ${qualityColor}`} />
                <span className={`text-sm font-medium capitalize ${qualityColor}`}>
                  {inspectionStats.overallQuality}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Inspection Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Camera className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Photos</p>
              <p className="text-lg font-semibold text-gray-900">{inspectionStats.totalPhotos}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Defects</p>
              <p className="text-lg font-semibold text-gray-900">{inspectionStats.totalDefects}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Recommendations</p>
              <p className="text-lg font-semibold text-gray-900">{inspectionStats.totalRecommendations}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Photo Gallery */}
      {photos.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-semibold text-gray-900">Inspection Photos</h4>
            <Button variant="outline" size="sm" onClick={onExportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {photos.slice(0, 12).map((photo) => (
              <div key={photo.id} className="relative group cursor-pointer" onClick={() => onViewPhoto(photo)}>
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity rounded-lg flex items-center justify-center">
                  <Eye className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-gray-500 mt-1 truncate">{photo.caption}</p>
              </div>
            ))}
            {photos.length > 12 && (
              <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
                <span className="text-sm text-gray-500">+{photos.length - 12} more</span>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
