# Quick Start Guide

Get the Student Result Management System up and running in 10 minutes!

## Prerequisites

- Node.js installed
- Firebase account
- 10 minutes of your time

## Quick Setup Steps

### 1. Create Firebase Project (2 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" → Enter name → Create
3. Enable Authentication (Email/Password)
4. Create Firestore Database (Production mode)

### 2. Configure App (1 minute)

1. Get Firebase config from Project Settings
2. Update `public/js/firebase-config.js` with your config
3. Update `.firebaserc` with your project ID

### 3. Install & Deploy (2 minutes)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Deploy security rules
firebase deploy --only firestore:rules,firestore:indexes
```

### 4. Create Admin Account (2 minutes)

1. In Firebase Console → Authentication → Add user
   - Email: `admin@institute.edu`
   - Password: `Admin@123`

2. Set admin custom claims:
```bash
# Install dependencies
cd scripts
npm install firebase-admin

# Download service account key from Firebase Console
# Save as scripts/serviceAccountKey.json

# Set admin claim
node set-admin-claims.js admin@institute.edu admin
```

3. Create admin document in Firestore:
   - Collection: `users`
   - Document ID: (use the Firebase Auth UID)
   - Fields:
     ```json
     {
       "email": "admin@institute.edu",
       "role": "admin",
       "name": "Admin"
     }
     ```

### 5. Run Locally (1 minute)

```bash
firebase serve
```

Open: `http://localhost:5000`

### 6. Test (2 minutes)

1. Login as admin: `admin@institute.edu` / `Admin@123`
2. Download CSV template
3. Upload the template
4. Create a student account and test login

## That's It!

Your system is now running. See [SETUP.md](SETUP.md) for detailed instructions.

## Next Steps

- Create student accounts
- Upload real data
- Customize branding
- Deploy to production: `firebase deploy`

## Need Help?

Check [SETUP.md](SETUP.md) for troubleshooting and detailed instructions.
