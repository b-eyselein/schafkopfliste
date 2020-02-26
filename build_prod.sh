APP_NAME=schafkopfliste

cd ui/ || exit

npm run build:prod

cd .. || exit

cargo build --release

cd target || exit

mkdir -p ${APP_NAME}
cd ${APP_NAME} || exit

cp -r ../../{start_docker_postgres.sh,db_init.sql,Rocket.toml,static,migrations} .
cp ../release/schafkopfliste .

cd .. || exit

tar -czvf ${APP_NAME}.tar.gz ${APP_NAME}/

rm -rf ${APP_NAME}
