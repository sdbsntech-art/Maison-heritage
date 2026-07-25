import React from 'react';
import { Plus, Edit3, Trash2, LogOut, ShieldAlert, AlertTriangle, Clock, Eye, EyeOff, Package, BarChart3, ShoppingBag, TrendingUp, Save, Users, Shield, Trash } from 'lucide-react';
import { persistProduct, removeProduct } from '../utils/db';
import {
  loadOrders,
  loadStats,
  persistOrderStatus,
  removeOrder,
  ORDER_STATUS,
} from '../utils/orders';
import { adminLogin, adminLogout, adminMe, getToken, setToken, isApiAvailable } from '../utils/api';
import {
  sanitizeShortText,
  sanitizeLongText,
  sanitizeImageUrl,
  sanitizePrice,
  checkLoginLock,
  recordFailedAttempt,
  resetLoginAttempts,
  touchAdminSession,
  isAdminSessionValid,
  destroyAdminSession,
} from '../utils/security';

// Comptes Admin valides (insensible à la casse)
const VALID_ADMIN_ACCOUNTS = [
  { username: 'sokhna dibor diouf', pass: ['zayel', 'khalifazayelpro'], name: 'SOKHNA DIBOR DIOUF' },
  { username: 'zayelkhalifa', pass: ['khalifazayelpro', 'zayel'], name: 'zayelkhalifa' },
  { username: 'admin', pass: ['zayel', 'khalifazayelpro', 'admin'], name: 'Administrateur' },
  { username: 'zayel', pass: ['zayel', 'khalifazayelpro'], name: 'Zayel' },
];

const EMPTY_FORM = {
  name: '',
  category: 'Parfums',
  price: '',
  description: '',
  imageUrl: '',
  isFeatured: false,
  inStock: true,
  isPromo: false,
};

const SUPER_ADMIN = 'zayelkhalifa';

