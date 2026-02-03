// components/layout/Footer.tsx

import Link from "next/link";
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Mail,
  MapPin,
  Phone
} from "lucide-react";

const footerLinks = {
  shop: [
    { name: "New Arrivals", href: "/categories/new-arrivals" },
    { name: "Best Sellers", href: "/categories/best-sellers" },
    { name: "Dresses", href: "/categories/dresses" },
    { name: "Tops", href: "/categories/tops" },
    { name: "Sale", href: "/categories/sale" },
  ],
  help: [
    { name: "Contact Us", href: "/contact" },
    { name: "FAQs", href: "/faqs" },
    { name: "Shipping Info", href: "/shipping" },
    { name: "Returns", href: "/returns" },
    { name: "Size Guide", href: "/size-guide" },
  ],
  about: [
    { name: "Our Story", href: "/about" },
    { name: "Sustainability", href: "/sustainability" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
  ],
};

const socialLinks = [
  { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
  { name: "Facebook", icon: Facebook, href: "https://facebook.com" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
];

export default function Footer() {
  return (
    <footer className="bg-goddess-dark text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-goddess py-12">
        <div className="container-goddess text-center">
          <h3 className="font-script text-3xl text-primary-600 mb-2">
            Join the Goddess Club
          </h3>
          <p className="text-goddess-dark mb-6">
            Subscribe for exclusive offers, new arrivals & 10% off your first order!
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="input-goddess flex-1"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-goddess py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="font-script text-3xl text-primary-400">
                Goddess
              </span>
              <span className="font-display text-xl text-white ml-2">
                Essence
              </span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              Embrace your inner goddess with our curated collection of 
              beautiful, confident-making fashion pieces.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center
                           hover:bg-primary-500 transition-colors"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Help</h4>
            <ul className="space-y-2">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400">
                <Mail size={18} className="mt-1 flex-shrink-0" />
                <span>hello@goddessessence.com</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <Phone size={18} className="mt-1 flex-shrink-0" />
                <span>+254718763226</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span>Nakuru</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-goddess py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2026 Goddess Essence. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-primary-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}