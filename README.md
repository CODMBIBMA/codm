<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# CODM Loadouts Hub

> O portal definitivo para loadouts de Call of Duty: Mobile dos seus streamers favoritos. Copie builds pro, veja estatísticas e domine o lobby.

## 🎮 Sobre o Projeto

**CODM Loadouts Hub** é uma plataforma web moderna para compartilhar e descobrir configurações de armas (loadouts) de Call of Duty: Mobile. Streamers podem compartilhar suas builds e jogadores podem copiar e usar no jogo.

### ✨ Features Principais

- 🎯 **Catálogo de Loadouts**: Navegue por builds de streamers profissionais
- 🔫 **Visualização 3D**: Veja as armas em vídeo com todos os acessórios
- 📊 **Estatísticas**: Acompanhe views e copies de cada loadout
- 👤 **Perfis de Streamers**: Conheça os criadores e suas redes sociais
- 🔍 **Busca e Filtros**: Encontre o loadout perfeito por arma, categoria ou streamer
- ⚡ **Copiar Código**: Um clique para copiar o código do loadout para o jogo
- 🛡️ **Painel Admin**: Gerenciamento completo de streamers, armas e loadouts

## 🚀 Quick Start

### Pré-requisitos

- Node.js (v18+)
- Conta no Supabase

### Instalação

1. **Clone o repositório**
   ```bash
   git clone <repo-url>
   cd CODM
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   
   Crie um arquivo `.env.local` baseado no `.env.example`:
   ```env
   VITE_SUPABASE_URL=sua_url_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima
   ```

4. **Execute o projeto**
   ```bash
   npm run dev
   ```

5. **Acesse no navegador**
   - Frontend: http://localhost:3001/
   - Admin: http://localhost:3001/#/admin

## 📚 Documentação

Documentação completa disponível na pasta [`docs/`](./docs/):

- **[Visão Geral](./docs/project_overview.md)** - Arquitetura, stack, modelo de dados
- **[Verificação](./docs/walkthrough.md)** - Status e verificação do projeto
- **[Análise](./docs/analysis.md)** - Pontos fortes e fracos detalhados
- **[Roadmap](./docs/roadmap.md)** - Plano de desenvolvimento futuro

## 🛠️ Stack Tecnológica

- **Frontend**: React 18 + TypeScript + Vite
- **Estilização**: TailwindCSS
- **Animações**: Framer Motion
- **Backend**: Supabase (Auth + Database + Storage)
- **Roteamento**: React Router DOM

## 📦 Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build de produção
```

## 🎨 Design

O projeto utiliza um design inspirado no visual tático/militar do Call of Duty: Mobile, com:

- Paleta de cores escuras (#0b0f15, #151b24)
- Amarelo característico do CODM (#fbbf24)
- Fontes customizadas (Rajdhani + Teko)
- Efeitos skew e gradientes
- Sistema de raridade de cores (Mythic, Legendary, Epic, Rare)

## 🔐 Autenticação

O sistema usa Supabase Auth para gerenciar usuários e permissões:

- **Área Pública**: Acesso livre para visualizar loadouts
- **Área Admin**: Requer autenticação para gerenciar conteúdo

## 🗄️ Banco de Dados

Schema Supabase com 4 tabelas principais:

- `streamers` - Informações dos streamers
- `weapons` - Armas do CODM
- `loadouts` - Configurações de armas
- `app_users` - Usuários do sistema

Ver schema completo em [`supabase_schema.sql`](./supabase_schema.sql)

## 🤝 Contribuindo

1. Leia a [documentação completa](./docs/)
2. Escolha uma tarefa do [roadmap](./docs/roadmap.md)
3. Faça suas alterações
4. Teste localmente
5. Envie um Pull Request

## 📝 Licença

Este projeto foi criado com AI Studio.

View your app in AI Studio: https://ai.studio/apps/drive/1cuhsXuZlnZ-VYdlTRN-U-jZc6-xCFmGD

---

**Desenvolvido com ❤️ para a comunidade CODM**
