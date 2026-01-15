'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Smartphone, QrCode, Lock, TrendingUp, Users, Award, BookOpen } from 'lucide-react';

export default function IntroPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              Your Herd Is Your Legacy. Keep it Secured.
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed px-2">
              Your agricultral asset are so much more than just animals.
              They represent your savings, your family's future, and your legacy.
              Maroon is here to help you safeguard them and market them with confidence.
            </p>
            
            {/* Hero Image */}
            <div className="mb-6 sm:mb-8 flex justify-center px-2">
              <img 
                src={process.env.NODE_ENV === 'production' ? "/maroon_traceability/images/Hero Image.png" : "/images/Hero Image.png"} 
                alt="Maroon - Agricultural Asset Protection" 
                className="w-full max-w-4xl sm:max-w-4xl md:max-w-5xl h-auto object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold"
                onClick={() => router.push('/login')}
              >
                Start Your Digital Kraal! - Free
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
                onClick={() => router.push('/viewer')}
              >
                See How It Works
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Awareness Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Your Herd Is Your Wealth
            </h2>
            <h3 className="text-2xl text-blue-600 font-semibold mb-8">
              But Right Now, It's Vulnerable.
            </h3>
            <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
              Every day, livestock owners end up losing money for two main reasons:
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
              <div className="flex items-center mb-4">
                <Lock className="h-10 w-10 text-red-600 mr-3" />
                <h4 className="text-2xl font-bold text-gray-900">Stock Theft</h4>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                Just one stolen agricultural asset could erase years of hard work. And when it's gone, proving that it was yours can be nearly impossible.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-10 w-10 text-blue-600 mr-3" />
                <h4 className="text-2xl font-bold text-gray-900">Lower Prices</h4>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                Even if your agricultural assets are top-notch, buyers tend to offer less when they can't see proof of ownership and farm records. It's not that your animals aren't good. It's that your story isn't documented.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Solution Introduction Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Maroon Helps Tell Your Story. Clearly and Simply
            </h2>
            <p className="text-xl text-gray-700 mb-12 max-w-4xl mx-auto">
              Maroon provides each animal with a digital identity that confirms:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Users className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Who owns it</h3>
              <p className="text-gray-600">Clear, verifiable ownership records</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Award className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">How it was raised</h3>
              <p className="text-gray-600">Complete care and treatment history</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Shield className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Where it comes from</h3>
              <p className="text-gray-600">Verified origin and location records</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-green-600 text-2xl mb-2">✓</div>
                <p className="font-semibold text-gray-900">No complex systems</p>
              </div>
              <div>
                <div className="text-green-600 text-2xl mb-2">✓</div>
                <p className="font-semibold text-gray-900">No paperwork headaches</p>
              </div>
              <div>
                <div className="text-green-600 text-2xl mb-2">✓</div>
                <p className="font-semibold text-gray-900">Just straightforward proof for everyone to see</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-12">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mb-4 sm:mb-6 flex justify-center">
                <img 
                  src={process.env.NODE_ENV === 'production' ? "/maroon_traceability/images/HowItWorks1.png" : "/images/HowItWorks1.png"} 
                  alt="Step 1: Tag Your Animal" 
                  className="w-full max-w-40 sm:max-w-48 md:max-w-xs lg:max-w-sm h-32 sm:h-36 md:h-40 lg:h-48 object-contain rounded-lg shadow-md"
                />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">Step 1: Tag Your Animal</h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-600">
                Every agricultural asset gets a unique digital ID that links back to you.
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 sm:mb-6 flex justify-center">
                <img 
                  src={process.env.NODE_ENV === 'production' ? "/maroon_traceability/images/HowItWorks2.png" : "/images/HowItWorks2.png"} 
                  alt="Step 2: Record What Matters" 
                  className="w-full max-w-40 sm:max-w-48 md:max-w-xs lg:max-w-sm h-32 sm:h-36 md:h-40 lg:h-48 object-contain"
                />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">Step 2: Record What Matters</h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-600">
                You can use your phone to log:
                <br />• Ownership
                <br />• Vaccinations
                <br />• Feeding and care (Even without internet access)
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 sm:mb-6 flex justify-center">
                <img 
                  src={process.env.NODE_ENV === 'production' ? "/maroon_traceability/images/HowItWorks3.png" : "/images/HowItWorks3.png"} 
                  alt="Step 3: Show, Don't Tell" 
                  className="w-full max-w-40 sm:max-w-48 md:max-w-xs lg:max-w-sm h-32 sm:h-36 md:h-40 lg:h-48 object-contain rounded-lg shadow-md"
                />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">Step 3: Show, Don't Tell</h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-600">
                A simple QR code provides buyers, banks, or authorities with statement:
                <br /><br />
                <span className="font-semibold text-blue-600">
                  "This animal is authentic. This farmer is verified."
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Target Audience Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Who Maroon Is For?</h2>
            <p className="text-xl text-gray-600 mb-12">
              Maroon is designed for Two Types of Farmers:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Communal & Rural Farmers</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Shield className="h-6 w-6 text-blue-600 mr-3" />
                  <span className="text-gray-700">Protect your family's wealth</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-6 w-6 text-blue-600 mr-3" />
                  <span className="text-gray-700">Digital proof of ownership</span>
                </div>
                <div className="flex items-center">
                  <Lock className="h-6 w-6 text-blue-600 mr-3" />
                  <span className="text-gray-700">Enhanced security against stock theft</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-6 w-6 text-blue-600 mr-3" />
                  <span className="text-gray-700">Something to show to police, insurers, or banks</span>
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="font-semibold text-blue-800">
                  What this means is: Your wealth doesn't just vanish overnight.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Emerging Commercial Farmers</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <TrendingUp className="h-6 w-6 text-blue-600 mr-3" />
                  <span className="text-gray-700">Sell with confidence. Get better prices</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-6 w-6 text-blue-600 mr-3" />
                  <span className="text-gray-700">Retail-ready traceability</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-6 w-6 text-blue-600 mr-3" />
                  <span className="text-gray-700">Fulfill abattoir and retailer requirements</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-6 w-6 text-blue-600 mr-3" />
                  <span className="text-gray-700">Compete with larger commercial operations</span>
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="font-semibold text-blue-800">
                  What this means is: You don't walk in as a small farmer anymore. You walk in as a verified supplier.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Differentiation Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">This Is Not Just Software</h2>
            <h3 className="text-2xl text-orange-600 font-semibold mb-8">This Is About Protection. Trust. Access.</h3>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-12 text-center">
            <p className="text-2xl text-gray-800 mb-8 font-medium">
              We don't offer subscriptions.
            </p>
            <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
              We turn the quiet wealth of your agricultural assets into an untouchable legacy, 
              making sure what you've built is never lost, never stolen, and never undervalued.
            </p>
          </div>
        </div>
      </div>

      {/* Product Feature Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">The Maroon Digital Agri-Asset Book</h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <BookOpen className="h-16 w-16 text-orange-600 mx-auto mb-4" />
              <p className="text-xl text-gray-700 mb-6">Each animal gets a Digital Passport that verifies:</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-orange-50 rounded-lg">
                <Shield className="h-10 w-10 text-orange-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Where it came from</h4>
                <p className="text-gray-600">Verified origin and farm records</p>
              </div>
              
              <div className="text-center p-6 bg-orange-50 rounded-lg">
                <Award className="h-10 w-10 text-orange-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">How it was raised</h4>
                <p className="text-gray-600">Complete care and treatment history</p>
              </div>
              
              <div className="text-center p-6 bg-orange-50 rounded-lg">
                <Users className="h-10 w-10 text-orange-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Who owns it</h4>
                <p className="text-gray-600">Clear, verifiable ownership</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Credibility Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Why Farmers Choose Maroon</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Tailored for South African farming realities against theft and fraud</h4>
              <p className="text-gray-600 text-sm">Built specifically for local challenges</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <Smartphone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Functional offline</h4>
              <p className="text-gray-600 text-sm">Works even without internet</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">User-friendly</h4>
              <p className="text-gray-600 text-sm">Simple and intuitive to use</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <Lock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Focused on safeguarding agricultural assets</h4>
              <p className="text-gray-600 text-sm">Your protection is our priority</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <h3 className="text-3xl font-bold text-blue-600">Your Herd Is Your Legacy!</h3>
          </div>
        </div>
      </div>

      {/* Final Call-to-Action */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="h-16 w-16 text-white mx-auto mb-6" />
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Every Agricultural Asset in your Agri-Asset Book has a story to tell.
          </h2>
          
          <div className="text-xl text-blue-100 mb-12 max-w-4xl mx-auto space-y-4">
            <p>The grass it grazed on.</p>
            <p>The care you provided.</p>
            <p>The future you're creating for your legacy.</p>
            
            <p className="mt-8 font-semibold text-white text-2xl">
              Maroon ensures that your story is always secure, never lost, never stolen, and never undervalued.
            </p>
          </div>
          
          <Button 
            size="lg" 
            className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            onClick={() => router.push('/login')}
          >
            Start Your Digital Agri-Asset Book Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
