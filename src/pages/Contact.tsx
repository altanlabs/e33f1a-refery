import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Send, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  const quickLinks = [
    {
      title: 'Scout Application',
      description: 'Apply to become a verified referrer',
      href: '/apply',
      external: false
    },
    {
      title: 'Job Board',
      description: 'Browse available opportunities',
      href: '/opportunities',
      external: false
    },
    {
      title: 'FAQs',
      description: 'Common questions and answers',
      href: '/faq',
      external: false
    },
    {
      title: 'Twitter',
      description: 'Follow us for updates',
      href: 'https://twitter.com/refery_io',
      external: true
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Have a question? Need support? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Mail className="w-5 h-5 mr-2 text-emerald-600" />
                  Send us a message
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Name *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        className="mt-1"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        className="mt-1"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        required
                        rows={5}
                        className="mt-1"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Thanks for reaching out!
                    </h3>
                    <p className="text-gray-600">
                      We'll get back to you within 24–48 hours.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Direct Contact */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Prefer email?
              </h3>
              <p className="text-gray-600 mb-4">
                You can also reach us directly at:
              </p>
              <a 
                href="mailto:contact@refery.io"
                className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
              >
                <Mail className="w-4 h-4 mr-2" />
                contact@refery.io
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Links</h2>
            <div className="space-y-4">
              {quickLinks.map((link, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {link.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {link.description}
                        </p>
                      </div>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-700"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      ) : (
                        <Link
                          to={link.href}
                          className="text-emerald-600 hover:text-emerald-700"
                        >
                          <ArrowLeft className="w-5 h-5 rotate-180" />
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Support Hours */}
            <div className="mt-8 p-6 bg-emerald-50 rounded-lg border border-emerald-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Support Hours
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span className="font-medium">9:00 AM - 6:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span>Weekend:</span>
                  <span className="font-medium">Limited support</span>
                </div>
                <div className="flex justify-between">
                  <span>Response Time:</span>
                  <span className="font-medium">24-48 hours</span>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-900 mb-2">
                Urgent Issues?
              </h4>
              <p className="text-sm text-red-700">
                For urgent platform issues or security concerns, 
                email <a href="mailto:urgent@refery.io" className="font-medium underline">urgent@refery.io</a> 
                with "URGENT" in the subject line.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}