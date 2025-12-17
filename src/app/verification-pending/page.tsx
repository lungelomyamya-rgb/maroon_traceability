// src/app/verification-pending/page.tsx
'use client';

import { Card } from '@/components/ui/card';
import { CheckCircle, Clock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function VerificationPendingPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <Clock className="h-8 w-8 text-primary" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight">Verification in Progress</h1>
        
        <p className="text-muted-foreground">
          Thank you for submitting your verification documents. Our team is currently reviewing your information.
        </p>
        
        <Card className="p-6 mt-8 text-left space-y-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium">What&apos;s Next?</h3>
              <p className="mt-4 text-lg text-muted-foreground">
                Your account is currently being reviewed by our team. This process usually takes 1-2 business days.
              </p>
              <p className="mt-2 text-muted-foreground">
                You&apos;ll receive an email notification once your account has been verified.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 pt-2">
            <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Check Your Email</h3>
              <p className="text-sm text-muted-foreground">
                We&apos;ve sent a confirmation email with details about the verification process. Please check your inbox (and spam folder).
              </p>
            </div>
          </div>
        </Card>
        
        <div className="pt-6">
          <Button onClick={() => router.push('/')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
