import React from 'react';
import { ArrowRight, Sparkles, Sparkle } from 'lucide-react';

// ── Images vedette locales (haute résolution, issues des dossiers réels) ─────────
const FEATURED_IMAGES = [
  {
    url: '/assets/montres/rolex.jpg',
    label: 'Montres d\'exception',
  },
  {
    url: '/assets/parfums/chanel.jpg',
    label: 'Parfums de luxe',
  },
  {
    url: '/assets/chapelets/chapelet 3.jpg',
    label: 'Chapelets authentiques',
  },
  {
    url: '/assets/bracelets/top.jpg',
    label: 'Bracelets & Bijoux',
  },
];

// ── Catégories d'univers (sans Chaussures) ──────────────────────────────────────────────────
const CATEGORIES = [
  {
    icon: 'fa-solid fa-spray-can',
    name: 'Parfums d\'exception',
    desc: 'Des sillages profonds et enveloppants qui subliment chaque instant',
    img: '/assets/parfums/dior.jpg',
  },
  {
    icon: 'fa-solid fa-clock',
    name: 'Montres intemporelles',
    desc: 'L\'alliance du classicisme et de la précision suisse au poignet',
    img: '/assets/montres/horizon montre homme.jpg',
  },
  {
    icon: 'fa-solid fa-hands-praying',
    name: 'Chapelets & Spirituel',
    desc: 'Des pièces artisanales façonnées dans les bois nobles et les pierres précieuses',
    img: '/assets/chapelets/chapelet.jpg',
  },
  {
    icon: 'fa-solid fa-gem',
    name: 'Bracelets & Bijoux',
    desc: 'Des ornements délicats qui complètent votre élégance naturelle',
    img: '/assets/bracelets/bracelet elegant.jpg',
  },
];

