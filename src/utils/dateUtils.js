export const toDateStr = (date) => date.toISOString().split('T')[0];

export const todayStr = () => toDateStr(new Date());

export const getWeekStart = () => {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d);
  monday.setDate(diff);
  return toDateStr(monday);
};

export const getMonthStart = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
};

export const getYearStart = () => `${new Date().getFullYear()}-01-01`;

export const formatDate = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const filterByDate = (items, startDate) =>
  items.filter((item) => item.date >= startDate);
