import React from 'react';
import { Send, MapPin, Phone, Clock, AlertTriangle } from 'lucide-react';
import { sanitizeShortText, sanitizeLongText, sanitizePhone } from '../utils/security';

// Sujets autorisés (whitelist) — empêche toute injection via le select
const ALLOWED_SUBJECTS = [
  "Demande d'information",
  "Commande personnalisée / sur mesure",
  "Prise de rendez-vous boutique",
  "Autre demande",
];

const EMPTY = { name: '', phone: '', city: '', subject: ALLOWED_SUBJECTS[0], message: '' };

export default function ContactForm() {
  const [formData, setFormData] = React.useState(EMPTY);
  const [errors, setErrors] = React.useState({});
  const [sent, setSent] = React.useState(false);

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Votre nom est requis.';
    if (formData.name.trim().length < 2) e.name = 'Nom trop court (min. 2 caractères).';
    if (!formData.message.trim()) e.message = 'Veuillez écrire un message.';
    if (formData.message.trim().length < 5) e.message = 'Message trop court (min. 5 caractères).';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(false);
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    // Sanitise toutes les entrées avant de construire le message WhatsApp
    const cleanName    = sanitizeShortText(formData.name, 100);
    const cleanPhone   = sanitizePhone(formData.phone);
    const cleanSubject = ALLOWED_SUBJECTS.includes(formData.subject) ? formData.subject : ALLOWED_SUBJECTS[0];
    const cleanMsg     = sanitizeLongText(formData.message, 1000);

    let text = `Bonjour *Maison Heritage* ✨\n\n`;
    text += `J'aimerais vous contacter au sujet de : *${cleanSubject}*\n\n`;
    text += `👤 *Nom :* ${cleanName}\n`;
    if (cleanPhone) text += `📞 *Téléphone :* ${cleanPhone}\n`;
    const cleanCity = sanitizeShortText(formData.city, 80);
    if (cleanCity) text += `📍 *Lieu de livraison :* ${cleanCity}\n`;
    text += `\n💬 *Message :*\n"${cleanMsg}"\n\nMerci d'avance pour votre retour !`;

    window.open(`https://wa.me/221774903713?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    setFormData(EMPTY);
    setErrors({});
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <section id="contact-section" style={{
      padding: 'var(--space-3xl) 0',
      backgroundColor: '#040810',
    }}>
      <div className="container">
        {/* ── Titre ── */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          <span className="text-uppercase-tracking">Entrer en contact</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--fs-3xl)', color: '#fff', marginTop: '0.5rem' }}>
            NOUS <span className="text-gold">CONTACTER</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)', maxWidth: '540px', margin: '0.8rem auto 0' }}>
            Une question, un rendez-vous ou une commande spéciale ? Envoyez-nous un message directement sur WhatsApp.
          </p>
        </div>

        {/* ── Layout grille ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 310px), 1fr))',
          gap: 'clamp(1.5rem, 4vw, 3.5rem)',
          alignItems: 'start',
        }}>
          {/* ── Infos coordonnées ── */}
          <div className="glass" style={{
            padding: 'clamp(1.5rem, 4vw, 2.5rem)',
            borderRadius: '16px',
            border: '1px solid rgba(197,168,128,0.15)',
            display: 'flex', flexDirection: 'column', gap: '2rem',
          }}>
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--fs-xl)',
              color: 'var(--color-accent)',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              paddingBottom: '0.8rem',
            }}>
              Maison Heritage Dakar
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                {
                  Icon: MapPin, label: 'Boutique en ligne',
                  content: <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)', lineHeight: '1.5' }}>
                    🌍 Livraison partout où vous êtes<br />Sénégal &amp; au-delà — depuis Dakar
                  </p>
                },
                {
                  Icon: Phone, label: 'WhatsApp & Téléphone',
                  content: (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <a href="https://wa.me/221774903713" target="_blank" rel="noopener noreferrer"
                        style={{ color: 'var(--color-accent)', fontSize: 'var(--fs-sm)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        <i className="fa-brands fa-whatsapp" style={{ color: '#25D366' }}></i> +221 77 490 37 13
                      </a>
                    </div>
                  )
                },
                {
                  Icon: Clock, label: 'Horaires & Livraison',
                  content: <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)', lineHeight: '1.5' }}>
                    Lundi – Samedi : 09:00 – 19:30<br />🚚 Livraison partout au Sénégal
                  </p>
                },
              ].map(({ Icon, label, content }) => (
                <div key={label} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <Icon size={20} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
                  <div>
                    <h4 style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: '#fff', marginBottom: '3px' }}>{label}</h4>
                    {content}
                  </div>
                </div>
              ))}
            </div>

            {/* Carte décorative */}
            <div style={{
              height: '100px',
              background: 'rgba(255,255,255,0.01)',
              border: '1px dashed rgba(197,168,128,0.2)',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-accent)', fontSize: 'var(--fs-xs)',
              fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>
              📍 Dakar, Sénégal
            </div>
          </div>

          {/* ── Formulaire ── */}
          <div className="glass" style={{
            padding: 'clamp(1.5rem, 4vw, 2.5rem)',
            borderRadius: '16px',
            border: '1px solid rgba(197,168,128,0.15)',
          }}>
            {/* Message succès */}
            {sent && (
              <div style={{
                background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)',
                color: '#4ade80', padding: '0.75rem 1rem', borderRadius: '8px',
                marginBottom: '1.2rem', fontSize: 'var(--fs-xs)',
              }} role="status" aria-live="polite">
                ✅ Message préparé ! WhatsApp s'est ouvert pour vous.
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {/* Nom */}
              <div className="form-group">
                <label className="form-label" htmlFor="c-name">Votre Nom Complet *</label>
                <input
                  id="c-name" type="text" name="name"
                  value={formData.name} onChange={handleChange}
                  placeholder="Ex: Fatou Diop" className="form-input"
                  required maxLength={100}
                  aria-invalid={!!errors.name} aria-describedby={errors.name ? 'err-cname' : undefined}
                />
                {errors.name && <span id="err-cname" className="form-error" role="alert"><AlertTriangle size={12} />{errors.name}</span>}
              </div>

              {/* Téléphone */}
              <div className="form-group">
                <label className="form-label" htmlFor="c-phone">Téléphone (Facultatif)</label>
                <input
                  id="c-phone" type="tel" name="phone"
                  value={formData.phone} onChange={handleChange}
                  placeholder="Ex: 77 123 45 67" className="form-input"
                  maxLength={20} pattern="[\d\s+\-]*"
                />
              </div>

              {/* Lieu de livraison */}
              <div className="form-group">
                <label className="form-label" htmlFor="c-city">Ville / Lieu de livraison</label>
                <input
                  id="c-city" type="text" name="city"
                  value={formData.city} onChange={handleChange}
                  placeholder="Ex: Dakar, Thiès, Saint-Louis..." className="form-input"
                  maxLength={80}
                />
              </div>

              {/* Sujet */}
              <div className="form-group">
                <label className="form-label" htmlFor="c-subject">Sujet</label>
                <select id="c-subject" name="subject" value={formData.subject} onChange={handleChange} className="form-select">
                  {ALLOWED_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Message */}
              <div className="form-group">
                <label className="form-label" htmlFor="c-msg">Votre Message *</label>
                <textarea
                  id="c-msg" name="message"
                  value={formData.message} onChange={handleChange}
                  placeholder="Écrivez votre message ici..." className="form-textarea"
                  required maxLength={1000}
                  aria-invalid={!!errors.message} aria-describedby={errors.message ? 'err-cmsg' : undefined}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {errors.message
                    ? <span id="err-cmsg" className="form-error" role="alert"><AlertTriangle size={12} />{errors.message}</span>
                    : <span />
                  }
                  <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>{formData.message.length}/1000</span>
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.3rem' }}>
                <Send size={16} aria-hidden="true" /> Envoyer via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
