import React from 'react';
import { Heart, Star, Shield, Truck, Users, Award } from 'lucide-react';

const VALUES = [
  {
    icon: <Heart size={28} style={{ color: 'var(--color-accent)' }} aria-hidden="true" />,
    title: 'Authenticité',
    desc: 'Chaque produit est soigneusement sélectionné pour son authenticité et sa qualité irréprochable. Nous ne faisons aucun compromis.'
  },
  {
    icon: <Star size={28} style={{ color: 'var(--color-accent)' }} aria-hidden="true" />,
    title: 'Excellence',
    desc: 'De l\'emballage à la livraison, chaque étape reflète notre exigence du détail et notre amour du beau.'
  },
  {
    icon: <Shield size={28} style={{ color: 'var(--color-accent)' }} aria-hidden="true" />,
    title: 'Confiance',
    desc: 'Votre satisfaction est notre priorité. Transactions sécurisées, produits garantis, service client toujours disponible.'
  },
  {
    icon: <Truck size={28} style={{ color: 'var(--color-accent)' }} aria-hidden="true" />,
    title: 'Accessibilité',
    desc: 'Livraison partout au Sénégal et au-delà. Le luxe vient jusqu\'à vous, où que vous soyez.'
  },
  {
    icon: <Users size={28} style={{ color: 'var(--color-accent)' }} aria-hidden="true" />,
    title: 'Communauté',
    desc: 'Maison Heritage, c\'est avant tout une famille. Une communauté d\'amateurs du beau qui partagent une même vision du raffinement.'
  },
  {
    icon: <Award size={28} style={{ color: 'var(--color-accent)' }} aria-hidden="true" />,
    title: 'Héritage',
    desc: 'Nous croyons que les belles choses se transmettent. Notre sélection est pensée pour durer, pour marquer les esprits et les générations.'
  },
];

