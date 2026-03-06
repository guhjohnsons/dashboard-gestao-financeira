// ===== FinanceFlow - Dashboard de Gastos Mensais =====

// ===== Data & State =====
const CATEGORIES = {
  food: { name: 'Alimentação', icon: 'ri-restaurant-2-line', emoji: '🍔', color: '#f97316', budget: 1500 },
  transport: { name: 'Transporte', icon: 'ri-car-line', emoji: '🚗', color: '#3b82f6', budget: 800 },
  housing: { name: 'Moradia', icon: 'ri-home-4-line', emoji: '🏠', color: '#8b5cf6', budget: 2000 },
  health: { name: 'Saúde', icon: 'ri-heart-pulse-line', emoji: '💊', color: '#10b981', budget: 500 },
  education: { name: 'Educação', icon: 'ri-book-open-line', emoji: '📚', color: '#06b6d4', budget: 600 },
  entertainment: { name: 'Lazer', icon: 'ri-gamepad-line', emoji: '🎮', color: '#ec4899', budget: 400 },
  shopping: { name: 'Compras', icon: 'ri-shopping-bag-3-line', emoji: '🛍️', color: '#f43f5e', budget: 700 },
  bills: { name: 'Contas', icon: 'ri-file-text-line', emoji: '📄', color: '#eab308', budget: 1200 },
  salary: { name: 'Salário', icon: 'ri-money-dollar-circle-line', emoji: '💰', color: '#22c55e', budget: 0 },
  freelance: { name: 'Freelance', icon: 'ri-briefcase-line', emoji: '💼', color: '#14b8a6', budget: 0 },
  investment: { name: 'Investimentos', icon: 'ri-line-chart-line', emoji: '📈', color: '#8b5cf6', budget: 0 },
  others: { name: 'Outros', icon: 'ri-archive-line', emoji: '📦', color: '#6b7280', budget: 500 },
};

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

let state = {
  transactions: [],
  currentMonth: new Date().getMonth(),
  currentYear: new Date().getFullYear(),
  currentPage: 'dashboard',
  currentFilter: 'all',
  editingId: null,
  deleteId: null,
  theme: 'light',
  viewMode: 'month', // 'month' or 'year'
};

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  loadTheme();
  setupEventListeners();
  setDefaultDates();
  updateAll();
  addSampleData();
});

// ===== LocalStorage =====
function saveData() {
  localStorage.setItem('financeflow_transactions', JSON.stringify(state.transactions));
}

function loadData() {
  const saved = localStorage.getItem('financeflow_transactions');
  if (saved) {
    state.transactions = JSON.parse(saved);
  }
}

function loadTheme() {
  const savedTheme = localStorage.getItem('financeflow_theme') || 'light';
  state.theme = savedTheme;
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeUI();
}

function updateThemeUI() {
  const icon = document.getElementById('themeIcon');
  const label = document.getElementById('themeLabel');
  if (state.theme === 'dark') {
    icon.className = 'ri-sun-line';
    label.textContent = 'Modo Claro';
  } else {
    icon.className = 'ri-moon-line';
    label.textContent = 'Modo Escuro';
  }
}

