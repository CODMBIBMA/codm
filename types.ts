
// Data Models matching the requirements

export type UserRole = 'ADMIN' | 'EDITOR' | 'USER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export type WeaponCategory = 'AR' | 'SMG' | 'Sniper' | 'LMG' | 'Shotgun' | 'Marksman' | 'Pistol' | 'Melee';

// --- STATS SYSTEM ---

export interface WeaponStats {
  damage: number;
  accuracy: number;
  range: number;
  fireRate: number;
  mobility: number;
  control: number;
  // Detailed attributes for dynamic calculation (Percentage modifiers mostly or flat values)
  adsSpeed: number;           // ms or %
  adsSpread: number;          // % accuracy
  adsMovementSpeed: number;   // %
  hipFireAccuracy: number;    // %
  sprintToFire: number;       // ms or %
  verticalRecoil: number;     // % control
  lateralRecoil: number;      // % stability
  movementSpeed: number;      // %
  flinchStability: number;    // %
  bulletDensity: number;      // % (Shotguns)
  lungRefresher: number;      // % (Snipers - hold breath duration)
  aimDriftControl: number;    // % (Snipers - sway stability)
}

export interface Attachment {
  id: string;
  name: string;
  slot: keyof Attachments;
  isUniversal: boolean;
  compatibleWeapons?: string[]; // weapon slugs
  compatibleCategories?: WeaponCategory[];
  positiveEffects: string[];
  negativeEffects: string[];
  modifiers: Partial<WeaponStats>;
  flags?: string[]; // 'silenced', 'hiddenFlash'
}

export interface WeaponVideo {
  id: string;
  url: string; // URL do mp4/webm
  isActive: boolean;
  createdAt: string;
}

export interface Weapon {
  id: string;
  name: string;
  slug: string;
  category: WeaponCategory;
  imageUrl: string;
  videos: WeaponVideo[];
  isActive: boolean;
  baseStats?: Partial<WeaponStats>; // Opcional, se não houver usa o global da categoria
}

export interface Streamer {
  id: string;
  name: string;
  slug: string;
  avatarUrl: string;
  videoUrl?: string; // Vídeo de loop para miniatura
  videoPosX?: number; // Posição horizontal (0-100)
  videoPosY?: number; // Posição vertical (0-100)
  videoScale?: number; // Escala do vídeo (0.5 - 2.0)
  bio: string;
  tags: string[];
  platforms: {
    youtube?: string;
    twitch?: string;
    tiktok?: string;
    instagram?: string;
    twitter?: string;
  };
  isActive: boolean;
}

export interface Attachments {
  muzzle?: string;
  barrel?: string;
  optic?: string;
  stock?: string;
  laser?: string;
  underbarrel?: string;
  ammo?: string;
  rear_grip?: string;
  perk?: string;
}

export interface Loadout {
  id: string;
  streamerId: string;
  weaponId: string;
  code: string;
  attachments: Attachments;
  mods: {
    one: string;
    two: string;
    three: string;
  };
  equipment: {
    lethal: string;
    tactical: string;
  };
  notes: string;
  publishedAt: string;
  stats: {
    views: number;
    copies: number;
  };
}

// Expanded types for UI usage with relationships
export interface LoadoutWithDetails extends Loadout {
  streamer: Streamer;
  weapon: Weapon;
}