export default function AdminPanel({ products, onProductsChange, apiOnline = false }) {
  // ── Auth state ──────────────────────────────────────────────
  const [isAuthenticated, setIsAuthenticated] = React.useState(
    () => isAdminSessionValid() || Boolean(getToken())
  );
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPass, setShowPass] = React.useState(false);
  const [loginError, setLoginError] = React.useState('');
  const [lockInfo, setLockInfo] = React.useState({ locked: false, remainingSeconds: 0 });

  // ── Form state ──────────────────────────────────────────────
  const [isEditing, setIsEditing] = React.useState(false);
  const [editingId, setEditingId] = React.useState(null);
  const [formData, setFormData] = React.useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = React.useState({});
  const [successMsg, setSuccessMsg] = React.useState('');
  const [adminTab, setAdminTab] = React.useState('products');
  const [orders, setOrders] = React.useState([]);
  const [admins, setAdmins] = React.useState([]);
  const [newAdmin, setNewAdmin] = React.useState({ username: '', password: '', privileges: { edit_products: true, edit_orders: true, manage_admins: false } });
  const [adminFormError, setAdminFormError] = React.useState('');
  const [adminFormSuccess, setAdminFormSuccess] = React.useState('');
  const [adminUserName, setAdminUserName] = React.useState('SOKHNA DIBOR DIOUF');
  const currentUser = React.useMemo(() => adminUserName, [adminUserName]);
  const [quickPrices, setQuickPrices] = React.useState({});
  const [stats, setStats] = React.useState({
    totalOrders: 0, pendingCount: 0, confirmedCount: 0, deliveredCount: 0,
    revenueDelivered: 0, revenuePending: 0, inventoryValue: 0, productCount: 0, featuredCount: 0,
  });

  // ── Session timeout tracking ────────────────────────────────
  const sessionTimerRef = React.useRef(null);
  const [sessionWarning, setSessionWarning] = React.useState(false);

  // Lock countdown refresh
  React.useEffect(() => {
    if (!lockInfo.locked) return;
    const interval = setInterval(() => {
      const current = checkLoginLock();
      setLockInfo(current);
      if (!current.locked) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [lockInfo.locked]);

  // Session activity tracker — every interaction prolongs session
  const touchSession = React.useCallback(() => {
    if (isAuthenticated) {
      touchAdminSession();
      setSessionWarning(false);
    }
  }, [isAuthenticated]);

  // Session expiry watcher (checks every 60s)
  React.useEffect(() => {
    if (!isAuthenticated) return;
    touchAdminSession();

    sessionTimerRef.current = setInterval(() => {
      if (!isAdminSessionValid()) {
        handleLogout(true);
      } else {
        // Warn if < 5 minutes left
        const expiry = parseInt(sessionStorage.getItem('mh_admin_session_expiry') || '0', 10);
        const remaining = expiry - Date.now();
        setSessionWarning(remaining < 5 * 60 * 1000);
      }
    }, 60_000);

    return () => clearInterval(sessionTimerRef.current);
  }, [isAuthenticated]);

  const refreshOrders = React.useCallback(async () => {
    const list = await loadOrders();
    setOrders(list);
  }, []);

  const refreshStats = React.useCallback(async () => {
    const data = await loadStats(products);
    setStats(data);
  }, [products]);

  React.useEffect(() => {
    if (!isAuthenticated) return;
    refreshOrders();
    refreshStats();
    const prices = {};
    products.forEach(p => { prices[p.id] = p.price > 0 ? String(p.price) : ''; });
    setQuickPrices(prices);
  }, [isAuthenticated, products, refreshOrders, refreshStats]);

  React.useEffect(() => {
    if (!getToken()) return;
    adminMe()
      .then(user => {
        if (user?.name) setAdminUserName(user.name);
        setIsAuthenticated(true);
        touchAdminSession();
      })
      .catch(() => {
        setToken('');
      });
  }, []);

  const formatFcfa = (n) => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';

  const handleQuickPriceSave = async (product) => {
    touchSession();
    const val = quickPrices[product.id];
    try {
      await persistProduct({
        ...product,
        price: val === '' ? 0 : sanitizePrice(val),
      }, true);
      await onProductsChange();
      await refreshStats();
      setSuccessMsg('✅ Prix mis à jour !');
    } catch (err) {
      setSuccessMsg(`❌ ${err.message || 'Erreur lors de la mise à jour'}`);
    }
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleOrderStatus = async (orderId, status) => {
    touchSession();
    await persistOrderStatus(orderId, status);
    await refreshOrders();
    await refreshStats();
  };

  const handleDeleteOrder = async (orderId) => {
    touchSession();
    if (window.confirm('Supprimer cette commande du registre ?')) {
      await removeOrder(orderId);
      await refreshOrders();
      await refreshStats();
    }
  };

  // ── LOGIN ───────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    const lock = checkLoginLock();
    if (lock.locked) {
      setLockInfo(lock);
      return;
    }

    const tryLocalLogin = () => {
      const u = username.trim().toLowerCase();
      const p = password.trim().toLowerCase();

      const matched = VALID_ADMIN_ACCOUNTS.find(acc =>
        (acc.username === u || (u.length >= 4 && acc.username.includes(u))) &&
        acc.pass.some(validP => validP.toLowerCase() === p)
      );

      if (matched) {
        resetLoginAttempts();
        touchAdminSession();
        setAdminUserName(matched.name);
        setIsAuthenticated(true);
        setUsername('');
        setPassword('');
        setLoginError('');
        return true;
      }
      return false;
    };

    // Tente d'abord le login local (ultra rapide et toujours garanti)
    if (tryLocalLogin()) {
      return;
    }

    // Sinon tente l'API si disponible
    try {
      if (await isApiAvailable()) {
        const res = await adminLogin(username.trim(), password);
        setToken(res.token);
        if (res.user?.name) setAdminUserName(res.user.name);
        resetLoginAttempts();
        touchAdminSession();
        setIsAuthenticated(true);
        setUsername('');
        setPassword('');
        await refreshOrders();
        await refreshStats();
        return;
      }
    } catch (err) {
      // API a échoué
    }

    const result = recordFailedAttempt();
    if (result.locked) {
      setLockInfo(checkLoginLock());
      setLoginError('Trop de tentatives. Accès verrouillé pendant 60 secondes.');
    } else {
      setLoginError(`Identifiants incorrects. (${result.attemptsLeft} tentative(s) restante(s)).`);
    }
  };

  // ── LOGOUT ──────────────────────────────────────────────────
  const handleLogout = async (expired = false) => {
    await adminLogout();
    setToken('');
    destroyAdminSession();
    setIsAuthenticated(false);
    setFormData(EMPTY_FORM);
    setIsEditing(false);
    setEditingId(null);
    clearInterval(sessionTimerRef.current);
    if (expired) {
      setLoginError('Votre session a expiré. Veuillez vous reconnecter.');
    }
  };

  // ── FORM VALIDATION ─────────────────────────────────────────
  const validateForm = () => {
    const errors = {};
    const name = sanitizeShortText(formData.name, 150);
    if (!name.trim()) errors.name = 'Le nom du produit est requis.';
    if (formData.price !== '' && isNaN(Number(formData.price))) {
      errors.price = 'Le prix doit être un nombre valide.';
    }
    if (formData.imageUrl && !sanitizeImageUrl(formData.imageUrl)) {
      errors.imageUrl = 'URL image invalide. Utilisez une URL https:// valide.';
    }
    return errors;
  };

  // ── INPUT CHANGE ────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    touchSession();
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear field error on change
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleResetForm = () => {
    setFormData(EMPTY_FORM);
    setIsEditing(false);
    setEditingId(null);
    setFormErrors({});
  };

  // ── SUBMIT ──────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    touchSession();
    setSuccessMsg('');

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const payload = {
      name: sanitizeShortText(formData.name, 150),
      category: sanitizeShortText(formData.category, 50),
      price: formData.price === '' ? 0 : sanitizePrice(formData.price),
      description: sanitizeLongText(formData.description, 1000),
      imageUrl: sanitizeImageUrl(formData.imageUrl),
      isFeatured: Boolean(formData.isFeatured),
      inStock: formData.inStock !== false,
      isPromo: Boolean(formData.isPromo),
    };

    try {
      if (isEditing) {
        await persistProduct({ ...payload, id: editingId }, true);
        setSuccessMsg('✅ Produit modifié avec succès !');
      } else {
        await persistProduct(payload, false);
        setSuccessMsg('✅ Produit ajouté avec succès !');
      }
      await onProductsChange();
      await refreshStats();
      handleResetForm();
    } catch (err) {
      setSuccessMsg(`❌ ${err.message || 'Erreur lors de l\'enregistrement'}`);
    }
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleEditClick = (product) => {
    touchSession();
    setFormData({
      name: product.name || '',
      category: product.category || 'Parfums',
      price: product.price === 0 ? '' : String(product.price),
      description: product.description || '',
      imageUrl: product.imageUrl || '',
      isFeatured: Boolean(product.isFeatured),
      inStock: product.inStock !== false,
      isPromo: Boolean(product.isPromo),
    });
    setIsEditing(true);
    setEditingId(product.id);
    setFormErrors({});
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleDeleteClick = async (id) => {
    touchSession();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.')) {
      try {
        await removeProduct(id);
        await onProductsChange();
        await refreshStats();
        setSuccessMsg('🗑️ Produit supprimé.');
      } catch (err) {
        setSuccessMsg(`❌ ${err.message || 'Suppression impossible'}`);
      }
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // VUE : Écran de connexion
  // ─────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <section style={{
        minHeight: 'calc(100vh - var(--header-h))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1rem',
        backgroundColor: 'var(--bg-dark)',
      }}>
        <div className="glass anim-scale-in" style={{
          padding: 'clamp(2rem, 5vw, 3rem)',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '440px',
          border: '1px solid rgba(197,168,128,0.25)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
          textAlign: 'center',
        }}>
          <ShieldAlert size={48} style={{ color: 'var(--color-accent)', marginBottom: '1.2rem' }} aria-hidden="true" />
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--fs-2xl)',
            color: '#fff',
            marginBottom: '0.4rem',
          }}>
            CONNEXION <span className="text-gold">ADMIN</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)', marginBottom: '2rem' }}>
            Espace réservé. Entrez vos identifiants pour accéder au tableau de bord.
          </p>

          {/* Erreur de login */}
          {loginError && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              color: '#f87171', padding: '0.75rem 1rem', borderRadius: '8px',
              marginBottom: '1.2rem', fontSize: 'var(--fs-xs)', textAlign: 'left',
            }} role="alert">
              <AlertTriangle size={16} aria-hidden="true" />
              {loginError}
            </div>
          )}

          {/* Verrou temporaire */}
          {lockInfo.locked && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)',
              color: '#f87171', padding: '0.75rem 1rem', borderRadius: '8px',
              marginBottom: '1.2rem', fontSize: 'var(--fs-xs)',
            }} role="alert" aria-live="polite">
              <Clock size={16} aria-hidden="true" />
              Connexion bloquée — réessayez dans {lockInfo.remainingSeconds}s
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} noValidate>
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="form-label" htmlFor="admin-username">Nom d'utilisateur</label>
              <input
                id="admin-username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Votre nom complet"
                className="form-input"
                autoComplete="username"
                disabled={lockInfo.locked}
                required
                aria-required="true"
              />
            </div>

            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="form-label" htmlFor="admin-password">Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="admin-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-input"
                  autoComplete="current-password"
                  disabled={lockInfo.locked}
                  required
                  aria-required="true"
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)', cursor: 'pointer',
                    minHeight: 'unset', padding: 0,
                  }}
                  aria-label={showPass ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
              disabled={lockInfo.locked}
            >
              {lockInfo.locked ? `Verrouillé (${lockInfo.remainingSeconds}s)` : 'Se connecter'}
            </button>
          </form>
        </div>
      </section>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // VUE : Tableau de bord Admin
  // ─────────────────────────────────────────────────────────────
  return (
    <section
      className="admin-panel"
      onClick={touchSession}
      onKeyDown={touchSession}
    >
      <div className="container">

        {/* ── Avertissement session ── */}
        {sessionWarning && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)',
            color: '#fbbf24', padding: '0.75rem 1.2rem', borderRadius: '8px',
            marginBottom: '1.5rem', fontSize: 'var(--fs-xs)',
          }} role="alert" aria-live="polite">
            <Clock size={14} aria-hidden="true" />
            Votre session expire dans moins de 5 minutes. Continuez à interagir pour la prolonger.
          </div>
        )}

        {/* ── Message succès ── */}
        {successMsg && (
          <div style={{
            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)',
            color: '#4ade80', padding: '0.75rem 1.2rem', borderRadius: '8px',
            marginBottom: '1.5rem', fontSize: 'var(--fs-sm)',
          }} role="status" aria-live="polite">
            {successMsg}
          </div>
        )}

        {/* ── En-tête dashboard ── */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(197,168,128,0.2)',
          paddingBottom: '1.5rem',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <span className="text-uppercase-tracking">Tableau de Bord</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--fs-2xl)', color: '#fff', marginTop: '0.3rem' }}>
              Gestion de la <span className="text-gold">Boutique</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-xs)', marginTop: '0.25rem' }}>
              Connecté en tant que : <strong style={{ color: 'var(--color-accent)' }}>{adminUserName}</strong>
              {' · '}
              <span className={`badge ${apiOnline ? 'badge-success' : 'badge-gold'}`} style={{ fontSize: '0.6rem', verticalAlign: 'middle' }}>
                {apiOnline ? 'API connectée' : 'Mode local (hors ligne)'}
              </span>
            </p>
          </div>
          <button
            onClick={() => handleLogout(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              color: '#f87171', padding: '0.65rem 1.2rem', borderRadius: '8px',
              fontWeight: 600, fontSize: 'var(--fs-xs)', cursor: 'pointer',
              transition: 'var(--transition-fast)',
              minHeight: '44px',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.22)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
          >
            <LogOut size={15} aria-hidden="true" /> Déconnexion
          </button>
        </div>

        {/* ── Onglets admin ── */}
        <div className="admin-tabs" role="tablist">
          {[
            { id: 'products', label: 'Produits', Icon: Package },
            { id: 'orders', label: 'Commandes', Icon: ShoppingBag },
            { id: 'stats', label: 'Investissement', Icon: BarChart3 },
            ...(adminUserName === SUPER_ADMIN ? [{ id: 'admins', label: 'Administrateurs', Icon: Users }] : []),
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              role="tab"
              aria-selected={adminTab === id}
              className={`admin-tab${adminTab === id ? ' active' : ''}`}
              onClick={() => { setAdminTab(id); touchSession(); }}
            >
              <Icon size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} aria-hidden="true" />
              {label}
              {id === 'orders' && stats.pendingCount > 0 && (
                <span style={{ marginLeft: 6, color: '#fbbf24' }}>({stats.pendingCount})</span>
              )}
            </button>
          ))}
        </div>

        {/* ── Onglet Statistiques / Investissement ── */}
        {adminTab === 'stats' && (
          <div className="anim-fade-in">
            <div className="stats-grid">
              <div className="stat-card glass-gold">
                <div className="stat-card-value">{stats.productCount}</div>
                <div className="stat-card-label">Articles en boutique</div>
              </div>
              <div className="stat-card glass-gold">
                <div className="stat-card-value">{formatFcfa(stats.inventoryValue)}</div>
                <div className="stat-card-label">Valeur catalogue (prix fixés)</div>
              </div>
              <div className="stat-card glass-gold">
                <div className="stat-card-value">{stats.totalOrders}</div>
                <div className="stat-card-label">Commandes enregistrées</div>
              </div>
              <div className="stat-card glass-gold">
                <div className="stat-card-value">{formatFcfa(stats.revenueDelivered)}</div>
                <div className="stat-card-label">Revenus livrés</div>
              </div>
              <div className="stat-card glass-gold">
                <div className="stat-card-value">{formatFcfa(stats.revenuePending)}</div>
                <div className="stat-card-label">En cours (attente + confirmées)</div>
              </div>
              <div className="stat-card glass-gold">
                <div className="stat-card-value">{stats.featuredCount}</div>
                <div className="stat-card-label">Produits vedettes</div>
              </div>
            </div>
            <div className="glass-gold" style={{ padding: '1.5rem', borderRadius: '12px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-accent)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={18} aria-hidden="true" /> Vue d'ensemble boutique
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)', lineHeight: 1.7 }}>
                Votre boutique est <strong style={{ color: 'var(--color-accent)' }}>100% en ligne</strong> avec livraison partout au Sénégal et au-delà.
                Les commandes passées via WhatsApp sont automatiquement enregistrées ici pour suivre votre activité et votre investissement.
              </p>
            </div>
          </div>
        )}

        {/* ── Onglet Administrateurs (Super Admin seulement) ── */}
        {adminTab === 'admins' && adminUserName === SUPER_ADMIN && (
          <div className="glass-gold anim-fade-in" style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem)', borderRadius: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--fs-xl)', color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={18} style={{ color: 'var(--color-accent)' }} aria-hidden="true" />
              Gestion des <span className="text-gold">Administrateurs</span>
            </h3>

            {adminFormError && <div style={{ color: '#f87171', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: 'var(--fs-xs)', marginBottom: '1rem' }} role="alert">{adminFormError}</div>}
            {adminFormSuccess && <div style={{ color: '#4ade80', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: 'var(--fs-xs)', marginBottom: '1rem' }} role="status">{adminFormSuccess}</div>}

            {/* Créer un nouvel admin */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setAdminFormError('');
                setAdminFormSuccess('');
                if (!newAdmin.username.trim() || !newAdmin.password.trim()) {
                  setAdminFormError('Nom d\'utilisateur et mot de passe requis.');
                  return;
                }
                try {
                  const res = await fetch('/api/admin/admins', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('mh_admin_token') || ''}` },
                    body: JSON.stringify({ username: newAdmin.username.trim(), password: newAdmin.password, privileges: newAdmin.privileges }),
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.error || 'Erreur création admin');
                  setAdminFormSuccess(`✅ Admin « ${newAdmin.username} » créé avec succès.`);
                  setNewAdmin({ username: '', password: '', privileges: { edit_products: true, edit_orders: true, manage_admins: false } });
                  // Refresh list
                  const list = await fetch('/api/admin/admins', { headers: { 'Authorization': `Bearer ${localStorage.getItem('mh_admin_token') || ''}` } });
                  if (list.ok) setAdmins(await list.json());
                } catch (err) {
                  setAdminFormError(err.message);
                }
                setTimeout(() => { setAdminFormError(''); setAdminFormSuccess(''); }, 5000);
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '480px', marginBottom: '2rem' }}
            >
              <h4 style={{ color: 'var(--color-accent)', fontSize: 'var(--fs-sm)', fontWeight: 600 }}>Créer un nouvel administrateur</h4>
              <div className="form-group">
                <label className="form-label" htmlFor="new-admin-user">Nom d'utilisateur</label>
                <input id="new-admin-user" type="text" className="form-input" value={newAdmin.username}
                  onChange={e => setNewAdmin(p => ({ ...p, username: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="new-admin-pass">Mot de passe</label>
                <input id="new-admin-pass" type="password" className="form-input" value={newAdmin.password}
                  onChange={e => setNewAdmin(p => ({ ...p, password: e.target.value }))} required />
              </div>
              {/* Privilèges */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Privilèges</span>
                {[['edit_products', 'Gérer les produits'], ['edit_orders', 'Gérer les commandes'], ['manage_admins', 'Gérer les admins']].map(([key, label]) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: 'var(--fs-sm)' }}>
                    <input type="checkbox" checked={newAdmin.privileges[key]} onChange={e => setNewAdmin(p => ({ ...p, privileges: { ...p.privileges, [key]: e.target.checked } }))}
                      style={{ accentColor: 'var(--color-accent)', width: '16px', height: '16px' }} />
                    {label}
                  </label>
                ))}
              </div>
              <button type="submit" className="btn-primary" style={{ width: 'fit-content' }}>＋ Créer l'administrateur</button>
            </form>

            {/* Liste admins */}
            <h4 style={{ color: '#fff', fontSize: 'var(--fs-sm)', marginBottom: '1rem' }}>Administrateurs existants ({admins.length})</h4>
            {admins.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-xs)' }}>Chargement ou aucun admin supplémentaire.</p>
            ) : (
              admins.filter(a => a.username !== SUPER_ADMIN).map(admin => (
                <div key={admin.id || admin.username} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.7rem 1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', marginBottom: '0.5rem' }}>
                  <div>
                    <span style={{ color: '#fff', fontWeight: 600, fontSize: 'var(--fs-sm)' }}>{admin.username}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-xs)', marginLeft: '0.7rem' }}>
                      {[admin.privileges?.edit_products && 'Produits', admin.privileges?.edit_orders && 'Commandes', admin.privileges?.manage_admins && 'Admins'].filter(Boolean).join(' · ')}
                    </span>
                  </div>
                  <button
                    onClick={async () => {
                      if (!window.confirm(`Supprimer l'admin « ${admin.username} » ?`)) return;
                      try {
                        const res = await fetch(`/api/admin/admins/${admin.id || admin.username}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('mh_admin_token') || ''}` } });
                        if (!res.ok) throw new Error('Échec suppression');
                        setAdmins(p => p.filter(a => (a.id || a.username) !== (admin.id || admin.username)));
                        setAdminFormSuccess(`🗑️ Admin « ${admin.username} » supprimé.`);
                      } catch (err) { setAdminFormError(err.message); }
                      setTimeout(() => { setAdminFormError(''); setAdminFormSuccess(''); }, 4000);
                    }}
                    style={{ color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', minHeight: 'unset' }}
                    aria-label={`Supprimer ${admin.username}`}
                  >
                    <Trash size={13} aria-hidden="true" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Onglet Commandes ── */}
        {adminTab === 'orders' && (
          <div className="glass-gold anim-fade-in" style={{ padding: 'clamp(1.2rem, 3vw, 2rem)', borderRadius: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-xl)', color: '#fff', marginBottom: '1.5rem' }}>
              Commandes Clients <span style={{ color: 'var(--color-accent)', fontSize: 'var(--fs-sm)' }}>({orders.length})</span>
            </h3>
            {orders.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem 1rem' }}>
                Aucune commande pour le moment. Les commandes WhatsApp apparaîtront ici automatiquement.
              </p>
            ) : (
              orders.map(order => (
                <div key={order.id} className="order-row">
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div>
                      <strong style={{ color: '#fff' }}>{order.id}</strong>
                      <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {new Date(order.createdAt).toLocaleString('fr-FR')}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <select
                        value={order.status}
                        onChange={(e) => handleOrderStatus(order.id, e.target.value)}
                        className="form-select"
                        style={{ padding: '0.4rem 0.8rem', fontSize: 'var(--fs-xs)', minHeight: '36px' }}
                      >
                        {Object.entries(ORDER_STATUS).map(([k, v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </select>
                      <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>{formatFcfa(order.total)}</span>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        style={{ color: '#f87171', padding: '6px', minHeight: 'unset' }}
                        title="Supprimer"
                        aria-label="Supprimer la commande"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {order.items.map((item, i) => (
                      <li key={i} style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {item.imageUrl && (
                          <img src={item.imageUrl} alt="" style={{ width: 32, height: 32, borderRadius: 4, objectFit: 'cover' }} />
                        )}
                        <span>{item.quantity}× {item.name} — {item.price > 0 ? formatFcfa(item.price * item.quantity) : 'Sur demande'}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Onglet Produits ── */}
        {adminTab === 'products' && (
        <div className="admin-grid">

          {/* ── Formulaire Produit ── */}
          <div className="glass" style={{
            padding: 'clamp(1.5rem, 3vw, 2.2rem)',
            borderRadius: '16px',
            border: '1px solid rgba(197,168,128,0.15)',
          }}>
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--fs-xl)',
              color: 'var(--color-accent)',
              marginBottom: '1.5rem',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <Plus size={18} style={{ transform: isEditing ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s' }} aria-hidden="true" />
              {isEditing ? 'Modifier le Produit' : 'Ajouter un Produit'}
            </h3>

            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {/* Nom */}
              <div className="form-group">
                <label className="form-label" htmlFor="p-name">Nom du Produit *</label>
                <input
                  id="p-name" type="text" name="name"
                  value={formData.name} onChange={handleInputChange}
                  placeholder="Ex: Parfum Oud Classique"
                  className="form-input" required aria-required="true"
                  maxLength={150}
                  aria-invalid={!!formErrors.name}
                  aria-describedby={formErrors.name ? 'err-name' : undefined}
                />
                {formErrors.name && <span id="err-name" className="form-error" role="alert"><AlertTriangle size={12} />{formErrors.name}</span>}
              </div>

              {/* Catégorie */}
              <div className="form-group">
                <label className="form-label" htmlFor="p-cat">Catégorie</label>
                <select id="p-cat" name="category" value={formData.category} onChange={handleInputChange} className="form-select">
                  <option value="Parfums">Parfums</option>
                  <option value="Montres">Montres</option>
                  <option value="Chapelets">Chapelets</option>
                  <option value="Bracelets">Bracelets</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              {/* Prix */}
              <div className="form-group">
                <label className="form-label" htmlFor="p-price">Prix en FCFA — laissez vide pour « Sur demande »</label>
                <input
                  id="p-price" type="number" name="price"
                  value={formData.price} onChange={handleInputChange}
                  placeholder="Ex: 75000 (Optionnel)"
                  className="form-input" min="0" max="99999999" step="1"
                  aria-invalid={!!formErrors.price}
                  aria-describedby={formErrors.price ? 'err-price' : undefined}
                />
                {formErrors.price && <span id="err-price" className="form-error" role="alert"><AlertTriangle size={12} />{formErrors.price}</span>}
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label" htmlFor="p-desc">Description / Caractéristiques</label>
                <textarea
                  id="p-desc" name="description"
                  value={formData.description} onChange={handleInputChange}
                  placeholder="Décrivez le produit (matière, contenance, caractéristiques...)"
                  className="form-textarea" maxLength={1000}
                />
                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', textAlign: 'right' }}>
                  {formData.description.length}/1000
                </span>
              </div>

              {/* Image URL */}
              <div className="form-group">
                <label className="form-label" htmlFor="p-img">URL de la photo — laissez vide pour le placeholder doré</label>
                <input
                  id="p-img" type="url" name="imageUrl"
                  value={formData.imageUrl} onChange={handleInputChange}
                  placeholder="https://exemple.com/photo.jpg (Optionnel)"
                  className="form-input"
                  aria-invalid={!!formErrors.imageUrl}
                  aria-describedby={formErrors.imageUrl ? 'err-img' : undefined}
                />
                {formErrors.imageUrl && <span id="err-img" className="form-error" role="alert"><AlertTriangle size={12} />{formErrors.imageUrl}</span>}
                {formData.imageUrl && sanitizeImageUrl(formData.imageUrl) && (
                  <>
                    <div style={{ marginTop: '0.5rem', fontSize: 'var(--fs-xs)', color: 'var(--color-success)' }}>
                      ✅ Aperçu de la photo
                    </div>
                    <img
                      src={sanitizeImageUrl(formData.imageUrl)}
                      alt="Aperçu produit"
                      className="image-preview-admin"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </>
                )}
              </div>

              {/* Checkboxes */}
              <div style={{
                display: 'flex', gap: '1.5rem', flexWrap: 'wrap',
                background: 'rgba(255,255,255,0.02)', padding: '0.85rem 1rem',
                borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)',
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: 'var(--fs-sm)' }}>
                  <input
                    type="checkbox" name="isFeatured"
                    checked={formData.isFeatured} onChange={handleInputChange}
                    style={{ accentColor: 'var(--color-accent)', width: '16px', height: '16px' }}
                  />
                  ★ Mettre en vedette
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: 'var(--fs-sm)' }}>
                  <input
                    type="checkbox" name="inStock"
                    checked={formData.inStock} onChange={handleInputChange}
                    style={{ accentColor: 'var(--color-accent)', width: '16px', height: '16px' }}
                  />
                  En Stock
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: 'var(--fs-sm)' }}>
                  <input
                    type="checkbox" name="isPromo"
                    checked={formData.isPromo} onChange={handleInputChange}
                    style={{ accentColor: '#22c55e', width: '16px', height: '16px' }}
                  />
                  🟢 En promotion
                </label>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  {isEditing ? '✏️ Modifier' : '＋ Enregistrer'}
                </button>
                <button
                  type="button" onClick={handleResetForm}
                  className="btn-secondary"
                  style={{ padding: '0.75rem 1.2rem' }}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>

          {/* ── Liste des produits ── */}
          <div className="glass" style={{
            padding: 'clamp(1.2rem, 3vw, 2rem)',
            borderRadius: '16px',
            border: '1px solid rgba(197,168,128,0.15)',
          }}>
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--fs-xl)',
              color: '#fff',
              marginBottom: '1.5rem',
            }}>
              Produits Existants{' '}
              <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-accent)', fontWeight: 600 }}>({products.length})</span>
            </h3>

            {products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--fs-lg)' }}>Aucun produit en stock.</p>
                <p style={{ fontSize: 'var(--fs-xs)', marginTop: '0.5rem' }}>Ajoutez-en un via le formulaire.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {products.map(p => (
                  <div key={p.id} style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.8rem 0.9rem', borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.04)',
                    background: 'rgba(255,255,255,0.01)',
                    transition: 'background 0.2s',
                    flexWrap: 'wrap',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'}
                  >
                    {/* Miniature */}
                    <div style={{
                      width: 42, height: 42, flexShrink: 0,
                      borderRadius: '6px', overflow: 'hidden',
                      border: '1px solid rgba(197,168,128,0.15)',
                      background: '#050c1a',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl} alt={p.name} draggable={false}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <span style={{ fontSize: '0.55rem', color: 'var(--color-accent)', fontWeight: 700 }}>MH</span>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, color: '#fff', fontSize: 'var(--fs-sm)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.name}
                        {p.isFeatured && <span style={{ marginLeft: '0.4rem', color: 'var(--color-accent)', fontSize: '0.65rem' }}>★</span>}
                        {p.isPromo && <span style={{ marginLeft: '0.4rem', fontSize: '0.65rem' }}>🟢</span>}
                      </p>
                      <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-xs)' }}>
                        {p.category}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                        <input
                          type="number"
                          className="quick-price-input"
                          value={quickPrices[p.id] ?? ''}
                          onChange={(e) => setQuickPrices(prev => ({ ...prev, [p.id]: e.target.value }))}
                          placeholder="Prix FCFA"
                          min="0"
                        />
                        <button
                          onClick={() => handleQuickPriceSave(p)}
                          title="Enregistrer le prix"
                          style={{
                            color: 'var(--color-accent)', background: 'rgba(197,168,128,0.1)',
                            border: '1px solid rgba(197,168,128,0.2)', padding: '5px 7px',
                            borderRadius: '4px', cursor: 'pointer', minHeight: 'unset',
                          }}
                        >
                          <Save size={12} aria-hidden="true" />
                        </button>
                        <span style={{ fontSize: 'var(--fs-xs)', color: p.price > 0 ? '#fff' : 'var(--text-muted)', fontStyle: p.price > 0 ? 'normal' : 'italic' }}>
                          {p.price > 0 ? formatFcfa(p.price) : 'Sur demande'}
                        </span>
                      </div>
                    </div>

                    {/* Stock badge */}
                    <span className={`badge ${p.inStock ? 'badge-success' : 'badge-danger'}`} style={{ flexShrink: 0 }}>
                      {p.inStock ? 'En stock' : 'Rupture'}
                    </span>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                      <button
                        onClick={() => handleEditClick(p)}
                        title="Modifier ce produit"
                        aria-label={`Modifier ${p.name}`}
                        style={{
                          color: 'var(--color-accent)', background: 'rgba(197,168,128,0.08)',
                          border: '1px solid rgba(197,168,128,0.18)', padding: '7px',
                          borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s',
                          minHeight: 'unset',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--bg-dark)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(197,168,128,0.08)'; e.currentTarget.style.color = 'var(--color-accent)'; }}
                      >
                        <Edit3 size={13} aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(p.id)}
                        title="Supprimer ce produit"
                        aria-label={`Supprimer ${p.name}`}
                        style={{
                          color: '#f87171', background: 'rgba(239,68,68,0.08)',
                          border: '1px solid rgba(239,68,68,0.18)', padding: '7px',
                          borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s',
                          minHeight: 'unset',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#f87171'; }}
                      >
                        <Trash2 size={13} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
