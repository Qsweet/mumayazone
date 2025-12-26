#!/bin/bash
docker exec mqudah-docker-postgres-1 psql -U postgres -d mqudah_db -c "SELECT enumlabel FROM pg_enum JOIN pg_type ON pg_enum.enumtypid = pg_type.oid WHERE pg_type.typname = 'UserRole';"
docker exec mqudah-docker-postgres-1 psql -U postgres -d mqudah_db -c "SELECT role FROM users WHERE email = 'test.works.finally.8899@mumayazone.com';"
