// Maison Heritage — Base de données produits (LocalStorage + API Express.js)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import * as api from './api';

const INITIAL_PRODUCTS = [
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

const PRODUCTS_KEY = 'maison_heritage_products';
const DB_VERSION_KEY = 'maison_heritage_db_version';
const CURRENT_VERSION = '30.0'; // Forcer la réinitialisation locale

export const getStoredProducts = () => {
  const storedVersion = localStorage.getItem(DB_VERSION_KEY);
  if (storedVersion !== CURRENT_VERSION) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(DB_VERSION_KEY, CURRENT_VERSION);
    return INITIAL_PRODUCTS;
  }

  const products = localStorage.getItem(PRODUCTS_KEY);
  if (!products) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }

  try {
    return JSON.parse(products);
  } catch {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
};

export const saveProducts = (products) => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const addProduct = (product) => {
  const products = getStoredProducts();
  const newProduct = {
    ...product,
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    price: product.price ? Number(product.price) : 0,
    imageUrl: product.imageUrl || '',
    isFeatured: Boolean(product.isFeatured),
    inStock: Boolean(product.inStock),
    isPromo: Boolean(product.isPromo),
  };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
};

export const updateProduct = (updatedProduct) => {
  const products = getStoredProducts();
  const index = products.findIndex(p => p.id === Number(updatedProduct.id));
  if (index !== -1) {
    products[index] = {
      ...products[index],
      ...updatedProduct,
      price: updatedProduct.price ? Number(updatedProduct.price) : 0,
      imageUrl: updatedProduct.imageUrl || '',
      isFeatured: Boolean(updatedProduct.isFeatured),
      inStock: Boolean(updatedProduct.inStock),
      isPromo: Boolean(updatedProduct.isPromo),
    };
    saveProducts(products);
    return products[index];
  }
  return null;
};

export const deleteProduct = (id) => {
  const products = getStoredProducts();
  const filtered = products.filter(p => p.id !== Number(id));
  saveProducts(filtered);
  return true;
};

// ── API Express.js (avec fallback localStorage) ───────────────────

export async function loadProducts() {
  try {
    if (await api.isApiAvailable()) {
      const products = await api.getProducts();
      if (Array.isArray(products) && products.length > 0) {
        saveProducts(products);
        return products;
      }
    }
  } catch (err) {
    console.warn('[Maison Heritage] API produits indisponible — mode local.', err);
  }
  return getStoredProducts();
}

export async function persistProduct(product, isEditing = false) {
  if (await api.isApiAvailable() && api.getToken()) {
    if (isEditing) {
      const updated = await api.updateProductApi(product.id, product);
      return updated;
    }
    return api.createProduct(product);
  }
  return isEditing ? updateProduct(product) : addProduct(product);
}

export async function removeProduct(id) {
  if (await api.isApiAvailable() && api.getToken()) {
    await api.deleteProductApi(id);
    return true;
  }
  return deleteProduct(id);
}
