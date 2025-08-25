// Accessibility test utility functions
// This file contains utility functions to test accessibility features

/**
 * Check if an element has proper ARIA attributes
 */
export function checkAriaAttributes(element: Element): {
  hasAriaLabel: boolean;
  hasRole: boolean;
  hasAriaDescribedBy: boolean;
  score: number;
} {
  const hasAriaLabel = element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby');
  const hasRole = element.hasAttribute('role');
  const hasAriaDescribedBy = element.hasAttribute('aria-describedby');
  
  let score = 0;
  if (hasAriaLabel) score += 1;
  if (hasRole) score += 1;
  if (hasAriaDescribedBy) score += 1;
  
  return {
    hasAriaLabel,
    hasRole,
    hasAriaDescribedBy,
    score: (score / 3) * 100
  };
}

/**
 * Check if interactive elements are keyboard accessible
 */
export function checkKeyboardAccessibility(): {
  interactiveElements: number;
  accessibleElements: number;
  score: number;
} {
  const interactiveSelectors = [
    'button',
    'input',
    'select',
    'textarea',
    'a[href]',
    '[role="button"]',
    '[role="checkbox"]',
    '[role="radio"]',
    '[tabindex="0"]'
  ];
  
  const allInteractive = document.querySelectorAll(interactiveSelectors.join(', '));
  let accessibleCount = 0;
  
  allInteractive.forEach(element => {
    const tabIndex = element.getAttribute('tabindex');
    const isAccessible = tabIndex !== '-1' && !element.hasAttribute('disabled');
    if (isAccessible) accessibleCount++;
  });
  
  return {
    interactiveElements: allInteractive.length,
    accessibleElements: accessibleCount,
    score: allInteractive.length > 0 ? (accessibleCount / allInteractive.length) * 100 : 100
  };
}

/**
 * Check for proper heading hierarchy
 */
export function checkHeadingHierarchy(): {
  headings: { level: number; text: string }[];
  isValid: boolean;
  issues: string[];
} {
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
    .map(h => ({
      level: parseInt(h.tagName.charAt(1)),
      text: h.textContent?.trim() || ''
    }));
  
  const issues: string[] = [];
  let isValid = true;
  
  // Check if there's an h1
  if (!headings.some(h => h.level === 1)) {
    issues.push('No h1 heading found');
    isValid = false;
  }
  
  // Check for skipped levels
  for (let i = 1; i < headings.length; i++) {
    const currentLevel = headings[i].level;
    const previousLevel = headings[i - 1].level;
    
    if (currentLevel > previousLevel + 1) {
      issues.push(`Heading level skipped: h${previousLevel} to h${currentLevel}`);
      isValid = false;
    }
  }
  
  return { headings, isValid, issues };
}

/**
 * Check for alt text on images
 */
export function checkImageAltText(): {
  totalImages: number;
  imagesWithAlt: number;
  decorativeImages: number;
  score: number;
} {
  const images = document.querySelectorAll('img');
  let imagesWithAlt = 0;
  let decorativeImages = 0;
  
  images.forEach(img => {
    const alt = img.getAttribute('alt');
    if (alt !== null) {
      if (alt === '') {
        decorativeImages++;
      } else {
        imagesWithAlt++;
      }
    }
  });
  
  const totalImages = images.length;
  const appropriatelyLabeled = imagesWithAlt + decorativeImages;
  
  return {
    totalImages,
    imagesWithAlt,
    decorativeImages,
    score: totalImages > 0 ? (appropriatelyLabeled / totalImages) * 100 : 100
  };
}

/**
 * Check color contrast (simplified version)
 */
export function checkBasicContrast(): {
  elementsChecked: number;
  potentialIssues: number;
  score: number;
} {
  const textElements = document.querySelectorAll('p, span, div, button, a, label, h1, h2, h3, h4, h5, h6');
  let potentialIssues = 0;
  
  textElements.forEach(element => {
    const styles = window.getComputedStyle(element);
    const color = styles.color;
    const backgroundColor = styles.backgroundColor;
    
    // Simple check for very low contrast (this is not a complete implementation)
    if (color === backgroundColor || 
        (color === 'rgb(128, 128, 128)' && backgroundColor === 'rgb(255, 255, 255)')) {
      potentialIssues++;
    }
  });
  
  return {
    elementsChecked: textElements.length,
    potentialIssues,
    score: textElements.length > 0 ? ((textElements.length - potentialIssues) / textElements.length) * 100 : 100
  };
}

/**
 * Run all accessibility checks
 */
export function runAccessibilityAudit(): {
  keyboard: ReturnType<typeof checkKeyboardAccessibility>;
  headings: ReturnType<typeof checkHeadingHierarchy>;
  images: ReturnType<typeof checkImageAltText>;
  contrast: ReturnType<typeof checkBasicContrast>;
  overallScore: number;
} {
  const keyboard = checkKeyboardAccessibility();
  const headings = checkHeadingHierarchy();
  const images = checkImageAltText();
  const contrast = checkBasicContrast();
  
  const overallScore = (keyboard.score + images.score + contrast.score + (headings.isValid ? 100 : 50)) / 4;
  
  return {
    keyboard,
    headings,
    images,
    contrast,
    overallScore
  };
}

// Console helper for manual testing
if (typeof window !== 'undefined') {
  (window as any).accessibilityTest = runAccessibilityAudit;
}
