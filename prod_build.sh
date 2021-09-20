BUILD_NAME=schafkopfliste

# verify that folder for static files and artifacts exists
mkdir -p static artifacts

# client production build
cd react-ui || exit

npm i

npm run build

cp -r build/* ../static

cd .. || exit

# server production build
docker run -i -t --rm \
  -w /app \
  -v "$(pwd):/app/" \
  rust:buster /bin/bash -c "ls -alR migrations && rustup override set nightly && cargo build --release && cp target/release/${BUILD_NAME} artifacts"

# create release archive TODO!
mkdir ${BUILD_NAME}

cp -r artifacts/${BUILD_NAME} Rocket.toml static ${BUILD_NAME}

tar -cvzf ${BUILD_NAME}.tar.gz ${BUILD_NAME}

rm -rf ${BUILD_NAME} artifacts
