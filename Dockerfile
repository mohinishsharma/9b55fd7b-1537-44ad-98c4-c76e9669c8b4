FROM node:18.19.0-bookworm-slim AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN npm install -g pnpm
RUN pnpm install

COPY . .
RUN pnpm build

FROM node:18.19.0-bookworm-slim

WORKDIR /app

COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY --from=builder /app/dist ./dist
COPY data ./dist/data

EXPOSE 3000

CMD ["pnpm", "start"]
