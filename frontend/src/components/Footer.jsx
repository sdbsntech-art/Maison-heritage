import React from 'react';
import { Compass, Phone, Truck, MapPin } from 'lucide-react';

export default function Footer({ onNavClick, onAdminClick }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      backgroundColor: '#02050c',
      borderTop: '1px solid var(--border-dark)',
      padding: '4rem 0 2rem 0',
      color: 'var(--text-light)',
      fontSize: '0.9rem'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '3rem 2rem',
          marginBottom: '3rem'
        }}>
          {/* Brand Info */}
          <div>
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.5rem',
              color: 'var(--color-accent)',
              marginBottom: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Maison Heritage
            </h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
              Un univers né de ma passion pour le beau, l’authentique et l’intemporel. Créé par Bint Khalifa pour vous offrir le meilleur de l'élégance.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <span className="text-uppercase-tracking" style={{ fontSize: '0.65rem' }}>
                Dakar | Sénégal
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'var(--color-accent)',
              marginBottom: '1.5rem',
              fontWeight: '600'
            }}>
              Découvrir
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {['home', 'boutique', 'apropos', 'politique', 'contact'].map((tab) => (
                <li key={tab}>
                  <button 
                    onClick={() => {
                      onNavClick(tab);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{
                      color: 'var(--text-muted)',
                      transition: 'var(--transition-fast)',
                      textAlign: 'left',
                    }}
                    className="footer-link"
                  >
                    {tab === 'home' ? 'Accueil' : tab === 'boutique' ? 'Nos Produits' : tab === 'apropos' ? 'À Propos' : tab === 'politique' ? 'Politique' : 'Contactez-nous'}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Values / Service Info */}
          <div>
            <h4 style={{
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'var(--color-accent)',
              marginBottom: '1.5rem',
              fontWeight: '600'
            }}>
              Nos Engagements
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <Truck size={18} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                <span style={{ color: 'var(--text-muted)' }}>Livraison partout au Sénégal</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <Compass size={18} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                <span style={{ color: 'var(--text-muted)' }}>Produits d'exception certifiés</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <MapPin size={18} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                <span style={{ color: 'var(--text-muted)' }}>Boutique Physique à Dakar</span>
              </li>
            </ul>
          </div>

          {/* Contact Direct */}
          <div>
            <h4 style={{
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'var(--color-accent)',
              marginBottom: '1.5rem',
              fontWeight: '600'
            }}>
              Service Client
            </h4>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.2rem', lineHeight: '1.6' }}>
              Des questions ou une commande directe ? Contactez-nous par WhatsApp, appel ou autre moyen de contact.
            </p>
            <a 
              href="https://wa.me/221774903713" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                backgroundColor: 'rgba(197, 168, 128, 0.05)',
                border: '1px solid var(--color-accent)',
                padding: '0.8rem 1.2rem',
                borderRadius: '8px',
                color: 'var(--color-accent)',
                fontWeight: '600',
                fontSize: '0.85rem',
                letterSpacing: '0.05em'
              }}
              className="footer-whatsapp-btn"
            >
              <i className="fa-brands fa-whatsapp" style={{ fontSize: '16px' }}></i>
              +221 77 490 37 13
            </a>
          </div>
        </div>

        {/* Bottom copyright bar with secret admin click dot */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          color: 'var(--text-muted)',
          fontSize: '0.8rem',
          position: 'relative'
        }}>
          <span 
            onClick={() => {
              if (onAdminClick) onAdminClick();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{ cursor: 'pointer', userSelect: 'none' }}
            title="Accès Admin"
          >
            &copy; {currentYear} Maison Heritage by Bint Khalifa. Tous droits réservés.
          </span>
          <span style={{ marginLeft: '1rem', color: 'var(--text-muted)' }}>
            Développeur: Zayel – Hébergement: Vercel en local, Hostinger en production
          </span>
          <span style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span>Jours: Lundi au Dimanche</span>
            <span>Horaires: 09:00 – 00:00</span>
            <span>Disponible en ligne</span>
          </span>
        </div>
      </div>

      <style>{`
        .footer-link:hover {
          color: var(--color-accent) !important;
          transform: translateX(4px);
        }
        .footer-whatsapp-btn:hover {
          background-color: var(--color-accent) !important;
          color: var(--bg-dark) !important;
          box-shadow: 0 4px 15px rgba(197, 168, 128, 0.15);
        }
      `}</style>
    </footer>
  );
}
