# 🔧 CampIndia Troubleshooting Guide

This guide helps resolve common issues with the CampIndia camping platform.

## ✅ Issues Fixed

Based on your error logs, here are the issues that have been resolved:

### 1. Node.js Version Conflicts ✅ FIXED
**Problem**: Multiple packages showing `EBADENGINE` warnings due to Node.js 16.13.0
**Solution**: Upgraded to Node.js 22.18.0 using `nvs use 22`

### 2. Shell Configuration ✅ FIXED
**Problem**: `bash: setopt: command not found` and zsh recommendation
**Solution**: Updated to use zsh as default shell (modern macOS standard)

### 3. Dependency Installation ✅ FIXED
**Problem**: Engine compatibility warnings during npm install
**Solution**: Clean reinstall with Node.js 22 resolved all warnings

## 🚀 Quick Fix Commands

If you encounter any issues, run these commands in order:

```bash
# 1. Verify Node.js version
node --version  # Should show v22.x.x

# 2. If Node.js is wrong, fix it
nvs use 22  # or nvm use 22

# 3. Run our fix script
./scripts/fix-node-issues.sh

# 4. Verify everything is working
npm run verify

# 5. Start the development server
npm run dev
```

## 🔍 Common Issues & Solutions

### Issue: "Node.js 16.13.0" Error
```bash
# Solution 1: Use nvs (if you have it)
nvs use 22

# Solution 2: Use nvm (if you have it)
nvm use 22

# Solution 3: Restart terminal
# Close all terminals and open a new one
```

### Issue: Dependencies Not Installing
```bash
# Clean reinstall
npm run clean
npm install
```

### Issue: Development Server Won't Start
```bash
# Check Node.js version
node --version

# Fix and verify
npm run fix
npm run verify
```

### Issue: Port Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

### Issue: TypeScript Errors
```bash
# Check for missing types
npm run verify

# Reinstall if needed
npm run reinstall
```

## 📋 Verification Checklist

Run `npm run verify` to check:

- ✅ Node.js version (22.x.x)
- ✅ Essential project files
- ✅ Dependencies installed
- ✅ Mock data present
- ✅ TypeScript setup

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run check-node   # Check Node.js version
npm run setup        # Install dependencies
npm run start        # Alias for dev
npm run clean        # Clean build artifacts
npm run reinstall    # Clean and reinstall
npm run verify       # Verify setup
npm run fix          # Fix Node.js issues
```

## 🎯 Success Indicators

When everything is working correctly, you should see:

1. **Node.js Version**: v22.18.0 or higher
2. **No npm warnings**: Clean dependency installation
3. **Development server**: Starts on http://localhost:5173
4. **Homepage loads**: Beautiful camping platform interface
5. **No console errors**: Clean browser console

## 📞 Getting Help

If you're still having issues:

1. **Run diagnostics**: `npm run verify`
2. **Check logs**: Look for specific error messages
3. **Try fix script**: `./scripts/fix-node-issues.sh`
4. **Clean install**: `npm run reinstall`
5. **Restart terminal**: Close and reopen terminal

## 🎉 Success!

Once everything is working, you'll have:

- ✅ Production-ready React camping platform
- ✅ 4+ detailed camps with mock data
- ✅ PWA capabilities
- ✅ Responsive design
- ✅ TypeScript safety
- ✅ Modern development tools

## 📚 Next Steps

After fixing all issues:

1. **Explore the platform**: Browse camps, check features
2. **Review the code**: Understand the architecture
3. **Add more camps**: Extend the mock data
4. **Customize design**: Modify colors, fonts, layout
5. **Add features**: Implement booking, reviews, etc.

---

**Happy camping! 🏕️**
