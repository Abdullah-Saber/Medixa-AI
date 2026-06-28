# Team Git Workflow Guidelines

## 🔴 Critical Rules (MUST FOLLOW)

### 1. ALWAYS Pull Before Pushing
```bash
git pull origin main
# Do your work
git add .
git commit -m "clear message"
git push origin main
```

**Never push without pulling first!** This prevents conflicts and overwriting others' work.

---

### 2. Use Branches for New Features
```bash
git checkout -b feature/your-feature-name
# Do your work
git add .
git commit -m "clear message"
git push origin feature/your-feature-name
# Then create pull request on GitHub
```

**Why:** Keeps main branch stable and allows code review before merging.

---

### 3. NEVER Force Push to Main
```bash
# ❌ NEVER DO THIS
git push origin main --force
```

**Only force push if you're 100% sure what you're doing and have communicated with the team.**

---

### 4. Write Clear Commit Messages
```bash
# ✅ Good
git commit -m "feat: add patient dashboard with live monitor"

# ❌ Bad
git commit -m "ا"
git commit -m "Add files via upload"
git commit -m "fix stuff"
```

**Format:** `type: description`
- `feat:` - new feature
- `fix:` - bug fix
- `refactor:` - code refactoring
- `docs:` - documentation
- `test:` - tests

---

### 5. Resolve Conflicts Locally
If you get a conflict:
```bash
git pull origin main
# Resolve conflicts in your files
git add .
git commit -m "resolve merge conflicts"
git push origin main
```

**Don't force push to skip conflicts!**

---

## 🟡 Best Practices (SHOULD FOLLOW)

### 6. Check Repository Status Before Working
```bash
git status
git log --oneline -5
```

See what's been committed recently before starting your work.

---

### 7. Test Before Pushing
- Build the project
- Run tests
- Verify your changes work locally
- **Then push**

---

### 8. Communicate with Team
- Tell others what you're working on
- Use GitHub Issues or team chat to coordinate
- Avoid working on the same files simultaneously

---

### 9. Consistent Author Name
Configure your git identity:
```bash
git config --global user.name "Your Full Name"
git config --global user.email "your-email@example.com"
```

Use the same name/email across all commits.

---

### 10. Clean Up Your Branches
After merging:
```bash
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

---

## 🟢 Repository Structure (RESPECT THIS)

```
Medixa-AI/
├── backend/          # .NET backend work goes here
├── frontend/         # React frontend work goes here
├── docs/             # Documentation
├── design/           # Design files
└── tests/            # Test files
```

**Don't add files to root level!** Put them in the appropriate directory.

---

## 🚨 Emergency: If You Messed Up

### If you accidentally overwrote someone's work:
1. **STOP immediately**
2. **Contact the team**
3. **Don't force push again**
4. **We can recover from git reflog**

### If you have conflicts you can't resolve:
1. **Ask for help**
2. **Don't force push**
3. **Create a new branch and start fresh**

---

## 📝 Daily Workflow Checklist

### Before starting work:
- [ ] `git pull origin main`
- [ ] `git status` (check for uncommitted changes)
- [ ] `git log --oneline -5` (see recent commits)

### During work:
- [ ] Commit frequently with clear messages
- [ ] Test your changes locally
- [ ] Use feature branches for new work

### Before pushing:
- [ ] `git pull origin main` (one more time)
- [ ] Resolve any conflicts
- [ ] Test again
- [ ] `git push origin your-branch`

---

## 🎯 Quick Reference Card

```bash
# Start new feature
git checkout -b feature/my-feature

# Save work
git add .
git commit -m "feat: clear description"
git push origin feature/my-feature

# Update with latest changes
git pull origin main

# Merge to main (after review)
git checkout main
git pull origin main
git merge feature/my-feature
git push origin main
```

---

## 📚 Common Git Commands

### Viewing History
```bash
git log --oneline -10              # Last 10 commits
git log --all --graph --oneline    # Visual branch history
git status                         # Current state
```

### Branch Management
```bash
git branch                         # List branches
git checkout -b new-branch         # Create and switch to branch
git checkout main                  # Switch to main branch
git branch -d old-branch           # Delete local branch
```

### Undoing Changes
```bash
git checkout -- file.txt           # Undo file changes
git reset HEAD file.txt            # Unstage file
git reset --soft HEAD~1            # Undo last commit (keep changes)
git reset --hard HEAD~1            # Undo last commit (discard changes)
```

---

## ⚠️ What NOT to Do

- ❌ Don't force push to main without team approval
- ❌ Don't commit with unclear messages
- ❌ Don't work on main branch directly for new features
- ❌ Don't ignore merge conflicts
- ❌ Don't push untested code
- ❌ Don't add files to root directory
- ❌ Don't commit sensitive data (API keys, passwords)
- ❌ Don't commit node_modules, bin, obj folders

---

## 📞 Getting Help

If you're stuck:
1. Check this document first
2. Ask a teammate
3. Search Git documentation
4. Don't force push as a solution

---

**Remember:** Good Git practices prevent lost work, conflicts, and repository mess. Follow these guidelines to keep the project clean and collaborative.
