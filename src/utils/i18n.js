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
    thisMonth: 'This Month', today: 'Today', thisWeek: 'This Week', records: 'Records',
    overBudget: 'Over budget today!', spent: 'spent', budget: 'Budget',
    setDailyBudget: 'Set a daily budget', budgetWarning: 'Get a warning when you overspend',
    dailyBudget: 'Daily Budget', save: 'Save', cancel: 'Cancel', editBudget: 'Edit budget',
    expenses: 'Expenses', noExpenses: 'No expenses yet', tapToAdd: 'Tap + below to add one',
    newExpense: 'New Expense', editExpense: 'Edit Expense', addNote: 'Add a note... (optional)',
    addExpense: 'Add Expense', update: 'Update', reports: 'Reports',
    week: 'Week', month: 'Month', year: 'Year', all: 'All',
    transactions: 'transactions', whereDidItGo: 'Where did it go?',
    byCategory: 'By Category', noData: 'No data for this period', times: 'times',
    home: 'Home', food: 'Food', drink: 'Drink', fruit: 'Fruit',
    transport: 'Transport', football: 'Football', other: 'Other', recordsLabel: 'records',
    language: 'Language', currency: 'Currency',
  },
  km: {
    thisMonth: 'ខែនេះ', today: 'ថ្ងៃនេះ', thisWeek: 'សប្តាហ៍នេះ', records: 'កំណត់ត្រា',
    overBudget: 'លើសថវិការថ្ងៃនេះ!', spent: 'បានចំណាយ', budget: 'ថវិកា',
    setDailyBudget: 'កំណត់ថវិការប្រចាំថ្ងៃ', budgetWarning: 'ទទួលការព្រមានពេលចំណាយច្រើន',
    dailyBudget: 'ថវិការប្រចាំថ្ងៃ', save: 'រក្សាទុក', cancel: 'បោះបង់', editBudget: 'កែថវិកា',
    expenses: 'ការចំណាយ', noExpenses: 'មិនទាន់មានការចំណាយ', tapToAdd: 'ចុច + ដើម្បីបន្ថែម',
    newExpense: 'ការចំណាយថ្មី', editExpense: 'កែការចំណាយ', addNote: 'បន្ថែមកំណត់ចំណាំ...',
    addExpense: 'បន្ថែមការចំណាយ', update: 'កែប្រែ', reports: 'របាយការណ៍',
    week: 'សប្តាហ៍', month: 'ខែ', year: 'ឆ្នាំ', all: 'ទាំងអស់',
    transactions: 'ប្រតិបត្តិការ', whereDidItGo: 'ចំណាយទៅណា?',
    byCategory: 'តាមប្រភេទ', noData: 'គ្មានទិន្នន័យ', times: 'ដង',
    home: 'ទំព័រដើម', food: 'អាហារ', drink: 'ភេសជ្ជៈ', fruit: 'ផ្លែឈើ',
    transport: 'ដឹកជញ្ជូន', football: 'បាល់ទាត់', other: 'ផ្សេងៗ', recordsLabel: 'កំណត់ត្រា',
    language: 'ភាសា', currency: 'រូបិយប័ណ្ណ',
  },
  hi: {
    thisMonth: 'इस महीने', today: 'आज', thisWeek: 'इस सप्ताह', records: 'रिकॉर्ड',
    overBudget: 'बजट से अधिक!', spent: 'खर्च', budget: 'बजट',
    setDailyBudget: 'दैनिक बजट सेट करें', budgetWarning: 'अधिक खर्च पर चेतावनी पाएं',
    dailyBudget: 'दैनिक बजट', save: 'सहेजें', cancel: 'रद्द', editBudget: 'बजट बदलें',
    expenses: 'खर्चे', noExpenses: 'अभी कोई खर्च नहीं', tapToAdd: '+ दबाएं',
    newExpense: 'नया खर्च', editExpense: 'खर्च बदलें', addNote: 'नोट जोड़ें... (वैकल्पिक)',
    addExpense: 'खर्च जोड़ें', update: 'अपडेट', reports: 'रिपोर्ट',
    week: 'सप्ताह', month: 'महीना', year: 'साल', all: 'सभी',
    transactions: 'लेनदेन', whereDidItGo: 'पैसे कहाँ गए?',
    byCategory: 'श्रेणी के अनुसार', noData: 'कोई डेटा नहीं', times: 'बार',
    home: 'होम', food: 'खाना', drink: 'पेय', fruit: 'फल',
    transport: 'परिवहन', football: 'फुटबॉल', other: 'अन्य', recordsLabel: 'रिकॉर्ड',
    language: 'भाषा', currency: 'मुद्रा',
  },
  zh: {
    thisMonth: '本月', today: '今天', thisWeek: '本周', records: '记录',
    overBudget: '超出预算！', spent: '已花费', budget: '预算',
    setDailyBudget: '设置每日预算', budgetWarning: '超支时获得提醒',
    dailyBudget: '每日预算', save: '保存', cancel: '取消', editBudget: '编辑预算',
    expenses: '支出', noExpenses: '暂无支出', tapToAdd: '点击+添加',
    newExpense: '新支出', editExpense: '编辑支出', addNote: '添加备注…（可选）',
    addExpense: '添加支出', update: '更新', reports: '报告',
    week: '周', month: '月', year: '年', all: '全部',
    transactions: '笔交易', whereDidItGo: '花在哪了？',
    byCategory: '按类别', noData: '本期无数据', times: '次',
    home: '主页', food: '食物', drink: '饮料', fruit: '水果',
    transport: '交通', football: '足球', other: '其他', recordsLabel: '条记录',
    language: '语言', currency: '货币',
  },
  fr: {
    thisMonth: 'Ce mois-ci', today: "Aujourd'hui", thisWeek: 'Cette semaine', records: 'Enreg.',
    overBudget: 'Budget dépassé !', spent: 'dépensé', budget: 'Budget',
    setDailyBudget: 'Définir un budget quotidien', budgetWarning: 'Alerte si dépassement',
    dailyBudget: 'Budget quotidien', save: 'Sauvegarder', cancel: 'Annuler', editBudget: 'Modifier',
    expenses: 'Dépenses', noExpenses: 'Aucune dépense', tapToAdd: 'Appuyez sur + pour ajouter',
    newExpense: 'Nouvelle dépense', editExpense: 'Modifier', addNote: 'Ajouter une note… (optionnel)',
    addExpense: 'Ajouter', update: 'Mettre à jour', reports: 'Rapports',
    week: 'Semaine', month: 'Mois', year: 'Année', all: 'Tout',
    transactions: 'transactions', whereDidItGo: "Où va l'argent ?",
    byCategory: 'Par catégorie', noData: 'Aucune donnée', times: 'fois',
    home: 'Accueil', food: 'Alimentation', drink: 'Boisson', fruit: 'Fruits',
    transport: 'Transport', football: 'Football', other: 'Autre', recordsLabel: 'enreg.',
    language: 'Langue', currency: 'Devise',
  },
  vi: {
    thisMonth: 'Tháng này', today: 'Hôm nay', thisWeek: 'Tuần này', records: 'Giao dịch',
    overBudget: 'Vượt ngân sách!', spent: 'đã chi', budget: 'Ngân sách',
    setDailyBudget: 'Đặt ngân sách hàng ngày', budgetWarning: 'Nhận cảnh báo khi vượt',
    dailyBudget: 'Ngân sách ngày', save: 'Lưu', cancel: 'Hủy', editBudget: 'Sửa ngân sách',
    expenses: 'Chi tiêu', noExpenses: 'Chưa có chi tiêu', tapToAdd: 'Nhấn + để thêm',
    newExpense: 'Chi tiêu mới', editExpense: 'Sửa chi tiêu', addNote: 'Thêm ghi chú… (tùy chọn)',
    addExpense: 'Thêm chi tiêu', update: 'Cập nhật', reports: 'Báo cáo',
    week: 'Tuần', month: 'Tháng', year: 'Năm', all: 'Tất cả',
    transactions: 'giao dịch', whereDidItGo: 'Tiền đi đâu?',
    byCategory: 'Theo danh mục', noData: 'Không có dữ liệu', times: 'lần',
    home: 'Trang chủ', food: 'Thức ăn', drink: 'Đồ uống', fruit: 'Trái cây',
    transport: 'Di chuyển', football: 'Bóng đá', other: 'Khác', recordsLabel: 'giao dịch',
    language: 'Ngôn ngữ', currency: 'Tiền tệ',
  },
};
