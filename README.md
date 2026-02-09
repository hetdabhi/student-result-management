# Student Result Management Web Application

A secure, minimal web-based system for managing student results with role-based access control.

## Features

- **Admin Portal**: Upload student results in bulk via CSV, manage marks
- **Student Portal**: View personal academic results securely
- **Role-Based Access**: Strict separation between admin and student capabilities
- **Firebase Backend**: Authentication, Firestore database, and hosting
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Firebase Authentication, Firestore Database
- **Hosting**: Firebase Hosting / Vercel
- **Testing**: Jest, fast-check (property-based testing)

## Project Structure

```
student-result-management/
├── public/
│   ├── index.html              # Login page
│   ├── admin/
│   │   └── dashboard.html      # Admin dashboard
│   ├── student/
│   │   └── dashboard.html      # Student dashboard
│   ├── css/
│   │   ├── login.css
│   │   ├── admin-dashboard.css
│   │   └── student-dashboard.css
│   └── js/
│       ├── firebase-config.js  # Firebase initialization
│       ├── auth.js             # Authentication service
│       ├── login.js            # Login logic
│       ├── csv-parser.js       # CSV parsing
│       ├── firestore-service.js # Firestore operations
│       ├── calculations.js     # Mark calculations
│       └── router.js           # Route protection
├── firestore.rules             # Security rules
├── firebase.json               # Firebase config
└── package.json
```

## 🚀 Deployment Guides

We have comprehensive deployment guides for every skill level:

### 📖 Start Here
**New to deployment?** → **[START_HERE.md](START_HERE.md)** - Choose the right guide for you

### 📚 Available Guides

1. **[COMPLETE_DEPLOYMENT_GUIDE.md](COMPLETE_DEPLOYMENT_GUIDE.md)** ⭐ RECOMMENDED
   - Complete step-by-step guide from scratch
   - Covers both Firebase and Vercel deployment
   - Includes troubleshooting
   - Time: 70-110 minutes

2. **[DEPLOYMENT_FLOWCHART.md](DEPLOYMENT_FLOWCHART.md)** 📊
   - Visual deployment flowchart
   - Time estimates for each phase
   - Critical checkpoints

3. **[COMMAND_REFERENCE.md](COMMAND_REFERENCE.md)** 💻
   - All commands in one place
   - Quick reference sheet
   - Top 10 most used commands

4. **[DEPLOYMENT_CHECKLIST_PRINTABLE.md](DEPLOYMENT_CHECKLIST_PRINTABLE.md)** ✅
   - Printable checklist
   - Track your progress
   - Space for notes

5. **[QUICKSTART.md](QUICKSTART.md)** ⚡
   - 10-minute quick start
   - For experienced users

6. **[SETUP.md](SETUP.md)** 📖
   - Detailed setup instructions
   - In-depth explanations

**See all documentation:** [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)

### 🎯 Quick Start

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Deploy security rules
firebase deploy --only firestore:rules

# 4. Test locally
firebase serve

# 5. Deploy to production
firebase deploy
```

See [COMPLETE_DEPLOYMENT_GUIDE.md](COMPLETE_DEPLOYMENT_GUIDE.md) for detailed instructions.

## Security

- Database-level security enforced via Firestore security rules
- Students can only read their own results
- Admins have full read/write access
- No public access to any data

## License

MIT
