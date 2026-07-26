const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure directories exist
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded files statically at /api/uploads
app.use('/api/uploads', express.static(UPLOADS_DIR));

// DB File Setup
const DB_FILE = path.join(__dirname, 'database.json');

// Password hash utilities
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  try {
    const [salt, hash] = storedHash.split(':');
    const checkHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === checkHash;
  } catch (err) {
    return false;
  }
}

// Helper to initialize products
function getInitialProducts() {
    return [
    {
        "id": 1,
        "name": "Musc Impérial Dibor",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°1.",
        "imageUrl": "/assets/parfums/dibor_parfum_1.jpg",
        "isFeatured": true,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 2,
        "name": "Oud Royal Bint Khalifa",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°2.",
        "imageUrl": "/assets/parfums/dibor_parfum_1.jpg",
        "isFeatured": true,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 3,
        "name": "Elixir Rose de Nuit",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°3.",
        "imageUrl": "/assets/parfums/dibor_parfum_3.jpg",
        "isFeatured": true,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 4,
        "name": "Santal Suprême Luxury",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°4.",
        "imageUrl": "/assets/parfums/dibor_parfum_4.jpg",
        "isFeatured": true,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 5,
        "name": "Amber Gold Prestige",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°5.",
        "imageUrl": "/assets/parfums/dibor_parfum_5.jpg",
        "isFeatured": true,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 6,
        "name": "Jasmin Privé Edition",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°6.",
        "imageUrl": "/assets/parfums/dibor_parfum_6.jpg",
        "isFeatured": true,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 7,
        "name": "Oud & Safran Impérial",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°7.",
        "imageUrl": "/assets/parfums/dibor_parfum_7.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 8,
        "name": "Cuir Noir d'Arabie",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°8.",
        "imageUrl": "/assets/parfums/dibor_parfum_8.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 9,
        "name": "Musc Secret de Dibor",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°9.",
        "imageUrl": "/assets/parfums/dibor_parfum_9.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 10,
        "name": "Fleur de Coton Nectar",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°10.",
        "imageUrl": "/assets/parfums/dibor_parfum_10.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 11,
        "name": "Oud Al Amir Supreme",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°11.",
        "imageUrl": "/assets/parfums/dibor_parfum_11.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 12,
        "name": "Nuit d'Orient Luxury",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°12.",
        "imageUrl": "/assets/parfums/dibor_parfum_12.jpg",
        "isFeatured": true,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 13,
        "name": "Velours Solaire",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°13.",
        "imageUrl": "/assets/parfums/dibor_parfum_13.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 14,
        "name": "Soleil d'Or Khalifa",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°14.",
        "imageUrl": "/assets/parfums/dibor_parfum_14.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 15,
        "name": "Oud Wood Extrait",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°15.",
        "imageUrl": "/assets/parfums/dibor_parfum_15.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 16,
        "name": "Rose & Oud Seduction",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°16.",
        "imageUrl": "/assets/parfums/dibor_parfum_16.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 17,
        "name": "Baccarat Royal Sillage",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°17.",
        "imageUrl": "/assets/parfums/dibor_parfum_17.jpg",
        "isFeatured": true,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 18,
        "name": "Vanille d'Or Impériale",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°18.",
        "imageUrl": "/assets/parfums/dibor_parfum_18.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 19,
        "name": "Musc Tahara Pure",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°19.",
        "imageUrl": "/assets/parfums/dibor_parfum_19.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 20,
        "name": "Oud Amber Intense",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°20.",
        "imageUrl": "/assets/parfums/dibor_parfum_20.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 21,
        "name": "Santal Blanc Prestige",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°21.",
        "imageUrl": "/assets/parfums/dibor_parfum_18.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 22,
        "name": "L'Héritage Oud Gold",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°22.",
        "imageUrl": "/assets/parfums/dibor_parfum_19.jpg",
        "isFeatured": true,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 23,
        "name": "Sillage Mystique",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°23.",
        "imageUrl": "/assets/parfums/dibor_parfum_23.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 24,
        "name": "Dibor Collection Privée",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°24.",
        "imageUrl": "/assets/parfums/dibor_parfum_24.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 25,
        "name": "Rose Ambrée Khalifa",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°25.",
        "imageUrl": "/assets/parfums/dibor_parfum_25.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 26,
        "name": "Oud Al Sultan",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°26.",
        "imageUrl": "/assets/parfums/dibor_parfum_26.jpg",
        "isFeatured": true,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 27,
        "name": "Musc & Oud Dibor N°27",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°27.",
        "imageUrl": "/assets/parfums/dibor_parfum_27.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 28,
        "name": "Musc & Oud Dibor N°28",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°28.",
        "imageUrl": "/assets/parfums/dibor_parfum_28.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 29,
        "name": "Musc & Oud Dibor N°29",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°29.",
        "imageUrl": "/assets/parfums/dibor_parfum_29.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 30,
        "name": "Musc & Oud Dibor N°30",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°30.",
        "imageUrl": "/assets/parfums/dibor_parfum_30.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 31,
        "name": "Musc & Oud Dibor N°31",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°31.",
        "imageUrl": "/assets/parfums/dibor_parfum_31.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 33,
        "name": "Musc & Oud Dibor N°33",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°33.",
        "imageUrl": "/assets/parfums/dibor_parfum_33.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 35,
        "name": "Musc & Oud Dibor N°35",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°35.",
        "imageUrl": "/assets/parfums/dibor_parfum_35.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 37,
        "name": "Musc & Oud Dibor N°37",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°37.",
        "imageUrl": "/assets/parfums/dibor_parfum_37.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 39,
        "name": "Musc & Oud Dibor N°39",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°39.",
        "imageUrl": "/assets/parfums/dibor_parfum_39.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 40,
        "name": "Musc & Oud Dibor N°40",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°40.",
        "imageUrl": "/assets/parfums/dibor_parfum_40.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 41,
        "name": "Musc & Oud Dibor N°41",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°41.",
        "imageUrl": "/assets/parfums/dibor_parfum_41.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 42,
        "name": "Musc & Oud Dibor N°42",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°42.",
        "imageUrl": "/assets/parfums/dibor_parfum_42.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 44,
        "name": "Musc & Oud Dibor N°44",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°44.",
        "imageUrl": "/assets/parfums/dibor_parfum_44.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 45,
        "name": "Musc & Oud Dibor N°45",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°45.",
        "imageUrl": "/assets/parfums/dibor_parfum_45.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 52,
        "name": "Musc & Oud Dibor N°52",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°52.",
        "imageUrl": "/assets/parfums/dibor_parfum_52.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 53,
        "name": "Signature Dibor Parfums",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°53.",
        "imageUrl": "/assets/parfums/dibor_parfum_53.jpg",
        "isFeatured": true,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 54,
        "name": "Parfum Arvea Impérial",
        "category": "Parfums",
        "price": 0,
        "description": "Parfum d'exception Arvea, fraîcheur et élégance.",
        "imageUrl": "/assets/parfums/arvea.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 55,
        "name": "Boss Intense Luxury",
        "category": "Parfums",
        "price": 0,
        "description": "Signature masculine puissante et charismatique.",
        "imageUrl": "/assets/parfums/boss.jpg",
        "isFeatured": true,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 56,
        "name": "Chanel Élixir d'Orient",
        "category": "Parfums",
        "price": 0,
        "description": "Intemporel floral et boisé d'une grâce infinie.",
        "imageUrl": "/assets/parfums/chanel.jpg",
        "isFeatured": true,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 57,
        "name": "Dior Sauvage Privé",
        "category": "Parfums",
        "price": 0,
        "description": "Fraîcheur sauvage et notes ambrées intenses.",
        "imageUrl": "/assets/parfums/dior.jpg",
        "isFeatured": true,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 58,
        "name": "Guerlain Shalimar d'Or",
        "category": "Parfums",
        "price": 0,
        "description": "Légende orientales aux effluves vanillées.",
        "imageUrl": "/assets/parfums/guerlain.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 59,
        "name": "La Vie Est Belle Élixir",
        "category": "Parfums",
        "price": 0,
        "description": "Sillage gourmand d'iris et de praline.",
        "imageUrl": "/assets/parfums/la vie est belle.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 60,
        "name": "Mon Paris Royal",
        "category": "Parfums",
        "price": 0,
        "description": "Passion florale au cœur de datura et patchouli.",
        "imageUrl": "/assets/parfums/mon paris must.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 61,
        "name": "My Way Nectar Solaire",
        "category": "Parfums",
        "price": 0,
        "description": "Bouquet de fleurs blanches et fleur d'oranger.",
        "imageUrl": "/assets/parfums/my way.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 62,
        "name": "Oud Al Ameer Royal",
        "category": "Parfums",
        "price": 0,
        "description": "Oud princier enrichi d'épices précieuses.",
        "imageUrl": "/assets/parfums/oudd ameer.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 63,
        "name": "Oud & Yass Luxury",
        "category": "Parfums",
        "price": 0,
        "description": "Composition rare aux essences orientales.",
        "imageUrl": "/assets/parfums/oudd et yass oud luxury.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 64,
        "name": "Oud Parfum d'Or",
        "category": "Parfums",
        "price": 0,
        "description": "Flacon d'or et sillage boisé majestueux.",
        "imageUrl": "/assets/parfums/oudd parfum d'or.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 65,
        "name": "Oud Classic Impérial",
        "category": "Parfums",
        "price": 0,
        "description": "Oud traditionnel pour les amateurs de parfum pur.",
        "imageUrl": "/assets/parfums/oudd.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 66,
        "name": "Collection Niche Rare",
        "category": "Parfums",
        "price": 0,
        "description": "Haute parfumerie d'auteur.",
        "imageUrl": "/assets/parfums/parfum de niche.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 67,
        "name": "Essence Suprême",
        "category": "Parfums",
        "price": 0,
        "description": "Extrait concentré de senteurs rares.",
        "imageUrl": "/assets/parfums/parfum.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 68,
        "name": "Coffret Prestige Parfums",
        "category": "Parfums",
        "price": 0,
        "description": "Assortiment d'exception des meilleures fragrances.",
        "imageUrl": "/assets/parfums/parfums.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 69,
        "name": "Sauvage Extrait",
        "category": "Parfums",
        "price": 0,
        "description": "Puissance boisée et épicée intense.",
        "imageUrl": "/assets/parfums/sauvages parfum.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 70,
        "name": "Scandal Sillage Noir",
        "category": "Parfums",
        "price": 0,
        "description": "Miel addictif et gardénia envoûtant.",
        "imageUrl": "/assets/parfums/scandal.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 71,
        "name": "Musc Secret d'Orient",
        "category": "Parfums",
        "price": 0,
        "description": "Douceur mystique de musc oriental.",
        "imageUrl": "/assets/parfums/secret.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 72,
        "name": "Horizon Homme",
        "category": "Montres",
        "price": 0,
        "description": "Cadran épuré, boîtier en acier inoxydable et bracelet en cuir noir.",
        "imageUrl": "/assets/montres/horizon montre homme.jpg",
        "isFeatured": true,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 73,
        "name": "Rolex Submariner Classic",
        "category": "Montres",
        "price": 0,
        "description": "Le grand classique de l'horlogerie de luxe avec cadran noir tournant.",
        "imageUrl": "/assets/montres/rolex.jpg",
        "isFeatured": true,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 74,
        "name": "Montre Chronomètre Course",
        "category": "Montres",
        "price": 0,
        "description": "Conçue pour le sport de haut niveau, chronométrage précis.",
        "imageUrl": "/assets/montres/montre chronometre de course a pied.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 75,
        "name": "Montre Connectée Sport",
        "category": "Montres",
        "price": 0,
        "description": "Moniteur cardio multisport avec suivi d'activité.",
        "imageUrl": "/assets/montres/montre connectée  multisport cardio.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 76,
        "name": "Montre Militaire Tactique",
        "category": "Montres",
        "price": 0,
        "description": "Robustesse extrême, boîtier renforcé et étanche.",
        "imageUrl": "/assets/montres/montre de guerre.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 77,
        "name": "Montre Prestige Luxury",
        "category": "Montres",
        "price": 0,
        "description": "Finition haut de gamme et mouvement automatique suisse.",
        "imageUrl": "/assets/montres/montre de luxe.com",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 78,
        "name": "Montre Élégante Gold",
        "category": "Montres",
        "price": 0,
        "description": "Boîtier doré et cadran épuré pour toutes occasions.",
        "imageUrl": "/assets/montres/montre stylé et elegant.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 79,
        "name": "Montres Couple Heritage",
        "category": "Montres",
        "price": 0,
        "description": "Ensemble assorti pour lui et pour elle.",
        "imageUrl": "/assets/montres/montres couples personnalisé.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 80,
        "name": "Generic Homme Classic",
        "category": "Montres",
        "price": 0,
        "description": "Modèle simple et intemporel pour le quotidien.",
        "imageUrl": "/assets/montres/generic montre homme.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 81,
        "name": "Montre-Bijou Femme Chic",
        "category": "Montres",
        "price": 0,
        "description": "Montre-bijou fine pour sublimer le poignet féminin.",
        "imageUrl": "/assets/montres/bracelet chic et elegant pour femme.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 82,
        "name": "Gourmette Artisanat Dakar",
        "category": "Bracelets",
        "price": 0,
        "description": "Maille gourmette large ciselée à la main en argent.",
        "imageUrl": "/assets/bracelets/art.jpg",
        "isFeatured": true,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 83,
        "name": "Bohomoon Dainty Ball",
        "category": "Bracelets",
        "price": 0,
        "description": "Bracelet délicat avec perles miniatures dorées.",
        "imageUrl": "/assets/bracelets/bohomoon dainty ball bracelet.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 84,
        "name": "Bracelet Classique Homme",
        "category": "Bracelets",
        "price": 0,
        "description": "Fermoir en acier et lanières de cuir tressé noir.",
        "imageUrl": "/assets/bracelets/bracelet classic homme.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 85,
        "name": "Jonc Élégance Pure",
        "category": "Bracelets",
        "price": 0,
        "description": "Jonc ouvert ajustable orné de finitions dorées.",
        "imageUrl": "/assets/bracelets/bracelet elegant.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 86,
        "name": "Bracelet Pierres de Soleil",
        "category": "Bracelets",
        "price": 0,
        "description": "Perles énergétiques en pierre de soleil aux nuances orangées.",
        "imageUrl": "/assets/bracelets/bracelet en pieres de soleil.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 87,
        "name": "Bracelet Pierres Naturelles Oeil de Tigre",
        "category": "Bracelets",
        "price": 0,
        "description": "Perles en oeil de tigre brun pour force et protection.",
        "imageUrl": "/assets/bracelets/bracelet en pierres naturelles.jpg",
        "isFeatured": true,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 88,
        "name": "Histoire d'Or Gourmette",
        "category": "Bracelets",
        "price": 0,
        "description": "Fine gourmette en or brillant.",
        "imageUrl": "/assets/bracelets/histoir d'or.jpg",
        "isFeatured": true,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 89,
        "name": "Bracelet Simple et Élégant",
        "category": "Bracelets",
        "price": 0,
        "description": "Chaînette minimaliste avec pendentif solitaire.",
        "imageUrl": "/assets/bracelets/simple et elegant.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 90,
        "name": "Manchette Top Level",
        "category": "Bracelets",
        "price": 0,
        "description": "Large manchette dorée texturée pour un style affirmé.",
        "imageUrl": "/assets/bracelets/top level.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 91,
        "name": "Bracelet Prestige Top",
        "category": "Bracelets",
        "price": 0,
        "description": "Combinaison de mailles modernes alternées or et argent.",
        "imageUrl": "/assets/bracelets/top.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 92,
        "name": "Tasbih Chapelet 10 Grains",
        "category": "Chapelets",
        "price": 0,
        "description": "Tasbih de poche pratique taillé dans un bois odorant.",
        "imageUrl": "/assets/chapelets/chapelet 10.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 93,
        "name": "Tasbih Santal 33 Grains",
        "category": "Chapelets",
        "price": 0,
        "description": "Tasbih traditionnel en bois de santal noble.",
        "imageUrl": "/assets/chapelets/chapelet 3.jpg",
        "isFeatured": true,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 94,
        "name": "Tasbih Corail Rouge & Argent",
        "category": "Chapelets",
        "price": 0,
        "description": "33 grains de corail rouge sertis de séparateurs argentés.",
        "imageUrl": "/assets/chapelets/chapelet 4.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 95,
        "name": "Chapelet Contemplation Pur",
        "category": "Chapelets",
        "price": 0,
        "description": "Tasbih en nacre blanche avec pompon brodé de soie.",
        "imageUrl": "/assets/chapelets/chapelet 5.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 96,
        "name": "Tasbih Prestige Ébène",
        "category": "Chapelets",
        "price": 0,
        "description": "99 grains de bois d'ébène noir royal incrustés.",
        "imageUrl": "/assets/chapelets/chapelet 6.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 97,
        "name": "Tasbih Simple Bois d'Agar",
        "category": "Chapelets",
        "price": 0,
        "description": "Parfumé naturellement, s'intensifie au fil des prières.",
        "imageUrl": "/assets/chapelets/chapelet 7.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 98,
        "name": "Tasbih Ambre de la Baltique",
        "category": "Chapelets",
        "price": 0,
        "description": "Tasbih en perles d'ambre véritable aux reflets de miel.",
        "imageUrl": "/assets/chapelets/chapelet 8.jpg",
        "isFeatured": true,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 99,
        "name": "Tasbih Lapis Lazuli Oriental",
        "category": "Chapelets",
        "price": 0,
        "description": "Bleu azur profond tacheté d'or avec pompon doré.",
        "imageUrl": "/assets/chapelets/chapelet 9.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 100,
        "name": "Tasbih Traditionnel Perles",
        "category": "Chapelets",
        "price": 0,
        "description": "Tasbih universel 99 grains en perles lisses.",
        "imageUrl": "/assets/chapelets/chapelet.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    }
];
}

// Read database
function loadDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    // Initial Seed
    const db = {
      admins: [
        {
          username: 'zayelkhalifa',
          name: 'Super Admin',
          passwordHash: hashPassword('khalifazayelpro'),
          privileges: ['edit_products', 'edit_orders', 'manage_admins']
        }
      ],
      products: getInitialProducts(),
      orders: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
    return db;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db file, resetting database', err);
    return { admins: [], products: [], orders: [] };
  }
}

