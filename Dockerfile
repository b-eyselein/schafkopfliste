FROM rust:buster as builder

WORKDIR /skl

COPY . .

RUN rustup default nightly && \
    cargo install --path .


FROM debian:buster-slim

RUN apt-get update && apt-get install -y postgresql-client

COPY --from=builder /usr/local/cargo/bin/schafkopfliste /usr/local/bin/schafkopfliste

