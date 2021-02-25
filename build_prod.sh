APP_NAME=schafkopfliste

# build client
cd ui || exit
npm run build:prod

# build server
cd .. || exit
cargo build --release

# package files
mkdir -p target/${APP_NAME}
cp -r docker-compose.yaml db_init.sql Rocket.toml static target/release/schafkopfliste target/${APP_NAME}

cd target || exit
tar -czvf ${APP_NAME}.tar.gz ${APP_NAME}/

rm -rf ${APP_NAME}

cd .. || exit
