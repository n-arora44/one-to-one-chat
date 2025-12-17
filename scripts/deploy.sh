#!/bin/bash
# Build and deploy to GitHub Pages
npm run build
npx gh-pages -d build -t true
EOF && chmod +x scripts/deploy.sh