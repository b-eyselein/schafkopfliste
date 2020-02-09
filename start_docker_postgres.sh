docker run -d --name some-postgres \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=1234 \
  -v $(pwd)/db_init.sql:/docker-entrypoint-initdb.d/db_init.sql \
  postgres