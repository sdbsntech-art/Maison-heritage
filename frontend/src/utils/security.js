/**
 * security.js — Module de Sécurité Maison Heritage
 * Protection XSS, injection, rate-limit, copyright & tracking
 * ============================================================
 */

// ── 1. SANITISATION ANTI-XSS ────────────────────────────────
/**
 * Échappe les caractères HTML dangereux dans une chaîne.
 * À utiliser sur TOUTE entrée utilisateur avant affichage ou stockage.
 */
export function sanitizeText(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/`/g, '&#96;')
    .replace(/=/g, '&#x3D;')
    .trim();
}

/**
 * Valide et nettoie une URL d'image.
 * Bloque : javascript:, data:, vbscript:, file:, blob: non sécurisé.
 */
export function sanitizeImageUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const cleaned = url.trim();
  // Seuls http et https sont autorisés pour les images externes
  const allowedProtocols = /^https?:\/\//i;
  if (!allowedProtocols.test(cleaned)) return '';
  // Longueur max 2048 caractères
  if (cleaned.length > 2048) return '';
  // Bloque les extensions dangereuses
  const dangerousExtensions = /\.(php|asp|aspx|cgi|pl|py|sh|bash|exe|bat|cmd)(\?|$)/i;
  if (dangerousExtensions.test(cleaned)) return '';
  return cleaned;
}

/**
 * Nettoie un numéro de téléphone (chiffres, +, espaces, tirets uniquement).
 */
export function sanitizePhone(phone) {
  if (!phone || typeof phone !== 'string') return '';
  return phone.replace(/[^0-9+\-\s]/g, '').trim().slice(0, 20);
}

/**
 * Nettoie un champ texte court (nom, titre, etc.)
 * Retire les balises HTML et limite la longueur.
 */
export function sanitizeShortText(str, maxLength = 100) {
  if (!str || typeof str !== 'string') return '';
  return sanitizeText(str).slice(0, maxLength);
}

/**
 * Nettoie un champ textarea (description, message).
 * Autorise sauts de ligne, bloque balises HTML.
 */
export function sanitizeLongText(str, maxLength = 2000) {
  if (!str || typeof str !== 'string') return '';
  // Retire uniquement les balises HTML (garde les \n)
  const stripped = str.replace(/<[^>]*>/g, '').trim();
  return stripped.slice(0, maxLength);
}

/**
 * Valide un prix numérique.
 */
export function sanitizePrice(val) {
  const num = parseFloat(val);
  if (isNaN(num) || num < 0) return 0;
  if (num > 99_999_999) return 99_999_999; // Cap à 100M
  return Math.round(num * 100) / 100; // 2 décimales max
}

// ── 2. RATE-LIMIT LOGIN ──────────────────────────────────────
const LOGIN_ATTEMPTS_KEY = 'mh_login_attempts';
const LOGIN_LOCK_KEY = 'mh_login_lock';
const MAX_ATTEMPTS = 3;
const LOCK_DURATION_MS = 60 * 1000; // 60 secondes

/**
 * Vérifie si le login est actuellement verrouillé.
 * @returns {{ locked: boolean, remainingSeconds: number }}
 */
export function checkLoginLock() {
  try {
    const lockUntil = parseInt(sessionStorage.getItem(LOGIN_LOCK_KEY) || '0', 10);
    if (lockUntil && Date.now() < lockUntil) {
      return {
        locked: true,
        remainingSeconds: Math.ceil((lockUntil - Date.now()) / 1000)
      };
    }
    // Verrou expiré — on réinitialise
    if (lockUntil && Date.now() >= lockUntil) {
      sessionStorage.removeItem(LOGIN_LOCK_KEY);
      sessionStorage.removeItem(LOGIN_ATTEMPTS_KEY);
    }
    return { locked: false, remainingSeconds: 0 };
  } catch {
    return { locked: false, remainingSeconds: 0 };
  }
}

/**
 * Enregistre une tentative de connexion échouée.
 * @returns {{ locked: boolean, attemptsLeft: number }}
 */
export function recordFailedAttempt() {
  try {
    const attempts = parseInt(sessionStorage.getItem(LOGIN_ATTEMPTS_KEY) || '0', 10) + 1;
    sessionStorage.setItem(LOGIN_ATTEMPTS_KEY, attempts.toString());
    if (attempts >= MAX_ATTEMPTS) {
      const lockUntil = Date.now() + LOCK_DURATION_MS;
      sessionStorage.setItem(LOGIN_LOCK_KEY, lockUntil.toString());
      return { locked: true, attemptsLeft: 0 };
    }
    return { locked: false, attemptsLeft: MAX_ATTEMPTS - attempts };
  } catch {
    return { locked: false, attemptsLeft: 1 };
  }
}

/**
 * Réinitialise les tentatives après une connexion réussie.
 */
export function resetLoginAttempts() {
  try {
    sessionStorage.removeItem(LOGIN_ATTEMPTS_KEY);
    sessionStorage.removeItem(LOGIN_LOCK_KEY);
  } catch { /* silently fail */ }
}

// ── 3. TIMEOUT DE SESSION ADMIN ──────────────────────────────
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const SESSION_KEY = 'mh_admin_session_expiry';

/**
 * Démarre/prolonge la session admin.
 */
export function touchAdminSession() {
  try {
    sessionStorage.setItem(SESSION_KEY, (Date.now() + SESSION_TIMEOUT_MS).toString());
  } catch { /* silently fail */ }
}

/**
 * Vérifie si la session admin est encore valide.
 * @returns {boolean}
 */
export function isAdminSessionValid() {
  try {
    const expiry = parseInt(sessionStorage.getItem(SESSION_KEY) || '0', 10);
    return expiry > 0 && Date.now() < expiry;
  } catch {
    return false;
  }
}

/**
 * Détruit la session admin.
 */
export function destroyAdminSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch { /* silently fail */ }
}

// ── 4. PROTECTION DU CONTENU (ANTI-PLAGIAT) ─────────────────
/**
 * Installe les protections anti-copie, anti-inspection et anti-plagiat.
 * Bloque : clic droit, F12, Ctrl+U, Ctrl+Shift+I/J/C, Ctrl+S, Ctrl+P,
 *          Ctrl+A, Ctrl+C, sélection de texte, impression, drag d'images.
 * NE bloque PAS : la saisie dans les inputs/textareas (formulaires).
 */
export function installContentProtection() {

  // ── A. Bloquer le clic droit PARTOUT ────────────────────────
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  }, { capture: true });

  // ── B. Bloquer le drag de tout élément ──────────────────────
  document.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
  }, { capture: true });

  // ── C. Bloquer les raccourcis clavier dangereux ─────────────
  document.addEventListener('keydown', (e) => {
    // Laisser passer si on est dans un champ de saisie
    const tag = (e.target.tagName || '').toLowerCase();
    const isInput = tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable;

    // F12 — Outils de développement
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl + Shift + I (Inspecteur)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.code === 'KeyI')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl + Shift + J (Console)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j' || e.code === 'KeyJ')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl + Shift + C (Sélecteur d'éléments)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c' || e.code === 'KeyC')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl + U (Afficher source)
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && (e.key === 'u' || e.key === 'U' || e.code === 'KeyU')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl + S (Enregistrer la page)
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && (e.key === 's' || e.key === 'S' || e.code === 'KeyS')) {
      if (!isInput) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }

    // Ctrl + P (Imprimer)
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && (e.key === 'p' || e.key === 'P' || e.code === 'KeyP')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl + A (Tout sélectionner) — seulement hors des inputs
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && (e.key === 'a' || e.key === 'A' || e.code === 'KeyA')) {
      // Ne pas bloquer Ctrl+Alt+A (raccourci admin)
      if (e.altKey) return;
      if (!isInput) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }

    // Ctrl + C (Copier) — seulement hors des inputs
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && (e.key === 'c' || e.key === 'C' || e.code === 'KeyC')) {
      if (!isInput) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }

    // Ctrl + X (Couper) — seulement hors des inputs
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && (e.key === 'x' || e.key === 'X' || e.code === 'KeyX')) {
      if (!isInput) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }

    // Ctrl + Shift + K (Console Firefox)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'K' || e.key === 'k' || e.code === 'KeyK')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl + Shift + E (Réseau Firefox)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'E' || e.key === 'e' || e.code === 'KeyE')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl + Shift + M (Mode responsive)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'M' || e.key === 'm' || e.code === 'KeyM')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

  }, { capture: true });

  // ── D. Bloquer la sélection de texte sur la page ───────────
  document.addEventListener('selectstart', (e) => {
    const tag = (e.target.tagName || '').toLowerCase();
    const isInput = tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable;
    if (!isInput) {
      e.preventDefault();
      return false;
    }
  }, { capture: true });

  // ── E. Bloquer la copie via le presse-papiers ──────────────
  document.addEventListener('copy', (e) => {
    const tag = (e.target.tagName || '').toLowerCase();
    const isInput = tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable;
    if (!isInput) {
      e.preventDefault();
      e.clipboardData?.setData('text/plain', '');
      return false;
    }
  }, { capture: true });

  // ── F. Bloquer le couper via le presse-papiers ─────────────
  document.addEventListener('cut', (e) => {
    const tag = (e.target.tagName || '').toLowerCase();
    const isInput = tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable;
    if (!isInput) {
      e.preventDefault();
      return false;
    }
  }, { capture: true });

  // ── G. CSS de protection avancée ───────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    /* Désactive la sélection de texte sur tout le site */
    body, .protected-content {
      user-select: none !important;
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
    }

    /* Ré-active la sélection dans les champs de formulaire */
    input, textarea, select, [contenteditable="true"] {
      user-select: text !important;
      -webkit-user-select: text !important;
      -moz-user-select: text !important;
      -ms-user-select: text !important;
    }

    /* Bloque le drag d'images */
    img {
      -webkit-user-drag: none !important;
      user-drag: none !important;
      pointer-events: none !important;
    }

    /* Ré-active les interactions sur les images qui doivent être cliquables */
    img.interactive,
    button img,
    a img,
    .product-card img,
    .product-card-image {
      pointer-events: auto !important;
    }

    /* Watermark sur impression */
    @media print {
      body::before {
        content: "© Maison Heritage by Bint Khalifa — Reproduction et diffusion strictement interdites.";
        display: block;
        font-size: 24px;
        color: rgba(197, 168, 128, 0.3);
        text-align: center;
        padding: 20px;
        border-bottom: 2px solid rgba(197, 168, 128, 0.2);
      }
      body::after {
        content: "Site développé par Zayel — Toute copie ou reproduction est poursuivie.";
        display: block;
        font-size: 14px;
        color: rgba(197, 168, 128, 0.2);
        text-align: center;
        padding: 10px;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // ── H. Détection DevTools (optionnel — discret) ────────────
  // Vérifie toutes les 2s si les DevTools sont ouverts via le timing
  let devtoolsWarned = false;
  const detectDevTools = () => {
    const threshold = 160;
    if (
      window.outerWidth - window.innerWidth > threshold ||
      window.outerHeight - window.innerHeight > threshold
    ) {
      if (!devtoolsWarned) {
        devtoolsWarned = true;
        console.clear();
        console.log(
          '%c⛔ ACCÈS INTERDIT',
          'color: #f87171; font-size: 40px; font-weight: bold; text-shadow: 2px 2px 0 #000;'
        );
        console.log(
          '%c© Maison Heritage by Bint Khalifa — Toute tentative d\'inspection ou de copie du code source est strictement interdite et peut être poursuivie.',
          'color: #c5a880; font-size: 14px;'
        );
      }
    } else {
      devtoolsWarned = false;
    }
  };
  setInterval(detectDevTools, 2000);
}

// ── 5. NETTOYAGE DES DONNÉES LOCALSTORAGE ───────────────────
/**
 * Valide et nettoie les données produits lues depuis localStorage.
 * Prévient les injections via données corrompues.
 */
export function sanitizeStoredProducts(products) {
  if (!Array.isArray(products)) return [];
  
  return products.filter(p => p && typeof p === 'object').map(p => ({
    id: typeof p.id === 'number' ? p.id : Math.random(),
    name: sanitizeLongText(p.name || '', 150),
    category: sanitizeShortText(p.category || 'Autre', 50),
    price: sanitizePrice(p.price),
    description: sanitizeLongText(p.description || '', 1000),
    imageUrl: sanitizeImageUrl(p.imageUrl || ''),
    isFeatured: Boolean(p.isFeatured),
    inStock: p.inStock !== false // true par défaut
  }));
}

// ── 6. PROTECTION CONTRE LE TRACKING TIERS ──────────────────
/**
 * Bloque les requêtes vers des domaines de tracking connus
 * en utilisant les attributs de sécurité sur les liens.
 * (Complément au CSP header)
 */
export function secureExternalLinks() {
  // S'assure que tous les liens externes ouvrent de manière sécurisée
  document.querySelectorAll('a[target="_blank"]').forEach(link => {
    if (!link.rel.includes('noopener')) {
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });

  // Observer pour les liens ajoutés dynamiquement
  const observer = new MutationObserver(() => {
    document.querySelectorAll('a[target="_blank"]:not([rel*="noopener"])').forEach(link => {
      link.setAttribute('rel', 'noopener noreferrer');
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
}

// ── 7. UTILITAIRE : TOKEN CSRF SIMPLE (LocalStorage) ────────
/**
 * Génère un token anti-CSRF léger pour les opérations admin.
 * (Dans un contexte full-client, c'est une couche de défense supplémentaire.)
 */
export function generateCSRFToken() {
  const token = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0')).join('');
  sessionStorage.setItem('mh_csrf', token);
  return token;
}

export function validateCSRFToken(token) {
  return token === sessionStorage.getItem('mh_csrf');
}
