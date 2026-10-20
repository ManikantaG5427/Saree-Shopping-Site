import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, Headphones, Truck, Phone, Mail, CheckCircle2 } from 'lucide-react';

const trustFeatures = [
  {
    icon: ShieldCheck,
    title: 'Secure Online Payments',
    description: 'Protected and verified multi-tier encrypted payment gateways.',
  },
  {
    icon: Award,
    title: 'Silk Mark Certified Silks',
    description: 'Every pure silk drape carries verified Silk Mark Organisation of India certification.',
  },
  {
    icon: Headphones,
    title: '1-on-1 Video Consultation',
    description: 'Schedule a WhatsApp video drape to inspect true color and zari luster before buying.',
  },
  {
    icon: Truck,
    title: 'Transparent 7-Day Returns',
    description: 'Hassle-free inspection policy with complimentary fall & pico hemming on all sarees.',
  },
];

const companyLinks = [
  { label: 'Store Locations', href: '/locations' },
  { label: 'About Our Ateliers', href: '/about' },
  { label: 'Silk Mark Authenticity', href: '/#silk-mark' },
  { label: 'Frequently Asked Questions', href: '/faq' },
];

const quickLinks = [
  { label: 'Terms & Conditions', href: '/terms-conditions' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Return & Exchange Policy', href: '/return-exchange-policy' },
  { label: 'Shipping & Delivery Policy', href: '/shipping-policy' },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="bg-[#181514] text-[#f5eedf] border-t border-[#c5a059]/30">
      {/* 4 Pillars Trust Bar */}
      <div className="border-b border-stone-800 bg-[#211c1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustFeatures.map((item) => (
              <div key={item.title} className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-xs bg-[#520815] border border-[#c5a059]/40 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <item.icon className="w-6 h-6 text-[#c5a059]" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-semibold text-white tracking-wide">{item.title}</h4>
                  <p className="text-xs text-stone-400 mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 xl:gap-12">
          {/* Brand Info & Support */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block" aria-label="Sri Lakshmi Saree House Home">
              <span className="font-serif text-2xl font-bold tracking-wider text-white block uppercase">
                SRI LAKSHMI SAREE HOUSE
              </span>
            </Link>

            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-sm font-light">
              A legacy of artistic excellence and cultural preservation. For two decades, our master weavers have crafted authentic handloom pattu, poetic Uppada silks, and bespoke bridal maggam artistry.
            </p>

            {/* Direct Contact Support */}
            <div className="pt-2 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-stone-200">
                <Phone className="w-4 h-4 text-[#c5a059]" />
                <a href="tel:+919852985299" className="hover:text-[#c5a059] font-semibold tracking-wider">
                  +91 98529 85299
                </a>
              </div>
              <div className="flex items-center gap-2 text-stone-200">
                <Mail className="w-4 h-4 text-[#c5a059]" />
                <a href="mailto:srilakshmistore@gmail.com" className="hover:text-[#c5a059] tracking-wider">
                  srilakshmistore@gmail.com
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 text-xs tracking-widest text-[#c5a059] uppercase font-medium pt-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
                <span>INSTAGRAM</span>
              </a>
              <span>·</span>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
                <span>FACEBOOK</span>
              </a>
            </div>
          </div>

          {/* Our Company */}
          <div>
            <h3 className="font-serif text-base font-semibold text-white mb-4 tracking-wide border-b border-[#c5a059]/30 pb-2 inline-block">
              Our Company
            </h3>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-xs text-stone-300 hover:text-[#c5a059] tracking-wider transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-base font-semibold text-white mb-4 tracking-wide border-b border-[#c5a059]/30 pb-2 inline-block">
              Buyer Assurance
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-xs text-stone-300 hover:text-[#c5a059] tracking-wider transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-serif text-base font-semibold text-white mb-2 tracking-wide border-b border-[#c5a059]/30 pb-2 inline-block">
              Exclusive Inquiries
            </h3>
            <p className="text-xs text-stone-400 mb-4 leading-relaxed">
              Subscribe for private festive preview catalogs and curated loom drops.
            </p>

            {subscribed ? (
              <div className="bg-[#721224]/80 border border-[#c5a059] p-4 rounded-xs text-white flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#c5a059] flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold">Thank you for subscribing.</p>
                  <p className="text-stone-300 text-[11px] mt-0.5">Exclusive updates and seasonal previews will arrive in your inbox.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div>
                  <label htmlFor="newsletter-email" className="block text-[11px] font-medium text-stone-300 mb-1">
                    Email Address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xs text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#c5a059] hover:bg-[#aa771c] text-[#181514] font-semibold py-2 px-4 rounded-xs text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
                >
                  Join Patron List
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 mt-12 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p className="tracking-wider">
            © 2026 Sri Lakshmi Saree House. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[11px] tracking-wider text-stone-400">
            <span>SLSH Weaves · Established 2003</span>
            <span>·</span>
            <span>Pure Handloom Guarantee</span>
            <span>·</span>
            <span>Silk Mark Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
