// ===== GestaoFinanceiraGu - Dashboard de Gastos Mensais =====

// ===== Data & State =====
// Categorias fixas: Receita, Investimento, Despesa, Emprestimo
const CATEGORIES = {
  // Receita
  folha: { name: 'Folha', icon: 'ri-money-dollar-circle-line', emoji: '💰', color: '#22c55e', budget: 0, type: 'income' },
  adto_quinzenal: { name: 'Adto. Quinzenal', icon: 'ri-calendar-check-line', emoji: '📅', color: '#10b981', budget: 0, type: 'income' },
  ferias: { name: 'Férias', icon: 'ri-sun-line', emoji: '☀️', color: '#14b8a6', budget: 0, type: 'income' },
  decimo_terceiro: { name: '13', icon: 'ri-gift-line', emoji: '🎁', color: '#06b6d4', budget: 0, type: 'income' },
  plr_bonus: { name: 'PLR/Bonus', icon: 'ri-trophy-line', emoji: '🏆', color: '#f59e0b', budget: 0, type: 'income' },
  saque_cripto_p2p: { name: 'Saque Cripto / P2P', icon: 'ri-exchange-line', emoji: '💱', color: '#f43f5e', budget: 0, type: 'income' },
  // Investimento
  prev_priv_variavel: { name: 'Prev. Priv. Variavel', icon: 'ri-line-chart-line', emoji: '📈', color: '#3b82f6', budget: 0, type: 'investment' },
  prev_priv_fixa: { name: 'Prev. Priv. Fixa', icon: 'ri-bank-line', emoji: '🏦', color: '#8b5cf6', budget: 0, type: 'investment' },
  cripto: { name: 'Cripto', icon: 'ri-currency-line', emoji: '₿', color: '#f97316', budget: 0, type: 'investment' },
  // Despesa
  conta_vivo_celular: { name: 'Conta Vivo Celular', icon: 'ri-smartphone-line', emoji: '📱', color: '#22c55e', budget: 0, type: 'expense' },
  conta_vivo_casa: { name: 'Conta Vivo Casa', icon: 'ri-home-wifi-line', emoji: '🏠', color: '#22c55e', budget: 0, type: 'expense' },
  conta_luz: { name: 'Conta Luz', icon: 'ri-lightbulb-line', emoji: '💡', color: '#eab308', budget: 0, type: 'expense' },
  fatura_nubank: { name: 'Fatura Nubank', icon: 'ri-bank-card-line', emoji: '💳', color: '#8b5cf6', budget: 0, type: 'expense' },
  fatura_mercadopago: { name: 'Fatura MercadoPago', icon: 'ri-wallet-3-line', emoji: '🛒', color: '#06b6d4', budget: 0, type: 'expense' },
  others: { name: 'Outros', icon: 'ri-archive-line', emoji: '📦', color: '#6b7280', budget: 0, type: 'expense' },
  // Emprestimo
  emprestimo_1: { name: 'Emprestimo 1', icon: 'ri-hand-coin-line', emoji: '📋', color: '#ef4444', budget: 0, type: 'loan', isLoan: true },
  emprestimo_2: { name: 'Emprestimo 2', icon: 'ri-hand-coin-line', emoji: '📋', color: '#dc2626', budget: 0, type: 'loan', isLoan: true },
  emprestimo_3: { name: 'Emprestimo 3', icon: 'ri-hand-coin-line', emoji: '📋', color: '#b91c1c', budget: 0, type: 'loan', isLoan: true },
};
const CUSTOM_CATEGORIES_KEY = 'gestaofinanceiragu_custom_categories';
let customCategories = {}; // { id: { name, icon, emoji, color, budget, type } }

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
  populateCategorySelects();
  setupCategoryAndParcelasListeners();
  updateAll();
  addSampleData();
});

// ===== LocalStorage =====
function saveData() {
  localStorage.setItem('gestaofinanceiragu_transactions', JSON.stringify(state.transactions));
}

function saveCustomCategories() {
  localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(customCategories));
}

function loadData() {
  const saved = localStorage.getItem('gestaofinanceiragu_transactions');
  if (saved) {
    state.transactions = JSON.parse(saved);
  }
  const savedCustom = localStorage.getItem(CUSTOM_CATEGORIES_KEY);
  if (savedCustom) {
    try {
      customCategories = JSON.parse(savedCustom);
    } catch (_) {
      customCategories = {};
    }
  }
}

function getAllCategories() {
  return { ...CATEGORIES, ...customCategories };
}

