import { useState, useCallback } from 'react';

type SequenceAction = 'grid' | 'custom';

interface SequenceState {
  sequence: SequenceAction[];
  isComplete: boolean;
}

const TARGET_SEQUENCE: SequenceAction[] = [
  'grid', 'grid', 'grid', 'grid', 'grid', 'grid',
  'custom',
  'grid'
];

export const useSecretSequence = () => {
  const [sequenceState, setSequenceState] = useState<SequenceState>({
    sequence: [],
    isComplete: false
  });

  const addToSequence = useCallback((action: SequenceAction) => {
    setSequenceState(prev => {
      const newSequence = [...prev.sequence, action];
      
      // Check if sequence matches target so far
      const isValidSoFar = TARGET_SEQUENCE.slice(0, newSequence.length)
        .every((expected, index) => expected === newSequence[index]);
      
      if (!isValidSoFar) {
        // Reset if wrong sequence
        return { sequence: [action], isComplete: false };
      }
      
      // Check if complete
      const isComplete = newSequence.length === TARGET_SEQUENCE.length &&
        TARGET_SEQUENCE.every((expected, index) => expected === newSequence[index]);
      
      if (isComplete) {
        // Reset after completion
        setTimeout(() => {
          setSequenceState({ sequence: [], isComplete: false });
        }, 100);
      }
      
      return { sequence: newSequence, isComplete };
    });
  }, []);

  const resetSequence = useCallback(() => {
    setSequenceState({ sequence: [], isComplete: false });
  }, []);

  return {
    addToSequence,
    resetSequence,
    isComplete: sequenceState.isComplete,
    progress: sequenceState.sequence.length
  };
};