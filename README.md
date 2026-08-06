# 💼 FluxoPro - Sistema Completo de Controle de Caixa & Gestão Financeira

Um **web app moderno, profissional, intuitivo e completo** para gestão e controle de fluxo de caixa diário, mensal e anual, projetado sob medida para **pequenos negócios, lojas, comércios e prestadores de serviços**.

Desenvolvido com **React 19 + TypeScript + Vite + Tailwind CSS v4 + Recharts + Lucide Icons + jsPDF + XLSX**.

---

## 🚀 Principais Módulos & Funcionalidades

### 1. 📊 Dashboard Principal (Visão Executiva)
- **KPIs em Tempo Real**:
  - Saldo Atual de Caixa (com indicador de saúde financeira)
  - Total de Entradas (Receitas do mês)
  - Total de Saídas (Despesas do mês)
  - Lucro Líquido / Resultado Operacional apurado
  - Total de Contas a Pagar em aberto
  - Total de Contas a Receber previstas
- **Alertas Financeiros Ativos**:
  - Alerta vermelho para contas em atraso (inadimplência)
  - Alerta amarelo para contas com vencimento hoje
  - Alerta de saldo abaixo do limite mínimo orçado
- **Gráficos Interativos**:
  - Evolução do Saldo Acumulado & Linha do Tempo (7 dias, 30 dias, 6 meses, 12 meses)
  - Distribuição de Despesas & Receitas por Categoria (Gráfico Donut)
  - Comparativo Mensal de Entradas vs Saídas com barras agrupadas
  - Distribuição por Forma de Pagamento (PIX, Cartão de Crédito/Débito, Boleto, TED, Dinheiro)
- **Últimas Movimentações** e **Próximos Vencimentos** com quitação em 1 clique.

---

### 2. 🟢 Controle de Entradas (Receitas)
- Cadastro detalhado de recebimentos:
  - Descrição, valor formatado (R$), data da operação
  - Categoria da receita, forma de pagamento
  - Cliente / Sacado, observações
  - Recorrência (Única, Semanal, Mensal, Anual)
  - Anexo / Comprovante digital com visualizador integrado
  - Status: **Recebido** ou **Pendente**
- Filtros rápidos por texto, categoria, meio de pagamento, status e intervalo de datas
- Ações: Quitar/Alternar Status, Duplicar lançamento, Editar, Excluir e Visualizar Comprovante.

---

### 3. 🔴 Controle de Saídas (Despesas)
- Cadastro completo de desembolsos operacionais:
  - Descrição, valor, data do pagamento
  - Categoria de centro de custo, fornecedor / beneficiário
  - Forma de pagamento, notas e anexo de nota fiscal / recibo
  - Status: **Pago** ou **Pendente**
- Totalizadores automáticos de Despesas Pagas vs Despesas Pendentes
- Alertas de maior centro de custo do período.

---

### 4. 📈 Fluxo de Caixa Consolidado & DRE
- **Fórmula Visual de Caixa**:
  $$\text{Saldo Inicial} + \text{Entradas} - \text{Saídas} = \text{Saldo Final}$$
- Navegação fluida por mês e ano
- Extrato diário detalhado com número de operações, saldo do dia e saldo acumulado
- Exportação direta para **PDF**, **Planilha Excel (.xlsx)** e **Impressão A4**.

---

### 5. 📑 Contas a Pagar
- Controle rigoroso de obrigações e boletos:
  - Abas: *Todas*, *Pendentes*, *Vencendo Hoje*, *Vencidas (Atraso)* e *Pagas*
  - Código de barras e linha digitável com botão de **Cópia em 1 Clique**
  - **Quitação Integrada no Caixa**: Baixa total ou parcial que gera automaticamente o lançamento de saída correspondente no fluxo financeiro
  - Alerta customizável de antecedência (1, 3, 5 ou 7 dias antes).

---

### 6. 💵 Contas a Receber
- Gestão de contratos, cobranças e faturamento futuro:
  - Abas de status: *Todas*, *Pendentes*, *Vencendo Hoje*, *Em Atraso* e *Recebidas*
  - **Confirmação de Recebimento**: Baixa no ato alimentando o caixa em tempo real
  - Controle de inadimplência e aging list.

---

### 7. 🏷️ Categorias Financeiras & Centros de Custo
- Gerenciamento completo de categorias de receitas e despesas:
  - Nome, cor personalizada e seletor com mais de **25 ícones profissionais**
  - **Teto Orçamentário (Budget)**: Barra de progresso visual que monitora os gastos contra a meta mensal, alertando se ultrapassar 80% ou estourar o limite.

---

### 8. 📜 Histórico Unificado & Extrato Geral
- Visão consolidada de todas as transações (Entradas e Saídas)
- Filtros multicritério combinados (Tipo, Busca, Categoria, Meio de Pagamento, Status, Período)
- Ordenação dinâmica por Data, Valor e Descrição
- Paginação configurável (10, 15, 25 ou 50 itens por página)
- Exportação em lote para **CSV**, **Excel** e **PDF**.

---