// ===== Sample Data =====
function addSampleData() {
  // Só adiciona dados de exemplo na primeira vez que o app é aberto
  if (localStorage.getItem('financeflow_initialized')) return;
  localStorage.setItem('financeflow_initialized', 'true');

  const year = state.currentYear;
  const month = state.currentMonth;

  const samples = [
    { name: 'Salário', amount: 8500, type: 'income', category: 'salary', date: `${year}-${pad(month + 1)}-05` },
    { name: 'Freelance Website', amount: 2800, type: 'income', category: 'freelance', date: `${year}-${pad(month + 1)}-10` },
    { name: 'Aluguel', amount: 1800, type: 'expense', category: 'housing', date: `${year}-${pad(month + 1)}-01` },
    { name: 'Supermercado', amount: 650, type: 'expense', category: 'food', date: `${year}-${pad(month + 1)}-03` },
    { name: 'Uber / 99', amount: 180, type: 'expense', category: 'transport', date: `${year}-${pad(month + 1)}-04` },
    { name: 'Academia', amount: 120, type: 'expense', category: 'health', date: `${year}-${pad(month + 1)}-05` },
    { name: 'Netflix + Spotify', amount: 75, type: 'expense', category: 'entertainment', date: `${year}-${pad(month + 1)}-06` },
    { name: 'Curso Online', amount: 297, type: 'expense', category: 'education', date: `${year}-${pad(month + 1)}-07` },
    { name: 'Energia Elétrica', amount: 215, type: 'expense', category: 'bills', date: `${year}-${pad(month + 1)}-10` },
    { name: 'Internet', amount: 130, type: 'expense', category: 'bills', date: `${year}-${pad(month + 1)}-10` },
    { name: 'Roupas', amount: 350, type: 'expense', category: 'shopping', date: `${year}-${pad(month + 1)}-12` },
    { name: 'Restaurante', amount: 185, type: 'expense', category: 'food', date: `${year}-${pad(month + 1)}-14` },
    { name: 'Combustível', amount: 250, type: 'expense', category: 'transport', date: `${year}-${pad(month + 1)}-15` },
    { name: 'Farmácia', amount: 95, type: 'expense', category: 'health', date: `${year}-${pad(month + 1)}-18` },
    { name: 'Presente Aniversário', amount: 200, type: 'expense', category: 'shopping', date: `${year}-${pad(month + 1)}-20` },
    { name: 'Celular', amount: 89, type: 'expense', category: 'bills', date: `${year}-${pad(month + 1)}-15` },
    { name: 'Dividendos', amount: 450, type: 'income', category: 'investment', date: `${year}-${pad(month + 1)}-22` },
  ];

  state.transactions = samples.map((s, i) => ({
    id: Date.now() + i,
    name: s.name,
    amount: s.amount,
    type: s.type,
    category: s.category,
    date: s.date,
    notes: '',
  }));

  saveData();
  updateAll();
}

function pad(n) {
  return String(n).padStart(2, '0');
}

// ===== Event Listeners =====
function setupEventListeners() {
  // Navigation
  document.querySelectorAll('.nav-item[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      navigateTo(btn.dataset.page);
      closeMobileSidebar();
    });
  });

  // Theme Toggle
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);

  // Month/Year Navigation
  document.getElementById('prevMonth').addEventListener('click', () => changePeriod(-1));
  document.getElementById('nextMonth').addEventListener('click', () => changePeriod(1));

  // View Mode Toggle
  document.getElementById('viewMonth').addEventListener('click', () => setViewMode('month'));
  document.getElementById('viewYear').addEventListener('click', () => setViewMode('year'));

  // FAB & Add buttons
  document.getElementById('fabButton').addEventListener('click', openModal);
  document.getElementById('btnAddNew').addEventListener('click', openModal);

  // Modal
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalCancel').addEventListener('click', closeModal);
  document.getElementById('modalSave').addEventListener('click', saveTransaction);
  document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });

  // Modal type toggle
  document.getElementById('modalTypeExpense').addEventListener('click', () => setModalType('expense'));
  document.getElementById('modalTypeIncome').addEventListener('click', () => setModalType('income'));

  // Page form
  document.getElementById('expenseFormPage').addEventListener('submit', handlePageFormSubmit);
  document.getElementById('pageTypeExpense').addEventListener('click', () => setPageType('expense'));
  document.getElementById('pageTypeIncome').addEventListener('click', () => setPageType('income'));

  // Confirm delete
  document.getElementById('confirmCancel').addEventListener('click', closeConfirm);
  document.getElementById('confirmDelete').addEventListener('click', confirmDeleteTransaction);
  document.getElementById('confirmOverlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeConfirm();
  });

  // Filters
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.currentFilter = chip.dataset.filter;
      renderAllTransactions();
    });
  });

  // Mobile sidebar
  document.getElementById('btnMobileMenu').addEventListener('click', toggleMobileSidebar);
  document.getElementById('sidebarOverlay').addEventListener('click', closeMobileSidebar);

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeConfirm();
      closeMobileSidebar();
    }
  });

  // Settings / Backup
  const btnExportJSON = document.getElementById('btnExportJSON');
  if (btnExportJSON) btnExportJSON.addEventListener('click', exportDataJSON);

  const btnExportCSV = document.getElementById('btnExportCSV');
  if (btnExportCSV) btnExportCSV.addEventListener('click', exportDataCSV);

  const fileImportJSON = document.getElementById('fileImportJSON');
  if (fileImportJSON) fileImportJSON.addEventListener('change', importDataJSON);
}

