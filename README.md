# 📊 Dashboard de Gestão Financeira

![Dashboard Preview](https://via.placeholder.com/800x400.png?text=Dashboard+de+Gest%C3%A3o+Financeira+Preview)

Este é um projeto de **Gestão Financeira Pessoal** que funciona inteiramente no navegador. Desenvolvido com HTML, CSS puro e JavaScript moderno, não requer banco de dados externo ou backend, utilizando o `localStorage` do navegador para prover uma experiência rápida, segura e privada do usuário. O layout apresenta um design moderno e premium com suporte nativo a temas (Claro e Escuro).

## ✨ Principais Funcionalidades

### 📈 Dashboard Analítico
- Visão geral rápida com saldos combinados (Receitas, Despesas, Investimentos e Empréstimos).
- Atalhos Rápidos para criação fluida de transações com 1 clique.
- Acompanhamento "Quick Budgets" (orçamentos ativos) para não perder o controle.
- Resumo dinâmico Saudação ("Bom dia/Boa tarde/Boa noite").

### 💸 Sistema de Transações (CRUD)
- Registre Receitas, Investimentos, Despesas e Empréstimos.
- Criação de Categorias Personalizadas em tempo real.
- Empréstimos possuem controle unificado (a entrada inicial funciona como receita, enquanto as parcelas em meses futuros contabilizam como despesa separadamente).
- Opção de busca/filtro instantâneo por nome nas transações.

### 🎯 Orçamentos e Metas Mensais
- Aba dedicada à configuração de tetos de gastos (`Budgets`).
- Configure um limite monetário para cada categoria de despesa (ex: Alimentação, Transporte).
- Card interativo com barra de progresso (a barra preenche e muda de cor consoante ao quão próximo você está do limite).

### 📊 Relatórios Completos
Módulos dedicados em Abas (Tabs) para visualização macro e micro das suas finanças através de gráficos Chart.js:
- **Visão Geral:** Receitas x Despesas, Distribuição por Tipo e ranking.
- **Tendências:** Acompanhamento do Saldo Mensal em linhas e Saldo Acumulado.
- **Categorias:** Onde seu dinheiro mais vai? Descubra via Tabela ou Gráfico Horizontal.
- **Top Despesas:** As contas que mais drenaram saldo nos últimos 30 dias (ou no seu filtro Anual).
- **Investimentos:** Gráficos da divisão do seu portfólio de investimentos (ex: Cripto vs Renda Fixa) e Histórico.

### ⚙️ Configurações / Backup Inteligente
A aba de configuração permite você ser dono dos seus próprios dados:
- **Exportar em JSON:** O download salva absolutamente tudo (Suas Transações, Categorias criadas e até as suas metas de Orçamento programadas).
- **Importar JSON:** Você pode subir um JSON salvo para restaurar o sistema exatamente como ele era (compatível com backups de diferentes versões).
- **Exportar CSV:** Baixe uma planilha amigável estruturada para leitura no Excel/Google Sheets.
- **Wipe (Limpar Tudo):** Botão de perigo capaz de zerar localStorage e resetar o dashboard para a configuração de fábrica.

## 🛠️ Tecnologias Utilizadas

- **HTML5** & **CSS3** (Variáveis nativas para temas claros e escuros).
- **JavaScript Moderno (ES6)**, orientado a manipulação de DOM e `localStorage`.
- **Chart.js:** Biblioteca externa embutida via CDN para renderização de gráficos.
- **Remixicon:** Para renderização de ícones padronizados.

## 🚀 Como Rodar Localmente

O aplicativo roda no lado do cliente. Não é necessário Docker, banco de dados ou ambiente de servidor pesado.

1. Clone o repositório (`git clone <seu-repositorio>`).
2. Acesse a pasta do projeto.
3. Para uma experiência completa sem bloqueios do navegador, abra a pasta num servidor local.
   * Usando Live Server (Extensão do VsCode).
   * Ou pelo terminal, instalando: `npx serve -l 3000`.
4. Abra `http://localhost:3000` em seu navegador.

## 📱 Responsividade (Mobile e Desktop)
O layout contém regras em Media Queries flexíveis (`flexbox` e `CSS grids`) adaptando todas as telas perfeitamente, com menu "hambúrguer" sanduíche e modais redesenhados para não prejudicar dispositivos móveis.
