if grep "text('user_id')" /var/www/mqudah-docker/mqudah-professional-website/lib/db/schema.ts; then
  echo "✅ REVERT CONFIRMED: text('user_id') found"
else
  echo "❌ REVERT FAILED: text('user_id') NOT found"
  grep "user_id" /var/www/mqudah-docker/mqudah-professional-website/lib/db/schema.ts | head -n 5
fi
