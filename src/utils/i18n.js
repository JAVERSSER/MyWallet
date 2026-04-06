export const LANGUAGES = [
  { code: 'en', flag: '🇺🇸', name: 'English' },
  { code: 'km', flag: '🇰🇭', name: 'ខ្មែរ' },
  { code: 'hi', flag: '🇮🇳', name: 'हिन्दी' },
  { code: 'zh', flag: '🇨🇳', name: '中文' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'vi', flag: '🇻🇳', name: 'Tiếng Việt' },
];

export const CURRENCIES = [
  { code: 'KHR', symbol: '៛',  flag: '🇰🇭', label: 'KHR - Riel',    decimals: 0, after: false },
  { code: 'USD', symbol: '$',  flag: '🇺🇸', label: 'USD - Dollar',  decimals: 2, after: false },
  { code: 'EUR', symbol: '€',  flag: '🇫🇷', label: 'EUR - Euro',    decimals: 2, after: true  },
  { code: 'INR', symbol: '₹',  flag: '🇮🇳', label: 'INR - Rupee',   decimals: 0, after: false },
  { code: 'CNY', symbol: '¥',  flag: '🇨🇳', label: 'CNY - Yuan',    decimals: 0, after: false },
  { code: 'VND', symbol: '₫',  flag: '🇻🇳', label: 'VND - Dong',    decimals: 0, after: true  },
];

export function getCurrency(code) {
  return CURRENCIES.find((c) => c.code === code) || CURRENCIES[0];
}

// Exchange rates relative to USD (1 USD = X of that currency)
export const EXCHANGE_RATES = {
  USD: 1,
  KHR: 4000,
  EUR: 0.92,
  INR: 83.5,
  CNY: 7.24,
  VND: 25300,
};

// Convert amount from one currency to another
export function convertAmount(amount, fromCode, toCode) {
  if (fromCode === toCode) return amount;
  const fromRate = EXCHANGE_RATES[fromCode] ?? 1;
  const toRate   = EXCHANGE_RATES[toCode]   ?? 1;
  return (amount / fromRate) * toRate;
}

export function formatAmount(amount, currency) {
  const val =
    currency.decimals === 0
      ? Math.round(amount).toLocaleString()
      : Number(amount)
          .toFixed(currency.decimals)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return currency.after ? `${val} ${currency.symbol}` : `${currency.symbol}${val}`;
}

