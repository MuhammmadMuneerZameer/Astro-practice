import React from 'react';
import { Shield, Eye, Cookie, Database, Mail, Lock, FileText, AlertCircle } from 'lucide-react';

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
      content: [
        "Personal information (name, email) when you contact us or subscribe",
        "Usage data (pages visited, time spent, browser type)",
        "Cookies and tracking technologies",
        "Device information (IP address, browser, operating system)"
      ]
    },
    {
      icon: Database,
      title: "How We Use Your Information",
      content: [
        "To provide and improve our services",
        "To communicate with you about updates and newsletters",
        "To analyze website traffic and user behavior",
        "To display personalized advertisements"
      ]
    },
    {
      icon: Cookie,
      title: "Cookies & Tracking",
      content: [
        "We use cookies to enhance your browsing experience",
        "Third-party services (Google Analytics, AdSense) use cookies",
        "You can disable cookies in your browser settings",
        "Some features may not work without cookies"
      ]
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        "We implement security measures to protect your data",
        "SSL encryption for data transmission",
        "Regular security audits and updates",
        "Limited access to personal information"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-400/5"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6 border border-green-500/30">
            <Shield className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-300">Privacy Policy</h1>
          <p className="text-gray-400 text-lg mb-2">Last Updated: November 18, 2025</p>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </p>
        </div>
      </section>

      {/* AdSense Notice */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-blue-300 mb-2">Google AdSense & Third-Party Advertising</h3>
              <p className="text-gray-300 mb-3">
                We use Google AdSense to display advertisements on our website. Google and its partners may use cookies and other technologies to:
              </p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Serve ads based on your prior visits to our website or other websites</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Collect information about your browsing activities to personalize advertising</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>You can opt out of personalized advertising at <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">Google Ads Settings</a></span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Main Sections */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-12">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div key={index} className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 hover:border-green-500/30 transition-all">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                    <Icon className="w-6 h-6 text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mt-2">{section.title}</h2>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300">
                      <span className="text-green-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Additional Sections */}
      <section className="max-w-4xl mx-auto px-4 py-12 border-t border-gray-800">
        <div className="space-y-8">
          {/* Third-Party Services */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <FileText className="w-6 h-6 text-green-400" />
              Third-Party Services
            </h2>
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <p className="text-gray-300 mb-4">Our website uses the following third-party services:</p>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span><strong className="text-white">Google Analytics:</strong> To analyze website traffic and user behavior</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span><strong className="text-white">Google AdSense:</strong> To display advertisements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span><strong className="text-white">Firebase:</strong> For data storage and authentication</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span><strong className="text-white">Formspree:</strong> For contact form submissions</span>
                </li>
              </ul>
              <p className="text-gray-400 mt-4">
                Each service has its own privacy policy governing how they handle your data.
              </p>
            </div>
          </div>

          {/* Your Rights */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">•</span>
                  <span><strong className="text-white">Access:</strong> Request a copy of your personal data</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">•</span>
                  <span><strong className="text-white">Correction:</strong> Update or correct inaccurate information</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">•</span>
                  <span><strong className="text-white">Deletion:</strong> Request deletion of your personal data</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">•</span>
                  <span><strong className="text-white">Opt-Out:</strong> Unsubscribe from marketing communications</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Mail className="w-6 h-6 text-green-400" />
              Contact Us
            </h2>
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <p className="text-gray-300 mb-4">
                If you have questions about this Privacy Policy or how we handle your data, please contact us:
              </p>
              <div className="space-y-2 text-gray-400">
                <p><strong className="text-white">Email:</strong> muneerzameer@hydrafoxdesigns.com</p>
                <p><strong className="text-white">Website:</strong> hydrafoxdesigns.com</p>
              </div>
            </div>
          </div>

          {/* Updates */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Policy Updates</h2>
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <p className="text-gray-300">
                We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last Updated" date. We encourage you to review this policy periodically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="max-w-4xl mx-auto px-4 py-12 border-t border-gray-800">
        <div className="text-center">
          <p className="text-gray-400 mb-6">
            By using our website, you consent to our Privacy Policy and agree to its terms.
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center px-8 py-4 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-full transition-all duration-300 shadow-lg"
          >
            Back to Home
          </a>
        </div>
      </section>
    </div>
  );
}