// Write database
function saveDatabase(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
}

// Load DB once at start
let db = loadDatabase();

// In-memory active sessions: token -> user
const activeSessions = new Map();

// Authentication middleware
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Accès refusé. Token manquant ou invalide.' });
  }

  const token = authHeader.split(' ')[1];
  const user = activeSessions.get(token);

  if (!user) {
    return res.status(401).json({ message: 'Session expirée ou invalide. Reconnectez-vous.' });
  }

  req.user = user;
  next();
}

// Privilege check middleware factory
function requirePrivilege(privilege) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Non authentifié.' });
    }

    // Super Admin zayelkhalifa bypasses checks or we check in privileges array
    if (req.user.username === 'zayelkhalifa' || (req.user.privileges && req.user.privileges.includes(privilege))) {
      return next();
    }

    return res.status(403).json({ message: `Accès interdit. Privilège '${privilege}' requis.` });
  };
}

// Multer Config for Product Images Upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Uniquement des fichiers images (jpg, png, gif, webp)...'));
  }
});

// ── ROUTES ADMIN AUTH ─────────────────────────────────────────

// POST /api/admin/login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Nom d\'utilisateur et mot de passe requis.' });
  }

  db = loadDatabase(); // reload to get any newly created admins
  const admin = db.admins.find(a => a.username.trim().toLowerCase() === username.trim().toLowerCase());

  if (!admin || !verifyPassword(password, admin.passwordHash)) {
    return res.status(401).json({ message: 'Identifiants incorrects.' });
  }

  // Generate session token
  const token = crypto.randomBytes(32).toString('hex');
  activeSessions.set(token, {
    username: admin.username,
    name: admin.name,
    privileges: admin.privileges || []
  });

  return res.json({
    token: token,
    user: {
      name: admin.name,
      username: admin.username,
      privileges: admin.privileges || []
    }
  });
});