export const translations = {
  en: {
    // summary card
    thisMonth: 'This Month', today: 'Today', thisWeek: 'This Week', records: 'Records',
    // budget
    overBudget: 'Over budget today!', spent: 'spent', budget: 'Budget', overBy: 'over by', remaining: 'remaining',
    setDailyBudget: 'Set a daily budget', budgetWarning: 'Get a warning when you overspend',
    dailyBudget: 'Daily Budget', save: 'Save', cancel: 'Cancel', editBudget: 'Edit Budget',
    // expense list
    expenses: 'Expenses', noExpenses: 'No expenses yet', tapToAdd: 'Tap + below to add one',
    newExpense: 'New Expense', editExpense: 'Edit Expense', addNote: 'Add a note… (optional)',
    addExpense: 'Add Expense', update: 'Update',
    // reports
    reports: 'Reports', yesterday: 'Yesterday', week: 'Week', month: 'Month', year: 'Year', all: 'All',
    transactions: 'transactions', whereDidItGo: 'Where did it go?',
    byCategory: 'By Category', noData: 'No data for this period', times: 'times',
    // nav & categories
    home: 'Home', food: 'Food', drink: 'Drink', fruit: 'Fruit',
    transport: 'Transport', football: 'Football', other: 'Other', recordsLabel: 'records',
    // settings
    language: 'Language', currency: 'Currency',
  },
  km: {
    // summary card
    thisMonth: 'ខែនេះ', today: 'ថ្ងៃនេះ', thisWeek: 'សប្តាហ៍នេះ', records: 'កំណត់ត្រា',
    // budget
    overBudget: 'លើសថវិការថ្ងៃនេះ!', spent: 'បានចំណាយ', budget: 'ថវិកា', overBy: 'លើស', remaining: 'នៅសល់',
    setDailyBudget: 'កំណត់ថវិការប្រចាំថ្ងៃ', budgetWarning: 'ទទួលការព្រមាន នៅពេលចំណាយលើស',
    dailyBudget: 'ថវិការប្រចាំថ្ងៃ', save: 'រក្សាទុក', cancel: 'បោះបង់', editBudget: 'កែថវិកា',
    // expense list
    expenses: 'ការចំណាយ', noExpenses: 'មិនទាន់មានការចំណាយ', tapToAdd: 'ចុច + ខាងក្រោមដើម្បីបន្ថែម',
    newExpense: 'ការចំណាយថ្មី', editExpense: 'កែការចំណាយ', addNote: 'បន្ថែមកំណត់ចំណាំ… (ស្រេចចិត្ត)',
    addExpense: 'បន្ថែមការចំណាយ', update: 'កែប្រែ',
    // reports
    reports: 'របាយការណ៍', yesterday: 'ម្សិលមិញ', week: 'សប្តាហ៍', month: 'ខែ', year: 'ឆ្នាំ', all: 'ទាំងអស់',
    transactions: 'ប្រតិបត្តិការ', whereDidItGo: 'ចំណាយទៅណា?',
    byCategory: 'តាមប្រភេទ', noData: 'គ្មានទិន្នន័យសម្រាប់រយៈពេលនេះ', times: 'ដង',
    // nav & categories
    home: 'ទំព័រដើម', food: 'អាហារ', drink: 'ភេសជ្ជៈ', fruit: 'ផ្លែឈើ',
    transport: 'ដឹកជញ្ជូន', football: 'បាល់ទាត់', other: 'ផ្សេងៗ', recordsLabel: 'កំណត់ត្រា',
    // settings
    language: 'ភាសា', currency: 'រូបិយប័ណ្ណ',
  },
  hi: {
    // summary card
    thisMonth: 'इस महीने', today: 'आज', thisWeek: 'इस हफ़्ते', records: 'रिकॉर्ड',
    // budget
    overBudget: 'आज बजट पार हो गया!', spent: 'खर्च हुआ', budget: 'बजट', overBy: 'अधिक', remaining: 'बचा हुआ',
    setDailyBudget: 'दैनिक बजट तय करें', budgetWarning: 'ज़्यादा खर्च पर अलर्ट पाएं',
    dailyBudget: 'दैनिक बजट', save: 'सेव करें', cancel: 'रद्द करें', editBudget: 'बजट बदलें',
    // expense list
    expenses: 'खर्चे', noExpenses: 'अभी कोई खर्च नहीं', tapToAdd: 'नीचे + दबाकर जोड़ें',
    newExpense: 'नया खर्च', editExpense: 'खर्च संपादित करें', addNote: 'नोट जोड़ें… (वैकल्पिक)',
    addExpense: 'खर्च जोड़ें', update: 'अपडेट करें',
    // reports
    reports: 'रिपोर्ट', yesterday: 'बीता कल', week: 'सप्ताह', month: 'महीना', year: 'साल', all: 'सभी',
    transactions: 'लेनदेन', whereDidItGo: 'पैसे कहाँ गए?',
    byCategory: 'श्रेणी के अनुसार', noData: 'इस अवधि का कोई डेटा नहीं', times: 'बार',
    // nav & categories
    home: 'होम', food: 'खाना', drink: 'पेय पदार्थ', fruit: 'फल',
    transport: 'परिवहन', football: 'फुटबॉल', other: 'अन्य', recordsLabel: 'रिकॉर्ड',
    // settings
    language: 'भाषा', currency: 'मुद्रा',
  },
  zh: {
    // summary card
    thisMonth: '本月', today: '今天', thisWeek: '本周', records: '记录',
    // budget
    overBudget: '今日超出预算！', spent: '已花费', budget: '预算', overBy: '超出', remaining: '剩余',
    setDailyBudget: '设置每日预算', budgetWarning: '超支时收到提醒',
    dailyBudget: '每日预算', save: '保存', cancel: '取消', editBudget: '编辑预算',
    // expense list
    expenses: '支出记录', noExpenses: '暂无支出', tapToAdd: '点击下方 + 添加',
    newExpense: '新增支出', editExpense: '编辑支出', addNote: '添加备注…（可选）',
    addExpense: '添加支出', update: '更新',
    // reports
    reports: '报表', yesterday: '昨天', week: '本周', month: '本月', year: '本年', all: '全部',
    transactions: '笔交易', whereDidItGo: '钱花在哪了？',
    byCategory: '按类别', noData: '该时段暂无数据', times: '次',
    // nav & categories
    home: '主页', food: '餐饮', drink: '饮料', fruit: '水果',
    transport: '交通', football: '足球', other: '其他', recordsLabel: '条记录',
    // settings
    language: '语言', currency: '货币',
  },
  fr: {
    // summary card
    thisMonth: 'Ce mois-ci', today: "Aujourd'hui", thisWeek: 'Cette semaine', records: 'Entrées',
    // budget
    overBudget: 'Budget dépassé aujourd\'hui !', spent: 'dépensé', budget: 'Budget', overBy: 'dépassé de', remaining: 'restant',
    setDailyBudget: 'Définir un budget quotidien', budgetWarning: 'Alerte en cas de dépassement',
    dailyBudget: 'Budget quotidien', save: 'Enregistrer', cancel: 'Annuler', editBudget: 'Modifier le budget',
    // expense list
    expenses: 'Dépenses', noExpenses: 'Aucune dépense pour l\'instant', tapToAdd: 'Appuyez sur + ci-dessous',
    newExpense: 'Nouvelle dépense', editExpense: 'Modifier la dépense', addNote: 'Ajouter une note… (optionnel)',
    addExpense: 'Ajouter la dépense', update: 'Mettre à jour',
    // reports
    reports: 'Rapports', yesterday: 'Hier', week: 'Semaine', month: 'Mois', year: 'Année', all: 'Tout',
    transactions: 'transactions', whereDidItGo: 'Où va l\'argent ?',
    byCategory: 'Par catégorie', noData: 'Aucune donnée pour cette période', times: 'fois',
    // nav & categories
    home: 'Accueil', food: 'Alimentation', drink: 'Boisson', fruit: 'Fruits',
    transport: 'Transport', football: 'Football', other: 'Autre', recordsLabel: 'entrées',
    // settings
    language: 'Langue', currency: 'Devise',
  },
  vi: {
    // summary card
    thisMonth: 'Tháng này', today: 'Hôm nay', thisWeek: 'Tuần này', records: 'Giao dịch',
    // budget
    overBudget: 'Vượt ngân sách hôm nay!', spent: 'đã chi', budget: 'Ngân sách', overBy: 'vượt', remaining: 'còn lại',
    setDailyBudget: 'Đặt ngân sách hàng ngày', budgetWarning: 'Cảnh báo khi chi tiêu vượt mức',
    dailyBudget: 'Ngân sách ngày', save: 'Lưu lại', cancel: 'Hủy bỏ', editBudget: 'Sửa ngân sách',
    // expense list
    expenses: 'Chi tiêu', noExpenses: 'Chưa có khoản chi nào', tapToAdd: 'Nhấn + bên dưới để thêm',
    newExpense: 'Thêm chi tiêu', editExpense: 'Sửa chi tiêu', addNote: 'Thêm ghi chú… (tùy chọn)',
    addExpense: 'Thêm chi tiêu', update: 'Cập nhật',
    // reports
    reports: 'Báo cáo', yesterday: 'Hôm qua', week: 'Tuần', month: 'Tháng', year: 'Năm', all: 'Tất cả',
    transactions: 'giao dịch', whereDidItGo: 'Tiền đi đâu?',
    byCategory: 'Theo danh mục', noData: 'Không có dữ liệu cho kỳ này', times: 'lần',
    // nav & categories
    home: 'Trang chủ', food: 'Ăn uống', drink: 'Đồ uống', fruit: 'Trái cây',
    transport: 'Di chuyển', football: 'Bóng đá', other: 'Khác', recordsLabel: 'giao dịch',
    // settings
    language: 'Ngôn ngữ', currency: 'Tiền tệ',
  },
};