function getCategory(key) {
  return CATEGORIES[key] || customCategories[key] || CATEGORIES.others;
}

function isLoanCategory(key) {
  const cat = getCategory(key);
  return cat && cat.isLoan === true;
}

function populateCategorySelects() {
  const allCats = getAllCategories();
  const byType = {
    income: Object.entries(allCats).filter(([, v]) => v.type === 'income'),
    investment: Object.entries(allCats).filter(([, v]) => v.type === 'investment'),
    expense: Object.entries(allCats).filter(([, v]) => v.type === 'expense' || !v.type),
    loan: Object.entries(allCats).filter(([, v]) => v.type === 'loan'),
  };
  const typeLabels = { income: 'Receita', investment: 'Investimento', expense: 'Despesa', loan: 'Emprestimo' };

  function fillSelect(selectEl, currentType) {
    if (!selectEl) return;
    const list = byType[currentType] || [];
    const label = typeLabels[currentType] || currentType;
    let html = '<option value="">Selecione uma categoria</option>';
    html += `<optgroup label="${label}">`;
    list.forEach(([key, cat]) => {
      html += `<option value="${key}">${cat.emoji} ${cat.name}</option>`;
    });
    html += '</optgroup>';
    html += '<option value="__nova_categoria__">➕ Nova categoria...</option>';
    selectEl.innerHTML = html;
  }

  const modalCat = document.getElementById('modalCategory');
  const pageCat = document.getElementById('pageCategory');
  const modalType = getModalType();
  const pageType = getPageType();
  fillSelect(modalCat, modalType);
  fillSelect(pageCat, pageType);
}

function setupCategoryAndParcelasListeners() {
  function toggleParcelas(selectId, wrapId) {
    const select = document.getElementById(selectId);
    const wrap = document.getElementById(wrapId);
    if (!select || !wrap) return;
    const key = select.value;
    const show = key === 'emprestimo_1' || key === 'emprestimo_2' || key === 'emprestimo_3';
    wrap.style.display = show ? 'block' : 'none';
  }

  function handleCategoryChange(selectId, wrapId, novaCategoriaWrapId) {
    const select = document.getElementById(selectId);
    const wrap = document.getElementById(wrapId);
    const novaWrap = document.getElementById(novaCategoriaWrapId);
    if (!select) return;
    if (select.value === '__nova_categoria__') {
      if (novaWrap) novaWrap.style.display = 'block';
      if (wrap) wrap.style.display = 'none';
      return;
    }
    if (novaWrap) novaWrap.style.display = 'none';
    toggleParcelas(selectId, wrapId);
  }

  ['modalCategory', 'pageCategory'].forEach(selectId => {
    const select = document.getElementById(selectId);
    if (!select) return;
    select.addEventListener('change', () => {
      const wrapId = selectId === 'modalCategory' ? 'modalParcelasWrap' : 'pageParcelasWrap';
      const novaWrapId = selectId === 'modalCategory' ? 'modalNovaCategoriaWrap' : 'pageNovaCategoriaWrap';
      handleCategoryChange(selectId, wrapId, novaWrapId);
    });
  });

  const hideNovaAndParcelas = (parcelasId, novaId) => {
    const pw = document.getElementById(parcelasId);
    const nw = document.getElementById(novaId);
    if (pw) pw.style.display = 'none';
    if (nw) nw.style.display = 'none';
  };

  ['modalTypeIncome', 'modalTypeInvestment', 'modalTypeExpense', 'modalTypeLoan'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', () => {
      populateCategorySelects();
      hideNovaAndParcelas('modalParcelasWrap', 'modalNovaCategoriaWrap');
      if (getModalType() === 'loan') document.getElementById('modalParcelasWrap').style.display = 'block';
    });
  });
  ['pageTypeIncome', 'pageTypeInvestment', 'pageTypeExpense', 'pageTypeLoan'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', () => {
      populateCategorySelects();
      hideNovaAndParcelas('pageParcelasWrap', 'pageNovaCategoriaWrap');
      if (getPageType() === 'loan') document.getElementById('pageParcelasWrap').style.display = 'block';
    });
  });
}

function addCustomCategory(name, type) {
  const id = 'custom_' + Date.now();
  customCategories[id] = {
    name: name.trim(),
    icon: 'ri-add-line',
    emoji: '📌',
    color: '#6b7280',
    budget: 0,
    type: type || 'expense',
  };
  saveCustomCategories();
  populateCategorySelects();
  return id;
}

