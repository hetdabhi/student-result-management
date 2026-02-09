# Admin Scripts

This folder contains administrative scripts for managing the Student Result Management System.

## Available Scripts

### set-admin-claims.js

Sets custom claims (role) for users in Firebase Authentication.

**Setup:**

1. Install dependencies:
```bash
cd scripts
npm install
```

2. Download service account key:
   - Go to Firebase Console
   - Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save as `serviceAccountKey.json` in this folder

**Usage:**

Set admin role:
```bash
node set-admin-claims.js admin@institute.edu admin
```

Set student role:
```bash
node set-admin-claims.js student@example.com student
```

**Important:** Users must logout and login again after claims are set.

## Security Note

Never commit `serviceAccountKey.json` to version control. It's already in `.gitignore`.
