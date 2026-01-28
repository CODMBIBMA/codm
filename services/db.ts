import { Streamer, Weapon, Loadout, LoadoutWithDetails, User } from '../types';
import { supabase } from './supabase';

// --- SERVICE CLASS ---

class SupabaseDB {
  private currentUser: User | null = null;

  constructor() {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        this.currentUser = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || 'Admin',
          role: (session.user.user_metadata?.role as any) || 'ADMIN'
        };
      } else {
        this.currentUser = null;
      }
    });
  }

  // --- HELPER MAPPING ---
  // Maps DB snake_case to Frontend camelCase
  private mapStreamer(s: any): Streamer {
    return {
      id: s.id,
      name: s.name,
      slug: s.slug,
      avatarUrl: s.avatar_url,
      videoUrl: s.video_url,
      videoPosX: s.video_pos_x || 50,
      videoPosY: s.video_pos_y || 50,
      videoScale: s.video_scale || 1,
      bio: s.bio,
      tags: s.tags || [],
      platforms: s.platforms || {},
      isActive: s.is_active
    };
  }

  private mapWeapon(w: any): Weapon {
    return {
      id: w.id,
      name: w.name,
      slug: w.slug,
      category: w.category as any,
      imageUrl: w.image_url,
      videos: w.videos || [],
      isActive: w.is_active
    };
  }

  private mapLoadout(l: any): Loadout {
    const p = l.perks || {};
    return {
      id: l.id,
      streamerId: l.streamer_id,
      weaponId: l.weapon_id,
      code: l.code,
      attachments: l.attachments || {},
      mods: {
        one: p.one || p.red || '',
        two: p.two || p.green || '',
        three: p.three || p.blue || ''
      },
      equipment: l.equipment || {},
      notes: l.notes,
      publishedAt: l.published_at,
      stats: l.stats || { views: 0, copies: 0 }
    };
  }

  // --- PUBLIC API ---

  async getFeaturedStreamers(): Promise<Streamer[]> {
    const { data, error } = await supabase
      .from('streamers')
      .select('*')
      .eq('is_active', true)
      .limit(4);

    if (error) throw error;
    return data.map(this.mapStreamer);
  }

  async getAllStreamers(): Promise<Streamer[]> {
    const { data, error } = await supabase
      .from('streamers')
      .select('*')
      .order('name');

    if (error) throw error;
    return data.map(this.mapStreamer);
  }

  async getStreamerBySlug(slug: string): Promise<Streamer | undefined> {
    const { data, error } = await supabase
      .from('streamers')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) return undefined;
    return this.mapStreamer(data);
  }

  async getAllWeapons(): Promise<Weapon[]> {
    const { data, error } = await supabase
      .from('weapons')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data.map(this.mapWeapon);
  }

  async getWeaponsByStreamer(streamerId: string): Promise<Weapon[]> {
    const { data, error } = await supabase
      .from('loadouts')
      .select('weapon_id, weapons(*)')
      .eq('streamer_id', streamerId);

    if (error) throw error;
    // Unique list of weapons
    const weaponsMap = new Map();
    data.forEach((l: any) => {
      if (l.weapons) weaponsMap.set(l.weapons.id, this.mapWeapon(l.weapons));
    });
    return Array.from(weaponsMap.values());
  }

  async getTrendingLoadouts(): Promise<LoadoutWithDetails[]> {
    // Trending based on views in stats jsonb
    const { data, error } = await supabase
      .from('loadouts')
      .select('*, streamers(*), weapons(*)')
      .order('stats->views', { ascending: false })
      .limit(6);

    if (error) throw error;
    return data.map((l: any) => ({
      ...this.mapLoadout(l),
      streamer: this.mapStreamer(l.streamers),
      weapon: this.mapWeapon(l.weapons)
    }));
  }

  async getLoadout(streamerSlug: string, weaponSlug: string): Promise<LoadoutWithDetails | null> {
    // First get streamer and weapon IDs
    const { data: sData } = await supabase.from('streamers').select('id, name, avatar_url, video_url, video_pos_x, video_pos_y, video_scale, slug, bio, tags, platforms, is_active').eq('slug', streamerSlug).single();
    const { data: wData } = await supabase.from('weapons').select('id, name, slug, category, image_url, videos, is_active').eq('slug', weaponSlug).single();

    if (!sData || !wData) return null;

    const { data, error } = await supabase
      .from('loadouts')
      .select('*')
      .eq('streamer_id', sData.id)
      .eq('weapon_id', wData.id)
      .single();

    if (error || !data) return null;

    // Increment views
    const newStats = { ...data.stats, views: (data.stats?.views || 0) + 1 };
    await supabase.from('loadouts').update({ stats: newStats }).eq('id', data.id);

    return {
      ...this.mapLoadout(data),
      stats: newStats,
      streamer: this.mapStreamer(sData),
      weapon: this.mapWeapon(wData)
    };
  }

  async incrementCopyCount(loadoutId: string): Promise<void> {
    const { data } = await supabase.from('loadouts').select('stats').eq('id', loadoutId).single();
    if (data) {
      const newStats = { ...data.stats, copies: (data.stats?.copies || 0) + 1 };
      await supabase.from('loadouts').update({ stats: newStats }).eq('id', loadoutId);
    }
  }

  // --- ADMIN API ---

  async login(email: string, password?: string): Promise<User> {
    if (!password) throw new Error('Senha é obrigatória');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error || !data.user) throw new Error('Credenciais Inválidas');

    this.currentUser = {
      id: data.user.id,
      name: data.user.user_metadata?.name || 'Admin',
      email: data.user.email || '',
      role: (data.user.user_metadata?.role as any) || 'ADMIN'
    };
    return this.currentUser;
  }

  async logout() {
    await supabase.auth.signOut();
    this.currentUser = null;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  async createStreamer(data: Omit<Streamer, 'id'>) {
    const { data: newS, error } = await supabase
      .from('streamers')
      .insert([{
        name: data.name,
        slug: data.slug,
        avatar_url: data.avatarUrl,
        video_url: data.videoUrl,
        video_pos_x: data.videoPosX || 50,
        video_pos_y: data.videoPosY || 50,
        video_scale: data.videoScale || 1,
        bio: data.bio,
        tags: data.tags,
        platforms: data.platforms,
        is_active: data.isActive
      }])
      .select()
      .single();

    if (error) throw error;
    return this.mapStreamer(newS);
  }

  async updateStreamer(id: string, data: Partial<Streamer>) {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.avatarUrl !== undefined) updateData.avatar_url = data.avatarUrl;
    if (data.videoUrl !== undefined) updateData.video_url = data.videoUrl;
    if (data.videoPosX !== undefined) updateData.video_pos_x = data.videoPosX;
    if (data.videoPosY !== undefined) updateData.video_pos_y = data.videoPosY;
    if (data.videoScale !== undefined) updateData.video_scale = data.videoScale;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.platforms !== undefined) updateData.platforms = data.platforms;
    if (data.isActive !== undefined) updateData.is_active = data.isActive;

    const { error } = await supabase
      .from('streamers')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
  }

  async deleteStreamer(id: string) {
    const { error } = await supabase.from('streamers').delete().eq('id', id);
    if (error) throw error;
  }

  async updateWeapon(id: string, data: Partial<Weapon>) {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.imageUrl !== undefined) updateData.image_url = data.imageUrl;
    if (data.videos !== undefined) updateData.videos = data.videos;
    if (data.isActive !== undefined) updateData.is_active = data.isActive;

    const { error } = await supabase
      .from('weapons')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
  }

  async createWeapon(data: Omit<Weapon, 'id'>) {
    const { data: newW, error } = await supabase
      .from('weapons')
      .insert([{
        name: data.name,
        slug: data.slug,
        category: data.category,
        image_url: data.imageUrl,
        videos: data.videos || [],
        is_active: data.isActive
      }])
      .select()
      .single();

    if (error) throw error;
    return this.mapWeapon(newW);
  }

  async deleteWeapon(id: string) {
    const { error } = await supabase.from('weapons').delete().eq('id', id);
    if (error) throw error;
  }

  async getAllLoadouts(): Promise<LoadoutWithDetails[]> {
    const { data, error } = await supabase
      .from('loadouts')
      .select('*, streamers(*), weapons(*)');

    if (error) throw error;
    return data.map((l: any) => ({
      ...this.mapLoadout(l),
      streamer: this.mapStreamer(l.streamers),
      weapon: this.mapWeapon(l.weapons)
    }));
  }

  async getLoadoutsByStreamer(streamerId: string): Promise<LoadoutWithDetails[]> {
    const { data, error } = await supabase
      .from('loadouts')
      .select('*, streamers(*), weapons(*)')
      .eq('streamer_id', streamerId);

    if (error) throw error;
    return data.map((l: any) => ({
      ...this.mapLoadout(l),
      streamer: this.mapStreamer(l.streamers),
      weapon: this.mapWeapon(l.weapons)
    }));
  }

  async updateLoadout(id: string, data: Partial<Loadout>) {
    const updateData: any = {};
    if (data.streamerId !== undefined) updateData.streamer_id = data.streamerId;
    if (data.weaponId !== undefined) updateData.weapon_id = data.weaponId;
    if (data.code !== undefined) updateData.code = data.code;
    if (data.attachments !== undefined) updateData.attachments = data.attachments;
    if (data.mods !== undefined) updateData.perks = data.mods;
    if (data.equipment !== undefined) updateData.equipment = data.equipment;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const { error } = await supabase
      .from('loadouts')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
  }

  async createLoadout(data: Omit<Loadout, 'id' | 'publishedAt' | 'stats'>) {
    const { data: newL, error } = await supabase
      .from('loadouts')
      .insert([{
        streamer_id: data.streamerId,
        weapon_id: data.weaponId,
        code: data.code,
        attachments: data.attachments,
        perks: data.mods,
        equipment: data.equipment,
        notes: data.notes
      }])
      .select()
      .single();

    if (error) throw error;
    return this.mapLoadout(newL);
  }

  async deleteLoadout(id: string) {
    const { error } = await supabase.from('loadouts').delete().eq('id', id);
    if (error) throw error;
  }

  async getAdminStats() {
    const { count: loadoutsCount } = await supabase.from('loadouts').select('*', { count: 'exact', head: true });
    const { count: streamersCount } = await supabase.from('streamers').select('*', { count: 'exact', head: true }).eq('is_active', true);

    const { data: loadoutsData } = await supabase.from('loadouts').select('stats, weapon_id, streamer_id, weapons(name), streamers(name)');

    const totalViews = loadoutsData?.reduce((acc: number, curr: any) => acc + (curr.stats?.views || 0), 0) || 0;

    // Aggregate views by Weapon
    const weaponViews: Record<string, number> = {};
    loadoutsData?.forEach(l => {
      const weapon = Array.isArray(l.weapons) ? l.weapons[0] : l.weapons;
      const name = weapon?.name || 'Unknown';
      weaponViews[name] = (weaponViews[name] || 0) + (l.stats?.views || 0);
    });
    const topWeapon = Object.entries(weaponViews).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    // Aggregate views by Streamer
    const streamerViews: Record<string, number> = {};
    loadoutsData?.forEach(l => {
      const streamer = Array.isArray(l.streamers) ? l.streamers[0] : l.streamers;
      const name = streamer?.name || 'Unknown';
      streamerViews[name] = (streamerViews[name] || 0) + (l.stats?.views || 0);
    });
    const topStreamer = Object.entries(streamerViews).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    return {
      totalLoadouts: loadoutsCount || 0,
      activeStreamers: streamersCount || 0,
      topWeapon,
      topStreamer,
      totalViews,
      // For the chart, show weapon popularity
      weaponViews: Object.entries(weaponViews)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 7)
        .map(([name, views]) => ({ name, views }))
    };
  }

  // --- SETTINGS (GLOBAL CONFIG) ---

  async getSetting<T>(key: string): Promise<T | null> {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', key)
      .single();

    if (error) return null;
    return data.value as T;
  }

  async updateSetting(key: string, value: any): Promise<void> {
    const { error } = await supabase
      .from('settings')
      .upsert({ key, value, updated_at: new Date().toISOString() });

    if (error) throw error;
  }
}

export const db = new SupabaseDB();