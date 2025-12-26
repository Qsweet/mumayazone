if grep "uuid('id')" /var/www/mqudah-docker/mqudah-professional-website/lib/db/schema.ts; then
  echo "✅ NEW CODE DETECTED: uuid('id') found"
else
  echo "❌ OLD CODE DECTECTED: uuid('id') NOT found"
  # Show the line to be sure
  grep "id" /var/www/mqudah-docker/mqudah-professional-website/lib/db/schema.ts | head -n 5
fi
