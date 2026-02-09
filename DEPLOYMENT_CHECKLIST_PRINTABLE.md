# 📋 Deployment Checklist - Printable Version

Print this checklist and check off items as you complete them!

---

## ✅ Phase 1: Prerequisites (15 minutes)

- [ ] Node.js installed and verified (`node --version`)
- [ ] NPM installed and verified (`npm --version`)
- [ ] Firebase CLI installed (`npm install -g firebase-tools`)
- [ ] Vercel CLI installed (optional) (`npm install -g vercel`)
- [ ] Google account created/ready
- [ ] Vercel account created (if using Vercel)
- [ ] Code editor installed (VS Code recommended)

**Notes:**
```
Node version: _____________
NPM version: _____________
Firebase CLI version: _____________
```

---

## ✅ Phase 2: Firebase Backend Setup (20 minutes)

### Create Firebase Project
- [ ] Opened Firebase Console (console.firebase.google.com)
- [ ] Clicked "Add project"
- [ ] Project name: `student-result-management`
- [ ] Disabled Google Analytics
- [ ] Project created successfully

**Project ID:** `_______________________________`

### Enable Authentication
- [ ] Navigated to Authentication
- [ ] Clicked "Get started"
- [ ] Enabled Email/Password sign-in method
- [ ] Saved settings

### Create Firestore Database
- [ ] Navigated to Firestore Database
- [ ] Clicked "Create database"
- [ ] Selected "Production mode"
- [ ] Chose location: `_______________________________`
- [ ] Database created successfully

### Get Firebase Configuration
- [ ] Clicked web icon (`</>`) in Project Overview
- [ ] Registered app: `student-result-web`
- [ ] Copied Firebase config object
- [ ] Saved config in safe place

**Firebase Config Saved:** ✓ / ✗

### Download Service Account Key
- [ ] Went to Project Settings → Service accounts
- [ ] Clicked "Generate new private key"
- [ ] Downloaded JSON file
- [ ] Renamed to `serviceAccountKey.json`
- [ ] Saved in secure location

**Service Key Downloaded:** ✓ / ✗

---

## ✅ Phase 3: Local Configuration (10 minutes)

### Update Firebase Config
- [ ] Opened `public/js/firebase-config.js`
- [ ] Pasted Firebase config from Phase 2
- [ ] Verified all fields are correct
- [ ] Saved file

### Update Project ID
- [ ] Opened `.firebaserc`
- [ ] Replaced `YOUR_PROJECT_ID` with actual project ID
- [ ] Saved file

### Deploy Security Rules
- [ ] Opened terminal in project root
- [ ] Ran `firebase login`
- [ ] Logged in successfully
- [ ] Ran `firebase init`
- [ ] Selected Firestore and Hosting
- [ ] Accepted default file names
- [ ] Ran `firebase deploy --only firestore:rules`
- [ ] Rules deployed successfully ✓
- [ ] Ran `firebase deploy --only firestore:indexes`
- [ ] Indexes deployed successfully ✓

**Deployment Output:**
```
Rules: ✓ / ✗
Indexes: ✓ / ✗
```

---

## ✅ Phase 4: Create User Accounts (20 minutes)

### Create Admin Account

#### In Firebase Console
- [ ] Went to Authentication → Users
- [ ] Clicked "Add user"
- [ ] Email: `admin@institute.edu`
- [ ] Password: `Admin@123`
- [ ] User created successfully
- [ ] **Copied UID:** `_______________________________`

#### Set Admin Custom Claims
- [ ] Moved `serviceAccountKey.json` to `scripts/` folder
- [ ] Ran `cd scripts`
- [ ] Ran `npm install`
- [ ] Ran `cd ..`
- [ ] Ran `node scripts/set-admin-claims.js admin@institute.edu admin`
- [ ] Claims set successfully ✓

#### Create Admin Firestore Document
- [ ] Went to Firestore Database
- [ ] Created collection: `users`
- [ ] Document ID: [pasted admin UID]
- [ ] Added field: `email` = `admin@institute.edu`
- [ ] Added field: `role` = `admin`
- [ ] Added field: `name` = `System Administrator`
- [ ] Saved document

### Create Student Accounts

#### Student 1: John Doe
- [ ] Created in Firebase Auth
- [ ] Email: `john.doe@example.com`
- [ ] Password: `Student@123`
- [ ] **UID:** `_______________________________`
- [ ] Set claims: `node scripts/set-admin-claims.js john.doe@example.com student`
- [ ] Created Firestore document with fields:
  - [ ] email: `john.doe@example.com`
  - [ ] role: `student`
  - [ ] studentId: `S001`
  - [ ] name: `John Doe`

#### Student 2: Jane Smith (Optional)
- [ ] Created in Firebase Auth
- [ ] Email: `jane.smith@example.com`
- [ ] Password: `Student@123`
- [ ] **UID:** `_______________________________`
- [ ] Set claims
- [ ] Created Firestore document (S002)

#### Additional Students
- [ ] Student 3 created (S003)
- [ ] Student 4 created (S004)
- [ ] Student 5 created (S005)

**Total Students Created:** `_______`

---

## ✅ Phase 5: Local Testing (15 minutes)

### Start Local Server
- [ ] Ran `firebase serve`
- [ ] Server started on port 5000
- [ ] Opened `http://localhost:5000` in browser
- [ ] Login page displayed correctly

### Test Admin Login
- [ ] Entered email: `admin@institute.edu`
- [ ] Entered password: `Admin@123`
- [ ] Clicked "Login"
- [ ] Redirected to Admin Dashboard ✓
- [ ] Dashboard loaded correctly ✓

### Test CSV Upload
- [ ] Clicked "Download Template" button
- [ ] Template downloaded successfully
- [ ] Uploaded template CSV file
- [ ] Upload progress showed
- [ ] Success message displayed
- [ ] Number of records uploaded: `_______`