// POST /api/admin/logout
app.post('/api/admin/logout', authenticate, (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader.split(' ')[1];
  activeSessions.delete(token);
  return res.json({ ok: true });
});

// GET /api/admin/me
app.get('/api/admin/me', authenticate, (req, res) => {
  return res.json({
    name: req.user.name,
    username: req.user.username,
    privileges: req.user.privileges
  });
});

// POST /api/admin/create (Super Admin only or manage_admins privilege)
app.post('/api/admin/create', authenticate, requirePrivilege('manage_admins'), (req, res) => {
  const { name, username, password, privileges } = req.body;

  if (!name || !username || !password) {
    return res.status(400).json({ message: 'Champs requis : nom, nom d\'utilisateur et mot de passe.' });
  }

  db = loadDatabase();
  const exists = db.admins.some(a => a.username.trim().toLowerCase() === username.trim().toLowerCase());
  if (exists) {
    return res.status(400).json({ message: 'Ce nom d\'utilisateur est déjà utilisé.' });
  }

  const newAdmin = {
    name: name.trim(),
    username: username.trim(),
    passwordHash: hashPassword(password),
    privileges: Array.isArray(privileges) ? privileges : ['edit_products']
  };

  db.admins.push(newAdmin);
  saveDatabase(db);

  return res.status(201).json({
    message: 'Compte administrateur créé avec succès !',
    admin: {
      name: newAdmin.name,
      username: newAdmin.username,
      privileges: newAdmin.privileges
    }
  });
});

