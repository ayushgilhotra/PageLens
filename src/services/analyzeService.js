// Real API Integration Service
export const analyzeWebsite = async (inputUrl, onProgress) => {
  const steps = [
    { message: 'Connecting to server...', endPerc: 15 },
    { message: 'Reading HTML content...', endPerc: 30 },
    { message: 'Scanning metadata...', endPerc: 50 },
    { message: 'Counting headings...', endPerc: 65 },
    { message: 'Inspecting images...', endPerc: 80 },
    { message: 'Calculating SEO score...', endPerc: 95 },
    { message: 'Preparing report...', endPerc: 100 },
  ];

  let progressInterval;
  let currentStep = 0;

  // Start the loading animation progress simulator
  if (onProgress) {
    onProgress(0, steps[0].endPerc);
    progressInterval = setInterval(() => {
      // Don't advance to the final "Preparing report..." step until the API actually returns
      if (currentStep < steps.length - 2) {
        currentStep++;
        onProgress(currentStep, steps[currentStep].endPerc);
      }
    }, 600); // Advance visual step roughly every 600ms while waiting
  }

  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    const response = await fetch(`${baseUrl}/api/v1/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ url: inputUrl })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Failed to analyze website. Please check the URL and try again.');
    }

    // Force completion of animation
    if (progressInterval) {
      clearInterval(progressInterval);
    }
    if (onProgress) {
      onProgress(steps.length - 1, 100);
    }

    return data;
  } catch (error) {
    if (progressInterval) {
      clearInterval(progressInterval);
    }
    throw error;
  }
};
