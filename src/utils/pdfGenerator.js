import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// --- Design System: Sage & Sand ---
const COLORS = {
  primaryAccent: [107, 143, 113],    // #6B8F71
  secondaryAccent: [163, 177, 138],  // #A3B18A
  bg: [250, 249, 246],               // #FAF9F6
  sectionBg: [243, 245, 242],        // #F3F5F2
  textPrimary: [47, 62, 52],         // #2F3E34
  textSecondary: [92, 107, 96],      // #5C6B60
  border: [218, 223, 216],           // #DADFD8
  success: [79, 125, 87],            // #4F7D57
  warning: [196, 154, 58],           // #C49A3A
  error: [184, 92, 92]               // #B85C5C
};

const PAGE_MARGIN = 20;

export const generatePdfReport = (result) => {
  if (!result) return;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const domain = result.domain || new URL(result.url.startsWith('http') ? result.url : `https://${result.url}`).hostname;
  
  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = PAGE_MARGIN;

  // --- Helpers ---
  const addText = (text, x, y, size, color, font = 'helvetica', style = 'normal', align = 'left') => {
    doc.setFont(font, style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
    doc.text(text, x, y, { align });
  };

  const addRoundedRect = (x, y, w, h, r, fillColor, borderColor) => {
    if (fillColor) {
      doc.setFillColor(...fillColor);
      doc.roundedRect(x, y, w, h, r, r, 'F');
    }
    if (borderColor) {
      doc.setDrawColor(...borderColor);
      doc.setLineWidth(0.5);
      doc.roundedRect(x, y, w, h, r, r, 'S');
    }
  };

  // --- Header ---
  addText('PageLens', PAGE_MARGIN, currentY, 28, COLORS.primaryAccent, 'helvetica', 'bold');
  addText('Website Intelligence Platform', PAGE_MARGIN, currentY + 6, 10, COLORS.textSecondary);
  
  // Right side header info
  const dateStr = new Date().toLocaleString();
  addText('Professional Website Analysis Report', pageWidth - PAGE_MARGIN, currentY, 12, COLORS.textPrimary, 'helvetica', 'bold', 'right');
  addText(`Generated on: ${dateStr}`, pageWidth - PAGE_MARGIN, currentY + 6, 9, COLORS.textSecondary, 'helvetica', 'normal', 'right');
  
  // Divider line
  currentY += 14;
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.5);
  doc.line(PAGE_MARGIN, currentY, pageWidth - PAGE_MARGIN, currentY);
  currentY += 12;

  // --- Executive Summary Cards ---
  const getHealth = (score) => {
    if (score >= 90) return { label: 'Excellent', color: COLORS.success };
    if (score >= 70) return { label: 'Good', color: COLORS.primaryAccent };
    if (score >= 50) return { label: 'Needs Improvement', color: COLORS.warning };
    return { label: 'Poor', color: COLORS.error };
  };
  const health = getHealth(result.seoScore);

  // Score Box
  const boxW = (pageWidth - (PAGE_MARGIN * 2) - 10) / 2;
  
  addRoundedRect(PAGE_MARGIN, currentY, boxW, 25, 3, COLORS.sectionBg, COLORS.border);
  addText('SEO SCORE', PAGE_MARGIN + 5, currentY + 8, 8, COLORS.textSecondary, 'helvetica', 'bold');
  addText(`${result.seoScore} / 100`, PAGE_MARGIN + 5, currentY + 18, 16, health.color, 'helvetica', 'bold');
  addText(`Grade: ${result.seoGrade}`, PAGE_MARGIN + boxW - 5, currentY + 18, 12, health.color, 'helvetica', 'bold', 'right');

  // Health Box
  addRoundedRect(PAGE_MARGIN + boxW + 10, currentY, boxW, 25, 3, COLORS.sectionBg, COLORS.border);
  addText('OVERALL HEALTH', PAGE_MARGIN + boxW + 15, currentY + 8, 8, COLORS.textSecondary, 'helvetica', 'bold');
  addText(health.label, PAGE_MARGIN + boxW + 15, currentY + 18, 14, health.color, 'helvetica', 'bold');
  
  currentY += 35;

  // --- Setup autoTable defaults ---
  const tableConfig = {
    theme: 'grid',
    styles: { 
      font: 'helvetica', 
      fontSize: 10,
      textColor: COLORS.textPrimary,
      lineColor: COLORS.border,
      lineWidth: 0.1,
      cellPadding: 4
    },
    headStyles: { 
      fillColor: COLORS.sectionBg, 
      textColor: COLORS.primaryAccent,
      fontStyle: 'bold',
      halign: 'left'
    },
    alternateRowStyles: {
      fillColor: [252, 251, 249]
    },
    margin: { left: PAGE_MARGIN, right: PAGE_MARGIN }
  };

  // --- Website Information ---
  addText('Website Information', PAGE_MARGIN, currentY, 14, COLORS.primaryAccent, 'helvetica', 'bold');
  currentY += 5;

  autoTable(doc, {
    ...tableConfig,
    startY: currentY,
    head: [['Metric', 'Detail']],
    body: [
      ['Analyzed URL', result.url],
      ['Domain', domain],
      ['HTTP Status', `${result.httpStatus}`],
      ['Response Time', `${result.responseTime}ms`]
    ],
    columnStyles: { 0: { cellWidth: 50, fontStyle: 'bold' } }
  });
  currentY = doc.lastAutoTable.finalY + 12;

  // --- Content Metadata ---
  addText('Content Metadata', PAGE_MARGIN, currentY, 14, COLORS.primaryAccent, 'helvetica', 'bold');
  currentY += 5;

  autoTable(doc, {
    ...tableConfig,
    startY: currentY,
    head: [['Element', 'Value']],
    body: [
      ['Page Title', result.pageTitle || 'N/A'],
      ['Meta Description', result.metaDescription || 'N/A'],
      ['Language', result.seoBreakdown?.language || result.language || 'N/A'],
      ['Charset', result.seoBreakdown?.charset || result.charset || 'N/A'],
      ['Word Count', result.wordCount?.toString() || '0']
    ],
    columnStyles: { 
      0: { cellWidth: 50, fontStyle: 'bold' },
      1: { cellWidth: 'auto' } // Allows text wrapping for long descriptions
    }
  });
  currentY = doc.lastAutoTable.finalY + 12;

  // Check Page Break
  if (currentY > 230) {
    doc.addPage();
    currentY = PAGE_MARGIN;
  }

  // --- Technical SEO ---
  addText('Technical SEO', PAGE_MARGIN, currentY, 14, COLORS.primaryAccent, 'helvetica', 'bold');
  currentY += 5;

  const getStatusBadge = (status) => status ? 'Enabled' : 'Missing';
  
  autoTable(doc, {
    ...tableConfig,
    startY: currentY,
    head: [['Technical Check', 'Status']],
    body: [
      ['HTTPS / SSL', getStatusBadge(result.seoBreakdown?.https)],
      ['Viewport Meta Tag', getStatusBadge(result.seoBreakdown?.viewport)],
      ['Robots.txt', getStatusBadge(result.seoBreakdown?.robots)],
      ['XML Sitemap', getStatusBadge(result.seoBreakdown?.sitemap)]
    ],
    columnStyles: { 0: { cellWidth: 50, fontStyle: 'bold' } }
  });
  currentY = doc.lastAutoTable.finalY + 12;

  // Check Page Break
  if (currentY > 230) {
    doc.addPage();
    currentY = PAGE_MARGIN;
  }

  // --- Page Elements ---
  addText('Page Elements Breakdown', PAGE_MARGIN, currentY, 14, COLORS.primaryAccent, 'helvetica', 'bold');
  currentY += 5;

  const h1 = result.headings?.h1Count || 0;
  const h2 = result.headings?.h2Count || 0;
  const h3 = result.headings?.h3Count || 0;
  const imgTotal = result.images?.totalImages || 0;
  const imgMissing = result.images?.imagesMissingAlt || 0;

  autoTable(doc, {
    ...tableConfig,
    startY: currentY,
    head: [['Element Category', 'Metrics']],
    body: [
      ['Heading Tags', `H1: ${h1}\nH2: ${h2}\nH3: ${h3}`],
      ['Images', `Total Images: ${imgTotal}\nMissing Alt Text: ${imgMissing}`]
    ],
    columnStyles: { 0: { cellWidth: 50, fontStyle: 'bold' } }
  });
  currentY = doc.lastAutoTable.finalY + 15;

  // --- Dynamic Recommendations ---
  const recommendations = [];
  if (!result.pageTitle || result.pageTitle.length < 10) {
    recommendations.push(['Page Title', 'Ensure the page has a descriptive title over 10 characters.']);
  }
  if (!result.metaDescription) {
    recommendations.push(['Meta Description', 'Add a meaningful meta description to improve click-through rates.']);
  }
  if (!result.seoBreakdown?.viewport) {
    recommendations.push(['Viewport', 'Add a responsive viewport meta tag for mobile compatibility.']);
  }
  if (h1 === 0) {
    recommendations.push(['Headings', 'Add exactly one meaningful H1 heading to establish page structure.']);
  } else if (h1 > 1) {
    recommendations.push(['Headings', 'Multiple H1 tags detected. Limit to exactly one H1 for optimal SEO.']);
  }
  if (imgTotal > 0 && imgMissing > 0) {
    recommendations.push(['Images', `Add descriptive alt text to ${imgMissing} image(s) to improve accessibility and SEO.`]);
  }
  if (!result.wordCount || result.wordCount < 300) {
    recommendations.push(['Content', 'Low word count detected. Consider increasing visible textual content above 300 words.']);
  }
  
  if (recommendations.length > 0) {
    // Check Page Break
    if (currentY > 210) {
      doc.addPage();
      currentY = PAGE_MARGIN;
    }

    addText('Actionable Recommendations', PAGE_MARGIN, currentY, 14, COLORS.primaryAccent, 'helvetica', 'bold');
    currentY += 5;

    autoTable(doc, {
      ...tableConfig,
      startY: currentY,
      head: [['Area', 'Recommendation']],
      body: recommendations,
      styles: { ...tableConfig.styles, textColor: COLORS.error },
      headStyles: { ...tableConfig.headStyles, textColor: COLORS.textPrimary },
      columnStyles: { 0: { cellWidth: 40, fontStyle: 'bold' } }
    });
  }

  // --- Footer & Pagination ---
  const pageCount = doc.internal.getNumberOfPages();
  const dateFormatted = dateStr.split(',')[0];
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.5);
    doc.line(PAGE_MARGIN, 280, pageWidth - PAGE_MARGIN, 280);
    
    addText('PageLens Website Intelligence Platform', PAGE_MARGIN, 286, 8, COLORS.textSecondary);
    addText(`Page ${i} of ${pageCount}`, pageWidth - PAGE_MARGIN, 286, 8, COLORS.textSecondary, 'helvetica', 'normal', 'right');
    addText('Developed for the Digital Heroes Software Development Engineering Internship Assignment', PAGE_MARGIN, 290, 7, [150, 150, 150]);
  }

  // --- Save File ---
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const filename = `PageLens_Report_${domain}_${today}.pdf`;
  doc.save(filename);
};
