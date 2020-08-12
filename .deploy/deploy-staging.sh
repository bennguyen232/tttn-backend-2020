#!/usr/bin/env bash
npm install
npm run build
rm -rf .deploy/bundle
mkdir .deploy/bundle
cp -R dist package.json package-lock.json ecosystem.json index.js .deploy/bundle
cd .deploy
tar -cvzf bundle.tar.gz bundle
cd ..

# Copy ecosystem.json to dist folder
# Zip dist folder
# Upload zip file to server
# Unzip new code and restart pm2

chmod 400 .deploy/cravingz-staging.pem
#
scp -i .deploy/cravingz-staging.pem .deploy/bundle.tar.gz ubuntu@3.22.185.174:/var/www/cravingz-api
#
ssh -i .deploy/cravingz-staging.pem ubuntu@3.22.185.174 << EOF
 cd /var/www/cravingz-api
 tar -xvzf bundle.tar.gz
 cd bundle
 npm install --production
 pm2 startOrRestart ecosystem.json --env production
EOF
