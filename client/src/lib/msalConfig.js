/**
 * Microsoft Authentication Configuration
 * 
 * This file contains all the configuration needed for Microsoft Authentication
 * using the Microsoft Authentication Library (MSAL) for JavaScript.
 * 
 * Key components:
 * - msalConfig: Main configuration object for MSAL instance
 * - loginRequest: Scopes and permissions requested during login
 * - graphConfig: Configuration for Microsoft Graph API calls
 */

import { LogLevel } from '@azure/msal-browser';

/**
 * Configuration object to be passed to MSAL instance on creation. 
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md 
 */
export const msalConfig = {
    auth: {
        // This is the ONLY mandatory field that you need to supply.
        // Application (client) ID from your Microsoft app registration
        clientId: import.meta.env.VITE_CLIENTID,
        
        // Authority URL - includes your tenant ID for single-tenant apps
        // For multi-tenant apps, use: 'https://login.microsoftonline.com/common'
        // authority: 'https://login.microsoftonline.com/23d82046-7e7d-4cf9-8efd-8012ec1d7a7c',
        authority: import.meta.env.VITE_AUTHORITY,
        
        // Points to window.location.origin. You must register this URI on Microsoft Entra admin center/App Registration.
        // Using port 3000 to match our Vite config
        redirectUri: import.meta.env.VITE_REDIRECT_URL,
        
        // Indicates the page to navigate after logout.
        postLogoutRedirectUri: '/',
        
        // If "true", will navigate back to the original request location before processing the auth code response.
        navigateToLoginRequestUrl: false,
    },
    cache: {
        // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
        cacheLocation: 'sessionStorage',
        
        // Set this to "true" if you are having issues on IE11 or Edge
        storeAuthStateInCookie: false,
    },
    system: {
        loggerOptions: {
            // Configure logging level for debugging
            logLevel: LogLevel.Info,
            
            // Logger callback function to handle log messages
            loggerCallback: (level, message, containsPii) => {
                // Don't log messages that contain personally identifiable information (PII)
                if (containsPii) {
                    return;
                }
                
                // Log different levels to appropriate console methods
                switch (level) {
                    case LogLevel.Error:
                        // console.error('MSAL Error:', message);
                        return;
                    case LogLevel.Info:
                        // console.info('MSAL Info:', message);
                        return;
                    case LogLevel.Verbose:
                        // console.debug('MSAL Debug:', message);
                        return;
                    case LogLevel.Warning:
                        // console.warn('MSAL Warning:', message);
                        return;
                    default:
                        return;
                }
            },
        },
    },
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit: 
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
    scopes: [
        import.meta.env.VITE_SERVERSIDE_SCOPE, // Your Backend API scope
        "openid", 
        "profile", 
        "email",
        "offline_access"
    ],
    // This forces Microsoft to show you the "Permissions Requested" screen
    prompt: "consent", 
    // This tells Microsoft that the Backend ALSO needs these Graph permissions
    extraScopesToConsent: [
        "https://graph.microsoft.com/User.Read",
        "https://graph.microsoft.com/Files.Read",
        "https://graph.microsoft.com/Files.ReadWrite"
    ]
};


/**
 * Microsoft Graph API configuration
 * The Graph API is used to get user information from Microsoft
 */
export const graphConfig = {
    graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
    graphUserPhotoEndpoint: 'https://graph.microsoft.com/v1.0/me/photo/$value'
};

/**
 * An optional silentRequest object can be used to achieve silent SSO
 * between applications by providing a "login_hint" property.
 * This is useful for refreshing tokens silently in the background.
 */
export const silentRequest = {
    scopes: ['openid', 'profile', 'User.Read'],
};