// ===== Navigation =====
function navigateTo(page) {
  state.currentPage = page;

  // Update nav items
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const activeNav = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (activeNav) activeNav.classList.add('active');

  // Update pages
  document.querySelectorAll('.page-section').forEach(p => p.classList.remove('active'));
  const activePage = document.getElementById(`page-${page}`);
  if (activePage) activePage.classList.add('active');

  // Update header
  const titles = {
    dashboard: ['Dashboard', 'Visão geral das suas finanças'],
    transactions: ['Transações', 'Histórico completo de movimentações'],
    'add-expense': ['Novo Registro', 'Cadastre uma nova transação'],
    categories: ['Categorias', 'Gastos organizados por categoria'],
    reports: ['Relatórios', 'Análises detalhadas das suas finanças'],
    settings: ['Configurações', 'Backup e exportação de dados'],
  };

  const [title, subtitle] = titles[page] || ['Dashboard', ''];
  document.getElementById('pageTitle').textContent = title;
  document.getElementById('pageSubtitle').textContent = subtitle;

  updateAll();
}

// ===== Theme =====
function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem('financeflow_theme', state.theme);
  updateThemeUI();
  updateCharts();
}

// ===== View Mode =====
function setViewMode(mode) {
  state.viewMode = mode;
  document.getElementById('viewMonth').classList.toggle('active', mode === 'month');
  document.getElementById('viewYear').classList.toggle('active', mode === 'year');
  updateAll();
}

// ===== Period Navigation =====
function changePeriod(direction) {
  if (state.viewMode === 'year') {
    state.currentYear += direction;
  } else {
    state.currentMonth += direction;
    if (state.currentMonth > 11) {
      state.currentMonth = 0;
      state.currentYear++;
    } else if (state.currentMonth < 0) {
      state.currentMonth = 11;
      state.currentYear--;
    }
  }
  updateAll();
}

function updateMonthDisplay() {
  if (state.viewMode === 'year') {
    document.getElementById('currentMonth').textContent = `${state.currentYear}`;
  } else {
    document.getElementById('currentMonth').textContent =
      `${MONTH_NAMES[state.currentMonth]} ${state.currentYear}`;
  }
}

// ===== Filtering =====
function getFilteredTransactions() {
  return state.transactions.filter(t => {
    const d = new Date(t.date + 'T00:00:00');
    if (state.viewMode === 'year') {
      return d.getFullYear() === state.currentYear;
    }
    return d.getMonth() === state.currentMonth && d.getFullYear() === state.currentYear;
  });
}

