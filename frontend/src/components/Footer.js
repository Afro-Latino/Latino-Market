import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone, Clock } from 'lucide-react';
import { settingsAPI } from '../services/api';

export const Footer = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState({
    facebook_url: '',
    instagram_url: '',
    twitter_url: '',
    youtube_url: '',
    phone_number: '(506) 830-0999',
    contact_email: 'info@afrolatino.ca',
    store_address: '247 Lewisville Rd, Moncton, NB'
  });
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await settingsAPI.get();
      setSettings({
        facebook_url: data.facebook_url || '',
        instagram_url: data.instagram_url || '',
        twitter_url: data.twitter_url || '',
        youtube_url: data.youtube_url || '',
        phone_number: data.phone_number || '(506) 830-0999',
        contact_email: data.contact_email || 'info@afrolatino.ca',
        store_address: data.store_address || '247 Lewisville Rd, Moncton, NB'
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    alert('Thank you for subscribing!');
    setEmail('');
  };

  const storeHours = [
    { day: 'Monday:', hours: '11:00 AM - 9:00 PM' },
    { day: 'Tuesday:', hours: '11:00 AM - 9:00 PM' },
    { day: 'Wednesday:', hours: '11:00 AM - 9:00 PM' },
    { day: 'Thursday:', hours: '11:00 AM - 9:00 PM' },
    { day: 'Friday:', hours: '11:00 AM - 9:00 PM' },
    { day: 'Saturday:', hours: '11:00 AM - 9:00 PM' },
    { day: 'Sunday:', hours: 'Closed', closed: true }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Logo & Social */}
          <div>
            <Link to="/">
              <img 
                src="https://customer-assets.emergentagent.com/job_culticommerce/artifacts/x3503la8_afro-latino%20logo.png" 
                alt="Afro-Latino" 
                className="h-12 mb-4"
              />
            </Link>
            <p className="text-sm mb-4">
              Bringing authentic African and Latin American flavors to the Greater Moncton community.
            </p>
            <div className="flex space-x-4">
              {settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings.twitter_url && (
                <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {settings.youtube_url && (
                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop" className="hover:text-amber-500 transition-colors">Shop All</Link></li>
              <li><Link to="/shop/african" className="hover:text-amber-500 transition-colors">African Products</Link></li>
              <li><Link to="/shop/latino" className="hover:text-amber-500 transition-colors">Latino Products</Link></li>
              <li><Link to="/recipes" className="hover:text-amber-500 transition-colors">Recipes</Link></li>
              <li><Link to="/deals" className="hover:text-amber-500 transition-colors">Deals & Bundles</Link></li>
              <li><Link to="/about" className="hover:text-amber-500 transition-colors">About Us</Link></li>
              <li className="pt-2 border-t border-gray-700 mt-2">
                <Link to="/admin" className="hover:text-amber-500 transition-colors flex items-center">
                  <span className="mr-1">🔐</span> Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Store Hours */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Store Hours
            </h3>
            <div className="space-y-1 text-sm">
              {storeHours.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{item.day}</span>
                  <span className={item.closed ? 'text-red-400' : ''}>{item.hours}</span>
                </div>
              ))}
            </div>
            
            {/* Contact Info */}
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-amber-500" />
                <span>{settings.phone_number}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-amber-500" />
                <span>{settings.contact_email}</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>Visit Our Store at {settings.store_address}</span>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-2 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-amber-500" />
                Subscribe to Our Newsletter
              </h3>
              <p className="text-sm mb-4 text-gray-400">
                Get exclusive deals, new product updates, and authentic recipes delivered to your inbox!
              </p>
              <form onSubmit={handleNewsletterSubmit}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 mb-3"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded transition-colors flex items-center justify-center"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Subscribe
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-2">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2025 Afro-Latino™. All rights reserved. Made with ❤️ celebrating African and Latin American cultures.</p>
        </div>
      </div>
    </footer>
  );
};
