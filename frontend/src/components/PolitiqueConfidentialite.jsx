import React from 'react';
import { Shield, Lock, Eye, Bell, Trash2, Mail, Phone } from 'lucide-react';

const SECTIONS = [
  {
    icon: <Eye size={22} style={{ color: 'var(--color-accent)' }} />,
    title: 'Données collectées',
    content: `Lors de votre utilisation de notre site, nous pouvons collecter les informations suivantes :

• Votre nom et prénom (lors d'une prise de contact ou commande)
• Votre numéro de téléphone (pour la livraison et le suivi via WhatsApp)
• Votre adresse de livraison
• Vos préférences de commande et historique d'achat

Ces données sont collectées uniquement lorsque vous nous les fournissez volontairement via notre formulaire de contact ou en nous contactant directement via WhatsApp.`,
  },
  {
    icon: <Lock size={22} style={{ color: 'var(--color-accent)' }} />,
    title: 'Utilisation de vos données',
    content: `Vos données personnelles sont utilisées exclusivement pour :

• Traiter et livrer vos commandes
• Vous informer sur l'état de votre livraison
• Vous contacter en cas de question sur votre commande
• Améliorer notre service client et notre offre produit
• Vous envoyer des offres promotionnelles (uniquement avec votre accord)

Nous ne vendons, ne louons et ne partageons jamais vos données avec des tiers à des fins commerciales.`,
  },
  {
    icon: <Shield size={22} style={{ color: 'var(--color-accent)' }} />,
    title: 'Protection de vos données',
    content: `La sécurité de vos informations personnelles est notre priorité. Nous mettons en place des mesures techniques et organisationnelles pour protéger vos données contre tout accès non autorisé, perte ou divulgation.

Notre site est hébergé sur des plateformes sécurisées (Vercel en local et Hostinger en production) qui garantissent un haut niveau de protection. Les communications entre votre navigateur et notre site sont chiffrées via HTTPS.

Les mots de passe de notre espace administrateur sont chiffrés avec des algorithmes robustes (PBKDF2 + sel aléatoire) et ne sont jamais stockés en clair.`,
  },
  {
    icon: <Bell size={22} style={{ color: 'var(--color-accent)' }} />,
    title: 'Cookies et stockage local',
    content: `Notre site utilise un stockage local (localStorage) minimal et uniquement fonctionnel :

• Sauvegarde de votre panier d'achat entre les visites
• Maintien de votre session si vous êtes administrateur

Nous n'utilisons pas de cookies publicitaires ou de tracking tiers. Aucun outil d'analyse externe (comme Google Analytics) n'est actif sur ce site.`,
  },
  {
    icon: <Trash2 size={22} style={{ color: 'var(--color-accent)' }} />,
    title: 'Vos droits',
    content: `Conformément aux principes de protection des données personnelles, vous disposez des droits suivants :

• Droit d'accès : consulter les données que nous détenons sur vous
• Droit de rectification : corriger des informations inexactes
• Droit à l'effacement : demander la suppression de vos données
• Droit d'opposition : refuser le traitement de vos données pour certaines finalités
• Droit à la portabilité : recevoir vos données dans un format lisible

Pour exercer ces droits, contactez-nous directement via WhatsApp ou par e-mail.`,
  },
];

