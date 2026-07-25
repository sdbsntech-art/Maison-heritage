import React from 'react';
import { X, Plus, Minus, Trash2, Send } from 'lucide-react';
import { submitOrder } from '../utils/orders';

export default function Cart({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveFromCart }) {
  if (!isOpen) return null;

  // Format price helper
  const formatPrice = (val) => {
    return new Intl.NumberFormat('fr-FR').format(val) + " FCFA";
  };

  // Calculate cart total (only include items that have a price > 0)
  const total = cartItems.reduce((acc, item) => {
    const itemPrice = item.price && item.price > 0 ? item.price : 0;
    return acc + (itemPrice * item.quantity);
  }, 0);

  // Check if any item in the cart has no defined price
  const hasUnpricedItems = cartItems.some(item => !item.price || item.price <= 0);

  // Generate WhatsApp text and redirect
  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    let message = "Bonjour *Maison Heritage*, ✨\n\nJe souhaite passer une commande pour les articles suivants :\n";
    
    cartItems.forEach((item) => {
      const hasPrice = item.price && item.price > 0;
      message += `🔹 *${item.name}* (Catégorie: ${item.category})\n`;
      message += `   Quantité : ${item.quantity}\n`;
      if (hasPrice) {
        message += `   Prix : ${formatPrice(item.price)} / unité\n`;
        message += `   Sous-total : ${formatPrice(item.price * item.quantity)}\n\n`;
      } else {
        message += `   Prix : Prix sur demande (à confirmer par le vendeur)\n\n`;
      }
    });

    message += `💵 *Total partiel de la commande : ${formatPrice(total)}*\n`;
    if (hasUnpricedItems) {
      message += `💡 _Note: Le total final sera ajusté avec le vendeur pour les articles sans prix défini._\n`;
    }
    message += `\n📍 Boutique en ligne | Livraison partout où vous êtes\n`;
    message += `Pouvez-vous me confirmer la disponibilité et les modalités de livraison ? Merci ! ❤️`;

    // Enregistre la commande pour le tableau de bord admin
    await submitOrder({ items: cartItems, total });

    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/221774903713?text=${encodedText}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(4, 9, 20, 0.65)',
      backdropFilter: 'blur(4px)',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      {/* Backdrop overlay */}
      <div 
        onClick={onClose} 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          cursor: 'pointer'
        }} 
      />

      {/* Cart Slider */}
      <div className="glass-gold cart-drawer-panel" style={{
        position: 'relative',
        zIndex: 1001,
        width: '100%',
        maxWidth: '460px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 35px rgba(0,0,0,0.5)',
        borderLeft: '1px solid var(--border-dark)',
        animation: 'slideLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{
            fontSize: '1.4rem',
            fontFamily: 'var(--font-serif)',
            color: '#ffffff'
          }}>
            Votre Panier <span style={{ fontSize: '1rem', color: 'var(--color-accent)', fontWeight: '600' }}>({cartItems.length})</span>
          </h2>
          <button 
            onClick={onClose}
            style={{
              color: 'var(--text-muted)',
              padding: '6px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.03)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            className="close-cart-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content list */}
        <div style={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem'
        }} className="cart-items-container">
          {cartItems.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '60%',
              gap: '1rem',
              color: 'var(--text-muted)',
              textAlign: 'center'
            }}>
              <i className="fa-solid fa-bag-shopping" style={{ fontSize: '3.5rem', color: 'var(--color-accent)' }}></i>
              <p style={{ fontSize: '1.05rem', fontFamily: 'var(--font-serif)' }}>Votre panier est encore vide.</p>
              <p style={{ fontSize: '0.8rem', maxWidth: '240px' }}>
                Parcourez nos collections et ajoutez des articles pour commencer.
              </p>
              <button 
                onClick={onClose} 
                className="btn-primary" 
                style={{ marginTop: '1rem', padding: '0.7rem 1.5rem', fontSize: '0.75rem' }}
              >
                Continuer mes achats
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const hasPrice = item.price && item.price > 0;
              return (
                <div 
                  key={item.id} 
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '1rem',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.04)',
                    borderRadius: '10px',
                    position: 'relative'
                  }}
                >
                  {/* Item Thumbnail or Placeholder */}
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                        border: '1px solid rgba(255, 255, 255, 0.05)'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none'; // Fallback to placeholder if broken
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(197, 168, 128, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-accent)',
                      fontSize: '0.5rem',
                      fontFamily: 'var(--font-serif)',
                      textTransform: 'uppercase',
                      textAlign: 'center',
                      padding: '4px'
                    }}>
                      Maison Heritage
                    </div>
                  )}

                  {/* Item Details */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    flexGrow: 1
                  }}>
                    <div>
                      <h4 style={{
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        color: '#ffffff',
                        marginBottom: '2px'
                      }}>{item.name}</h4>
                      <span style={{
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        color: 'var(--color-accent)',
                        letterSpacing: '0.05em',
                        fontWeight: '500'
                      }}>{item.category}</span>
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '0.5rem'
                    }}>
                      {/* Quantity modifier */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '6px',
                        padding: '2px'
                      }}>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          style={{
                            color: 'var(--text-light)',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{
                          padding: '0 8px',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          minWidth: '24px',
                          textAlign: 'center'
                        }}>{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          style={{
                            color: 'var(--text-light)',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Item Price */}
                      <span style={{
                        fontSize: '0.95rem',
                        fontWeight: '700',
                        color: 'var(--color-accent)',
                        fontStyle: hasPrice ? 'normal' : 'italic'
                      }}>
                        {hasPrice ? formatPrice(item.price * item.quantity) : "Sur demande"}
                      </span>
                    </div>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => onRemoveFromCart(item.id)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      color: 'rgba(239, 68, 68, 0.6)',
                      padding: '4px',
                      borderRadius: '4px',
                      transition: 'var(--transition-fast)'
                    }}
                    className="remove-item-btn"
                    title="Retirer l'article"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            backgroundColor: 'rgba(4, 9, 20, 0.9)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Total partiel</span>
              <span style={{ fontSize: '1.35rem', fontWeight: '700', color: 'var(--color-accent)' }}>
                {formatPrice(total)}
              </span>
            </div>
            
            {hasUnpricedItems && (
              <p style={{
                fontSize: '0.72rem',
                color: 'var(--color-accent)',
                lineHeight: '1.3',
                textAlign: 'center',
                backgroundColor: 'rgba(197, 168, 128, 0.05)',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid rgba(197, 168, 128, 0.15)'
              }}>
                ⚠️ Certains articles sont sur demande, leur coût s'ajoutera après confirmation.
              </p>
            )}

            <button 
              onClick={handleCheckout} 
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '1.1rem',
                fontSize: '0.9rem'
              }}
            >
              Passer la commande via WhatsApp <Send size={16} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .close-cart-btn:hover {
          color: var(--color-accent) !important;
          background-color: rgba(197, 168, 128, 0.1) !important;
        }
        .remove-item-btn:hover {
          color: rgba(239, 68, 68, 1) !important;
          background-color: rgba(239, 68, 68, 0.05);
        }
      `}</style>
    </div>
  );
}
