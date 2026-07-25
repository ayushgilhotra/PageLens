const STORAGE_KEY = 'pagelens_history';
const MAX_ENTRIES = 50;

export const getHistory = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data).sort((a, b) => new Date(b.analyzedAt) - new Date(a.analyzedAt));
  } catch (error) {
    console.error('Error reading history:', error);
    return [];
  }
};

export const saveToHistory = (result) => {
  try {
    const history = getHistory();
    const newEntry = {
      id: Date.now().toString(),
      url: result.url,
      domain: result.domain,
      analyzedAt: result.analyzedAt,
      httpStatus: result.httpStatus,
      responseTime: result.responseTime,
      seoScore: result.seoScore,
      pageTitle: result.pageTitle
    };
    
    const updatedHistory = [newEntry, ...history].slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    return newEntry;
  } catch (error) {
    console.error('Error saving to history:', error);
    return null;
  }
};

export const deleteFromHistory = (id) => {
  try {
    const history = getHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error('Error deleting from history:', error);
    return false;
  }
};

export const clearHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing history:', error);
    return false;
  }
};

export const searchHistory = (query) => {
  if (!query) return getHistory();
  
  const history = getHistory();
  const lowerQuery = query.toLowerCase();
  
  return history.filter(item => 
    item.url.toLowerCase().includes(lowerQuery) || 
    item.domain.toLowerCase().includes(lowerQuery)
  );
};

export const exportHistory = () => {
  const history = getHistory();
  if (history.length === 0) return '';
  
  const headers = ['Date', 'Domain', 'URL', 'Status', 'Response Time (ms)', 'SEO Score', 'Page Title'];
  
  const rows = history.map(item => {
    const date = new Date(item.analyzedAt).toLocaleString().replace(/,/g, '');
    const title = `"${(item.pageTitle || '').replace(/"/g, '""')}"`;
    return [
      date,
      item.domain,
      item.url,
      item.httpStatus,
      item.responseTime,
      item.seoScore,
      title
    ].join(',');
  });
  
  return [headers.join(','), ...rows].join('\n');
};

export const downloadHistoryCsv = () => {
  const csvString = exportHistory();
  if (!csvString) return false;
  
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `pagelens_history_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  return true;
};
