import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { WeaponVideo } from '../types';

interface WeaponVisualProps {
  imageUrl: string;
  name: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  videos?: WeaponVideo[];
}

const RARITY_COLORS = {
  common: 'from-gray-500 to-slate-600',
  rare: 'from-blue-500 to-cyan-400',
  epic: 'from-purple-600 to-fuchsia-400',
  legendary: 'from-yellow-500 to-orange-400',
  mythic: 'from-red-600 to-rose-400',
};

const WeaponVisual: React.FC<WeaponVisualProps> = ({ imageUrl, name, rarity = 'epic', videos = [] }) => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    // 1. Filtrar apenas vídeos ativos
    const availableVideos = videos.filter(v => v.isActive && v.url);
    
    // 2. Se houver vídeos, selecionar UM aleatoriamente
    if (availableVideos.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableVideos.length);
        setActiveVideo(availableVideos[randomIndex].url);
    } else {
        setActiveVideo(null);
    }
  }, [videos]); // Executa toda vez que a lista de vídeos mudar (ou montar)

  return (
    <div className="relative w-full h-64 md:h-80 flex items-center justify-center overflow-hidden bg-gamer-900/50 rounded-xl border border-white/5 shadow-2xl group">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20" 
           style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      {/* Glow Effect behind weapon */}
      <div className={`absolute w-48 h-48 rounded-full blur-[80px] bg-gradient-to-br ${RARITY_COLORS[rarity]} opacity-20 group-hover:opacity-40 transition-opacity duration-700`}></div>

      {/* Render Selected Random Video OR Fallback Image */}
      {activeVideo ? (
        <div className="relative z-10 w-full h-full">
            <video 
                src={activeVideo}
                autoPlay 
                muted 
                loop 
                playsInline
                className="w-full h-full object-cover opacity-90 mix-blend-screen"
            />
            {/* Overlay sutil para integrar o vídeo ao tema escuro */}
            <div className="absolute inset-0 bg-gradient-to-t from-codm-dark/80 via-transparent to-codm-dark/20 pointer-events-none"></div>
        </div>
      ) : (
        <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="relative z-10 w-3/4 max-w-lg"
        >
            <img 
                src={imageUrl} 
                alt={name} 
                className="w-full h-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
            />
            {/* Holographic Scan Line only over image */}
            <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-neon-blue to-transparent shadow-[0_0_15px_rgba(0,243,255,0.8)] animate-scan opacity-50"></div>
            </div>
        </motion.div>
      )}

      {/* Weapon Name Watermark */}
      <div className="absolute bottom-4 left-6 z-20">
        <h3 className="text-6xl font-display font-bold text-white/5 uppercase tracking-widest pointer-events-none select-none">
            {name}
        </h3>
      </div>
    </div>
  );
};

export default WeaponVisual;