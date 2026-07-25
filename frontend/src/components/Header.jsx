import React from 'react';
import { ShoppingBag, X } from 'lucide-react';
import logoImg from '../assets/logo.png';

const NAV_ITEMS = [
  { id: 'home',      label: 'Accueil',    icon: 'fa-solid fa-house' },
  { id: 'boutique',  label: 'Boutique',   icon: 'fa-solid fa-bag-shopping' },
  { id: 'apropos',   label: 'À Propos',   icon: 'fa-solid fa-gem' },
  { id: 'politique', label: 'Politique',  icon: 'fa-solid fa-shield-halved' },
  { id: 'contact',   label: 'Contact',    icon: 'fa-brands fa-whatsapp' },
];

export default function Header({ cartCount, onCartClick, onAdminClick, activeTab, setActiveTab }) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const currentYear = new Date().getFullYear();

  React.useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 769) setDrawerOpen(false);
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && drawerOpen) setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  const handleNavClick = React.useCallback((tab) => {
    setActiveTab(tab);
    setDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setActiveTab]);

  return (
    <>
      <header className={`glass site-header${scrolled ? ' scrolled' : ''}`} role="banner">
        <div className="container header-inner">
          {/* Logo */}
          <div
            className="header-brand"
            onClick={() => handleNavClick('home')}
            title="Maison Heritage by Bint Khalifa"
            role="link"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleNavClick('home')}
            aria-label="Aller à l'accueil — Maison Heritage"
          >
            <img
              src={logoImg}
              alt="Maison Heritage"
              className="header-logo"
              draggable={false}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="header-brand-text">
              <span className="header-brand-title">Maison Heritage</span>
              <span className="header-brand-sub">By Bint Khalifa</span>
            </div>
          </div>

          {/* Nav desktop centrée */}
          <nav className="desktop-nav" aria-label="Navigation principale">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`nav-link${activeTab === item.id ? ' active' : ''}`}
                aria-current={activeTab === item.id ? 'page' : undefined}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions — Panier + menu burger */}
          <div className="header-actions">
            <button
              className="cart-pill"
              onClick={() => onCartClick?.()}
              aria-label="Voir le panier"
              title="Voir le panier"
            >
              <ShoppingBag size={18} />
              <span className="cart-pill-label">Panier</span>
              {cartCount > 0 && <span className="cart-pill-count">{cartCount}</span>}
            </button>

            <button
              className={`burger-btn${drawerOpen ? ' open' : ''}`}
              onClick={() => setDrawerOpen(prev => !prev)}
              aria-expanded={drawerOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={drawerOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              <span className="burger-bar" aria-hidden="true" />
              <span className="burger-bar" aria-hidden="true" />
              <span className="burger-bar" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`menu-overlay${drawerOpen ? ' visible' : ''}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      <nav
        id="mobile-nav-drawer"
        className={`nav-drawer${drawerOpen ? ' open' : ''}`}
        aria-label="Menu mobile"
        aria-hidden={!drawerOpen}
        role="dialog"
        aria-modal={drawerOpen}
      >
        <div className="drawer-header">
          <span className="drawer-brand">MAISON <span>HERITAGE</span></span>
          <button
            onClick={() => setDrawerOpen(false)}
            style={{
              width: 40, height: 40,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
            aria-label="Fermer le menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="drawer-nav">
          {NAV_ITEMS.map((item, i) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`drawer-link${activeTab === item.id ? ' active' : ''}`}
              aria-current={activeTab === item.id ? 'page' : undefined}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="drawer-link-icon" aria-hidden="true">
                <i className={`${item.icon} chic-icon`}></i>
              </span>
              {item.label}
            </button>
          ))}

          <div className="drawer-divider" />

          <button
            onClick={() => { onCartClick(); setDrawerOpen(false); }}
            className="drawer-link"
          >
            <span className="drawer-link-icon" aria-hidden="true">
              <i className="fa-solid fa-cart-shopping chic-icon"></i>
            </span>
            Mon Panier {cartCount > 0 && `(${cartCount})`}
          </button>

          <a
            href="https://wa.me/221774903713"
            target="_blank"
            rel="noopener noreferrer"
            className="drawer-link"
            onClick={() => setDrawerOpen(false)}
            style={{ color: '#4ade80' }}
          >
            <span className="drawer-link-icon" aria-hidden="true">
              <i className="fa-brands fa-whatsapp chic-icon" style={{ color: '#25D366' }}></i>
            </span>
            WhatsApp
          </a>

          <button
            onClick={() => handleNavClick('admin')}
            className={`drawer-link${activeTab === 'admin' ? ' active' : ''}`}
            style={{ color: 'var(--color-accent)', fontWeight: '600' }}
          >
            <span className="drawer-link-icon" aria-hidden="true">
              <i className="fa-solid fa-lock chic-icon"></i>
            </span>
            Administration
          </button>
        </div>

        <div className="drawer-footer">
          <p className="drawer-footer-text">
            © {currentYear} <span className="drawer-footer-brand">Maison Heritage</span>
            <br />
            <span style={{ fontSize: '0.6rem', opacity: 0.5 }}>Livraison partout au Sénégal</span>
          </p>
        </div>
      </nav>
    </>
  );
}