export default function Hero({ onExploreClick }) {
  const [activeImg, setActiveImg] = React.useState(0);
  const intervalRef = React.useRef(null);

  // Rotation automatique des images vedette
  React.useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveImg(prev => (prev + 1) % FEATURED_IMAGES.length);
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleImgClick = (i) => {
    setActiveImg(i);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveImg(prev => (prev + 1) % FEATURED_IMAGES.length);
    }, 4000);
  };

  return (
    <section style={{
      backgroundColor: 'var(--bg-dark)',
      overflow: 'hidden',
      position: 'relative',
    }}>

      {/* ══ Blobs décoratifs ══════════════════════════════════════════ */}
      <div style={{
        position: 'absolute', top: '-15%', right: '-8%',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(197,168,128,0.07) 0%, rgba(0,33,90,0.12) 50%, transparent 100%)',
        filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', bottom: '-15%', left: '-8%',
        width: '700px', height: '700px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(105,119,151,0.07) 0%, rgba(0,33,90,0.1) 50%, transparent 100%)',
        filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0,
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>

        {/* ══ Section 1 : Hero Split ════════════════════════════════════ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))',
          gap: 'clamp(2rem, 5vw, 6rem)',
          alignItems: 'center',
          paddingBlock: 'clamp(4rem, 8vw, 8rem)',
        }}>
          {/* Texte côté gauche */}
          <div className="anim-slide-up">
            {/* Badge */}
            <div style={{ marginBottom: '1.8rem' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                background: 'rgba(197,168,128,0.08)',
                border: '1px solid rgba(197,168,128,0.25)',
                padding: '0.5rem 1.2rem', borderRadius: '99px',
                fontSize: 'var(--fs-xs)', fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.2em',
                color: 'var(--color-accent)',
              }}>
                <Sparkles size={13} className="anim-float" aria-hidden="true" />
                Dakar, Sénégal — Collection 2025
              </span>
            </div>

            {/* H1 */}
            <p style={{
              fontSize: 'var(--fs-xs)',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
              marginBottom: '1rem',
              fontWeight: 600,
            }}>
              Après un long moment… nous voilà de retour ✨
            </p>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.4rem, 5.5vw, 4.5rem)',
              color: '#fff',
              lineHeight: 1.08,
              marginBottom: '1.8rem',
              fontWeight: 500,
            }}>
              MAISON <span className="text-gold">HERITAGE</span>
            </h1>

            {/* Citation forte */}
            <blockquote style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.05rem, 2.2vw, 1.35rem)',
              color: 'var(--text-soft)',
              fontStyle: 'italic',
              lineHeight: 1.75,
              borderLeft: '2px solid var(--color-accent)',
              paddingLeft: '1.4rem',
              marginBottom: '2rem',
            }}>
              « Heritage Elixir change de forme. Il grandit, il évolue…
              <br />Parce que le vrai luxe n'est pas dans ce qu'on achète,
              <br />mais dans ce qu'on transmet. »
              <footer style={{
                marginTop: '0.8rem',
                fontSize: 'var(--fs-xs)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-accent)',
                fontStyle: 'normal',
              }}>
                — Bint Khalifa, Fondatrice
              </footer>
            </blockquote>

            {/* Description */}
            <p style={{
              fontSize: 'var(--fs-sm)',
              color: 'var(--text-muted)',
              lineHeight: 1.85,
              maxWidth: '500px',
              marginBottom: '2.8rem',
            }}>
              Un univers né de ma passion pour le beau, l'authentique et l'intemporel.
              Parfums d'exception, montres intemporelles, chapelets authentiques et bracelets délicats —
              <strong style={{ color: 'var(--text-soft)' }}> livraison partout où vous êtes</strong>.
            </p>

            {/* Boutons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={onExploreClick} className="btn-primary">
                Découvrir la Collection <ArrowRight size={15} aria-hidden="true" />
              </button>
              <a
                href="https://wa.me/221774903713"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <i className="fa-brands fa-whatsapp" style={{ color: '#25D366' }}></i> Nous contacter
              </a>
            </div>
          </div>

          {/* Galerie vedette côté droit (mode slide automatique stylé) */}
          <div className="anim-fade-in" style={{ position: 'relative' }}>
            {/* Image principale */}
            <div style={{
              position: 'relative',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid rgba(197,168,128,0.18)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
              aspectRatio: '4/3',
            }}>
              {FEATURED_IMAGES.map((img, i) => (
                <img
                  key={img.url}
                  src={img.url}
                  alt={img.label}
                  draggable={false}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  style={{
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%',
                    objectFit: 'cover',
                    opacity: i === activeImg ? 1 : 0,
                    transform: i === activeImg ? 'scale(1.05)' : 'scale(1)',
                    transition: 'opacity 0.9s ease-in-out, transform 4.5s ease-out',
                    pointerEvents: 'none',
                  }}
                />
              ))}
              {/* Dégradé sur l'image */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(4,9,20,0.65) 0%, transparent 50%)',
                zIndex: 1,
              }} />
              {/* Label image */}
              <div style={{
                position: 'absolute', bottom: '1rem', left: '1rem', zIndex: 2,
              }}>
                <span className="badge badge-gold" style={{ fontSize: '0.62rem', letterSpacing: '0.1em' }}>
                  {FEATURED_IMAGES[activeImg].label}
                </span>
              </div>
            </div>

            {/* Vignettes de navigation (barres de progression premium pour le slide automatique) */}
            <div style={{
              display: 'flex', justifyContent: 'center', gap: '0.8rem',
              marginTop: '1.2rem',
            }}>
              {FEATURED_IMAGES.map((img, i) => (
                <button
                  key={i}
                  onClick={() => handleImgClick(i)}
                  aria-label={`Voir ${img.label}`}
                  style={{
                    width: '60px',
                    height: '4px',
                    borderRadius: '2px',
                    background: 'rgba(197,168,128,0.15)',
                    position: 'relative',
                    overflow: 'hidden',
                    border: 'none',
                    cursor: 'pointer',
                    minHeight: 'unset',
                    padding: 0,
                  }}
                >
                  {i === activeImg && (
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      background: 'var(--color-accent)',
                      animation: 'progressFill 4s linear forwards',
                      width: '100%',
                      transformOrigin: 'left',
                    }} />
                  )}
                </button>
              ))}
            </div>

            {/* Badge flottant */}
            <div className="anim-float" style={{
              position: 'absolute', top: '-18px', right: '-18px',
              background: 'var(--color-primary)',
              border: '2px solid var(--color-accent)',
              borderRadius: '50%', width: '72px', height: '72px',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifycontent: 'center',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              justifyContent: 'center',
              zIndex: 3,
            }}>
              <Sparkle size={18} style={{ color: 'var(--color-accent)' }} aria-hidden="true" />
              <span style={{ fontSize: '0.5rem', letterSpacing: '0.1em', color: 'var(--color-accent)', textTransform: 'uppercase', marginTop: '2px' }}>Premium</span>
            </div>
          </div>
        </div>

        {/* ══ Séparateur ════════════════════════════════════════════════ */}
        <div className="section-divider" />

        {/* ══ Section 2 : Vedette — Univers d'exception (sans chaussures) ════════════════ */}
        <div style={{ paddingBlock: 'clamp(3rem, 6vw, 6rem)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 4vw, 4rem)' }}>
            <span className="text-uppercase-tracking">Nos Univers</span>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--fs-3xl)',
              color: '#fff',
              marginTop: '0.6rem',
            }}>
              L'Excellence dans <span className="text-gold">chaque catégorie</span>
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
            gap: 'clamp(1rem, 2vw, 1.8rem)',
          }}>
            {CATEGORIES.map((cat, i) => (
              <div
                key={i}
                className="glass category-card"
                onClick={onExploreClick}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && onExploreClick()}
                aria-label={`Explorer ${cat.name}`}
                style={{ borderRadius: '16px', overflow: 'hidden', cursor: 'pointer' }}
              >
                {/* Image de catégorie */}
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={cat.img}
                    alt={cat.name}
                    draggable={false}
                    loading="lazy"
                    style={{
                      width: '100%', aspectRatio: '16/9',
                      objectFit: 'cover',
                      transition: 'transform 0.6s ease',
                      display: 'block',
                    }}
                    className="cat-img"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(4,9,20,0.8) 0%, transparent 60%)',
                  }} />
                  <div style={{
                    position: 'absolute', bottom: '10px', left: '12px',
                    fontSize: '1.6rem',
                  }} aria-hidden="true">
                    <i className={`${cat.icon} chic-icon`} style={{ color: 'var(--color-accent)' }}></i>
                  </div>
                </div>

                {/* Texte */}
                <div style={{ padding: 'clamp(0.9rem, 2vw, 1.3rem)' }}>
                  <h3 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'var(--fs-sm)',
                    color: 'var(--color-accent)',
                    marginBottom: '0.4rem',
                    fontWeight: 600,
                  }}>{cat.name}</h3>
                  <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                    {cat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ Section : L'Art du Temps & Mouvement (Vidéo Premium) ════════════ */}
        <div style={{
          paddingBlock: 'clamp(3rem, 6vw, 6rem)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
            gap: 'clamp(2rem, 5vw, 4rem)',
            alignItems: 'center',
          }}>
            {/* Vidéo */}
            <div style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid rgba(197, 168, 128, 0.2)',
              boxShadow: 'var(--shadow-premium)',
            }}>
              <video
                src="/assets/montres/video montres 1.mp4"
                autoPlay
                loop
                muted
                playsInline
                style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(4,9,20,0.4) 0%, transparent 60%)',
                pointerEvents: 'none',
              }} />
            </div>

            {/* Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <span className="text-uppercase-tracking">Prestige &amp; Mouvement</span>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'var(--fs-2xl)',
                color: '#fff',
              }}>
                L'Élégance <span className="text-gold">en Mouvement</span>
              </h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.75', fontSize: 'var(--fs-sm)' }}>
                Ressentez le rythme des secondes. Notre collection de montres d'exception capture l'essence du luxe à travers des mouvements mécaniques et automatiques d'une précision absolue. Une véritable œuvre d'art à votre poignet.
              </p>
              <div>
                <button onClick={onExploreClick} className="btn-secondary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.8rem' }}>
                  Découvrir nos Montres
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ══ Section 3 : Citation finale + CTA ════════════════════════ */}
        <div style={{
          textAlign: 'center',
          padding: 'clamp(3rem, 6vw, 6rem) 0',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}>
          <blockquote style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.2rem, 3vw, 2rem)',
            color: '#fff',
            lineHeight: 1.6,
            fontStyle: 'italic',
            maxWidth: '720px',
            margin: '0 auto 2.5rem',
          }}>
            « Parce que le vrai luxe ne se voit pas.
            <br />Il se ressent. »
            <footer style={{
              marginTop: '1rem',
              fontSize: 'var(--fs-xs)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
              fontStyle: 'normal',
            }}>
              — Maison Heritage
            </footer>
          </blockquote>

          <button onClick={onExploreClick} className="btn-primary" style={{ minWidth: '220px' }}>
            Explorer la Boutique <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>
      </div>

      <style>{`
        .category-card:hover {
          transform: translateY(-6px);
          border-color: rgba(197,168,128,0.35) !important;
          box-shadow: 0 16px 40px rgba(197,168,128,0.12);
        }
        .category-card:hover .cat-img {
          transform: scale(1.07);
        }
        @keyframes progressFill {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </section>
  );
}