// GET /api/admin/users (Lists all admins, manage_admins privilege)
app.get('/api/admin/users', authenticate, requirePrivilege('manage_admins'), (req, res) => {
  db = loadDatabase();
  const list = db.admins.map(a => ({
    name: a.name,
    username: a.username,
    privileges: a.privileges
  }));
  return res.json(list);
});

// DELETE /api/admin/users/:username (Delete sub-admin, Super Admin only)
app.delete('/api/admin/users/:username', authenticate, requirePrivilege('manage_admins'), (req, res) => {
  const { username } = req.params;

  if (username === 'zayelkhalifa') {
    return res.status(400).json({ message: 'Impossible de supprimer le Super Admin.' });
  }

  db = loadDatabase();
  const index = db.admins.findIndex(a => a.username === username);
  if (index === -1) {
    return res.status(404).json({ message: 'Administrateur introuvable.' });
  }

  db.admins.splice(index, 1);
  saveDatabase(db);

  // Invalidate any active session for this deleted admin
  for (const [token, session] of activeSessions.entries()) {
    if (session.username === username) {
      activeSessions.delete(token);
    }
  }

  return res.json({ ok: true, message: 'Administrateur supprimé.' });
});

// ── PRODUCTS ENDPOINTS ────────────────────────────────────────

