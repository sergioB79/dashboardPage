import { useState, useCallback } from 'react';

export const useMasterPassword = () => {
  const [masterPassword, setMasterPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const loadMasterPassword = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/master-password.txt');
      if (response.ok) {
        const password = await response.text();
        setMasterPassword(password.trim());
        return password.trim();
      } else {
        console.warn('Master password file not found');
        return '';
      }
    } catch (error) {
      console.error('Failed to load master password:', error);
      return '';
    } finally {
      setIsLoading(false);
    }
  }, []);

  const insertPassword = useCallback(async (inputElement: HTMLInputElement | null) => {
    if (!inputElement) {
      console.log('No input element found');
      return;
    }
    
    const password = masterPassword || await loadMasterPassword();
    console.log('Inserting password:', password);
    
    if (password) {
      // Clear existing value
      inputElement.value = '';
      
      // Set new value
      inputElement.value = password;
      
      // Trigger multiple events to ensure React detects the change
      const inputEvent = new Event('input', { bubbles: true });
      const changeEvent = new Event('change', { bubbles: true });
      
      inputElement.dispatchEvent(inputEvent);
      inputElement.dispatchEvent(changeEvent);
      
      // Focus the input
      inputElement.focus();
      
      console.log('Password inserted successfully');
    } else {
      console.log('No password to insert');
    }
  }, [masterPassword, loadMasterPassword]);

  return {
    insertPassword,
    isLoading
  };
};