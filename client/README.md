# Microsoft Authentication Test Application

A comprehensive React application demonstrating Microsoft Authentication using MSAL (Microsoft Authentication Library) with Vite, React Bootstrap, and modern React patterns.

## 🚀 Features

- **Microsoft Authentication**: Secure login using Microsoft Identity Platform
- **Protected Routes**: Route-based authentication with automatic redirects
- **User Profile**: Detailed user information from Microsoft Graph API
- **Dashboard**: Personalized dashboard for authenticated users
- **Responsive Design**: Mobile-first design using Bootstrap 5
- **Modern Stack**: Built with React 18, Vite, and TypeScript-ready

## 🛠️ Technologies Used

- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Microsoft Authentication Library (MSAL)** - Official Microsoft auth library
- **React Router** - Client-side routing and navigation
- **React Bootstrap** - UI components and responsive layout
- **Bootstrap 5** - CSS framework with modern design
- **Bootstrap Icons** - Comprehensive icon library

## 📋 Prerequisites

Before running this application, you need:

1. **Microsoft App Registration**: You must have registered an application in Microsoft Entra (Azure AD)
2. **Node.js**: Version 16 or higher
3. **npm or yarn**: Package manager

## 🏗️ Microsoft App Registration Setup

1. Go to [Microsoft Entra admin center](https://entra.microsoft.com/)
2. Navigate to **App registrations** > **New registration**
3. Configure your app:
   - **Name**: Your app name
   - **Supported account types**: Choose appropriate option
   - **Redirect URI**: `http://localhost:3000` (for development)

4. After registration, note down:
   - **Application (client) ID**: `4c9d1f93-e2a9-490d-af3a-0c02164dfa84`
   - **Directory (tenant) ID**: `23d82046-7e7d-4cf9-8efd-8012ec1d7a7c`

5. Configure **Authentication**:
   - Add redirect URI: `http://localhost:3000`
   - Enable **Access tokens** and **ID tokens**
   - Set logout URL: `http://localhost:3000`

6. Configure **API permissions**:
   - Add **Microsoft Graph** permissions:
     - `User.Read` (to read user profile)
     - `openid`, `profile`, `email` (basic authentication)

## 🚀 Getting Started

### 1. Clone and Install

```bash
# Clone the repository (if from git)
cd test-with-ms-auth

# Install dependencies
npm install
```

### 2. Configuration

The app is pre-configured with the Microsoft app registration details provided:

- **Client ID**: `4c9d1f93-e2a9-490d-af3a-0c02164dfa84`
- **Tenant ID**: `23d82046-7e7d-4cf9-8efd-8012ec1d7a7c`
- **Redirect URI**: `http://localhost:3000`

If you need to change these settings, edit `src/authConfig.js`.

### 3. Run the Application

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`.

## 📁 Project Structure

```
test-with-ms-auth/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable components
│   │   └── Navigation.jsx # Main navigation component
│   ├── pages/            # Page components
│   │   ├── Home.jsx      # Landing page (unauthenticated)
│   │   ├── Dashboard.jsx # Main dashboard (authenticated)
│   │   └── Profile.jsx   # User profile page (authenticated)
│   ├── authConfig.js     # MSAL configuration
│   ├── App.jsx          # Main app component with routing
│   ├── App.css          # Custom styles
│   ├── main.jsx         # App entry point with MSAL provider
│   └── index.css        # Global styles
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
└── README.md           # This file
```

## 🔐 Authentication Flow

1. **Unauthenticated User**: Sees the home page with login options
2. **Login Process**: Redirects to Microsoft login page
3. **Authentication**: Microsoft validates credentials and returns to app
4. **Token Storage**: MSAL stores tokens securely in browser
5. **Protected Access**: User can access dashboard and profile pages
6. **Token Refresh**: MSAL automatically refreshes tokens as needed
7. **Logout**: Clears all tokens and redirects to home page

## 📱 Pages Overview

### Home Page (`/`)
- **Purpose**: Landing page for unauthenticated users
- **Features**: App introduction, login call-to-action, feature showcase
- **Access**: Public (redirects to dashboard if authenticated)

### Dashboard (`/dashboard`)
- **Purpose**: Main authenticated user interface
- **Features**: User welcome, statistics, quick actions, recent activities
- **Access**: Protected (requires authentication)

### Profile (`/profile`)
- **Purpose**: Detailed user profile information
- **Features**: Microsoft Graph data, account details, raw API data
- **Access**: Protected (requires authentication)

## 🛡️ Security Features

- **Token-based Authentication**: Uses JWT tokens from Microsoft
- **Automatic Token Refresh**: MSAL handles token lifecycle
- **Secure Storage**: Tokens stored in browser's sessionStorage
- **CSRF Protection**: Built-in CSRF protection with MSAL
- **HTTPS Redirect**: Enforces HTTPS in production
- **Scope-based Permissions**: Requests minimal required permissions

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Bootstrap Components**: Professional UI components
- **Icon Integration**: Bootstrap Icons throughout the app
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Accessibility**: ARIA labels and keyboard navigation

## 🔧 Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 🚀 Production Deployment

1. **Update Configuration**:
   - Change redirect URIs to production domain
   - Update `authConfig.js` with production URLs
   - Configure environment variables

2. **Build Application**:
   ```bash
   npm run build
   ```

3. **Deploy**: Upload `dist/` folder to your hosting provider

4. **Update Microsoft App Registration**:
   - Add production redirect URIs
   - Update logout URLs

## 🔍 Troubleshooting

### Common Issues

1. **"AADSTS50011" Error**: Redirect URI mismatch
   - Ensure redirect URI in app registration matches exactly

2. **"AADSTS7000218" Error**: Client credentials flow
   - Check that you're using the correct client ID

3. **Token Acquisition Failed**: Scope issues
   - Verify API permissions are granted in app registration

4. **CORS Errors**: Development server issues
   - Ensure you're running on `http://localhost:3000`

### Debug Mode

Enable MSAL logging by updating `authConfig.js`:

```javascript
system: {
    loggerOptions: {
        logLevel: LogLevel.Verbose, // Change to Verbose for detailed logs
        // ... rest of config
    }
}
```

## 📚 Resources

- [Microsoft Identity Platform Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
- [MSAL.js Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js)
- [Microsoft Graph API](https://docs.microsoft.com/en-us/graph/)
- [React Bootstrap Documentation](https://react-bootstrap.github.io/)
- [Vite Documentation](https://vitejs.dev/)

## 📄 License

This project is for educational purposes and demonstration of Microsoft Authentication integration.

## 🤝 Contributing

This is a demonstration project. Feel free to fork and modify for your own learning purposes.

---

**Built with ❤️ using React, Vite, and Microsoft Identity Platform**