# Fetch content
curl -s -b "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzYmIyMGFhOS0wNmI1LTQ2MjEtYjc3My1jY2M3ZGMzMWRhYWUiLCJlbWFpbCI6InRlc3Qud29ya3MuZmluYWxseS45OTIyQG11bWF5YXpvbmUuY29tIiwicm9sZSI6IlNUVURFTlQiLCJpYXQiOjE3NjY2NjQ4NzZ9.V2oQMTtL_OyMVopBjmAM77zTfrRkorX3rWyqAhP_5mU" http://localhost:3000/en/dashboard > dashboard.html

if grep -q "Student Dashboard" dashboard.html; then
  echo "✅ PASS: Found 'Student Dashboard'"
else
  echo "❌ FAIL: 'Student Dashboard' not found"
fi

if grep -q "Sign in" dashboard.html; then
  echo "⚠️ WARNING: Found 'Sign in' (Did we redirect?)"
else
  echo "✅ PASS: 'Sign in' not found"
fi

echo "--- CONTENT PREVIEW ---"
head -n 20 dashboard.html