export default function PolitiqueConfidentialite() {
  const year = new Date().getFullYear();

  return (
    <section style={{
      backgroundColor: 'var(--bg-dark)',
      minHeight: 'calc(100vh - var(--header-h))',
      paddingBlock: 'clamp(4rem, 8vw, 8rem)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Déco */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-5%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,33,90,0.12) 0%, transparent 70%)',
        filter: 'blur(80px)', pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '860px', margin: '0 auto' }}>

        {/* ── En-tête ── */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 6vw, 5rem)' }} className="anim-fade-in">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(197,168,128,0.1)',
              border: '1px solid rgba(197,168,128,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Shield size={30} style={{ color: 'var(--color-accent)' }} />
            </div>
          </div>
          <span className="text-uppercase-tracking">Transparence & Confiance</span>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            color: '#fff',
            marginTop: '0.6rem',
            marginBottom: '1rem',
            lineHeight: 1.15,
          }}>
            Politique de <span className="text-gold">Confidentialité</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)', maxWidth: '580px', margin: '0 auto', lineHeight: 1.7 }}>
            Chez Maison Heritage, votre vie privée est sacrée. Cette page vous explique
            comment nous collectons, utilisons et protégeons vos informations personnelles.
          </p>
          <div style={{ marginTop: '1.5rem' }}>
            <span className="badge badge-gold" style={{ fontSize: 'var(--fs-xs)' }}>
              Dernière mise à jour : {year}
            </span>
          </div>
        </div>

        {/* ── Sections ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.5rem, 3vw, 2rem)' }}>
          {SECTIONS.map((section, i) => (
            <div
              key={i}
              className="glass"
              style={{
                padding: 'clamp(1.5rem, 3vw, 2.5rem)',
                borderRadius: '16px',
                border: '1px solid rgba(197,168,128,0.12)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.2rem' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: 'rgba(197,168,128,0.08)',
                  border: '1px solid rgba(197,168,128,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {section.icon}
                </div>
                <h2 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'var(--fs-xl)',
                  color: '#fff',
                  lineHeight: 1.2,
                }}>
                  {i + 1}. {section.title}
                </h2>
              </div>
              <div style={{
                color: 'var(--text-muted)',
                fontSize: 'var(--fs-sm)',
                lineHeight: 1.85,
                whiteSpace: 'pre-line',
              }}>
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* ── Contact pour droits ── */}
        <div className="glass-gold" style={{
          marginTop: 'clamp(2rem, 4vw, 3rem)',
          padding: 'clamp(1.5rem, 3vw, 2.5rem)',
          borderRadius: '16px',
          textAlign: 'center',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--fs-xl)',
            color: '#fff',
            marginBottom: '1rem',
          }}>
            Nous contacter pour vos <span className="text-gold">droits</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
            Pour toute question relative à vos données personnelles ou pour exercer vos droits,
            contactez-nous directement :
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a
              href="https://wa.me/221774903713"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ textDecoration: 'none', display: 'inline-flex', gap: '0.5rem', alignItems: 'center', fontSize: 'var(--fs-sm)' }}
            >
              <i className="fa-brands fa-whatsapp" style={{ fontSize: '15px' }}></i> WhatsApp : +221 77 490 37 13
            </a>
            <a
              href="tel:+221773624539"
              className="btn-primary"
              style={{ textDecoration: 'none', display: 'inline-flex', gap: '0.5rem', alignItems: 'center', fontSize: 'var(--fs-sm)' }}
            >
              <i className="fa-solid fa-phone" style={{ fontSize: '15px' }}></i> Appel : +221 77 362 45 39
            </a>
          </div>
        </div>

        {/* ── Mentions hébergement ── */}
        <div style={{
          marginTop: 'clamp(2rem, 4vw, 3rem)',
          padding: '1.5rem',
          borderRadius: '12px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          fontSize: 'var(--fs-xs)',
          color: 'var(--text-muted)',
          lineHeight: 1.8,
        }}>
          <p style={{ fontWeight: 600, color: 'var(--text-soft)', marginBottom: '0.5rem' }}>Informations légales</p>
          <p><strong style={{ color: 'var(--color-accent)' }}>Boutique :</strong> Maison Heritage by Bint Khalifa</p>
          <p><strong style={{ color: 'var(--color-accent)' }}>Localisation :</strong> Dakar, Sénégal</p>
          <p><strong style={{ color: 'var(--color-accent)' }}>Hébergeurs :</strong> Vercel en local &amp; Hostinger en production</p>
          <p><strong style={{ color: 'var(--color-accent)' }}>Développeur :</strong> Zayel</p>
          <p><strong style={{ color: 'var(--color-accent)' }}>Contact :</strong> +221 77 362 45 39</p>
          <p style={{ marginTop: '0.75rem', fontStyle: 'italic' }}>
            Cette politique de confidentialité peut être mise à jour à tout moment. Nous vous invitons à la consulter régulièrement.
          </p>
        </div>
      </div>
    </section>
  );
}
