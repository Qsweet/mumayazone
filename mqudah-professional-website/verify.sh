#!/bin/bash
TOKEN=$(node -e "console.log(require('./response.json').accessToken)")
echo "Testing with Token: ${TOKEN:0:10}..."
curl -I -H "Cookie: token=$TOKEN" http://localhost:3000/en/dashboard