### Test Student Login
- [ ] Logged out from admin
- [ ] Entered email: `john.doe@example.com`
- [ ] Entered password: `Student@123`
- [ ] Clicked "Login"
- [ ] Redirected to Student Dashboard ✓
- [ ] Student info displayed correctly ✓
- [ ] Results displayed correctly ✓
- [ ] Only own results visible ✓

### Test Security
- [ ] Tried accessing admin dashboard as student (blocked ✓)
- [ ] Tried accessing without login (redirected ✓)
- [ ] Verified data isolation ✓

### Test Mobile Responsiveness
- [ ] Tested on mobile device or browser dev tools
- [ ] Login page responsive ✓
- [ ] Admin dashboard responsive ✓
- [ ] Student dashboard responsive ✓

**Local Testing Status:** PASS / FAIL

---

## ✅ Phase 6: Firebase Deployment (10 minutes)

### Deploy to Firebase Hosting
- [ ] Ran `firebase deploy`
- [ ] Deployment started
- [ ] Hosting deployed ✓
- [ ] Rules deployed ✓
- [ ] Indexes deployed ✓
- [ ] Deployment completed successfully

**Firebase Hosting URL:** `_______________________________`

### Test Production (Firebase)
- [ ] Opened Firebase Hosting URL
- [ ] Login page loads ✓
- [ ] Admin login works ✓
- [ ] CSV upload works ✓
- [ ] Student login works ✓
- [ ] Results display correctly ✓
- [ ] Mobile responsive ✓
- [ ] No console errors ✓

**Firebase Production Status:** PASS / FAIL

---

## ✅ Phase 7: Vercel Deployment (Optional, 10 minutes)

### Deploy to Vercel
- [ ] Ran `vercel login`
- [ ] Logged in successfully
- [ ] Ran `vercel`
- [ ] Answered prompts:
  - [ ] Set up and deploy: Y
  - [ ] Project name: `student-result-management`
  - [ ] Directory: `./`
  - [ ] Override settings: N
- [ ] Deployment completed successfully

**Vercel URL:** `_______________________________`

### Test Production (Vercel)
- [ ] Opened Vercel URL
- [ ] Login page loads ✓
- [ ] Admin login works ✓
- [ ] CSV upload works ✓
- [ ] Student login works ✓
- [ ] Results display correctly ✓
- [ ] Mobile responsive ✓
- [ ] No console errors ✓

**Vercel Production Status:** PASS / FAIL

---

## ✅ Phase 8: Post-Deployment (15 minutes)

### Security Checks
- [ ] Changed admin password from default
- [ ] Changed student passwords from default
- [ ] Verified `serviceAccountKey.json` not in Git
- [ ] Verified `.gitignore` includes service key
- [ ] Reviewed Firestore security rules
- [ ] Tested unauthorized access (blocked ✓)

### Monitoring Setup
- [ ] Checked Firebase Console → Authentication
- [ ] Checked Firebase Console → Firestore usage
- [ ] Checked Firebase Console → Hosting traffic
- [ ] Set up Firebase budget alerts (optional)
- [ ] Bookmarked Firebase Console
- [ ] Bookmarked Vercel Dashboard (if using)

### Documentation
- [ ] Updated README.md with production URL
- [ ] Created user guide for admins
- [ ] Created user guide for students
- [ ] Documented any custom changes
- [ ] Saved all credentials securely

### Backup Strategy
- [ ] Planned Firestore backup schedule
- [ ] Documented backup procedure
- [ ] Tested backup/restore (optional)

---

## ✅ Phase 9: Go Live (5 minutes)

### Final Checks
- [ ] All tests passing
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Security working
- [ ] Performance acceptable

### Notify Users
- [ ] Sent email to admin users
- [ ] Sent email to student users
- [ ] Provided login instructions
- [ ] Provided support contact

### Launch!
- [ ] Application is LIVE! 🎉
- [ ] Monitoring active
- [ ] Support ready

**Launch Date:** `_______________________________`
**Launch Time:** `_______________________________`

---

## 📊 Deployment Summary

| Item | Status | URL/Details |
|------|--------|-------------|
| Firebase Project | ✓ / ✗ | |
| Authentication | ✓ / ✗ | |
| Firestore | ✓ / ✗ | |
| Security Rules | ✓ / ✗ | |
| Admin Account | ✓ / ✗ | |
| Student Accounts | ✓ / ✗ | Count: ___ |
| Local Testing | ✓ / ✗ | |
| Firebase Hosting | ✓ / ✗ | |
| Vercel Hosting | ✓ / ✗ | |
| Production Testing | ✓ / ✗ | |

---

## 🚨 Issues Encountered

Document any issues you encountered and how you resolved them:

**Issue 1:**
```
Problem: _________________________________________________
Solution: ________________________________________________
```

**Issue 2:**
```
Problem: _________________________________________________
Solution: ________________________________________________
```

**Issue 3:**
```
Problem: _________________________________________________
Solution: ________________________________________________
```

---

## 📝 Notes

Additional notes or observations:

```
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________
```

---

## ✅ Final Sign-Off

- [ ] All phases completed
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Users notified
- [ ] Monitoring active
- [ ] Application is production-ready

**Deployed By:** `_______________________________`
**Date:** `_______________________________`
**Signature:** `_______________________________`

---

**🎉 CONGRATULATIONS! YOUR APPLICATION IS LIVE! 🎉**

---

## 📞 Support Contacts

**Firebase Support:** https://firebase.google.com/support
**Vercel Support:** https://vercel.com/support
**Project Admin:** `_______________________________`
**Technical Lead:** `_______________________________`

---

**Keep this checklist for your records and future deployments!**