// ===== Currency Format =====
function formatCurrency(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

// ===== Update Everything =====
function updateAll() {
  updateMonthDisplay();
  updateSummaryCards();
  updateCharts();
  renderRecentTransactions();
  renderAllTransactions();
  renderCategories();
  updateReports();
}

// ===== Summary Cards =====
function updateSummaryCards() {
  const transactions = getFilteredTransactions();

  const income = transactions.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
  const balance = income - expense;

  document.getElementById('totalRecords').textContent = transactions.length;
  document.getElementById('totalIncome').textContent = formatCurrency(income);
  document.getElementById('totalExpense').textContent = formatCurrency(expense);
  document.getElementById('totalBalance').textContent = formatCurrency(balance);

  // Dynamic labels based on view mode
  const isYear = state.viewMode === 'year';
  document.getElementById('periodLabel').textContent = isYear ? 'transações este ano' : 'transações este mês';

  const dailyTitle = document.getElementById('dailyChartTitle');
  const dailyBadge = document.getElementById('dailyChartBadge');
  if (dailyTitle) dailyTitle.textContent = isYear ? 'Despesas Mensais' : 'Despesas Diárias';
  if (dailyBadge) dailyBadge.textContent = isYear ? 'Visão Anual' : 'Últimos 30 dias';

  // Balance color
  const balanceEl = document.getElementById('totalBalance');
  balanceEl.style.color = balance >= 0 ? 'var(--color-income)' : 'var(--color-expense)';
}

// ===== Charts =====
let dailyChart, categoryChart, comparisonChart, trendChart;

function getChartColors() {
  const isDark = state.theme === 'dark';
  return {
    gridColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    textColor: isDark ? '#9ca3b4' : '#6b7280',
    tooltipBg: isDark ? '#1e2130' : '#ffffff',
    tooltipText: isDark ? '#f1f3f7' : '#1a1d26',
    tooltipBorder: isDark ? '#2d3041' : '#e5e7eb',
  };
}

function updateCharts() {
  const transactions = getFilteredTransactions();
  const colors = getChartColors();

  // Destroy existing charts
  if (dailyChart) dailyChart.destroy();
  if (categoryChart) categoryChart.destroy();
  if (comparisonChart) comparisonChart.destroy();
  if (trendChart) trendChart.destroy();

  updateDailyChart(transactions, colors);
  updateCategoryChart(transactions, colors);

  if (state.currentPage === 'reports') {
    updateComparisonChart(transactions, colors);
    updateTrendChart(colors);
  }
}

function updateDailyChart(transactions, colors) {
  const canvas = document.getElementById('dailyChart');
  if (!canvas) return;

  let labels, expenseData, incomeData;

  if (state.viewMode === 'year') {
    // Visão anual: agrupar por mês
    labels = MONTH_NAMES.map(m => m.substring(0, 3));
    expenseData = Array(12).fill(0);
    incomeData = Array(12).fill(0);

    transactions.forEach(t => {
      const d = new Date(t.date + 'T00:00:00');
      const month = d.getMonth();
      if (t.type === 'expense') expenseData[month] += t.amount;
      else incomeData[month] += t.amount;
    });
  } else {
    // Visão mensal: agrupar por dia
    const daysInMonth = new Date(state.currentYear, state.currentMonth + 1, 0).getDate();
    labels = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    expenseData = Array(daysInMonth).fill(0);
    incomeData = Array(daysInMonth).fill(0);

    transactions.forEach(t => {
      const d = new Date(t.date + 'T00:00:00');
      const day = d.getDate() - 1;
      if (t.type === 'expense') expenseData[day] += t.amount;
      else incomeData[day] += t.amount;
    });
  }

  dailyChart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Despesas',
          data: expenseData,
          backgroundColor: 'rgba(239, 68, 68, 0.7)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        },
        {
          label: 'Receitas',
          data: incomeData,
          backgroundColor: 'rgba(16, 185, 129, 0.7)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { color: colors.textColor, font: { family: 'Inter', size: 11 }, boxWidth: 12, padding: 16 }
        },
        tooltip: {
          backgroundColor: colors.tooltipBg,
          titleColor: colors.tooltipText,
          bodyColor: colors.tooltipText,
          borderColor: colors.tooltipBorder,
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
          titleFont: { family: 'Inter', weight: '600' },
          bodyFont: { family: 'Inter' },
          callbacks: {
            label: ctx => `${ctx.dataset.label}: ${formatCurrency(ctx.raw)}`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: colors.textColor, font: { family: 'Inter', size: 10 }, maxTicksLimit: state.viewMode === 'year' ? 12 : 15 }
        },
        y: {
          grid: { color: colors.gridColor },
          ticks: { color: colors.textColor, font: { family: 'Inter', size: 10 }, callback: v => `R$${v}` },
          beginAtZero: true
        }
      }
    }
  });
}

