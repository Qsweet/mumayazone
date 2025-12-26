docker exec mqudah-docker-postgres-1 psql -U postgres -d mqudah_db -c "ALTER TABLE lesson_progress ALTER COLUMN user_id TYPE text;"
