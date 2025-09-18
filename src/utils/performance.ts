declare global {
  function gtag(...args: any[]): void;
}

// Core Web Vitals monitoring
export const measureCoreWebVitals = () => {
  if (typeof window === 'undefined') return;

  // Largest Contentful Paint (LCP)
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'largest-contentful-paint') {
        console.log('LCP:', entry.startTime);
        // Send to analytics if available
        if (typeof gtag !== 'undefined') {
          gtag('event', 'web_vitals', {
            metric_name: 'LCP',
            metric_value: entry.startTime,
            metric_rating: entry.startTime <= 2500 ? 'good' : entry.startTime <= 4000 ? 'needs_improvement' : 'poor'
          });
        }
      }
    }
  });
  
  try {
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (e) {
    console.warn('LCP observation not supported');
  }

  // First Input Delay (FID)
  const fidObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'first-input') {
        const fidEntry = entry as any;
        const fid = fidEntry.processingStart - fidEntry.startTime;
        console.log('FID:', fid);
        if (typeof gtag !== 'undefined') {
          gtag('event', 'web_vitals', {
            metric_name: 'FID',
            metric_value: fid,
            metric_rating: fid <= 100 ? 'good' : fid <= 300 ? 'needs_improvement' : 'poor'
          });
        }
      }
    }
  });
  
  try {
    fidObserver.observe({ entryTypes: ['first-input'] });
  } catch (e) {
    console.warn('FID observation not supported');
  }

  // Cumulative Layout Shift (CLS)
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const clsEntry = entry as any;
      if (!clsEntry.hadRecentInput) {
        clsValue += clsEntry.value;
      }
    }
    console.log('CLS:', clsValue);
    if (typeof gtag !== 'undefined') {
      gtag('event', 'web_vitals', {
        metric_name: 'CLS',
        metric_value: clsValue,
        metric_rating: clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs_improvement' : 'poor'
      });
    }
  });
  
  try {
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  } catch (e) {
    console.warn('CLS observation not supported');
  }
};

// Resource timing analysis
export const analyzeResourceTiming = () => {
  if (typeof window === 'undefined') return null;
  
  const resources = performance.getEntriesByType('resource');
  const slowResources = resources.filter(resource => resource.duration > 1000);
  
  if (slowResources.length > 0) {
    console.warn('Slow loading resources:', slowResources);
  }
  
  return {
    totalResources: resources.length,
    slowResources: slowResources.length,
    averageLoadTime: resources.reduce((sum, resource) => sum + resource.duration, 0) / resources.length
  };
};

// Image optimization checker
export const checkImageOptimization = () => {
  if (typeof window === 'undefined') return null;
  
  const images = document.querySelectorAll('img');
  const unoptimizedImages: Element[] = [];
  
  images.forEach((img) => {
    // Check for missing alt text
    if (!img.alt) {
      console.warn('Image missing alt text:', img.src);
    }
    
    // Check for missing lazy loading
    if (!img.loading || img.loading !== 'lazy') {
      if (!img.src.includes('hero') && !img.classList.contains('above-fold')) {
        unoptimizedImages.push(img);
      }
    }
    
    // Check for missing srcset
    if (!img.srcset) {
      console.warn('Image missing srcset for responsive optimization:', img.src);
    }
  });
  
  return {
    totalImages: images.length,
    unoptimizedImages: unoptimizedImages.length
  };
};