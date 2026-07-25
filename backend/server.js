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
        "imageUrl": "/assets/parfums/dibor_parfum_2.jpg",
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
        "imageUrl": "/assets/parfums/dibor_parfum_21.jpg",
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
        "imageUrl": "/assets/parfums/dibor_parfum_22.jpg",
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
        "id": 32,
        "name": "Musc & Oud Dibor N°32",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°32.",
        "imageUrl": "/assets/parfums/dibor_parfum_32.jpg",
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
        "id": 34,
        "name": "Musc & Oud Dibor N°34",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°34.",
        "imageUrl": "/assets/parfums/dibor_parfum_34.jpg",
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
        "id": 36,
        "name": "Musc & Oud Dibor N°36",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°36.",
        "imageUrl": "/assets/parfums/dibor_parfum_36.jpg",
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
        "id": 38,
        "name": "Musc & Oud Dibor N°38",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°38.",
        "imageUrl": "/assets/parfums/dibor_parfum_38.jpg",
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
        "id": 43,
        "name": "Musc & Oud Dibor N°43",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°43.",
        "imageUrl": "/assets/parfums/dibor_parfum_43.jpg",
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
        "id": 46,
        "name": "Musc & Oud Dibor N°46",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°46.",
        "imageUrl": "/assets/parfums/dibor_parfum_46.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 47,
        "name": "Musc & Oud Dibor N°47",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°47.",
        "imageUrl": "/assets/parfums/dibor_parfum_47.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 48,
        "name": "Musc & Oud Dibor N°48",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°48.",
        "imageUrl": "/assets/parfums/dibor_parfum_48.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 49,
        "name": "Musc & Oud Dibor N°49",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°49.",
        "imageUrl": "/assets/parfums/dibor_parfum_49.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 50,
        "name": "Musc & Oud Dibor N°50",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°50.",
        "imageUrl": "/assets/parfums/dibor_parfum_50.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 51,
        "name": "Musc & Oud Dibor N°51",
        "category": "Parfums",
        "price": 0,
        "description": "Fragrance d'exception Bint Khalifa aux notes Orientales précieuses — N°51.",
        "imageUrl": "/assets/parfums/dibor_parfum_51.jpg",
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
        "description": "Cadran épuré, boîtier en acier inoxydable et bracelet en cuir noir cousu main.",
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
        "description": "Conçue pour le sport de haut niveau, chronométrage précis et étanche.",
        "imageUrl": "/assets/montres/montre chronometre de course a pied.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 75,
        "name": "Curren Chronographe Cuir",
        "category": "Montres",
        "price": 0,
        "description": "Design élégant et moderne pour les hommes raffinés.",
        "imageUrl": "/assets/montres/curren.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 76,
        "name": "Geneva Équipage Doré",
        "category": "Montres",
        "price": 0,
        "description": "Boîtier doré et finition soignée pour toutes occasions.",
        "imageUrl": "/assets/montres/geneva.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 77,
        "name": "Montre Sport Tactique",
        "category": "Montres",
        "price": 0,
        "description": "Résistance extrême aux chocs et multifonctions.",
        "imageUrl": "/assets/montres/montre 2.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 78,
        "name": "Montre Squelette Mécanique",
        "category": "Montres",
        "price": 0,
        "description": "Mouvement automatique visible à travers le cadran.",
        "imageUrl": "/assets/montres/montre.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 79,
        "name": "Montres Duo Couple Heritage",
        "category": "Montres",
        "price": 0,
        "description": "Ensemble assorti pour lui et pour elle.",
        "imageUrl": "/assets/montres/montres.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 80,
        "name": "Naviforce Chrono Acier",
        "category": "Montres",
        "price": 0,
        "description": "Bracelet en acier inoxydable et cadran multifonction.",
        "imageUrl": "/assets/montres/naviforce.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 81,
        "name": "Skmei Digital Sport",
        "category": "Montres",
        "price": 0,
        "description": "Affichage numérique clair et robustesse à toute épreuve.",
        "imageUrl": "/assets/montres/skmei.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 82,
        "name": "Bracelet Cuir Tressé Homme",
        "category": "Bracelets",
        "price": 0,
        "description": "Cuir véritable tressé avec fermoir magnétique en acier.",
        "imageUrl": "/assets/bracelets/bracelet cuir tresser pour homme.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 83,
        "name": "Cadena Cuir & Acier Noir",
        "category": "Bracelets",
        "price": 0,
        "description": "Design urbain affirmé en cuir noir et plaque gravée.",
        "imageUrl": "/assets/bracelets/cadena cuir noir homme.jpg",
        "isFeatured": true,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 84,
        "name": "Trio Bracelets Dorés Luxe",
        "category": "Bracelets",
        "price": 0,
        "description": "Ensemble de 3 bracelets dorés étincelants.",
        "imageUrl": "/assets/bracelets/3 bracelet en or.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 85,
        "name": "Bracelet Perles Œil de Tigre",
        "category": "Bracelets",
        "price": 0,
        "description": "Perles naturelles aux reflets dorés et marrons d'une grande beauté.",
        "imageUrl": "/assets/bracelets/bracelet oeil de tigre.jpg",
        "isFeatured": true,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 86,
        "name": "Bracelet Pierre de Lave Sauvage",
        "category": "Bracelets",
        "price": 0,
        "description": "Perles volcaniques poreuses pour diffuser vos huiles essentielles.",
        "imageUrl": "/assets/bracelets/bracelet pierre de lave.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 87,
        "name": "Bracelet Or Rose Féminin",
        "category": "Bracelets",
        "price": 0,
        "description": "Finesse et délicatesse pour les poignets élégants.",
        "imageUrl": "/assets/bracelets/bracelet or rose.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 88,
        "name": "Bracelet Perles d'Ébène",
        "category": "Bracelets",
        "price": 0,
        "description": "Bois précieux d'ébène sculpté avec précision.",
        "imageUrl": "/assets/bracelets/bracelet perles ebene.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 89,
        "name": "Bracelet Argent Sterling 925",
        "category": "Bracelets",
        "price": 0,
        "description": "Argent massif poli pour une brillance durable.",
        "imageUrl": "/assets/bracelets/bracelet argent.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 90,
        "name": "Bracelet Cuir Marron Vintage",
        "category": "Bracelets",
        "price": 0,
        "description": "Cuir vieilli patiné pour un look authentique.",
        "imageUrl": "/assets/bracelets/bracelet cuir marron.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 91,
        "name": "Coffret Duo Bracelets Amoureux",
        "category": "Bracelets",
        "price": 0,
        "description": "Symbolisez votre union avec ces deux bracelets assortis.",
        "imageUrl": "/assets/bracelets/bracelet duo.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 92,
        "name": "Tasbih Bois de Santal Ébène",
        "category": "Chapelets",
        "price": 0,
        "description": "99 grains en bois de santal parfumé et séparateurs en ébène.",
        "imageUrl": "/assets/chapelets/chapelet bois de santal.jpg",
        "isFeatured": true,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 93,
        "name": "Tasbih Ambre Royal 99 Perles",
        "category": "Chapelets",
        "price": 0,
        "description": "Perles d'ambre chaud translucides avec pompon de soie dorée.",
        "imageUrl": "/assets/chapelets/chapelet ambre.jpg",
        "isFeatured": true,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 94,
        "name": "Tasbih Argent Massif Gravé",
        "category": "Chapelets",
        "price": 0,
        "description": "Chapelet précieux 33 perles avec breloque calligraphiée en argent.",
        "imageUrl": "/assets/chapelets/chapelet argent.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 95,
        "name": "Tasbih Perles de Nacre d'Orient",
        "category": "Chapelets",
        "price": 0,
        "description": "Reflets irisés magiques pour une méditation sereine.",
        "imageUrl": "/assets/chapelets/chapelet nacre.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 96,
        "name": "Tasbih Pierre de Lune Étoilée",
        "category": "Chapelets",
        "price": 0,
        "description": "Perles laiteuses aux reflets bleutés apaisants.",
        "imageUrl": "/assets/chapelets/chapelet pierre de lune.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 97,
        "name": "Tasbih Turquoise Véritable",
        "category": "Chapelets",
        "price": 0,
        "description": "Bleu turquoise veiné de brun, pompon assorti.",
        "imageUrl": "/assets/chapelets/chapelet turquoise.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 98,
        "name": "Tasbih Agate Noire Mat",
        "category": "Chapelets",
        "price": 0,
        "description": "Élégance sobre et toucher doux de l'agate mat.",
        "imageUrl": "/assets/chapelets/chapelet agate noir.jpg",
        "isFeatured": false,
        "inStock": true,
        "isPromo": false
    },
    {
        "id": 99,
        "name": "Tasbih Lapis Lazuli Oriental",
        "category": "Chapelets",
        "price": 0,
        "description": "Bleu azur profond tacheté d'or de pyrite, avec pompon doré.",
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
