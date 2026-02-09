# Setup Guide - Student Result Management System

This guide will walk you through setting up the Student Result Management Web Application from scratch.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Google account for Firebase
- A text editor (VS Code recommended)

## Step 1: Firebase Project Setup

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `student-result-management`
4. Disable Google Analytics (optional)
5. Click "Create project"

### 1.2 Enable Firebase Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Enable "Email/Password" sign-in method
4. Click "Save"

### 1.3 Create Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Select "Start in production mode"
4. Choose a location closest to your users
5. Click "Enable"

### 1.4 Get Firebase Configuration

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (`</>`)
4. Register app with nickname: `student-result-web`
5. Copy the Firebase configuration object

## Step 2: Configure Application

### 2.1 Update Firebase Configuration

1. Open `public/js/firebase-config.js`
2. Replace the placeholder values with your Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 2.2 Update Firebase Project ID

1. Open `.firebaserc`
2. Replace `YOUR_PROJECT_ID` with your actual Firebase project ID

## Step 3: Deploy Firestore Security Rules

### 3.1 Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 3.2 Login to Firebase

```bash
firebase login
```

### 3.3 Initialize Firebase

```bash
firebase init
```

- Select "Firestore" and "Hosting"
- Use existing project
- Accept default Firestore rules file: `firestore.rules`
- Accept default Firestore indexes file: `firestore.indexes.json`
- Set public directory: `public`
- Configure as single-page app: Yes
- Set up automatic builds: No

### 3.4 Deploy Security Rules

```bash
firebase deploy --only firestore:rules
```

### 3.5 Deploy Firestore Indexes

```bash
firebase deploy --only firestore:indexes
```

## Step 4: Create User Accounts

### 4.1 Create Admin Account

1. In Firebase Console, go to "Authentication"
2. Click "Add user"
3. Email: `admin@institute.edu`
4. Password: `Admin@123` (change after first login)
5. Click "Add user"

### 4.2 Set Admin Custom Claims

You need to set custom claims using Firebase Admin SDK or Cloud Functions.

**Option A: Using Firebase Admin SDK (Node.js script)**

Create a file `scripts/set-admin-claims.js`:

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function setAdminClaim(email) {
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().setCustomUserClaims(user.uid, { role: 'admin' });
  console.log(`Admin claim set for ${email}`);
}

setAdminClaim('admin@institute.edu')
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
```

Run: `node scripts/set-admin-claims.js`

**Option B: Using Firebase Console + Cloud Functions**

Deploy a Cloud Function to set custom claims (see Firebase documentation).

### 4.3 Create Student Accounts

1. Use the sample data in `sample-data/sample-users.json`
2. Create each student account in Firebase Authentication
3. Set custom claims: `{ role: 'student' }`

### 4.4 Create Firestore User Documents

For each user created, add a document in the `users` collection:

**Admin document** (Document ID = Firebase Auth UID):
```json
{
  "uid": "FIREBASE_AUTH_UID",
  "email": "admin@institute.edu",
  "role": "admin",
  "name": "System Administrator",
  "createdAt": "TIMESTAMP"
}
```

**Student document** (Document ID = Firebase Auth UID):
```json
{
  "uid": "FIREBASE_AUTH_UID",
  "email": "john.doe@example.com",
  "role": "student",
  "studentId": "S001",
  "name": "John Doe",
  "createdAt": "TIMESTAMP"
}
```

## Step 5: Install Dependencies

```bash
npm install
```

## Step 6: Run Locally

### 6.1 Using Firebase Hosting Emulator

```bash
firebase serve
```

Access at: `http://localhost:5000`

### 6.2 Using a Simple HTTP Server

```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server public -p 8000
```

Access at: `http://localhost:8000`

## Step 7: Test the Application

### 7.1 Test Admin Login

1. Go to `http://localhost:5000`
2. Login with admin credentials:
   - Email: `admin@institute.edu`
   - Password: `Admin@123`
3. You should be redirected to Admin Dashboard

### 7.2 Test CSV Upload

1. In Admin Dashboard, click "Download Template"
2. Or use `sample-data/student-results-sample.csv`
3. Upload the CSV file
4. Verify results are uploaded successfully

### 7.3 Test Student Login

1. Logout from admin account
2. Login with student credentials:
   - Email: `john.doe@example.com`
   - Password: `Student@123`
3. You should see your results on Student Dashboard

## Step 8: Deploy to Production

### 8.1 Deploy to Firebase Hosting

```bash
firebase deploy
```

Your app will be live at: `https://YOUR_PROJECT_ID.web.app`

### 8.2 Deploy to Vercel (Alternative)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to deploy

## Troubleshooting

### Issue: "Permission denied" errors

**Solution:** Ensure Firestore security rules are deployed correctly:
```bash
firebase deploy --only firestore:rules
```

### Issue: Custom claims not working

**Solution:** 
1. Verify custom claims are set correctly
2. User must logout and login again after claims are set
3. Check browser console for errors

### Issue: CSV upload fails

**Solution:**
1. Ensure student accounts exist in Firebase Auth
2. Verify email addresses in CSV match Firebase Auth
3. Check Firestore security rules allow admin writes

### Issue: Firebase configuration errors

**Solution:**
1. Double-check `firebase-config.js` has correct values
2. Ensure Firebase project is properly initialized
3. Check browser console for specific errors

## Security Recommendations

1. **Change default passwords** immediately after setup
2. **Enable 2FA** for admin accounts
3. **Use environment variables** for sensitive config in production
4. **Regularly review** Firestore security rules
5. **Monitor** Firebase Authentication logs
6. **Backup** Firestore data regularly

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Firebase Console logs
3. Check browser console for errors
4. Refer to Firebase documentation

## Next Steps

After successful setup:
1. Customize the UI to match your institute's branding
2. Add more subjects as needed
3. Implement additional features (export results, email notifications, etc.)
4. Set up automated backups
5. Configure custom domain for Firebase Hosting
