FROM node:18.19.0

# Install dependencies
RUN apt-get update && apt-get install -y \
    libssl-dev curl git ca-certificates mariadb-client redis-tools \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm

USER node
WORKDIR /workspace