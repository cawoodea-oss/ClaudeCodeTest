# Google Calendar Integration Setup

## Prerequisites

This task-calendar app syncs tasks to your Google Calendar automatically when you create them.

## Configuration Steps

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing one)
3. Enable the **Google Calendar API**:
   - Search for "Google Calendar API"
   - Click on it and press "Enable"

### 2. Create OAuth 2.0 Credentials

1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth 2.0 Client IDs**
3. Choose **Web Application**
4. Add Authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - Your production domain (when deploying)
5. Add Authorized Redirect URIs:
   - `http://localhost:3000/api/auth/callback` (for development)
   - `https://yourdomain.com/api/auth/callback` (for production)
6. Save and copy your **Client ID** and **Client Secret**

### 3. Set Environment Variables

Create or update `.env.local` in the project root:

```
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the App

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Usage

1. Click "Connect to Google Calendar" in the app
2. Authorize the app to access your Google Calendar
3. Create tasks - they'll automatically appear on your Google Calendar!

## Troubleshooting

- **"Invalid redirect URI"** - Make sure the redirect URI in Google Cloud matches your `.env.local`
- **"Access denied"** - Check that Google Calendar API is enabled
- **Tasks not syncing** - Ensure you're logged in and the token is valid

## Security Notes

- Store your `.env.local` securely - never commit it to version control
- Access tokens are stored in httpOnly cookies for security
- Refresh tokens are automatically handled
