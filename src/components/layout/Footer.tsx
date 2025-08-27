import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Team', href: '/team' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Safety Guidelines', href: '/safety' },
      { name: 'Cancellation Policy', href: '/cancellation' },
      { name: 'Contact Us', href: '/contact' },
    ],
    explore: [
      { name: 'All Camps', href: '/camps' },
      { name: 'Featured Camps', href: '/camps?featured=true' },
      { name: 'Blog', href: '/blog' },
      { name: 'Travel Guides', href: '/guides' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Disclaimer', href: '/disclaimer' },
    ],
  }

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/campedge' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/campedge' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/campedge' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/campedge' },
  ]

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
      {/* Main Footer */}
      <div className="container-max section-padding py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">CE</span>
              </div>
              <span className="font-display font-bold text-xl text-gray-900 dark:text-white">
                CampEdge
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              Discover the beauty of India through authentic camping experiences. 
              From Himalayan peaks to desert dunes, create memories that last a lifetime.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-primary-400" />
                <span className="text-sm">info@campedge.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-primary-400" />
                <span className="text-sm">+91-9876543210</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-primary-400" />
                <span className="text-sm">New Delhi, India</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Explore</h3>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-300 dark:border-gray-800">
          <div className="max-w-md">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Stay Updated</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Get the latest camping tips, destination guides, and exclusive offers.
            </p>
            <div className="flex space-x-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-300 dark:border-gray-800">
        <div className="container-max section-padding py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              © {currentYear} CampEdge. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