function isCustomCategory(key) {
  return typeof key === 'string' && key.startsWith('custom_');
}

function deleteCustomCategory(key) {
  if (!isCustomCategory(key)) return;
  const cat = customCategories[key];
  if (!cat) return;
  const count = state.transactions.filter(t => t.category === key).length;
  const msg = count > 0
    ? `Excluir a categoria "${cat.name}"? As ${count} transação(ões) serão movidas para "Outros".`
    : `Excluir a categoria "${cat.name}"?`;
  if (!confirm(msg)) return;

  state.transactions.forEach(t => {
    if (t.category === key) t.category = 'others';
  });
  delete customCategories[key];
  saveCustomCategories();
  saveData();
  showToast('Categoria excluída.', 'success');
  updateAll();
}

function loadTheme() {
  const savedTheme = localStorage.getItem('gestaofinanceiragu_theme') || 'light';
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

  // Modal type toggle (4 tipos)
  document.getElementById('modalTypeExpense').addEventListener('click', () => setModalType('expense'));
  document.getElementById('modalTypeIncome').addEventListener('click', () => setModalType('income'));
  document.getElementById('modalTypeInvestment').addEventListener('click', () => setModalType('investment'));
  document.getElementById('modalTypeLoan').addEventListener('click', () => setModalType('loan'));

  // Page form type toggle (4 tipos)
  document.getElementById('pageTypeExpense').addEventListener('click', () => setPageType('expense'));
  document.getElementById('pageTypeIncome').addEventListener('click', () => setPageType('income'));
  document.getElementById('pageTypeInvestment').addEventListener('click', () => setPageType('investment'));
  document.getElementById('pageTypeLoan').addEventListener('click', () => setPageType('loan'));

  // Page form submit
  document.getElementById('expenseFormPage').addEventListener('submit', handlePageFormSubmit);

  // Confirm delete
  document.getElementById('confirmCancel').addEventListener('click', closeConfirm);
  document.getElementById('confirmDelete').addEventListener('click', confirmDeleteTransaction);
  document.getElementById('confirmOverlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeConfirm();
  });

  document.getElementById('newCategoryClose').addEventListener('click', closeNewCategoryModal);
  document.getElementById('newCategoryCancel').addEventListener('click', closeNewCategoryModal);
  document.getElementById('newCategorySave').addEventListener('click', saveNewCategoryFromModal);
  document.getElementById('newCategoryOverlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeNewCategoryModal();
  });
  document.querySelectorAll('#newCategoryOverlay .type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#newCategoryOverlay .type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  document.getElementById('newCategoryName').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveNewCategoryFromModal();
    }
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
      closeNewCategoryModal();
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

  const btnClearAllData = document.getElementById('btnClearAllData');
  if (btnClearAllData) btnClearAllData.addEventListener('click', clearAllData);
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

  if (page === 'add-expense') populateCategorySelects();
  updateAll();
}

