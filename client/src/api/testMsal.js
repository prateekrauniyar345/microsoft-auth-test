import { useMsal } from '@azure/msal-react';
import { msalConfig } from '../lib/msalConfig';

/**
 * Get all accounts - use the hook in components instead
 * This is kept for backward compatibility
 */
export const getAccounts = () => {
    try {
        // This function should only be called from within a component using useMsal hook
        // For now, return empty array - use useMsal hook in components instead
        return [];
    } catch (error) {
        console.error('Error getting accounts:', error);
        return [];
    }
}

/**
 * Get active account - use the hook in components instead
 * This is kept for backward compatibility
 */
export const getActiveAccount = () => {
    try {
        // This function should only be called from within a component using useMsal hook
        // For now, return null - use useMsal hook in components instead
        return null;
    } catch (error) {
        console.error('Error getting active account:', error);
        return null;
    }
}


export const sendAccessTokenToBackend = async () => {
    try{

    }
}



