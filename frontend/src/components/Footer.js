import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin } from 'lucide-react';
import { settingsAPI } from '../services/api';

export const Footer = () => {
  const { t } = useTranslation();
  const [socialLinks, setSocialLinks] = useState({
    facebook_url: '',
    instagram_url: '',
    twitter_url: '',
    youtube_url: ''
  });

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    try {
      const settings = await settingsAPI.get();
      setSocialLinks({
        facebook_url: settings.facebook_url || '',
        instagram_url: settings.instagram_url || '',
        twitter_url: settings.twitter_url || '',
        youtube_url: settings.youtube_url || ''
      });
    } catch (error) {
      console.error('Error fetching social links:', error);
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold mb-4">
              <span className="text-amber-500">AFRO</span>
              <span className="text-gray-400">-</span>
              <span className="text-green-500">LATINO</span>
            </div>
            <p className="text-sm mb-4">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              {socialLinks.facebook_url && (
                <a href={socialLinks.facebook_url} target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {socialLinks.instagram_url && (
                <a href={socialLinks.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {socialLinks.twitter_url && (
                <a href={socialLinks.twitter_url} target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {socialLinks.youtube_url && (
                <a href={socialLinks.youtube_url} target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.shopTitle')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop/african" className="hover:text-amber-500 transition-colors">{t('footer.africanKitchen')}</Link></li>
              <li><Link to="/shop/latino" className="hover:text-amber-500 transition-colors">{t('footer.latinoKitchen')}</Link></li>
              <li><Link to="/shop" className="hover:text-amber-500 transition-colors">{t('footer.allProducts')}</Link></li>
              <li><Link to="/deals" className="hover:text-amber-500 transition-colors">{t('footer.dealsAndBundles')}</Link></li>
              <li><Link to="/blog" className="hover:text-amber-500 transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.learnTitle')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/recipes" className="hover:text-amber-500 transition-colors">{t('nav.recipes')}</Link></li>
              <li><Link to="/about" className="hover:text-amber-500 transition-colors">{t('footer.ourStory')}</Link></li>
              <li><Link to="/about" className="hover:text-amber-500 transition-colors">{t('footer.ourCultures')}</Link></li>
              <li><Link to="/about" className="hover:text-amber-500 transition-colors">{t('footer.ourFarmers')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.supportTitle')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="hover:text-amber-500 transition-colors">{t('footer.contact')}</Link></li>
              <li><Link to="/faq" className="hover:text-amber-500 transition-colors">{t('footer.faqs')}</Link></li>
              <li><Link to="/shipping" className="hover:text-amber-500 transition-colors">{t('footer.shipping')}</Link></li>
              <li><Link to="/refund" className="hover:text-amber-500 transition-colors">{t('footer.refundPolicy')}</Link></li>
            </ul>
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-amber-500" />
                <span>info@afrolatino.ca</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span>Moncton, NB, Canada</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2025 Afro-Latino™. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};