function updateCategoryChart(transactions, colors) {
  const canvas = document.getElementById('categoryChart');
  if (!canvas) return;

  const expenses = transactions.filter(t => t.type === 'expense');
  const catTotals = {};

  expenses.forEach(t => {
    catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
  });

  const sortedCats = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
  const labels = sortedCats.map(([k]) => CATEGORIES[k]?.name || k);
  const data = sortedCats.map(([, v]) => v);
  const bgColors = sortedCats.map(([k]) => CATEGORIES[k]?.color || '#6b7280');

  categoryChart = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: bgColors,
        borderWidth: 0,
        hoverOffset: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: colors.textColor,
            font: { family: 'Inter', size: 11 },
            padding: 12,
            boxWidth: 12,
            usePointStyle: true,
            pointStyle: 'circle',
          }
        },
        tooltip: {
          backgroundColor: colors.tooltipBg,
          titleColor: colors.tooltipText,
          bodyColor: colors.tooltipText,
          borderColor: colors.tooltipBorder,
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
          titleFont: { family: 'Inter', weight: '600' },
          bodyFont: { family: 'Inter' },
          callbacks: {
            label: ctx => {
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
              const pct = ((ctx.raw / total) * 100).toFixed(1);
              return `${ctx.label}: ${formatCurrency(ctx.raw)} (${pct}%)`;
            }
          }
        }
      }
    }
  });
}

function updateComparisonChart(transactions, colors) {
  const canvas = document.getElementById('comparisonChart');
  if (!canvas) return;

  // Show last 6 months
  const labels = [];
  const incomeData = [];
  const expenseData = [];

  for (let i = 5; i >= 0; i--) {
    let m = state.currentMonth - i;
    let y = state.currentYear;
    if (m < 0) { m += 12; y--; }
    labels.push(`${MONTH_NAMES[m].substring(0, 3)}`);

    const monthTx = state.transactions.filter(t => {
      const d = new Date(t.date + 'T00:00:00');
      return d.getMonth() === m && d.getFullYear() === y;
    });

    incomeData.push(monthTx.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0));
    expenseData.push(monthTx.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0));
  }

  comparisonChart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Receitas',
          data: incomeData,
          backgroundColor: 'rgba(16, 185, 129, 0.75)',
          borderColor: '#10b981',
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          label: 'Despesas',
          data: expenseData,
          backgroundColor: 'rgba(239, 68, 68, 0.75)',
          borderColor: '#ef4444',
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: colors.textColor, font: { family: 'Inter', size: 11 }, boxWidth: 12, padding: 16 }
        },
        tooltip: {
          backgroundColor: colors.tooltipBg,
          titleColor: colors.tooltipText,
          bodyColor: colors.tooltipText,
          borderColor: colors.tooltipBorder,
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
          callbacks: {
            label: ctx => `${ctx.dataset.label}: ${formatCurrency(ctx.raw)}`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: colors.textColor, font: { family: 'Inter', size: 11 } }
        },
        y: {
          grid: { color: colors.gridColor },
          ticks: { color: colors.textColor, font: { family: 'Inter', size: 10 }, callback: v => `R$${v}` },
          beginAtZero: true
        }
      }
    }
  });
}

function updateTrendChart(colors) {
  const canvas = document.getElementById('trendChart');
  if (!canvas) return;

  const labels = [];
  const balanceData = [];

  for (let i = 5; i >= 0; i--) {
    let m = state.currentMonth - i;
    let y = state.currentYear;
    if (m < 0) { m += 12; y--; }
    labels.push(`${MONTH_NAMES[m].substring(0, 3)}`);

    const monthTx = state.transactions.filter(t => {
      const d = new Date(t.date + 'T00:00:00');
      return d.getMonth() === m && d.getFullYear() === y;
    });

    const income = monthTx.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0);
    const expense = monthTx.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
    balanceData.push(income - expense);
  }

  trendChart = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Saldo',
        data: balanceData,
        borderColor: '#6c5ce7',
        backgroundColor: 'rgba(108, 92, 231, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#6c5ce7',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: colors.textColor, font: { family: 'Inter', size: 11 }, boxWidth: 12 }
        },
        tooltip: {
          backgroundColor: colors.tooltipBg,
          titleColor: colors.tooltipText,
          bodyColor: colors.tooltipText,
          borderColor: colors.tooltipBorder,
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
          callbacks: {
            label: ctx => `Saldo: ${formatCurrency(ctx.raw)}`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: colors.textColor, font: { family: 'Inter', size: 11 } }
        },
        y: {
          grid: { color: colors.gridColor },
          ticks: { color: colors.textColor, font: { family: 'Inter', size: 10 }, callback: v => `R$${v}` }
        }
      }
    }
  });
}

