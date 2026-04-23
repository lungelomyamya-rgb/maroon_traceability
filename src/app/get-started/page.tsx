'use client';

import { Users, Shield, Database, Headphones, Zap, Clock, Award, ArrowRight, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function GetStartedPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const pricingPlans = [
    {
      id: 'individual',
      name: 'Individual Farmer',
      tier: 'Basic',
      idealFor: 'Individual Farmers',
      price: 'R0',
      period: '/month',
      features: [
        { icon: Users, text: '1 User', included: true },
        { icon: Shield, text: 'Basic Traceability', included: true },
        { icon: Database, text: '5 Records / Mo', included: true },
        { icon: Headphones, text: 'Knowledge Base', included: true },
        { icon: Zap, text: 'Integrations', included: false },
        { icon: Clock, text: 'Priority Support', included: false },
      ],
      cta: 'Get Started',
      ctaAction: () => router.push('/register/individual'),
      popular: false,
    },
    {
      id: 'smme',
      name: 'SMME, Co-ops, Joint Venture',
      tier: 'Professional',
      idealFor: 'Small to Medium Cooperatives',
      price: 'R950',
      period: '/month',
      features: [
        { icon: Users, text: 'Up to 5 Users', included: true },
        { icon: Shield, text: 'POPIA Ready', included: true },
        { icon: Database, text: '100 Records / Mo', included: true },
        { icon: Headphones, text: 'Email Support', included: true },
        { icon: Zap, text: 'Basic Export API', included: true },
        { icon: Clock, text: '8-to-5 Priority', included: true },
      ],
      cta: 'Start 14-Day Trial',
      ctaAction: () => router.push('/register/smme'),
      popular: false,
    },
    {
      id: 'commercial',
      name: 'Commercial Farmers',
      tier: 'Professional',
      idealFor: 'Commercial Entities',
      price: 'R7,500',
      period: '/month',
      features: [
        { icon: Users, text: 'Up to 200 Users', included: true },
        { icon: Shield, text: 'POPIA + Audit Trail', included: true },
        { icon: Database, text: '200 Records / Mo', included: true },
        { icon: Headphones, text: '8-to-5 Priority', included: true },
        { icon: Zap, text: 'API Access', included: true },
        { icon: Clock, text: 'Priority Support', included: true },
      ],
      cta: 'Go Pro Now',
      ctaAction: () => router.push('/register/commercial'),
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Government & SOEs',
      tier: 'Enterprise',
      idealFor: 'Government & SOEs',
      price: 'Custom Quote',
      period: '',
      features: [
        { icon: Users, text: 'Unlimited Users', included: true },
        { icon: Shield, text: 'GRAP & SITA Aligned', included: true },
        { icon: Database, text: 'Unlimited Records', included: true },
        { icon: Headphones, text: '24/7 Dedicated Manager', included: true },
        { icon: Zap, text: 'Custom ERP Integration', included: true },
        { icon: Clock, text: '24/7 Support', included: true },
      ],
      cta: 'Contact Sales',
      ctaAction: () => router.push('/contact-sales'),
      popular: false,
    },
  ];

  const addons = [
    {
      icon: Shield,
      title: 'Digital Transit Permits',
      description: 'Per generated permit',
      price: 'R15.00',
    },
    {
      icon: Users,
      title: 'Livestock RFID Logs',
      description: 'Per individual animal record',
      price: 'R2.50',
    },
    {
      icon: Database,
      title: 'Automated GRAP Reports',
      description: 'Per audited statement generation',
      price: 'R1450',
    },
  ];

  const trustFactors = [
    {
      icon: Shield,
      title: 'Sovereign Data Security',
      description: 'All data is hosted locally within South African borders, ensuring 100% POPIA and State Security compliance.',
    },
    {
      icon: Award,
      title: 'Audit-Ready Architecture',
      description: 'Our systems are designed specifically to meet GRAP financial standards, significantly reducing the cost and time of annual public sector audits.',
    },
    {
      icon: Zap,
      title: 'Interoperable Ecosystem',
      description: 'Built on an "API-First" philosophy, allowing our platforms to talk to your existing ERP or government databases.',
    },
  ];

  const faqs = [
    {
      question: 'Do you support government procurement cycles?',
      answer: 'Yes. For our Sovereign tier, we provide all necessary documentation for PFMA compliance, SITA-ready technical specifications, and B-BBEE certification to streamline the tender process.',
    },
    {
      question: 'Can we blend digital and physical solutions?',
      answer: 'Absolutely. We can integrate our digital traceability platform with our nutritional fortification programs for a holistic CSI (Corporate Social Investment) solution.',
    },
    {
      question: 'Is there a discount for annual billing?',
      answer: 'We offer a 15% discount for clients who opt for annual upfront billing on our Commercial and Enterprise tiers.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Back Button */}
      <div className="px-3 sm:px-4 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
          className="mb-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
        </Button>
      </div>

      {/* Hero Section */}
      <div className="py-1 sm:py-2 lg:py-3">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            Intelligence for the Agri-Food Value Chain
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-4xl mx-auto">
            From rural traceability to national compliance. Select the digital framework that powers your operational integrity.
          </p>
        </div>
      </div>

      {/* Pricing Matrix */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">The Pricing Matrix</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative p-6 rounded-2xl transition-all hover:shadow-lg ${
                  plan.popular
                    ? 'border-2 border-blue-600 shadow-xl scale-105'
                    : 'border border-gray-200'
                } ${selectedPlan === plan.id ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{plan.idealFor}</p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <feature.icon className={`h-4 w-4 mr-3 ${
                        feature.included ? 'text-green-600' : 'text-gray-300'
                      }`} />
                      <span className={`text-sm ${
                        feature.included ? 'text-gray-700' : 'text-gray-400 line-through'
                      }`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  className={`w-full ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                  onClick={plan.ctaAction}
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Usage-Based Add-ons */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Flexible Usage-Based Add-ons
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              The Scalability Factor: Only pay for the value you generate
            </p>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto">
              For our Commercial and Enterprise clients, we believe you should only pay for the value you generate.
              Seamlessly scale your operations without fixed-cost bloating.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {addons.map((addon, index) => (
              <Card key={index} className="p-6 text-center">
                <addon.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{addon.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{addon.description}</p>
                <div className="text-2xl font-bold text-blue-600">{addon.price}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Factors */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why the Industry Trusts TACTPAM
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {trustFactors.map((factor, index) => (
              <Card key={index} className="p-6">
                <factor.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{factor.title}</h3>
                <p className="text-gray-600">{factor.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              The "Procurement-Ready" FAQ
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Demo vs Real Account Selection */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
            Choose Your Experience
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Explore our platform with a demo account or create a real account to start your traceability journey
          </p>

          <div className="flex justify-center">
            <Card className="p-8 bg-white/10 backdrop-blur-sm border border-white/20 max-w-md">
              <div className="text-white">
                <div className="text-4xl mb-4">Demo</div>
                <h3 className="text-2xl font-bold mb-4">Try Demo Mode</h3>
                <p className="text-blue-100 mb-6">
                  Experience the platform with pre-configured demo accounts. Perfect for exploring features without registration.
                </p>
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 w-full"
                  onClick={() => router.push('/login')}
                >
                  Start Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
