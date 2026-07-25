import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, RotateCcw, Download, Share2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import UrlInput from '../../components/UrlInput/UrlInput';
import StatusCard from '../../components/Results/StatusCard';
import ResponseTimeCard from '../../components/Results/ResponseTimeCard';
import SeoScoreCard from '../../components/Results/SeoScoreCard';
import PageTitleCard from '../../components/Results/PageTitleCard';
import WordCountCard from '../../components/Results/WordCountCard';
import MetaDescriptionCard from '../../components/Results/MetaDescriptionCard';
import HeadingsCard from '../../components/Results/HeadingsCard';
import ImagesCard from '../../components/Results/ImagesCard';
import WebsitePreviewCard from '../../components/Results/WebsitePreviewCard';
import { analyzeWebsite } from '../../services/analyzeService';
import { saveToHistory } from '../../services/historyService';
import './AnalyzePage.css';

const LOADING_STEPS = [
  'Connecting to server...',
  'Reading HTML content...',
  'Scanning metadata...',
  'Counting headings...',
  'Inspecting images...',
  'Calculating SEO score...',
  'Preparing report...'
];

export default function AnalyzePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  useEffect(() => {
    const urlParam = searchParams.get('url');
    if (urlParam && !loading && !result && !error) {
      setInputValue(urlParam);
      handleAnalyze(urlParam);
    }
  }, [searchParams]);

  const handleShareReport = async () => {
    if (!result) return;
    const shareTitle = 'PageLens Website Analysis Report';
    const shareText = `Website Analysis Report\n\nWebsite: ${result.url}\nSEO Score: ${result.seoScore}\nGrade: ${result.seoGrade}\n\nGenerated using PageLens`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: result.url
        });
        return;
      } catch (err) {
        if (err.name !== 'AbortError') copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setToastMessage('Report copied to clipboard.');
    }).catch(() => {
      setToastMessage('Failed to copy report.');
    });
  };

  const handleDownloadReport = () => {
    if (!result) return;
    const doc = new jsPDF();
    const domain = result.domain || new URL(result.url.startsWith('http') ? result.url : `https://${result.url}`).hostname;
    
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('PageLens Website Analysis Report', 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Analyzed URL: ${result.url}`, 14, 36);
    
    autoTable(doc, {
      startY: 45,
      head: [['Metric', 'Result']],
      body: [
        ['HTTP Status', result.httpStatus],
        ['Response Time', `${result.responseTime}ms`],
        ['SEO Score', `${result.seoScore}/100`],
        ['SEO Grade', result.seoGrade]
      ],
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] }
    });
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Content Metadata', 'Value']],
      body: [
        ['Page Title', result.pageTitle || 'N/A'],
        ['Meta Description', result.metaDescription ? (result.metaDescription.length > 50 ? result.metaDescription.substring(0, 50) + '...' : result.metaDescription) : 'N/A'],
        ['Word Count', result.wordCount || 0],
        ['Language', result.seoBreakdown?.language || result.language || 'N/A'],
        ['Charset', result.seoBreakdown?.charset || result.charset || 'N/A']
      ],
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] }
    });
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Technical SEO', 'Status']],
      body: [
        ['HTTPS Enabled', result.seoBreakdown?.https ? 'Yes' : 'No'],
        ['Viewport Meta', result.seoBreakdown?.viewport ? 'Yes' : 'No'],
        ['Robots.txt', result.seoBreakdown?.robots ? 'Yes' : 'No'],
        ['Sitemap', result.seoBreakdown?.sitemap ? 'Yes' : 'No']
      ],
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] }
    });
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Page Elements', 'Analysis']],
      body: [
        ['Headings', `H1: ${result.headings?.h1Count || 0} | H2: ${result.headings?.h2Count || 0} | H3: ${result.headings?.h3Count || 0}`],
        ['Images', `Total: ${result.images?.totalImages || 0} | Missing Alt: ${result.images?.imagesMissingAlt || 0}`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] }
    });
    
    doc.save(`pagelens-report-${domain}.pdf`);
  };

  const handleAnalyze = async (targetUrl) => {
    const urlToAnalyze = targetUrl || inputValue;
    if (!urlToAnalyze || !urlToAnalyze.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setProgress(0);
    setCurrentStepIndex(0);
    setUrl(urlToAnalyze.trim());

    if (searchParams.get('url') !== urlToAnalyze.trim()) {
      setSearchParams({ url: urlToAnalyze.trim() });
    }

    try {
      const data = await analyzeWebsite(urlToAnalyze.trim(), (stepIdx, prog) => {
        setCurrentStepIndex(stepIdx);
        setProgress(prog !== undefined ? prog : Math.min(100, ((stepIdx + 1) / LOADING_STEPS.length) * 100));
      });
      setResult(data);
      saveToHistory(data);
    } catch (err) {
      setError(err.message || 'An error occurred during analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setUrl('');
    setInputValue('');
    setSearchParams({});
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  };

  return (
    <div className="analyze-page">
      {/* Empty State */}
      {!loading && !result && !error && (
        <div className="analyze-empty">
          <h1 className="analyze-empty-title">Analyze Website</h1>
          <p className="analyze-empty-subtitle">Enter a website URL to analyze</p>
          <div className="analyze-empty-input">
            <UrlInput 
              value={inputValue} 
              onChange={setInputValue} 
              onSubmit={handleAnalyze} 
              size="large" 
            />
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="analyze-loading">
          <h2 className="analyze-loading-title">Analyzing Website</h2>
          <p className="analyze-loading-url">{url}</p>
          
          <div className="analyze-progress-bar">
            <div 
              className="analyze-progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>

          <ul className="analyze-steps">
            <AnimatePresence>
              {LOADING_STEPS.map((step, index) => {
                if (index > currentStepIndex) return null;
                
                const isComplete = index < currentStepIndex;
                const isActive = index === currentStepIndex;

                return (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`analyze-step ${isActive ? 'analyze-step--active' : ''} ${isComplete ? 'analyze-step--complete' : ''}`}
                  >
                    <div className="analyze-step-dot">
                      {isComplete && <Check size={14} strokeWidth={3} />}
                      {isActive && (
                        <motion.div
                          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }}
                        />
                      )}
                    </div>
                    <span className="analyze-step-text">{step}</span>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="analyze-error">
          <div className="analyze-error-icon">
            <AlertCircle size={28} />
          </div>
          <h2 className="analyze-loading-title">Analysis Failed</h2>
          <p className="analyze-empty-subtitle">{error}</p>
          <button className="results-btn results-btn--primary" onClick={handleReset} style={{ margin: '0 auto' }}>
            <RotateCcw size={16} />
            Try Again
          </button>
        </div>
      )}

      {/* Results Dashboard */}
      {result && !loading && !error && (
        <motion.div 
          className="results-container"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <div className="results-header">
            <div className="results-header-info">
              <h2>{result.domain || (url ? new URL(url.startsWith('http') ? url : `https://${url}`).hostname : '')}</h2>
              <p>{url} • Analyzed just now</p>
            </div>
            <div className="results-actions">
              <button className="results-btn results-btn--outline" onClick={handleReset}>
                <RotateCcw size={16} />
                Analyze Another
              </button>
              <button className="results-btn results-btn--outline" onClick={handleShareReport}>
                <Share2 size={16} />
                Share
              </button>
              <button className="results-btn results-btn--primary" onClick={handleDownloadReport}>
                <Download size={16} />
                Download Report
              </button>
            </div>
          </div>

          <div className="results-grid">
            <motion.div variants={itemVariants} className="span-1">
              <StatusCard status={result.httpStatus} url={result.url} />
            </motion.div>
            <motion.div variants={itemVariants} className="span-1">
              <ResponseTimeCard time={result.responseTime} />
            </motion.div>
            <motion.div variants={itemVariants} className="span-1">
              <SeoScoreCard 
                score={result.seoScore} 
                grade={result.seoGrade} 
                breakdown={[
                  { label: 'HTTPS Enabled', passed: result.seoBreakdown?.https ?? false },
                  { label: 'Meta Description', passed: result.seoBreakdown?.metaDescription ?? false },
                  { label: 'Single H1 Tag', passed: result.seoBreakdown?.singleH1 ?? false },
                  { label: 'Image Alt Texts', passed: result.seoBreakdown?.imageAlt ?? false },
                  { label: 'Content Length', passed: result.seoBreakdown?.contentLength ?? false },
                  { label: 'Viewport Meta', passed: result.seoBreakdown?.viewport ?? false },
                  { label: 'Charset Declared', passed: result.seoBreakdown?.charset ?? false },
                  { label: 'Robots Meta', passed: result.seoBreakdown?.robots ?? false },
                  { label: 'Sitemap Found', passed: result.seoBreakdown?.sitemap ?? false }
                ]} 
              />
            </motion.div>
            
            <motion.div variants={itemVariants} className="span-1">
              <PageTitleCard title={result.pageTitle} />
            </motion.div>
            <motion.div variants={itemVariants} className="span-1">
              <WordCountCard count={result.wordCount} />
            </motion.div>
            <motion.div variants={itemVariants} className="span-2">
              <MetaDescriptionCard description={result.metaDescription} />
            </motion.div>

            <motion.div variants={itemVariants} className="span-1">
              <HeadingsCard 
                headings={{ 
                  h1: result.headings?.h1Count || 0, 
                  h2: result.headings?.h2Count || 0, 
                  h3: result.headings?.h3Count || 0, 
                  h4: result.headings?.h4Count || 0 
                }} 
                h1Text={result.headings?.h1Text} 
              />
            </motion.div>
            <motion.div variants={itemVariants} className="span-1">
              <ImagesCard 
                images={{ 
                  total: result.images?.totalImages || 0, 
                  missingAlt: result.images?.imagesMissingAlt || 0, 
                  withAlt: result.images?.imagesWithAlt || 0 
                }} 
              />
            </motion.div>

            <motion.div variants={itemVariants} className="span-3">
              <WebsitePreviewCard url={result.url} />
            </motion.div>
          </div>
        </motion.div>
      )}
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            className="toast-notification"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <Check size={16} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
