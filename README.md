### Getting started

#### Prerequisite
- Node.js v10 (LTS version)
- MongoDB running on localhost:27017

#### Run on localhost
Step 1: Copy `example.env` to a new file name `.env`, change host and DB information if you want.
Step 2: Run server
```bash
npm install
npm run dev
```

### Important remove all file .DS_Store from Mac
```bash
find . -name .DS_Store -print0 | xargs -0 git rm -f --ignore-unmatch
```

### Staging release
```bash
git checkout develop
npm version <patch|minor|major>
git push origin develop && git push --tags
git checkout release/staging
git merge origin develop
git push origin release/staging
npm run release:staging
git checkout develop
```