// GET /api/products (Public)
app.get('/api/products', (req, res) => {
  db = loadDatabase();
  // Sort featured first, then by name
  const list = [...db.products].sort((a, b) => {
    if (b.isFeatured !== a.isFeatured) {
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    }
    return a.name.localeCompare(b.name);
  });
  return res.json(list);
});

// POST /api/products/upload (Auth, edit_products)
app.post('/api/products/upload', authenticate, requirePrivilege('edit_products'), upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Aucun fichier reçu.' });
  }
  const fileUrl = `/api/uploads/${req.file.filename}`;
  return res.json({ imageUrl: fileUrl });
});

// POST /api/products (Auth, edit_products)
app.post('/api/products', authenticate, requirePrivilege('edit_products'), (req, res) => {
  const { name, category, price, description, imageUrl, isFeatured, inStock, isPromo } = req.body;

  if (!name || !category) {
    return res.status(400).json({ message: 'Le nom et la catégorie sont requis.' });
  }

  db = loadDatabase();
  const newId = db.products.length > 0 ? Math.max(...db.products.map(p => p.id)) + 1 : 1;

  const newProduct = {
    id: newId,
    name: name.trim(),
    category: category.trim(),
    price: price ? parseFloat(price) : 0,
    description: description ? description.trim() : '',
    imageUrl: imageUrl || '',
    isFeatured: !!isFeatured,
    inStock: inStock !== false,
    isPromo: !!isPromo
  };

  db.products.push(newProduct);
  saveDatabase(db);

  return res.status(201).json(newProduct);
});

