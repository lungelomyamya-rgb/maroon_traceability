// src/app/verification-pending/page.tsx
'use client';

import { CheckCircle, Clock, Mail, RefreshCw, AlertCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRegistration } from '@/src/features/registration/hooks/useRegistration';

export default function VerificationPendingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { sendVerificationEmail, isLoading, error } = useRegistration();

  const [email] = useState(searchParams?.get('email') || '');
  const [role] = useState(searchParams?.get('role') || '');
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState('');

  const handleEmailVerification = useCallback(async (_token: string) => {
    // This would verify the email token
    // For now, we'll just show a success message and redirect to role dashboard
    if (role) {
      router.push(`/${role}`);
    } else {
      // Fallback to login if role is not available
      router.push('/login?verified=true');
    }
  }, [router, role]);

  // Handle email verification from URL params
  useEffect(() => {
    const _token = searchParams?.get('token');
    if (_token) {
      // Handle email verification
      handleEmailVerification(_token);
    }
  }, [searchParams, handleEmailVerification]);

  const handleResendEmail = async () => {
    if (!email) {
      setResendError('Email address not found');
      return;
    }

    setIsResending(true);
    setResendError('');
    setResendSuccess(false);

    try {
      const success = await sendVerificationEmail(email);
      if (success) {
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 5000);
      } else {
        setResendError('Failed to resend verification email');
      }
    } catch (_err) {
      setResendError('An error occurred while resending the email');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <Mail className="h-8 w-8 text-primary" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight">Verify Your Email</h1>

        <p className="text-muted-foreground">
          We've sent a verification email to <strong>{email || 'your email address'}</strong>.
          Please check your inbox and click the verification link to complete your registration.
        </p>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Resend Success */}
        {resendSuccess && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-sm text-green-800">Verification email sent successfully!</p>
          </div>
        )}

        {/* Resend Error */}
        {resendError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-800">{resendError}</p>
          </div>
        )}

        <Card className="p-6 mt-8 text-left space-y-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium">What&apos;s Next?</h3>
              <p className="mt-2 text-muted-foreground">
                1. Check your email inbox for the verification message
              </p>
              <p className="text-muted-foreground">
                2. Click the verification link in the email
              </p>
              <p className="text-muted-foreground">
                3. You'll be redirected to complete your registration
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 pt-2">
            <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Didn&apos;t receive the email?</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Check your spam folder or click below to resend the verification email.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResendEmail}
                disabled={isResending || isLoading}
                className="text-xs"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                    Resending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Resend Email
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-start space-x-3 pt-2">
            <Clock className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Important</h3>
              <p className="text-sm text-muted-foreground">
                The verification link expires in 24 hours. If you don't verify your email within this time,
                you'll need to register again.
              </p>
            </div>
          </div>
        </Card>

        <div className="pt-6 space-y-3">
          <Button onClick={() => router.push('/login')}>
            Go to Login
          </Button>
          <Button variant="outline" onClick={() => router.push('/get-started')}>
            Back to Registration
          </Button>
        </div>
      </div>
    </div>
  );
}
