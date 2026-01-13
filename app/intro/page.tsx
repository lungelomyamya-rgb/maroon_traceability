'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Smartphone, QrCode, TrendingUp } from 'lucide-react';

export default function IntroPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Maroon: From the Kraal to the Commercial Shelf
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
              Stop selling at "average" prices. Start selling at your true value.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg"
                onClick={() => router.push('/login')}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-4 text-lg"
                onClick={() => router.push('/viewer')}
              >
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              You have done the hard work. Now get paid what you deserve.
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              You have improved your genetics, managed your grazing, and maintained your herd's health. 
              But when it's time to sell, are you getting the price you deserve?
            </p>
            <p className="text-lg text-gray-600">
              Currently, premium buyers, retailers like Woolworths, Checkers, and export abattoirs demand 
              traceability. Without a documented history, your produce is "invisible" to the formal economy. 
              <span className="font-semibold text-orange-600"> Maroon is the bridge that makes your business visible.</span>
            </p>
          </div>
        </div>
      </div>

      {/* Solution Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Commercial Edge: Your Professional Trade Passport
            </h2>
            <p className="text-xl text-gray-600">Move from subsistence to supplier.</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <p className="text-lg text-gray-700 text-center mb-8">
              The difference between an "average" price and an "A-Grade" price is verification. 
              Maroon provides the digital infrastructure to prove your quality and compliance, 
              giving you the same competitive edge as industrial-scale operations.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            How Maroon Scales Your Farm Business:
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <Shield className="h-8 w-8 text-orange-600 mr-3" />
                <h4 className="text-xl font-semibold text-gray-900">Retail-Ready Compliance</h4>
              </div>
              <p className="text-gray-600">
                Meet the strict food safety and traceability standards required by South African 
                and international retailers.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-8 w-8 text-orange-600 mr-3" />
                <h4 className="text-xl font-semibold text-gray-900">A-Grade Pricing</h4>
              </div>
              <p className="text-gray-600">
                Provide buyers with a full record of vaccinations, feed, and biosecurity. 
                When they scan your QR code, they aren't just buying a cow—they are buying a verified asset.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <QrCode className="h-8 w-8 text-orange-600 mr-3" />
                <h4 className="text-xl font-semibold text-gray-900">Access to Finance</h4>
              </div>
              <p className="text-gray-600">
                Use your immutable production history to show banks and investors a "track record" 
                of your farm's performance, making it easier to secure growth capital.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <Smartphone className="h-8 w-8 text-orange-600 mr-3" />
                <h4 className="text-xl font-semibold text-gray-900">Precision Management</h4>
              </div>
              <p className="text-gray-600">
                Use your digital logs to track growth rates and herd health, helping you make 
                smarter business decisions to increase your margins.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Technology of Business
            </h2>
            <p className="text-xl text-orange-600 font-semibold">Smart. Secure. Farm-Hardened.</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 mb-12">
            <p className="text-lg text-gray-700 text-center mb-8">
              We know you operate in environments where the signal is weak but the stakes are high. 
              Maroon is built to be as tough as your farm.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Digital ID</h4>
              <p className="text-gray-600 text-sm">
                Every animal or batch is registered with a unique, tamper-proof identity.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Smartphone className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Offline Capture</h4>
              <p className="text-gray-600 text-sm">
                Log your commercial data in the field—even without a signal. The app syncs automatically when you're back in range.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <QrCode className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Blockchain Security</h4>
              <p className="text-gray-600 text-sm">
                Your records are stored on an immutable ledger. No one can question the integrity of your history.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">The QR Passport</h4>
              <p className="text-gray-600 text-sm">
                Generate a professional report for buyers with one click. Your proof of quality and ticket to the formal market.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-orange-600 to-amber-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Don't Just Grow. Compete.
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
            The future of South African agriculture belongs to the farmers who can prove their quality. 
            Whether you are aiming for the local butchery or an export contract, Maroon ensures your 
            hard work is finally visible and valued at its true worth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg"
              onClick={() => router.push('/login')}
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 text-lg"
              onClick={() => router.push('/viewer')}
            >
              See How It Works
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
