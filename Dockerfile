FROM alpine:latest

RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories && \
    apk update && \
    apk upgrade && \
    apk add bash rustup && \
    rustup-init -y && \
    source $HOME/.cargo/bin
#toolchain install nightly

WORKDIR /skl

COPY . .
