// ============================================================
// EMBEDDED TITAN DATA
// ✅ Using weserv.nl with path-only wikia URLs (no nested ?cb= param)
// Format: ?url=static.wikia.nocookie.net/.../revision/latest (no extra query)
// ============================================================
const w = (path) => `https://images.weserv.nl/?url=static.wikia.nocookie.net/shingekinokyojin/images/${path}/revision/latest`;

export const TITANS_DATA = [
  {
    id: 1,
    name: "Attack Titan",
    img: w("a/ae/Attack_Titan_%28Anime%29_character_image_%28Eren_Jaeger%29.png"),
    height: "15m",
    abilities: ["Future memory inheritance", "Driven to fight for freedom", "Passes memories to past holders"],
    allegiance: "Eldia",
    description: "A Titan that has always fought for freedom. Its inheritors are driven by the future memories of those who come after them."
  },
  {
    id: 2,
    name: "Founding Titan",
    img: w("3/3a/Eren_Jaeger_%28Anime%29_character_image_%28Founding_Titan%29.png"),
    height: "350m+",
    abilities: ["Titan creation", "Titan behavioral control", "Memory manipulation of Subjects of Ymir", "Telepathic communication"],
    allegiance: "Eldia",
    description: "The source of all Titan power. The Founding Titan can create and control all Titans and alter the memories of Subjects of Ymir."
  },
  {
    id: 3,
    name: "War Hammer Titan",
    img: w("b/b2/Lara_Tybur_%28Anime%29_character_image_%28Titan%29.png"),
    height: "~15m",
    abilities: ["Structural hardening", "Remote operation", "Creates weapons from hardened flesh"],
    allegiance: "Eldia",
    description: "Can create structures and weapons from hardened Titan flesh. Uniquely, the operator can control from within a crystal shell rather than the Titan's nape."
  },
  {
    id: 4,
    name: "Colossal Titan",
    img: w("e/ed/Colossal_Titan_%28Anime%29_character_image_%28Armin_Arlelt%29.png"),
    height: "60m",
    abilities: ["Explosive transformation", "Immense size and strength", "Steam emission", "Selective movement control"],
    allegiance: "Eldia",
    description: "The most iconic of all Titans. Its explosive transformation and steam emission are weapons of mass destruction, capable of leveling entire districts."
  },
  {
    id: 5,
    name: "Armored Titan",
    img: w("c/cf/Armored_Titan_%28Anime%29_character_image_%28Reiner_Braun%29.png"),
    height: "15m",
    abilities: ["Armored skin", "Selective hardening", "Enhanced strength and durability"],
    allegiance: "Marley",
    description: "Covered in a layer of hardened Titan flesh acting as armor. The plating can be selectively deployed for movement or combat."
  },
  {
    id: 6,
    name: "Female Titan",
    img: w("4/44/Female_Titan_%28Anime%29_character_image_%28Annie_Leonhart%29.png"),
    height: "14m",
    abilities: ["Versatility", "Titan attraction", "Crystallization", "Selective hardening"],
    allegiance: "Marley",
    description: "A highly versatile Titan able to partially harden its body and attract Pure Titans with a special scream."
  },
  {
    id: 7,
    name: "Beast Titan",
    img: w("8/89/Beast_Titan_%28Anime%29_character_image_%28Zeke_Jaeger%29.png"),
    height: "17m",
    abilities: ["Powerful and accurate throwing", "Hardening", "Speech", "Controls Subjects of Ymir (royal blood only)"],
    allegiance: "None",
    description: "An ape-like Titan with extraordinary throwing precision. Those with royal blood can turn Subjects of Ymir into Titans and control them."
  },
  {
    id: 8,
    name: "Jaw Titan",
    img: w("d/da/Jaw_Titan_%28Anime%29_character_image_%28Porco_Galliard%29.png"),
    height: "5m",
    abilities: ["Powerful jaw strength that can bite through any material", "Hardened claws", "Great speed and agility"],
    allegiance: "Marley",
    description: "The smallest and fastest of the Nine. Its jaws and claws are hardened to the point of being able to crush nearly any material, including the War Hammer Titan's crystal."
  },
  {
    id: 9,
    name: "Cart Titan",
    img: w("2/2e/Cart_Titan_%28Anime%29_character_image_%28Pieck_Finger%29.png"),
    height: "4m",
    abilities: ["Quadrupedal form", "High endurance", "Great speed", "Speech"],
    allegiance: "Marley",
    description: "A quadrupedal Titan with exceptional endurance that can be harnessed with artillery. Its inheritor retains full speech capability."
  }
];

// ============================================================
// Character image proxy — fixes CORS/hotlink from wikia
// ============================================================
export const proxyImage = (url) => {
  if (!url) return null;
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
};

const AOT_API_BASE = 'https://api.attackontitanapi.com';
const JIKAN_API_BASE = 'https://api.jikan.moe/v4';

export const fetchCharacters = async (page = 1) => {
  const response = await fetch(`${AOT_API_BASE}/characters?page=${page}`);
  if (!response.ok) throw new Error('Failed to fetch characters');
  const data = await response.json();
  data.results = data.results.map(char => ({
    ...char,
    img: char.img ? proxyImage(char.img) : null
  }));
  return data;
};

export const fetchTitans = async () => {
  return { results: TITANS_DATA };
};

export const fetchCharacterById = async (id) => {
  const response = await fetch(`${AOT_API_BASE}/characters/${id}`);
  if (!response.ok) throw new Error('Failed to fetch character details');
  return response.json();
};

export const fetchAnimeInfo = async (animeId = 16498) => {
  const response = await fetch(`${JIKAN_API_BASE}/anime/${animeId}`);
  if (!response.ok) throw new Error('Failed to fetch anime info');
  return response.json();
};

export const fetchAnimeEpisodes = async (animeId = 16498, page = 1) => {
  const response = await fetch(`${JIKAN_API_BASE}/anime/${animeId}/episodes?page=${page}`);
  if (!response.ok) throw new Error('Failed to fetch episodes');
  return response.json();
};

export const fetchAnimeStaff = async (animeId = 16498) => {
  const response = await fetch(`${JIKAN_API_BASE}/anime/${animeId}/staff`);
  if (!response.ok) throw new Error('Failed to fetch staff');
  return response.json();
};
