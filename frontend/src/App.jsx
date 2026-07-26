import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import ContactForm from './components/ContactForm';
import AdminPanel from './components/AdminPanel';
import APropos from './components/APropos';
import PolitiqueConfidentialite from './components/PolitiqueConfidentialite';
import { loadProducts } from './utils/db';
import { isApiAvailable } from './utils/api';
import { installContentProtection, secureExternalLinks, sanitizeStoredProducts } from './utils/security';
import { MessageSquare, ShoppingBag } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = React.useState('home');
  const [products, setProducts] = React.useState([]);
  const [productsLoading, setProductsLoading] = React.useState(true);
  const [apiOnline, setApiOnline] = React.useState(false);
  const [cartItems, setCartItems] = React.useState([]);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [cartFabPosition, setCartFabPosition] = React.useState(() => ({
    left: 24,
    top: typeof window !== 'undefined' ? Math.max(24, window.innerHeight - 136) : 24,
  }));
  const dragStateRef = React.useRef({ active: false, pointerId: null, startX: 0, startY: 0, originLeft: 0, originTop: 0, moved: false });
  
  // Boutique Filters
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('Toutes');

  // SEO dynamique selon l’onglet actif
  React.useEffect(() => {
    const titleMap = {
      home: 'Maison Heritage by Bint Khalifa | Parfums, Montres, Chapelets & Bracelets de Luxe à Dakar',
      boutique: 'Boutique Maison Heritage by Bint Khalifa | Parfums, Montres & Accessoires de Luxe',
      apropos: 'À propos de Maison Heritage by Bint Khalifa | Luxe, Authenticité & Dakar',
      politique: 'Politique de confidentialité | Maison Heritage by Bint Khalifa',
      contact: 'Contact Maison Heritage by Bint Khalifa | WhatsApp & Livraison au Sénégal',
      admin: 'Administration Maison Heritage by Bint Khalifa',
    };

    const descriptionMap = {
      home: 'Maison Heritage by Bint Khalifa, aussi recherchée sous Bint Khalifa, Zayel Khalifa et Dibor, propose des parfums d’exception, montres, chapelets et bracelets de luxe à Dakar.',
      boutique: 'Découvrez la boutique Maison Heritage by Bint Khalifa avec des parfums, montres, chapelets et accessoires raffinés à Dakar.',
      apropos: 'Découvrez l’histoire et l’univers de Maison Heritage by Bint Khalifa, marque de luxe inspirée par l’authenticité et le raffinement.',
      politique: 'Consultez la politique de confidentialité de Maison Heritage by Bint Khalifa.',
      contact: 'Contactez Maison Heritage by Bint Khalifa par WhatsApp pour vos commandes et livraisons au Sénégal.',
      admin: 'Zone d’administration Maison Heritage by Bint Khalifa.',
    };

    document.title = titleMap[activeTab] || titleMap.home;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute('content', descriptionMap[activeTab] || descriptionMap.home);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', titleMap[activeTab] || titleMap.home);
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', descriptionMap[activeTab] || descriptionMap.home);
  }, [activeTab]);

  // Raccourci clavier secret pour le panneau administration
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      const keyIsA = e.key?.toLowerCase() === 'a' || e.code === 'KeyA' || e.key === 'æ' || e.key === 'Æ';
      const isCombo = (e.ctrlKey && e.altKey) || (e.altKey && e.metaKey) || (e.ctrlKey && e.shiftKey && keyIsA);
      if (isCombo && keyIsA) {
        e.preventDefault();
        setActiveTab(prev => prev === 'admin' ? 'home' : 'admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Load products & cart on mount — install security protections
  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      const online = await isApiAvailable();
      if (!cancelled) setApiOnline(online);

      try {
        const loaded = await loadProducts();
        if (!cancelled) setProducts(loaded);
      } finally {
        if (!cancelled) setProductsLoading(false);
      }
    })();

    // Sécurisé : parse JSON avec gestion d'erreur + sanitisation
    try {
      const savedCart = localStorage.getItem('maison_heritage_cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        // Valide que c'est bien un tableau
        if (Array.isArray(parsed)) {
          setCartItems(sanitizeStoredProducts(parsed));
        }
      }
    } catch {
      // Données corrompues — on efface et repart propre
      localStorage.removeItem('maison_heritage_cart');
    }

    // Installe les protections anti-copie et sécurise les liens
    installContentProtection();
    secureExternalLinks();

    return () => { cancelled = true; };
  }, []);

  // Save cart to localstorage whenever it changes
  const saveCartToStorage = (items) => {
    setCartItems(items);
    localStorage.setItem("maison_heritage_cart", JSON.stringify(items));
  };

  const clampFabPosition = React.useCallback((left, top) => {
    const buttonSize = 56;
    const maxLeft = typeof window !== 'undefined' ? Math.max(12, window.innerWidth - buttonSize - 12) : 12;
    const maxTop = typeof window !== 'undefined' ? Math.max(12, window.innerHeight - buttonSize - 12) : 12;
    return {
      left: Math.min(Math.max(left, 12), maxLeft),
      top: Math.min(Math.max(top, 12), maxTop),
    };
  }, []);

  const handleFabPointerDown = (event) => {
    if (event.button !== 0) return;
    dragStateRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originLeft: cartFabPosition.left,
      originTop: cartFabPosition.top,
      moved: false,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handleFabPointerMove = (event) => {
    if (!dragStateRef.current.active || event.pointerId !== dragStateRef.current.pointerId) return;
    const deltaX = event.clientX - dragStateRef.current.startX;
    const deltaY = event.clientY - dragStateRef.current.startY;
    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      dragStateRef.current.moved = true;
    }
    const nextPosition = clampFabPosition(dragStateRef.current.originLeft + deltaX, dragStateRef.current.originTop + deltaY);
    setCartFabPosition(nextPosition);
  };

  const handleFabPointerUp = (event) => {
    if (!dragStateRef.current.active || event.pointerId !== dragStateRef.current.pointerId) return;
    if (!dragStateRef.current.moved) {
      setCartOpen(true);
    }
    dragStateRef.current = { active: false, pointerId: null, startX: 0, startY: 0, originLeft: 0, originTop: 0, moved: false };
  };

  const handleFabClick = (event) => {
    if (dragStateRef.current.moved) {
      event.preventDefault();
      event.stopPropagation();
      dragStateRef.current.moved = false;
      return;
    }
    setCartOpen(true);
  };

  React.useEffect(() => {
    const handleResize = () => {
      setCartFabPosition((current) => clampFabPosition(current.left, current.top));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [clampFabPosition]);

  // Sync products list when Admin panel modifies them
  const handleProductsChange = async () => {
    const loaded = await loadProducts();
    setProducts(loaded);
    setApiOnline(await isApiAvailable(true));
  };

  // Add item to cart
  const handleAddToCart = (product) => {
    const existing = cartItems.find(item => item.id === product.id);
    if (existing) {
      const updated = cartItems.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      saveCartToStorage(updated);
    } else {
      const updated = [...cartItems, { ...product, quantity: 1 }];
      saveCartToStorage(updated);
    }
    // Automatically open cart drawer
    setCartOpen(true);
  };

  // Update item quantity in cart
  const handleUpdateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    const updated = cartItems.map(item => 
      item.id === id ? { ...item, quantity: quantity } : item
    );
    saveCartToStorage(updated);
  };

  // Remove item from cart
  const handleRemoveFromCart = (id) => {
    const updated = cartItems.filter(item => item.id !== id);
    saveCartToStorage(updated);
  };

  // Quick Direct Purchase Inquiry (opens WhatsApp for 1 product immediately)
  const handleInquireNow = (product) => {
    const formatPrice = (val) => new Intl.NumberFormat('fr-FR').format(val) + " FCFA";
    const text = `Bonjour *Maison Heritage*, ✨\n\nJe suis très intéressé(e) par l'article suivant et souhaite finaliser l'achat :\n\n📦 *Produit :* ${product.name}\n📂 *Catégorie :* ${product.category}\n💵 *Prix :* ${formatPrice(product.price)}\n\nEst-il actuellement disponible pour une livraison ? Merci !`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/221774903713?text=${encodedText}`, '_blank');
  };

  // Get filtered products for Boutique
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Toutes' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredProducts = products.filter(p => p.isFeatured);

  return (
    <div className="page-layout">

      <Header
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)} 
        onCartClick={() => setCartOpen(true)}
        onAdminClick={() => setActiveTab(activeTab === 'admin' ? 'home' : 'admin')}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main content router */}
      <main>
        {activeTab === 'home' && (
          <>
            <Hero onExploreClick={() => setActiveTab('boutique')} />

            {/* Section éditoriale — message de bienvenue */}
            <section className="welcome-editorial">
              <div className="container welcome-grid">
                <div className="welcome-text anim-slide-up">
                  <span className="text-uppercase-tracking">Bienvenue dans votre héritage</span>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-3xl)', color: '#fff', margin: '0.75rem 0 1.5rem' }}>
                    Le nouveau chapitre <span className="text-gold">commence maintenant</span>
                  </h2>
                  <p>
                    Vous nous avez manqué. Et nous avions tant à vous dire. Je suis <strong style={{ color: 'var(--color-accent)' }}>Bint Khalifa</strong>,
                    et j'ai le plaisir de vous présenter <strong>Maison Heritage by Bint Khalifa</strong> — un univers 10× plus grand, pensé rien que pour vous.
                    Notre boutique est également recherchée sous les noms <strong>Zayel Khalifa</strong> et <strong>Dibor</strong> pour les passionnés de luxe à Dakar et à travers le Sénégal.
                  </p>
                  <div className="welcome-categories">
                    <div className="welcome-cat-item">
                      <i className="fa-solid fa-spray-can" style={{ color: 'var(--color-accent)', marginRight: '8px' }}></i>
                      <strong>Parfums d'exception</strong> pour laisser votre empreinte
                    </div>
                    <div className="welcome-cat-item">
                      <i className="fa-solid fa-clock" style={{ color: 'var(--color-accent)', marginRight: '8px' }}></i>
                      <strong>Montres intemporelles</strong> qui traversent les générations
                    </div>
                    <div className="welcome-cat-item">
                      <i className="fa-solid fa-hands-praying" style={{ color: 'var(--color-accent)', marginRight: '8px' }}></i>
                      <strong>Chapelets authentiques</strong> pour vos moments de paix
                    </div>
                    <div className="welcome-cat-item">
                      <i className="fa-solid fa-gem" style={{ color: 'var(--color-accent)', marginRight: '8px' }}></i>
                      <strong>Bracelets et Bijoux</strong> pour compléter votre parure
                    </div>
                  </div>
                  <p style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-display)', fontSize: 'var(--fs-lg)', fontStyle: 'italic' }}>
                    Le même amour du détail. La même exigence de qualité. ❤️
                  </p>
                </div>
                <div className="anim-fade-in" style={{ position: 'relative' }}>
                  <div style={{
                    borderRadius: '4px', overflow: 'hidden',
                    border: '1px solid var(--border-gold)',
                    boxShadow: 'var(--shadow-premium)',
                  }}>
                    <img
                      src="https://images.unsplash.com/photo-1612817288484-6f916006741a?w=900&q=85&auto=format&fit=crop"
                      alt="Collection Maison Heritage"
                      style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', display: 'block' }}
                      loading="lazy"
                    />
                  </div>
                  <div className="glass-gold" style={{
                    position: 'absolute', bottom: '-20px', left: '-20px',
                    padding: '1rem 1.5rem', borderRadius: '4px',
                    maxWidth: '220px',
                  }}>
                    <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>📍 Dakar</p>
                    <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-soft)', marginTop: '4px' }}>Livraison partout au Sénégal</p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Featured Products Section */}
            {featuredProducts.length > 0 && (
              <section style={{
                padding: '5rem 0',
                backgroundColor: '#050c18',
                borderTop: '1px solid rgba(197, 168, 128, 0.1)'
              }}>
                <div className="container">
                  <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <span className="text-uppercase-tracking">Sélection Exclusive</span>
                    <h2 style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '2.5rem',
                      color: '#ffffff',
                      marginTop: '0.5rem'
                    }}>
                      NOS CRÉATIONS <span className="text-gold">VEDETTES</span>
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                      Une attention infinie portée à chaque détail. Le raffinement par Maison Heritage.
                    </p>
                  </div>

                  <div className="grid-products">
                    {featuredProducts.slice(0, 4).map(product => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        onAddToCart={handleAddToCart}
                        onInquireNow={handleInquireNow}
                      />
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3.5rem' }}>
                    <button 
                      onClick={() => setActiveTab('boutique')}
                      className="btn-secondary"
                    >
                      Voir Toute La Boutique
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* Editorial Brand Announcement Info section */}
            <section style={{
              padding: '6rem 0',
              backgroundColor: 'var(--bg-dark)',
              backgroundImage: 'linear-gradient(rgba(4,9,20,0.9), rgba(2,5,12,0.95))',
              position: 'relative'
            }}>
              <div className="container" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '4rem',
                alignItems: 'center'
              }}>
                {/* Visual Image Overlay */}
                <div style={{
                  position: 'relative',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid rgba(197, 168, 128, 0.25)',
                  boxShadow: 'var(--shadow-premium)',
                  paddingTop: '80%'
                }}>
                  <img 
                    src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80" 
                    alt="Brand Image"
                    style={{
                      position: 'absolute',
                      top: 0, left: 0, width: '100%', height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,33,90,0.2)',
                    mixBlendMode: 'overlay'
                  }} />
                </div>

                {/* Editorial text */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <span className="text-uppercase-tracking">Maison Heritage Dakar</span>
                  <h3 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '2rem',
                    color: '#ffffff'
                  }}>
                    L'Exigence du Détail, <span className="text-gold">La Qualité Transmise</span>
                  </h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                    Chaque parfum d’exception laisse une empreinte olfactive unique. Chaque montre intemporelle traverse les générations. Chaque chapelet authentique vous apporte paix et sérénité. Chaque bracelet délicat complète votre parure.
                  </p>
                  <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                    Chez <strong>Maison Heritage by Bint Khalifa</strong>, nous croyons que l'authenticité est le plus grand des luxes. C'est pourquoi nous veillons à la qualité irréprochable de chacun de nos articles.
                  </p>
                  
                  {/* Delivery banner info */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1.5rem',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    paddingTop: '1.5rem',
                    marginTop: '0.5rem'
                  }}>
                    <div>
                      <h4 style={{ color: 'var(--color-accent)', fontWeight: '600', fontSize: '0.95rem' }}>📍 Dakar</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Boutique physique et retrait facile</p>
                    </div>
                    <div>
                      <h4 style={{ color: 'var(--color-accent)', fontWeight: '600', fontSize: '0.95rem' }}>🚚 Livraison</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Expédition rapide partout au Sénégal</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'boutique' && (
          <section style={{
            padding: '5rem 0',
            backgroundColor: 'var(--bg-dark)'
          }}>
            <div className="container">
              {/* Boutique Title */}
              <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                <span className="text-uppercase-tracking">Notre Collection</span>
                <h2 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2.5rem',
                  color: '#ffffff',
                  marginTop: '0.5rem'
                }}>
                  LA BOUTIQUE <span className="text-gold">HERITAGE</span>
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  Boutique en ligne — livraison partout où vous êtes · Parfums, montres, chapelets &amp; bracelets
                </p>
              </div>

              {/* Filters & Search Control Bar */}
              <div className="glass" style={{
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid rgba(197, 168, 128, 0.15)',
                marginBottom: '3rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.2rem'
              }}>
                {/* Category tags */}
                <div style={{
                  display: 'flex',
                  gap: '0.6rem',
                  overflowX: 'auto',
                  paddingBottom: '8px',
                  scrollbarWidth: 'thin'
                }} className="category-scroll">
                  {['Toutes', 'Parfums', 'Montres', 'Chapelets', 'Bracelets'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`filter-tag ${selectedCategory === cat ? 'active' : ''}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Search & Sort Panel */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  {/* Search Bar */}
                  <input 
                    type="text" 
                    placeholder="Rechercher un produit d'exception..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-input"
                    style={{
                      flexGrow: 1,
                      maxWidth: '450px',
                      padding: '0.7rem 1.2rem',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              </div>

              {/* Products Grid rendering */}
              {filteredProducts.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '5rem 0',
                  color: 'var(--text-muted)'
                }}>
                  <p style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)' }}>Aucun article ne correspond à votre recherche.</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setSelectedCategory('Toutes'); }}
                    className="btn-primary" 
                    style={{ marginTop: '1.5rem', padding: '0.7rem 1.5rem', fontSize: '0.75rem' }}
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              ) : (
                <div className="grid-products">
                  {filteredProducts.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onAddToCart={handleAddToCart}
                      onInquireNow={handleInquireNow}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'contact' && (
          <ContactForm />
        )}

        {activeTab === 'apropos' && (
          <APropos />
        )}

        {activeTab === 'politique' && (
          <PolitiqueConfidentialite />
        )}

        {activeTab === 'admin' && (
          <AdminPanel 
            products={products}
            onProductsChange={handleProductsChange}
            apiOnline={apiOnline}
          />
        )}
      </main>

      {/* Cart Drawer */}
      <Cart 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)} 
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveFromCart={handleRemoveFromCart}
      />

      {/* Bouton Panier déplaçable — au-dessus du WhatsApp */}
      <button
        onPointerDown={handleFabPointerDown}
        onPointerMove={handleFabPointerMove}
        onPointerUp={handleFabPointerUp}
        onPointerCancel={handleFabPointerUp}
        onClick={handleFabClick}
        aria-label={`Ouvrir le panier — ${cartItems.reduce((a, i) => a + i.quantity, 0)} article(s)`}
        title="Mon Panier"
        style={{
          position: 'fixed',
          left: `${cartFabPosition.left}px`,
          top: `${cartFabPosition.top}px`,
          backgroundColor: 'var(--color-primary)',
          border: '2px solid var(--color-accent)',
          color: 'var(--color-accent)',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(197,168,128,0.25)',
          zIndex: 90,
          cursor: 'grab',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          touchAction: 'none',
          userSelect: 'none',
        }}
        className="cart-fab-fixed"
      >
        <ShoppingBag size={22} aria-hidden="true" />
        {cartItems.reduce((a, i) => a + i.quantity, 0) > 0 && (
          <span style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            backgroundColor: 'var(--color-accent)',
            color: 'var(--bg-dark)',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            fontSize: '0.6rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
          }}>
            {cartItems.reduce((a, i) => a + i.quantity, 0) > 99 ? '99+' : cartItems.reduce((a, i) => a + i.quantity, 0)}
          </span>
        )}
      </button>

      {/* Bouton WhatsApp flottant — tout en bas à droite */}
      <a 
        href="https://wa.me/221774903713?text=Bonjour%20Maison%20Heritage,%20je%20souhaite%20avoir%20plus%20d'informations%20sur%20vos%20produits." 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#25D366',
          color: '#ffffff',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(37, 211, 102, 0.4)',
          zIndex: 90,
          transition: 'transform 0.3s ease',
          textDecoration: 'none',
        }}
        className="whatsapp-float"
        title="Discuter sur WhatsApp"
      >
        <i className="fa-brands fa-whatsapp" style={{ fontSize: '28px', color: '#ffffff' }}></i>
      </a>

      {/* Bandeau livraison (déplacé en bas de page) */}
      <div className="delivery-banner" style={{ borderTop: '1px solid var(--border-dark)', borderBottom: 'none', marginBlock: '2rem 0' }}>
        <i className="fa-solid fa-truck" style={{ color: 'var(--color-accent)', marginRight: '6px' }}></i> Boutique en ligne — <strong>Livraison partout où vous êtes</strong>
        <span> · Dakar &amp; Sénégal entier · WhatsApp : 77 490 37 13</span>
      </div>

      {/* Footer */}
      <Footer
        onNavClick={(tab) => setActiveTab(tab)}
        onAdminClick={() => setActiveTab(activeTab === 'admin' ? 'home' : 'admin')}
      />

      <style>{`
        .whatsapp-float:hover {
          transform: scale(1.1) rotate(5deg);
        }
        .cart-fab-fixed:hover {
          transform: scale(1.12);
          box-shadow: 0 8px 30px rgba(197,168,128,0.4);
          background-color: var(--color-accent) !important;
          color: var(--bg-dark) !important;
        }
        .category-scroll::-webkit-scrollbar {
          height: 4px;
        }
        .category-scroll::-webkit-scrollbar-thumb {
          background: rgba(197, 168, 128, 0.2);
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
}
