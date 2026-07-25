export function calculateSeoScore(data) {
  let score = 0;
  const breakdown = [];

  // 1. Page Title (15 pts)
  let titleScore = 0;
  let titleStatus = 'bad';
  let titleDetail = 'Missing or invalid title';
  if (data.pageTitle) {
    const len = data.pageTitle.length;
    if (len >= 30 && len <= 60) {
      titleScore = 15;
      titleStatus = 'good';
      titleDetail = 'Optimal length (30-60 characters)';
    } else {
      titleScore = 8;
      titleStatus = 'warning';
      titleDetail = 'Title is too short or too long';
    }
  } else {
    titleScore = 0;
  }
  score += titleScore;
  breakdown.push({ name: 'Page Title', score: titleScore, maxScore: 15, status: titleStatus, detail: titleDetail });

  // 2. Meta Description (15 pts)
  let metaScore = 0;
  let metaStatus = 'bad';
  let metaDetail = 'Missing meta description';
  if (data.metaDescription) {
    const len = data.metaDescription.length;
    if (len >= 120 && len <= 160) {
      metaScore = 15;
      metaStatus = 'good';
      metaDetail = 'Optimal length (120-160 characters)';
    } else {
      metaScore = 8;
      metaStatus = 'warning';
      metaDetail = 'Description is too short or too long';
    }
  }
  score += metaScore;
  breakdown.push({ name: 'Meta Description', score: metaScore, maxScore: 15, status: metaStatus, detail: metaDetail });

  // 3. H1 Tag (15 pts)
  let h1Score = 0;
  let h1Status = 'bad';
  let h1Detail = 'Missing H1 tag';
  const h1Count = data.headings?.h1 || 0;
  if (h1Count === 1) {
    h1Score = 15;
    h1Status = 'good';
    h1Detail = 'Exactly one H1 tag found';
  } else if (h1Count > 1) {
    h1Score = 8;
    h1Status = 'warning';
    h1Detail = 'Multiple H1 tags found';
  }
  score += h1Score;
  breakdown.push({ name: 'H1 Tag', score: h1Score, maxScore: 15, status: h1Status, detail: h1Detail });

  // 4. Image Alt Text (15 pts)
  let altScore = 0;
  let altStatus = 'bad';
  let altDetail = 'No images found or missing alt text';
  if (data.images && data.images.total > 0) {
    const percentWithAlt = (data.images.withAlt / data.images.total) * 100;
    if (percentWithAlt === 100) {
      altScore = 15;
      altStatus = 'good';
      altDetail = 'All images have alt text';
    } else if (percentWithAlt >= 80) {
      altScore = 12;
      altStatus = 'good';
      altDetail = 'Most images have alt text';
    } else if (percentWithAlt >= 50) {
      altScore = 8;
      altStatus = 'warning';
      altDetail = 'Many images are missing alt text';
    } else {
      altScore = 3;
      altStatus = 'bad';
      altDetail = 'Most images are missing alt text';
    }
  } else if (data.images?.total === 0) {
    altScore = 15;
    altStatus = 'good';
    altDetail = 'No images on page (N/A)';
  }
  score += altScore;
  breakdown.push({ name: 'Image Alt Text', score: altScore, maxScore: 15, status: altStatus, detail: altDetail });

  // 5. Response Time (10 pts)
  let rtScore = 0;
  let rtStatus = 'bad';
  let rtDetail = 'Very slow response time';
  if (data.responseTime < 500) {
    rtScore = 10;
    rtStatus = 'good';
    rtDetail = 'Fast response time (<500ms)';
  } else if (data.responseTime < 1000) {
    rtScore = 8;
    rtStatus = 'good';
    rtDetail = 'Good response time (<1000ms)';
  } else if (data.responseTime < 2000) {
    rtScore = 5;
    rtStatus = 'warning';
    rtDetail = 'Average response time (<2000ms)';
  } else {
    rtScore = 2;
    rtStatus = 'bad';
    rtDetail = 'Slow response time (>2000ms)';
  }
  score += rtScore;
  breakdown.push({ name: 'Response Time', score: rtScore, maxScore: 10, status: rtStatus, detail: rtDetail });

  // 6. HTTPS (10 pts)
  let httpsScore = 0;
  let httpsStatus = 'bad';
  let httpsDetail = 'Not using HTTPS';
  if (data.ssl) {
    httpsScore = 10;
    httpsStatus = 'good';
    httpsDetail = 'Using secure HTTPS connection';
  }
  score += httpsScore;
  breakdown.push({ name: 'HTTPS', score: httpsScore, maxScore: 10, status: httpsStatus, detail: httpsDetail });

  // 7. Word Count (10 pts)
  let wcScore = 0;
  let wcStatus = 'bad';
  let wcDetail = 'Very little content';
  if (data.wordCount > 300) {
    wcScore = 10;
    wcStatus = 'good';
    wcDetail = 'Good amount of content (>300 words)';
  } else if (data.wordCount > 100) {
    wcScore = 6;
    wcStatus = 'warning';
    wcDetail = 'Thin content (>100 words)';
  } else {
    wcScore = 2;
    wcStatus = 'bad';
    wcDetail = 'Almost no text content';
  }
  score += wcScore;
  breakdown.push({ name: 'Word Count', score: wcScore, maxScore: 10, status: wcStatus, detail: wcDetail });

  // 8. Viewport Meta (5 pts)
  let viewScore = 0;
  let viewStatus = 'bad';
  let viewDetail = 'Missing viewport meta tag';
  if (data.viewport) {
    viewScore = 5;
    viewStatus = 'good';
    viewDetail = 'Mobile-friendly viewport configured';
  }
  score += viewScore;
  breakdown.push({ name: 'Viewport Meta', score: viewScore, maxScore: 5, status: viewStatus, detail: viewDetail });

  // 9. Robots.txt (5 pts)
  let robotsScore = 0;
  let robotsStatus = 'bad';
  let robotsDetail = 'Missing robots.txt';
  if (data.robotsTxt) {
    robotsScore = 5;
    robotsStatus = 'good';
    robotsDetail = 'robots.txt file present';
  }
  score += robotsScore;
  breakdown.push({ name: 'Robots.txt', score: robotsScore, maxScore: 5, status: robotsStatus, detail: robotsDetail });

  // Grade calculation
  let grade = 'F';
  if (score >= 90) grade = 'A+';
  else if (score >= 80) grade = 'A';
  else if (score >= 70) grade = 'B';
  else if (score >= 60) grade = 'C';
  else if (score >= 50) grade = 'D';

  return { score, grade, breakdown };
}

export function getScoreColor(score) {
  if (score >= 80) return 'var(--success)';
  if (score >= 60) return 'var(--warning)';
  return 'var(--danger)';
}

export function getResponseTimeLabel(ms) {
  if (ms < 300) return 'Excellent';
  if (ms < 800) return 'Good';
  if (ms < 1500) return 'Average';
  return 'Slow';
}

export function getResponseTimeColor(ms) {
  if (ms < 300) return 'var(--success)';
  if (ms < 800) return 'var(--success)';
  if (ms < 1500) return 'var(--warning)';
  return 'var(--danger)';
}
