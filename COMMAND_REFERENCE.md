# Command Reference Sheet

Quick reference for all commands needed during deployment.

---

## 📦 Installation Commands

### Install Node.js
Download from: https://nodejs.org/

### Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Install Vercel CLI
```bash
npm install -g vercel
```

### Verify Installations
```bash
node --version
npm --version
firebase --version
vercel --version
```

---

## 🔥 Firebase Commands

### Login & Setup
```bash
# Login to Firebase
firebase login

# Initialize Firebase in project
firebase init

# Select Firestore and Hosting when prompted
```

### Deploy Commands
```bash
# Deploy everything (hosting + rules + indexes)
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# Deploy only Firestore rules
firebase deploy --only firestore:rules

# Deploy only Firestore indexes
firebase deploy --only firestore:indexes

# Deploy hosting and rules
firebase deploy --only hosting,firestore:rules
```

### Local Development
```bash
# Serve locally on port 5000
firebase serve

# Serve on custom port
firebase serve --port 8080

# Open Firebase emulator
firebase emulators:start
```

### Project Management
```bash
# List Firebase projects
firebase projects:list

# Use specific project
firebase use project-id

# Add new project alias
firebase use --add
```

### Logs & Debugging
```bash
# View hosting logs
firebase hosting:channel:list

# View function logs (if using functions)
firebase functions:log
```

---

## ▲ Vercel Commands

### Login & Setup
```bash
# Login to Vercel
vercel login

# Link to existing project
vercel link

# Pull environment variables
vercel env pull
```

### Deploy Commands
```bash
# Deploy to preview (development)
vercel

# Deploy to production
vercel --prod

# Deploy with specific name
vercel --name my-project

# Deploy from specific directory
vercel ./public
```

### Project Management
```bash
# List all projects
vercel list

# Remove project
vercel remove project-name

# View project info
vercel inspect
```

### Logs & Debugging
```bash
# View deployment logs
vercel logs

# View logs for specific deployment
vercel logs deployment-url

# Follow logs in real-time
vercel logs --follow
```

### Domain Management
```bash
# List domains
vercel domains list

# Add domain
vercel domains add example.com

# Remove domain
vercel domains rm example.com
```

---

## 🔧 Admin Script Commands

### Setup
```bash
# Navigate to scripts folder
cd scripts

# Install dependencies
npm install

# Go back to root
cd ..
```

### Set User Roles
```bash
# Set admin role
node scripts/set-admin-claims.js admin@institute.edu admin

# Set student role
node scripts/set-admin-claims.js student@example.com student

# Batch set roles (create your own script)
node scripts/batch-set-roles.js
```

---

## 🧪 Testing Commands

### Local Testing
```bash
# Start local server
firebase serve

# Open in browser
# http://localhost:5000
```

### Check for Errors
```bash
# Check Firebase configuration
firebase projects:list

# Validate Firestore rules
firebase firestore:rules:validate

# Test Firestore rules (requires emulator)
firebase emulators:start --only firestore
```

---

## 📁 File Navigation Commands

### Windows (CMD)
```cmd
# Change directory
cd folder-name

# Go back one level
cd ..

# List files
dir

# Create folder
mkdir folder-name

# Delete file
del file-name

# Copy file
copy source.txt destination.txt
```

### Mac/Linux (Terminal)
```bash
# Change directory
cd folder-name

# Go back one level
cd ..

# List files
ls -la

# Create folder
mkdir folder-name

# Delete file
rm file-name

# Copy file
cp source.txt destination.txt
```

---

## 🔍 Debugging Commands

### Check Firebase Status
```bash
# Check if logged in
firebase login:list

# Check current project
firebase use

# Check hosting status
firebase hosting:channel:list
```

### Check Node/NPM
```bash
# Check Node version
node --version

# Check NPM version
npm --version

# Check installed packages
npm list -g --depth=0

# Clear NPM cache
npm cache clean --force
```

### Network Debugging
```bash
# Check if port is in use (Windows)
netstat -ano | findstr :5000

# Check if port is in use (Mac/Linux)
lsof -i :5000

# Kill process on port (Windows)
taskkill /PID process-id /F

# Kill process on port (Mac/Linux)
kill -9 process-id
```

