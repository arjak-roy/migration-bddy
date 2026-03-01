'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define the shape of your pathway steps
export interface PathwayStep {
  id: string;
  name: string;
  href: string;
  description: string;
}

// Define the initial steps
export const initialPathwaySteps: PathwayStep[] = [
  { id: 'profile', name: 'Complete Your Profile', href: '/profile', description: 'Fill in your professional details to get started.' },
  { id: 'guide', name: 'Explore Career Guide', href: '/guide', description: 'Learn about the process of becoming a nurse in Germany.' },
  { id: 'assessment', name: 'Take German Readiness Assessment', href: '/assessment', description: 'Assess your German language skills and get personalized feedback.' },
  { id: 'jobs', name: 'Find Job Opportunities', href: '/jobs', description: 'Explore job listings and apply for positions.' },
];

// Define the context type
interface ProgressContextType {
  completedSteps: string[];
  completeStep: (stepId: string) => void;
  isStepCompleted: (stepId: string) => boolean;
  isStepUnlocked: (stepId: string) => boolean;
}

// Create the context
const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

// Create the provider component
export const ProgressProvider = ({ children }: { children: ReactNode }) => {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after the component has mounted.
    try {
      const savedProgress = localStorage.getItem('gts-progress');
      if (savedProgress) {
        setCompletedSteps(JSON.parse(savedProgress));
      }
    } catch (error) {
      console.error("Failed to load progress from localStorage", error);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    // This effect runs only on the client and when completedSteps changes.
    if (isInitialized) {
      try {
        localStorage.setItem('gts-progress', JSON.stringify(completedSteps));
      } catch (error) {
        console.error("Failed to save progress to localStorage", error);
      }
    }
  }, [completedSteps, isInitialized]);


  const completeStep = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps(prev => [...prev, stepId]);
    }
  };
  
  const isStepCompleted = (stepId: string) => completedSteps.includes(stepId);

  const isStepUnlocked = (stepId: string) => {
    // The dashboard and profile pages are always accessible as the starting points.
    if (stepId === 'dashboard' || stepId === 'profile') {
      return true;
    }

    // For any other step, we first find its position in the pathway.
    const stepIndex = initialPathwaySteps.findIndex(step => step.id === stepId);

    // If it's not a valid step, or it's the first step (which is handled above), lock it.
    if (stepIndex < 1) {
        return false;
    }
    
    // A step is unlocked if the step immediately before it in the pathway is completed.
    const previousStepId = initialPathwaySteps[stepIndex - 1].id;
    return isStepCompleted(previousStepId);
  };

  const value = { completedSteps, completeStep, isStepCompleted, isStepUnlocked };

  return (
    <ProgressContext.Provider value={value}>
      {isInitialized ? children: null}
    </ProgressContext.Provider>
  );
};

// Create a custom hook to use the context
export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