// ===== Theme =====
function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem('gestaofinanceiragu_theme', state.theme);
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
  const investment = transactions.filter(t => t.type === 'investment').reduce((a, t) => a + t.amount, 0);
  const loan = transactions.filter(t => t.type === 'loan').reduce((a, t) => a + t.amount, 0);
  const balance = income - expense - investment - loan;

  document.getElementById('totalIncome').textContent = formatCurrency(income);
  document.getElementById('totalExpense').textContent = formatCurrency(expense);
  document.getElementById('totalInvestment').textContent = formatCurrency(investment);
  document.getElementById('totalLoan').textContent = formatCurrency(loan);
  document.getElementById('totalBalance').textContent = formatCurrency(balance);

  const isYear = state.viewMode === 'year';
  const periodLabel = document.getElementById('periodLabel');
  if (periodLabel) periodLabel.textContent = isYear ? 'entradas este ano' : 'entradas no período';

  const dailyTitle = document.getElementById('dailyChartTitle');
  const dailyBadge = document.getElementById('dailyChartBadge');
  if (dailyTitle) dailyTitle.textContent = isYear ? 'Despesas Mensais' : 'Despesas Diárias';
  if (dailyBadge) dailyBadge.textContent = isYear ? 'Visão Anual' : 'Últimos 30 dias';

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
      if (t.type === 'income') incomeData[month] += t.amount;
      else if (t.type === 'expense' || t.type === 'investment' || t.type === 'loan') expenseData[month] += t.amount;
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
      if (t.type === 'income') incomeData[day] += t.amount;
      else if (t.type === 'expense' || t.type === 'investment' || t.type === 'loan') expenseData[day] += t.amount;
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

  const expenses = transactions.filter(t => t.type === 'expense' || t.type === 'investment' || t.type === 'loan');
  const catTotals = {};

  expenses.forEach(t => {
    catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
  });

  const sortedCats = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
  const labels = sortedCats.map(([k]) => getCategory(k).name);
  const data = sortedCats.map(([, v]) => v);
  const bgColors = sortedCats.map(([k]) => getCategory(k).color || '#6b7280');

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
    expenseData.push(monthTx.filter(t => t.type === 'expense' || t.type === 'investment' || t.type === 'loan').reduce((a, t) => a + t.amount, 0));
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
    const expense = monthTx.filter(t => t.type === 'expense' || t.type === 'investment' || t.type === 'loan').reduce((a, t) => a + t.amount, 0);
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
  const cat = getCategory(t.category);
  const isIncome = t.type === 'income';
  const amountClass = isIncome ? 'income' : 'expense';
  const amountPrefix = isIncome ? '+ ' : '- ';
  const parcelasInfo = (t.parcelas && t.parcelaAtual) ? ` (${t.parcelaAtual}/${t.parcelas})` : (t.parcelas ? ` (${t.parcelas} parcelas)` : '');

  return `
    <div class="transaction-item" data-id="${t.id}">
      <div class="transaction-icon" style="background: ${cat.color}15; color: ${cat.color};">
        <i class="${cat.icon}"></i>
      </div>
      <div class="transaction-info">
        <div class="transaction-name">${t.name}</div>
        <div class="transaction-category">${cat.name}${parcelasInfo}</div>
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
  const transactions = getFilteredTransactions();
  const catTotals = {};
  const allCats = getAllCategories();

  transactions.forEach(t => {
    catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
  });

  const typeOrder = ['income', 'investment', 'expense', 'loan'];
  const typeLabels = { income: 'Receita', investment: 'Investimento', expense: 'Despesa', loan: 'Empréstimo' };
  let html = '';

  typeOrder.forEach(type => {
    const cats = Object.entries(allCats).filter(([k, v]) => (v.type === type) || (type === 'expense' && k === 'others'));
    if (cats.length === 0) return;
    html += `<div class="categories-section-title">${typeLabels[type]}</div>`;
    html += `<div class="categories-section-grid">`;
    cats.forEach(([key, cat]) => {
      const total = catTotals[key] || 0;
      const count = transactions.filter(t => t.category === key).length;
      const canDelete = isCustomCategory(key);
      const deleteBtn = canDelete
        ? `<button type="button" class="btn-delete-category" data-category="${key}" title="Excluir categoria" aria-label="Excluir categoria"><i class="ri-delete-bin-line"></i></button>`
        : '';
      const amountColor = type === 'income' ? 'var(--color-income)' : (total > 0 ? 'var(--color-expense)' : 'var(--text-muted)');
      html += `
      <div class="category-card" style="${canDelete ? 'position: relative;' : ''}">
        ${deleteBtn}
        <div class="category-icon-large" style="background: ${cat.color}15; color: ${cat.color};">
          <i class="${cat.icon}"></i>
        </div>
        <div class="category-details">
          <h4>${cat.name}</h4>
          <span>${count} transações</span>
        </div>
        <div class="category-amount" style="color: ${amountColor};">
          ${formatCurrency(total)}
        </div>
      </div>`;
    });
    html += `</div>`;
  });

  html += `
    <div class="categories-section-title" style="margin-top: 16px;">Outros</div>
    <div class="categories-section-grid">
      <div class="category-card" style="border: 2px dashed var(--border-color); background: transparent; cursor: pointer;" id="btnAddCategoryCard" title="Adicionar nova categoria">
        <div class="category-icon-large" style="background: var(--accent-primary)15; color: var(--accent-primary);">
          <i class="ri-add-line"></i>
        </div>
        <div class="category-details">
          <h4>Adicionar categoria</h4>
          <span>Incluir nova categoria personalizada</span>
        </div>
      </div>
    </div>`;

  container.innerHTML = html;

  container.querySelectorAll('.btn-delete-category').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteCustomCategory(btn.getAttribute('data-category'));
    });
  });

  document.getElementById('btnAddCategoryCard')?.addEventListener('click', () => {
    openNewCategoryModal();
  });
}

function openNewCategoryModal() {
  document.getElementById('newCategoryName').value = '';
  document.querySelectorAll('#newCategoryOverlay .type-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.type === 'expense');
  });
  document.getElementById('newCategoryOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('newCategoryName').focus(), 200);
}

function closeNewCategoryModal() {
  document.getElementById('newCategoryOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

function getNewCategoryType() {
  const btn = document.querySelector('#newCategoryOverlay .type-btn.active');
  return (btn && btn.dataset.type) ? btn.dataset.type : 'expense';
}

function saveNewCategoryFromModal() {
  const name = document.getElementById('newCategoryName').value.trim();
  if (!name) {
    showToast('Digite o nome da categoria', 'error');
    return;
  }
  const type = getNewCategoryType();
  addCustomCategory(name, type);
  const typeLabels = { income: 'Receita', expense: 'Despesa', investment: 'Investimento', loan: 'Empréstimo' };
  showToast(`Categoria "${name}" adicionada em ${typeLabels[type]}!`, 'success');
  closeNewCategoryModal();
  renderCategories();
}

// ===== Reports =====
function updateReports() {
  const transactions = getFilteredTransactions();
  const expenses = transactions.filter(t => t.type === 'expense' || t.type === 'investment' || t.type === 'loan');

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
  document.getElementById('topCategory').textContent = topCat ? getCategory(topCat[0]).name : '-';

  // Budget progress
  renderBudgetProgress(catTotals);
}

function renderBudgetProgress(catTotals) {
  const container = document.getElementById('budgetList');
  const allCats = getAllCategories();
  const budgetCats = Object.entries(allCats).filter(([, v]) => v.budget > 0);

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
  populateCategorySelects();

  const parcelasWrap = document.getElementById('modalParcelasWrap');
  const novaWrap = document.getElementById('modalNovaCategoriaWrap');
  if (parcelasWrap) parcelasWrap.style.display = 'none';
  if (novaWrap) novaWrap.style.display = 'none';

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
      if (document.getElementById('modalParcelasTotal')) document.getElementById('modalParcelasTotal').value = t.parcelas || '';
      if (document.getElementById('modalParcelaAtual')) document.getElementById('modalParcelaAtual').value = t.parcelaAtual || '';
      setModalType(t.type);
      if (isLoanCategory(t.category)) {
        if (parcelasWrap) parcelasWrap.style.display = 'block';
      }
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
  const types = ['income', 'investment', 'expense', 'loan'];
  types.forEach(t => {
    const btn = document.getElementById('modalType' + t.charAt(0).toUpperCase() + t.slice(1));
    if (btn) {
      btn.classList.toggle('active', t === type);
      btn.dataset.selected = t === type;
    }
  });
  const parcelasWrap = document.getElementById('modalParcelasWrap');
  const novaWrap = document.getElementById('modalNovaCategoriaWrap');
  if (parcelasWrap) parcelasWrap.style.display = type === 'loan' ? 'block' : 'none';
  if (novaWrap) novaWrap.style.display = 'none';
}

function getModalType() {
  const btn = document.querySelector('#modalOverlay .type-btn.active');
  return (btn && btn.dataset.type) ? btn.dataset.type : 'expense';
}

function getPageType() {
  const btn = document.querySelector('#page-add-expense .type-btn.active');
  return (btn && btn.dataset.type) ? btn.dataset.type : 'expense';
}

function setPageType(type) {
  const types = ['income', 'investment', 'expense', 'loan'];
  types.forEach(t => {
    const btn = document.getElementById('pageType' + t.charAt(0).toUpperCase() + t.slice(1));
    if (btn) btn.classList.toggle('active', t === type);
  });
  const parcelasWrap = document.getElementById('pageParcelasWrap');
  const novaWrap = document.getElementById('pageNovaCategoriaWrap');
  if (parcelasWrap) parcelasWrap.style.display = type === 'loan' ? 'block' : 'none';
  if (novaWrap) novaWrap.style.display = 'none';
}

function saveTransaction() {
  const form = document.getElementById('expenseForm');
  const name = document.getElementById('modalName').value.trim();
  const amount = parseFloat(document.getElementById('modalAmount').value);
  const date = document.getElementById('modalDate').value;
  let category = document.getElementById('modalCategory').value;
  const notes = document.getElementById('modalNotes').value.trim();
  const type = getModalType();

  if (category === '__nova_categoria__') {
    const novaNome = document.getElementById('modalNovaCategoriaNome')?.value?.trim();
    if (!novaNome) {
      showToast('Digite o nome da nova categoria', 'error');
      return;
    }
    category = addCustomCategory(novaNome, type);
    document.getElementById('modalNovaCategoriaWrap').style.display = 'none';
    document.getElementById('modalNovaCategoriaNome').value = '';
  }

  if (!name || !amount || !date || !category) {
    showToast('Preencha todos os campos obrigatórios', 'error');
    return;
  }

  let parcelas, parcelaAtual;
  if (isLoanCategory(category)) {
    parcelas = parseInt(document.getElementById('modalParcelasTotal')?.value, 10) || null;
    parcelaAtual = parseInt(document.getElementById('modalParcelaAtual')?.value, 10) || null;
  }

  if (state.editingId) {
    const idx = state.transactions.findIndex(t => t.id === state.editingId);
    if (idx !== -1) {
      state.transactions[idx] = { ...state.transactions[idx], name, amount, date, category, notes, type, parcelas: parcelas || undefined, parcelaAtual: parcelaAtual || undefined };
      showToast('Transação atualizada com sucesso!', 'success');
    }
  } else {
    state.transactions.push({
      id: Date.now(),
      name,
      amount,
      type,
      category,
      date,
      notes,
      parcelas: parcelas || undefined,
      parcelaAtual: parcelaAtual || undefined,
    });
    showToast('Transação adicionada com sucesso!', 'success');
  }

  saveData();
  closeModal();
  updateAll();
}

// ===== Page Form =====
function handlePageFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('pageName').value.trim();
  const amount = parseFloat(document.getElementById('pageAmount').value);
  const date = document.getElementById('pageDate').value;
  let category = document.getElementById('pageCategory').value;
  const notes = document.getElementById('pageNotes').value.trim();
  const type = getPageType();

  if (category === '__nova_categoria__') {
    const novaNome = document.getElementById('pageNovaCategoriaNome')?.value?.trim();
    if (!novaNome) {
      showToast('Digite o nome da nova categoria', 'error');
      return;
    }
    category = addCustomCategory(novaNome, type);
    const wrap = document.getElementById('pageNovaCategoriaWrap');
    if (wrap) wrap.style.display = 'none';
    const input = document.getElementById('pageNovaCategoriaNome');
    if (input) input.value = '';
  }

  if (!name || !amount || !date || !category) {
    showToast('Preencha todos os campos obrigatórios', 'error');
    return;
  }

  let parcelas, parcelaAtual;
  if (isLoanCategory(category)) {
    parcelas = parseInt(document.getElementById('pageParcelasTotal')?.value, 10) || null;
    parcelaAtual = parseInt(document.getElementById('pageParcelaAtual')?.value, 10) || null;
  }

  state.transactions.push({
    id: Date.now(),
    name,
    amount,
    type,
    category,
    date,
    notes,
    parcelas: parcelas || undefined,
    parcelaAtual: parcelaAtual || undefined,
  });

  saveData();
  showToast('Transação adicionada com sucesso!', 'success');

  document.getElementById('expenseFormPage').reset();
  setPageType('expense');
  setDefaultDates();
  populateCategorySelects();
  const pageParcelasWrap = document.getElementById('pageParcelasWrap');
  if (pageParcelasWrap) pageParcelasWrap.style.display = 'none';
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
  a.download = `gestaofinanceiragu_backup_${new Date().toISOString().split('T')[0]}.json`;
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

  const typeLabels = { income: 'Receita', expense: 'Despesa', investment: 'Investimento', loan: 'Emprestimo' };
  state.transactions.forEach(t => {
    const row = [
      t.id,
      typeLabels[t.type] || t.type,
      getCategory(t.category).name,
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
  a.download = `gestaofinanceiragu_export_${new Date().toISOString().split('T')[0]}.csv`;
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

function clearAllData() {
  if (confirm('Tem certeza que deseja limpar TODOS os dados? Esta ação não pode ser desfeita.')) {
    // Clear localStorage
    localStorage.removeItem('gestaofinanceiragu_transactions');
    localStorage.removeItem(CUSTOM_CATEGORIES_KEY);
    localStorage.removeItem('gestaofinanceiragu_theme');
    localStorage.removeItem('gestaofinanceiragu_initialized');

    // Reset state
    state.transactions = [];
    customCategories = {};
    state.theme = 'light';

    // Save empty state
    saveData();
    saveTheme();

    // Update UI
    updateAll();
    showToast('Todos os dados foram limpos!', 'info');
  }
}