---

## 🔐 Security Commands

### Firebase Security
```bash
# Deploy security rules
firebase deploy --only firestore:rules

# Validate rules syntax
firebase firestore:rules:validate

# Test rules with emulator
firebase emulators:start --only firestore
```

### Check File Permissions
```bash
# Windows - Check file properties
attrib file-name

# Mac/Linux - Check permissions
ls -l file-name

# Mac/Linux - Change permissions
chmod 600 serviceAccountKey.json
```

---

## 📊 Monitoring Commands

### Firebase Usage
```bash
# Check Firestore usage (via console)
# Go to: console.firebase.google.com
# Navigate to: Usage and billing

# Check authentication usage
# Go to: Authentication → Usage
```

### Vercel Analytics
```bash
# View deployment analytics
vercel inspect deployment-url

# View project analytics (via dashboard)
# Go to: vercel.com/dashboard
```

---

## 🚀 Quick Deployment Workflow

### First Time Setup
```bash
# 1. Install tools
npm install -g firebase-tools vercel

# 2. Login
firebase login
vercel login

# 3. Initialize
firebase init

# 4. Deploy rules
firebase deploy --only firestore:rules,firestore:indexes

# 5. Create users (via Firebase Console)

# 6. Set admin claims
cd scripts
npm install
cd ..
node scripts/set-admin-claims.js admin@institute.edu admin

# 7. Test locally
firebase serve

# 8. Deploy
firebase deploy
vercel --prod
```

### Regular Updates
```bash
# 1. Make changes to code

# 2. Test locally
firebase serve

# 3. Deploy to Firebase
firebase deploy

# 4. Deploy to Vercel (if using)
vercel --prod
```

---

## 🆘 Emergency Commands

### Rollback Deployment
```bash
# Firebase - Rollback to previous version
firebase hosting:clone source-site-id:channel-id target-site-id:channel-id

# Vercel - Rollback to previous deployment
vercel rollback deployment-url
```

### Clear Cache
```bash
# Clear NPM cache
npm cache clean --force

# Clear Firebase cache
firebase logout
firebase login

# Clear browser cache
# Chrome: Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
```

### Reset Project
```bash
# Remove Firebase initialization
rm -rf .firebase
rm .firebaserc

# Reinitialize
firebase init

# Remove Vercel link
rm -rf .vercel

# Relink
vercel link
```

---

## 📝 Useful Aliases (Optional)

Add these to your shell profile for quick access:

### Bash/Zsh (~/.bashrc or ~/.zshrc)
```bash
# Firebase aliases
alias fbd="firebase deploy"
alias fbs="firebase serve"
alias fbr="firebase deploy --only firestore:rules"

# Vercel aliases
alias vd="vercel --prod"
alias vp="vercel"

# Project aliases
alias serve="firebase serve"
alias deploy="firebase deploy && vercel --prod"
```

### Windows PowerShell (Profile)
```powershell
# Firebase aliases
function fbd { firebase deploy }
function fbs { firebase serve }
function fbr { firebase deploy --only firestore:rules }

# Vercel aliases
function vd { vercel --prod }
function vp { vercel }
```

---

## 🎯 Most Used Commands (Top 10)

1. `firebase login` - Login to Firebase
2. `firebase serve` - Test locally
3. `firebase deploy` - Deploy to production
4. `firebase deploy --only firestore:rules` - Update security rules
5. `node scripts/set-admin-claims.js email role` - Set user roles
6. `vercel` - Deploy to Vercel preview
7. `vercel --prod` - Deploy to Vercel production
8. `firebase projects:list` - List Firebase projects
9. `firebase use project-id` - Switch Firebase project
10. `npm install -g firebase-tools` - Update Firebase CLI

---

## 📞 Get Help

### Command Help
```bash
# Firebase help
firebase --help
firebase deploy --help

# Vercel help
vercel --help
vercel deploy --help

# NPM help
npm help
```

### Documentation Links
- Firebase CLI: https://firebase.google.com/docs/cli
- Vercel CLI: https://vercel.com/docs/cli
- Node.js: https://nodejs.org/docs
- NPM: https://docs.npmjs.com/

---

**Pro Tip:** Bookmark this page for quick reference during deployment! 🔖
