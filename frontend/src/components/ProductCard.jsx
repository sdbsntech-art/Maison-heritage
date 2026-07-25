import React from 'react';
import { ShoppingCart, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react';

export default function ProductCard({ product, onAddToCart, onInquireNow }) {
  const { name, category, price, description, imageUrl, inStock, isPromo } = product;
  const hasPrice = price && price > 0;

  const formattedPrice = hasPrice
    ? new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
    : 'Prix sur demande';

  return (
    <article
      className="glass product-card"
      aria-label={`Produit : ${name}`}
      style={{ position: 'relative' }}
    >
      {/* ── Image ── */}
      <div className="product-card-image-wrap" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Badge catégorie */}
        <span
          className="badge badge-gold"
          style={{
            position: 'absolute', top: '12px', left: '12px', zIndex: 10,
            fontSize: 'var(--fs-xs)', letterSpacing: '0.1em',
          }}
          aria-label={`Catégorie : ${category}`}
        >
          {category}
        </span>

        {/* Badge Promotion */}
        {isPromo && (
          <span
            className="badge"
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              zIndex: 10,
              fontSize: 'var(--fs-xs)',
              letterSpacing: '0.05em',
              backgroundColor: 'rgba(34, 197, 94, 0.9)',
              backdropFilter: 'blur(4px)',
              color: '#ffffff',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              padding: '0.35rem 0.7rem',
              borderRadius: '4px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.25)'
            }}
          >
            🟢 En promotion
          </span>
        )}

        <img
          src={imageUrl || ''}
          alt={`Photo de ${name}`}
          className="product-card-image"
          draggable={false}
          loading="lazy"
          onError={(e) => { 
            e.target.style.display = 'none';
            const placeholder = e.target.parentElement.querySelector('.product-card-placeholder');
            if (placeholder) placeholder.style.display = 'flex';
          }}
        />
        <div 
          className="product-card-placeholder" 
          style={{ 
            aspectRatio: '1/1', 
            display: imageUrl ? 'none' : 'flex' 
          }} 
          aria-hidden="true"
        >
          <Sparkles size={28} style={{ color: 'var(--color-accent)', opacity: 0.65 }} className="anim-float" />
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Maison Heritage
          </span>
          <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', opacity: 0.6 }}>
            {name}
          </span>
        </div>

        {/* Overlay rupture de stock */}
        {!inStock && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(4,9,20,0.82)', zIndex: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }} aria-label="Article en rupture de stock">
            <span className="badge badge-danger" style={{ fontSize: 'var(--fs-xs)', padding: '0.45rem 1rem' }}>
              Rupture
            </span>
          </div>
        )}
      </div>

      {/* ── Contenu ── */}
      <div className="product-card-body">
        <h3 className="product-card-title">{name}</h3>
        <p className="product-card-desc">{description}</p>

        {/* Prix + stock */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem', marginTop: 'auto',
        }}>
          <span
            className={`product-card-price${!hasPrice ? ' on-demand' : ''}`}
            aria-label={`Prix : ${formattedPrice}`}
          >
            {formattedPrice}
          </span>
          <span style={{
            display: 'flex', alignItems: 'center', gap: '0.3rem',
            fontSize: 'var(--fs-xs)',
            color: inStock ? '#22c55e' : '#f59e0b',
          }}>
            {inStock
              ? <><CheckCircle size={12} aria-hidden="true" /> Disponible</>
              : <><AlertTriangle size={12} aria-hidden="true" /> Sur commande</>
            }
          </span>
        </div>

        {/* Boutons d'action */}
        <div className="product-card-actions">
          <button
            onClick={() => onInquireNow(product)}
            className="card-btn-inquire"
            aria-label={hasPrice ? `Acheter ${name} directement` : `Demander le prix de ${name} sur WhatsApp`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}
          >
            <i className="fa-brands fa-whatsapp" style={{ color: '#25D366', fontSize: '1.1rem' }}></i>
            {hasPrice ? 'Acheter Direct' : 'Demander / WhatsApp'}
          </button>

          {inStock && (
            <button
              onClick={() => onAddToCart(product)}
              className="card-btn-cart"
              aria-label={`Ajouter ${name} au panier`}
              title="Ajouter au Panier"
            >
              <ShoppingCart size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