// ===== Render Transactions =====
function createTransactionHTML(t) {
  const cat = CATEGORIES[t.category] || CATEGORIES.others;
  const amountClass = t.type === 'expense' ? 'expense' : 'income';
  const amountPrefix = t.type === 'expense' ? '- ' : '+ ';

  return `
    <div class="transaction-item" data-id="${t.id}">
      <div class="transaction-icon" style="background: ${cat.color}15; color: ${cat.color};">
        <i class="${cat.icon}"></i>
      </div>
      <div class="transaction-info">
        <div class="transaction-name">${t.name}</div>
        <div class="transaction-category">${cat.name}</div>
      </div>
      <div class="transaction-date">${formatDate(t.date)}</div>
      <div class="transaction-amount ${amountClass}">
        ${amountPrefix}${formatCurrency(t.amount)}
      </div>
      <div class="transaction-actions">
        <button class="btn-edit" onclick="editTransaction(${t.id})" title="Editar">
          <i class="ri-pencil-line"></i>
        </button>
        <button class="btn-delete" onclick="deleteTransaction(${t.id})" title="Excluir">
          <i class="ri-delete-bin-line"></i>
        </button>
      </div>
    </div>
  `;
}

function renderRecentTransactions() {
  const container = document.getElementById('recentTransactions');
  const transactions = getFilteredTransactions()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  if (transactions.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="ri-inbox-2-line"></i>
        <h4>Nenhuma transação</h4>
        <p>Adicione sua primeira transação para começar a acompanhar seus gastos.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = transactions.map(createTransactionHTML).join('');
}

function renderAllTransactions() {
  const container = document.getElementById('allTransactions');
  let transactions = getFilteredTransactions()
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (state.currentFilter !== 'all') {
    transactions = transactions.filter(t => t.type === state.currentFilter);
  }

  if (transactions.length === 0) {
    const periodText = state.viewMode === 'year' ? 'ano' : 'mês';
    container.innerHTML = `
      <div class="empty-state">
        <i class="ri-inbox-2-line"></i>
        <h4>Nenhuma transação encontrada</h4>
        <p>Não há transações para o filtro e ${periodText} selecionado.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = transactions.map(createTransactionHTML).join('');
}

// ===== Categories =====
function renderCategories() {
  const container = document.getElementById('categoriesGrid');
  const transactions = getFilteredTransactions().filter(t => t.type === 'expense');
  const catTotals = {};

  transactions.forEach(t => {
    catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
  });

  const allCats = Object.entries(CATEGORIES).filter(([, v]) => v.budget > 0 || catTotals[v] > 0);

  container.innerHTML = allCats.map(([key, cat]) => {
    const total = catTotals[key] || 0;
    return `
      <div class="category-card">
        <div class="category-icon-large" style="background: ${cat.color}15; color: ${cat.color};">
          <i class="${cat.icon}"></i>
        </div>
        <div class="category-details">
          <h4>${cat.name}</h4>
          <span>${transactions.filter(t => t.category === key).length} transações</span>
        </div>
        <div class="category-amount" style="color: ${total > 0 ? 'var(--color-expense)' : 'var(--text-muted)'};">
          ${formatCurrency(total)}
        </div>
      </div>
    `;
  }).join('');
}

// ===== Reports =====
function updateReports() {
  const transactions = getFilteredTransactions();
  const expenses = transactions.filter(t => t.type === 'expense');

  // Average daily
  const totalExpense = expenses.reduce((a, t) => a + t.amount, 0);
  let avgDays;
  if (state.viewMode === 'year') {
    // Dias no ano (simplificado)
    avgDays = 365;
  } else {
    avgDays = new Date(state.currentYear, state.currentMonth + 1, 0).getDate();
  }
  const avgDaily = totalExpense / avgDays;
  document.getElementById('avgDaily').textContent = formatCurrency(avgDaily);

  // Biggest expense
  const biggest = expenses.length > 0 ? Math.max(...expenses.map(t => t.amount)) : 0;
  document.getElementById('biggestExpense').textContent = formatCurrency(biggest);

  // Top category
  const catTotals = {};
  expenses.forEach(t => {
    catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
  });
  const topCat = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];
  document.getElementById('topCategory').textContent = topCat ? CATEGORIES[topCat[0]]?.name || '-' : '-';

  // Budget progress
  renderBudgetProgress(catTotals);
}

function renderBudgetProgress(catTotals) {
  const container = document.getElementById('budgetList');
  const budgetCats = Object.entries(CATEGORIES).filter(([, v]) => v.budget > 0);

  container.innerHTML = budgetCats.map(([key, cat]) => {
    const spent = catTotals[key] || 0;
    const pct = cat.budget > 0 ? Math.min((spent / cat.budget) * 100, 100) : 0;
    let barColor = cat.color;
    if (pct > 90) barColor = '#ef4444';
    else if (pct > 70) barColor = '#f59e0b';

    return `
      <div class="budget-item">
        <div class="budget-item-header">
          <span>${cat.emoji} ${cat.name}</span>
          <span class="budget-values">${formatCurrency(spent)} / ${formatCurrency(cat.budget)}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${pct}%; background: ${barColor};"></div>
        </div>
      </div>
    `;
  }).join('');
}

// ===== Modal =====
function openModal(editId) {
  state.editingId = null;
  document.getElementById('modalTitle').textContent = 'Nova Transação';
  document.getElementById('expenseForm').reset();
  setModalType('expense');
  setDefaultDates();

  if (typeof editId === 'number') {
    const t = state.transactions.find(tx => tx.id === editId);
    if (t) {
      state.editingId = editId;
      document.getElementById('modalTitle').textContent = 'Editar Transação';
      document.getElementById('editId').value = editId;
      document.getElementById('modalName').value = t.name;
      document.getElementById('modalAmount').value = t.amount;
      document.getElementById('modalDate').value = t.date;
      document.getElementById('modalCategory').value = t.category;
      document.getElementById('modalNotes').value = t.notes || '';
      setModalType(t.type);
    }
  }

  document.getElementById('modalOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';

  setTimeout(() => document.getElementById('modalName').focus(), 300);
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  document.body.style.overflow = '';
  state.editingId = null;
}

function setModalType(type) {
  const expBtn = document.getElementById('modalTypeExpense');
  const incBtn = document.getElementById('modalTypeIncome');
  expBtn.classList.toggle('active', type === 'expense');
  incBtn.classList.toggle('active', type === 'income');
  expBtn.dataset.selected = type === 'expense';
  incBtn.dataset.selected = type === 'income';
}

function getModalType() {
  return document.getElementById('modalTypeIncome').classList.contains('active') ? 'income' : 'expense';
}

function saveTransaction() {
  const form = document.getElementById('expenseForm');
  const name = document.getElementById('modalName').value.trim();
  const amount = parseFloat(document.getElementById('modalAmount').value);
  const date = document.getElementById('modalDate').value;
  const category = document.getElementById('modalCategory').value;
  const notes = document.getElementById('modalNotes').value.trim();
  const type = getModalType();

  if (!name || !amount || !date || !category) {
    showToast('Preencha todos os campos obrigatórios', 'error');
    return;
  }

  if (state.editingId) {
    // Edit existing
    const idx = state.transactions.findIndex(t => t.id === state.editingId);
    if (idx !== -1) {
      state.transactions[idx] = { ...state.transactions[idx], name, amount, date, category, notes, type };
      showToast('Transação atualizada com sucesso!', 'success');
    }
  } else {
    // Add new
    state.transactions.push({
      id: Date.now(),
      name,
      amount,
      type,
      category,
      date,
      notes,
    });
    showToast('Transação adicionada com sucesso!', 'success');
  }

  saveData();
  closeModal();
  updateAll();
}

// ===== Page Form =====
function setPageType(type) {
  const expBtn = document.getElementById('pageTypeExpense');
  const incBtn = document.getElementById('pageTypeIncome');
  expBtn.classList.toggle('active', type === 'expense');
  incBtn.classList.toggle('active', type === 'income');
}

function getPageType() {
  return document.getElementById('pageTypeIncome').classList.contains('active') ? 'income' : 'expense';
}

function handlePageFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('pageName').value.trim();
  const amount = parseFloat(document.getElementById('pageAmount').value);
  const date = document.getElementById('pageDate').value;
  const category = document.getElementById('pageCategory').value;
  const notes = document.getElementById('pageNotes').value.trim();
  const type = getPageType();

  if (!name || !amount || !date || !category) {
    showToast('Preencha todos os campos obrigatórios', 'error');
    return;
  }

  state.transactions.push({
    id: Date.now(),
    name,
    amount,
    type,
    category,
    date,
    notes,
  });

  saveData();
  showToast('Transação adicionada com sucesso!', 'success');

  // Reset form
  document.getElementById('expenseFormPage').reset();
  setPageType('expense');
  setDefaultDates();
  updateAll();
}

// ===== Edit / Delete =====
function editTransaction(id) {
  openModal(id);
}

function deleteTransaction(id) {
  state.deleteId = id;
  document.getElementById('confirmOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function confirmDeleteTransaction() {
  if (state.deleteId) {
    state.transactions = state.transactions.filter(t => t.id !== state.deleteId);
    saveData();
    updateAll();
    showToast('Transação excluída com sucesso!', 'info');
  }
  closeConfirm();
}

function closeConfirm() {
  document.getElementById('confirmOverlay').classList.remove('active');
  document.body.style.overflow = '';
  state.deleteId = null;
}

// ===== Default Dates =====
function setDefaultDates() {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  const modalDate = document.getElementById('modalDate');
  const pageDate = document.getElementById('pageDate');
  if (modalDate) modalDate.value = dateStr;
  if (pageDate) pageDate.value = dateStr;
}

// ===== Mobile Sidebar =====
function toggleMobileSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('active');
}

function closeMobileSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('active');
}

// ===== Toast Notifications =====
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const icons = {
    success: 'ri-check-double-line',
    error: 'ri-error-warning-line',
    info: 'ri-information-line',
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="${icons[type] || icons.info}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3200);
}

// ===== Export & Import =====
function exportDataJSON() {
  const dataStr = JSON.stringify(state.transactions, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `financeflow_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Backup JSON exportado com sucesso!', 'success');
}

function exportDataCSV() {
  if (state.transactions.length === 0) {
    showToast('Nenhum dado para exportar.', 'info');
    return;
  }

  const headers = ['ID', 'Tipo', 'Categoria', 'Data', 'Valor (R$)', 'Descricao', 'Observacoes'];
  const rows = [headers.join(';')];

  state.transactions.forEach(t => {
    const row = [
      t.id,
      t.type === 'expense' ? 'Despesa' : 'Receita',
      CATEGORIES[t.category]?.name || t.category,
      t.date,
      t.amount.toFixed(2).replace('.', ','),
      `"${(t.name || '').replace(/"/g, '""')}"`,
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ];
    rows.push(row.join(';'));
  });

  const csvStr = '\uFEFF' + rows.join('\n');
  const blob = new Blob([csvStr], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `financeflow_export_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Planilha CSV exportada com sucesso!', 'success');
}

function importDataJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const parsedData = JSON.parse(e.target.result);
      if (Array.isArray(parsedData)) {
        // Validate if array items look like transactions
        const isValid = parsedData.every(t => t.hasOwnProperty('id') && t.hasOwnProperty('amount') && t.hasOwnProperty('type'));
        if (isValid) {
          state.transactions = parsedData;
          saveData();
          updateAll();
          showToast('Dados restaurados com sucesso!', 'success');
        } else {
          showToast('Formato JSON inválido - Campos ausentes.', 'error');
        }
      } else {
        showToast('Formato não reconhecido.', 'error');
      }
    } catch (err) {
      showToast('Erro ao ler o arquivo JSON.', 'error');
    }
  };
  reader.readAsText(file);
  event.target.value = ''; // Reset input to allow re-importing same file
}
