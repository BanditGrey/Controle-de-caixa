# 🚀 Portal de Demonstrativos — Daniel Silva

Este repositório reúne **dois sistemas demonstrativos completos, modernos e funcionais**, permitindo alternar livremente entre eles através do **Portal de Demonstrativos** ou da barra superior de navegação.

---

## 🧭 Os 2 Sistemas Disponíveis

### 1. 💼 **Controle de Caixa (FluxoPro)** — Gestão Financeira Empresarial
Desenvolvido para pequenos negócios, comércios e prestadores de serviços:
- **Fluxo de Caixa**: Visão diária, mensal e anual com conciliação.
- **Entradas e Saídas**: Cadastro de receitas e despesas com anexos, recorrência e comprovantes.
- **Contas a Pagar & Receber**: Gestão de vencimentos, liquidação parcial/total, juros, multas e inadimplência.
- **Relatórios Gerenciais**: Exportação profissional instantânea para **PDF** e planilhas **Excel (.xlsx)**.
- **Gráficos Interativos**: Evolução de saldo acumulado, métodos de pagamento (PIX, Cartão, Boleto) e despesas por categoria.
- **Controle de Usuários & Perfis**: Permissões (Admin, Gerente, Operador) e logs de auditoria.

### 2. ⚔️ **Requiem Asset Manager** — MMORPG Dark Fantasy
Desenvolvido para o Game Director **Daniel Silva** gerenciar os assets do MMORPG **"Requiem of Legends"** (a união lendária entre **MU Online** e **With Your Destiny / WYD**):
- **104 Assets Iniciais Estruturados**:
  - 🎨 **30 Itens**: Poções, Joias (*Bless*, *Soul*, *Chaos*), espadas, cajados, arcos, sets de armadura.
  - 👹 **8 Monstros**: Budge Dragon, Spider, Hound, Bull Fighter, Skeleton, Lich, Cursed Wizard.
  - 🗺️ **6 Mapas**: Requiem Hub, Lorencia, Noria, Devias, Armia WYD, Azran WYD.
  - 🎬 **25 Animações**: Danos flutuantes, Level Up, Twisting Slash, Hellfire Nova, Screen shake.
  - 🔊 **15 Sons**: Chime lendário da Jewel of Bless, golpes, disparos, trilhas de Lorencia e Armia.
  - 🎨 **10 UI**: Orbes de HP/MP, grade 8x8 de inventário, frame de minimapa, diálogos.
  - 🧙 **5 Personagens**: Dark Knight, Dark Wizard, Fairy Elf, TransKnight WYD, Foema WYD.
  - ✨ **5 Efeitos VFX**: Auras divinas, fogo da Chaos Machine, explosão glacial, raios.
- **3 Modos de Exibição**: Grade visual ornamentada, Tabela limpa e Quadro **Kanban Board** com movimentação de status.
- **Efeitos Sonoros Web Audio**: Áudio procedural clássico (som da Bless, fanfarra de Level Up, cliques táteis).
- **Métricas & Previsão**: Estimativa em dias para conclusão do MVP e velocidade diária de entrega.
- **Biblioteca de Recursos**: Extratores de modelos `.bmd` e `.wyt`, repositórios CC0 e IAs.

---

## 🔀 Como Alternar Entre os Demonstrativos

1. Ao abrir o aplicativo pela primeira vez, o **Portal de Escolha** é apresentado com os cards interativos de cada sistema.
2. Dentro de qualquer um dos sistemas, uma **barra superior fixa** permite alternar instantaneamente para o outro demonstrativo ou voltar ao Portal.
3. Os dados de ambos os sistemas são persistidos de forma independente no `localStorage` do seu navegador.

---

## 💻 Como Rodar o Projeto

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev

# 3. Compilar versão de produção
npm run build
```

---

**Autor / Direção**: Daniel Silva  
**Tecnologias**: React 19 + TypeScript + Vite + Tailwind CSS + Recharts + jsPDF + XLSX + Canvas Confetti + Web Audio API
