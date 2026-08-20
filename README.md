# ⚔️ REQUIEM ASSET MANAGER — Requiem of Legends MMORPG

Uma aplicação web completa, moderna e imersiva construída para o **Game Director Daniel Silva** gerenciar, organizar e acompanhar a produção de todos os assets de desenvolvimento do MMORPG Dark Fantasy **"Requiem of Legends"** (a união lendária entre as eras de **MU Online** e **With Your Destiny / WYD**).

---

## 🎨 Identidade Visual Dark Fantasy Medieval

- **Tipografia Épica**: Google Fonts *Cinzel* para títulos e cabeçalhos medievais, *Inter* para legibilidade do corpo, e *Roboto Mono* para dados numéricos e caminhos técnicos.
- **Paleta de Cores Clássica**:
  - Fundo Profundo: `#0a0a0a` / Painéis `#141414`
  - Dourado Lendário: `#c9a961` e `#f0d98c`
  - Borda Entalhada e Molduras Duplas: `#3d2f1f`
  - Sucesso / Concluído: `#27ae60`
  - Em Progresso: `#f39c12`
  - Crítico / Perigo: `#c0392b`
- **Efeitos e Sons Web Audio**:
  - Som cristalino inesquecível de drop/uso da **Jewel of Bless**
  - Fanfarra triunfante de **Level Up** e conquista
  - Cliques mecânicos e feedbacks táteis na interface
  - Partículas de celebração com Confetti dourado

---

## 📦 Estrutura de Módulos & Telas

### 1. 🏰 Dashboard do Game Director (`/`)
- Header nobre com branding de *Requiem of Legends*, nome de Daniel Silva, data e estatísticas em tempo real.
- **4 Cards de Estatísticas com Glow**:
  - 📂 **Total de Assets** (104 assets iniciais catalogados)
  - ✅ **Concluídos** (com percentual e indicador verde)
  - 🔄 **Em Progresso** (com spinner dourado)
  - ⏳ **Pendentes** (com monitoramento de prioridades críticas)
- **Barra de Progresso Principal Dourada**:
  - Dinâmica com gradiente motivacional e animação suave
  - Marcos visuais: 0% Início ➔ 30% MVP ➔ 70% Alpha Fechado ➔ 100% Lançamento
- **Progresso Visual por Categoria**: Barras de progresso para cada um dos 8 módulos.
- **Linha do Tempo de Atividades Recentes**: Histórico dos últimos 5 assets modificados.
- **Widget de Sabedoria & Lore**: Citações dark fantasy rotativas do universo de Requiem.
- **Oráculo de Criação ("O Que Fazer Agora?")**: Sorteador aleatório ponderado para orientar as próximas tarefas prioritárias.

### 2. 🗃️ Gerenciador de Assets (`/assets`)
- **Barra de Filtros Fixa (Sticky)**:
  - Busca instantânea por nome, tag, subcategoria ou caminho original
  - Filtros por Status (⏳ Pendente | 🔄 Em Progresso | ✅ Concluído)
  - Filtros por Prioridade (🔥 Crítica | ⬆️ Alta | ➡️ Média | ⬇️ Baixa)
  - Filtros por Origem (MU Online, WYD, Custom Requiem, IA, Marketplace, Free)
  - Ordenação dinâmica (Data, Nome, Prioridade, Status, Modificação)
- **3 Modos de Visualização Alternáveis**:
  - 🖼️ **Modo Grade (Cards)**: Molduras douradas, pré-visualização gráfica ou upload de imagem, badges e menu de 3 pontos.
  - 📋 **Modo Tabela / Lista**: Visão densa com zebra rows, seleção múltipla e ações diretas.
  - 📌 **Modo Kanban Board**: Colunas para Pendente, Em Progresso e Concluído com movimentação instantânea entre colunas.
- **Barra de Ações em Massa (Bulk Actions)**:
  - Concluir selecionados, mover status, alterar prioridades ou exportar em lote.

### 3. 🛡️ Categorias do MMORPG (`/categories`)
8 módulos com contadores, badges de subgrupos e atalhos rápidos:
1. 🎨 **ITEM** (Armas, armaduras, Joias Bless/Soul/Chaos, poções, pergaminhos)
2. 👹 **MONSTER** (Budge Dragon, Spider, Hound, Bull Fighter, Skeleton Warrior, Lich, Cursed Wizard)
3. 🗺️ **MAP** (Requiem Hub, Lorencia, Noria, Devias, Armia WYD, Azran WYD)
4. 🎬 **ANIMATION** (Dano flutuante, Level up, Twisting Slash, Hellfire Nova, Screen shake)
5. 🔊 **SOUND** (Chime da Bless, swing de espada, disparo de flecha, temas de Lorencia e Armia)
6. 🎨 **UI** (Orbes de HP/MP, grade de 64 slots de inventário, moldura de mini-mapa, diálogos)
7. 🧙 **CHARACTER** (Dark Knight, Dark Wizard, Fairy Elf, TransKnight, Foema)
8. ✨ **EFFECT** (Aura divina Bless, fogo da Chaos Machine, explosão glacial, relâmpago)

### 4. 📊 Progresso, Velocidade & Analytics (`/progress`)
- Gráficos interativos com **Recharts**:
  - Gráfico Donut de distribuição por Status
  - Gráfico de Origem dos Assets (MU vs WYD vs Original vs IA)
  - Gráfico de Barras com volume por categoria
- Métricas de velocidade: Média de entrega diária e previsão calculada para fechamento do MVP.
- Leaderboard de módulos com rankings e selos de conquista.

### 5. 📚 Biblioteca de Ferramentas & Referências (`/references`)
- Links e documentação categorizados:
  - 🛠️ **Extração & 3D**: MU Model Viewer, WYD Studio, Blender 3D, OZJ Converter
  - 🎁 **Recursos Grátis**: Game-Icons.net, Kenney.nl, OpenGameArt, FreeSound, LottieFiles, Mixamo
  - 💎 **Marketplaces**: Synty Studios, Unity Asset Store, Sketchfab, Meshy AI
  - 🤖 **Ferramentas de IA**: Midjourney, DALL-E 3, Stable Diffusion, Leonardo.ai
- Formulário para registrar novos links e ferramentas personalizadas.

### 6. ⚙️ Configurações & Gestão de Dados (`/settings`)
- Metadados do projeto (*Requiem of Legends*, Game Director Daniel Silva, datas, links GitHub e Discord).
- Preferências visuais e toggles de áudio Web Audio e partículas.
- **Exportação JSON**: Backup completo local de todos os assets.
- **Exportação Excel (.xlsx)**: Planilha categorizada com múltiplas abas.
- **Importação JSON**: Restauração instantânea de backups.
- **Restauração de Dados**: Recarregar os 104 assets originais a qualquer momento.

---

## 💻 Como Rodar o Projeto

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Gerar build de produção
npm run build
```

---

*Requiem of Legends — Onde duas lendas se tornam uma.*  
**Game Director**: Daniel Silva
