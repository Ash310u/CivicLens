import { Link } from 'react-router-dom';
import { Leaf, ExternalLink, Globe, Link2, Mail, Heart } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Features', href: '/features' },
    { label: 'How it Works', href: '/how-it-works' },
    { label: 'Campaigns', href: '/campaigns' },
    { label: 'Live Heatmap', href: '/heatmap' },
  ],
  Resources: [
    { label: 'Segregation Guide', href: '/citizen/guide' },
    { label: 'FAQ', href: '/faq' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Data Policy', href: '#' },
  ],
};

const socialLinks = [
  { icon: Globe, href: '#', label: 'Twitter' },
  { icon: ExternalLink, href: '#', label: 'GitHub' },
  { icon: Link2, href: '#', label: 'LinkedIn' },
  { icon: Mail, href: '#', label: 'Email' },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-civic-500 to-teal-500 flex items-center justify-center">
                <Leaf size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold text-[var(--text-primary)]">
                Civic<span className="text-gradient">Lens</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--text-secondary)] max-w-xs mb-6 leading-relaxed">
              Empowering citizens and municipalities to build cleaner cities through verified waste reporting, AI-driven classification, and transparent civic accountability.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-tertiary)] hover:text-civic-500 hover:bg-civic-500/10 transition-all duration-200"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-[var(--text-secondary)] hover:text-civic-500 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-tertiary)]">
            © {new Date().getFullYear()} CivicLens. All rights reserved.
          </p>
          <p className="text-xs text-[var(--text-tertiary)] flex items-center gap-1">
            Built with <Heart size={12} className="text-danger-400" /> for cleaner cities
          </p>
        </div>
      </div>
    </footer>
  );
}
