# 📊 Dashboard de Gestão Financeira

Um **dashboard financeiro pessoal** que roda 100% no navegador — sem backend, sem banco de dados externo. Todos os dados são armazenados via `localStorage`. Design premium com tema claro/escuro nativo.

## ✨ Funcionalidades

### 📈 Dashboard Principal
- Cards-resumo animados com count-up: Receitas, Despesas, Investimentos, Empréstimos e Saldo
- Indicadores de tendência vs. mês anterior em todos os cards (↑ / ↓ com cores semânticas)
- Atalhos rápidos para registrar qualquer tipo de transação com 1 clique
- Gráfico diário de despesas vs. receitas (mensal ou anual)
- Gráfico de distribuição por categoria
- Metas do Mês: exibe os orçamentos ativos com barra de progresso colorida
- **Widget de Metas de Economia**: acompanhe o progresso diretamente na tela inicial com atalhos (+ e -) de atualização
- **Widgets Draggáveis**: reordene os painéis (Metas e Transações) com suporte a *drag-and-drop* e persistência da ordem
- Saudação dinâmica por horário ("Bom dia / Boa tarde / Boa noite")
- Alternância de visão: **Mês** ou **Ano** com navegação por período

### 💸 Sistema de Transações (CRUD)
- Registre **Receitas**, **Investimentos**, **Despesas** e **Empréstimos**
- Modal e página de formulário completos com 4 tipos de transação
- Categorias personalizadas criadas em tempo real (por tipo)
- Empréstimos com geração automática de parcelas nos meses seguintes
- Busca instantânea por descrição e filtro por tipo
- Edição e exclusão com modal de confirmação customizado (sem `confirm()` nativo)

### 🎯 Orçamentos (Budgets)
- Configure tetos mensais de gasto por categoria de despesa
- **Flag "Contar como Despesa"**: toggle por meta para incluir (ou não) aquela categoria no total — ideal para categorias que já aparecem em outra fatura
- Barra de progresso que muda de cor: `verde → amarelo → vermelho`
- Destaque visual para categorias excluídas do total (borda tracejada)

### 🏦 Metas de Economia
- Crie metas de poupança com nome, valor alvo, valor atual e prazo
- Acompanhe o progresso com barra visual e percentual
- Adicione ou retire valores a qualquer momento via um **modal customizado** (eliminando caixas de diálogo nativas do navegador)
- Indicador de prazo: verde (em dia) → amarelo (≤ 30 dias) → vermelho (vencido)

### 📊 Relatórios Completos
Seis abas dedicadas com gráficos Chart.js interativos:

| Aba | Conteúdo |
|-----|----------|
| **Visão Geral** | Receitas × Despesas (12 meses) + distribuição por tipo |
| **Evolução** | Saldo mensal e saldo acumulado (patrimônio) |
| **Categorias** | Ranking de gastos + tabela detalhada por categoria |
| **Maiores Gastos** | Top 10 despesas do período com barra visual |
| **Investimentos** | Alocação do portfólio (donut) + histórico mensal |
| **Receitas** | Total geral, maior receita, ticket médio, Nº de entradas + histórico 12 meses + tabela por categoria |

KPIs de relatório: Média Diária de Gastos, Maior Despesa, Top Categoria, Taxa de Poupança, Total Investido, Total de Transações.

### ⚙️ Backup Inteligente
- **Exportar JSON** — salva transações, categorias personalizadas, metas de orçamento e metas de economia com versionamento do schema
- **Importar JSON** — restaura o sistema completo, com validação de formato e campos obrigatórios
- **Exportar CSV** — planilha estruturada para Excel/Google Sheets, com data no nome do arquivo
- **Limpar tudo** — reset completo com confirmação via modal

## 🎨 Design & UX

| Área | Implementação |
|------|--------------|
| **Tipografia** | DM Sans (body) + Outfit (headings e valores) |
| **Acessibilidade** | `:focus-visible` rings, `prefers-reduced-motion`, contraste AAA |
| **Touch targets** | Mínimo 44px em todos os botões e selects |
| **Modais** | Modais assíncronos estilizados sem bloqueio da UI, substituindo todos os `prompt()` e `confirm()` nativos |
| **Dashboard** | Scroll dinâmico em transações recentes e **HTML5 Drag-and-Drop API** responsiva com preview fantasma |
| **Animações** | Entrada escalonada com spring-physics (`cubic-bezier(0.16, 1, 0.3, 1)`) |
| **Count-up** | Animação ease-out cúbica nos valores dos cards ao mudar de período |
| **Glassmorphism** | Header com `backdrop-filter: blur(12px) saturate(180%)` |
| **Números** | `font-variant-numeric: tabular-nums` em todos os valores financeiros |
| **Tema Escuro** | Tokens HSL semânticos para ambos os temas, sem flash |

## 🛡️ Qualidade de Código

- **Sanitização HTML**: função `escapeHTML()` aplicada em todos os dados do usuário renderizados via `innerHTML`
- **Validação de datas**: transações com datas inválidas são ignoradas silenciosamente nos filtros
- **Versionamento de backup**: schema `v1` identificado no JSON exportado para facilitar futuras migrações
- **Sem memory leaks**: todos os gráficos Chart.js são destruídos antes de recriados
- **Categorias personalizadas**: excluídas com migração automática das transações para "Outros"

## 🛠️ Tecnologias

- **HTML5** + **CSS3** (variáveis nativas, grid, flexbox, `backdrop-filter`)
- **JavaScript ES6** — manipulação de DOM e `localStorage` (sem frameworks)
- **Chart.js 4.4** — gráficos interativos via CDN
- **Remixicon** — ícones SVG padronizados via CDN

## 🚀 Como Rodar

Não é necessário servidor ou instalação:

1. Clone: `git clone <seu-repositorio>`
2. Abra com **Live Server** (VS Code) ou:
   ```bash
   npx serve -l 3000
   ```
3. Acesse `http://localhost:3000`

> Também funciona como arquivo local (`file://`) — basta abrir o `index.html` diretamente no navegador.

## 📱 Responsivo

Menu colapsável em mobile (ícone hamburger), cards em grid responsivo, modais adaptados para telas pequenas e barra de atalhos com scroll horizontal.