export default function APropos() {
  return (
    <section style={{
      backgroundColor: 'var(--bg-dark)',
      minHeight: 'calc(100vh - var(--header-h))',
      paddingBlock: 'clamp(4rem, 8vw, 8rem)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Déco blobs */}
      <div style={{
        position: 'absolute', top: '-10%', right: '-5%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(197,168,128,0.06) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', left: '-5%',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,33,90,0.12) 0%, transparent 70%)',
        filter: 'blur(80px)', pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── En-tête ── */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 6vw, 6rem)' }} className="anim-fade-in">
          <span className="text-uppercase-tracking">Notre Histoire</span>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            color: '#fff',
            marginTop: '0.6rem',
            marginBottom: '1.5rem',
            lineHeight: 1.1,
          }}>
            À Propos de <span className="text-gold">Maison Heritage</span>
          </h1>
          <p style={{
            maxWidth: '680px',
            margin: '0 auto',
            color: 'var(--text-muted)',
            fontSize: 'var(--fs-md)',
            lineHeight: 1.85,
          }}>
            Un univers né d'une passion authentique pour le beau, l'élégant et l'intemporel.
            Fondée à Dakar, Maison Heritage est bien plus qu'une boutique — c'est une histoire, une vision, un héritage.
          </p>
        </div>

        {/* ── Histoire de la fondatrice ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
          gap: 'clamp(3rem, 6vw, 6rem)',
          alignItems: 'center',
          marginBottom: 'clamp(5rem, 10vw, 10rem)',
        }}>
          {/* Texte */}
          <div className="anim-slide-up">
            <span className="text-uppercase-tracking" style={{ marginBottom: '1rem', display: 'block' }}>Fondatrice</span>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--fs-3xl)',
              color: '#fff',
              marginBottom: '1.5rem',
            }}>
              Bint Khalifa — <span className="text-gold">Une vision du luxe accessible</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.85, marginBottom: '1.2rem', fontSize: 'var(--fs-sm)' }}>
              Tout a commencé avec une conviction simple : le luxe ne devrait pas être réservé à une élite.
              Il devrait être accessible, authentique, et ancré dans notre culture.
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.85, marginBottom: '1.2rem', fontSize: 'var(--fs-sm)' }}>
              Bint Khalifa a fondé <strong style={{ color: 'var(--color-accent)' }}>Maison Heritage</strong> avec l'ambition
              de rassembler le meilleur des parfums d'exception, des montres intemporelles, des chapelets
              authentiques et des bijoux raffinés, le tout livré directement à votre porte.
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.85, fontSize: 'var(--fs-sm)' }}>
              Après une pause bien méritée, la Maison revient plus forte, plus belle, et plus complète —
              avec une promesse renouvelée : <em style={{ color: 'var(--text-soft)', fontStyle: 'italic' }}>vous offrir le meilleur de ce monde</em>.
            </p>

            <div style={{
              marginTop: '2rem',
              padding: '1.2rem 1.5rem',
              borderLeft: '3px solid var(--color-accent)',
              background: 'rgba(197,168,128,0.04)',
              borderRadius: '0 8px 8px 0',
            }}>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1rem, 2.2vw, 1.3rem)',
                color: '#fff',
                fontStyle: 'italic',
                lineHeight: 1.7,
              }}>
                « Heritage Elixir change de forme. Il grandit, il évolue…
                Parce que le vrai luxe n'est pas dans ce qu'on achète,
                mais dans ce qu'on transmet. »
              </p>
              <p style={{ color: 'var(--color-accent)', fontSize: 'var(--fs-xs)', marginTop: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                — Bint Khalifa, Fondatrice de Maison Heritage
              </p>
            </div>
          </div>

          {/* Visuel */}
          <div className="anim-fade-in" style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid var(--border-gold)',
              boxShadow: 'var(--shadow-premium)',
              aspectRatio: '3/4',
              background: 'var(--bg-card-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <img
                src="/assets/parfums/chanel.jpg"
                alt="Maison Heritage — Collection"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { e.target.style.display = 'none'; }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(4,9,20,0.7) 0%, transparent 50%)',
              }} />
              <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem' }}>
                <p style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'var(--fs-xl)',
                  color: '#fff',
                  lineHeight: 1.3,
                }}>
                  Dakar, Sénégal
                </p>
                <p style={{ color: 'var(--color-accent)', fontSize: 'var(--fs-xs)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  Collection 2025
                </p>
              </div>
            </div>

            {/* Badge flottant */}
            <div className="glass-gold anim-float" style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              padding: '1rem',
              borderRadius: '16px',
              textAlign: 'center',
              minWidth: '100px',
            }}>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-accent)', lineHeight: 1 }}>10×</p>
              <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', marginTop: '4px' }}>Plus grand<br />qu'avant</p>
            </div>
          </div>
        </div>

        {/* ── Nos Valeurs ── */}
        <div style={{ marginBottom: 'clamp(5rem, 10vw, 10rem)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 5vw, 4rem)' }}>
            <span className="text-uppercase-tracking">Ce qui nous guide</span>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--fs-3xl)',
              color: '#fff',
              marginTop: '0.5rem',
            }}>
              Nos <span className="text-gold">Valeurs Fondamentales</span>
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: 'clamp(1.2rem, 2vw, 2rem)',
          }}>
            {VALUES.map((v, i) => (
              <div
                key={i}
                className="glass"
                style={{
                  padding: 'clamp(1.5rem, 3vw, 2rem)',
                  borderRadius: '16px',
                  border: '1px solid rgba(197,168,128,0.12)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(197,168,128,0.35)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(197,168,128,0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(197,168,128,0.12)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ marginBottom: '1rem' }}>{v.icon}</div>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'var(--fs-lg)',
                  color: '#fff',
                  marginBottom: '0.6rem',
                }}>{v.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)', lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Chiffres clés ── */}
        <div className="glass-gold" style={{
          padding: 'clamp(2rem, 5vw, 4rem)',
          borderRadius: '24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))',
          gap: '2rem',
          textAlign: 'center',
          marginBottom: 'clamp(5rem, 10vw, 10rem)',
        }}>
          {[
            { value: '4+', label: 'Catégories de produits' },
            { value: '50+', label: 'Articles en boutique' },
            { value: <i className="fa-solid fa-earth-africa"></i>, label: 'Livraison Sénégal & monde' },
            { value: '100%', label: 'Authenticité garantie' },
          ].map((stat, i) => (
            <div key={i}>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                color: 'var(--color-accent)',
                lineHeight: 1,
                marginBottom: '0.5rem',
              }}>{stat.value}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-xs)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── CTA final ── */}
        <div style={{ textAlign: 'center' }}>
          <blockquote style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
            color: '#fff',
            fontStyle: 'italic',
            lineHeight: 1.7,
            maxWidth: '700px',
            margin: '0 auto 2rem',
          }}>
            « Bienvenue dans la Maison Heritage. Bienvenue dans votre héritage. »
          </blockquote>
          <a
            href="https://wa.me/221774903713"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <i className="fa-brands fa-whatsapp" style={{ fontSize: '1.2rem' }}></i> Nous contacter sur WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
