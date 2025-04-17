'use client';

import { useState, useEffect } from 'react';

/**
 * Hook for assigning and managing A/B test variants
 * Randomly assigns users to variant A or B for alert testing
 */
export function useVariantAssignment() {
  const [variant, setVariant] = useState<'A' | 'B'>('A');
  
  useEffect(() => {
    // Check if variant is already stored in localStorage
    const storedVariant = localStorage.getItem('alertVariant');
    
    if (storedVariant === 'A' || storedVariant === 'B') {
      setVariant(storedVariant);
      console.log(`Using stored alert variant: ${storedVariant}`);
    } else {
      // Randomly assign a variant (50/50 split)
      const assignedVariant = Math.random() > 0.5 ? 'A' : 'B';
      setVariant(assignedVariant);
      localStorage.setItem('alertVariant', assignedVariant);
      console.log(`Assigned new alert variant: ${assignedVariant}`);
    }
  }, []);
  
  return variant;
} 