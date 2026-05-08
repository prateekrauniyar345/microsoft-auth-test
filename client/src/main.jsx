/**
 * Main entry point for the React application
 * 
 * This file sets up:
 * 1. Bootstrap CSS and JavaScript for UI components
 * 2. Bootstrap Icons for iconography
 * 3. Microsoft Authentication Library (MSAL) provider
 * 4. React app rendering
 * 
 * The MSAL provider wraps the entire app to provide authentication context
 * to all child components.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Import Bootstrap CSS and JavaScript for styling and components
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Import Bootstrap Icons for iconography
import 'bootstrap-icons/font/bootstrap-icons.css'

// Import Microsoft Authentication Library components
import { PublicClientApplication, EventType } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'

// Import our authentication configuration
import { msalConfig } from './lib/msalConfig'

// Import custom CSS and main App component
import './index.css'
import App from './App.jsx'


/**
 * MSAL should be instantiated outside of the component tree to prevent it from being 
 * re-instantiated on re-renders. This is a best practice for performance and stability.
 * Only one instance of PublicClientApplication should be created - this pattern is called a singleton pattern
 * For more information, visit: 
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */
/**
 * This is not the newer “factory method” (i.e. createStandardPublicClientApplication), 
 * it is the standard constructor-based initialization 
 * and it’s also not the “hybrid” promise-based version. This is the traditional synchronous initialization, 
 * which is still fully valid and commonly used.
 */
const msalInstance = new PublicClientApplication(msalConfig);

/**
 * Default to using the first account if no account is active on page load.
 * This handles cases where the user has multiple accounts and we need to set an active one.
 * Account selection logic is app dependent. Adjust as needed for different use cases.
 */
if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
    // Set the first account as active
    msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);


    // get and console log all the accounts
    console.log("All the microsoft accounts are  : ", msalInstance.getAllAccounts());


    // print the active account to console for debugging
    console.log('Active account set to:', msalInstance.getActiveAccount().username);
}

/**
 * Listen for sign-in event and set active account
 * This event callback is triggered when authentication is successful
 * and ensures the newly authenticated account becomes the active account.
 */
msalInstance.addEventCallback((event) => {
    // Check if the event is a successful login
    // console.log('MSAL Event:', event);
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
        const account = event.payload.account;
        // Set the newly authenticated account as the active account
        msalInstance.setActiveAccount(account);
        console.log('Login successful, active account set:', account.username);

        // all the accounts after login
        console.log("All the microsoft accounts after login are  : ", msalInstance.getAllAccounts());


        // get the account info for the current active account
        const activeAccount = msalInstance.getActiveAccount();
        const accountInfo = msalInstance.getAccount({
            username: activeAccount.username,
        })
        console.log("Account info for the active account:", accountInfo);
    }
    
    // Handle logout events
    if (event.eventType === EventType.LOGOUT_SUCCESS) {
        console.log('Logout successful');
    }
    
    // Handle token acquisition events for debugging
    if (event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) {
        // console.log('Token acquired successfully');
    }
});

/**
 * Render the React application
 * 
 * The app is wrapped in:
 * 1. StrictMode - for highlighting potential problems in development
 * 2. MsalProvider - provides authentication context to all child components
 * 
 * The MsalProvider instance prop contains our configured MSAL instance
 * which will be used throughout the app for authentication operations.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </StrictMode>,
)