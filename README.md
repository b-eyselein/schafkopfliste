# Schafkopfliste

## Build (angular) client in watch mode 'into' server

```bash
cd ui

npm run build:dev
```

## Run server in dev/watch mode

```bash
cargo watch -i ui -i react-ui -i migrations -x fmt -x run
```