### 9. 📊 Relatórios & DRE Simplificado
- **Demonstração do Resultado do Exercício (DRE)**:
  - Receita Bruta
  - (-) Custos de Mercadorias e Fornecedores
  - (=) Lucro Bruto
  - (-) Despesas Operacionais detalhadas por categoria
  - (=) Resultado Líquido do Período
  - Margem Operacional Líquida (%)
- Relatório de Despesas por Categoria com % de participação
- Relatório de Receitas por Categoria e Top Clientes
- Filtros por: *Este Mês*, *Mês Anterior*, *Trimestre* e *Ano Completo*
- Exportação em **PDF formatado com cabeçalho corporativo, CNPJ e data de emissão**, **Excel (.xlsx)** e **Modo Impressão**.

---

### 10. ⚙️ Configurações, Backup & Segurança
- Dados da empresa (Razão Social, Nome Fantasia, CNPJ, E-mail, Telefone, Endereço)
- Definição do Saldo Inicial de Abertura e Limite de Saldo Baixo
- **Exportação de Backup Completo (JSON)** com 1 clique
- **Restauração de Backup (JSON)** com validação de integridade
- **Reset de Fábrica** para dados de demonstração.

---

### 11. 👥 Controle de Usuários & Níveis de Acesso
- Simulador rápido de perfis no cabeçalho:
  - **Administrador**: Acesso total a todas as operações, cadastros, relatórios e configurações
  - **Financeiro**: Lançamento de movimentações, quitação de contas e relatórios
  - **Visualizador**: Consulta de painéis, extratos e relatórios (modo somente leitura)
- Gestão de membros da equipe (nome, e-mail, departamento, telefone e papel)
- Matriz comparativa visual de permissões.

---

### 12. 👤 Perfil do Usuário & Tema
- Painel pessoal do colaborador conectado
- Alternância instantânea entre **Modo Escuro (Dark Mode)** e **Modo Claro (Light Mode)**
- Simulação de alteração de senha segura.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 19, TypeScript
- **Estilização**: Tailwind CSS v4 com paleta fintech personalizada
- **Gráficos**: Recharts (AreaChart, PieChart, BarChart)
- **Ícones**: Lucide React
- **Exportação de Relatórios**:
  - `jspdf` & `jspdf-autotable` para PDF profissional
  - `xlsx` para planilhas Excel (.xlsx)
  - Geração nativa de arquivos CSV UTF-8
- **Persistência**: `LocalStorage` reativo com sincronização automática e geração de dados iniciais de demonstração (seed data).

---

## 💻 Como Rodar o Projeto Localmente

```bash
# 1. Clone o repositório
git clone https://github.com/BanditGrey/Controle-de-caixa.git
cd Controle-de-caixa

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev

# 4. Acesse no navegador
http://localhost:5173
```

---

## 🗄️ Sugestão de Modelagem de Banco de Dados (Para Expansão Backend)

Para conectar o sistema a um backend relacional (ex: PostgreSQL / Supabase / MySQL) ou NoSQL (Firebase), recomenda-se a seguinte estrutura:

```sql
-- Tabela de Usuários e Perfis
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'financeiro', 'visualizador')),
  department VARCHAR(100),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Categorias
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('receita', 'despesa')),
  color VARCHAR(20) NOT NULL,
  icon VARCHAR(50) NOT NULL,
  budget_limit NUMERIC(15, 2),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Movimentações de Caixa
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20) NOT NULL CHECK (type IN ('receita', 'despesa')),
  description VARCHAR(255) NOT NULL,
  amount NUMERIC(15, 2) NOT NULL,
  date DATE NOT NULL,
  category_id UUID REFERENCES categories(id),
  payment_method VARCHAR(50) NOT NULL,
  entity_name VARCHAR(255),
  status VARCHAR(20) NOT NULL CHECK (status IN ('recebido', 'pago', 'pendente')),
  recurrence VARCHAR(50) DEFAULT 'única',
  notes TEXT,
  attachment_url TEXT,
  reference_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Contas a Pagar
CREATE TABLE accounts_payable (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description VARCHAR(255) NOT NULL,
  supplier VARCHAR(255) NOT NULL,
  category_id UUID REFERENCES categories(id),
  amount NUMERIC(15, 2) NOT NULL,
  paid_amount NUMERIC(15, 2) DEFAULT 0,
  due_date DATE NOT NULL,
  payment_date DATE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pendente', 'pago', 'vencido', 'parcial')),
  payment_method VARCHAR(50),
  barcode TEXT,
  alert_days INT DEFAULT 3,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Contas a Receber
CREATE TABLE accounts_receivable (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description VARCHAR(255) NOT NULL,
  client VARCHAR(255) NOT NULL,
  category_id UUID REFERENCES categories(id),
  amount NUMERIC(15, 2) NOT NULL,
  received_amount NUMERIC(15, 2) DEFAULT 0,
  due_date DATE NOT NULL,
  received_date DATE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pendente', 'recebido', 'vencido', 'parcial')),
  payment_method VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🎨 Atalhos do Teclado
- `Ctrl + N` ou `Cmd + N`: Abre o menu flutuante de **Ações Rápidas** (+ Entrada, + Saída, + Conta a Pagar, + Conta a Receber, + Relatórios).
- `Esc`: Fecha qualquer modal ou visualizador ativo.
