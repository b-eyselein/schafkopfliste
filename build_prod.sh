cd ui/ || exit

npm run build:prod

cd .. || exit

cargo build --release

cd target || exit

mkdir -p skl
cd skl || exit

cp -r ../../{start_docker_postgres.sh,db_init.sql,Rocket.toml,static} .
cp ../release/schafkopfliste .

tar -czvf ../skl.tar.gz .

rm -rf skl
