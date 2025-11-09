# GitHub Repository Setup Instructions

## Step 1: Create Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `ronit-bhatt-portfolio` (or your preferred name)
3. Description: "Portfolio website for Ronit Bhatt - Film Director, Cinematographer, Editor, Writer"
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 2: Connect Local Repository to GitHub

After creating the repository on GitHub, you'll see instructions. Run these commands in your terminal:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/ronit-bhatt-portfolio.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Alternative: Using SSH

If you prefer SSH:

```bash
git remote add origin git@github.com:YOUR_USERNAME/ronit-bhatt-portfolio.git
git branch -M main
git push -u origin main
```

## Current Status

✅ Git repository initialized
✅ Initial commit created (175 files, 14756 insertions)
✅ .gitignore configured
✅ Ready to push to GitHub

## Next Steps After Pushing

1. Your code will be on GitHub
2. You can set up GitHub Pages for hosting (if desired)
3. You can add collaborators
4. You can set up CI/CD workflows