// PUT /api/products/:id (Auth, edit_products)
app.put('/api/products/:id', authenticate, requirePrivilege('edit_products'), (req, res) => {
  const id = parseInt(req.params.id);
  const { name, category, price, description, imageUrl, isFeatured, inStock, isPromo } = req.body;

  db = loadDatabase();
  const index = db.products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Produit introuvable.' });
  }

  const updatedProduct = {
    ...db.products[index],
    name: name ? name.trim() : db.products[index].name,
    category: category ? category.trim() : db.products[index].category,
    price: price !== undefined ? parseFloat(price) : db.products[index].price,
    description: description !== undefined ? description.trim() : db.products[index].description,
    imageUrl: imageUrl !== undefined ? imageUrl : db.products[index].imageUrl,
    isFeatured: isFeatured !== undefined ? !!isFeatured : db.products[index].isFeatured,
    inStock: inStock !== undefined ? !!inStock : db.products[index].inStock,
    isPromo: isPromo !== undefined ? !!isPromo : db.products[index].isPromo
  };

  db.products[index] = updatedProduct;
  saveDatabase(db);

  return res.json(updatedProduct);
});

// DELETE /api/products/:id (Auth, edit_products)
app.delete('/api/products/:id', authenticate, requirePrivilege('edit_products'), (req, res) => {
  const id = parseInt(req.params.id);

  db = loadDatabase();
  const filtered = db.products.filter(p => p.id !== id);

  if (filtered.length === db.products.length) {
    return res.status(404).json({ message: 'Produit introuvable.' });
  }

  db.products = filtered;
  saveDatabase(db);

  return res.json({ ok: true });
});

