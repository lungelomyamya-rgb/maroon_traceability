// src/components/inspector/qualityInspection/QualityInspection.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useQualityInspection } from './hooks/useQualityInspection';
import { InspectionOverview } from './InspectionOverview';
import { InspectionForm } from './InspectionForm';
import { InspectionResults } from './InspectionResults';
import type { QualityInspectionFormData } from './hooks/useQualityInspection';

interface QualityInspectionProps {
  productId: string;
  onSubmit: (data: QualityInspectionFormData & { photos: any[] }) => Promise<void>;
  initialData?: Partial<QualityInspectionFormData>;
}

export function QualityInspection({ productId, onSubmit, initialData }: QualityInspectionProps) {
  const [showResults, setShowResults] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [submittedData, setSubmittedData] = useState<QualityInspectionFormData | null>(null);

  const {
    register,
    handleSubmit,
    errors,
    watch,
    setValue,
    setError,
    clearErrors,
    fileInputRef,
    isSubmitting,
    photos,
    newDefect,
    newRecommendation,
    suggestedGrade,
    watchedValues,
    computed,
    addDefect,
    removeDefect,
    addRecommendation,
    removeRecommendation,
    handlePhotoUpload,
    removePhoto,
    handleFormSubmit,
    setNewDefect,
    setNewRecommendation,
    getGradeColor,
    getDefectSeverity
  } = useQualityInspection(productId, onSubmit, initialData);

  const onFormSubmit = async (data: QualityInspectionFormData) => {
    await handleFormSubmit(data);
    setSubmittedData(data);
    setShowResults(true);
  };

  const onViewPhoto = (photo: any) => {
    setSelectedPhoto(photo);
  };

  const onClosePhoto = () => {
    setSelectedPhoto(null);
  };

  const onExportReport = () => {
    // Generate and download PDF report
    console.log('Exporting report...');
  };

  const onBackToForm = () => {
    setShowResults(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Quality Inspection</h2>
            <p className="text-gray-600">Comprehensive quality assessment and grading system</p>
          </div>
          {showResults && (
            <Button variant="outline" onClick={onBackToForm}>
              Back to Form
            </Button>
          )}
        </div>
      </Card>

      {/* Overview Section - Always visible */}
      <InspectionOverview
        suggestedGrade={suggestedGrade}
        computed={computed}
        photos={photos}
        getGradeColor={getGradeColor}
        onViewPhoto={onViewPhoto}
        onExportReport={onExportReport}
      />

      {/* Form or Results */}
      {!showResults ? (
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <InspectionForm
            register={register}
            errors={errors}
            watchedValues={watchedValues}
            photos={photos}
            newDefect={newDefect}
            newRecommendation={newRecommendation}
            fileInputRef={fileInputRef}
            onAddDefect={addDefect}
            onRemoveDefect={removeDefect}
            onAddRecommendation={addRecommendation}
            onRemoveRecommendation={removeRecommendation}
            onPhotoUpload={handlePhotoUpload}
            onRemovePhoto={removePhoto}
            setNewDefect={setNewDefect}
            setNewRecommendation={setNewRecommendation}
            getDefectSeverity={getDefectSeverity}
          />

          {/* Submit Button */}
          <Card className="p-6">
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto"
              >
                {isSubmitting ? 'Submitting...' : 'Complete Inspection'}
              </Button>
            </div>
          </Card>
        </form>
      ) : (
        <InspectionResults
          selectedPhoto={selectedPhoto}
          inspectionData={submittedData}
          computed={computed}
          suggestedGrade={suggestedGrade}
          getGradeColor={getGradeColor}
          getDefectSeverity={getDefectSeverity}
          onClosePhoto={onClosePhoto}
          onExportReport={onExportReport}
        />
      )}
    </div>
  );
}
