import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, Trash2, Eye, History } from 'lucide-react';
import { getHistory, deleteFromHistory, clearHistory, searchHistory, downloadHistoryCsv } from '../../services/historyService';
import './HistoryPage.css';

const HistoryPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const data = getHistory();
    setHistory(data);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this analysis record?')) {
      deleteFromHistory(id);
      loadHistory();
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all history? This cannot be undone.')) {
      clearHistory();
      loadHistory();
    }
  };

  const handleExport = () => {
    downloadHistoryCsv();
  };

  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      // Search filter
      const matchesSearch = item.url.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status filter
      let matchesStatus = true;
      if (statusFilter === 'Success (200)') {
        matchesStatus = item.status >= 200 && item.status < 300;
      } else if (statusFilter === 'Redirect (3xx)') {
        matchesStatus = item.status >= 300 && item.status < 400;
      } else if (statusFilter === 'Error (4xx/5xx)') {
        matchesStatus = item.status >= 400;
      }

      return matchesSearch && matchesStatus;
    });
  }, [history, searchQuery, statusFilter]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  const getStatusClass = (status) => {
    if (status >= 200 && status < 300) return 'history-status-success';
    if (status >= 300 && status < 400) return 'history-status-redirect';
    if (status >= 400 && status < 500) return 'history-status-error';
    return 'history-status-server-error';
  };

  const getSeoDotClass = (score) => {
    if (score === undefined || score === null) return 'seo-none';
    if (score >= 90) return 'seo-good';
    if (score >= 50) return 'seo-average';
    return 'seo-poor';
  };

  const getResponseTimeLabel = (ms) => {
    if (!ms) return '-';
    if (ms < 500) return `${ms}ms (Fast)`;
    if (ms < 1500) return `${ms}ms (Good)`;
    return `${ms}ms (Slow)`;
  };

  const getFaviconUrl = (url) => {
    try {
      const urlObj = new URL(!url.startsWith('http') ? `https://${url}` : url);
      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`;
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="history-page">
      <div className="history-header">
        <div className="history-header-content">
          <h1>Analysis History</h1>
          <p>Your recent website analyses</p>
        </div>
        
        {history.length > 0 && (
          <div className="history-header-actions">
            <button className="btn-export" onClick={handleExport}>
              <Download size={16} /> Export All
            </button>
            <button className="btn-clear" onClick={handleClearAll}>
              <Trash2 size={16} /> Clear All
            </button>
          </div>
        )}
      </div>

      {history.length > 0 ? (
        <>
          <div className="history-toolbar">
            <div className="history-search">
              <Search className="history-search-icon" />
              <input 
                type="text" 
                className="history-search-input"
                placeholder="Search by URL or domain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="history-filters">
              {['All', 'Success (200)', 'Redirect (3xx)', 'Error (4xx/5xx)'].map(filter => (
                <button
                  key={filter}
                  className={`history-filter-btn ${statusFilter === filter ? 'active' : ''}`}
                  onClick={() => setStatusFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {filteredHistory.length > 0 ? (
            <div className="history-table-container">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>URL</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Response Time</th>
                    <th>SEO Score</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredHistory.map((item) => (
                      <motion.tr 
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <td data-label="URL">
                          <div className="history-url-cell">
                            <img 
                              src={getFaviconUrl(item.url)} 
                              alt="" 
                              className="history-favicon"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                            <span className="history-url-text" title={item.url}>{item.url}</span>
                          </div>
                        </td>
                        <td data-label="Date">{formatDate(item.timestamp)}</td>
                        <td data-label="Status">
                          <span className={`history-status-badge ${getStatusClass(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td data-label="Response Time">{getResponseTimeLabel(item.responseTime)}</td>
                        <td data-label="SEO Score">
                          <div className="history-seo-score">
                            <span className={`seo-dot ${getSeoDotClass(item.seoScore)}`}></span>
                            {item.seoScore !== undefined ? item.seoScore : '-'}
                          </div>
                        </td>
                        <td data-label="Actions">
                          <div className="history-actions">
                            <button 
                              className="history-action-btn"
                              title="View Result"
                              onClick={() => navigate(`/analyze?url=${encodeURIComponent(item.url)}`)}
                            >
                              <Eye size={18} />
                            </button>
                            <button 
                              className="history-action-btn delete-btn"
                              title="Delete"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="history-empty">
              <Search size={48} className="history-empty-icon" />
              <h3>No matches found</h3>
              <p>Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          )}
        </>
      ) : (
        <div className="history-empty">
          <History size={64} className="history-empty-icon" />
          <h3>No analyses yet</h3>
          <p>Analyze your first website to see it here</p>
          <Link to="/analyze" className="btn-primary">
            Start Analyzing
          </Link>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