// ── ORDERS ENDPOINTS ──────────────────────────────────────────

// GET /api/orders (Auth, edit_orders)
app.get('/api/orders', authenticate, requirePrivilege('edit_orders'), (req, res) => {
  db = loadDatabase();
  return res.json(db.orders);
});

// POST /api/orders (Public)
app.post('/api/orders', (req, res) => {
  const { items, total, customerNote } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'La commande doit contenir au moins un article.' });
  }

  db = loadDatabase();
  const orderId = `CMD-${Date.now()}`;

  const newOrder = {
    id: orderId,
    createdAt: new Date().toISOString(),
    status: 'pending',
    items: items.map(i => ({
      id: i.id,
      name: i.name,
      category: i.category,
      price: i.price ? parseFloat(i.price) : 0,
      quantity: parseInt(i.quantity) || 1,
      imageUrl: i.imageUrl || ''
    })),
    total: total ? parseFloat(total) : 0,
    customerNote: customerNote || ''
  };

  db.orders.unshift(newOrder);
  saveDatabase(db);

  return res.status(201).json(newOrder);
});

// PATCH /api/orders/:id/status (Auth, edit_orders)
app.patch('/api/orders/:id/status', authenticate, requirePrivilege('edit_orders'), (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['pending', 'confirmed', 'delivered', 'cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Statut invalide.' });
  }

  db = loadDatabase();
  const index = db.orders.findIndex(o => o.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Commande introuvable.' });
  }

  db.orders[index].status = status;
  db.orders[index].updatedAt = new Date().toISOString();
  saveDatabase(db);

  return res.json(db.orders[index]);
});

// DELETE /api/orders/:id (Auth, edit_orders)
app.delete('/api/orders/:id', authenticate, requirePrivilege('edit_orders'), (req, res) => {
  const { id } = req.params;

  db = loadDatabase();
  const filtered = db.orders.filter(o => o.id !== id);

  if (filtered.length === db.orders.length) {
    return res.status(404).json({ message: 'Commande introuvable.' });
  }

  db.orders = filtered;
  saveDatabase(db);

  return res.json({ ok: true });
});

// GET /api/stats (Auth, edit_orders)
app.get('/api/stats', authenticate, requirePrivilege('edit_orders'), (req, res) => {
  db = loadDatabase();

  const delivered = db.orders.filter(o => o.status === 'delivered');
  const pending = db.orders.filter(o => o.status === 'pending');
  const confirmed = db.orders.filter(o => o.status === 'confirmed');

  const revenueDelivered = delivered.reduce((sum, o) => sum + (o.total || 0), 0);
  const revenuePending = [...pending, ...confirmed].reduce((sum, o) => sum + (o.total || 0), 0);
  const inventoryValue = db.products.reduce((sum, p) => sum + (p.price > 0 ? p.price : 0), 0);

  return res.json({
    totalOrders: db.orders.length,
    pendingCount: pending.length,
    confirmedCount: confirmed.length,
    deliveredCount: delivered.length,
    revenueDelivered,
    revenuePending,
    inventoryValue,
    productCount: db.products.length,
    featuredCount: db.products.filter(p => p.isFeatured).length
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'Maison Heritage Express API' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
