import { z } from 'zod';

export const StreamerSchema = z.object({
    name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
    slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug deve conter apenas letras minúsculas, números e hífens"),
    avatarUrl: z.string().url("URL do avatar inválida").optional(),
    videoUrl: z.string().url("URL do vídeo inválida").optional().or(z.literal("")),
    bio: z.string().max(500, "Bio pode ter no máximo 500 caracteres").optional(),
    tags: z.array(z.string()).optional(),
    platforms: z.record(z.string(), z.string().url().optional()).optional(),
    isActive: z.boolean().default(true),
    videoPosX: z.number().min(0).max(100).optional(),
    videoPosY: z.number().min(0).max(100).optional(),
    videoScale: z.number().min(0.5).max(2.0).optional()
});

export const WeaponSchema = z.object({
    name: z.string().min(2, "Nome da arma deve ter pelo menos 2 caracteres"),
    slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug deve conter apenas letras minúsculas, números e hífens"),
    category: z.enum(['AR', 'SMG', 'Sniper', 'LMG', 'Shotgun', 'Marksman', 'Pistol', 'Melee']),
    imageUrl: z.string().url("URL da imagem inválida").optional(),
    videos: z.array(z.object({
        id: z.string(),
        url: z.string().url(),
        isActive: z.boolean(),
        createdAt: z.string()
    })).optional(),
    isActive: z.boolean().default(true)
});

export const LoadoutSchema = z.object({
    streamerId: z.string().uuid("ID do streamer inválido"),
    weaponId: z.string().uuid("ID da arma inválido"),
    code: z.string().min(5, "Código do loadout deve ter pelo menos 5 caracteres"),
    attachments: z.object({
        muzzle: z.string().optional(),
        barrel: z.string().optional(),
        optic: z.string().optional(),
        stock: z.string().optional(),
        laser: z.string().optional(),
        underbarrel: z.string().optional(),
        ammo: z.string().optional(),
        rear_grip: z.string().optional(),
        perk: z.string().optional()
    }).optional(),
    mods: z.object({
        one: z.string().default(''),
        two: z.string().default(''),
        three: z.string().default('')
    }).optional(),
    equipment: z.object({
        lethal: z.string().default(''),
        tactical: z.string().default('')
    }).optional(),
    notes: z.string().max(1000).optional()
});
