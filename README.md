# 📊 Dashboard de Gestão Financeira

Um **dashboard financeiro pessoal** que roda 100% no navegador — sem backend, sem banco de dados externo. Todos os dados são armazenados via `localStorage`. Design premium com tema claro/escuro nativo.

## ✨ Funcionalidades

### 📈 Dashboard Analítico
- Cards-resumo com animações escalonadas (Receitas, Despesas, Investimentos, Empréstimos, Saldo)
- Atalhos rápidos para registrar qualquer tipo de transação com 1 clique
- Metas do Mês: exibe os orçamentos ativos com barra de progresso colorida
- Saudação dinâmica por horário ("Bom dia / Boa tarde / Boa noite")

### 💸 Sistema de Transações (CRUD)
- Registre Receitas, Investimentos, Despesas e Empréstimos
- Categorias personalizadas criadas em tempo real
- Empréstimos com geração automática de parcelas em meses futuros
- Busca e filtro instantâneo por tipo e descrição
- Edição e exclusão com confirmação

### 🎯 Orçamentos e Metas (Budgets)
- Configure tetos mensais de gasto por categoria
- **Flag "Contar como Despesa"**: toggle por meta para controlar se aquela categoria soma (ou não) ao total de despesas — ideal para categorias que já aparecem em outra fatura
- Barra de progresso que muda de cor (verde → amarelo → vermelho) conforme o limite se aproxima
- Destaque visual para metas excluídas do total (`border-style: dashed`)

### 📊 Relatórios Completos
Abas dedicadas com gráficos Chart.js:
- **Visão Geral:** Receitas × Despesas, distribuição por tipo e ranking
- **Tendências:** Saldo mensal e saldo acumulado ao longo do tempo
- **Categorias:** Tabela e gráfico horizontal de onde o dinheiro vai
- **Top Despesas:** As transações que mais pesaram no período selecionado
- **Investimentos:** Divisão do portfólio e histórico

### ⚙️ Backup Inteligente
- **Exportar JSON** — salva transações, categorias personalizadas e todas as metas/flags
- **Importar JSON** — restaura o sistema completo, inclusive as novas flags de orçamento
- **Exportar CSV** — planilha estruturada para Excel/Google Sheets
- **Limpar tudo** — reset completo com confirmação

## 🎨 Design & UX

Melhorias aplicadas com base nas skills `ui-ux-pro-max` e `frontend-design`:

| Área | Implementação |
|------|--------------|
| **Tipografia** | DM Sans (body) + Outfit (headings e valores) |
| **Acessibilidade** | `:focus-visible` rings, `prefers-reduced-motion`, contraste AAA |
| **Touch targets** | Mínimo 44px em todos os botões e selects |
| **Modais e Formulários** | Layout em grid 1fr 1fr, hints contextuais (ex: empréstimos) e larguras responsivas aprimoradas |
| **Dashboard** | Box de "Metas do Mês" compacto com max 5 itens; Scroll dinâmico (`72vh`) nas transações recentes |
| **Animações** | Entrada escalonada com spring-physics (`cubic-bezier(0.16, 1, 0.3, 1)`) |
| **Glassmorphism** | Header com `backdrop-filter: blur(12px) saturate(180%)` |
| **Números** | `font-variant-numeric: tabular-nums` em todos os valores financeiros |
| **Tema Escuro** | Tokens HSL semânticos para ambos os temas |

## 🛠️ Tecnologias

- **HTML5** + **CSS3** (variáveis nativas, grid, flexbox, `backdrop-filter`)
- **JavaScript ES6** — manipulação de DOM e `localStorage`
- **Chart.js 4.4** — gráficos interativos via CDN
- **Remixicon** — ícones SVG padronizados

## 🚀 Como Rodar

Não é necessário servidor ou instalação:

1. Clone: `git clone <seu-repositorio>`
2. Abra com **Live Server** (VS Code) ou:
   ```bash
   npx serve -l 3000
   ```
3. Acesse `http://localhost:3000`

## 📱 Responsivo

Menu colapsável em mobile (hamburger), cards responsivos em grid, modais adaptados para telas pequenas.
